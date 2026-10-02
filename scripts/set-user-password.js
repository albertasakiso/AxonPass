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

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('DIRECT_URL=')) {
    directUrl = trimmed.replace('DIRECT_URL=', '').replace(/^["']|["']$/g, '');
  }
  if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
    supabaseUrl = trimmed.replace('VITE_SUPABASE_URL=', '').replace(/^["']|["']$/g, '');
  }
  if (trimmed.startsWith('VITE_SUPABASE_PUBLISHABLE_KEY=')) {
    supabaseKey = trimmed.replace('VITE_SUPABASE_PUBLISHABLE_KEY=', '').replace(/^["']|["']$/g, '');
  }
}

const client = new Client({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false },
});

const TEST_PASSWORD = 'Password123!';
const USER_EMAIL = 'apullahalbert@gmail.com';

async function updatePassword() {
  await client.connect();
  console.log(`Updating password for ${USER_EMAIL} in auth.users...`);

  // Set encrypted password using pgcrypto crypt with bcrypt salt
  const res = await client.query(`
    UPDATE auth.users
    SET 
      encrypted_password = crypt($1, gen_salt('bf', 10)),
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      updated_at = NOW()
    WHERE email = $2
    RETURNING id, email, email_confirmed_at;
  `, [TEST_PASSWORD, USER_EMAIL]);

  console.log('Update result:', res.rows);
  await client.end();

  // Test sign in via Supabase client with the new password
  console.log('\nTesting signInWithPassword via Supabase JS client...');
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: USER_EMAIL,
    password: TEST_PASSWORD,
  });

  if (error) {
    console.error('Sign-in test failed:', error);
  } else {
    console.log('✓ SUCCESS! User signed in successfully.');
    console.log('User ID:', data.user.id);
    console.log('Session Access Token obtained:', data.session.access_token.slice(0, 30) + '...');
  }
}

updatePassword();
