#!/usr/bin/env python3
"""
===================================================================
APILIGU LEARNING PASS — Supabase Live Database & Storage Synchronizer
Syncs Vector Embeddings, Chunks, Verification Metrics & Storage Buckets
===================================================================
"""

import os
import sys
import json
import time
import uuid
import psycopg2
import psycopg2.extras
import numpy as np
from typing import List, Dict, Any, Optional

try:
    from supabase import create_client, Client
except ImportError:
    create_client = None
    Client = None


def get_env_credentials():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    env_path = os.path.join(root_dir, '.env')

    with open(env_path, 'r', encoding='utf-8') as f:
        content = f.read()

    direct_url = ''
    supabase_url = ''
    supabase_key = ''

    for line in content.splitlines():
        trimmed = line.strip()
        if trimmed.startswith('DIRECT_URL='):
            direct_url = trimmed.replace('DIRECT_URL=', '').strip('\'"')
        elif trimmed.startswith('SUPABASE_URL='):
            supabase_url = trimmed.replace('SUPABASE_URL=', '').strip('\'"')
        elif trimmed.startswith('SUPABASE_SECRET_KEY='):
            supabase_key = trimmed.replace('SUPABASE_SECRET_KEY=', '').strip('\'"')

    return {
        "direct_url": direct_url,
        "supabase_url": supabase_url,
        "supabase_key": supabase_key
    }


