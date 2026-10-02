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
    SELECT c.code, c.name, count(sm.id) as materials_count
    FROM certifications c
    LEFT JOIN study_materials sm ON c.id = sm.certification_id
    GROUP BY c.id, c.code, c.name
    ORDER BY c.code
  `);
  console.log('\n--- STUDY MATERIALS PER CERTIFICATION ---');
  res.rows.forEach(r => console.log(`[${r.code.padEnd(12)}] ${r.name.padEnd(55)}: ${r.materials_count} materials`));

  const totalSm = await client.query('SELECT count(*) FROM study_materials');
  console.log(`\nTotal Study Materials in DB: ${totalSm.rows[0].count}`);

  await client.end();
}

run().catch(console.error);
