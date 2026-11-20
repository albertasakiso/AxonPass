#!/usr/bin/env python3
"""
===================================================================
ANOXPASS — 3-Tier Storage Optimizer & Compact Cloud Knowledge Distiller
Solves Supabase 500 MB free-tier limits while keeping 100% of knowledge
accessible locally:
  Tier 1 (Local Raw): `my_documents/` stays 100% local (0 MB cloud)
  Tier 2 (Local Quantized RAG): int8/float16 vectors + zlib JSONL + SHA-256 dedup
  Tier 3 (Compact Cloud Pack): High-signal distilled units (<25 MB cap, 0 vectors)
===================================================================
"""

import os
import re
import json
import gzip
import zlib
import hashlib
import time
from collections import defaultdict
from typing import Dict, Any, List, Optional, Tuple

import numpy as np

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_DIR = os.path.join(ROOT_DIR, "ml_engine")

RAW_META_PATH = os.path.join(ML_DIR, "chunks_metadata.json")
RAW_NPZ_PATH = os.path.join(ML_DIR, "vector_store.npz")

OPT_META_PATH = os.path.join(ML_DIR, "chunks_metadata.jsonl.zlib")
OPT_NPZ_PATH = os.path.join(ML_DIR, "vector_store_int8.npz")
COMPACT_PACK_PATH = os.path.join(ML_DIR, "compact_knowledge_pack.jsonl.gz")
STORAGE_REPORT_PATH = os.path.join(ML_DIR, "storage_optimization_report.json")

BOILERPLATE_PATTERNS = [
    re.compile(r"^\s*page\s+\d+(\s+of\s+\d+)?\s*$", re.IGNORECASE | re.MULTILINE),
    re.compile(r"^\s*copyright\s+©?.*$", re.IGNORECASE | re.MULTILINE),
    re.compile(r"^\s*all\s+rights\s+reserved\.?\s*$", re.IGNORECASE | re.MULTILINE),
    re.compile(r"^\s*table\s+of\s+contents\s*$", re.IGNORECASE | re.MULTILINE),
    re.compile(r"[-_=]{6,}"),
]

HIGH_SIGNAL_PATTERNS = re.compile(
    r"\b(definition|principle|framework|control|primary|first|most|best|least|"
    r"standard|policy|risk|governance|audit|compliance|architecture|encryption|"
    r"rto|rpo|bia|cia|nist|cobit|itaf|cissp|cisa|cism|crisc|aws|leadership|"
    r"standard of performance|contingency|rhetoric|zettelkasten|sq3r)\b",
    re.IGNORECASE,
)