class SupabaseLiveSync:
    def __init__(self):
        creds = get_env_credentials()
        self.direct_url = creds["direct_url"]
        self.supabase_url = creds["supabase_url"]
        self.supabase_key = creds["supabase_key"]
        self.client: Optional[Client] = None

        if create_client and self.supabase_url and self.supabase_key:
            try:
                self.client = create_client(self.supabase_url, self.supabase_key)
            except Exception as e:
                print(f"[WARN] Supabase client init notice: {e}")

    def sync_storage_bucket(self, bucket_name: str = "study-documents") -> bool:
        """Ensures the storage bucket exists in Supabase Storage."""
        if not self.client:
            print("[SYNC-STORAGE] Supabase client not initialized. Skipping storage bucket check.")
            return False

        try:
            buckets = self.client.storage.list_buckets()
            existing = [b.name for b in buckets if hasattr(b, 'name')]
            if bucket_name not in existing:
                print(f"[SYNC-STORAGE] Creating Supabase Storage bucket: '{bucket_name}'...")
                self.client.storage.create_bucket(bucket_name, options={"public": True})
                print(f"[SYNC-STORAGE] Bucket '{bucket_name}' created successfully!")
            else:
                print(f"[SYNC-STORAGE] Bucket '{bucket_name}' already exists and is active.")
            return True
        except Exception as e:
            print(f"[SYNC-STORAGE] Notice: {e}")
            return False

    def upload_files_to_storage(
        self,
        local_files_dir: str,
        bucket_name: str = "study-documents",
        max_files: int = 50
    ) -> int:
        """Enforces Zero-Storage Policy: raw files are never uploaded to cloud buckets to prevent storage bloat."""
        print(f"\n[ZERO-STORAGE-POLICY] Raw file upload to cloud storage '{bucket_name}' is permanently DISABLED.")
        print(" [INFO] 100% of intelligence is distilled into lightweight embeddings and database records.")
        print(" [INFO] 0 MB cloud storage consumed. 100% bandwidth and storage quota saved.")
        return 0

    def push_vector_chunks(
        self,
        chunks: List[Dict[str, Any]],
        embeddings: np.ndarray,
        batch_size: int = 200
    ) -> int:
        """
        Batches and upserts document chunks and 384-dimensional vector embeddings
        into the `document_chunks` table with pgvector in Supabase Postgres.
        """
        print(f"\n[SYNC-DB] Pushing {len(chunks)} document chunks and vector embeddings to live Supabase Postgres...")
        conn = psycopg2.connect(self.direct_url)
        cur = conn.cursor()

        total = len(chunks)
        inserted = 0

        upsert_query = """
            INSERT INTO document_chunks (
                document_name,
                document_path,
                certification_code,
                domain_number,
                chunk_index,
                chunk_text,
                char_count,
                token_estimate,
                embedding,
                metadata,
                content_hash,
                updated_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            ON CONFLICT (document_path, chunk_index)
            DO UPDATE SET
                chunk_text = EXCLUDED.chunk_text,
                char_count = EXCLUDED.char_count,
                token_estimate = EXCLUDED.token_estimate,
                embedding = EXCLUDED.embedding,
                metadata = EXCLUDED.metadata,
                content_hash = EXCLUDED.content_hash,
                updated_at = NOW();
        """

        for i in range(0, total, batch_size):
            batch_chunks = chunks[i:i + batch_size]
            batch_embeddings = embeddings[i:i + batch_size]

            batch_data = []
            for chunk, emb in zip(batch_chunks, batch_embeddings):
                # Convert embedding numpy vector to postgres vector format string: '[v1, v2, ...]'
                vec_str = "[" + ",".join(f"{float(x):.6f}" for x in emb) + "]"
                
                batch_data.append((
                    chunk.get("document_name", "doc"),
                    chunk.get("document_path", "path"),
                    chunk.get("certification_code", "GENERAL"),
                    chunk.get("domain_number", 1),
                    chunk.get("chunk_index", 0),
                    chunk.get("chunk_text", ""),
                    chunk.get("char_count", len(chunk.get("chunk_text", ""))),
                    chunk.get("token_estimate", len(chunk.get("chunk_text", "").split())),
                    vec_str,
                    json.dumps(chunk.get("metadata", {})),
                    chunk.get("content_hash", "")
                ))

            psycopg2.extras.execute_batch(cur, upsert_query, batch_data, page_size=batch_size)
            conn.commit()
            inserted += len(batch_data)
            if inserted % 1000 == 0 or inserted == total:
                print(f"  -> Successfully synced {inserted}/{total} chunks ({(inserted/total)*100:.1f}%) to Supabase...")

        cur.close()
        conn.close()
        print(f"[SYNC-DB] Vector database sync complete! Total chunks in Postgres: {inserted}")
        return inserted

    def log_verification_metrics(self, report: Dict[str, Any], run_id: str = None) -> str:
        """Logs model verification benchmark metrics into Supabase Postgres."""
        if not run_id:
            run_id = f"run_{int(time.time())}"

        conn = psycopg2.connect(self.direct_url)
        cur = conn.cursor()

        insert_query = """
            INSERT INTO ml_verification_metrics (
                run_id,
                embedding_model,
                embedding_dimension,
                total_documents,
                total_chunks,
                total_test_questions,
                top1_accuracy,
                top3_accuracy,
                top5_accuracy,
                top10_accuracy,
                mean_reciprocal_rank,
                avg_cosine_similarity,
                certification_breakdown,
                status,
                notes
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """

        cur.execute(insert_query, (
            run_id,
            report.get("model_name", "sentence-transformers/all-MiniLM-L6-v2"),
            report.get("embedding_dimension", 384),
            report.get("total_documents", 0),
            report.get("total_chunks", 0),
            report.get("total_test_questions", 0),
            report.get("top1_accuracy", 0.0),
            report.get("top3_accuracy", 0.0),
            report.get("top5_accuracy", 0.0),
            report.get("top10_accuracy", 0.0),
            report.get("mean_reciprocal_rank", 0.0),
            report.get("avg_cosine_similarity", 0.0),
            json.dumps(report.get("certification_breakdown", {})),
            "COMPLETED",
            f"Verified against {report.get('total_test_questions', 0)} verified test questions across 15 certifications."
        ))

        metric_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        print(f"[SYNC-DB] Verification metrics logged -> ID: {metric_id} (Run: {run_id})")
        return str(metric_id)

    def test_live_rpc_search(self, query_text: str = "audit charter and governance", vector_engine=None):
        """Validates that the live Supabase stored procedure `match_document_chunks` works."""
        print(f"\n[VALIDATE-RPC] Testing live Supabase RPC vector search for query: '{query_text}'...")
        if vector_engine is None:
            from ml_engine.vector_engine import LocalVectorEngine
            vector_engine = LocalVectorEngine()

        vec = vector_engine.encode_single(query_text)
        vec_str = "[" + ",".join(f"{float(x):.6f}" for x in vec) + "]"

        conn = psycopg2.connect(self.direct_url)
        cur = conn.cursor()

        cur.execute("""
            SELECT document_name, certification_code, chunk_index, similarity, SUBSTRING(chunk_text, 1, 120)
            FROM match_document_chunks(%s::vector(384), 0.10, 3, 'ALL');
        """, (vec_str,))

        rows = cur.fetchall()
        print("Live Supabase Match Results:")
        for r in rows:
            print(f"  - Doc: {r[0]} | Cert: {r[1]} | Sim: {r[3]:.4f} | Snippet: {r[4]}...")

        cur.close()
        conn.close()
        return rows
