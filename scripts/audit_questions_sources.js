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
  console.log('=== AUDITING QUESTIONS TABLE FOR ALL 15 TRACKS ===\n');
  const res = await client.query(`
    SELECT c.code, c.name, q.source_reference, count(*) as q_count
    FROM questions q
    JOIN certifications c ON q.certification_id = c.id
    GROUP BY c.code, c.name, q.source_reference
    ORDER BY c.code, q_count DESC
  `);
  
  res.rows.forEach(r => {
    console.log(`[${r.code.padEnd(12)}] (${r.q_count} Qs) Source: "${r.source_reference}"`);
  });

  await client.end();
}

run().catch(console.error);
