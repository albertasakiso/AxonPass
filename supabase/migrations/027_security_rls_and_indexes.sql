-- ===================================================================
-- ANOXPASS — Migration 027: Security Hardening (RLS) & Query Indexes
-- 100% Additive / Non-Destructive DDL
-- ===================================================================

-- 1. Enable RLS on legacy public.reading_progress so 0 public tables lack RLS
ALTER TABLE IF EXISTS public.reading_progress ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'reading_progress' AND column_name = 'user_id'
  ) THEN
    DROP POLICY IF EXISTS "Users manage own legacy reading_progress" ON public.reading_progress;
    CREATE POLICY "Users manage own legacy reading_progress"
      ON public.reading_progress FOR ALL TO authenticated
      USING (auth.uid()::text = user_id::text)
      WITH CHECK (auth.uid()::text = user_id::text);
  END IF;
END $$;

-- 2. Ensure public read access policies exist for client-queried knowledge & synthesized tables
ALTER TABLE IF EXISTS public.ml_knowledge_nodes ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ml_knowledge_nodes' AND cmd = 'SELECT'
  ) THEN
    CREATE POLICY "Public read ml_knowledge_nodes"
      ON public.ml_knowledge_nodes FOR SELECT TO anon, authenticated
      USING (true);
  END IF;
END $$;

ALTER TABLE IF EXISTS public.synthesized_lessons ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'synthesized_lessons' AND cmd = 'SELECT'
  ) THEN
    CREATE POLICY "Public read synthesized_lessons"
      ON public.synthesized_lessons FOR SELECT TO anon, authenticated
      USING (true);
  END IF;
END $$;

ALTER TABLE IF EXISTS public.synthesized_exam_questions ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'synthesized_exam_questions' AND cmd = 'SELECT'
  ) THEN
    CREATE POLICY "Public read synthesized_exam_questions"
      ON public.synthesized_exam_questions FOR SELECT TO anon, authenticated
      USING (true);
  END IF;
END $$;

-- 3. Composite indexes for fast filtered quizzes, textbook reading, and concept graph loads
CREATE INDEX IF NOT EXISTS idx_questions_cert_domain_active
  ON public.questions(certification_id, domain_id)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_textbook_sections_cert_ch_sort
  ON public.textbook_sections(certification_slug, chapter_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_synthesized_lessons_cert
  ON public.synthesized_lessons(cert_id, domain_name);

CREATE INDEX IF NOT EXISTS idx_synthesized_exam_questions_cert
  ON public.synthesized_exam_questions(cert_id, domain_name);

CREATE INDEX IF NOT EXISTS idx_ml_knowledge_nodes_cert
  ON public.ml_knowledge_nodes(certification_code, domain_number);
