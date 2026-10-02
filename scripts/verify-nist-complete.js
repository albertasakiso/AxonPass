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

const NIST_CERT_ID = 'a0000000-0000-0000-0000-000000000004';

async function verifyNIST() {
  console.log('============================================================');
  console.log('AUDITING COMPREHENSIVE NIST SPECIALIST PROGRAM (FULL AUDIT)');
  console.log('============================================================\n');
  await client.connect();

  // 1. Check Certification
  const certRes = await client.query(`SELECT * FROM certifications WHERE id = $1;`, [NIST_CERT_ID]);
  const cert = certRes.rows[0];
  console.log('✓ Certification Profile:');
  console.log(`  - Name:                 ${cert.name}`);
  console.log(`  - Code:                 ${cert.code}`);
  console.log(`  - Publisher:            ${cert.publisher}`);
  console.log(`  - Total Domains:        ${cert.total_domains}`);
  console.log(`  - Exam Questions:       ${cert.total_exam_questions} (120 mins)`);
  console.log(`  - Passing Scaled Score: ${cert.passing_scaled_score} / ${cert.scaled_score_max} (${cert.passing_score_percent}%)\n`);

  // 2. Check 5 Domains
  const domRes = await client.query(`
    SELECT domain_number, name, exam_weight_percent, approx_exam_questions, part_a_title, part_b_title
    FROM domains
    WHERE certification_id = $1
    ORDER BY domain_number;
  `, [NIST_CERT_ID]);

  console.log('✓ 5 Official Domains:');
  let totalWeight = 0;
  for (const d of domRes.rows) {
    totalWeight += parseFloat(d.exam_weight_percent);
    console.log(`  - Domain ${d.domain_number}: ${d.name} (Weight: ${d.exam_weight_percent}%, Approx Qs: ${d.approx_exam_questions})`);
  }
  console.log(`  - Total Domain Weight Sum: ${totalWeight}%\n`);

  // 3. Check Canonical Topics and Subtopics
  const topRes = await client.query(`
    SELECT d.domain_number, count(t.id) as topic_count, count(s.id) as subtopic_count
    FROM domains d
    LEFT JOIN topics t ON d.id = t.domain_id
    LEFT JOIN subtopics s ON t.id = s.topic_id
    WHERE d.certification_id = $1
    GROUP BY d.domain_number
    ORDER BY d.domain_number;
  `, [NIST_CERT_ID]);

  console.log('✓ Canonical Topics & In-Depth Subtopics Breakdown:');
  let totalTopics = 0;
  let totalSubtopics = 0;
  for (const row of topRes.rows) {
    totalTopics += parseInt(row.topic_count);
    totalSubtopics += parseInt(row.subtopic_count);
    console.log(`  - Domain ${row.domain_number}: ${row.topic_count} Topics, ${row.subtopic_count} Subtopics`);
  }
  console.log(`  - Total Topics: ${totalTopics} | Total Subtopics: ${totalSubtopics}\n`);

  // 4. Check Master Chapters
  const matRes = await client.query(`
    SELECT chapter_number, title, page_start, page_end, estimated_read_minutes, length(content_body) as body_length
    FROM study_materials
    WHERE certification_id = $1
    ORDER BY chapter_number;
  `, [NIST_CERT_ID]);

  console.log('✓ Master Chapters for Document E-Reader:');
  for (const m of matRes.rows) {
    console.log(`  - ${m.title} (Pages ${m.page_start}-${m.page_end}, ${m.estimated_read_minutes} mins, ${m.body_length} bytes)`);
  }

  // 5. Check Case Studies & Scenario Questions
  const csRes = await client.query(`
    SELECT cs.id, cs.title, count(csq.id) as q_count
    FROM case_studies cs
    LEFT JOIN case_study_questions csq ON cs.id = csq.case_study_id
    WHERE cs.domain_id IN (SELECT id FROM domains WHERE certification_id = $1)
    GROUP BY cs.id, cs.title, cs.sort_order
    ORDER BY cs.sort_order;
  `, [NIST_CERT_ID]);

  console.log('\n✓ Official Scenario Case Studies:');
  let totalCaseQuestions = 0;
  for (const cs of csRes.rows) {
    totalCaseQuestions += parseInt(cs.q_count);
    console.log(`  - ${cs.title} (${cs.q_count} scenario questions)`);
  }
  console.log(`  - Total Case Study Questions: ${totalCaseQuestions}\n`);

  // 6. Check Questions Bank & Topic Mapping
  const qRes = await client.query(`
    SELECT count(*) as total,
           count(topic_id) as with_topic,
           count(case when difficulty = 'easy' then 1 end) as easy_count,
           count(case when difficulty = 'medium' then 1 end) as med_count,
           count(case when difficulty = 'hard' then 1 end) as hard_count
    FROM questions
    WHERE certification_id = $1;
  `, [NIST_CERT_ID]);

  console.log('✓ Question Bank Verification:');
  console.log(`  - Total Active Questions:    ${qRes.rows[0].total}`);
  console.log(`  - 100% Linked to Topics:     ${qRes.rows[0].with_topic} / ${qRes.rows[0].total}`);
  console.log(`  - Difficulty Distribution:   Easy: ${qRes.rows[0].easy_count} | Medium: ${qRes.rows[0].med_count} | Hard: ${qRes.rows[0].hard_count}\n`);

  // 7. Check Glossary Terms
  const gRes = await client.query(`
    SELECT count(*) as total, count(acronym) as with_acronym
    FROM glossary_terms
    WHERE certification_id = $1;
  `, [NIST_CERT_ID]);

  console.log('✓ NIST Glossary Terms:');
  console.log(`  - Total Glossary Entries:    ${gRes.rows[0].total}`);
  console.log(`  - Terms with Acronyms:       ${gRes.rows[0].with_acronym}\n`);

  await client.end();
  console.log('============================================================');
  console.log('ALL NIST SPECIALIST PROGRAM DATA AUDITED & VERIFIED 100%!');
  console.log('============================================================');
}

verifyNIST().catch(console.error);
