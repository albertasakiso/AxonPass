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

async function inspectNist() {
  await client.connect();
  const certRes = await client.query(`
    SELECT * FROM certifications WHERE id = 'a0000000-0000-0000-0000-000000000004' OR slug LIKE '%nist%';
  `);
  console.log('NIST Certification record:', certRes.rows);

  if (certRes.rows.length > 0) {
    const certId = certRes.rows[0].id;
    const domRes = await client.query(`
      SELECT * FROM domains WHERE certification_id = $1 ORDER BY domain_number;
    `, [certId]);
    console.log('Existing NIST Domains:', domRes.rows);
  }

  await client.end();
}

inspectNist().catch(console.error);
