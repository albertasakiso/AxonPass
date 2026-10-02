-- ===================================================================
-- APILIGU LEARNING PASS — Migration 002: Domains
-- ===================================================================

CREATE TABLE IF NOT EXISTS domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  domain_number INTEGER NOT NULL,
  name VARCHAR(300) NOT NULL,
  exam_weight_percent DECIMAL(5,2) NOT NULL,
  approx_exam_questions INTEGER NOT NULL,
  part_a_title VARCHAR(200),
  part_b_title VARCHAR(200),
  learning_objectives TEXT,
  suggested_resources TEXT,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(certification_id, domain_number)
);

CREATE INDEX IF NOT EXISTS idx_domains_certification ON domains(certification_id);

ALTER TABLE domains ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read domains" ON domains;
CREATE POLICY "Authenticated users can read domains"
  ON domains FOR SELECT
  TO authenticated
  USING (true);
