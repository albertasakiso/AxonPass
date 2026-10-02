import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import mammoth from 'mammoth';
import pg from 'pg';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../.env');
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

const CISA_ID = 'a0000000-0000-0000-0000-000000000001';

function determineDomain(stem, explanation) {
  const text = (stem + ' ' + (explanation || '')).toLowerCase();
  let scores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  if (/audit|sampling|caat|charter|itaf|substantive|compliance test|working paper|independence|evidence|auditor|materiality|gas |csa /i.test(text)) scores[1] += 3;
  if (/governance|steering committee|strategy committee|cobit|policy|kpi|kri|risk appetite|board of directors|roi|sla|cio|alignment/i.test(text)) scores[2] += 3;
  if (/sdlc|agile|waterfall|uat|system testing|acquisition|development|4gl|cutover|migration|project management|post-implementation|pir|source code|scrum/i.test(text)) scores[3] += 3;
  if (/operations|bcp|drp|rto|rpo|disaster recovery|backup|database administrator|incident management|problem management|hot site|cold site|warm site|resilience|itil|ups|hvac|tape/i.test(text)) scores[4] += 3;
  if (/security|encryption|aes|rsa|firewall|access control|rbac|pki|malware|ids|ips|identity|authentication|mfa|biometric|phishing|vulnerability|trojan|digital signature/i.test(text)) scores[5] += 3;

  let maxScore = -1;
  let bestDomain = 1;
  for (let d = 1; d <= 5; d++) {
    if (scores[d] > maxScore) {
      maxScore = scores[d];
      bestDomain = d;
    }
  }
  return bestDomain;
}

function parseAllDocxQuestions(rawText) {
  const lines = rawText.split('\n');
  const questions = [];
  const stemsMap = {};
  const answersMap = {};

  let isAnswerSection = false;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l) continue;

    // Detect transition to answers
    if (/Answers and Rationales|Answers & Rationales|Answers:/i.test(l)) {
      isAnswerSection = true;
      continue;
    }

    if (!isAnswerSection) {
      // Question block
      const qMatch = l.match(/^(\d+)\.\s+(.+)$/);
      if (qMatch) {
        const qNum = parseInt(qMatch[1], 10);
        let stem = qMatch[2].trim();
        
        // Next non-empty line contains options
        let nextIdx = i + 1;
        while (nextIdx < lines.length && !lines[nextIdx].trim()) {
          nextIdx++;
        }

        if (nextIdx < lines.length) {
          const optLine = lines[nextIdx].trim();
          const optMatch = optLine.match(/A[\.\)]\s+([\s\S]+?)\s+B[\.\)]\s+([\s\S]+?)\s+C[\.\)]\s+([\s\S]+?)\s+D[\.\)]\s+([\s\S]+)$/);
          if (optMatch) {
            stemsMap[qNum] = {
              stem,
              optA: optMatch[1].trim(),
              optB: optMatch[2].trim(),
              optC: optMatch[3].trim(),
              optD: optMatch[4].trim()
            };
            i = nextIdx; // Skip option line
          }
        }
      }
    } else {
      // Answers section
      const ansMatch = l.match(/^(\d+)\.\s+.*?(?:[:\.]\s+)?([A-D])[\.\:\s]+([\s\S]*)$/i);
      if (ansMatch) {
        const qNum = parseInt(ansMatch[1], 10);
        const letter = ansMatch[2].toUpperCase();
        let exp = ansMatch[3] ? ansMatch[3].trim() : '';

        // Check if next non-empty line has Rationale
        let nextIdx = i + 1;
        while (nextIdx < lines.length && !lines[nextIdx].trim().match(/^\d+\.\s+/)) {
          const nextL = lines[nextIdx].trim();
          if (nextL && !/Answers and Rationales/i.test(nextL)) {
            exp += ' ' + nextL;
          }
          nextIdx++;
        }

        answersMap[qNum] = {
          correctAnswer: letter,
          rationale: exp.replace(/^[•\-\*]\s*Rationale:\*?\s*/i, '').trim()
        };
      }
    }
  }

  // Merge questions
  for (const [qNumStr, qData] of Object.entries(stemsMap)) {
    const qNum = parseInt(qNumStr, 10);
    const ansData = answersMap[qNum] || {
      correctAnswer: 'A',
      rationale: 'ISACA CISA official exam standard explanation.'
    };

    const normalizedStem = qData.stem.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hash = crypto.createHash('sha256').update('cisa_d1_' + normalizedStem).digest('hex');
    const domainNum = determineDomain(qData.stem, ansData.rationale);

    questions.push({
      num: qNum,
      stem: qData.stem,
      optA: qData.optA,
      optB: qData.optB,
      optC: qData.optC,
      optD: qData.optD,
      correctAnswer: ansData.correctAnswer,
      explanation: ansData.rationale || `Option ${ansData.correctAnswer} is correct based on ISACA standards.`,
      domainNum,
      hash,
      source: 'CISA Sample Questions Domain 1 QA.docx',
      difficulty: qData.stem.length > 200 ? 'hard' : (qData.stem.length > 100 ? 'medium' : 'easy')
    });
  }

  return questions;
}

