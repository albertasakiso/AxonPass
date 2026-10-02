import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

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

const CISA_ID = 'a0000000-0000-0000-0000-000000000001';

async function seedCISA5000() {
  await client.connect();
  console.log('=== SEEDING CISA QUESTIONS TO REACH EXACTLY 5,000 QUESTIONS ===\n');

  // Load questions
  const qPath = path.resolve(__dirname, 'cisa_5000_data/cisa_918_questions.json');
  const questions = JSON.parse(fs.readFileSync(qPath, 'utf8'));

  // Get domain map
  const domRes = await client.query('SELECT id, domain_number FROM domains WHERE certification_id = $1', [CISA_ID]);
  const domainMap = {};
  for (const row of domRes.rows) {
    domainMap[row.domain_number] = row.id;
  }

  // Get topics for each domain
  const topicRes = await client.query(`
    SELECT t.id, t.domain_id, d.domain_number 
    FROM topics t 
    JOIN domains d ON t.domain_id = d.id 
    WHERE d.certification_id = $1
  `, [CISA_ID]);

  const domainTopicMap = {};
  for (const row of topicRes.rows) {
    if (!domainTopicMap[row.domain_number]) domainTopicMap[row.domain_number] = [];
    domainTopicMap[row.domain_number].push(row.id);
  }

  console.log(`Loaded ${questions.length} questions to insert in multi-row batches...`);

  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    const batch = questions.slice(i, i + BATCH_SIZE);
    const valuePlaceholders = [];
    const params = [];

    batch.forEach((q, idx) => {
      const baseIdx = idx * 19;
      valuePlaceholders.push(`(
        $${baseIdx + 1}, $${baseIdx + 2}, $${baseIdx + 3}, $${baseIdx + 4}, $${baseIdx + 5},
        $${baseIdx + 6}, $${baseIdx + 7}, $${baseIdx + 8}, $${baseIdx + 9}, $${baseIdx + 10},
        $${baseIdx + 11}, $${baseIdx + 12}, $${baseIdx + 13}, $${baseIdx + 14}, $${baseIdx + 15},
        $${baseIdx + 16}, $${baseIdx + 17}, $${baseIdx + 18}, $${baseIdx + 19}
      )`);

      const domId = domainMap[q.domain_number];
      const topicList = domainTopicMap[q.domain_number] || [];
      const topicId = topicList.length > 0 ? topicList[idx % topicList.length] : null;

      params.push(
        q.id,
        CISA_ID,
        domId,
        topicId,
        null, // subtopic_id
        q.question_number,
        q.question_type,
        q.stem,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.correct_answer,
        q.rationale,
        q.difficulty,
        `T${q.domain_number}`, // task_statement: max 10 chars e.g. T1, T2
        q.tags,
        q.source_reference,
        q.is_active
      );
    });

    const query = `
      INSERT INTO questions (
        id, certification_id, domain_id, topic_id, subtopic_id, question_number,
        question_type, stem, option_a, option_b, option_c, option_d,
        correct_answer, rationale, difficulty, task_statement, tags,
        source_reference, is_active
      ) VALUES ${valuePlaceholders.join(', ')}
      ON CONFLICT (id) DO UPDATE SET
        stem = EXCLUDED.stem,
        option_a = EXCLUDED.option_a,
        option_b = EXCLUDED.option_b,
        option_c = EXCLUDED.option_c,
        option_d = EXCLUDED.option_d,
        correct_answer = EXCLUDED.correct_answer,
        rationale = EXCLUDED.rationale;
    `;

    await client.query(query, params);
    inserted += batch.length;
    console.log(`  Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} (${inserted}/${questions.length} questions)...`);
  }

  const finalCount = await client.query('SELECT count(*) FROM questions WHERE certification_id = $1', [CISA_ID]);
  console.log(`\n========================================================================================`);
  console.log(`✅ CISA QUESTION BANK REACHED: ${finalCount.rows[0].count} QUESTIONS!`);
  console.log(`========================================================================================\n`);

  await client.end();
}

seedCISA5000().catch(console.error);
