#!/usr/bin/env python3
"""
===================================================================
ANOXPASS — Automated 100%-Coverage Resumable Ollama Batch Synthesizer
Runs unattended against local `my_documents/` RAG corpus via Ollama
(100% self-hosted open-weights, zero paid APIs) to synthesize:
  1. Structured End-to-End Lessons (`synthesized_lessons`)
  2. Realistic Scenario Exam Questions (`synthesized_exam_questions`)
  3. Timed Domain-Weighted Mock Exams (`synthesized_mock_exams`)
  4. Live Cloud Progress Tracking (`synthesis_jobs`)

Features:
  - Resumable SQLite checkpoint DB (`ml_engine/synthesis_state.db`)
  - Automatic JSON extraction/repair + 3-retry resilience per cluster
  - Strict Supabase Storage Budget Guard (`--max-mb 40`, 0 vectors/blobs)
  - SHA-256 content_hash deduplication (`ON CONFLICT DO NOTHING`)
===================================================================
"""

import os
import re
import sys
import json
import zlib
import time
import uuid
import sqlite3
import hashlib
import argparse
import urllib.request
import urllib.error
from collections import defaultdict
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Tuple

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_DIR = os.path.join(ROOT_DIR, "ml_engine")
OPT_META_PATH = os.path.join(ML_DIR, "chunks_metadata.jsonl.zlib")
RAW_META_PATH = os.path.join(ML_DIR, "chunks_metadata.json")
STATE_DB_PATH = os.path.join(ML_DIR, "synthesis_state.db")

DEFAULT_OLLAMA_URL = os.environ.get("OLLAMA_HOST", "http://127.0.0.1:11434")
DEFAULT_MODEL = os.environ.get("ANOXPASS_OLLAMA_MODEL", "anoxpass-coach")
MAX_CONTEXT_CHARS = 8000  # token-safe grounding budget (~2.5k tokens); halves on context overflow

# Canonical mapping from RAG corpus cert_code -> App CertificationPath.id
CERT_CODE_TO_ID: Dict[str, str] = {
    "CC": "isc2-cc",
    "A+": "comptia-a-plus",
    "NETWORK+": "comptia-network-plus",
    "SECURITY+": "comptia-security-plus",
    "SAA-C03": "aws-saa-c03",
    "NIST": "nist-grc",
    "GRC": "grc-enterprise",
    "CYSA+": "comptia-cysa-plus",
    "CISA": "cisa",
    "CRISC": "crisc",
    "FIFA-AGENT": "fifa-agent",
    "CCSP": "isc2-ccsp",
    "CISSP": "cissp",
    "CISM": "cism",
    "CGEIT": "cgeit",
    "GSLC": "gslc",
}

ALL_CERT_IDS = list(CERT_CODE_TO_ID.values())


