import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

const client = new Client({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false },
});

async function verify() {
  await client.connect();
  console.log('--- DATABASE VERIFICATION ---');

  const certs = await client.query('SELECT slug, name, version FROM certifications');
  console.log('Certifications:', certs.rows);

  const domains = await client.query('SELECT domain_number, name, exam_weight_percent FROM domains ORDER BY domain_number');
  console.log('Domains:', domains.rows);

  const topics = await client.query('SELECT topic_code, name, part FROM topics ORDER BY sort_order LIMIT 5');
  console.log('Sample Topics:', topics.rows);

  const config = await client.query('SELECT key, value FROM app_config');
  console.log('App Config:', config.rows);

  await client.end();
}

verify();
