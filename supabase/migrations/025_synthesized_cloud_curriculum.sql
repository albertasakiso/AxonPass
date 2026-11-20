-- ===================================================================
-- ANOXPASS — Migration 025: Ollama-Synthesized Cloud Curriculum
-- Ultra-compact text/JSON tables for learn-from-anywhere without
-- local Ollama running (ZERO vectors, ZERO raw PDF blobs).
-- Also aligns `knowledge_units` columns with `compact_supabase_ingest.py`.
-- ===================================================================

-- -------------------------------------------------------------------
-- 0. Align `knowledge_units` with `scripts/compact_supabase_ingest.py`
-- -------------------------------------------------------------------
ALTER TABLE public.knowledge_units
  ALTER COLUMN title SET DEFAULT '',
  ALTER COLUMN summary SET DEFAULT '';

ALTER TABLE public.knowledge_units
  ADD COLUMN IF NOT EXISTS domain_number INTEGER,
  ADD COLUMN IF NOT EXISTS unit_type VARCHAR(50) DEFAULT 'concept',
  ADD COLUMN IF NOT EXISTS source_doc TEXT,
  ADD COLUMN IF NOT EXISTS content TEXT;

-- -------------------------------------------------------------------
-- 1. Synthesized Lessons (Ollama-distilled structured lessons)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.synthesized_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cert_id VARCHAR(100) NOT NULL,
  domain_name VARCHAR(200) NOT NULL,
  lesson_slug VARCHAR(200) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_hash TEXT NOT NULL UNIQUE,
  source_refs TEXT[] NOT NULL DEFAULT '{}'::text[],
  model_name TEXT NOT NULL DEFAULT 'anoxpass-coach',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_synthesized_lessons_cert
  ON public.synthesized_lessons(cert_id);
CREATE INDEX IF NOT EXISTS idx_synthesized_lessons_slug
  ON public.synthesized_lessons(cert_id, lesson_slug);

ALTER TABLE public.synthesized_lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access to synthesized_lessons" ON public.synthesized_lessons;
CREATE POLICY "Public read access to synthesized_lessons"
  ON public.synthesized_lessons FOR SELECT TO anon, authenticated
  USING (true);

DROP TRIGGER IF EXISTS trg_synthesized_lessons_updated_at ON public.synthesized_lessons;
CREATE TRIGGER trg_synthesized_lessons_updated_at
  BEFORE UPDATE ON public.synthesized_lessons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

-- -------------------------------------------------------------------
-- 2. Synthesized Exam Questions (Ollama-distilled practice bank)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.synthesized_exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cert_id VARCHAR(100) NOT NULL,
  domain_name VARCHAR(200) NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'intermediate',
  question_text TEXT NOT NULL,
  options_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_index INTEGER NOT NULL CHECK (correct_index >= 0),
  rationale TEXT NOT NULL,
  exam_trap TEXT,
  content_hash TEXT NOT NULL UNIQUE,
  source_ref TEXT,
  model_name TEXT NOT NULL DEFAULT 'anoxpass-coach',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_synthesized_questions_cert
  ON public.synthesized_exam_questions(cert_id);
CREATE INDEX IF NOT EXISTS idx_synthesized_questions_domain
  ON public.synthesized_exam_questions(cert_id, domain_name);

ALTER TABLE public.synthesized_exam_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access to synthesized_exam_questions" ON public.synthesized_exam_questions;
CREATE POLICY "Public read access to synthesized_exam_questions"
  ON public.synthesized_exam_questions FOR SELECT TO anon, authenticated
  USING (true);

-- -------------------------------------------------------------------
-- 3. Synthesized Mock Exams (Timed Blueprint Exams)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.synthesized_mock_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cert_id VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  time_limit_minutes INTEGER NOT NULL DEFAULT 90,
  passing_score_pct INTEGER NOT NULL DEFAULT 75,
  question_ids UUID[] NOT NULL DEFAULT '{}'::uuid[],
  domain_weights JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_synthesized_mock_exams_cert
  ON public.synthesized_mock_exams(cert_id);

ALTER TABLE public.synthesized_mock_exams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access to synthesized_mock_exams" ON public.synthesized_mock_exams;
CREATE POLICY "Public read access to synthesized_mock_exams"
  ON public.synthesized_mock_exams FOR SELECT TO anon, authenticated
  USING (true);

-- -------------------------------------------------------------------
-- 4. Synthesis Jobs (Live Progress Tracker for Local Ollama Pipeline)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.synthesis_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cert_id VARCHAR(100) NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'running', 'completed', 'failed', 'paused')),
  total_units INTEGER NOT NULL DEFAULT 0,
  completed_units INTEGER NOT NULL DEFAULT 0,
  lessons_created INTEGER NOT NULL DEFAULT 0,
  questions_created INTEGER NOT NULL DEFAULT 0,
  est_db_mb NUMERIC(8,3) NOT NULL DEFAULT 0,
  model_name TEXT NOT NULL DEFAULT 'anoxpass-coach',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_synthesis_jobs_cert
  ON public.synthesis_jobs(cert_id);

ALTER TABLE public.synthesis_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access to synthesis_jobs" ON public.synthesis_jobs;
CREATE POLICY "Public read access to synthesis_jobs"
  ON public.synthesis_jobs FOR SELECT TO anon, authenticated
  USING (true);

DROP TRIGGER IF EXISTS trg_synthesis_jobs_updated_at ON public.synthesis_jobs;
CREATE TRIGGER trg_synthesis_jobs_updated_at
  BEFORE UPDATE ON public.synthesis_jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

-- -------------------------------------------------------------------
-- 5. Enroll New Tables in Supabase Realtime Idempotently
-- -------------------------------------------------------------------
DO $$
DECLARE
  tbl TEXT;
  realtime_tables TEXT[] := ARRAY[
    'synthesized_lessons',
    'synthesized_exam_questions',
    'synthesized_mock_exams',
    'synthesis_jobs'
  ];
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    FOREACH tbl IN ARRAY realtime_tables LOOP
      IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = tbl
      ) THEN
        EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', tbl);
      END IF;
    END LOOP;
  END IF;
END $$;
