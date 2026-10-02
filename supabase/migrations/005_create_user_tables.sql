-- ===================================================================
-- APILIGU LEARNING PASS — Migration 005: User Tables
-- ===================================================================

-- Profile created on first sign-in (mirrors auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(200),
  selected_certification_id UUID REFERENCES certifications(id),
  daily_study_goal_minutes INTEGER NOT NULL DEFAULT 60,
  timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
  onboarding_state VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (onboarding_state IN ('pending', 'in_progress', 'completed')),
  role VARCHAR(20) NOT NULL DEFAULT 'owner' CHECK (role IN ('owner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- User progress (Leitner box tracking per question)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  domain_id UUID NOT NULL REFERENCES domains(id),
  topic_id UUID REFERENCES topics(id),
  box_level INTEGER NOT NULL DEFAULT 0 CHECK (box_level BETWEEN 0 AND 4),
  consecutive_correct INTEGER NOT NULL DEFAULT 0,
  times_seen INTEGER NOT NULL DEFAULT 0,
  times_correct INTEGER NOT NULL DEFAULT 0,
  last_seen_at TIMESTAMP WITH TIME ZONE,
  next_review_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_domain ON user_progress(domain_id);
CREATE INDEX IF NOT EXISTS idx_progress_box ON user_progress(box_level);
CREATE INDEX IF NOT EXISTS idx_progress_review ON user_progress(next_review_at);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own progress" ON user_progress;
CREATE POLICY "Users can manage own progress"
  ON user_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
