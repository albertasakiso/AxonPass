-- ===================================================================
-- APILIGU LEARNING PASS — Migration 016: Open-Source AI/ML Cognitive Engine
-- Dual-Runtime Knowledge Graph, BKT/IRT Scaled Scoring & Reasoning Tables
-- ===================================================================

-- 1. Create table for ML Knowledge Graph Nodes (All 15 Certifications)
CREATE TABLE IF NOT EXISTS ml_knowledge_nodes (
  id VARCHAR(100) PRIMARY KEY,
  certification_code VARCHAR(50) NOT NULL,
  domain_number INTEGER NOT NULL,
  topic_code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  manual_section VARCHAR(255),
  task_statements TEXT[] DEFAULT '{}',
  knowledge_statements TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  prerequisites TEXT[] DEFAULT '{}',
  related_nodes TEXT[] DEFAULT '{}',
  bm25_tokens TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ml_nodes_cert ON ml_knowledge_nodes (certification_code);
CREATE INDEX IF NOT EXISTS idx_ml_nodes_topic ON ml_knowledge_nodes (topic_code);

-- 2. Create table for Cognitive Decision Operators
CREATE TABLE IF NOT EXISTS ml_cognitive_operators (
  id VARCHAR(100) PRIMARY KEY,
  certification_body VARCHAR(50) NOT NULL,
  operator_keyword VARCHAR(50) NOT NULL,
  decision_rule TEXT NOT NULL,
  distractor_elimination_heuristic TEXT NOT NULL,
  exam_trap_warning TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create table for Bayesian Knowledge Tracing & IRT Parameters per Cert/Domain
CREATE TABLE IF NOT EXISTS ml_bkt_parameters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_code VARCHAR(50) NOT NULL,
  domain_number INTEGER NOT NULL,
  domain_name VARCHAR(255),
  prior_p_l0 NUMERIC(4,3) DEFAULT 0.100,
  transit_p_t NUMERIC(4,3) DEFAULT 0.150,
  slip_p_s NUMERIC(4,3) DEFAULT 0.100,
  guess_p_g NUMERIC(4,3) DEFAULT 0.250,
  irt_a_param NUMERIC(4,2) DEFAULT 1.20,
  irt_b_param NUMERIC(4,2) DEFAULT 0.00,
  passing_score_scaled INTEGER NOT NULL,
  scaled_score_min INTEGER NOT NULL,
  scaled_score_max INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (certification_code, domain_number)
);

-- 4. Create table for AI/ML Cognitive Question Reasoning & Option Breakdown
CREATE TABLE IF NOT EXISTS ml_question_reasoning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  certification_code VARCHAR(50) NOT NULL,
  operator_keyword VARCHAR(50) NOT NULL DEFAULT 'STANDARD',
  matched_node_id VARCHAR(100) REFERENCES ml_knowledge_nodes(id) ON DELETE SET NULL,
  problem_dissection TEXT NOT NULL,
  option_a_verdict VARCHAR(50) NOT NULL,
  option_a_justification TEXT NOT NULL,
  option_b_verdict VARCHAR(50) NOT NULL,
  option_b_justification TEXT NOT NULL,
  option_c_verdict VARCHAR(50) NOT NULL,
  option_c_justification TEXT NOT NULL,
  option_d_verdict VARCHAR(50) NOT NULL,
  option_d_justification TEXT NOT NULL,
  takeaway_rule TEXT NOT NULL,
  exam_trap_heuristic TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (question_id)
);

CREATE INDEX IF NOT EXISTS idx_ml_reasoning_cert ON ml_question_reasoning (certification_code);
CREATE INDEX IF NOT EXISTS idx_ml_reasoning_node ON ml_question_reasoning (matched_node_id);

-- 5. Create table for User-Level BKT State & IRT Scaled Score Tracking
CREATE TABLE IF NOT EXISTS user_ml_bkt_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  certification_code VARCHAR(50) NOT NULL,
  topic_code VARCHAR(50) NOT NULL,
  mastery_probability NUMERIC(5,4) DEFAULT 0.1000,
  total_interactions INTEGER DEFAULT 0,
  consecutive_correct INTEGER DEFAULT 0,
  theta_ability NUMERIC(5,3) DEFAULT 0.000,
  predicted_scaled_score INTEGER DEFAULT 500,
  confidence_interval_low INTEGER DEFAULT 450,
  confidence_interval_high INTEGER DEFAULT 550,
  passing_probability NUMERIC(5,4) DEFAULT 0.5000,
  readiness_category VARCHAR(50) DEFAULT 'BORDERLINE',
  last_interaction_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, certification_code, topic_code)
);

CREATE INDEX IF NOT EXISTS idx_user_bkt_lookup ON user_ml_bkt_state (user_id, certification_code);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE ml_knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_cognitive_operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_bkt_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_question_reasoning ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ml_bkt_state ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
DROP POLICY IF EXISTS "Public read ml_knowledge_nodes" ON ml_knowledge_nodes;
CREATE POLICY "Public read ml_knowledge_nodes" ON ml_knowledge_nodes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read ml_cognitive_operators" ON ml_cognitive_operators;
CREATE POLICY "Public read ml_cognitive_operators" ON ml_cognitive_operators FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read ml_bkt_parameters" ON ml_bkt_parameters;
CREATE POLICY "Public read ml_bkt_parameters" ON ml_bkt_parameters FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read ml_question_reasoning" ON ml_question_reasoning;
CREATE POLICY "Public read ml_question_reasoning" ON ml_question_reasoning FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can read own bkt state" ON user_ml_bkt_state;
CREATE POLICY "Users can read own bkt state" ON user_ml_bkt_state FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert own bkt state" ON user_ml_bkt_state;
CREATE POLICY "Users can upsert own bkt state" ON user_ml_bkt_state FOR ALL USING (auth.uid() = user_id);

-- Allow service role full access
DROP POLICY IF EXISTS "Service role full ml_knowledge_nodes" ON ml_knowledge_nodes;
CREATE POLICY "Service role full ml_knowledge_nodes" ON ml_knowledge_nodes FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full ml_cognitive_operators" ON ml_cognitive_operators;
CREATE POLICY "Service role full ml_cognitive_operators" ON ml_cognitive_operators FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full ml_bkt_parameters" ON ml_bkt_parameters;
CREATE POLICY "Service role full ml_bkt_parameters" ON ml_bkt_parameters FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full ml_question_reasoning" ON ml_question_reasoning;
CREATE POLICY "Service role full ml_question_reasoning" ON ml_question_reasoning FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full user_ml_bkt_state" ON user_ml_bkt_state;
CREATE POLICY "Service role full user_ml_bkt_state" ON user_ml_bkt_state FOR ALL TO service_role USING (true);
