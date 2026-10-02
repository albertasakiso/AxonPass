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

async function linkCaseStudyQuestions() {
  await client.connect();
  console.log('=== SYNCING CASE STUDY SCENARIO QUESTIONS ===\n');

  const csqRes = await client.query(`
    SELECT csq.question_id, cs.scenario_text, cs.title
    FROM case_study_questions csq
    JOIN case_studies cs ON csq.case_study_id = cs.id;
  `);

  console.log(`Found ${csqRes.rows.length} case study question links.`);

  for (const row of csqRes.rows) {
    await client.query(`
      UPDATE questions
      SET scenario_text = $1
      WHERE id = $2;
    `, [row.scenario_text, row.question_id]);
  }

  console.log('✓ Successfully synced scenario texts to questions table!');
  await client.end();
}

linkCaseStudyQuestions().catch(console.error);
