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

async function check() {
  await client.connect();
  console.log('=== LIVE DATABASE VERIFICATION ===\n');

  const certs = await client.query('SELECT slug, name, total_domains, total_exam_questions FROM certifications ORDER BY slug');
  console.log('Certifications (', certs.rows.length, '):');
  for (const c of certs.rows) {
    console.log(`  - [${c.slug}] ${c.name} (${c.total_domains} domains, ${c.total_exam_questions} exam q's)`);
  }

  const domains = await client.query('SELECT c.slug as cert, d.domain_number, d.name, d.exam_weight_percent FROM domains d JOIN certifications c ON d.certification_id = c.id ORDER BY c.slug, d.domain_number');
  console.log('\nDomains (', domains.rows.length, '):');
  for (const d of domains.rows) {
    console.log(`  - [${d.cert} D${d.domain_number}] ${d.name} (${d.exam_weight_percent}%)`);
  }

  const topics = await client.query('SELECT count(*) FROM topics');
  const subtopics = await client.query('SELECT count(*) FROM subtopics');
  const glossary = await client.query('SELECT count(*) FROM glossary_terms');
  const questions = await client.query('SELECT c.slug, count(q.id) as count FROM questions q JOIN certifications c ON q.certification_id = c.id GROUP BY c.slug');

  console.log('\nCurriculum & Question Counts:');
  console.log('  - Total Topics in DB:', topics.rows[0].count);
  console.log('  - Total Subtopics (Rich Lessons) in DB:', subtopics.rows[0].count);
  console.log('  - Total Glossary Definitions in DB:', glossary.rows[0].count);
  console.log('\nQuestion Distribution:');
  for (const q of questions.rows) {
    console.log(`  - ${q.slug.toUpperCase()}: ${q.count} verified questions`);
  }

  const totalQ = await client.query('SELECT count(*) FROM questions');
  console.log(`\nTOTAL QUESTIONS ACROSS ALL TRACKS: ${totalQ.rows[0].count}`);

  await client.end();
}

check();
