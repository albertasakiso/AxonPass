import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../.env');
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

async function checkCsaTopic() {
  await client.connect();
  const res = await client.query(`
    SELECT s.name, s.subtopic_code, s.content_body, s.exam_tips
    FROM subtopics s
    JOIN topics t ON s.topic_id = t.id
    JOIN domains d ON t.domain_id = d.id
    JOIN certifications c ON d.certification_id = c.id
    WHERE c.slug = 'cisa' AND (s.name ILIKE '%self-assessment%' OR s.name ILIKE '%csa%' OR s.content_body ILIKE '%csa%')
  `);

  console.log(`Found ${res.rows.length} CSA subtopics:`);
  for (const r of res.rows) {
    console.log(`- [${r.subtopic_code}] ${r.name}`);
    console.log(`  Exam tips: ${r.exam_tips}`);
  }

  await client.end();
}

checkCsaTopic();
