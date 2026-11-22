-- ===================================================================
-- ANOXPASS — Migration 026: Full Book-Structured Textbook Curriculum
-- & Realtime Cross-Device Reading / Read-Aloud Progress
-- 100% Additive / Safe DDL — Zero Destructive Statements
-- ===================================================================

-- -------------------------------------------------------------------
-- 0. Ensure CompTIA Security+ (SY0-701) Parity in `public.certifications` & `public.domains`
-- -------------------------------------------------------------------
INSERT INTO public.certifications (
  slug, code, body, name, version, publisher, format,
  total_domains, total_exam_questions, exam_duration_minutes,
  passing_score_percent, passing_scaled_score, scaled_score_min, scaled_score_max,
  study_mastery_threshold_pct, description
)
VALUES (
  'comptia-security-plus',
  'SEC+',
  'CompTIA',
  'CompTIA Security+ (SY0-701)',
  'SY0-701',
  'CompTIA',
  'fixed_form',
  5,
  90,
  90,
  83,
  750,
  100,
  900,
  85,
  'Global baseline cybersecurity certification covering General Security Concepts, Threats/Vulnerabilities/Mitigations, Security Architecture, Security Operations, and Security Program Management & Oversight.'
)
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
  v_sec_id UUID;
BEGIN
  SELECT id INTO v_sec_id FROM public.certifications WHERE slug = 'comptia-security-plus' LIMIT 1;
  IF v_sec_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.domains WHERE certification_id = v_sec_id) THEN
    INSERT INTO public.domains (certification_id, domain_number, code, name, exam_weight_percent, approx_exam_questions, sort_order, learning_objectives)
    VALUES
      (v_sec_id, 1, '1', 'General Security Concepts', 12, 11, 1, 'Security controls, fundamental security concepts (CIA, AAA, Zero Trust), change management, and cryptographic solutions.'),
      (v_sec_id, 2, '2', 'Threats, Vulnerabilities, and Mitigations', 22, 20, 2, 'Threat actors and motivations, threat vectors and attack surfaces, vulnerabilities, indicators of malicious activity, and mitigation techniques.'),
      (v_sec_id, 3, '3', 'Security Architecture', 18, 16, 3, 'Security implications of architecture models, securing enterprise infrastructure, data protection strategies, and resilience/recovery.'),
      (v_sec_id, 4, '4', 'Security Operations', 28, 25, 4, 'Securing computing resources, asset/vulnerability management, security alerting and monitoring, IAM, automation, and incident response.'),
      (v_sec_id, 5, '5', 'Security Program Management and Oversight', 20, 18, 5, 'Security governance, risk management, third-party risk assessment, security compliance, audits, and security awareness.');
  END IF;
END $$;

-- -------------------------------------------------------------------
-- 1. Textbooks (Authoritative Books & Study Guides per Certification)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.textbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_slug TEXT NOT NULL,
  certification_id UUID REFERENCES public.certifications(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  author TEXT,
  edition TEXT,
  source_file TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT true,
  total_chapters INTEGER NOT NULL DEFAULT 0,
  total_sections INTEGER NOT NULL DEFAULT 0,
  total_words INTEGER NOT NULL DEFAULT 0,
  est_read_hours NUMERIC(5,1) NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  content_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_textbooks_cert_sort
  ON public.textbooks(certification_slug, sort_order);

ALTER TABLE public.textbooks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access to textbooks" ON public.textbooks;
CREATE POLICY "Public read access to textbooks"
  ON public.textbooks FOR SELECT TO anon, authenticated
  USING (true);

-- -------------------------------------------------------------------
-- 2. Textbook Chapters (Part / Chapter / Domain / Learning Objectives)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.textbook_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  textbook_id UUID NOT NULL REFERENCES public.textbooks(id) ON DELETE CASCADE,
  certification_slug TEXT NOT NULL,
  domain_number INTEGER,
  chapter_number INTEGER NOT NULL,
  part_label TEXT,
  title TEXT NOT NULL,
  summary TEXT,
  learning_objectives TEXT[] NOT NULL DEFAULT '{}'::text[],
  key_takeaways TEXT[] NOT NULL DEFAULT '{}'::text[],
  page_start INTEGER,
  page_end INTEGER,
  word_count INTEGER NOT NULL DEFAULT 0,
  est_read_minutes INTEGER NOT NULL DEFAULT 15,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(textbook_id, chapter_number, sort_order)
);

CREATE INDEX IF NOT EXISTS idx_textbook_chapters_cert_sort
  ON public.textbook_chapters(certification_slug, textbook_id, sort_order);

ALTER TABLE public.textbook_chapters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access to textbook_chapters" ON public.textbook_chapters;
CREATE POLICY "Public read access to textbook_chapters"
  ON public.textbook_chapters FOR SELECT TO anon, authenticated
  USING (true);

-- -------------------------------------------------------------------
-- 3. Textbook Sections (Full Unabridged Book Subchapters & FTS Index)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.textbook_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES public.textbook_chapters(id) ON DELETE CASCADE,
  textbook_id UUID NOT NULL REFERENCES public.textbooks(id) ON DELETE CASCADE,
  certification_slug TEXT NOT NULL,
  section_code TEXT,
  title TEXT NOT NULL,
  heading_level INTEGER NOT NULL DEFAULT 2,
  content_markdown TEXT NOT NULL,
  word_count INTEGER NOT NULL DEFAULT 0,
  est_read_minutes INTEGER NOT NULL DEFAULT 8,
  key_terms TEXT[] NOT NULL DEFAULT '{}'::text[],
  exam_tips TEXT,
  page_start INTEGER,
  page_end INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  content_hash TEXT NOT NULL UNIQUE,
  search_tsv TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content_markdown, '')), 'B')
  ) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_textbook_sections_chapter_sort
  ON public.textbook_sections(chapter_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_textbook_sections_cert
  ON public.textbook_sections(certification_slug);
CREATE INDEX IF NOT EXISTS idx_textbook_sections_fts
  ON public.textbook_sections USING GIN (search_tsv);

ALTER TABLE public.textbook_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access to textbook_sections" ON public.textbook_sections;
CREATE POLICY "Public read access to textbook_sections"
  ON public.textbook_sections FOR SELECT TO anon, authenticated
  USING (true);

-- -------------------------------------------------------------------
-- 4. User Reading Progress (Realtime: Status, Audio Sentence, Highlights, Notes)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_slug TEXT NOT NULL,
  textbook_id UUID NOT NULL REFERENCES public.textbooks(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES public.textbook_chapters(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES public.textbook_sections(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'in_progress', 'completed', 'relearn')),
  scroll_pct INTEGER NOT NULL DEFAULT 0,
  last_sentence_index INTEGER NOT NULL DEFAULT 0,
  highlights_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes_markdown TEXT NOT NULL DEFAULT '',
  bookmarked BOOLEAN NOT NULL DEFAULT false,
  chapter_quiz_best_pct INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, section_id)
);

CREATE INDEX IF NOT EXISTS idx_user_reading_progress_user_cert
  ON public.user_reading_progress(user_id, certification_slug);

ALTER TABLE public.user_reading_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own reading progress" ON public.user_reading_progress;
CREATE POLICY "Users can manage own reading progress"
  ON public.user_reading_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_user_reading_progress_updated_at ON public.user_reading_progress;
CREATE TRIGGER trg_user_reading_progress_updated_at
  BEFORE UPDATE ON public.user_reading_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

-- -------------------------------------------------------------------
-- 5. Enroll `user_reading_progress` in Supabase Realtime Publication
-- -------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'user_reading_progress'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.user_reading_progress;
    END IF;
  END IF;
END $$;
