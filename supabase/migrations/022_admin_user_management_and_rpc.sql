-- ===================================================================
-- APILIGU LEARNING PASS — Migration 022: Admin User Management & RPCs
-- Adds status column, admin RLS policies, and secure administrative functions
-- for hard password reset, account suspension, deletion, and creation.
-- ===================================================================

-- 1. Add status and deletion request tracking to public.profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'active';
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_status_check'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_status_check 
      CHECK (status IN ('active', 'suspended', 'deletion_requested'));
  END IF;
END $$;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deletion_requested_at TIMESTAMP WITH TIME ZONE;

-- 2. Expand RLS on public.profiles so admins & owners can manage all accounts
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('owner', 'admin')
    )
  );

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('owner', 'admin')
    )
  );

DROP POLICY IF EXISTS "Admins can delete all profiles" ON public.profiles;
CREATE POLICY "Admins can delete all profiles"
  ON public.profiles FOR DELETE TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('owner', 'admin')
    )
  );

-- 3. Secure Admin Function: Create User with Initial Credentials & Role
CREATE OR REPLACE FUNCTION public.admin_create_user(
  p_email TEXT,
  p_password TEXT,
  p_full_name TEXT DEFAULT NULL,
  p_role TEXT DEFAULT 'learner',
  p_target_cert_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_caller_role TEXT;
  v_new_user_id UUID;
  v_clean_email TEXT;
BEGIN
  -- Verify caller is authenticated admin or owner
  SELECT role INTO v_caller_role FROM public.profiles WHERE id = auth.uid();
  IF v_caller_role IS NULL OR v_caller_role NOT IN ('owner', 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Only administrators or owners can create accounts for others.';
  END IF;

  v_clean_email := lower(trim(p_email));

  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = v_clean_email) THEN
    RAISE EXCEPTION 'A user with email % already exists.', v_clean_email;
  END IF;

  v_new_user_id := gen_random_uuid();

  -- Insert into auth.users with encrypted password
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_new_user_id,
    'authenticated',
    'authenticated',
    v_clean_email,
    crypt(p_password, gen_salt('bf', 10)),
    NOW(),
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email'), 'role', p_role),
    jsonb_build_object('full_name', COALESCE(p_full_name, split_part(v_clean_email, '@', 1)), 'role', p_role),
    NOW(),
    NOW()
  );

  -- Upsert profile record
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    selected_certification_id,
    daily_study_goal_minutes,
    timezone,
    onboarding_state,
    status,
    created_at,
    last_active_at
  ) VALUES (
    v_new_user_id,
    v_clean_email,
    COALESCE(p_full_name, split_part(v_clean_email, '@', 1)),
    p_role,
    p_target_cert_id,
    45,
    'UTC',
    'pending',
    'active',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = v_clean_email,
    full_name = COALESCE(p_full_name, public.profiles.full_name),
    role = p_role,
    status = 'active';

  RETURN jsonb_build_object(
    'success', true,
    'user_id', v_new_user_id,
    'email', v_clean_email,
    'role', p_role
  );
END;
$$;

-- 4. Secure Admin Function: Hard Reset Password
CREATE OR REPLACE FUNCTION public.admin_hard_reset_password(
  p_user_id UUID,
  p_new_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_caller_role TEXT;
BEGIN
  -- Verify caller is authenticated admin or owner
  SELECT role INTO v_caller_role FROM public.profiles WHERE id = auth.uid();
  IF v_caller_role IS NULL OR v_caller_role NOT IN ('owner', 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Only administrators or owners can reset passwords.';
  END IF;

  IF length(p_new_password) < 6 THEN
    RAISE EXCEPTION 'Password must be at least 6 characters long.';
  END IF;

  UPDATE auth.users
  SET 
    encrypted_password = crypt(p_new_password, gen_salt('bf', 10)),
    updated_at = NOW()
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found.';
  END IF;

  RETURN jsonb_build_object('success', true, 'message', 'Password updated successfully.');
END;
$$;

-- 5. Secure Admin Function: Set User Status (Active / Suspended / Deletion Requested)
CREATE OR REPLACE FUNCTION public.admin_set_user_status(
  p_user_id UUID,
  p_status TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_caller_role TEXT;
BEGIN
  SELECT role INTO v_caller_role FROM public.profiles WHERE id = auth.uid();
  IF v_caller_role IS NULL OR v_caller_role NOT IN ('owner', 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Only administrators or owners can update user status.';
  END IF;

  IF p_user_id = auth.uid() AND p_status = 'suspended' THEN
    RAISE EXCEPTION 'You cannot suspend your own administrative account.';
  END IF;

  UPDATE public.profiles
  SET 
    status = p_status,
    last_active_at = NOW()
  WHERE id = p_user_id;

  RETURN jsonb_build_object('success', true, 'user_id', p_user_id, 'status', p_status);
END;
$$;

-- 6. Secure Admin Function: Delete User Permanently
CREATE OR REPLACE FUNCTION public.admin_delete_user(
  p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_caller_role TEXT;
BEGIN
  SELECT role INTO v_caller_role FROM public.profiles WHERE id = auth.uid();
  IF v_caller_role IS NULL OR v_caller_role NOT IN ('owner', 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Only administrators or owners can delete accounts.';
  END IF;

  IF p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Safety constraint: You cannot delete your own active administrator account.';
  END IF;

  -- Delete from auth.users (cascades to public.profiles, user_progress, sessions)
  DELETE FROM auth.users WHERE id = p_user_id;

  RETURN jsonb_build_object('success', true, 'deleted_user_id', p_user_id);
END;
$$;

-- 7. Self-Service Function: Request Account Deletion
CREATE OR REPLACE FUNCTION public.self_request_account_deletion()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated.';
  END IF;

  UPDATE public.profiles
  SET 
    status = 'deletion_requested',
    deletion_requested_at = NOW()
  WHERE id = auth.uid();

  RETURN jsonb_build_object('success', true, 'message', 'Account deletion request submitted. An admin will process your request or you may cancel it at any time.');
END;
$$;

-- 8. Self-Service Function: Cancel Account Deletion Request
CREATE OR REPLACE FUNCTION public.self_cancel_account_deletion()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated.';
  END IF;

  UPDATE public.profiles
  SET 
    status = 'active',
    deletion_requested_at = NULL
  WHERE id = auth.uid();

  RETURN jsonb_build_object('success', true, 'message', 'Account deletion request cancelled. Your account remains active.');
END;
$$;
