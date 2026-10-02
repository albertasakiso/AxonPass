-- ===================================================================
-- APILIGU LEARNING PASS — Migration 007: Import Tables
-- ===================================================================

CREATE TABLE IF NOT EXISTS import_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('csv', 'json', 'docx', 'xlsx')),
  imported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  parser_version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
  questions_found INTEGER NOT NULL DEFAULT 0,
  questions_flagged INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'parsing', 'review', 'published', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_import_batches_user ON import_batches(user_id);

ALTER TABLE import_batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own import batches" ON import_batches;
CREATE POLICY "Users can manage own import batches"
  ON import_batches FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS import_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
  batch_id UUID NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE,
  flag_type VARCHAR(50) NOT NULL CHECK (flag_type IN (
    'answer_source_conflict', 'possible_duplicate', 'missing_rationale', 'parse_error', 'validation_error'
  )),
  detail_text TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_import_flags_batch ON import_flags(batch_id);
CREATE INDEX IF NOT EXISTS idx_import_flags_resolved ON import_flags(resolved);

ALTER TABLE import_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own import flags" ON import_flags;
CREATE POLICY "Users can manage own import flags"
  ON import_flags FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM import_batches
      WHERE import_batches.id = import_flags.batch_id
      AND import_batches.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM import_batches
      WHERE import_batches.id = import_flags.batch_id
      AND import_batches.user_id = auth.uid()
    )
  );
