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
  const res = await client.query(`
    SELECT sm.id, sm.title, sm.document_title, sm.certification_id, c.code as cert_code, sm.domain_id, d.domain_number, d.name as domain_name
    FROM study_materials sm
    JOIN certifications c ON sm.certification_id = c.id
    LEFT JOIN domains d ON sm.domain_id = d.id
    ORDER BY c.code, sm.sort_order, sm.title
  `);
  
  console.log(`Total Study Materials: ${res.rows.length}\n`);
  res.rows.forEach(r => {
    console.log(`[${r.cert_code}] Dom ${r.domain_number}: "${r.title}" | doc: "${r.document_title}" | id: ${r.id}`);
  });

  await client.end();
}

run().catch(console.error);
