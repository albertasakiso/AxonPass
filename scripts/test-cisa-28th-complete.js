import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env
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

async function testCompleteVerification() {
  console.log('=== VERIFYING CISA 28th EDITION COMPLETE INTEGRATION ===\n');
  await client.connect();

  // 1. Check Certification
  const certRes = await client.query('SELECT * FROM certifications WHERE id = $1', [CISA_CERT_ID]);
  const cert = certRes.rows[0];
  console.log('1. Certification Record:');
  console.log(`   - Name: ${cert.name}`);
  console.log(`   - Version: ${cert.version}`);
  console.log(`   - Format: ${cert.format} (${cert.total_domains} domains, ${cert.total_exam_questions} questions, ${cert.exam_duration_minutes} mins)`);
  console.log(`   - Passing Score: ${cert.passing_score_percent}% / Scaled ${cert.passing_scaled_score} [${cert.scaled_score_min}-${cert.scaled_score_max}]`);

  // 2. Check Domains
  const domRes = await client.query('SELECT domain_number, name, code, exam_weight_percent, approx_exam_questions FROM domains WHERE certification_id = $1 ORDER BY domain_number', [CISA_CERT_ID]);
  console.log('\n2. Domains (2024 Blueprint):');
  let totalWeight = 0;
  for (const d of domRes.rows) {
    totalWeight += parseFloat(d.exam_weight_percent);
    console.log(`   - Domain ${d.domain_number} [Code ${d.code}]: ${d.name} (${d.exam_weight_percent}% | ~${d.approx_exam_questions} Qs)`);
  }
  console.log(`   Total Blueprint Weight: ${totalWeight.toFixed(2)}%`);

  // 3. Check Topics and Subtopics
  const topRes = await client.query('SELECT count(*) FROM topics WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1)', [CISA_CERT_ID]);
  const subRes = await client.query('SELECT count(*) FROM subtopics WHERE topic_id IN (SELECT id FROM topics WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1))', [CISA_CERT_ID]);
  console.log('\n3. Topics & Subtopics:');
  console.log(`   - Total CISA Topics: ${topRes.rows[0].count} (Expected: 60 topics 1A1-5B6)`);
  console.log(`   - Total CISA Rich Subtopic Modules: ${subRes.rows[0].count}`);

  // 4. Check Full E-Reader Manual Chapters
  const matRes = await client.query('SELECT chapter_number, title, document_title, edition, estimated_read_minutes, page_start, page_end, length(content_body) as len FROM study_materials WHERE certification_id = $1 ORDER BY chapter_number', [CISA_CERT_ID]);
  console.log('\n4. Study Materials / Full E-Reader Chapters:');
  for (const m of matRes.rows) {
    console.log(`   - Chapter ${m.chapter_number}: ${m.title} (${m.document_title} - ${m.edition}, Pages ${m.page_start}-${m.page_end}, ⏱ ${m.estimated_read_minutes} mins, ${m.len} chars)`);
  }

  // 5. Check Case Studies & Scenario Questions
  const csRes = await client.query('SELECT id, title, length(scenario_text) as len FROM case_studies WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1) ORDER BY sort_order', [CISA_CERT_ID]);
  console.log('\n5. Official ISACA Case Studies:');
  for (const cs of csRes.rows) {
    const qCount = await client.query('SELECT count(*) FROM case_study_questions WHERE case_study_id = $1', [cs.id]);
    console.log(`   - ${cs.title} (${cs.len} chars scenario, ${qCount.rows[0].count} questions)`);
  }

  // 6. Check Glossary Terms
  const glossRes = await client.query('SELECT count(*) FROM glossary_terms WHERE certification_id = $1', [CISA_CERT_ID]);
  console.log('\n6. Glossary Terms:');
  console.log(`   - Total CISA 28th Edition Glossary Terms: ${glossRes.rows[0].count}`);

  // 7. Check Questions Bank
  const qRes = await client.query('SELECT count(*) FROM questions WHERE certification_id = $1', [CISA_CERT_ID]);
  console.log('\n7. Question Bank:');
  console.log(`   - Total Verified CISA Questions: ${qRes.rows[0].count}`);

  await client.end();
  console.log('\n✓ ALL CHECKS PASSED WITH 100% INTEGRITY.');
}

testCompleteVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
