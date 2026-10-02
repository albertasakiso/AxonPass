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

async function seedCisa28thEdition() {
  console.log('=== HIGH-SPEED CISA 28th EDITION (2024) DATABASE SEEDER ===\n');
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
  const sampleQuestions = JSON.parse(fs.readFileSync(path.join(dataDir, 'sample_questions.json'), 'utf8'));

  await client.query('BEGIN');

  try {
    // 1. Update CISA Certification metadata
    console.log('1. Updating CISA Certification metadata (August 2024 Outline)...');
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
    console.log('  ✓ CISA certification record updated.');

    // 2. Update CISA Domains
    console.log('2. Updating 5 CISA Domains with 2024 blueprint weights...');
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
    console.log(`  ✓ ${domains.length} CISA domains updated.`);

    // 3. Upsert Topics
    console.log('3. Upserting 60 CISA Topics (1A1 through 5B6)...');
    const topicIdMap = {};
    for (const t of topics) {
      const res = await client.query(`
        INSERT INTO topics (domain_id, topic_code, name, part, sort_order)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (domain_id, topic_code) DO UPDATE SET
          name = EXCLUDED.name,
          part = EXCLUDED.part,
          sort_order = EXCLUDED.sort_order
        RETURNING id;
      `, [t.domain_id, t.topic_code, t.name, t.part, t.sort_order]);
      topicIdMap[t.topic_code] = res.rows[0].id;
    }
    console.log(`  ✓ ${topics.length} topics upserted.`);

    // 4. Upsert Subtopics
    console.log('4. Upserting Subtopic Learning Modules...');
    for (const s of subtopics) {
      const topicId = topicIdMap[s.topic_code];
      if (!topicId) continue;

      await client.query(`
        INSERT INTO subtopics (topic_id, subtopic_code, name, content_body, estimated_read_minutes, sort_order, key_terms)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (topic_id, subtopic_code) DO UPDATE SET
          name = EXCLUDED.name,
          content_body = EXCLUDED.content_body,
          estimated_read_minutes = EXCLUDED.estimated_read_minutes,
          sort_order = EXCLUDED.sort_order,
          key_terms = EXCLUDED.key_terms;
      `, [
        topicId,
        s.subtopic_code,
        s.title,
        s.content_markdown,
        s.estimated_minutes,
        s.sort_order,
        s.key_concepts
      ]);
    }
    console.log(`  ✓ ${subtopics.length} subtopics upserted.`);

    // 5. Upsert Study Materials (5 Full E-Reader Chapters)
    console.log('5. Upserting 5 Full Manual Chapters into study_materials...');
    for (const m of studyMaterials) {
      await client.query(`
        INSERT INTO study_materials (
          id, certification_id, domain_id, title, content_type, content_body,
          document_title, edition, chapter_number, section_number, page_start, page_end,
          estimated_read_minutes, key_takeaways, exam_tips, sort_order
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
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
          sort_order = EXCLUDED.sort_order;
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
    console.log(`  ✓ ${studyMaterials.length} study material chapters saved.`);

    // 6. Upsert Official Case Studies & Questions
    console.log('6. Upserting 5 Official Case Studies & Questions...');
    for (const cs of caseStudies) {
      await client.query(`
        INSERT INTO case_studies (id, domain_id, title, scenario_text, sort_order)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          scenario_text = EXCLUDED.scenario_text,
          sort_order = EXCLUDED.sort_order;
      `, [
        cs.id,
        cs.domain_id,
        cs.title,
        cs.scenario,
        cs.sort_order
      ]);
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

    // 7. Upsert Glossary Terms
    console.log(`7. Upserting ${glossaryTerms.length} CISA 28th Edition Glossary Terms...`);
    for (const g of glossaryTerms) {
      await client.query(`
        INSERT INTO glossary_terms (certification_id, term, definition, category)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (certification_id, term) DO UPDATE SET
          definition = EXCLUDED.definition,
          category = EXCLUDED.category;
      `, [
        g.certification_id,
        g.term,
        g.definition,
        g.category
      ]);
    }
    console.log(`  ✓ ${glossaryTerms.length} glossary terms upserted.`);

    // 8. Seed High-Yield Topic-Aligned Practice Questions
    console.log(`8. Seeding Topic-Aligned Practice Questions...`);
    const domainIdMap = {
      1: 'd0000000-0000-0000-0000-000000000001',
      2: 'd0000000-0000-0000-0000-000000000002',
      3: 'd0000000-0000-0000-0000-000000000003',
      4: 'd0000000-0000-0000-0000-000000000004',
      5: 'd0000000-0000-0000-0000-000000000005',
    };

    let qCount = 0;
    for (const q of sampleQuestions) {
      const domainId = domainIdMap[q.domain_num];
      const topicId = topicIdMap[q.topicCode] || null;
      const contentHash = crypto.createHash('sha256').update(q.stem + q.a + q.b + q.c + q.d).digest('hex');

      const existing = await client.query('SELECT id FROM questions WHERE content_hash = $1', [contentHash]);
      if (existing.rows.length === 0) {
        await client.query(`
          INSERT INTO questions (
            certification_id, domain_id, topic_id, question_number,
            difficulty, stem, scenario_text, option_a, option_b, option_c, option_d,
            correct_answer, rationale, tags, source_reference, source_confidence, is_active, content_hash
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        `, [
          CISA_CERT_ID,
          domainId,
          topicId,
          q.num,
          q.diff,
          q.stem,
          q.scenario,
          q.a,
          q.b,
          q.c,
          q.d,
          q.ans,
          q.rationale,
          q.tags,
          q.source,
          'verified',
          true,
          contentHash
        ]);
        qCount++;
      }
    }
    console.log(`  ✓ ${qCount} new verified blueprint questions added.`);

    await client.query('COMMIT');
    console.log('\n============================================================');
    console.log('CISA 28th EDITION (2024) SEEDING COMMITTED SUCCESSFULLY!');
    console.log('============================================================');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    await client.end();
  }
}

seedCisa28thEdition().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
