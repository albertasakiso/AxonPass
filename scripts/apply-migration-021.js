import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envContent = fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf8');

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

async function apply() {
  await client.connect();
  const sql = fs.readFileSync(path.resolve(__dirname, '../supabase/migrations/021_expand_profile_roles_and_coursera_user_tracking.sql'), 'utf8');
  console.log('Applying Migration 021...');
  await client.query(sql);
  console.log('✓ Migration 021 applied successfully!');
  await client.end();
}

apply().catch(console.error);
