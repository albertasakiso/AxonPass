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
  console.log('=== CROSS-AUDITING CASE STUDIES & GLOSSARY ===\n');

  // Case studies
  const csRes = await client.query(`
    SELECT cs.id, cs.title, cs.scenario_text, c.code as cert_code, d.domain_number, d.name as domain_name
    FROM case_studies cs
    JOIN domains d ON cs.domain_id = d.id
    JOIN certifications c ON d.certification_id = c.id
    ORDER BY c.code, d.domain_number
  `);

  console.log(`Total Case Studies: ${csRes.rows.length}`);
  csRes.rows.forEach(r => {
    console.log(`[${r.cert_code}] Dom ${r.domain_number} (${r.domain_name}): "${r.title}"`);
  });

  // Check tab headers and cert definitions
  console.log('\n=== CERTIFICATIONS HEADERS & METADATA ===\n');
  const certs = await client.query('SELECT id, code, slug, name, publisher, body, version FROM certifications ORDER BY code');
  certs.rows.forEach(c => {
    console.log(`[${c.code.padEnd(12)}] Slug: "${c.slug.padEnd(25)}" | Publisher: "${c.publisher || c.body}" | Name: "${c.name}"`);
  });

  await client.end();
}

run().catch(console.error);
