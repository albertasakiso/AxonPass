-- ===================================================================
-- APILIGU LEARNING PASS — Migration 004: Questions
-- ===================================================================

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id),
  subtopic_id UUID REFERENCES subtopics(id),
  question_number INTEGER NOT NULL,
  question_type VARCHAR(20) NOT NULL DEFAULT 'mcq' CHECK (question_type IN ('mcq', 'scenario', 'case_study')),
  stem TEXT NOT NULL,
  scenario_text TEXT,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  rationale TEXT NOT NULL,
  incorrect_rationale_a TEXT,
  incorrect_rationale_b TEXT,
  incorrect_rationale_c TEXT,
  incorrect_rationale_d TEXT,
  difficulty VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  task_statement VARCHAR(10),
  tags TEXT[] DEFAULT '{}',
  source_reference VARCHAR(200),
  source_confidence VARCHAR(20) NOT NULL DEFAULT 'unverified' CHECK (source_confidence IN ('verified', 'unverified')),
  content_hash VARCHAR(64),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_certification ON questions(certification_id);
CREATE INDEX IF NOT EXISTS idx_questions_domain ON questions(domain_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);
CREATE INDEX IF NOT EXISTS idx_questions_hash ON questions(content_hash);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read questions" ON questions;
CREATE POLICY "Authenticated users can read questions"
  ON questions FOR SELECT TO authenticated USING (true);

-- Task statements table
CREATE TABLE IF NOT EXISTS task_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  task_code VARCHAR(10) NOT NULL,
  description TEXT NOT NULL,
  related_domains INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(certification_id, task_code)
);

ALTER TABLE task_statements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read task_statements" ON task_statements;
CREATE POLICY "Authenticated users can read task_statements"
  ON task_statements FOR SELECT TO authenticated USING (true);
