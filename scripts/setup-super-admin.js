import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');

let directUrl = '';
let supabaseUrl = '';
let supabaseKey = '';
let supabaseSecret = '';

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('DIRECT_URL=')) directUrl = trimmed.replace('DIRECT_URL=', '').replace(/^["']|["']$/g, '');
  if (trimmed.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = trimmed.replace('VITE_SUPABASE_URL=', '').replace(/^["']|["']$/g, '');
  if (trimmed.startsWith('VITE_SUPABASE_PUBLISHABLE_KEY=')) supabaseKey = trimmed.replace('VITE_SUPABASE_PUBLISHABLE_KEY=', '').replace(/^["']|["']$/g, '');
  if (trimmed.startsWith('SUPABASE_SECRET_KEY=')) supabaseSecret = trimmed.replace('SUPABASE_SECRET_KEY=', '').replace(/^["']|["']$/g, '');
}

const SUPER_ADMIN_EMAIL = 'apullahalbert@gmail.com';
const SUPER_ADMIN_PASSWORD = 'Sector0991572=';

async function setup() {
  const client = new Client({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  console.log(`Setting password and Super Admin role for ${SUPER_ADMIN_EMAIL}...`);

  // 1. Update auth.users password using bcrypt (pgcrypto) and confirm email
  const userRes = await client.query(`
    UPDATE auth.users
    SET 
      encrypted_password = crypt($1, gen_salt('bf', 10)),
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      raw_app_meta_data = jsonb_set(COALESCE(raw_app_meta_data, '{}'::jsonb), '{role}', '"owner"'),
      raw_user_meta_data = jsonb_set(
        jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{full_name}', '"Albert Apiligu (Super Admin)"'),
        '{role}', '"owner"'
      ),
      updated_at = NOW()
    WHERE lower(email) = lower($2)
    RETURNING id, email, email_confirmed_at;
  `, [SUPER_ADMIN_PASSWORD, SUPER_ADMIN_EMAIL]);

  let userId;
  if (userRes.rows.length === 0) {
    console.log('User not found in auth.users, creating...');
    const createRes = await client.query(`
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
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        $1,
        crypt($2, gen_salt('bf', 10)),
        NOW(),
        '{"provider":"email","providers":["email"],"role":"owner"}'::jsonb,
        '{"full_name":"Albert Apiligu (Super Admin)","role":"owner"}'::jsonb,
        NOW(),
        NOW()
      )
      RETURNING id, email;
    `, [SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD]);
    userId = createRes.rows[0].id;
  } else {
    userId = userRes.rows[0].id;
  }

  console.log('User ID in auth.users:', userId);

  // 2. Ensure profile exists and has role 'owner' with super admin rights
  const profRes = await client.query(`
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      role,
      daily_study_goal_minutes,
      timezone,
      onboarding_state,
      created_at,
      last_active_at
    ) VALUES (
      $1,
      $2,
      'Albert Apiligu (Super Admin)',
      'owner',
      60,
      'Africa/Accra',
      'completed',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      role = 'owner',
      full_name = 'Albert Apiligu (Super Admin)',
      email = $2,
      onboarding_state = 'completed',
      last_active_at = NOW()
    RETURNING *;
  `, [userId, SUPER_ADMIN_EMAIL]);

  console.log('Profile updated in public.profiles:');
  console.table(profRes.rows);

  await client.end();

  // 3. Test signing in via Supabase client with the new password
  console.log('\nTesting sign in via Supabase Auth client...');
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: SUPER_ADMIN_EMAIL,
    password: SUPER_ADMIN_PASSWORD,
  });

  if (error) {
    console.error('❌ Sign in failed:', error.message);
  } else {
    console.log('✓ Successfully signed in! Session user ID:', data.user?.id);
    console.log('✓ Email:', data.user?.email);
  }
}

setup().catch(console.error);
