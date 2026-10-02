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
  console.log('=== CROSS-AUDITING ALL STUDY MATERIALS IN SYSTEM ===\n');

  const res = await client.query(`
    SELECT sm.id, sm.title, sm.document_title, sm.chapter_number, sm.sort_order,
           c.code as cert_code, c.name as cert_name,
           d.domain_number, d.name as domain_name
    FROM study_materials sm
    JOIN certifications c ON sm.certification_id = c.id
    LEFT JOIN domains d ON sm.domain_id = d.id
    ORDER BY c.code, sm.chapter_number, sm.sort_order
  `);

  const suspectedMismatches = [];

  for (const r of res.rows) {
    const title = (r.title || '').toLowerCase();
    const doc = (r.document_title || '').toLowerCase();
    const code = r.cert_code;

    // Checks
    if (code === 'CISA' && (doc.includes('cissp') || title.includes('cissp') || doc.includes('isc2'))) {
      suspectedMismatches.push({ issue: 'CISA has CISSP document', ...r });
    }
    if (code === 'CISSP' && (doc.includes('cisa') || doc.includes('isaca cisa'))) {
      suspectedMismatches.push({ issue: 'CISSP has CISA document', ...r });
    }
    if (code === 'CISM' && !doc.includes('cism') && !doc.includes('isaca') && !doc.includes('risk it') && !doc.includes('iso')) {
      suspectedMismatches.push({ issue: 'CISM suspicious doc', ...r });
    }
    if (code === 'CC' && !doc.includes('cc') && !doc.includes('isc2')) {
      suspectedMismatches.push({ issue: 'CC suspicious doc', ...r });
    }
    if (code === 'CCSP' && !doc.includes('ccsp') && !doc.includes('csa') && !doc.includes('cloud') && !doc.includes('isc2')) {
      suspectedMismatches.push({ issue: 'CCSP suspicious doc', ...r });
    }
    if (code === 'FIFA-AGENT' && !doc.includes('fifa')) {
      suspectedMismatches.push({ issue: 'FIFA suspicious doc', ...r });
    }
    if (code === 'SAA-C03' && !doc.includes('aws')) {
      suspectedMismatches.push({ issue: 'AWS suspicious doc', ...r });
    }
    if (code === 'A+' && !doc.includes('a+') && !doc.includes('comptia a+')) {
      suspectedMismatches.push({ issue: 'A+ suspicious doc', ...r });
    }
    if (code === 'NETWORK+' && !doc.includes('network+') && !doc.includes('comptia network+')) {
      suspectedMismatches.push({ issue: 'Network+ suspicious doc', ...r });
    }
    if (code === 'GSLC' && !doc.includes('gslc') && !doc.includes('sans')) {
      suspectedMismatches.push({ issue: 'GSLC suspicious doc', ...r });
    }
  }

  console.log(`Found ${suspectedMismatches.length} suspected study material mismatches:`);
  suspectedMismatches.forEach(m => {
    console.log(` - [${m.cert_code}] ${m.issue} | Title: "${m.title}" | Doc: "${m.document_title}" | ID: ${m.id}`);
  });

  await client.end();
}

run().catch(console.error);
