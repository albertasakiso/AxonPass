-- ===================================================================
-- APILIGU LEARNING PASS — Migration 009: Auth User Created Trigger
-- Automatically populates public.profiles when auth.users is created
-- ===================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    onboarding_state,
    daily_study_goal_minutes,
    timezone,
    created_at,
    last_active_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'owner',
    'pending',
    60,
    'UTC',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    last_active_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill any existing users in auth.users into public.profiles
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  onboarding_state,
  daily_study_goal_minutes,
  timezone,
  created_at,
  last_active_at
)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  'owner',
  'pending',
  60,
  'UTC',
  NOW(),
  NOW()
FROM auth.users
ON CONFLICT (id) DO NOTHING;
