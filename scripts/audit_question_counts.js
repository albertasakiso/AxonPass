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

async function checkQ() {
  await client.connect();
  const certs = await client.query('SELECT id, code, name FROM certifications ORDER BY code');
  console.log('\n========================================================================================');
  console.log('              CURRENT QUESTION & EXPLANATION COUNTS PER CERTIFICATION');
  console.log('========================================================================================\n');
  for (const c of certs.rows) {
    const q = await client.query('SELECT count(*) FROM questions WHERE certification_id = $1', [c.id]);
    const withRationale = await client.query("SELECT count(*) FROM questions WHERE certification_id = $1 AND rationale IS NOT NULL AND rationale != ''", [c.id]);
    const count = parseInt(q.rows[0].count, 10);
    const explCount = parseInt(withRationale.rows[0].count, 10);
    const needed = Math.max(0, 5000 - count);
    console.log(`[${c.code.padEnd(12)}] ${c.name.padEnd(52)} : ${String(count).padStart(5)} Qs | ${String(explCount).padStart(5)} Rationales | Needed to 5,000: ${String(needed).padStart(5)}`);
  }
  const total = await client.query('SELECT count(*) FROM questions');
  console.log('\n----------------------------------------------------------------------------------------');
  console.log(`GRAND TOTAL QUESTIONS IN SYSTEM: ${total.rows[0].count}`);
  console.log('========================================================================================\n');
  await client.end();
}

checkQ().catch(console.error);
