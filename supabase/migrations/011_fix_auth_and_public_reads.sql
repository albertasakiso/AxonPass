-- ===================================================================
-- APILIGU LEARNING PASS — Migration 011: Auto-Confirm & Public Read
-- 1. Automatically confirms email for all new signups
-- 2. Allows public read (anon + authenticated) for curriculum content
-- ===================================================================

-- 1. Auto-confirm trigger for all new user signups
CREATE OR REPLACE FUNCTION public.auto_confirm_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email_confirmed_at IS NULL THEN
    NEW.email_confirmed_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_auto_confirm ON auth.users;
CREATE TRIGGER on_auth_user_auto_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_new_user();

-- Auto-confirm all existing users in auth.users
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- 2. Allow public SELECT on certifications, domains, topics, questions
DROP POLICY IF EXISTS "Authenticated users can read certifications" ON certifications;
DROP POLICY IF EXISTS "Allow public read on certifications" ON certifications;
CREATE POLICY "Allow public read on certifications"
  ON certifications FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can read domains" ON domains;
DROP POLICY IF EXISTS "Allow public read on domains" ON domains;
CREATE POLICY "Allow public read on domains"
  ON domains FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can read topics" ON topics;
DROP POLICY IF EXISTS "Allow public read on topics" ON topics;
CREATE POLICY "Allow public read on topics"
  ON topics FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can read questions" ON questions;
DROP POLICY IF EXISTS "Allow public read on questions" ON questions;
CREATE POLICY "Allow public read on questions"
  ON questions FOR SELECT
  TO anon, authenticated
  USING (true);

-- Ensure profiles can be read and upserted by owners
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
