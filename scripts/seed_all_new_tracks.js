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

const TRACKS_CONFIG = [
  {
    code: 'FIFA-AGENT',
    slug: 'fifa-agent',
    id: 'a0000000-0000-0000-0000-000000000009',
    name: 'FIFA Football Agent Licensing Exam (2026 Edition)',
    version: '6th Edition (Jan 2026)',
    publisher: 'FIFA',
    body: 'FIFA',
    format: 'fixed_form',
    total_domains: 5,
    total_exam_questions: 100,
    exam_duration_minutes: 60,
    passing_score_percent: 75.00,
    passing_scaled_score: 75,
    scaled_score_min: 0,
    scaled_score_max: 100,
    study_mastery_threshold_pct: 80.00,
    description: 'Official 2026 examination for licensing as an international FIFA Football Agent, testing mastery of FFAR, RSTP, Clearing House, Statutes, Ethics, Disciplinary Code & Safeguarding.',
    dataDir: path.resolve(__dirname, 'fifa_agent_data')
  },
  {
    code: 'CGEIT',
    slug: 'cgeit',
    id: 'a0000000-0000-0000-0000-000000000010',
    name: 'CGEIT — Certified in the Governance of Enterprise IT',
    version: '8th Edition (COBIT 2019)',
    publisher: 'ISACA',
    body: 'ISACA',
    format: 'fixed_form',
    total_domains: 4,
    total_exam_questions: 150,
    exam_duration_minutes: 240,
    passing_score_percent: 70.00,
    passing_scaled_score: 450,
    scaled_score_min: 200,
    scaled_score_max: 800,
    study_mastery_threshold_pct: 80.00,
    description: 'ISACA executive credential demonstrating expertise in enterprise IT governance frameworks, strategic alignment, benefits realization, resource optimization, and risk management.',
    dataDir: path.resolve(__dirname, 'cgeit_data')
  },
  {
    code: 'CCSP',
    slug: 'ccsp',
    id: 'a0000000-0000-0000-0000-000000000011',
    name: 'CCSP — Certified Cloud Security Professional',
    version: '3rd Edition (2024)',
    publisher: 'ISC2 & Cloud Security Alliance',
    body: 'ISC2',
    format: 'fixed_form',
    total_domains: 6,
    total_exam_questions: 150,
    exam_duration_minutes: 240,
    passing_score_percent: 70.00,
    passing_scaled_score: 700,
    scaled_score_min: 0,
    scaled_score_max: 1000,
    study_mastery_threshold_pct: 80.00,
    description: 'The premier global credential in cloud security architecture, data governance, platform defense, infrastructure design, operations, and multi-cloud compliance.',
    dataDir: path.resolve(__dirname, 'ccsp_data')
  },
  {
    code: 'CYSA+',
    slug: 'cysa',
    id: 'a0000000-0000-0000-0000-000000000012',
    name: 'CompTIA CySA+ Cybersecurity Analyst',
    version: 'CS0-003 Edition',
    publisher: 'CompTIA',
    body: 'CompTIA',
    format: 'fixed_form',
    total_domains: 5,
    total_exam_questions: 85,
    exam_duration_minutes: 165,
    passing_score_percent: 75.00,
    passing_scaled_score: 750,
    scaled_score_min: 100,
    scaled_score_max: 900,
    study_mastery_threshold_pct: 80.00,
    description: 'Validating advanced skills in threat intelligence, vulnerability management, SIEM log analytics, proactive threat hunting, and incident forensics.',
    dataDir: path.resolve(__dirname, 'cysa_data')
  }
];

