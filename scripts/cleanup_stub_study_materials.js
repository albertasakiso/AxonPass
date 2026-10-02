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
  console.log('=== REMOVING SHORT STUB STUDY MATERIALS (< 400 CHARS) ===\n');

  const res = await client.query(`
    DELETE FROM study_materials
    WHERE length(content_body) < 400
    RETURNING id, title, certification_id;
  `);

  console.log(`Deleted ${res.rowCount} stub study material records.`);

  const remaining = await client.query(`
    SELECT c.code, count(*) as count, avg(length(sm.content_body))::int as avg_len
    FROM study_materials sm
    JOIN certifications c ON sm.certification_id = c.id
    GROUP BY c.code
    ORDER BY c.code
  `);

  console.log('\n=== CURRENT STUDY MATERIALS INVENTORY ===');
  remaining.rows.forEach(r => {
    console.log(`[${r.code.padEnd(12)}] Chapters: ${r.count} | Avg Length: ${r.avg_len.toLocaleString()} chars`);
  });

  await client.end();
}

run().catch(console.error);
