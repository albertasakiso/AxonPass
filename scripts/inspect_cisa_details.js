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
  const match = envContent.match(/postgresql:\/\/[^\s"']+/);
  if (match) directUrl = match[0];
}

const client = new Client({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  await client.connect();
  const cisaId = 'a0000000-0000-0000-0000-000000000001';
  
  const tasks = await client.query('SELECT * FROM task_statements WHERE certification_id = $1 ORDER BY task_code', [cisaId]);
  console.log('=== TASK STATEMENTS COUNT ===', tasks.rows.length);
  tasks.rows.forEach(t => console.log(`[${t.task_code}] (Domains: ${t.related_domains}) ${t.description}`));
  
  const subs = await client.query(`
    SELECT s.id, s.subtopic_code, s.name, length(s.content_body) as len, s.learning_objectives, s.exam_tips
    FROM subtopics s
    JOIN topics t ON s.topic_id = t.id
    JOIN domains d ON t.domain_id = d.id
    WHERE d.certification_id = $1
    ORDER BY s.subtopic_code
  `, [cisaId]);
  console.log('\n=== SUBTOPICS COUNT ===', subs.rows.length);
  subs.rows.slice(0, 15).forEach(s => console.log(`[${s.subtopic_code}] Len: ${s.len} | Name: ${s.name}`));

  await client.end();
}

run().catch(console.error);
