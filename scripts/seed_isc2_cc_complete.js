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

const CC_CERT_ID = 'a0000000-0000-0000-0000-000000000002';
const DATA_DIR = path.resolve(__dirname, 'cc_data');

async function seedISC2CC() {
  console.log('============================================================');
  console.log('SEEDING COMPREHENSIVE ISC2 CERTIFIED IN CYBERSECURITY (CC)');
  console.log('============================================================\n');
  await client.connect();

  const topicsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'topics.json'), 'utf8'));
  const chaptersData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'chapters.json'), 'utf8'));
  const caseStudiesData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'case_studies.json'), 'utf8'));
  const glossaryData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'glossary.json'), 'utf8'));
  const questionsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'questions.json'), 'utf8'));

  console.log(`Loaded dataset files:`);
  console.log(`  - Topics/Subtopics: ${topicsData.length}`);
  console.log(`  - Master Chapters:  ${chaptersData.length}`);
  console.log(`  - Case Studies:     ${caseStudiesData.length}`);
  console.log(`  - Glossary Terms:   ${glossaryData.length}`);
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
        $1, 'isc2-cc', 'ISC2 — Certified in Cybersecurity (CC)',
        'Official ISC2 CC Common Body of Knowledge (CBK) 2024/2025 Edition',
        'ISC2', 5, 100, 120, 70.00,
        'Entry-level cybersecurity certification proving foundational competence in security principles, incident response, access controls, network security, and security operations.',
        'CC', 'ISC2', 'fixed_form', 700, 200, 1000, 80.00, NOW(), NOW()
      ) ON CONFLICT (id) DO UPDATE SET
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
    `, [CC_CERT_ID]);

    // 2. Domains
    console.log('2. Upserting 5 Official Domains...');
    const domainMap = {
      1: 'd0000000-0000-0000-0000-000000000011',
      2: 'd0000000-0000-0000-0000-000000000012',
      3: 'd0000000-0000-0000-0000-000000000013',
      4: 'd0000000-0000-0000-0000-000000000014',
      5: 'd0000000-0000-0000-0000-000000000015',
    };

    const domainDefs = [
      {
        id: domainMap[1],
        domain_number: 1,
        name: 'Security Principles',
        weight: 26.00,
        approx_qs: 26,
        part_a_title: 'Information Assurance & Core Security Concepts',
        part_b_title: 'Governance, Ethics & Compliance',
        learning_objectives: 'Master the CIA triad, IAAA framework, risk management strategies, ISC2 Code of Ethics canons, and security control categories.'
      },
      {
        id: domainMap[2],
        domain_number: 2,
        name: 'Incident Response, Business Continuity (BC) & Disaster Recovery (DR) Concepts',
        weight: 10.00,
        approx_qs: 10,
        part_a_title: 'Incident Response (IR) Principles & Lifecycle',
        part_b_title: 'Business Continuity (BC) & Disaster Recovery (DR) Concepts',
        learning_objectives: 'Understand the 6-phase incident response lifecycle, CSIRT roles, BIA metrics (RTO, RPO, MTD), backup schemes, and disaster recovery sites.'
      },
      {
        id: domainMap[3],
        domain_number: 3,
        name: 'Access Controls Concepts',
        weight: 22.00,
        approx_qs: 22,
        part_a_title: 'Physical Access Controls & Environmental Safety',
        part_b_title: 'Logical Access Controls & Identity Management',
        learning_objectives: 'Differentiate physical entry controls, environmental safety, access models (DAC, MAC, RBAC, ABAC), authentication factors, and PAM.'
      },
      {
        id: domainMap[4],
        domain_number: 4,
        name: 'Network Security',
        weight: 24.00,
        approx_qs: 24,
        part_a_title: 'Computer Networking Fundamentals & Protocols',
        part_b_title: 'Network Threats & Defensive Controls',
        learning_objectives: 'Master OSI and TCP/IP models, well-known ports, network attack vectors, firewall types, IDS vs IPS, DMZ architecture, and Zero Trust.'
      },
      {
        id: domainMap[5],
        domain_number: 5,
        name: 'Security Operations',
        weight: 18.00,
        approx_qs: 18,
        part_a_title: 'Data Security, Cryptography & System Hardening',
        part_b_title: 'Operational Best Practices & Threat Mitigation',
        learning_objectives: 'Understand data states, symmetric vs asymmetric encryption, system hardening baselines, patch management, malware taxonomy, and SIEM.'
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
          name = EXCLUDED.name,
          exam_weight_percent = EXCLUDED.exam_weight_percent,
          approx_exam_questions = EXCLUDED.approx_exam_questions,
          part_a_title = EXCLUDED.part_a_title,
          part_b_title = EXCLUDED.part_b_title,
          learning_objectives = EXCLUDED.learning_objectives,
          sort_order = EXCLUDED.sort_order;
      `, [
        d.id, CC_CERT_ID, d.domain_number, d.name, d.weight,
        d.approx_qs, d.part_a_title, d.part_b_title, d.learning_objectives,
        d.domain_number
      ]);
    }

    // 3. Clean prior CC relational data
    console.log('3. Cleaning previous CC child entities...');
    await client.query(`DELETE FROM questions WHERE certification_id = $1;`, [CC_CERT_ID]);
    await client.query(`DELETE FROM study_materials WHERE certification_id = $1;`, [CC_CERT_ID]);
    await client.query(`DELETE FROM glossary_terms WHERE certification_id = $1;`, [CC_CERT_ID]);
    await client.query(`
      DELETE FROM case_study_questions WHERE case_study_id IN (
        SELECT id FROM case_studies WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1)
      );
    `, [CC_CERT_ID]);
    await client.query(`
      DELETE FROM case_studies WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1);
    `, [CC_CERT_ID]);
    await client.query(`
      DELETE FROM subtopics WHERE topic_id IN (
        SELECT id FROM topics WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1)
      );
    `, [CC_CERT_ID]);
    await client.query(`
      DELETE FROM topics WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1);
    `, [CC_CERT_ID]);

    // 4. Insert Topics & Subtopics
    console.log('4. Inserting 39 Canonical Topics and Subtopics...');
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
        8,
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
        CC_CERT_ID,
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
        `official_cc_cbk_ch${ch.chapter_number}.pdf`,
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
    console.log('7. Inserting 103+ Glossary Terms...');
    for (const g of glossaryData) {
      const gId = uuidv4();
      const domainId = domainMap[g.domain_number];
      await client.query(`
        INSERT INTO glossary_terms (
          id, certification_id, domain_id, term, acronym, definition, category, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW());
      `, [
        gId,
        CC_CERT_ID,
        domainId,
        g.term,
        g.acronym || null,
        g.definition,
        `Domain ${g.domain_number}`
      ]);
    }

    // 8. Bulk Insert 554 Questions
    console.log('8. Inserting 554 Verified Questions into Question Bank...');
    const qValues = questionsData.map((q, idx) => {
      const qId = uuidv4();
      const domainId = domainMap[q.domain_number];
      const topicId = topicIdMap[q.topic_code] || null;

      return `(
        '${qId}'::uuid,
        '${CC_CERT_ID}'::uuid,
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
        ARRAY[${(q.tags || ['Cybersecurity']).map(t => escapeSql(t)).join(',')}],
        ${escapeSql(q.source_reference)},
        'verified',
        NULL,
        true,
        NOW(),
        NOW()
      )`;
    });

    // Insert in chunks of 100 for fast bulk execution
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
    console.log('ISC2 CERTIFIED IN CYBERSECURITY (CC) FULL SEEDING COMPLETE!');
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

seedISC2CC().catch(console.error);
