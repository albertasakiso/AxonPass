-- ===================================================================
-- ANOXPASS — Storage Reclamation Plan (DRY-RUN AUDIT + COMMENTED PLAN)
-- DO NOT EXECUTE DESTRUCTIVE STATEMENTS WITHOUT EXPLICIT USER APPROVAL!
--
-- Audit Findings (2026-11-19):
--   1. Supabase Storage bucket `my_documents`: 366 objects = 1,842.98 MB
--      (Exceeds 1,024 MB Free Tier Storage quota at 180%!)
--      -> All raw PDFs/DOCX/books already live locally in `my_documents/`
--         and are indexed locally by `ml_engine/rag_engine.py`.
--   2. Postgres `public.document_chunks`: 122.14 MB (table 25 MB, idx 54 MB)
--      -> Dense float32 pgvector embeddings & raw chunks can stay 100% local
--         in `ml_engine/` while cloud Postgres stores compact `knowledge_units`.
--   3. Postgres `public.questions`: 109.34 MB
--      -> Inspect for duplicate question stems or oversized rationale blobs.
-- ===================================================================

-- -------------------------------------------------------------------
-- STEP 1: SAFE READ-ONLY DRY-RUN AUDIT (Always safe to run)
-- -------------------------------------------------------------------
SELECT public.get_supabase_storage_audit();

-- Inspect largest objects in `my_documents` Storage bucket (read-only):
SELECT
  bucket_id,
  name,
  ROUND(((metadata->>'size')::bigint) / (1024.0 * 1024.0), 2) AS size_mb
FROM storage.objects
WHERE bucket_id = 'my_documents'
ORDER BY ((metadata->>'size')::bigint) DESC
LIMIT 25;

-- -------------------------------------------------------------------
-- STEP 2: COMMENTED RECLAMATION PLAN (UNCOMMENT ONLY AFTER USER CONSENT)
-- -------------------------------------------------------------------

-- [A] Reclaim ~122 MB from Postgres `document_chunks` after verifying local RAG index:
-- TRUNCATE TABLE public.document_chunks;
-- VACUUM FULL ANALYZE public.document_chunks;

-- [B] Reclaim 1,842.98 MB from Supabase Storage bucket `my_documents`:
--     Recommended: Use Supabase Dashboard -> Storage -> `my_documents` -> Empty bucket,
--     or Supabase Storage API (`supabase.storage.from('my_documents').remove([...])`)
--     so both object metadata and underlying S3/R2 blobs are cleanly purged.
--     (Direct SQL DELETE on `storage.objects` is NOT recommended by Supabase.)

-- [C] Reclaim dead tuples after cleanup:
-- VACUUM ANALYZE public.questions;
-- VACUUM ANALYZE public.knowledge_units;
