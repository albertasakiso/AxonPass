import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';

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

const CISSP_CERT_ID = 'a0000000-0000-0000-0000-000000000007';
const DATA_DIR = path.resolve(__dirname, 'cissp_data');

async function seedCISSP() {
  console.log('============================================================');
  console.log('SEEDING COMPREHENSIVE ISC2 CISSP (10TH EDITION 2024)');
  console.log('============================================================\n');
  await client.connect();

  const domainsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'domains.json'), 'utf8'));
  const topicsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'topics.json'), 'utf8'));
  const subtopicsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'subtopics.json'), 'utf8'));
  const materialsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'study_materials.json'), 'utf8'));
  const glossaryData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'glossary.json'), 'utf8'));
  const caseStudiesData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'case_studies.json'), 'utf8'));
  const questionsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'questions.json'), 'utf8'));

  console.log(`Loaded dataset files:`);
  console.log(`  - Domains:          ${domainsData.length}`);
  console.log(`  - Topics:           ${topicsData.length}`);
  console.log(`  - Subtopics:        ${subtopicsData.length}`);
  console.log(`  - Master Chapters:  ${materialsData.length}`);
  console.log(`  - Glossary Terms:   ${glossaryData.length}`);
  console.log(`  - Case Studies:     ${caseStudiesData.length}`);
  console.log(`  - Exam Questions:   ${questionsData.length}\n`);

  await client.query('BEGIN');

  try {
    // 1. Certification
    console.log('1. Upserting Certification record...');
    await client.query(`
      INSERT INTO certifications (
        id, slug, name, version, publisher, total_domains, total_exam_questions,
        exam_duration_minutes, passing_score_percent, description, code, body,
        format, passing_scaled_score, scaled_score_min, scaled_score_max,
        study_mastery_threshold_pct, created_at, updated_at
      ) VALUES (
        $1, 'cissp', 'CISSP — Certified Information Systems Security Professional',
        '10th Edition (2024)',
        'ISC2', 8, 150, 240, 70.00,
        'The gold standard in information security leadership, covering 8 security domains from security and risk management to software development security.',
        'CISSP', 'ISC2', 'fixed_form', 700, 200, 1000, 80.00, NOW(), NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        publisher = EXCLUDED.publisher,
        total_domains = EXCLUDED.total_domains,
        total_exam_questions = EXCLUDED.total_exam_questions,
        passing_scaled_score = EXCLUDED.passing_scaled_score,
        scaled_score_min = EXCLUDED.scaled_score_min,
        scaled_score_max = EXCLUDED.scaled_score_max,
        description = EXCLUDED.description,
        version = EXCLUDED.version;
    `, [CISSP_CERT_ID]);

    // 2. Domains
    console.log('2. Upserting 8 Domains...');
    for (const d of domainsData) {
      await client.query(`
        INSERT INTO domains (
          id, certification_id, domain_number, name, exam_weight_percent,
          approx_exam_questions, learning_objectives, suggested_resources, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          exam_weight_percent = EXCLUDED.exam_weight_percent,
          approx_exam_questions = EXCLUDED.approx_exam_questions,
          learning_objectives = EXCLUDED.learning_objectives,
          suggested_resources = EXCLUDED.suggested_resources,
          sort_order = EXCLUDED.sort_order;
      `, [
        d.id, CISSP_CERT_ID, d.domain_number, d.name, d.exam_weight_percent,
        d.approx_exam_questions, d.learning_objectives, d.suggested_resources, d.domain_number
      ]);
    }

    // 3. Topics
    console.log('3. Upserting Topics...');
    for (const t of topicsData) {
      await client.query(`
        INSERT INTO topics (
          id, domain_id, topic_code, name, part, content_summary, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          topic_code = EXCLUDED.topic_code,
          name = EXCLUDED.name,
          part = EXCLUDED.part,
          content_summary = EXCLUDED.content_summary,
          sort_order = EXCLUDED.sort_order;
      `, [t.id, t.domain_id, t.topic_code, t.name, t.part, t.content_summary, t.sort_order]);
    }

    // 4. Subtopics
    console.log('4. Upserting Subtopics...');
    for (const s of subtopicsData) {
      await client.query(`
        INSERT INTO subtopics (
          id, topic_id, subtopic_code, name, content_body, key_terms,
          exam_tips, estimated_read_minutes, learning_objectives, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          subtopic_code = EXCLUDED.subtopic_code,
          name = EXCLUDED.name,
          content_body = EXCLUDED.content_body,
          key_terms = EXCLUDED.key_terms,
          exam_tips = EXCLUDED.exam_tips,
          estimated_read_minutes = EXCLUDED.estimated_read_minutes,
          learning_objectives = EXCLUDED.learning_objectives,
          sort_order = EXCLUDED.sort_order;
      `, [
        s.id, s.topic_id, s.subtopic_code, s.name, s.content_body, s.key_terms,
        s.exam_tips, s.estimated_read_minutes, s.learning_objectives, s.sort_order
      ]);
    }

    // 5. Study Materials
    console.log('5. Upserting Study Materials (Master Chapters)...');
    for (const m of materialsData) {
      await client.query(`
        INSERT INTO study_materials (
          id, certification_id, domain_id, topic_id, title, content_type,
          content_body, document_title, edition, chapter_number, section_number,
          page_start, page_end, estimated_read_minutes, key_takeaways,
          exam_tips, file_reference, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          content_type = EXCLUDED.content_type,
          content_body = EXCLUDED.content_body,
          document_title = EXCLUDED.document_title,
          edition = EXCLUDED.edition,
          chapter_number = EXCLUDED.chapter_number,
          section_number = EXCLUDED.section_number,
          page_start = EXCLUDED.page_start,
          page_end = EXCLUDED.page_end,
          estimated_read_minutes = EXCLUDED.estimated_read_minutes,
          key_takeaways = EXCLUDED.key_takeaways,
          exam_tips = EXCLUDED.exam_tips,
          file_reference = EXCLUDED.file_reference,
          sort_order = EXCLUDED.sort_order;
      `, [
        m.id, m.certification_id, m.domain_id, m.topic_id, m.title, m.content_type,
        m.content_body, m.document_title, m.edition, m.chapter_number, m.section_number,
        m.page_start, m.page_end, m.estimated_read_minutes, m.key_takeaways,
        m.exam_tips, m.file_reference, m.sort_order
      ]);
    }

    // 6. Glossary Terms
    console.log('6. Seeding Glossary Terms...');
    await client.query('DELETE FROM glossary_terms WHERE certification_id = $1', [CISSP_CERT_ID]);
    for (const g of glossaryData) {
      await client.query(`
        INSERT INTO glossary_terms (
          id, certification_id, domain_id, term, acronym, definition, category
        ) VALUES ($1, $2, $3, $4, $5, $6, $7);
      `, [uuidv4(), CISSP_CERT_ID, g.domain_id, g.term, g.acronym, g.definition, g.category]);
    }

    // 7. Case Studies
    console.log('7. Seeding Case Studies & Questions...');
    for (const cs of caseStudiesData) {
      await client.query(`
        INSERT INTO case_studies (id, domain_id, title, scenario_text, sort_order)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          scenario_text = EXCLUDED.scenario_text,
          sort_order = EXCLUDED.sort_order;
      `, [cs.id, cs.domain_id, cs.title, cs.scenario_text, cs.sort_order]);

      await client.query('DELETE FROM case_study_questions WHERE case_study_id = $1', [cs.id]);
      for (const q of cs.questions) {
        await client.query(`
          INSERT INTO case_study_questions (
            id, case_study_id, question_number, stem, option_a, option_b,
            option_c, option_d, correct_answer, rationale, sort_order
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
        `, [
          uuidv4(), cs.id, q.question_number, q.stem, q.option_a, q.option_b,
          q.option_c, q.option_d, q.correct_answer, q.rationale, q.sort_order
        ]);
      }
    }

    // 8. Questions
    console.log('8. Seeding Exam Questions in batches...');
    await client.query('DELETE FROM questions WHERE certification_id = $1', [CISSP_CERT_ID]);

    const batchSize = 100;
    for (let i = 0; i < questionsData.length; i += batchSize) {
      const chunk = questionsData.slice(i, i + batchSize);
      for (const q of chunk) {
        await client.query(`
          INSERT INTO questions (
            id, certification_id, domain_id, topic_id, subtopic_id,
            question_number, question_type, stem, option_a, option_b,
            option_c, option_d, correct_answer, rationale, difficulty,
            tags, source_reference, source_confidence, is_active
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
          );
        `, [
          q.id, q.certification_id, q.domain_id, q.topic_id, q.subtopic_id,
          q.question_number, q.question_type, q.stem, q.option_a, q.option_b,
          q.option_c, q.option_d, q.correct_answer, q.rationale, q.difficulty,
          q.tags, q.source_reference, q.source_confidence, q.is_active
        ]);
      }
      process.stdout.write(`  Inserted ${Math.min(i + batchSize, questionsData.length)} / ${questionsData.length} questions\r`);
    }
    console.log('\n  All CISSP questions inserted successfully!');

    await client.query('COMMIT');
    console.log('\n✅ CISSP SEEDING COMPLETED PERFECTLY.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌ ERROR SEEDING CISSP:', err);
  } finally {
    await client.end();
  }
}

seedCISSP().catch(console.error);
