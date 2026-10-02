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

async function checkUser() {
  await client.connect();
  console.log('--- AUTH USER DETAILS ---');

  const res = await client.query(`
    SELECT 
      id, 
      email, 
      encrypted_password IS NOT NULL AS has_password,
      LENGTH(encrypted_password) as password_len,
      email_confirmed_at,
      invited_at,
      confirmation_token,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at
    FROM auth.users
  `);

  console.log(JSON.stringify(res.rows, null, 2));

  await client.end();
}

checkUser();
