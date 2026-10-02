-- ===================================================================
-- APILIGU LEARNING PASS — Migration 003: Topics & Subtopics
-- ===================================================================

CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  topic_code VARCHAR(20) NOT NULL,
  name VARCHAR(300) NOT NULL,
  part VARCHAR(10) NOT NULL CHECK (part IN ('A', 'B')),
  content_summary TEXT,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(domain_id, topic_code)
);

CREATE INDEX IF NOT EXISTS idx_topics_domain ON topics(domain_id);

CREATE TABLE IF NOT EXISTS subtopics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  subtopic_code VARCHAR(20) NOT NULL,
  name VARCHAR(300) NOT NULL,
  content_body TEXT,
  key_terms TEXT[] DEFAULT '{}',
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(topic_id, subtopic_code)
);

CREATE INDEX IF NOT EXISTS idx_subtopics_topic ON subtopics(topic_id);

ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtopics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read topics" ON topics;
CREATE POLICY "Authenticated users can read topics"
  ON topics FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can read subtopics" ON subtopics;
CREATE POLICY "Authenticated users can read subtopics"
  ON subtopics FOR SELECT TO authenticated USING (true);
