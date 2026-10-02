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
  const rlsRes = await client.query(`
    SELECT tablename, rowsecurity 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename IN ('subtopics', 'topics', 'domains', 'study_materials', 'certifications', 'document_ingestion_ledger');
  `);
  console.log('RLS Status:');
  console.table(rlsRes.rows);

  const polRes = await client.query(`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
    FROM pg_policies 
    WHERE schemaname = 'public';
  `);
  console.log('\nPolicies:');
  console.table(polRes.rows);

  await client.end();
}

run().catch(console.error);
