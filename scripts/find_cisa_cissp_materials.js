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
  console.log('=== SEARCHING FOR CISA AND CISSP STUDY MATERIALS ===\n');
  const res = await client.query(`
    SELECT sm.id, sm.title, sm.document_title, sm.chapter_number, sm.sort_order, c.code as cert_code, d.domain_number, d.name as domain_name
    FROM study_materials sm
    JOIN certifications c ON sm.certification_id = c.id
    LEFT JOIN domains d ON sm.domain_id = d.id
    WHERE c.code IN ('CISA', 'CISSP')
    ORDER BY c.code, sm.chapter_number, sm.sort_order
  `);
  
  res.rows.forEach(r => {
    console.log(`[${r.cert_code}] Ch.${r.chapter_number} / Sort.${r.sort_order} (Dom ${r.domain_number}: ${r.domain_name}) => "${r.title}" | "${r.document_title}"`);
  });

  await client.end();
}

run().catch(console.error);
