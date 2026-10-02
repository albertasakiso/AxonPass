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

async function auditGlossary() {
  await client.connect();
  const certs = await client.query('SELECT id, code, name FROM certifications ORDER BY code');
  
  console.log('\n========================================================================================');
  console.log('                   APILIGUPASS GLOSSARY & FLASHCARD AUDIT REPORT');
  console.log('========================================================================================\n');

  let totalTerms = 0;
  for (const c of certs.rows) {
    const terms = await client.query('SELECT count(*) FROM glossary_terms WHERE certification_id = $1', [c.id]);
    const count = parseInt(terms.rows[0].count, 10);
    totalTerms += count;
    const status = count >= 30 ? '✅ Comprehensive' : '⚠️ Needs Expansion';
    console.log(`[${c.code.padEnd(12)}] ${c.name.padEnd(60)} : ${String(count).padStart(3)} terms  (${status})`);
  }

  console.log('\n----------------------------------------------------------------------------------------');
  console.log(`GRAND TOTAL GLOSSARY TERMS IN SYSTEM: ${totalTerms}`);
  console.log('========================================================================================\n');

  await client.end();
}

auditGlossary().catch(console.error);
