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
  const cisaRes = await client.query(`
    SELECT sm.id, sm.chapter_number, sm.title, sm.estimated_read_minutes, length(sm.content_body) as body_length
    FROM study_materials sm
    JOIN certifications c ON sm.certification_id = c.id
    WHERE c.slug = 'cisa'
    ORDER BY sm.chapter_number, sm.sort_order;
  `);
  console.log('CISA Study Materials in DB:');
  console.table(cisaRes.rows);

  const sampleBody = await client.query(`
    SELECT sm.chapter_number, sm.title, substring(sm.content_body from 1 for 400) as preview
    FROM study_materials sm
    JOIN certifications c ON sm.certification_id = c.id
    WHERE c.slug = 'cisa'
    LIMIT 2;
  `);
  console.log('Sample previews:');
  for (const s of sampleBody.rows) {
    console.log(`\n--- [Chapter ${s.chapter_number}] ${s.title} ---`);
    console.log(s.preview);
  }

  await client.end();
}

run().catch(console.error);
