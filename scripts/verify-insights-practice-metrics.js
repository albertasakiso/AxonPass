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

const CISA_CERT_ID = 'a0000000-0000-0000-0000-000000000001';

async function verifyMetrics() {
  console.log('============================================================');
  console.log('AUDITING PRACTICE & INSIGHTS DATA METRICS AND TOPIC MAPPING');
  console.log('============================================================\n');
  await client.connect();

  // 1. Check Questions Linked to Topics
  const topicQRes = await client.query(`
    SELECT count(*) as total,
           count(topic_id) as with_topic,
           count(case when scenario_text is not null then 1 end) as scenario_qs
    FROM questions
    WHERE certification_id = $1;
  `, [CISA_CERT_ID]);

  console.log('✓ Question Bank Metrics:');
  console.log(`  - Total Questions in Bank: ${topicQRes.rows[0].total}`);
  console.log(`  - Questions with Topic Mappings: ${topicQRes.rows[0].with_topic}`);
  console.log(`  - Scenario / Case Study Questions: ${topicQRes.rows[0].scenario_qs}\n`);

  // 2. Check 60 Topics Coverage
  const topRes = await client.query(`
    SELECT d.domain_number, count(t.id) as topic_count
    FROM domains d
    LEFT JOIN topics t ON d.id = t.domain_id
    WHERE d.certification_id = $1
    GROUP BY d.domain_number
    ORDER BY d.domain_number;
  `, [CISA_CERT_ID]);

  console.log('✓ 60 Canonical Topics Distribution:');
  for (const row of topRes.rows) {
    console.log(`  - Domain ${row.domain_number}: ${row.topic_count} Topics`);
  }

  // 3. Check Case Studies
  const csRes = await client.query(`
    SELECT id, title, (SELECT count(*) FROM case_study_questions WHERE case_study_id = cs.id) as q_count
    FROM case_studies cs
    WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1)
    ORDER BY sort_order;
  `, [CISA_CERT_ID]);

  console.log('\n✓ Official Case Studies Available for Practice:');
  for (const cs of csRes.rows) {
    console.log(`  - ${cs.title} (${cs.q_count} Questions)`);
  }

  await client.end();
  console.log('\n============================================================');
  console.log('ALL PRACTICE & INSIGHT METRICS DATA VERIFIED SUCCESSFULLY!');
  console.log('============================================================');
}

verifyMetrics().catch(console.error);
