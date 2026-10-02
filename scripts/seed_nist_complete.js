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

const NIST_CERT_ID = 'a0000000-0000-0000-0000-000000000004';
const DATA_DIR = path.resolve(__dirname, 'nist_data');

async function seedNIST() {
  console.log('============================================================');
  console.log('SEEDING COMPREHENSIVE NIST SPECIALIST PROGRAM (ALL NIST)');
  console.log('============================================================\n');
  await client.connect();

  const topicsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'topics.json'), 'utf8'));
  const chaptersData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'chapters.json'), 'utf8'));
  const caseStudiesData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'case_studies.json'), 'utf8'));
  const glossaryData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'glossary.json'), 'utf8'));
  const questionsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'questions.json'), 'utf8'));

  console.log(`Loaded NIST dataset files:`);
  console.log(`  - Topics/Subtopics: ${topicsData.length}`);
  console.log(`  - Master Chapters:  ${chaptersData.length}`);
  console.log(`  - Case Studies:     ${caseStudiesData.length}`);
  console.log(`  - Glossary Terms:   ${glossaryData.length}`);
  console.log(`  - Exam Questions:   ${questionsData.length}\n`);

  await client.query('BEGIN');

  try {
    // 1. Certification
    console.log('1. Upserting NIST Certification record...');
    await client.query(`
      INSERT INTO certifications (
        id, slug, name, version, publisher, total_domains, total_exam_questions,
        exam_duration_minutes, passing_score_percent, description, code, body,
        format, passing_scaled_score, scaled_score_min, scaled_score_max,
        study_mastery_threshold_pct, created_at, updated_at
      ) VALUES (
        $1, 'nist-grc', 'NIST — Frameworks, RMF & AI Risk Management Specialist',
        'Official NIST Special Publications & Frameworks 2024/2025 Edition',
        'National Institute of Standards and Technology (NIST)', 5, 100, 120, 75.00,
        'Comprehensive professional credential covering NIST Cybersecurity Framework (CSF 2.0), Risk Management Framework (RMF 2.0 / SP 800-37), SP 800-53 Rev. 5 Controls Catalog, SP 800-171 / CMMC 2.0, NIST AI RMF 1.0 (AI 100-1), and Specialized Publications (SP 800-30, 61, 88, 137).',
        'NIST', 'NIST', 'fixed_form', 750, 200, 1000, 80.00, NOW(), NOW()
      ) ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        name = EXCLUDED.name,
        version = EXCLUDED.version,
        publisher = EXCLUDED.publisher,
        total_domains = EXCLUDED.total_domains,
        total_exam_questions = EXCLUDED.total_exam_questions,
        exam_duration_minutes = EXCLUDED.exam_duration_minutes,
        passing_score_percent = EXCLUDED.passing_score_percent,
        passing_scaled_score = EXCLUDED.passing_scaled_score,
        code = EXCLUDED.code,
        body = EXCLUDED.body,
        description = EXCLUDED.description,
        updated_at = NOW();
    `, [NIST_CERT_ID]);

    // 2. Clean prior NIST child entities and old domains
    console.log('2. Cleaning previous NIST child entities...');
    await client.query(`DELETE FROM questions WHERE certification_id = $1;`, [NIST_CERT_ID]);
    await client.query(`DELETE FROM study_materials WHERE certification_id = $1;`, [NIST_CERT_ID]);
    await client.query(`DELETE FROM glossary_terms WHERE certification_id = $1;`, [NIST_CERT_ID]);
    await client.query(`
      DELETE FROM case_study_questions WHERE case_study_id IN (
        SELECT id FROM case_studies WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1)
      );
    `, [NIST_CERT_ID]);
    await client.query(`
      DELETE FROM case_studies WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1);
    `, [NIST_CERT_ID]);
    await client.query(`
      DELETE FROM subtopics WHERE topic_id IN (
        SELECT id FROM topics WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1)
      );
    `, [NIST_CERT_ID]);
    await client.query(`
      DELETE FROM topics WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1);
    `, [NIST_CERT_ID]);
    await client.query(`
      DELETE FROM domains WHERE certification_id = $1;
    `, [NIST_CERT_ID]);

    // 3. Domains
    console.log('3. Inserting 5 Official NIST Domains...');
    const domainMap = {
      1: 'd0000000-0000-0000-0000-000000000041',
      2: 'd0000000-0000-0000-0000-000000000042',
      3: 'd0000000-0000-0000-0000-000000000043',
      4: 'd0000000-0000-0000-0000-000000000044',
      5: 'd0000000-0000-0000-0000-000000000045',
    };

    const domainDefs = [
      {
        id: domainMap[1],
        domain_number: 1,
        name: 'NIST Cybersecurity Framework 2.0 (CSF 2.0)',
        weight: 25.00,
        approx_qs: 25,
        part_a_title: 'The 6 Core Functions (Govern, Identify, Protect, Detect, Respond, Recover)',
        part_b_title: 'Implementation Tiers, Organizational Profiles & C-SCRM',
        learning_objectives: 'Master the 6 Core Functions of CSF 2.0, categories, subcategories, Implementation Tiers (1 to 4), profiles, and supply chain risk management.'
      },
      {
        id: domainMap[2],
        domain_number: 2,
        name: 'NIST Risk Management Framework (RMF 2.0 - SP 800-37 Rev. 2)',
        weight: 25.00,
        approx_qs: 25,
        part_a_title: 'The 7 RMF Steps & FIPS 199/200 Security Categorization',
        part_b_title: 'System Security Plan (SSP), POA&M, and Authorization to Operate (ATO)',
        learning_objectives: 'Execute the 7 RMF lifecycle steps, apply FIPS 199 High-Water Mark categorization, author SSPs, and assemble ATO authorization packages.'
      },
      {
        id: domainMap[3],
        domain_number: 3,
        name: 'NIST SP 800-53 Rev. 5 Controls Catalog & SP 800-171 / CMMC 2.0',
        weight: 20.00,
        approx_qs: 20,
        part_a_title: 'SP 800-53 Rev. 5 Control Families, Baselines & Privacy Overlays',
        part_b_title: 'NIST SP 800-171 Rev. 3 & CMMC 2.0 (Protecting CUI)',
        learning_objectives: 'Navigate the 20 SP 800-53 control families, select privacy baselines, and implement SP 800-171 requirements for defense contractors.'
      },
      {
        id: domainMap[4],
        domain_number: 4,
        name: 'NIST AI Risk Management Framework (AI RMF 1.0 - AI 100-1)',
        weight: 15.00,
        approx_qs: 15,
        part_a_title: 'Characteristics of Trustworthy Artificial Intelligence',
        part_b_title: 'The 4 AI RMF Core Functions (GOVERN, MAP, MEASURE, MANAGE)',
        learning_objectives: 'Evaluate AI systems against Trustworthy AI characteristics and execute GOVERN, MAP, MEASURE, and MANAGE throughout the AI lifecycle.'
      },
      {
        id: domainMap[5],
        domain_number: 5,
        name: 'Specialized NIST Special Publications (SP 800-30, 61, 88, 137)',
        weight: 15.00,
        approx_qs: 15,
        part_a_title: 'SP 800-30 Rev. 1 (Risk Assessment) & SP 800-137 (Continuous Monitoring - ISCM)',
        part_b_title: 'SP 800-61 Rev. 2 (Incident Response) & SP 800-88 Rev. 1 (Media Sanitization)',
        learning_objectives: 'Conduct risk assessments under SP 800-30, design ISCM programs under SP 800-137, manage incidents under SP 800-61, and sanitize media under SP 800-88.'
      }
    ];

    for (const d of domainDefs) {
      await client.query(`
        INSERT INTO domains (
          id, certification_id, domain_number, name, exam_weight_percent,
          approx_exam_questions, part_a_title, part_b_title, learning_objectives,
          sort_order, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()
        ) ON CONFLICT (id) DO UPDATE SET
          certification_id = EXCLUDED.certification_id,
          name = EXCLUDED.name,
          exam_weight_percent = EXCLUDED.exam_weight_percent,
          approx_exam_questions = EXCLUDED.approx_exam_questions,
          part_a_title = EXCLUDED.part_a_title,
          part_b_title = EXCLUDED.part_b_title,
          learning_objectives = EXCLUDED.learning_objectives,
          sort_order = EXCLUDED.sort_order;
      `, [
        d.id, NIST_CERT_ID, d.domain_number, d.name, d.weight,
        d.approx_qs, d.part_a_title, d.part_b_title, d.learning_objectives,
        d.domain_number
      ]);
    }

    // 4. Insert Topics & Subtopics
    console.log('4. Inserting 24 Canonical Topics and Subtopics...');
    const topicIdMap = {};

    for (let i = 0; i < topicsData.length; i++) {
      const top = topicsData[i];
      const topicId = uuidv4();
      const domainId = domainMap[top.domain_number];
      topicIdMap[top.topic_code] = topicId;

      await client.query(`
        INSERT INTO topics (
          id, domain_id, topic_code, name, part, content_summary, sort_order, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW());
      `, [topicId, domainId, top.topic_code, top.name, top.part, top.summary, i + 1]);

      const subtopicId = uuidv4();
      await client.query(`
        INSERT INTO subtopics (
          id, topic_id, subtopic_code, name, content_body, key_terms,
          exam_tips, estimated_read_minutes, learning_objectives, sort_order, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW());
      `, [
        subtopicId,
        topicId,
        `${top.topic_code}.1`,
        top.name,
        top.content,
        top.key_terms || [],
        top.exam_tips,
        10,
        top.objectives,
        1
      ]);
    }

    // 5. Insert Master Chapters
    console.log('5. Inserting 5 Master Chapters for Document E-Reader...');
    for (let i = 0; i < chaptersData.length; i++) {
      const ch = chaptersData[i];
      const domainId = domainMap[ch.domain_number];
      const chId = uuidv4();

      await client.query(`
        INSERT INTO study_materials (
          id, certification_id, domain_id, topic_id, title, content_type,
          content_body, sort_order, document_title, edition, chapter_number,
          section_number, page_start, page_end, estimated_read_minutes,
          file_reference, key_takeaways, exam_tips, created_at
        ) VALUES (
          $1, $2, $3, NULL, $4, 'text', $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW()
        );
      `, [
        chId,
        NIST_CERT_ID,
        domainId,
        ch.title,
        ch.content_body,
        ch.chapter_number,
        ch.document_title,
        ch.edition,
        ch.chapter_number,
        ch.section_number,
        ch.page_start,
        ch.page_end,
        ch.estimated_read_minutes,
        `official_nist_manual_ch${ch.chapter_number}.pdf`,
        ch.key_takeaways,
        ch.exam_tips
      ]);
    }

    // 6. Insert Case Studies and Questions
    console.log('6. Inserting 5 Scenario Case Studies and 10 Questions...');
    for (let i = 0; i < caseStudiesData.length; i++) {
      const cs = caseStudiesData[i];
      const domainId = domainMap[cs.domain_number];
      const csId = uuidv4();

      await client.query(`
        INSERT INTO case_studies (
          id, domain_id, title, scenario_text, sort_order, created_at
        ) VALUES ($1, $2, $3, $4, $5, NOW());
      `, [csId, domainId, cs.title, cs.scenario_text, cs.sort_order]);

      for (let j = 0; j < cs.questions.length; j++) {
        const csq = cs.questions[j];
        const csqId = uuidv4();
        await client.query(`
          INSERT INTO case_study_questions (
            id, case_study_id, question_number, stem, option_a, option_b,
            option_c, option_d, correct_answer, rationale, sort_order, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW());
        `, [
          csqId,
          csId,
          csq.question_number,
          csq.stem,
          csq.option_a,
          csq.option_b,
          csq.option_c,
          csq.option_d,
          csq.correct_answer,
          csq.rationale,
          j + 1
        ]);
      }
    }

    // 7. Insert Glossary Terms
    console.log('7. Inserting 37+ NIST Glossary Terms...');
    for (const g of glossaryData) {
      const gId = uuidv4();
      const domainId = domainMap[g.domain_number];
      await client.query(`
        INSERT INTO glossary_terms (
          id, certification_id, domain_id, term, acronym, definition, category, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW());
      `, [
        gId,
        NIST_CERT_ID,
        domainId,
        g.term,
        g.acronym || null,
        g.definition,
        `Domain ${g.domain_number}`
      ]);
    }

    // 8. Bulk Insert 512 Questions
    console.log('8. Inserting 512 Verified Questions into Question Bank...');
    const qValues = questionsData.map((q, idx) => {
      const qId = uuidv4();
      const domainId = domainMap[q.domain_number];
      const topicId = topicIdMap[q.topic_code] || null;

      return `(
        '${qId}'::uuid,
        '${NIST_CERT_ID}'::uuid,
        '${domainId}'::uuid,
        ${topicId ? `'${topicId}'::uuid` : 'NULL'},
        NULL,
        ${idx + 1},
        'mcq',
        ${escapeSql(q.stem)},
        NULL,
        ${escapeSql(q.option_a)},
        ${escapeSql(q.option_b)},
        ${escapeSql(q.option_c)},
        ${escapeSql(q.option_d)},
        '${q.correct_answer}',
        ${escapeSql(q.rationale)},
        NULL,
        NULL,
        NULL,
        NULL,
        '${q.difficulty || 'medium'}',
        'T${idx + 1}',
        ARRAY[${(q.tags || ['NIST', 'Cybersecurity']).map(t => escapeSql(t)).join(',')}],
        ${escapeSql(q.source_reference)},
        'verified',
        NULL,
        true,
        NOW(),
        NOW()
      )`;
    });

    for (let i = 0; i < qValues.length; i += 100) {
      const chunk = qValues.slice(i, i + 100);
      const insertSql = `
        INSERT INTO questions (
          id, certification_id, domain_id, topic_id, subtopic_id, question_number,
          question_type, stem, scenario_text, option_a, option_b, option_c, option_d,
          correct_answer, rationale, incorrect_rationale_a, incorrect_rationale_b,
          incorrect_rationale_c, incorrect_rationale_d, difficulty, task_statement,
          tags, source_reference, source_confidence, content_hash, is_active,
          created_at, updated_at
        ) VALUES ${chunk.join(',')}
      `;
      await client.query(insertSql);
    }

    await client.query('COMMIT');
    console.log('\n============================================================');
    console.log('NIST FRAMEWORKS & STANDARDS FULL SEEDING COMPLETE!');
    console.log('============================================================');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seeding failed! Rolled back transaction:', err);
    throw err;
  } finally {
    await client.end();
  }
}

function escapeSql(str) {
  if (!str) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

seedNIST().catch(console.error);
