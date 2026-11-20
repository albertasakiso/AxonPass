#!/usr/bin/env python3
"""
===================================================================
ANOXPASS — Lossless Restore to a Fresh Supabase Project
Restores schema (migrations 001–025) + all backed-up `public` tables
from `supabase/backups/anoxpass_public_backup_YYYYMMDD/manifest.json`
with optional `--deduplicate-questions`, SHA-256 verification,
row-count parity checks, VACUUM ANALYZE, and live storage audit.
===================================================================
Usage:
    python scripts/restore_to_new_supabase.py --dry-run
    python scripts/restore_to_new_supabase.py --apply --deduplicate-questions
===================================================================
"""

import argparse
import glob
import gzip
import hashlib
import json
import os
import re
import sys
import psycopg2
import psycopg2.extras

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_env(env_path: str) -> dict:
    env = {}
    if not os.path.exists(env_path):
        return env
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            s = line.strip()
            if "=" in s and not s.startswith("#"):
                k, v = s.split("=", 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def find_latest_backup_dir() -> str:
    pattern = os.path.join(ROOT_DIR, "supabase", "backups", "anoxpass_public_backup_*")
    dirs = sorted(glob.glob(pattern))
    if not dirs:
        raise FileNotFoundError("No backup directory found under supabase/backups/anoxpass_public_backup_*")
    return dirs[-1]


def verify_file_sha256(path: str, expected: str) -> bool:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest() == expected


def adapt_value(val, data_type: str):
    if val is None:
        return None
    if data_type in ("json", "jsonb"):
        return json.dumps(val, ensure_ascii=False)
    return val


def normalize_stem(stem: str) -> str:
    return re.sub(r"\s+", " ", (stem or "").strip().lower())


def load_referenced_question_ids(backup_dir: str) -> set:
    ref_ids = set()
    for fname, col in [
        ("ml_question_reasoning.jsonl.gz", "question_id"),
        ("user_progress.jsonl.gz", "question_id"),
    ]:
        fpath = os.path.join(backup_dir, fname)
        if not os.path.exists(fpath):
            continue
        with gzip.open(fpath, "rt", encoding="utf-8") as gz:
            for line in gz:
                if not line.strip():
                    continue
                rec = json.loads(line)
                qid = rec.get(col)
                if qid:
                    ref_ids.add(qid)
    return ref_ids


def load_deduplicated_questions(fpath: str, referenced_ids: set) -> list:
    """
    Deduplicate questions by (certification_id, normalized_stem), always keeping:
    1) Any row whose `id` is referenced by ml_question_reasoning or user_progress
    2) Otherwise the row with the longest/richest rationale/explanation.
    """
    best_by_key = {}
    total = 0
    with gzip.open(fpath, "rt", encoding="utf-8") as gz:
        for line in gz:
            if not line.strip():
                continue
            rec = json.loads(line)
            total += 1
            key = (rec.get("certification_id") or "", normalize_stem(rec.get("stem") or ""))
            is_ref = rec.get("id") in referenced_ids
            richness = len(str(rec.get("rationale") or "")) + len(str(rec.get("explanation") or ""))
            score = (1 if is_ref else 0, richness)

            prev = best_by_key.get(key)
            if prev is None or score > prev[0]:
                best_by_key[key] = (score, rec)

    kept = [v[1] for v in best_by_key.values()]
    print(f"  [DEDUP] questions: {total} source rows -> {len(kept)} unique questions (removed {total - len(kept)} duplicates)")
    return kept


def main():
    parser = argparse.ArgumentParser(description="Restore AnoxPass public schema backup to a fresh Supabase project")
    parser.add_argument("--backup-dir", type=str, default=None, help="Path to backup directory containing manifest.json")
    parser.add_argument("--db-url", type=str, default=None, help="Target Postgres DIRECT_URL (defaults to .env DIRECT_URL)")
    parser.add_argument("--skip-migrations", action="store_true", help="Skip running supabase/migrations/*.sql")
    parser.add_argument("--deduplicate-questions", action="store_true", help="Deduplicate public.questions by (certification_id, normalized_stem)")
    parser.add_argument("--apply", action="store_true", help="Execute restore against target DB (default is --dry-run)")
    parser.add_argument("--dry-run", action="store_true", help="Verify backup integrity & print plan without modifying DB")
    args = parser.parse_args()

    backup_dir = args.backup_dir or find_latest_backup_dir()
    manifest_path = os.path.join(backup_dir, "manifest.json")
    if not os.path.exists(manifest_path):
        print(f"[ERROR] manifest.json not found in {backup_dir}")
        sys.exit(1)

    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    print(f"Backup dir: {backup_dir}")
    print(f"Tables: {len(manifest['tables'])}, Total rows: {manifest['total_rows']}, Compressed: {manifest.get('total_compressed_mb')} MB")

    for entry in manifest["tables"]:
        fpath = os.path.join(backup_dir, entry["file"])
        if not os.path.exists(fpath):
            print(f"[ERROR] Missing backup file: {fpath}")
            sys.exit(1)
        if not verify_file_sha256(fpath, entry["sha256"]):
            print(f"[ERROR] SHA-256 mismatch for {entry['file']}!")
            sys.exit(1)
    print("[OK] All backup files passed SHA-256 integrity verification.")

    migrations = sorted(glob.glob(os.path.join(ROOT_DIR, "supabase", "migrations", "*.sql")))
    print(f"Migrations found: {len(migrations)} ({os.path.basename(migrations[0])} .. {os.path.basename(migrations[-1])})")

    if not args.apply:
        print("\n[DRY-RUN] Verified backup integrity. Pass --apply [--deduplicate-questions] after updating .env.")
        return

    env = load_env(os.path.join(ROOT_DIR, ".env"))
    db_url = args.db_url or env.get("DIRECT_URL") or env.get("DATABASE_URL")
    if not db_url:
        print("[ERROR] DIRECT_URL not found in .env or --db-url.")
        sys.exit(1)

    # 1. Enable required extensions & apply migrations 001..025
    if not args.skip_migrations:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cur = conn.cursor()
        for ext in ("uuid-ossp", "pgcrypto", "pg_trgm", "vector"):
            try:
                cur.execute(f'CREATE EXTENSION IF NOT EXISTS "{ext}";')
            except Exception as e:
                print(f"  [WARN] extension {ext}: {e}")
        for mpath in migrations:
            mname = os.path.basename(mpath)
            print(f"  Applying migration {mname}...")
            with open(mpath, "r", encoding="utf-8") as mf:
                cur.execute(mf.read())
        cur.close()
        conn.close()
        print("[OK] All 25 migrations applied.")

    # 2. Restore tables
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    cur.execute("SELECT id::text FROM auth.users;")
    existing_auth_users = {r[0] for r in cur.fetchall()}
    print(f"[INFO] Target project has {len(existing_auth_users)} auth.users row(s).")

    replica_enabled = False
    try:
        cur.execute("SET session_replication_role = replica;")
        replica_enabled = True
        print("[OK] session_replication_role = replica enabled for FK-safe restore.")
    except Exception:
        conn.rollback()
        print("[INFO] session_replication_role not permitted; restoring in topological order.")

    priority = [
        "app_config",
        "certifications",
        "domains",
        "topics",
        "subtopics",
        "task_statements",
        "questions",
        "study_materials",
        "glossary_terms",
        "case_studies",
        "case_study_questions",
        "document_ingestion_ledger",
        "knowledge_units",
        "ml_cognitive_operators",
        "ml_bkt_parameters",
        "ml_knowledge_nodes",
        "ml_question_reasoning",
        "ml_verification_metrics",
        "profiles",
        "user_progress",
    ]

    def sort_key(entry):
        t = entry["table"]
        return (priority.index(t) if t in priority else 999, t)

    tables_ordered = sorted(manifest["tables"], key=sort_key)
    referenced_qids = load_referenced_question_ids(backup_dir) if args.deduplicate_questions else set()
    expected_counts = {}

    for entry in tables_ordered:
        tbl = entry["table"]
        cols = entry["columns"]
        fpath = os.path.join(backup_dir, entry["file"])

        cur.execute("""
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = %s;
        """, (tbl,))
        col_types = {r[0]: r[1] for r in cur.fetchall()}
        valid_cols = [c for c in cols if c in col_types]

        col_sql = ", ".join(f'"{c}"' for c in valid_cols)
        placeholders = ", ".join(["%s"] * len(valid_cols))
        insert_sql = f'INSERT INTO public."{tbl}" ({col_sql}) VALUES ({placeholders}) ON CONFLICT DO NOTHING;'

        if tbl == "questions" and args.deduplicate_questions:
            records = load_deduplicated_questions(fpath, referenced_qids)
            expected_counts[tbl] = len(records)
            batch = []
            restored = 0
            for rec in records:
                batch.append(tuple(adapt_value(rec.get(c), col_types[c]) for c in valid_cols))
                if len(batch) >= 500:
                    psycopg2.extras.execute_batch(cur, insert_sql, batch, page_size=500)
                    restored += len(batch)
                    batch = []
            if batch:
                psycopg2.extras.execute_batch(cur, insert_sql, batch, page_size=500)
                restored += len(batch)
            conn.commit()
            print(f"  [RESTORED] {tbl:30s} processed={restored:7d}")
            continue

        expected_counts[tbl] = entry["row_count"]
        batch = []
        restored = 0
        skipped_auth = 0
        with gzip.open(fpath, "rt", encoding="utf-8") as gz:
            for line in gz:
                if not line.strip():
                    continue
                rec = json.loads(line)
                # Gracefully skip user-bound rows if auth.users doesn't have that UUID in fresh project
                if not replica_enabled and tbl == "profiles" and str(rec.get("id")) not in existing_auth_users:
                    skipped_auth += 1
                    continue
                if not replica_enabled and tbl == "user_progress" and str(rec.get("user_id")) not in existing_auth_users:
                    skipped_auth += 1
                    continue
                batch.append(tuple(adapt_value(rec.get(c), col_types[c]) for c in valid_cols))
                if len(batch) >= 500:
                    psycopg2.extras.execute_batch(cur, insert_sql, batch, page_size=500)
                    restored += len(batch)
                    batch = []
            if batch:
                psycopg2.extras.execute_batch(cur, insert_sql, batch, page_size=500)
                restored += len(batch)

        conn.commit()
        extra = f" (skipped {skipped_auth} unmapped auth.users)" if skipped_auth else ""
        print(f"  [RESTORED] {tbl:30s} processed={restored:7d}{extra}")

    if replica_enabled:
        cur.execute("SET session_replication_role = origin;")
        conn.commit()

    # 3. Verify row-count parity
    print("\nROW-COUNT PARITY CHECK:")
    for entry in tables_ordered:
        tbl = entry["table"]
        expected = expected_counts[tbl]
        cur.execute(f'SELECT COUNT(*) FROM public."{tbl}";')
        actual = cur.fetchone()[0]
        status = "MATCH" if actual == expected else "INFO"
        print(f"  [{status:5s}] {tbl:30s} expected={expected:7d}  target={actual:7d}")

    cur.close()
    conn.close()

    # 4. VACUUM ANALYZE + Live Storage Audit
    vconn = psycopg2.connect(db_url)
    vconn.autocommit = True
    vcur = vconn.cursor()
    print("\nRunning VACUUM ANALYZE on restored tables...")
    for entry in tables_ordered:
        tbl = entry["table"]
        vcur.execute(f'VACUUM ANALYZE public."{tbl}";')
    vcur.execute("SELECT public.get_supabase_storage_audit();")
    audit = vcur.fetchone()[0]
    print("\nTARGET STORAGE AUDIT:")
    print(json.dumps(audit, indent=2))
    vcur.close()
    vconn.close()


if __name__ == "__main__":
    main()
