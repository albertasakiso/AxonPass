-- ===================================================================
-- ANOXPASS — Migration 023: Mastery Paths, Skill Academies,
-- Book Mastery, FSRS v4.5, Gamification, AI Coach Sessions & Realtime
-- 100% Open-Source Supabase Postgres + Row-Level Security + Realtime
-- ===================================================================

-- -------------------------------------------------------------------
-- 1. Certification Path Progress (Difficulty Tiers 1–5 Roadmaps)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certification_path_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  path_id VARCHAR(100) NOT NULL,
  difficulty_tier INTEGER NOT NULL DEFAULT 1 CHECK (difficulty_tier BETWEEN 1 AND 5),
  status VARCHAR(30) NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'exam_ready', 'certified')),
  completed_milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  readiness_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (readiness_score BETWEEN 0 AND 100),
  hours_logged NUMERIC(7,2) NOT NULL DEFAULT 0,
  target_exam_date DATE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, path_id)
);

CREATE INDEX IF NOT EXISTS idx_cert_path_progress_user
  ON public.certification_path_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_cert_path_progress_tier
  ON public.certification_path_progress(difficulty_tier);

ALTER TABLE public.certification_path_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own certification path progress" ON public.certification_path_progress;
CREATE POLICY "Users can manage own certification path progress"
  ON public.certification_path_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------------------
-- 2. Academy Lesson & Practice Drill Progress
--    (Public Speaking, Speed/Deep Reading, Leadership Academies)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.academy_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id VARCHAR(100) NOT NULL,
  module_id VARCHAR(100) NOT NULL,
  lesson_id VARCHAR(100) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  drill_score INTEGER CHECK (drill_score IS NULL OR drill_score BETWEEN 0 AND 100),
  practice_minutes INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_academy_progress_user
  ON public.academy_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_academy_progress_track
  ON public.academy_lesson_progress(user_id, track_id);

ALTER TABLE public.academy_lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own academy lesson progress" ON public.academy_lesson_progress;
CREATE POLICY "Users can manage own academy lesson progress"
  ON public.academy_lesson_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------------------
-- 3. Book Mastery Notes, Highlights & Key Takeaways
--    (e.g. 'The Score Takes Care of Itself' by Bill Walsh + Classics)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.book_mastery_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id VARCHAR(100) NOT NULL,
  key_idea_id VARCHAR(100),
  note_type VARCHAR(30) NOT NULL DEFAULT 'note'
    CHECK (note_type IN ('note', 'highlight', 'takeaway', 'action_item')),
  content TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_book_notes_user_book
  ON public.book_mastery_notes(user_id, book_id);

ALTER TABLE public.book_mastery_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own book mastery notes" ON public.book_mastery_notes;
CREATE POLICY "Users can manage own book mastery notes"
  ON public.book_mastery_notes FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------------------
-- 4. FSRS v4.5 Spaced-Repetition Cards
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fsrs_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_key VARCHAR(200) NOT NULL,
  source_type VARCHAR(40) NOT NULL DEFAULT 'academy'
    CHECK (source_type IN ('certification', 'academy', 'book', 'custom')),
  source_id VARCHAR(100) NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  stability NUMERIC(10,4) NOT NULL DEFAULT 0,
  difficulty NUMERIC(10,4) NOT NULL DEFAULT 5.0,
  elapsed_days INTEGER NOT NULL DEFAULT 0,
  scheduled_days INTEGER NOT NULL DEFAULT 0,
  reps INTEGER NOT NULL DEFAULT 0,
  lapses INTEGER NOT NULL DEFAULT 0,
  state SMALLINT NOT NULL DEFAULT 0 CHECK (state BETWEEN 0 AND 3), -- 0=New, 1=Learning, 2=Review, 3=Relearning
  due TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_review TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, card_key)
);

CREATE INDEX IF NOT EXISTS idx_fsrs_cards_user_due
  ON public.fsrs_cards(user_id, due);
CREATE INDEX IF NOT EXISTS idx_fsrs_cards_source
  ON public.fsrs_cards(user_id, source_type, source_id);

ALTER TABLE public.fsrs_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own fsrs cards" ON public.fsrs_cards;
CREATE POLICY "Users can manage own fsrs cards"
  ON public.fsrs_cards FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------------------
-- 5. User Gamification Stats (Daily Streaks, XP, Levels, Heatmaps)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_gamification_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  daily_xp_goal INTEGER NOT NULL DEFAULT 100,
  today_xp INTEGER NOT NULL DEFAULT 0,
  activity_log JSONB NOT NULL DEFAULT '{}'::jsonb, -- { "YYYY-MM-DD": xp_earned }
  badges JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_gamification_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own gamification stats" ON public.user_gamification_stats;
CREATE POLICY "Users can manage own gamification stats"
  ON public.user_gamification_stats FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------------------
-- 6. Local Open-Weights AI Coach Sessions
--    (exam_proctor, speech_coach, reading_coach, leadership_mentor)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_coach_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_mode VARCHAR(40) NOT NULL
    CHECK (coach_mode IN ('exam_proctor', 'speech_coach', 'reading_coach', 'leadership_mentor')),
  context_id VARCHAR(120),
  model_name VARCHAR(120) NOT NULL DEFAULT 'anoxpass-coach',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  summary TEXT,
  score INTEGER CHECK (score IS NULL OR score BETWEEN 0 AND 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_coach_sessions_user
  ON public.ai_coach_sessions(user_id, created_at DESC);

ALTER TABLE public.ai_coach_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own ai coach sessions" ON public.ai_coach_sessions;
CREATE POLICY "Users can manage own ai coach sessions"
  ON public.ai_coach_sessions FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------------------
-- 7. Updated-at Auto-Trigger Helper
-- -------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cert_path_progress_updated_at ON public.certification_path_progress;
CREATE TRIGGER trg_cert_path_progress_updated_at
  BEFORE UPDATE ON public.certification_path_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_academy_lesson_progress_updated_at ON public.academy_lesson_progress;
CREATE TRIGGER trg_academy_lesson_progress_updated_at
  BEFORE UPDATE ON public.academy_lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_book_mastery_notes_updated_at ON public.book_mastery_notes;
CREATE TRIGGER trg_book_mastery_notes_updated_at
  BEFORE UPDATE ON public.book_mastery_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_fsrs_cards_updated_at ON public.fsrs_cards;
CREATE TRIGGER trg_fsrs_cards_updated_at
  BEFORE UPDATE ON public.fsrs_cards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_user_gamification_stats_updated_at ON public.user_gamification_stats;
CREATE TRIGGER trg_user_gamification_stats_updated_at
  BEFORE UPDATE ON public.user_gamification_stats
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_ai_coach_sessions_updated_at ON public.ai_coach_sessions;
CREATE TRIGGER trg_ai_coach_sessions_updated_at
  BEFORE UPDATE ON public.ai_coach_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

-- -------------------------------------------------------------------
-- 8. Enable Supabase Realtime (postgres_changes) Idempotently
-- -------------------------------------------------------------------
DO $$
DECLARE
  tbl TEXT;
  realtime_tables TEXT[] := ARRAY[
    'certification_path_progress',
    'academy_lesson_progress',
    'book_mastery_notes',
    'fsrs_cards',
    'user_gamification_stats',
    'ai_coach_sessions'
  ];
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    FOREACH tbl IN ARRAY realtime_tables LOOP
      IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = tbl
      ) THEN
        EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', tbl);
      END IF;
    END LOOP;
  END IF;
END $$;
