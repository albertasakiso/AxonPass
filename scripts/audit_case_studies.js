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

async function auditCaseStudies() {
  await client.connect();
  const certs = await client.query('SELECT id, code, name, total_domains FROM certifications ORDER BY code');
  
  console.log('\n========================================================================================');
  console.log('              APILIGUPASS CASE STUDY & LEARNING MODULE AUDIT REPORT');
  console.log('========================================================================================\n');

  let totalCaseStudies = 0;
  let totalCaseStudyQuestions = 0;

  for (const c of certs.rows) {
    console.log(`=== [${c.code}] ${c.name} (Domains: ${c.total_domains}) ===`);
    const domains = await client.query('SELECT id, domain_number, name FROM domains WHERE certification_id = $1 ORDER BY domain_number', [c.id]);
    
    for (const d of domains.rows) {
      const cs = await client.query('SELECT id, title FROM case_studies WHERE domain_id = $1 ORDER BY sort_order', [d.id]);
      const sm = await client.query('SELECT count(*) FROM study_materials WHERE domain_id = $1', [d.id]);
      const statusIcon = cs.rows.length >= 1 ? '✅' : '❌ MISSING CASE STUDY';
      
      console.log(`  - Domain ${d.domain_number}: ${d.name}`);
      console.log(`      Study Materials: ${sm.rows[0].count} modules | Case Studies: ${cs.rows.length} ${statusIcon}`);
      
      for (const s of cs.rows) {
        totalCaseStudies++;
        const qCount = await client.query('SELECT count(*) FROM case_study_questions WHERE case_study_id = $1', [s.id]);
        totalCaseStudyQuestions += parseInt(qCount.rows[0].count, 10);
        console.log(`        * [Case Study] ${s.title} (${qCount.rows[0].count} questions)`);
      }
    }
    console.log('----------------------------------------------------------------------------------------');
  }

  console.log(`\nGRAND TOTAL CASE STUDIES:           ${totalCaseStudies}`);
  console.log(`GRAND TOTAL CASE STUDY QUESTIONS:   ${totalCaseStudyQuestions}`);
  console.log('========================================================================================\n');
  await client.end();
}

auditCaseStudies().catch(console.error);
