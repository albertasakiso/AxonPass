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

async function main() {
  await client.connect();
  const certs = await client.query('SELECT * FROM certifications ORDER BY code');
  console.log('=== CERTIFICATIONS IN DB ===');
  certs.rows.forEach(c => console.log(`${c.code.padEnd(10)} | ${c.slug.padEnd(10)} | ${c.id} | ${c.name}`));

  const domains = await client.query(`
    SELECT c.code, d.domain_number, d.name, d.id, d.exam_weight_percent 
    FROM domains d 
    JOIN certifications c ON d.certification_id = c.id 
    ORDER BY c.code, d.domain_number
  `);
  console.log('\n=== DOMAINS IN DB ===');
  domains.rows.forEach(d => console.log(`[${d.code} D${d.domain_number}] ${d.name} (weight: ${d.exam_weight_percent}%, id: ${d.id})`));

  const questionsCount = await client.query(`
    SELECT c.code, COUNT(q.id) as q_count 
    FROM certifications c
    LEFT JOIN domains d ON d.certification_id = c.id
    LEFT JOIN questions q ON q.domain_id = d.id
    GROUP BY c.code
    ORDER BY c.code
  `);
  console.log('\n=== QUESTION COUNTS PER CERT ===');
  questionsCount.rows.forEach(r => console.log(`${r.code.padEnd(10)} : ${r.q_count} questions`));

  const tables = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `);
  console.log('\n=== PUBLIC TABLES IN DB ===');
  console.log(tables.rows.map(t => t.table_name).join(', '));

  await client.end();
}

main().catch(console.error);
