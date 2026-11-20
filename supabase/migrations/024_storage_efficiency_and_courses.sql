-- ===================================================================
-- ANOXPASS — Migration 024: Storage-Efficient Knowledge Units,
-- End-to-End Certification Course Progress & Live Storage Audit RPC
-- 100% Additive / Safe DDL — Zero Destructive Statements
-- ===================================================================

-- -------------------------------------------------------------------
-- 1. Certification Course Progress (End-to-End Lesson & Drill Tracking)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cert_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cert_id VARCHAR(100) NOT NULL,
  completed_lesson_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  concept_check_scores JSONB NOT NULL DEFAULT '{}'::jsonb, -- { "checkId": { "correct": true, "attempts": 1 } }
  completed_drill_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  domain_mastery JSONB NOT NULL DEFAULT '{}'::jsonb,       -- { "domainId": 0..100 }
  last_lesson_id VARCHAR(120),
  total_xp_earned INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, cert_id)
);

CREATE INDEX IF NOT EXISTS idx_cert_course_progress_user
  ON public.cert_course_progress(user_id);

ALTER TABLE public.cert_course_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own cert course progress" ON public.cert_course_progress;
CREATE POLICY "Users can manage own cert course progress"
  ON public.cert_course_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_cert_course_progress_updated_at ON public.cert_course_progress;
CREATE TRIGGER trg_cert_course_progress_updated_at
  BEFORE UPDATE ON public.cert_course_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

-- -------------------------------------------------------------------
-- 2. Ultra-Compact Deduplicated Knowledge Units
--    Replaces bloated float32 pgvector chunks in cloud Postgres with
--    SHA-256 deduplicated distilled summaries + native tsvector FTS.
--    Raw PDFs & dense embeddings stay 100% local in ml_engine/.
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.knowledge_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cert_code VARCHAR(50) NOT NULL,
  domain_code VARCHAR(80),
  title VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  source_ref VARCHAR(255),
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  content_hash CHAR(64) NOT NULL UNIQUE,
  search_vector TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(summary, '')), 'B')
  ) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_units_cert
  ON public.knowledge_units(cert_code);
CREATE INDEX IF NOT EXISTS idx_knowledge_units_fts
  ON public.knowledge_units USING GIN (search_vector);

ALTER TABLE public.knowledge_units ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access to knowledge_units" ON public.knowledge_units;
CREATE POLICY "Public read access to knowledge_units"
  ON public.knowledge_units FOR SELECT TO anon, authenticated
  USING (true);

DROP TRIGGER IF EXISTS trg_knowledge_units_updated_at ON public.knowledge_units;
CREATE TRIGGER trg_knowledge_units_updated_at
  BEFORE UPDATE ON public.knowledge_units
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

-- -------------------------------------------------------------------
-- 3. Read-Only Live Storage Audit RPC
--    Returns per-table MB, index MB, total DB MB, and Storage bucket MB
-- -------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_supabase_storage_audit()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_db_bytes BIGINT;
  v_tables JSONB;
  v_buckets JSONB := '[]'::jsonb;
  v_storage_bytes BIGINT := 0;
BEGIN
  SELECT pg_database_size(current_database()) INTO v_db_bytes;

  SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) INTO v_tables FROM (
    SELECT
      relname::text AS table_name,
      n_live_tup::bigint AS approx_rows,
      ROUND(pg_relation_size(relid) / (1024.0 * 1024.0), 2) AS table_mb,
      ROUND(pg_indexes_size(relid) / (1024.0 * 1024.0), 2) AS index_mb,
      ROUND(pg_total_relation_size(relid) / (1024.0 * 1024.0), 2) AS total_mb
    FROM pg_stat_user_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(relid) DESC
    LIMIT 15
  ) t;

  BEGIN
    SELECT COALESCE(jsonb_agg(b), '[]'::jsonb), COALESCE(SUM(b.bucket_bytes), 0)
    INTO v_buckets, v_storage_bytes
    FROM (
      SELECT
        bucket_id::text AS bucket_id,
        COUNT(*)::bigint AS object_count,
        COALESCE(SUM((metadata->>'size')::bigint), 0)::bigint AS bucket_bytes,
        ROUND(COALESCE(SUM((metadata->>'size')::bigint), 0) / (1024.0 * 1024.0), 2) AS size_mb
      FROM storage.objects
      GROUP BY bucket_id
    ) b;
  EXCEPTION WHEN OTHERS THEN
    v_buckets := '[]'::jsonb;
    v_storage_bytes := 0;
  END;

  RETURN jsonb_build_object(
    'db_total_mb', ROUND(v_db_bytes / (1024.0 * 1024.0), 2),
    'db_free_tier_mb', 500,
    'storage_total_mb', ROUND(v_storage_bytes / (1024.0 * 1024.0), 2),
    'storage_free_tier_mb', 1024,
    'tables', v_tables,
    'buckets', v_buckets,
    'audited_at', NOW()
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_supabase_storage_audit() TO anon, authenticated, service_role;

-- -------------------------------------------------------------------
-- 4. Enroll cert_course_progress in Supabase Realtime Idempotently
-- -------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'cert_course_progress'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.cert_course_progress;
    END IF;
  END IF;
END $$;
