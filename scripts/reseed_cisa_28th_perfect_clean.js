import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import crypto from 'crypto';

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

async function reseedClean() {
  console.log('=== CLEANING & RE-SEEDING CISA 28th EDITION (2024) CANONICAL BLUEPRINT ===\n');
  await client.connect();
  console.log('✓ Connected to PostgreSQL database.');

  const dataDir = path.resolve(__dirname, 'cisa_28th_data');
  const domains = JSON.parse(fs.readFileSync(path.join(dataDir, 'domains.json'), 'utf8'));
  const topics = JSON.parse(fs.readFileSync(path.join(dataDir, 'topics.json'), 'utf8'));
  const subtopics = JSON.parse(fs.readFileSync(path.join(dataDir, 'subtopics.json'), 'utf8'));
  const studyMaterials = JSON.parse(fs.readFileSync(path.join(dataDir, 'study_materials.json'), 'utf8'));
  const caseStudies = JSON.parse(fs.readFileSync(path.join(dataDir, 'case_studies.json'), 'utf8'));
  const caseStudyQuestions = JSON.parse(fs.readFileSync(path.join(dataDir, 'case_study_questions.json'), 'utf8'));
  const glossaryTerms = JSON.parse(fs.readFileSync(path.join(dataDir, 'glossary_terms.json'), 'utf8'));

  await client.query('BEGIN');

  try {
    // 1. Update Certification
    console.log('1. Updating CISA Certification metadata...');
    await client.query(`
      UPDATE certifications SET
        version = 'Exam Content Outline (Aug 2024 / 28th Edition)',
        total_domains = 5,
        total_exam_questions = 150,
        exam_duration_minutes = 240,
        passing_score_percent = 80.00,
        passing_scaled_score = 450,
        scaled_score_min = 200,
        scaled_score_max = 800,
        study_mastery_threshold_pct = 80.00,
        format = 'fixed_form',
        code = 'CISA',
        body = 'ISACA',
        description = 'ISACA Certified Information Systems Auditor (CISA) — 28th Edition (2024). Validates world-class expertise in IS audit, governance, acquisition, operations resilience, and information asset protection.'
      WHERE id = $1;
    `, [CISA_CERT_ID]);

    // 2. Update 5 Domains
    console.log('2. Updating 5 Domains with August 2024 weights (18%, 18%, 12%, 26%, 26%)...');
    for (const d of domains) {
      await client.query(`
        INSERT INTO domains (id, certification_id, domain_number, name, code, exam_weight_percent, approx_exam_questions, learning_objectives, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          code = EXCLUDED.code,
          exam_weight_percent = EXCLUDED.exam_weight_percent,
          approx_exam_questions = EXCLUDED.approx_exam_questions,
          learning_objectives = EXCLUDED.learning_objectives,
          sort_order = EXCLUDED.sort_order;
      `, [
        d.id,
        CISA_CERT_ID,
        d.domain_number,
        d.name,
        d.code,
        d.exam_weight_percent,
        d.approx_exam_questions,
        d.learning_objectives,
        d.domain_number
      ]);
    }
    console.log(`  ✓ 5 domains updated.`);

    // 3. Clean legacy topics and subtopics for CISA
    console.log('3. Cleaning obsolete/legacy CISA topics and subtopics...');
    // Unlink topic_id on questions pointing to CISA topics to avoid FK violations
    await client.query(`
      UPDATE questions
      SET topic_id = NULL
      WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1);
    `, [CISA_CERT_ID]);

    // Delete subtopics for CISA domains
    await client.query(`
      DELETE FROM subtopics
      WHERE topic_id IN (
        SELECT t.id FROM topics t
        JOIN domains d ON t.domain_id = d.id
        WHERE d.certification_id = $1
      );
    `, [CISA_CERT_ID]);

    // Delete all existing topics for CISA domains so we have clean 60 canonical topics
    await client.query(`
      DELETE FROM topics
      WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1);
    `, [CISA_CERT_ID]);
    console.log('  ✓ Obsolete topics and subtopics cleared.');

    // 4. Insert the 60 Canonical Topics (1A1 through 5B6)
    console.log('4. Inserting 60 Canonical Topics (1A1 through 5B6)...');
    const topicIdMap = {};
    for (const t of topics) {
      const res = await client.query(`
        INSERT INTO topics (domain_id, topic_code, name, part, sort_order, content_summary)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id;
      `, [t.domain_id, t.topic_code, t.name, t.part, t.sort_order, t.content_summary]);
      topicIdMap[t.topic_code] = res.rows[0].id;
    }
    console.log(`  ✓ Exactly ${topics.length} canonical topics inserted.`);

    // 5. Insert 60 Rich Subtopic Lessons with Exam Watch Alerts
    console.log('5. Inserting 60 In-Depth Subtopics with Exam Watch Alerts...');
    for (const s of subtopics) {
      const topicId = topicIdMap[s.topic_code];
      if (!topicId) continue;

      await client.query(`
        INSERT INTO subtopics (topic_id, subtopic_code, name, content_body, estimated_read_minutes, sort_order, key_terms, learning_objectives, exam_tips)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
      `, [
        topicId,
        s.subtopic_code,
        s.title,
        s.content_markdown,
        s.estimated_minutes,
        s.sort_order,
        s.key_concepts,
        s.learning_objectives,
        "Review all embedded 'ISACA / Exam Watch Alert' boxes in this lesson for key exam traps and rules."
      ]);
    }
    console.log(`  ✓ ${subtopics.length} subtopics inserted.`);

    // 6. Clean and Replace Study Materials (Exactly 5 Master Chapters)
    console.log('6. Cleaning and replacing study_materials with 5 Comprehensive Master Chapters...');
    await client.query(`
      DELETE FROM study_materials
      WHERE certification_id = $1;
    `, [CISA_CERT_ID]);

    for (const m of studyMaterials) {
      await client.query(`
        INSERT INTO study_materials (
          id, certification_id, domain_id, title, content_type, content_body,
          document_title, edition, chapter_number, section_number, page_start, page_end,
          estimated_read_minutes, key_takeaways, exam_tips, sort_order
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16);
      `, [
        m.id,
        m.certification_id,
        m.domain_id,
        m.title,
        'text',
        m.content_markdown,
        m.document_title,
        m.edition,
        m.chapter_number,
        m.section_number,
        m.page_start,
        m.page_end,
        m.estimated_read_minutes,
        m.key_takeaways,
        m.exam_tips,
        m.sort_order
      ]);
    }
    console.log(`  ✓ ${studyMaterials.length} master chapters inserted into study_materials.`);

    // 7. Case Studies & Questions
    console.log('7. Upserting 5 Official Case Studies & 10 Scenario Questions...');
    for (const cs of caseStudies) {
      await client.query(`
        INSERT INTO case_studies (id, domain_id, title, scenario_text, sort_order)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          scenario_text = EXCLUDED.scenario_text,
          sort_order = EXCLUDED.sort_order;
      `, [cs.id, cs.domain_id, cs.title, cs.scenario, cs.sort_order]);
    }

    for (const csq of caseStudyQuestions) {
      await client.query(`
        INSERT INTO case_study_questions (id, case_study_id, question_number, stem, option_a, option_b, option_c, option_d, correct_answer, rationale, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          stem = EXCLUDED.stem,
          option_a = EXCLUDED.option_a,
          option_b = EXCLUDED.option_b,
          option_c = EXCLUDED.option_c,
          option_d = EXCLUDED.option_d,
          correct_answer = EXCLUDED.correct_answer,
          rationale = EXCLUDED.rationale,
          sort_order = EXCLUDED.sort_order;
      `, [
        csq.id,
        csq.case_study_id,
        csq.question_number,
        csq.stem,
        csq.option_a,
        csq.option_b,
        csq.option_c,
        csq.option_d,
        csq.correct_option,
        csq.rationale,
        csq.sort_order
      ]);
    }
    console.log(`  ✓ ${caseStudies.length} case studies and ${caseStudyQuestions.length} scenario questions seeded.`);

    // 8. Glossary Terms
    console.log(`8. Upserting ${glossaryTerms.length} CISA 28th Edition Glossary Terms...`);
    for (const g of glossaryTerms) {
      await client.query(`
        INSERT INTO glossary_terms (certification_id, term, definition, category)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (certification_id, term) DO UPDATE SET
          definition = EXCLUDED.definition,
          category = EXCLUDED.category;
      `, [g.certification_id, g.term, g.definition, g.category]);
    }
    console.log(`  ✓ ${glossaryTerms.length} glossary terms seeded.`);

    // Re-link questions with matching topic codes
    console.log('9. Re-linking verified questions to canonical topics...');
    for (const [code, topicId] of Object.entries(topicIdMap)) {
      // Map questions with tag or topicCode
      await client.query(`
        UPDATE questions
        SET topic_id = $1
        WHERE domain_id IN (SELECT domain_id FROM topics WHERE id = $1)
          AND (tags @> ARRAY[$2]::text[] OR source_reference ILIKE $3);
      `, [topicId, code, `%${code}%`]);
    }
    console.log('  ✓ Questions re-linked.');

    await client.query('COMMIT');
    console.log('\n============================================================');
    console.log('CISA 28th EDITION COMPLETE RE-SEEDING SUCCESSFUL!');
    console.log('============================================================');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    await client.end();
  }
}

reseedClean().catch(err => {
  console.error('Re-seeding error:', err);
  process.exit(1);
});
