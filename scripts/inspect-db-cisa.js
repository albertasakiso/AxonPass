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
  const cisaId = 'a0000000-0000-0000-0000-000000000001';

  console.log('=== CISA STUDY MATERIALS ===');
  const sm = await client.query(`
    SELECT id, domain_id, chapter_number, section_number, title, sort_order, length(content_body) as len, exam_tips, key_takeaways
    FROM study_materials
    WHERE certification_id = $1
    ORDER BY chapter_number, sort_order
  `, [cisaId]);
  console.log(`Total Study Materials: ${sm.rows.length}`);
  sm.rows.forEach(r => {
    console.log(`- [${r.id}] Ch.${r.chapter_number} | Sec: ${r.section_number} | Sort: ${r.sort_order} | Len: ${r.len} | Tips: ${r.exam_tips ? 'YES' : 'NO'} | Title: ${r.title}`);
  });

  console.log('\n=== CISA TOPICS ===');
  const tops = await client.query(`
    SELECT t.id, d.domain_number, t.topic_code, t.name, t.sort_order,
      (SELECT count(*) FROM subtopics s WHERE s.topic_id = t.id) as sub_count
    FROM topics t
    JOIN domains d ON t.domain_id = d.id
    WHERE d.certification_id = $1
    ORDER BY d.domain_number, t.sort_order
  `, [cisaId]);
  console.log(`Total CISA Topics in DB: ${tops.rows.length}`);
  tops.rows.forEach(r => {
    console.log(`  D${r.domain_number} [${r.topic_code}] Sort: ${r.sort_order} | Subs: ${r.sub_count} | ${r.name}`);
  });

  await client.end();
}

run().catch(console.error);
