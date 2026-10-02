import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envContent = fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf8');

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

async function run() {
  await client.connect();
  const res = await client.query(`
    SELECT 
      d.domain_number,
      t.topic_code,
      s.subtopic_code,
      s.name,
      length(s.content_body) as body_length
    FROM subtopics s
    JOIN topics t ON s.topic_id = t.id
    JOIN domains d ON t.domain_id = d.id
    JOIN certifications c ON d.certification_id = c.id
    WHERE c.slug = 'cisa'
    ORDER BY d.domain_number, t.sort_order, s.sort_order
    LIMIT 10;
  `);
  console.log('Sample CISA subtopics:');
  console.table(res.rows);

  const sampleBody = await client.query(`
    SELECT s.name, s.content_body
    FROM subtopics s
    JOIN topics t ON s.topic_id = t.id
    JOIN domains d ON t.domain_id = d.id
    JOIN certifications c ON d.certification_id = c.id
    WHERE c.slug = 'cisa'
    LIMIT 1;
  `);
  console.log('\n--- Content preview for:', sampleBody.rows[0].name, '---');
  console.log(sampleBody.rows[0].content_body.slice(0, 800));

  await client.end();
}

run().catch(console.error);