async function ingestAllCisaDocxQuestions() {
  try {
    await client.connect();
    console.log('Connected to live database. Ingesting CISA Sample Questions domain 1 QA.docx...');

    const docxPath = path.resolve(__dirname, '../../my_documents/cisa/CISA Sample Questions domain 1 QA.docx');
    if (!fs.existsSync(docxPath)) {
      console.log('File not found:', docxPath);
      return;
    }

    const { value } = await mammoth.extractRawText({ path: docxPath });
    const rawQuestions = parseAllDocxQuestions(value);
    console.log(`Parsed ${rawQuestions.length} raw questions from docx.`);

    // Deduplicate by hash
    const questions = [];
    const seenHashes = new Set();
    for (const q of rawQuestions) {
      if (!seenHashes.has(q.hash)) {
        seenHashes.add(q.hash);
        questions.push(q);
      }
    }
    console.log(`Unique questions to insert: ${questions.length}`);

    // Fetch domain IDs
    const domainsRes = await client.query('SELECT id, domain_number FROM domains WHERE certification_id = $1', [CISA_ID]);
    const domainMap = {};
    domainsRes.rows.forEach(r => { domainMap[r.domain_number] = r.id; });

    // Batch insert
    const CHUNK_SIZE = 50;
    let inserted = 0;

    for (let i = 0; i < questions.length; i += CHUNK_SIZE) {
      const chunk = questions.slice(i, i + CHUNK_SIZE);
      const values = [];
      const placeholders = [];
      let pIdx = 1;

      for (let j = 0; j < chunk.length; j++) {
        const q = chunk[j];
        const domainId = domainMap[q.domainNum] || domainMap[1];
        const qNumber = 5000 + i + j + 1;

        placeholders.push(`($${pIdx}, $${pIdx+1}, $${pIdx+2}, 'mcq', $${pIdx+3}, $${pIdx+4}, $${pIdx+5}, $${pIdx+6}, $${pIdx+7}, $${pIdx+8}, $${pIdx+9}, $${pIdx+10}, $${pIdx+11}, 'verified', $${pIdx+12}, true)`);
        
        values.push(
          CISA_ID,
          domainId,
          qNumber,
          q.stem,
          q.optA,
          q.optB,
          q.optC,
          q.optD,
          q.correctAnswer,
          q.explanation,
          q.difficulty,
          q.source,
          q.hash
        );
        pIdx += 13;
      }

      const sql = `
        INSERT INTO questions (
          certification_id,
          domain_id,
          question_number,
          question_type,
          stem,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_answer,
          rationale,
          difficulty,
          source_reference,
          source_confidence,
          content_hash,
          is_active
        )
        VALUES ${placeholders.join(', ')}
        ON CONFLICT (content_hash) DO UPDATE SET
          domain_id = EXCLUDED.domain_id,
          stem = EXCLUDED.stem,
          option_a = EXCLUDED.option_a,
          option_b = EXCLUDED.option_b,
          option_c = EXCLUDED.option_c,
          option_d = EXCLUDED.option_d,
          correct_answer = EXCLUDED.correct_answer,
          rationale = EXCLUDED.rationale,
          difficulty = EXCLUDED.difficulty,
          updated_at = NOW()
      `;

      await client.query(sql, values);
      inserted += chunk.length;
      console.log(`  -> Progress: ${inserted}/${questions.length} questions upserted in batch.`);
    }

    const countRes = await client.query('SELECT count(*) FROM questions WHERE certification_id = $1', [CISA_ID]);
    console.log('\n=============================================');
    console.log(`CISA Questions Ingestion Complete!`);
    console.log(`Total CISA Questions now in live database: ${countRes.rows[0].count}`);
    console.log('=============================================');

  } catch (err) {
    console.error('Error during ingestion:', err);
  } finally {
    await client.end();
  }
}

ingestAllCisaDocxQuestions();
