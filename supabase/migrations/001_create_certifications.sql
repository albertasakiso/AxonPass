-- ===================================================================
-- APILIGU LEARNING PASS — Migration 001: Certifications
-- ===================================================================

CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  version VARCHAR(20) NOT NULL,
  publisher VARCHAR(100) NOT NULL,
  total_domains INTEGER NOT NULL,
  total_exam_questions INTEGER NOT NULL,
  exam_duration_minutes INTEGER NOT NULL,
  passing_score_percent DECIMAL(5,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read certifications
DROP POLICY IF EXISTS "Authenticated users can read certifications" ON certifications;
CREATE POLICY "Authenticated users can read certifications"
  ON certifications FOR SELECT
  TO authenticated
  USING (true);
