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
  console.log('=== VERIFYING CISA & CISSP READER CHAPTERS ORDER ===\n');

  console.log('--- CISA STUDY MATERIALS ---');
  const cisaRes = await client.query(`
    SELECT sm.chapter_number, sm.sort_order, d.domain_number, d.name as domain_name, sm.title, sm.document_title
    FROM study_materials sm
    JOIN domains d ON sm.domain_id = d.id
    WHERE sm.certification_id = 'a0000000-0000-0000-0000-000000000001'
    ORDER BY sm.chapter_number, sm.sort_order
  `);
  cisaRes.rows.forEach(r => {
    console.log(`  [Dom ${r.domain_number}] Ch.${r.chapter_number} #${r.sort_order} - ${r.title} | doc: "${r.document_title}"`);
  });

  console.log('\n--- CISSP STUDY MATERIALS ---');
  const cisspRes = await client.query(`
    SELECT sm.chapter_number, sm.sort_order, d.domain_number, d.name as domain_name, sm.title, sm.document_title
    FROM study_materials sm
    JOIN domains d ON sm.domain_id = d.id
    WHERE sm.certification_id = 'a0000000-0000-0000-0000-000000000007'
    ORDER BY sm.chapter_number, sm.sort_order
  `);
  cisspRes.rows.forEach(r => {
    console.log(`  [Dom ${r.domain_number}] Ch.${r.chapter_number} #${r.sort_order} - ${r.title} | doc: "${r.document_title}"`);
  });

  await client.end();
}

run().catch(console.error);
