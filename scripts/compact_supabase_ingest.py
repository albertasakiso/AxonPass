#!/usr/bin/env python3
"""
===================================================================
ANOXPASS — Compact Supabase Knowledge Ingestor (Dry-Run Default)
Uploads ONLY SHA-256-deduplicated, high-signal distilled study units
to Supabase `knowledge_units` (ZERO raw PDFs, ZERO float32 vectors).
Enforces strict `--max-mb` budget cap (default 25 MB).
===================================================================
Usage:
    python scripts/compact_supabase_ingest.py --dry-run
    python scripts/compact_supabase_ingest.py --max-mb 20 --dry-run
    python scripts/compact_supabase_ingest.py --apply --max-mb 25
===================================================================
"""

import os
import sys
import json
import gzip
import argparse

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from ml_engine.storage_optimizer import (
    COMPACT_PACK_PATH,
    export_compact_cloud_pack,
)


def main():
    parser = argparse.ArgumentParser(description="AnoxPass Compact Supabase Knowledge Ingestor")
    parser.add_argument("--max-mb", type=float, default=25.0, help="Strict uncompressed MB budget cap for Supabase")
    parser.add_argument("--dry-run", action="store_true", default=True, help="Preview byte budget without uploading (default)")
    parser.add_argument("--apply", action="store_true", help="Actually upsert distilled units into Supabase knowledge_units")
    args = parser.parse_args()

    summary = export_compact_cloud_pack(max_mb=args.max_mb)
    print(json.dumps(summary, indent=2))

    if not args.apply:
        print("\n[DRY-RUN] No data uploaded to Supabase. Pass --apply after explicit approval to upsert into `knowledge_units`.")
        return

    # Only import psycopg2 when --apply is explicitly requested
    import psycopg2
    import psycopg2.extras
    from ml_engine.supabase_sync import get_env_credentials

    creds = get_env_credentials()
    if not creds.get("direct_url"):
        print("[ERROR] DIRECT_URL not found in .env. Aborting upload.")
        sys.exit(1)

    rows = []
    with gzip.open(COMPACT_PACK_PATH, "rt", encoding="utf-8") as gz:
        for line in gz:
            if not line.strip():
                continue
            item = json.loads(line)
            rows.append((
                item["content_hash"].replace("\x00", ""),
                item["cert_code"].replace("\x00", ""),
                item["domain_number"],
                item["unit_type"].replace("\x00", ""),
                item["source_doc"].replace("\x00", ""),
                item["content"].replace("\x00", ""),
                json.dumps({"signal_score": item.get("signal_score", 0)}),
            ))

    conn = psycopg2.connect(creds["direct_url"])
    cur = conn.cursor()
    upsert_sql = """
        INSERT INTO knowledge_units (
            content_hash, cert_code, domain_number, unit_type, source_doc, content, tags
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s::jsonb)
        ON CONFLICT (content_hash) DO NOTHING;
    """
    psycopg2.extras.execute_batch(cur, upsert_sql, rows, page_size=500)
    conn.commit()
    cur.close()
    conn.close()
    print(f"[APPLY-OK] Upserted up to {len(rows)} deduplicated compact knowledge units into Supabase.")


if __name__ == "__main__":
    main()