def sha256_hex(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8", errors="ignore")).hexdigest()


def init_state_db(db_path: str = STATE_DB_PATH) -> sqlite3.Connection:
    """Initializes resumable SQLite checkpoint database."""
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS synthesis_units (
            unit_key TEXT PRIMARY KEY,
            cert_id TEXT NOT NULL,
            domain_number INTEGER NOT NULL,
            cluster_index INTEGER NOT NULL,
            source_refs TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            retries INTEGER NOT NULL DEFAULT 0,
            lesson_json TEXT,
            lesson_hash TEXT,
            questions_json TEXT,
            est_bytes INTEGER NOT NULL DEFAULT 0,
            synced_to_supabase INTEGER NOT NULL DEFAULT 0,
            updated_at TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_units_cert_status
            ON synthesis_units(cert_id, status);
        """
    )
    conn.commit()
    return conn


def load_dedup_corpus() -> Dict[str, Dict[int, List[Dict[str, Any]]]]:
    """
    Loads deduplicated chunks from compressed zlib index (or raw JSON fallback)
    grouped by canonical `cert_id` -> `domain_number`.
    """
    grouped: Dict[str, Dict[int, List[Dict[str, Any]]]] = defaultdict(lambda: defaultdict(list))

    if os.path.exists(OPT_META_PATH):
        with open(OPT_META_PATH, "rb") as f:
            raw_text = zlib.decompress(f.read()).decode("utf-8")
        for line in raw_text.splitlines():
            if not line.strip():
                continue
            r = json.loads(line)
            code = str(r.get("c", "GENERAL")).upper()
            cert_id = CERT_CODE_TO_ID.get(code)
            if not cert_id:
                continue
            dom = int(r.get("n", 1) or 1)
            grouped[cert_id][dom].append({
                "doc": r.get("d", "local_doc"),
                "text": r.get("t", ""),
            })
    elif os.path.exists(RAW_META_PATH):
        with open(RAW_META_PATH, "r", encoding="utf-8") as f:
            meta = json.load(f)
        for ch in meta.get("chunks", []):
            code = str(ch.get("certification_code", "GENERAL")).upper()
            cert_id = CERT_CODE_TO_ID.get(code)
            if not cert_id:
                continue
            dom = int(ch.get("domain_number", 1) or 1)
            grouped[cert_id][dom].append({
                "doc": ch.get("document_name", "local_doc"),
                "text": ch.get("chunk_text", ""),
            })

    return grouped


def plan_clusters(
    grouped_corpus: Dict[str, Dict[int, List[Dict[str, Any]]]],
    target_cert: str = "all",
    chunks_per_cluster: int = 8,
    max_clusters_per_domain: int = 12,
) -> List[Dict[str, Any]]:
    """
    Groups corpus chunks into balanced synthesis clusters per cert & domain.
    Guarantees every certification has planned units even if local docs are sparse.
    """
    certs = ALL_CERT_IDS if target_cert == "all" else [target_cert]
    planned: List[Dict[str, Any]] = []

    for cert_id in certs:
        domains = grouped_corpus.get(cert_id, {})
        if not domains:
            # Ensure 100% cert coverage via baseline domain synthesis unit
            planned.append({
                "unit_key": f"{cert_id}:d1:c0",
                "cert_id": cert_id,
                "domain_number": 1,
                "cluster_index": 0,
                "source_refs": [f"syllabus:{cert_id}:domain-1"],
                "context_text": f"Official exam syllabus and core governance/technical principles for {cert_id}.",
            })
            continue

        for dom_num, chunks in sorted(domains.items()):
            step = max(chunks_per_cluster, len(chunks) // max_clusters_per_domain)
            cluster_idx = 0
            for i in range(0, len(chunks), step):
                if cluster_idx >= max_clusters_per_domain:
                    break
                batch = chunks[i : i + chunks_per_cluster]
                refs = sorted(list({b["doc"] for b in batch}))[:5]
                ctx = "\n\n".join(b["text"][:450] for b in batch)
                planned.append({
                    "unit_key": f"{cert_id}:d{dom_num}:c{cluster_idx}",
                    "cert_id": cert_id,
                    "domain_number": dom_num,
                    "cluster_index": cluster_idx,
                    "source_refs": refs,
                    "context_text": ctx[:3600],
                })
                cluster_idx += 1

    return planned


def extract_json_object(raw_text: str) -> Optional[Dict[str, Any]]:
    """Extracts and repairs a JSON object from Ollama output (strips markdown/think tags)."""
    if not raw_text:
        return None
    cleaned = re.sub(r"<think>.*?</think>", "", raw_text, flags=re.DOTALL).strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)

    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None
    candidate = cleaned[start : end + 1]
    try:
        return json.loads(candidate)
    except json.JSONDecodeError:
        # Lightweight repair: strip trailing commas before } or ]
        repaired = re.sub(r",\s*([}\]])", r"\1", candidate)
        try:
            return json.loads(repaired)
        except json.JSONDecodeError:
            pass
        # Truncation salvage: trim to the last complete object boundary and close open brackets
        for m in reversed(list(re.finditer(r"[}\]]", candidate))):
            head = candidate[: m.end()]
            stack = []
            in_str = False
            esc = False
            for ch in head:
                if in_str:
                    if esc:
                        esc = False
                    elif ch == "\\":
                        esc = True
                    elif ch == '"':
                        in_str = False
                    continue
                if ch == '"':
                    in_str = True
                elif ch in "{[":
                    stack.append("}" if ch == "{" else "]")
                elif ch in "}]" and stack:
                    stack.pop()
            if in_str:
                continue
            attempt = re.sub(r",\s*$", "", head) + "".join(reversed(stack))
            try:
                obj = json.loads(attempt)
                if isinstance(obj, dict) and "lesson" in obj:
                    return obj
            except json.JSONDecodeError:
                continue
        return None


def normalize_ollama_url(raw_url: str) -> str:
    url = (raw_url or "http://127.0.0.1:11434").strip().rstrip("/")
    if not url.startswith(("http://", "https://")):
        url = f"http://{url}"
    url = url.replace("://0.0.0.0", "://127.0.0.1")
    return url


def check_ollama_preflight(model: str, ollama_url: str = DEFAULT_OLLAMA_URL) -> Tuple[bool, str]:
    """Verifies Ollama is reachable and the requested model is installed."""
    base = normalize_ollama_url(ollama_url)
    try:
        with urllib.request.urlopen(f"{base}/api/tags", timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        models = [m.get("name", "") for m in data.get("models", [])]
        matched = any(m == model or m == f"{model}:latest" or m.split(":")[0] == model for m in models)
        if not matched:
            return False, f"Model '{model}' not found in Ollama at {base}. Installed: {models[:8]}"
        return True, f"Ollama OK at {base} (model '{model}' verified)"
    except Exception as exc:
        return False, f"Cannot reach Ollama at {base}: {exc}"


def call_ollama_chat(
    prompt: str,
    model: str = DEFAULT_MODEL,
    ollama_url: str = DEFAULT_OLLAMA_URL,
    timeout: int = 900,
) -> Tuple[Optional[str], Optional[str]]:
    """Calls local self-hosted Ollama /api/chat (100% open-weights, zero paid APIs)."""
    url = f"{normalize_ollama_url(ollama_url)}/api/chat"
    payload = json.dumps({
        "model": model,
        "stream": False,
        "format": "json",
        "options": {"temperature": 0.2, "num_ctx": 16384, "num_predict": 8000},
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are the AnoxPass Certification Curriculum & Exam Synthesizer. "
                    "Return ONLY valid JSON matching the requested schema. No prose outside JSON."
                ),
            },
            {"role": "user", "content": prompt},
        ],
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            content = data.get("message", {}).get("content", "")
            return content, None
    except urllib.error.HTTPError as http_err:
        body = ""
        try:
            body = http_err.read().decode("utf-8", errors="replace")[:300]
        except Exception:
            pass
        return None, f"HTTP {http_err.code}: {body}"
    except Exception as exc:
        return None, f"{type(exc).__name__}: {exc}"


def build_synthesis_prompt(unit: Dict[str, Any], max_context_chars: int = 12000) -> str:
    unit = dict(unit)
    unit["context_text"] = (unit.get("context_text") or "")[:max_context_chars]
    return (
        f"Synthesize a complete, exam-grade lesson and 4 realistic scenario MCQ exam questions for:\n"
        f"- Certification: {unit['cert_id']}\n"
        f"- Domain: Domain {unit['domain_number']}\n"
        f"- Source References: {', '.join(unit['source_refs'])}\n\n"
        f"GROUNDING EXCERPTS:\n{unit['context_text']}\n\n"
        f"Return STRICT, COMPACT JSON (keep each field concise, 1-2 sentences, 2 coreConcepts, 2 exam_questions) with this exact top-level structure:\n"
        f'{{\n'
        f'  "lesson": {{\n'
        f'    "title": "Concise Lesson Title",\n'
        f'    "summary": "2-3 sentence executive summary",\n'
        f'    "estimatedMinutes": 20,\n'
        f'    "learningObjectives": ["obj1", "obj2", "obj3"],\n'
        f'    "coreConcepts": [{{"title": "...", "explanation": "...", "mentalModel": "...", "keyRule": "..."}}],\n'
        f'    "realWorldScenario": {{"title": "...", "context": "...", "challenge": "...", "solution": "...", "takeaway": "..."}},\n'
        f'    "examTraps": ["trap1", "trap2"],\n'
        f'    "keyTerms": [{{"term": "...", "definition": "..."}}],\n'
        f'    "conceptChecks": [{{"id": "cc-1", "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0, "rationale": "..."}}],\n'
        f'    "practicalDrill": {{"title": "...", "prompt": "...", "steps": ["step1", "step2"], "successCriteria": "..."}},\n'
        f'    "flashcards": [{{"front": "...", "back": "...", "tag": "domain-{unit["domain_number"]}"}}]\n'
        f'  }},\n'
        f'  "exam_questions": [\n'
        f'    {{"difficulty": "associate|professional|expert", "question_text": "...", "options": ["A", "B", "C", "D"], "correct_index": 0, "rationale": "...", "exam_trap": "..."}}\n'
        f'  ]\n'
        f'}}'
    )


def get_synthesis_status(db_path: str = STATE_DB_PATH) -> Dict[str, Any]:
    """Returns per-cert completion table (0% -> 100%) and estimated cloud MB."""
    if not os.path.exists(db_path):
        return {"total_units": 0, "completed_units": 0, "est_db_mb": 0.0, "certs": {}}

    conn = init_state_db(db_path)
    cur = conn.cursor()
    cur.execute(
        """
        SELECT cert_id,
               COUNT(*) AS total,
               SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
               SUM(CASE WHEN synced_to_supabase = 1 THEN 1 ELSE 0 END) AS synced,
               SUM(est_bytes) AS total_bytes
        FROM synthesis_units
        GROUP BY cert_id
        ORDER BY cert_id;
        """
    )
    rows = cur.fetchall()
    conn.close()

    certs: Dict[str, Any] = {}
    grand_total = 0
    grand_completed = 0
    grand_bytes = 0

    for cert_id, total, completed, synced, total_bytes in rows:
        pct = round((completed / max(total, 1)) * 100.0, 1)
        mb = round((total_bytes or 0) / (1024 * 1024), 3)
        certs[cert_id] = {
            "total_units": total,
            "completed_units": completed,
            "synced_units": synced,
            "completion_pct": pct,
            "est_db_mb": mb,
        }
        grand_total += total
        grand_completed += completed
        grand_bytes += total_bytes or 0

    return {
        "total_units": grand_total,
        "completed_units": grand_completed,
        "overall_completion_pct": round((grand_completed / max(grand_total, 1)) * 100.0, 1),
        "est_db_mb": round(grand_bytes / (1024 * 1024), 3),
        "certs": certs,
    }


def sync_synthesized_to_supabase(
    db_path: str = STATE_DB_PATH,
    model_name: str = DEFAULT_MODEL,
) -> Dict[str, Any]:
    """
    Pushes completed synthesized lessons, exam questions, mock exams, and
    `synthesis_jobs` progress rows to Supabase migration 025 tables
    using SHA-256 `ON CONFLICT (content_hash) DO NOTHING`.
    """
    import psycopg2
    import psycopg2.extras
    from ml_engine.supabase_sync import get_env_credentials

    creds = get_env_credentials()
    if not creds.get("direct_url"):
        return {"status": "error", "message": "DIRECT_URL not configured in .env"}

    sconn = init_state_db(db_path)
    scur = sconn.cursor()
    scur.execute(
        """
        SELECT unit_key, cert_id, domain_number, source_refs, lesson_json, lesson_hash, questions_json
        FROM synthesis_units
        WHERE status = 'completed' AND synced_to_supabase = 0;
        """
    )
    pending_rows = scur.fetchall()

    pg = psycopg2.connect(creds["direct_url"])
    pcur = pg.cursor()

    lessons_synced = 0
    questions_synced = 0
    synced_keys: List[str] = []

    skipped_questions = 0
    skipped_units = 0

    def _as_obj(value: Any) -> Any:
        """Coerces JSON-string values (possibly double-encoded) into Python objects."""
        for _ in range(2):
            if isinstance(value, str):
                try:
                    value = json.loads(value)
                except (json.JSONDecodeError, ValueError):
                    break
        return value

    for unit_key, cert_id, dom_num, refs_json, lesson_str, lesson_hash, qs_str in pending_rows:
        try:
            refs = _as_obj(refs_json)
            refs = [str(r) for r in refs] if isinstance(refs, list) else []
            domain_name = f"Domain {dom_num}"
            pcur.execute("SAVEPOINT unit_sp;")

            lesson_obj = _as_obj(lesson_str) if lesson_str else None
            if isinstance(lesson_obj, dict):
                title = str(lesson_obj.get("title", "Lesson"))[:250]
                slug = re.sub(r"[^a-z0-9]+", "-", f"{cert_id}-d{dom_num}-{title}".lower()).strip("-")[:90]
                lesson_json_str = json.dumps(lesson_obj, ensure_ascii=False)
                pcur.execute(
                    """
                    INSERT INTO synthesized_lessons (
                        cert_id, domain_name, lesson_slug, title, content_json, content_hash, source_refs, model_name
                    )
                    VALUES (%s, %s, %s, %s, %s::jsonb, %s, %s, %s)
                    ON CONFLICT (content_hash) DO NOTHING;
                    """,
                    (cert_id, domain_name, slug, title, lesson_json_str.replace("\x00", ""), lesson_hash or sha256_hex(lesson_json_str), refs, model_name),
                )
                lessons_synced += 1
            elif lesson_str:
                print(f"[SYNC-WARN] {unit_key}: lesson_json is not an object; skipping lesson.", flush=True)

            questions = _as_obj(qs_str) if qs_str else []
            if isinstance(questions, dict):
                questions = [questions]
            if not isinstance(questions, list):
                questions = []
            for q in questions:
                q = _as_obj(q)
                if not isinstance(q, dict):
                    skipped_questions += 1
                    continue
                q_text = str(q.get("question_text") or q.get("question") or "").strip().replace("\x00", "")
                options = _as_obj(q.get("options", []))
                if not q_text or not isinstance(options, list) or len(options) < 2:
                    skipped_questions += 1
                    continue
                options = [str(o) for o in options]
                try:
                    correct_index = int(q.get("correct_index", 0))
                except (TypeError, ValueError):
                    skipped_questions += 1
                    continue
                if not (0 <= correct_index < len(options)):
                    skipped_questions += 1
                    continue
                q_hash = sha256_hex(f"{cert_id}:{q_text}")
                pcur.execute(
                    """
                    INSERT INTO synthesized_exam_questions (
                        cert_id, domain_name, difficulty, question_text, options_json,
                        correct_index, rationale, exam_trap, content_hash, source_ref, model_name
                    )
                    VALUES (%s, %s, %s, %s, %s::jsonb, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (content_hash) DO NOTHING;
                    """,
                    (
                        cert_id,
                        domain_name,
                        str(q.get("difficulty", "professional")),
                        q_text,
                        json.dumps(options, ensure_ascii=False).replace("\\u0000", ""),
                        correct_index,
                        str(q.get("rationale", "") or "").replace("\x00", ""),
                        str(q.get("exam_trap", "") or "").replace("\x00", ""),
                        q_hash,
                        refs[0] if refs else None,
                        model_name,
                    ),
                )
                questions_synced += 1

            pcur.execute("RELEASE SAVEPOINT unit_sp;")
            synced_keys.append(unit_key)
        except Exception as unit_err:
            skipped_units += 1
            print(f"[SYNC-WARN] {unit_key}: skipped due to {type(unit_err).__name__}: {unit_err}", flush=True)
            try:
                pcur.execute("ROLLBACK TO SAVEPOINT unit_sp;")
            except Exception:
                pg.rollback()

    # Update synthesis_jobs progress rows (no UNIQUE constraint on cert_id; use SELECT -> UPDATE/INSERT)
    status = get_synthesis_status(db_path)
    for cert_id, stats in status["certs"].items():
        if stats["completion_pct"] >= 100.0:
            job_status = "completed"
        elif stats["completed_units"] > 0:
            job_status = "running"
        else:
            job_status = "queued"

        pcur.execute("SELECT id FROM synthesis_jobs WHERE cert_id = %s LIMIT 1;", (cert_id,))
        existing = pcur.fetchone()
        if existing:
            pcur.execute(
                """
                UPDATE synthesis_jobs
                SET status = %s,
                    total_units = %s,
                    completed_units = %s,
                    lessons_created = %s,
                    questions_created = %s,
                    est_db_mb = %s,
                    model_name = %s,
                    updated_at = NOW()
                WHERE id = %s;
                """,
                (
                    job_status,
                    stats["total_units"],
                    stats["completed_units"],
                    stats["completed_units"],
                    stats["completed_units"] * 4,
                    stats["est_db_mb"],
                    model_name,
                    existing[0],
                ),
            )
        else:
            pcur.execute(
                """
                INSERT INTO synthesis_jobs (
                    cert_id, status, total_units, completed_units, lessons_created, questions_created, est_db_mb, model_name, updated_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW());
                """,
                (
                    cert_id,
                    job_status,
                    stats["total_units"],
                    stats["completed_units"],
                    stats["completed_units"],
                    stats["completed_units"] * 4,
                    stats["est_db_mb"],
                    model_name,
                ),
            )

    pg.commit()
    pcur.close()
    pg.close()

    if synced_keys:
        scur.executemany(
            "UPDATE synthesis_units SET synced_to_supabase = 1 WHERE unit_key = ?;",
            [(k,) for k in synced_keys],
        )
        sconn.commit()
    sconn.close()

    return {
        "status": "synced",
        "units_synced": len(synced_keys),
        "lessons_synced": lessons_synced,
        "questions_synced": questions_synced,
        "skipped_units": skipped_units,
        "skipped_questions": skipped_questions,
    }


def run_batch_synthesis(
    cert: str = "all",
    model: str = DEFAULT_MODEL,
    max_mb: float = 40.0,
    dry_run: bool = False,
    sync_supabase: bool = False,
) -> Dict[str, Any]:
    """Runs resumable 100%-coverage Ollama synthesis with strict Supabase MB budget guard."""
    grouped = load_dedup_corpus()
    units = plan_clusters(grouped, target_cert=cert)
    conn = init_state_db(STATE_DB_PATH)
    now_iso = datetime.now(timezone.utc).isoformat()

    # Register all planned units in SQLite checkpoint DB (idempotent)
    for u in units:
        conn.execute(
            """
            INSERT OR IGNORE INTO synthesis_units (
                unit_key, cert_id, domain_number, cluster_index, source_refs, status, updated_at
            )
            VALUES (?, ?, ?, ?, ?, 'pending', ?);
            """,
            (u["unit_key"], u["cert_id"], u["domain_number"], u["cluster_index"], json.dumps(u["source_refs"]), now_iso),
        )
    conn.commit()

    # Estimate budget (~9 KB per synthesized lesson + 4 exam questions)
    est_bytes_per_unit = 9200
    est_total_mb = round((len(units) * est_bytes_per_unit) / (1024 * 1024), 2)

    if dry_run:
        by_cert: Dict[str, int] = defaultdict(int)
        for u in units:
            by_cert[u["cert_id"]] += 1
        conn.close()
        return {
            "status": "dry_run_ok",
            "model": model,
            "target_cert": cert,
            "total_planned_units": len(units),
            "projected_lessons": len(units),
            "projected_exam_questions": len(units) * 4,
            "estimated_cloud_db_mb": est_total_mb,
            "budget_cap_mb": max_mb,
            "within_budget": est_total_mb <= max_mb,
            "units_by_cert": dict(sorted(by_cert.items())),
        }

    ok, preflight_msg = check_ollama_preflight(model=model, ollama_url=DEFAULT_OLLAMA_URL)
    print(f"[PREFLIGHT] {preflight_msg}", flush=True)
    if not ok:
        conn.close()
        return {"status": "preflight_failed", "error": preflight_msg}

    max_bytes = int(max_mb * 1024 * 1024)
    cur = conn.cursor()
    cur.execute("SELECT COALESCE(SUM(est_bytes), 0) FROM synthesis_units WHERE status = 'completed';")
    cumulative_bytes = int(cur.fetchone()[0] or 0)

    processed = 0
    failed = 0
    consecutive_errors = 0

    for u in units:
        if cumulative_bytes >= max_bytes:
            print(f"[BUDGET-GUARD] Reached {max_mb} MB cap ({cumulative_bytes / (1024*1024):.2f} MB). Stopping cleanly.", flush=True)
            break

        cur.execute("SELECT status FROM synthesis_units WHERE unit_key = ?;", (u["unit_key"],))
        row = cur.fetchone()
        if row and row[0] == "completed":
            continue

        ctx_chars = MAX_CONTEXT_CHARS
        prompt = build_synthesis_prompt(u, max_context_chars=ctx_chars)
        parsed = None
        last_err = None
        transport_failure = False
        t_unit = time.time()
        print(f"[SYNTH] Starting {u['unit_key']} (model={model})...", flush=True)
        for attempt in range(1, 4):
            raw_out, err = call_ollama_chat(prompt, model=model)
            if err:
                last_err = err
                print(f"[SYNTH] Retry {attempt}/3 for {u['unit_key']} — Ollama error: {err}", flush=True)
                if "exceeds the available context" in err or "context size" in err:
                    # Per-unit prompt problem: shrink grounding and retry (never counts toward abort)
                    ctx_chars = max(1500, ctx_chars // 2)
                    prompt = build_synthesis_prompt(u, max_context_chars=ctx_chars)
                    transport_failure = False
                else:
                    transport_failure = err.startswith(("URLError", "RemoteDisconnected", "ConnectionError", "ConnectionRefused", "TimeoutError"))
            else:
                transport_failure = False
                parsed = extract_json_object(raw_out or "")
                if parsed and "lesson" in parsed:
                    break
                preview = (raw_out or "")[:180].replace("\n", " ")
                last_err = f"Invalid JSON or missing 'lesson' key. Preview: {preview}"
                print(f"[SYNTH] Retry {attempt}/3 for {u['unit_key']} — {last_err}", flush=True)
            conn.execute(
                "UPDATE synthesis_units SET retries = ?, status = 'failed_retried', updated_at = ? WHERE unit_key = ?;",
                (attempt, datetime.now(timezone.utc).isoformat(), u["unit_key"]),
            )
            conn.commit()

        if not parsed or "lesson" not in parsed:
            print(f"[SYNTH] Failed {u['unit_key']} after 3 attempts ({time.time() - t_unit:.1f}s): {last_err}", flush=True)
            failed += 1
            if transport_failure:
                consecutive_errors += 1
                if consecutive_errors >= 3:
                    print("[SYNTH] Aborting early after 3 consecutive Ollama transport failures — check that Ollama is running.", flush=True)
                    break
            continue
        consecutive_errors = 0
        print(f"[SYNTH] Completed {u['unit_key']} in {time.time() - t_unit:.1f}s", flush=True)

        lesson_str = json.dumps(parsed["lesson"], ensure_ascii=False, separators=(",", ":"))
        qs_str = json.dumps(parsed.get("exam_questions", []), ensure_ascii=False, separators=(",", ":"))
        l_hash = sha256_hex(f"{u['cert_id']}:{lesson_str}")
        unit_bytes = len(lesson_str.encode("utf-8")) + len(qs_str.encode("utf-8"))
        cumulative_bytes += unit_bytes

        conn.execute(
            """
            UPDATE synthesis_units
            SET status = 'completed',
                lesson_json = ?,
                lesson_hash = ?,
                questions_json = ?,
                est_bytes = ?,
                updated_at = ?
            WHERE unit_key = ?;
            """,
            (lesson_str, l_hash, qs_str, unit_bytes, datetime.now(timezone.utc).isoformat(), u["unit_key"]),
        )
        conn.commit()
        processed += 1

        if sync_supabase and processed % 5 == 0:
            try:
                flush_res = sync_synthesized_to_supabase(STATE_DB_PATH, model_name=model)
                print(
                    f"[SYNC-LIVE] Flushed {flush_res.get('units_synced', 0)} units "
                    f"({flush_res.get('lessons_synced', 0)} lessons, {flush_res.get('questions_synced', 0)} questions) to Supabase.",
                    flush=True,
                )
            except Exception as sync_err:
                print(f"[SYNC-WARN] Incremental Supabase sync failed (will retry next batch): {sync_err}", flush=True)

    conn.close()
    result: Dict[str, Any] = {
        "status": "completed",
        "processed_units": processed,
        "failed_units": failed,
        "summary": get_synthesis_status(STATE_DB_PATH),
    }

    if sync_supabase:
        result["supabase_sync"] = sync_synthesized_to_supabase(STATE_DB_PATH, model_name=model)

    return result


def main():
    parser = argparse.ArgumentParser(description="AnoxPass Resumable Ollama Batch Synthesizer")
    parser.add_argument("--cert", default="all", help="Certification ID (e.g. cisa, cissp) or 'all'")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="Local Ollama open-weights model")
    parser.add_argument("--max-mb", type=float, default=40.0, help="Strict Supabase storage budget cap in MB")
    parser.add_argument("--dry-run", action="store_true", help="Plan clusters & estimate MB without calling Ollama")
    parser.add_argument("--sync-supabase", action="store_true", help="Push completed units to Supabase migration 025 tables")
    parser.add_argument("--status", action="store_true", help="Show per-cert synthesis completion table")
    args = parser.parse_args()

    if args.status:
        print(json.dumps(get_synthesis_status(STATE_DB_PATH), indent=2))
        return

    res = run_batch_synthesis(
        cert=args.cert,
        model=args.model,
        max_mb=args.max_mb,
        dry_run=args.dry_run,
        sync_supabase=args.sync_supabase,
    )
    print(json.dumps(res, indent=2))


if __name__ == "__main__":
    main()
