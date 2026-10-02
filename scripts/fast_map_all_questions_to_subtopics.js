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

async function mapSubtopicsBulk() {
  await client.connect();
  console.log('=== ULTRA-FAST BULK MAPPING QUESTIONS TO SUBTOPICS ===\n');

  const certs = await client.query('SELECT id, code, name FROM certifications ORDER BY code');

  for (const cert of certs.rows) {
    console.log(`\n--- Processing [${cert.code}] ---`);

    // Get all topics and their subtopics for this cert
    const topicsRes = await client.query(`
      SELECT t.id as topic_id, s.id as subtopic_id
      FROM topics t
      JOIN domains d ON t.domain_id = d.id
      JOIN subtopics s ON s.topic_id = t.id
      WHERE d.certification_id = $1
      ORDER BY t.id, s.sort_order;
    `, [cert.id]);

    const topicSubtopicsMap = {};
    for (const r of topicsRes.rows) {
      if (!topicSubtopicsMap[r.topic_id]) topicSubtopicsMap[r.topic_id] = [];
      topicSubtopicsMap[r.topic_id].push(r.subtopic_id);
    }

    const topicIds = Object.keys(topicSubtopicsMap);
    if (topicIds.length === 0) {
      console.log(`[SKIP] No subtopics found for ${cert.code}`);
      continue;
    }

    let mappedCount = 0;
    for (const topicId of topicIds) {
      const subtopicIds = topicSubtopicsMap[topicId];
      const qRes = await client.query(`
        SELECT id FROM questions 
        WHERE certification_id = $1 AND topic_id = $2 AND subtopic_id IS NULL
        ORDER BY question_number;
      `, [cert.id, topicId]);

      const questions = qRes.rows;
      if (questions.length === 0) continue;

      // Batch in chunks of 500
      const BATCH_SIZE = 500;
      for (let i = 0; i < questions.length; i += BATCH_SIZE) {
        const batch = questions.slice(i, i + BATCH_SIZE);
        const values = [];
        const params = [];
        let pIdx = 1;

        for (let j = 0; j < batch.length; j++) {
          const qId = batch[j].id;
          const assignedSubtopicId = subtopicIds[(i + j) % subtopicIds.length];
          values.push(`($${pIdx}::uuid, $${pIdx + 1}::uuid)`);
          params.push(qId, assignedSubtopicId);
          pIdx += 2;
        }

        const query = `
          UPDATE questions AS q
          SET subtopic_id = v.subtopic_id
          FROM (VALUES ${values.join(', ')}) AS v(id, subtopic_id)
          WHERE q.id = v.id;
        `;
        await client.query(query, params);
        mappedCount += batch.length;
      }
    }
    console.log(`[SUCCESS] Mapped ${mappedCount} questions to subtopics for ${cert.code}`);
  }

  await client.end();
}

mapSubtopicsBulk().catch(console.error);
