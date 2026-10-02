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

async function run() {
  await client.connect();
  const certs = await client.query('SELECT id, code, slug, name FROM certifications ORDER BY code');
  
  for (const c of certs.rows) {
    console.log(`\n========================================================================`);
    console.log(`CERT: [${c.code}] slug: "${c.slug}" | ${c.name} (ID: ${c.id})`);
    console.log(`========================================================================`);
    
    // Domains
    const doms = await client.query('SELECT id, domain_number, name FROM domains WHERE certification_id = $1 ORDER BY domain_number', [c.id]);
    console.log('DOMAINS:');
    doms.rows.forEach(d => console.log(`  Dom ${d.domain_number}: ${d.name} (id: ${d.id})`));

    // Study materials
    const sm = await client.query('SELECT id, domain_id, title, document_title, sort_order FROM study_materials WHERE certification_id = $1 ORDER BY sort_order, title', [c.id]);
    console.log(`STUDY MATERIALS (${sm.rows.length}):`);
    sm.rows.forEach(s => {
      const dMatch = doms.rows.find(d => d.id === s.domain_id);
      const dNum = dMatch ? `Dom ${dMatch.domain_number}` : 'NO DOM';
      console.log(`  [${dNum}] #${s.sort_order} - ${s.title} | doc: "${s.document_title}"`);
    });
  }

  await client.end();
}

run().catch(console.error);