async function seedTrack(track) {
  console.log(`\n============================================================`);
  console.log(`SEEDING NEW TRACK: [${track.code}] ${track.name}`);
  console.log(`============================================================`);

  const domainsData = JSON.parse(fs.readFileSync(path.join(track.dataDir, 'domains.json'), 'utf8'));
  const topicsData = JSON.parse(fs.readFileSync(path.join(track.dataDir, 'topics.json'), 'utf8'));
  const subtopicsData = JSON.parse(fs.readFileSync(path.join(track.dataDir, 'subtopics.json'), 'utf8'));
  const materialsData = JSON.parse(fs.readFileSync(path.join(track.dataDir, 'study_materials.json'), 'utf8'));
  const glossaryData = JSON.parse(fs.readFileSync(path.join(track.dataDir, 'glossary.json'), 'utf8'));
  const caseStudiesData = JSON.parse(fs.readFileSync(path.join(track.dataDir, 'case_studies.json'), 'utf8'));
  const questionsData = JSON.parse(fs.readFileSync(path.join(track.dataDir, 'questions.json'), 'utf8'));

  console.log(`Dataset files loaded:`);
  console.log(`  - Domains:         ${domainsData.length}`);
  console.log(`  - Topics:          ${topicsData.length}`);
  console.log(`  - Subtopics:       ${subtopicsData.length}`);
  console.log(`  - Master Chapters: ${materialsData.length}`);
  console.log(`  - Glossary Terms:  ${glossaryData.length}`);
  console.log(`  - Case Studies:    ${caseStudiesData.length}`);
  console.log(`  - Exam Questions:  ${questionsData.length}\n`);

  await client.query('BEGIN');

  try {
    // 1. Upsert Certification
    console.log(`1. Upserting Certification record [${track.code}]...`);
    await client.query(`
      INSERT INTO certifications (
        id, slug, name, version, publisher, total_domains, total_exam_questions,
        exam_duration_minutes, passing_score_percent, description, code, body,
        format, passing_scaled_score, scaled_score_min, scaled_score_max,
        study_mastery_threshold_pct, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        slug = EXCLUDED.slug,
        publisher = EXCLUDED.publisher,
        total_domains = EXCLUDED.total_domains,
        total_exam_questions = EXCLUDED.total_exam_questions,
        passing_score_percent = EXCLUDED.passing_score_percent,
        passing_scaled_score = EXCLUDED.passing_scaled_score,
        scaled_score_min = EXCLUDED.scaled_score_min,
        scaled_score_max = EXCLUDED.scaled_score_max,
        description = EXCLUDED.description,
        version = EXCLUDED.version;
    `, [
      track.id, track.slug, track.name, track.version, track.publisher,
      track.total_domains, track.total_exam_questions, track.exam_duration_minutes,
      track.passing_score_percent, track.description, track.code, track.body,
      track.format, track.passing_scaled_score, track.scaled_score_min, track.scaled_score_max,
      track.study_mastery_threshold_pct
    ]);

    // 2. Domains
    console.log(`2. Upserting ${domainsData.length} Domains...`);
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
        d.id, track.id, d.domain_number, d.name, d.exam_weight_percent,
        d.approx_exam_questions, d.learning_objectives, d.suggested_resources, d.domain_number
      ]);
    }

    // 3. Topics
    console.log(`3. Upserting Topics...`);
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
    console.log(`4. Upserting Subtopics...`);
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
    console.log(`5. Upserting Master Study Manuals / Chapters...`);
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
    console.log(`6. Seeding Glossary Terms...`);
    await client.query('DELETE FROM glossary_terms WHERE certification_id = $1', [track.id]);
    for (const g of glossaryData) {
      await client.query(`
        INSERT INTO glossary_terms (
          id, certification_id, domain_id, term, acronym, definition, category
        ) VALUES ($1, $2, $3, $4, $5, $6, $7);
      `, [uuidv4(), track.id, g.domain_id, g.term, g.acronym, g.definition, g.category]);
    }

    // 7. Case Studies
    console.log(`7. Seeding Case Studies & Questions...`);
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

    // 8. High-Performance Multi-Row Batch Insert for Questions
    console.log(`8. Fast multi-row bulk inserting ${questionsData.length} Exam Questions...`);
    await client.query('DELETE FROM questions WHERE certification_id = $1', [track.id]);

    const batchSize = 50;
    for (let i = 0; i < questionsData.length; i += batchSize) {
      const chunk = questionsData.slice(i, i + batchSize);
      const values = [];
      const placeholders = [];
      
      chunk.forEach((q, idx) => {
        const offset = idx * 19;
        placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10}, $${offset + 11}, $${offset + 12}, $${offset + 13}, $${offset + 14}, $${offset + 15}, $${offset + 16}, $${offset + 17}, $${offset + 18}, $${offset + 19})`);
        values.push(
          q.id, q.certification_id, q.domain_id, q.topic_id, q.subtopic_id,
          q.question_number, q.question_type, q.stem, q.option_a, q.option_b,
          q.option_c, q.option_d, q.correct_answer, q.rationale, q.difficulty,
          q.tags, q.source_reference, q.source_confidence, q.is_active
        );
      });

      const queryText = `
        INSERT INTO questions (
          id, certification_id, domain_id, topic_id, subtopic_id,
          question_number, question_type, stem, option_a, option_b,
          option_c, option_d, correct_answer, rationale, difficulty,
          tags, source_reference, source_confidence, is_active
        ) VALUES ${placeholders.join(', ')}
      `;

      await client.query(queryText, values);
    }
    console.log(`  Inserted ${questionsData.length} questions successfully!`);

    await client.query('COMMIT');
    console.log(`✅ [${track.code}] SEEDED SUCCESSFULLY!`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`❌ ERROR SEEDING [${track.code}]:`, err);
    throw err;
  }
}

async function seedAllNewTracks() {
  await client.connect();
  console.log('========================================================================================');
  console.log('       APILIGUPASS — SEEDING ALL 4 NEW CERTIFICATIONS & MATERIALS');
  console.log('========================================================================================');

  for (const track of TRACKS_CONFIG) {
    await seedTrack(track);
  }

  await client.end();
  console.log('\n========================================================================================');
  console.log('ALL 4 NEW CERTIFICATION TRACKS INGESTED AND SEEDED TO DATABASE SUCCESSFULLY!');
  console.log('========================================================================================\n');
}

seedAllNewTracks().catch(console.error);
