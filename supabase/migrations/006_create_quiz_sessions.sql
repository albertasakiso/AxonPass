-- ===================================================================
-- APILIGU LEARNING PASS — Migration 006: Quiz Sessions
-- ===================================================================

CREATE TABLE IF NOT EXISTS quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id UUID NOT NULL REFERENCES certifications(id),
  domain_id UUID REFERENCES domains(id),
  topic_id UUID REFERENCES topics(id),
  session_type VARCHAR(30) NOT NULL CHECK (session_type IN (
    'practice', 'quick_check', 'module_check', 'domain_practice',
    'exam_simulation', 'endurance_drill', 'repair_set', 'adaptive_review'
  )),
  total_questions INTEGER NOT NULL,
  time_limit_seconds INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_correct INTEGER,
  total_incorrect INTEGER,
  total_skipped INTEGER,
  score_percent DECIMAL(5,2),
  passed BOOLEAN,
  status VARCHAR(20) NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_cert ON quiz_sessions(certification_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON quiz_sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_created ON quiz_sessions(created_at);

ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own sessions" ON quiz_sessions;
CREATE POLICY "Users can manage own sessions"
  ON quiz_sessions FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Session answers (individual question attempts within a session)
CREATE TABLE IF NOT EXISTS session_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_session_id UUID NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id),
  selected_answer CHAR(1) CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN,
  time_taken_seconds DECIMAL(8,2),
  is_flagged BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'unseen' CHECK (status IN ('unseen', 'answered', 'flagged', 'skipped')),
  answered_at TIMESTAMP WITH TIME ZONE,
  client_event_id UUID NOT NULL UNIQUE  -- Idempotency key for offline sync
);

CREATE INDEX IF NOT EXISTS idx_answers_session ON session_answers(quiz_session_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON session_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_client_event ON session_answers(client_event_id);

ALTER TABLE session_answers ENABLE ROW LEVEL SECURITY;

-- Policy uses a join to quiz_sessions to verify ownership
DROP POLICY IF EXISTS "Users can manage own session answers" ON session_answers;
CREATE POLICY "Users can manage own session answers"
  ON session_answers FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quiz_sessions
      WHERE quiz_sessions.id = session_answers.quiz_session_id
      AND quiz_sessions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quiz_sessions
      WHERE quiz_sessions.id = session_answers.quiz_session_id
      AND quiz_sessions.user_id = auth.uid()
    )
  );
