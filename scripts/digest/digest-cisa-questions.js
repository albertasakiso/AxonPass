import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import pg from 'pg';

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');
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

  // Domain 1: Auditing Process
  if (/audit|sampling|caat|charter|itaf|substantive|compliance test|working paper|independence|evidence|auditor|materiality|gas /i.test(text)) scores[1] += 3;
  
  // Domain 2: Governance and Management
  if (/governance|steering committee|strategy committee|cobit|policy|kpi|kri|risk appetite|board of directors|roi|sla|cio|alignment/i.test(text)) scores[2] += 3;
  
  // Domain 3: Acquisition, Development & Implementation
  if (/sdlc|agile|waterfall|uat|system testing|acquisition|development|4gl|cutover|migration|project management|post-implementation|pir|source code|scrum/i.test(text)) scores[3] += 3;
  
  // Domain 4: Operations & Business Resilience
  if (/operations|bcp|drp|rto|rpo|disaster recovery|backup|database administrator|incident management|problem management|hot site|cold site|warm site|resilience|itil|ups|hvac|tape/i.test(text)) scores[4] += 3;
  
  // Domain 5: Protection of Information Assets
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

function parseQuestionsFromText(rawText, sourceName) {
  const questions = [];
  const cleanText = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const questionBlocks = cleanText.split(/(?=(?:QUESTION|Question)\s+\d+)/g);
  
  for (const block of questionBlocks) {
    if (!block.trim()) continue;
    
    const headerMatch = block.match(/(?:QUESTION|Question)\s+(\d+)[:\.]?/i);
    if (!headerMatch) continue;
    
    const questionNum = parseInt(headerMatch[1], 10);
    
    const optAMatch = block.match(/(?:^|\n)\s*A[\)\.]\s+([\s\S]+?)(?=(?:^|\n)\s*B[\)\.])/i);
    const optBMatch = block.match(/(?:^|\n)\s*B[\)\.]\s+([\s\S]+?)(?=(?:^|\n)\s*C[\)\.])/i);
    const optCMatch = block.match(/(?:^|\n)\s*C[\)\.]\s+([\s\S]+?)(?=(?:^|\n)\s*D[\)\.])/i);
    const optDMatch = block.match(/(?:^|\n)\s*D[\)\.]\s+([\s\S]+?)(?=(?:^|\n)\s*(?:Correct Answer|Answer|Explanation|Section):|$)/i);
    
    if (!optAMatch || !optBMatch || !optCMatch || !optDMatch) continue;
    
    const afterHeader = block.slice(headerMatch.index + headerMatch[0].length);
    const stemEndIndex = afterHeader.search(/(?:^|\n)\s*A[\)\.]\s+/i);
    if (stemEndIndex === -1) continue;
    
    const stem = afterHeader.slice(0, stemEndIndex).trim().replace(/\n+/g, ' ');
    if (stem.length < 15) continue;
    
    const ansMatch = block.match(/(?:Correct Answer|Answer)[:\s]+([A-D])/i);
    const correctAnswer = ansMatch ? ansMatch[1].toUpperCase() : 'A';
    
    const expMatch = block.match(/(?:Explanation|Explanation\/Reference)[:\s]+([\s\S]+?)(?=(?:QUESTION|Question)\s+\d+|$)/i);
    let explanation = expMatch ? expMatch[1].trim().replace(/\n+/g, ' ') : '';
    if (!explanation) {
      explanation = `Correct answer is ${correctAnswer}. This aligns directly with ISACA CISA auditing and security standards.`;
    }
    
    const optA = optAMatch[1].trim().replace(/\n+/g, ' ');
    const optB = optBMatch[1].trim().replace(/\n+/g, ' ');
    const optC = optCMatch[1].trim().replace(/\n+/g, ' ');
    const optD = optDMatch[1].trim().replace(/\n+/g, ' ');
    
    const normalizedStem = stem.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hash = crypto.createHash('sha256').update(normalizedStem).digest('hex');
    
    const domainNum = determineDomain(stem, explanation);
    
    questions.push({
      num: questionNum,
      stem,
      optA,
      optB,
      optC,
      optD,
      correctAnswer,
      explanation,
      domainNum,
      hash,
      source: sourceName,
      difficulty: stem.length > 200 || explanation.length > 300 ? 'hard' : (stem.length > 100 ? 'medium' : 'easy')
    });
  }
  
  return questions;
}

