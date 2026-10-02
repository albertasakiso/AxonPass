-- ===================================================================
-- AXONPASS — Migration 019: Strict Certification Isolation & Free-Tier Auto-Cleaner
-- Ensures 0% Cross-Cert Bleed & Enforces Supabase Free-Tier Resource Quotas
-- ===================================================================

-- 1. STRICT CERTIFICATION-ISOLATED VECTOR MATCHING RPC
-- Guarantees CISA chunks never bleed into FIFA, CISSP, AWS, or NIST
CREATE OR REPLACE FUNCTION match_document_chunks (
  query_embedding vector(384),
  match_threshold float DEFAULT 0.25,
  match_count int DEFAULT 5,
  filter_cert varchar(50) DEFAULT 'CISA'
)
RETURNS TABLE (
  id uuid,
  document_name varchar(255),
  document_path text,
  certification_code varchar(50),
  chunk_index int,
  chunk_text text,
  char_count int,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_cert varchar(50);
BEGIN
  -- Normalize certification code to ensure strict track isolation
  v_cert := UPPER(TRIM(COALESCE(filter_cert, 'CISA')));
  
  -- Prevent wildcard leaks: If invalid or 'ALL', fall back to 'CISA'
  IF v_cert = 'ALL' OR v_cert = '' THEN
    v_cert := 'CISA';
  END IF;

  RETURN QUERY
  SELECT
    dc.id,
    dc.document_name,
    dc.document_path,
    dc.certification_code,
    dc.chunk_index,
    dc.chunk_text,
    dc.char_count,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  WHERE 
    dc.certification_code = v_cert
    AND dc.embedding IS NOT NULL
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 2. SUPABASE FREE-TIER STORAGE & QUOTA METRICS RPC
CREATE OR REPLACE FUNCTION get_database_storage_metrics()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_db_bytes bigint;
  v_db_pretty text;
  v_free_tier_cap bigint := 524288000; -- 500 MB Free Tier Hard Quota
  v_pct_used numeric;
  v_tables jsonb;
  v_ledger_count int;
  v_ledger_size bigint;
BEGIN
  SELECT pg_database_size(current_database()) INTO v_db_bytes;
  SELECT pg_size_pretty(v_db_bytes) INTO v_db_pretty;
  v_pct_used := ROUND(((v_db_bytes::numeric / v_free_tier_cap::numeric) * 100), 2);

  -- Get top 10 tables
  SELECT jsonb_agg(t) INTO v_tables FROM (
    SELECT 
      table_name::text,
      pg_size_pretty(pg_total_relation_size(quote_ident(table_name)))::text as size_pretty,
      pg_total_relation_size(quote_ident(table_name))::bigint as size_bytes
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC
    LIMIT 10
  ) t;

  -- Ledger counts
  SELECT count(*), coalesce(sum(file_size_bytes), 0) 
  INTO v_ledger_count, v_ledger_size 
  FROM public.document_ingestion_ledger;

  RETURN jsonb_build_object(
    'total_database_bytes', v_db_bytes,
    'total_database_pretty', v_db_pretty,
    'free_tier_cap_bytes', v_free_tier_cap,
    'free_tier_cap_pretty', '500 MB',
    'percent_used', v_pct_used,
    'top_tables', COALESCE(v_tables, '[]'::jsonb),
    'ingested_documents_count', v_ledger_count,
    'ingested_documents_bytes', v_ledger_size,
    'ingested_documents_pretty', pg_size_pretty(v_ledger_size),
    'timestamp', now()
  );
END;
$$;

-- 3. TRANSIENT LOGS & CACHE AUTO-CLEANSER RPC
-- Purges old transient telemetry and temporary logs to preserve Free-Tier disk quota
CREATE OR REPLACE FUNCTION clean_transient_logs_and_optimize()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted_audits int := 0;
  v_deleted_notifications int := 0;
  v_deleted_batches int := 0;
  v_bytes_freed bigint := 0;
  v_db_bytes_before bigint;
  v_db_bytes_after bigint;
BEGIN
  SELECT pg_database_size(current_database()) INTO v_db_bytes_before;

  -- 1. Purge audit events older than 7 days
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_events') THEN
    DELETE FROM public.audit_events WHERE created_at < NOW() - INTERVAL '7 days';
    GET DIAGNOSTICS v_deleted_audits = ROW_COUNT;
  END IF;

  -- 2. Purge notifications log older than 7 days
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications_log') THEN
    DELETE FROM public.notifications_log WHERE created_at < NOW() - INTERVAL '7 days';
    GET DIAGNOSTICS v_deleted_notifications = ROW_COUNT;
  END IF;

  -- 3. Purge completed import batches older than 14 days
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'import_batches') THEN
    DELETE FROM public.import_batches WHERE status = 'completed' AND created_at < NOW() - INTERVAL '14 days';
    GET DIAGNOSTICS v_deleted_batches = ROW_COUNT;
  END IF;

  SELECT pg_database_size(current_database()) INTO v_db_bytes_after;
  v_bytes_freed := GREATEST(0, v_db_bytes_before - v_db_bytes_after);

  RETURN jsonb_build_object(
    'status', 'SUCCESS',
    'deleted_audit_events', v_deleted_audits,
    'deleted_notifications', v_deleted_notifications,
    'deleted_import_batches', v_deleted_batches,
    'bytes_freed', v_bytes_freed,
    'database_size_pretty', pg_size_pretty(v_db_bytes_after),
    'cleaned_at', now()
  );
END;
$$;

-- 4. Grant execute permissions
GRANT EXECUTE ON FUNCTION match_document_chunks TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_database_storage_metrics TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION clean_transient_logs_and_optimize TO anon, authenticated, service_role;
