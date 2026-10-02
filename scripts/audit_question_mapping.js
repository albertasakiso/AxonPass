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

async function auditMapping() {
  await client.connect();
  const certs = await client.query('SELECT id, code, name FROM certifications ORDER BY code');
  console.log('\n=== QUESTION TOPIC & SUBTOPIC MAPPING AUDIT ===\n');
  for (const c of certs.rows) {
    const totalQ = await client.query('SELECT count(*) FROM questions WHERE certification_id = $1', [c.id]);
    const mappedTopic = await client.query('SELECT count(*) FROM questions WHERE certification_id = $1 AND topic_id IS NOT NULL', [c.id]);
    const mappedSubtopic = await client.query('SELECT count(*) FROM questions WHERE certification_id = $1 AND subtopic_id IS NOT NULL', [c.id]);
    const distinctTopics = await client.query('SELECT count(DISTINCT topic_id) FROM questions WHERE certification_id = $1', [c.id]);
    const distinctSubtopics = await client.query('SELECT count(DISTINCT subtopic_id) FROM questions WHERE certification_id = $1', [c.id]);
    
    console.log(`[${c.code.padEnd(10)}] Total Qs: ${totalQ.rows[0].count} | Mapped Topic: ${mappedTopic.rows[0].count} (Unique: ${distinctTopics.rows[0].count}) | Mapped Subtopic: ${mappedSubtopic.rows[0].count} (Unique: ${distinctSubtopics.rows[0].count})`);
  }
  await client.end();
}

auditMapping().catch(console.error);