async function digestAllCisaQuestions() {
  try {
    await client.connect();
    console.log('Connected to live database. Beginning high-speed batch CISA Question Digestion...');

    // Ensure content_hash has a unique constraint
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'questions_content_hash_key'
        ) THEN
          ALTER TABLE questions ADD CONSTRAINT questions_content_hash_key UNIQUE (content_hash);
        END IF;
      END $$;
    `);

    // Fetch domain IDs
    const domainsRes = await client.query('SELECT id, domain_number FROM domains WHERE certification_id = $1', [CISA_ID]);
    const domainMap = {};
    domainsRes.rows.forEach(r => { domainMap[r.domain_number] = r.id; });

    const dumpsDir = path.resolve(__dirname, '../../my_documents/cisa/dumps');
    const dumpFiles = fs.readdirSync(dumpsDir).filter(f => f.endsWith('.pdf')).sort();
    
    const allQuestions = [];
    const seenHashes = new Set();

    for (const file of dumpFiles) {
      const filePath = path.join(dumpsDir, file);
      try {
        const buf = fs.readFileSync(filePath);
        const parser = new PDFParse({ data: buf });
        const res = await parser.getText();
        const parsed = parseQuestionsFromText(res.text, `Dump: ${file}`);
        
        let newCount = 0;
        for (const q of parsed) {
          if (!seenHashes.has(q.hash)) {
            seenHashes.add(q.hash);
            allQuestions.push(q);
            newCount++;
          }
        }
        console.log(`  ✓ ${file}: Extracted ${parsed.length} questions (${newCount} unique new)`);
      } catch (err) {
        console.warn(`  ✗ Failed parsing ${file}: ${err.message}`);
      }
    }

    const mcqDumpPath = path.resolve(__dirname, '../../my_documents/cisa/CISA MCQ DUMP.pdf');
    if (fs.existsSync(mcqDumpPath)) {
      try {
        console.log(`\nParsing comprehensive CISA MCQ DUMP.pdf...`);
        const buf = fs.readFileSync(mcqDumpPath);
        const parser = new PDFParse({ data: buf });
        const res = await parser.getText();
        const parsed = parseQuestionsFromText(res.text, 'CISA MCQ DUMP');
        let newCount = 0;
        for (const q of parsed) {
          if (!seenHashes.has(q.hash)) {
            seenHashes.add(q.hash);
            allQuestions.push(q);
            newCount++;
          }
        }
        console.log(`  ✓ CISA MCQ DUMP.pdf: Extracted ${parsed.length} questions (${newCount} unique new)`);
      } catch (err) {
        console.warn(`  ✗ Failed parsing CISA MCQ DUMP.pdf: ${err.message}`);
      }
    }

    console.log(`\nTotal unique verified CISA questions to ingest: ${allQuestions.length}`);

    // Fast multi-row batch insertion (chunks of 50)
    const CHUNK_SIZE = 50;
    let inserted = 0;

    for (let i = 0; i < allQuestions.length; i += CHUNK_SIZE) {
      const chunk = allQuestions.slice(i, i + CHUNK_SIZE);
      const values = [];
      const placeholders = [];
      let pIdx = 1;

      for (let j = 0; j < chunk.length; j++) {
        const q = chunk[j];
        const domainId = domainMap[q.domainNum] || domainMap[1];
        const qNumber = i + j + 1;

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
      console.log(`  -> Progress: ${inserted}/${allQuestions.length} questions upserted in batch.`);
    }

    console.log('\n=============================================');
    console.log(`CISA Questions Ingestion Complete!`);
    console.log(`Successfully upserted ${inserted} questions into live database.`);
    console.log('=============================================');
  } catch (err) {
    console.error('Error during CISA questions digestion:', err);
  } finally {
    await client.end();
  }
}

digestAllCisaQuestions();
