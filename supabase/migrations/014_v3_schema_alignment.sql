-- ===================================================================
-- APILIGU LEARNING PASS — Migration 014: v3 Schema Alignment
-- Adds fields required by Technical Requirements Specification v3
-- ===================================================================

-- 1. Extend certifications table with v3-required fields
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS code VARCHAR(20);
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS body VARCHAR(100);
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS format VARCHAR(30) DEFAULT 'fixed_form'
  CHECK (format IN ('fixed_form', 'adaptive_cat'));
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS passing_scaled_score INTEGER;
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS scaled_score_min INTEGER DEFAULT 200;
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS scaled_score_max INTEGER DEFAULT 800;
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS study_mastery_threshold_pct DECIMAL(5,2) DEFAULT 80.00;

-- Backfill code/body for existing certifications
UPDATE certifications SET code = 'CISA', body = 'ISACA' WHERE slug = 'cisa';
UPDATE certifications SET code = 'CC', body = 'ISC2' WHERE slug = 'isc2-cc';
UPDATE certifications SET code = 'SAA-C03', body = 'AWS' WHERE slug = 'aws-csaa';
UPDATE certifications SET code = 'NIST-GRC', body = 'NIST' WHERE slug = 'nist-grc';

-- 2. Add code column to domains
ALTER TABLE domains ADD COLUMN IF NOT EXISTS code VARCHAR(10);

-- Backfill CISA domain codes
UPDATE domains SET code = CAST(domain_number AS VARCHAR) WHERE certification_id = 'a0000000-0000-0000-0000-000000000001';

-- 3. Create case_studies table (v3 §6.2)
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  title VARCHAR(300) NOT NULL,
  scenario_text TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_studies_domain ON case_studies(domain_id);

ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read case_studies" ON case_studies;
CREATE POLICY "Authenticated users can read case_studies"
  ON case_studies FOR SELECT TO authenticated USING (true);

-- 4. Create case_study_questions table (v3 §6.2)
CREATE TABLE IF NOT EXISTS case_study_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_study_id UUID NOT NULL REFERENCES case_studies(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  stem TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  rationale TEXT,
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_csq_case_study ON case_study_questions(case_study_id);

ALTER TABLE case_study_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read case_study_questions" ON case_study_questions;
CREATE POLICY "Authenticated users can read case_study_questions"
  ON case_study_questions FOR SELECT TO authenticated USING (true);

-- 5. Create notifications_log table (v3 §6.2)
CREATE TABLE IF NOT EXISTS notifications_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200),
  body TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  dismissed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_log_user ON notifications_log(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_log_type ON notifications_log(type);

ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own notifications_log" ON notifications_log;
CREATE POLICY "Users can manage own notifications_log"
  ON notifications_log FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Add rich fields to study_materials (v3 §6.2 expanded fields)
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS document_title VARCHAR(300);
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS edition VARCHAR(50);
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS chapter_number INTEGER;
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS section_number VARCHAR(20);
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS page_start INTEGER;
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS page_end INTEGER;
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS estimated_read_minutes INTEGER;
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS file_reference VARCHAR(500);
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS key_takeaways TEXT;
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS exam_tips TEXT;
