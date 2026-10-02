-- ===================================================================
-- APILIGU LEARNING PASS — Migration 008: App Config, Study Materials, Glossary, Notifications & Audit
-- ===================================================================

-- Study Materials
CREATE TABLE IF NOT EXISTS study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  title VARCHAR(300) NOT NULL,
  content_type VARCHAR(20) NOT NULL DEFAULT 'text' CHECK (content_type IN ('text', 'diagram', 'table', 'glossary')),
  content_body TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_materials_cert ON study_materials(certification_id);
CREATE INDEX IF NOT EXISTS idx_study_materials_domain ON study_materials(domain_id);

ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read study materials" ON study_materials;
CREATE POLICY "Authenticated users can read study materials"
  ON study_materials FOR SELECT TO authenticated USING (true);

-- Glossary Terms
CREATE TABLE IF NOT EXISTS glossary_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  term VARCHAR(200) NOT NULL,
  acronym VARCHAR(20),
  definition TEXT NOT NULL,
  domain_id UUID REFERENCES domains(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_glossary_cert ON glossary_terms(certification_id);

ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read glossary terms" ON glossary_terms;
CREATE POLICY "Authenticated users can read glossary terms"
  ON glossary_terms FOR SELECT TO authenticated USING (true);

-- Notification Preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('study_reminder', 'break_reminder', 'review_due', 'goal_reminder')),
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  schedule_time VARCHAR(10) DEFAULT '18:00',
  schedule_days INTEGER[] DEFAULT '{1,2,3,4,5}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, type)
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own notification preferences" ON notification_preferences;
CREATE POLICY "Users can manage own notification preferences"
  ON notification_preferences FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Audit Events
CREATE TABLE IF NOT EXISTS audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_events_user ON audit_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_created ON audit_events(created_at);

ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own audit events" ON audit_events;
CREATE POLICY "Users can view own audit events"
  ON audit_events FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own audit events" ON audit_events;
CREATE POLICY "Users can insert own audit events"
  ON audit_events FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- App Config
CREATE TABLE IF NOT EXISTS app_config (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read app config" ON app_config;
CREATE POLICY "Authenticated users can read app config"
  ON app_config FOR SELECT TO authenticated USING (true);

-- Seed default app config
INSERT INTO app_config (key, value, description)
VALUES
  ('passing_score_percent', '80', 'Minimum passing score threshold'),
  ('time_reduction_factor', '0.85', 'Timer reduction multiplier (-15%)'),
  ('adaptive_review_threshold', '80', 'Score threshold to trigger review'),
  ('mastery_levels', '{"not_started": 0, "learning": 25, "proficient": 60, "mastered": 85}', 'Mastery score thresholds'),
  ('break_reminder_minutes', '45', 'Break reminder interval in minutes')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