def strip_boilerplate(text: str) -> str:
    """Removes NUL bytes, repetitive headers, page numbers, dividers, and excess whitespace."""
    cleaned = (text or "").replace("\x00", "")
    for pat in BOILERPLATE_PATTERNS:
        cleaned = pat.sub("", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def compute_sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8", errors="ignore")).hexdigest()


def quantize_embeddings_int8(embeddings: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    """
    Symmetric per-row int8 quantization:
      q = round(v / scale * 127), where scale = max(|v|) per row.
    Reduces float32 (4 bytes/dim) -> int8 (1 byte/dim) with >99.5% cosine fidelity.
    """
    max_abs = np.max(np.abs(embeddings), axis=1, keepdims=True)
    max_abs = np.where(max_abs == 0, 1.0, max_abs).astype(np.float16)
    scaled = np.clip(np.round((embeddings / max_abs.astype(np.float32)) * 127.0), -127, 127)
    return scaled.astype(np.int8), max_abs.squeeze(-1)


def dequantize_embeddings_int8(q_embeddings: np.ndarray, scales: np.ndarray) -> np.ndarray:
    """Restores normalized float32 vectors from int8 + float16 scales."""
    return (q_embeddings.astype(np.float32) / 127.0) * scales.astype(np.float32)[:, None]


def optimize_local_storage(
    raw_meta_path: str = RAW_META_PATH,
    raw_npz_path: str = RAW_NPZ_PATH,
    opt_meta_path: str = OPT_META_PATH,
    opt_npz_path: str = OPT_NPZ_PATH,
) -> Dict[str, Any]:
    """
    Deduplicates (SHA-256), strips boilerplate, compresses metadata with zlib,
    and quantizes float32 vectors to int8. Leaves original files untouched.
    """
    t0 = time.time()
    if not os.path.exists(raw_meta_path):
        return {"status": "missing_raw_metadata", "path": raw_meta_path}

    raw_meta_mb = os.path.getsize(raw_meta_path) / (1024 * 1024)
    raw_npz_mb = os.path.getsize(raw_npz_path) / (1024 * 1024) if os.path.exists(raw_npz_path) else 0.0

    with open(raw_meta_path, "r", encoding="utf-8") as f:
        meta_obj = json.load(f)
    chunks = meta_obj.get("chunks", []) if isinstance(meta_obj, dict) else meta_obj

    seen_hashes = set()
    keep_indices: List[int] = []
    compact_lines: List[str] = []
    duplicates_removed = 0
    empty_removed = 0

    for idx, ch in enumerate(chunks):
        cleaned = strip_boilerplate(ch.get("chunk_text", ""))
        if len(cleaned) < 40:
            empty_removed += 1
            continue
        h = compute_sha256(cleaned)
        if h in seen_hashes:
            duplicates_removed += 1
            continue
        seen_hashes.add(h)
        keep_indices.append(idx)
        compact_record = {
            "h": h[:16],
            "c": ch.get("certification_code", "GENERAL"),
            "d": ch.get("document_name", "doc"),
            "n": ch.get("domain_number", 1),
            "t": cleaned,
        }
        compact_lines.append(json.dumps(compact_record, ensure_ascii=False, separators=(",", ":")))

    compressed_meta = zlib.compress("\n".join(compact_lines).encode("utf-8"), level=9)
    with open(opt_meta_path, "wb") as f:
        f.write(compressed_meta)
    opt_meta_mb = os.path.getsize(opt_meta_path) / (1024 * 1024)

    opt_npz_mb = 0.0
    if os.path.exists(raw_npz_path) and keep_indices:
        npz_data = np.load(raw_npz_path)
        embeddings = npz_data["embeddings"]
        if len(embeddings) >= max(keep_indices) + 1:
            dedup_emb = embeddings[keep_indices]
            q_emb, scales = quantize_embeddings_int8(dedup_emb)
            np.savez_compressed(opt_npz_path, embeddings_int8=q_emb, scales=scales)
            opt_npz_mb = os.path.getsize(opt_npz_path) / (1024 * 1024)

    raw_total_mb = round(raw_meta_mb + raw_npz_mb, 2)
    opt_total_mb = round(opt_meta_mb + opt_npz_mb, 2)
    savings_pct = round(((raw_total_mb - opt_total_mb) / max(raw_total_mb, 0.01)) * 100, 1)

    report = {
        "status": "optimized",
        "elapsed_seconds": round(time.time() - t0, 2),
        "raw_chunks": len(chunks),
        "kept_unique_chunks": len(keep_indices),
        "duplicates_removed": duplicates_removed,
        "boilerplate_empty_removed": empty_removed,
        "raw_meta_mb": round(raw_meta_mb, 2),
        "raw_vectors_mb": round(raw_npz_mb, 2),
        "raw_total_mb": raw_total_mb,
        "optimized_meta_mb": round(opt_meta_mb, 2),
        "optimized_vectors_mb": round(opt_npz_mb, 2),
        "optimized_total_mb": opt_total_mb,
        "compression_savings_percent": savings_pct,
    }
    with open(STORAGE_REPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    return report


def export_compact_cloud_pack(
    max_mb: float = 25.0,
    source_meta_path: str = OPT_META_PATH,
    fallback_raw_meta_path: str = RAW_META_PATH,
    output_path: str = COMPACT_PACK_PATH,
) -> Dict[str, Any]:
    """
    Distills ONLY high-signal, SHA-256-deduplicated study units (ZERO raw PDF blobs,
    ZERO float32 vectors) capped strictly at `max_mb` uncompressed JSON bytes for
    Supabase's `knowledge_units` table.
    """
    records: List[Dict[str, Any]] = []
    if os.path.exists(source_meta_path):
        with open(source_meta_path, "rb") as f:
            raw_bytes = zlib.decompress(f.read()).decode("utf-8")
        for line in raw_bytes.splitlines():
            if line.strip():
                r = json.loads(line)
                records.append({
                    "content_hash": r["h"],
                    "cert_code": r["c"],
                    "source_doc": r["d"],
                    "domain_number": r["n"],
                    "summary": r["t"],
                })
    elif os.path.exists(fallback_raw_meta_path):
        with open(fallback_raw_meta_path, "r", encoding="utf-8") as f:
            meta_obj = json.load(f)
        chunks = meta_obj.get("chunks", []) if isinstance(meta_obj, dict) else meta_obj
        seen = set()
        for ch in chunks:
            cleaned = strip_boilerplate(ch.get("chunk_text", ""))
            if len(cleaned) < 60:
                continue
            h = compute_sha256(cleaned)[:16]
            if h in seen:
                continue
            seen.add(h)
            records.append({
                "content_hash": h,
                "cert_code": ch.get("certification_code", "GENERAL"),
                "source_doc": ch.get("document_name", "doc"),
                "domain_number": ch.get("domain_number", 1),
                "summary": cleaned,
            })

    # Score by signal density so we keep the highest-value exam/leadership units first
    scored: List[Tuple[int, Dict[str, Any]]] = []
    for rec in records:
        text = rec["summary"]
        hits = len(HIGH_SIGNAL_PATTERNS.findall(text))
        if hits == 0 and len(text) < 120:
            continue
        scored.append((hits, rec))

    scored.sort(key=lambda x: x[0], reverse=True)

    max_bytes = int(max_mb * 1024 * 1024)
    selected_lines: List[str] = []
    total_uncompressed_bytes = 0
    by_cert: Dict[str, int] = defaultdict(int)

    for score, rec in scored:
        distilled = {
            "content_hash": rec["content_hash"],
            "cert_code": rec["cert_code"],
            "domain_number": rec["domain_number"],
            "source_doc": rec["source_doc"][:120],
            "unit_type": "concept_summary",
            "content": rec["summary"][:480],
            "signal_score": score,
        }
        line = json.dumps(distilled, ensure_ascii=False, separators=(",", ":"))
        line_bytes = len(line.encode("utf-8")) + 1
        if total_uncompressed_bytes + line_bytes > max_bytes:
            break
        selected_lines.append(line)
        total_uncompressed_bytes += line_bytes
        by_cert[rec["cert_code"]] += 1

    with gzip.open(output_path, "wt", encoding="utf-8", compresslevel=9) as gz:
        gz.write("\n".join(selected_lines))

    gz_mb = round(os.path.getsize(output_path) / (1024 * 1024), 3)
    uncompressed_mb = round(total_uncompressed_bytes / (1024 * 1024), 3)

    return {
        "status": "exported",
        "output_path": output_path,
        "budget_cap_mb": max_mb,
        "selected_units": len(selected_lines),
        "estimated_postgres_mb": uncompressed_mb,
        "gzip_archive_mb": gz_mb,
        "vectors_uploaded": 0,
        "raw_pdfs_uploaded": 0,
        "domains": dict(by_cert),
    }


def get_storage_stats() -> Dict[str, Any]:
    """Returns live local + compact cloud storage telemetry for GET /storage/stats."""
    def file_mb(path: str) -> float:
        return round(os.path.getsize(path) / (1024 * 1024), 2) if os.path.exists(path) else 0.0

    report = {}
    if os.path.exists(STORAGE_REPORT_PATH):
        try:
            with open(STORAGE_REPORT_PATH, "r", encoding="utf-8") as f:
                report = json.load(f)
        except Exception:
            report = {}

    raw_total = round(file_mb(RAW_META_PATH) + file_mb(RAW_NPZ_PATH), 2)
    opt_total = round(file_mb(OPT_META_PATH) + file_mb(OPT_NPZ_PATH), 2)
    compact_gz = file_mb(COMPACT_PACK_PATH)

    return {
        "strategy": "3-tier-local-first-hybrid",
        "raw_local_mb": raw_total,
        "optimized_local_mb": opt_total,
        "compact_cloud_pack_gz_mb": compact_gz,
        "compression_savings_percent": report.get("compression_savings_percent", 0.0),
        "unique_chunks": report.get("kept_unique_chunks", 0),
        "duplicates_removed": report.get("duplicates_removed", 0),
        "supabase_budget_cap_mb": 25.0,
        "zero_raw_pdfs_in_cloud": True,
        "zero_float32_vectors_in_cloud": True,
    }
