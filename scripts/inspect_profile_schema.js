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

async function run() {
  await client.connect();
  const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles' ORDER BY ordinal_position");
  console.log('Profiles columns:');
  console.table(res.rows);

  const upRes = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'user_progress' ORDER BY ordinal_position");
  console.log('\nUser Progress columns:');
  const conRes = await client.query("SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'profiles'::regclass");
  console.log('\nProfiles constraints:');
  console.table(conRes.rows);

  await client.end();
}

run().catch(console.error);
