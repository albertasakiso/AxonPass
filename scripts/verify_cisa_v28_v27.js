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

async function verify() {
  await client.connect();
  const cisaId = 'a0000000-0000-0000-0000-000000000001';

  console.log('================================================================');
  console.log('   CISA 28TH EDITION OFFICIAL HIERARCHY VERIFICATION REPORT     ');
  console.log('================================================================');

  const doms = await client.query(`
    SELECT domain_number, name, exam_weight_percent, approx_exam_questions, part_a_title, part_b_title
    FROM domains
    WHERE certification_id = $1
    ORDER BY domain_number
  `, [cisaId]);

  for (const d of doms.rows) {
    console.log(`\n📚 DOMAIN ${d.domain_number}: ${d.name}`);
    console.log(`   Weight: ${d.exam_weight_percent}% (~${d.approx_exam_questions} Questions)`);
    console.log(`   - ${d.part_a_title}`);
    console.log(`   - ${d.part_b_title}`);

    const tops = await client.query(`
      SELECT t.id, t.topic_code, t.name, t.part, t.sort_order,
        (SELECT count(*) FROM subtopics s WHERE s.topic_id = t.id) as sub_count
      FROM topics t
      JOIN domains dm ON t.domain_id = dm.id
      WHERE dm.certification_id = $1 AND dm.domain_number = $2
      ORDER BY t.sort_order
    `, [cisaId, d.domain_number]);

    console.log(`   Topics in Domain ${d.domain_number} (${tops.rows.length} Topics):`);
    tops.rows.forEach(t => {
      console.log(`     [${t.topic_code}] (Part ${t.part}) ${t.name} (Submodules: ${t.sub_count})`);
    });
  }

  const tasks = await client.query('SELECT count(*) FROM task_statements WHERE certification_id = $1', [cisaId]);
  const sm = await client.query('SELECT count(*) FROM study_materials WHERE certification_id = $1', [cisaId]);
  const totalSubs = await client.query(`
    SELECT count(*)
    FROM subtopics s
    JOIN topics t ON s.topic_id = t.id
    JOIN domains d ON t.domain_id = d.id
    WHERE d.certification_id = $1
  `, [cisaId]);

  console.log('\n================================================================');
  console.log(`- Total Official Task Statements: ${tasks.rows[0].count} (T1.1 to T5.12)`);
  console.log(`- Total Study Materials Chapters: ${sm.rows[0].count}`);
  console.log(`- Total Granular Subsections: ${totalSubs.rows[0].count}`);
  console.log('================================================================');

  await client.end();
}

verify().catch(console.error);
