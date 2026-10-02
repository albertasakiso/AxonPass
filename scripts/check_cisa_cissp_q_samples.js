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
  console.log('=== CHECKING CISA AND CISSP QUESTIONS SAMPLES ===\n');
  const cisaQ = await client.query(`
    SELECT stem, source_reference, tags FROM questions WHERE certification_id = 'a0000000-0000-0000-0000-000000000001' LIMIT 5
  `);
  console.log('CISA Questions Samples:');
  cisaQ.rows.forEach(r => console.log(' - Stem:', r.stem.substring(0, 100), '| Source:', r.source_reference, '| Tags:', r.tags));

  const cisspQ = await client.query(`
    SELECT stem, source_reference, tags FROM questions WHERE certification_id = 'a0000000-0000-0000-0000-000000000007' LIMIT 5
  `);
  console.log('\nCISSP Questions Samples:');
  cisspQ.rows.forEach(r => console.log(' - Stem:', r.stem.substring(0, 100), '| Source:', r.source_reference, '| Tags:', r.tags));

  await client.end();
}

run().catch(console.error);
