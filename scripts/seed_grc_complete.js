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

const GRC_CERT_ID = 'a0000000-0000-0000-0000-000000000008';
const DATA_DIR = path.resolve(__dirname, 'grc_data');

async function seedGRC() {
  console.log('============================================================');
  console.log('SEEDING COMPREHENSIVE STANDALONE GRC PROGRAM (SEPARATE)');
  console.log('============================================================\n');
  await client.connect();

  const topicsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'topics.json'), 'utf8'));
  const chaptersData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'chapters.json'), 'utf8'));
  const caseStudiesData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'case_studies.json'), 'utf8'));
  const glossaryData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'glossary.json'), 'utf8'));
  const questionsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'questions.json'), 'utf8'));

  console.log(`Loaded GRC dataset files:`);
  console.log(`  - Topics/Subtopics: ${topicsData.length}`);
  console.log(`  - Master Chapters:  ${chaptersData.length}`);
  console.log(`  - Case Studies:     ${caseStudiesData.length}`);
  console.log(`  - Glossary Terms:   ${glossaryData.length}`);
  console.log(`  - Exam Questions:   ${questionsData.length}\n`);

  await client.query('BEGIN');

  try {
    // 1. Certification
    console.log('1. Upserting Standalone GRC Certification record...');
    await client.query(`
      INSERT INTO certifications (
        id, slug, name, version, publisher, total_domains, total_exam_questions,
        exam_duration_minutes, passing_score_percent, description, code, body,
        format, passing_scaled_score, scaled_score_min, scaled_score_max,
        study_mastery_threshold_pct, created_at, updated_at
      ) VALUES (
        $1, 'grc', 'GRC — Enterprise Governance, Risk Management & Compliance Professional',
        'Official Enterprise GRC Body of Knowledge 2024/2025 Edition',
        'OCEG & ISO/COSO/ISACA Standards', 4, 100, 120, 75.00,
        'Comprehensive professional credential proving mastery of corporate IT governance architecture, enterprise risk management (ERM), regulatory compliance mandates (SOX, GDPR, HIPAA, PCI-DSS), and internal control assurance.',
        'GRC', 'OCEG & ISO/COSO', 'fixed_form', 750, 200, 1000, 80.00, NOW(), NOW()
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
    `, [GRC_CERT_ID]);

    // 2. Domains
    console.log('2. Upserting 4 Official GRC Domains...');
    const domainMap = {
      1: 'd0000000-0000-0000-0000-000000000081',
      2: 'd0000000-0000-0000-0000-000000000082',
      3: 'd0000000-0000-0000-0000-000000000083',
      4: 'd0000000-0000-0000-0000-000000000084',
    };

    const domainDefs = [
      {
        id: domainMap[1],
        domain_number: 1,
        name: 'Corporate & IT Governance Architecture',
        weight: 25.00,
        approx_qs: 25,
        part_a_title: 'Governance Models & Strategic Alignment',
        part_b_title: 'Enterprise Architecture & Policy Frameworks',
        learning_objectives: 'Master the IIA Three Lines Model, Board of Directors oversight, IT Steering Committees, COBIT 2019 principles, ISO/IEC 38500, and policy lifecycle governance.'
      },
      {
        id: domainMap[2],
        domain_number: 2,
        name: 'Enterprise Risk Management (ERM) & Assessment',
        weight: 30.00,
        approx_qs: 30,
        part_a_title: 'Risk Architecture & Risk Appetite',
        part_b_title: 'Risk Identification, Analysis & Treatment',
        learning_objectives: 'Understand COSO ERM, ISO 31000:2018 guidelines, Risk Appetite vs Tolerance, Quantitative Risk Analysis (SLE, ARO, ALE), Risk Registers, and the 4 Risk Treatment Options.'
      },
      {
        id: domainMap[3],
        domain_number: 3,
        name: 'Regulatory Compliance, Legal & Assurance',
        weight: 25.00,
        approx_qs: 25,
        part_a_title: 'Global Regulatory Landscapes & Mandates',
        part_b_title: 'Compliance Auditing, Evidence & Assurance',
        learning_objectives: 'Master Sarbanes-Oxley SOX 404, GDPR data privacy, HIPAA/HITECH, PCI-DSS 4.0, SOC 1 vs SOC 2 Type I/II reports, ISO 27001 ISMS certification, and Third-Party Vendor Risk Management (TPRM).'
      },
      {
        id: domainMap[4],
        domain_number: 4,
        name: 'Internal Controls, Audit & Continuous Monitoring',
        weight: 20.00,
        approx_qs: 20,
        part_a_title: 'Internal Control Design & COSO Framework',
        part_b_title: 'GRC Technology Platforms, Metrics & Dashboards',
        learning_objectives: 'Differentiate the 5 components of COSO Internal Control, Preventive vs Detective controls, Segregation of Duties (SoD), Key Risk Indicators (KRIs), KPIs, and executive GRC dashboards.'
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
        d.id, GRC_CERT_ID, d.domain_number, d.name, d.weight,
        d.approx_qs, d.part_a_title, d.part_b_title, d.learning_objectives,
        d.domain_number
      ]);
    }

    // 3. Clean prior GRC child entities
    console.log('3. Cleaning previous GRC child entities...');
    await client.query(`DELETE FROM questions WHERE certification_id = $1;`, [GRC_CERT_ID]);
    await client.query(`DELETE FROM study_materials WHERE certification_id = $1;`, [GRC_CERT_ID]);
    await client.query(`DELETE FROM glossary_terms WHERE certification_id = $1;`, [GRC_CERT_ID]);
    await client.query(`
      DELETE FROM case_study_questions WHERE case_study_id IN (
        SELECT id FROM case_studies WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1)
      );
    `, [GRC_CERT_ID]);
    await client.query(`
      DELETE FROM case_studies WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1);
    `, [GRC_CERT_ID]);
    await client.query(`
      DELETE FROM subtopics WHERE topic_id IN (
        SELECT id FROM topics WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1)
      );
    `, [GRC_CERT_ID]);
    await client.query(`
      DELETE FROM topics WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1);
    `, [GRC_CERT_ID]);

    // 4. Insert Topics & Subtopics
    console.log('4. Inserting 28 Canonical Topics and Subtopics...');
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
    console.log('5. Inserting 4 Master Chapters for Document E-Reader...');
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
        GRC_CERT_ID,
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
        `official_grc_manual_ch${ch.chapter_number}.pdf`,
        ch.key_takeaways,
        ch.exam_tips
      ]);
    }

    // 6. Insert Case Studies and Questions
    console.log('6. Inserting 4 Scenario Case Studies and 8 Questions...');
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
    console.log('7. Inserting 57+ GRC Glossary Terms...');
    for (const g of glossaryData) {
      const gId = uuidv4();
      const domainId = domainMap[g.domain_number];
      await client.query(`
        INSERT INTO glossary_terms (
          id, certification_id, domain_id, term, acronym, definition, category, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW());
      `, [
        gId,
        GRC_CERT_ID,
        domainId,
        g.term,
        g.acronym || null,
        g.definition,
        `Domain ${g.domain_number}`
      ]);
    }

    // 8. Bulk Insert 534 Questions
    console.log('8. Inserting 534 Verified Questions into Question Bank...');
    const qValues = questionsData.map((q, idx) => {
      const qId = uuidv4();
      const domainId = domainMap[q.domain_number];
      const topicId = topicIdMap[q.topic_code] || null;

      return `(
        '${qId}'::uuid,
        '${GRC_CERT_ID}'::uuid,
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
        ARRAY[${(q.tags || ['Enterprise GRC']).map(t => escapeSql(t)).join(',')}],
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
    console.log('STANDALONE ENTERPRISE GRC FULL SEEDING COMPLETE!');
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

seedGRC().catch(console.error);
