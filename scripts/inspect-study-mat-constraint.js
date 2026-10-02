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

async function inspectConstraint() {
  await client.connect();
  const res = await client.query(`
    SELECT pg_get_constraintdef(oid)
    FROM pg_constraint
    WHERE conname = 'study_materials_content_type_check';
  `);
  console.log('Constraint definition:', res.rows);

  const existingRes = await client.query(`
    SELECT DISTINCT content_type FROM study_materials;
  `);
  console.log('Existing content_type values:', existingRes.rows);

  await client.end();
}

inspectConstraint().catch(console.error);
