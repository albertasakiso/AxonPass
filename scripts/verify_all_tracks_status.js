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

async function verify() {
  await client.connect();
  console.log('\n========================================================================================');
  console.log('                 APILIGUPASS CERTIFICATION REPOSITORY AUDIT REPORT');
  console.log('========================================================================================\n');

  const certs = await client.query(`
    SELECT id, code, slug, name, total_domains, passing_score_percent FROM certifications ORDER BY code;
  `);

  console.log(`TOTAL ACTIVE CERTIFICATIONS CONFIGURED: ${certs.rows.length}\n`);

  for (const cert of certs.rows) {
    const dCount = await client.query('SELECT count(*) FROM domains WHERE certification_id = $1', [cert.id]);
    const tCount = await client.query('SELECT count(*) FROM topics WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1)', [cert.id]);
    const sCount = await client.query('SELECT count(*) FROM subtopics WHERE topic_id IN (SELECT id FROM topics WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1))', [cert.id]);
    const mCount = await client.query('SELECT count(*) FROM study_materials WHERE certification_id = $1', [cert.id]);
    const gCount = await client.query('SELECT count(*) FROM glossary_terms WHERE certification_id = $1', [cert.id]);
    const csCount = await client.query('SELECT count(*) FROM case_studies WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1)', [cert.id]);
    const qCount = await client.query('SELECT count(*) FROM questions WHERE certification_id = $1', [cert.id]);

    console.log(`[${cert.code.padEnd(9)}] ${cert.name}`);
    console.log(`  - Domains:         ${dCount.rows[0].count}`);
    console.log(`  - Topics:          ${tCount.rows[0].count}`);
    console.log(`  - Subtopics:       ${sCount.rows[0].count}`);
    console.log(`  - Study Materials: ${mCount.rows[0].count}`);
    console.log(`  - Glossary Terms:  ${gCount.rows[0].count}`);
    console.log(`  - Case Studies:    ${csCount.rows[0].count}`);
    console.log(`  - Exam Questions:  ${qCount.rows[0].count}`);
    console.log('----------------------------------------------------------------------------------------');
  }

  const grandTotalQ = await client.query('SELECT count(*) FROM questions');
  const grandTotalM = await client.query('SELECT count(*) FROM study_materials');
  console.log(`\nGRAND TOTAL QUESTIONS IN REPOSITORY:       ${grandTotalQ.rows[0].count}`);
  console.log(`GRAND TOTAL STUDY MATERIALS IN REPOSITORY: ${grandTotalM.rows[0].count}`);
  console.log('========================================================================================\n');

  await client.end();
}

verify().catch(console.error);
