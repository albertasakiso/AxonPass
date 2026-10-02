import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

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
if (!directUrl) {
  const match = envContent.match(/postgresql:\/\/[^\s]+/);
  if (match) directUrl = match[0];
}

const client = new Client({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  await client.connect();
  const cs = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'case_studies' ORDER BY ordinal_position");
  console.log('case_studies columns:', cs.rows);
  const csq = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'case_study_questions' ORDER BY ordinal_position");
  console.log('case_study_questions columns:', csq.rows);
  const gl = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'glossary_terms' ORDER BY ordinal_position");
  console.log('glossary_terms columns:', gl.rows);
  await client.end();
}

run().catch(console.error);
