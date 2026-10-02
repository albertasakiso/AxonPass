import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');

let directUrl = '';
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('DIRECT_URL=')) {
    directUrl = trimmed.replace('DIRECT_URL=', '').replace(/^["']|["']$/g, '');
    break;
  }
}

const client = new Client({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false },
});

async function checkAuth() {
  await client.connect();
  console.log('--- AUTH & USERS INSPECTION ---');

  // Check auth.users table
  const users = await client.query(`
    SELECT id, email, email_confirmed_at, confirmed_at, last_sign_in_at, created_at
    FROM auth.users
  `);
  console.log('Auth Users count:', users.rows.length);
  console.log('Auth Users:', users.rows);

  // Check public.profiles table
  const profiles = await client.query(`
    SELECT id, email, full_name, role, onboarding_state, created_at
    FROM public.profiles
  `);
  console.log('\nPublic Profiles count:', profiles.rows.length);
  console.log('Public Profiles:', profiles.rows);

  await client.end();
}

checkAuth();
