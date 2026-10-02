import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';

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

const CISM_EXTRA = [
  { term: 'Security Baseline', definition: 'A mandatory minimum set of security controls and configuration settings required for a system, application, or platform.' },
  { term: 'Data Loss Prevention (DLP) Policy', definition: 'An enterprise policy governing the classification, monitoring, and restriction of unauthorized data movement across endpoints and networks.' },
  { term: 'SOC (Security Operations Center)', definition: 'A centralized facility housing the team, processes, and technology responsible for continuously monitoring and enhancing an enterprise security posture.' },
  { term: 'Incident Containment Strategy', definition: 'The tactical approach (e.g., system isolation, credential revocation, network micro-segmentation) chosen to limit an attack blast radius without destroying evidence.' }
];

async function addCISMExtra() {
  await client.connect();
  const certRes = await client.query("SELECT id FROM certifications WHERE slug = 'cism'");
  const certId = certRes.rows[0]?.id;
  if (!certId) return;

  for (const t of CISM_EXTRA) {
    await client.query(`
      INSERT INTO glossary_terms (id, certification_id, term, definition)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (certification_id, term) DO UPDATE SET
        definition = EXCLUDED.definition;
    `, [uuidv4(), certId, t.term, t.definition]);
  }
  console.log('✓ Added 4 CISM extra terms');
  await client.end();
}

addCISMExtra().catch(console.error);
