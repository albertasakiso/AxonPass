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
    SELECT c.code, c.name, d.domain_number, d.name as domain_name, d.id as domain_id,
           count(sm.id) as sm_count,
           coalesce(sum(length(sm.content_body)), 0)::int as total_chars
    FROM certifications c
    JOIN domains d ON d.certification_id = c.id
    LEFT JOIN study_materials sm ON sm.domain_id = d.id
    GROUP BY c.code, c.name, d.domain_number, d.name, d.id
    ORDER BY c.code, d.domain_number
  `);

  console.log('=== DOMAIN-LEVEL STUDY MATERIAL COVERAGE AUDIT ===\n');
  let missingCoverage = 0;
  res.rows.forEach(r => {
    const status = r.sm_count > 0 ? `✅ ${r.sm_count} mats (${r.total_chars.toLocaleString()} chars)` : '❌ MISSING STUDY MATERIAL';
    if (r.sm_count === 0 || r.total_chars < 3000) {
      missingCoverage++;
      console.log(`[${r.code.padEnd(10)}] Dom ${r.domain_number}: "${r.domain_name}" => ${status}`);
    }
  });

  console.log(`\nTotal domains needing material expansion/creation: ${missingCoverage}`);
  await client.end();
}

run().catch(console.error);
