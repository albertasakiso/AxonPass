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

async function inspectCC() {
  await client.connect();
  const certRes = await client.query(`
    SELECT * FROM certifications WHERE slug IN ('isc2-cc', 'cc', 'isc2_cc') OR code = 'ISC2 CC';
  `);
  console.log('Certifications found:', certRes.rows);

  if (certRes.rows.length > 0) {
    const certId = certRes.rows[0].id;
    const domRes = await client.query(`SELECT * FROM domains WHERE certification_id = $1 ORDER BY domain_number;`, [certId]);
    console.log('Domains:', domRes.rows);

    const topRes = await client.query(`
      SELECT count(*) as topic_count FROM topics WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1);
    `, [certId]);
    console.log('Topics count:', topRes.rows[0].topic_count);

    const qRes = await client.query(`
      SELECT count(*) as q_count FROM questions WHERE certification_id = $1;
    `, [certId]);
    console.log('Questions count:', qRes.rows[0].q_count);

    const subRes = await client.query(`
      SELECT count(*) as sub_count FROM subtopics WHERE topic_id IN (
        SELECT id FROM topics WHERE domain_id IN (SELECT id FROM domains WHERE certification_id = $1)
      );
    `, [certId]);
    console.log('Subtopics count:', subRes.rows[0].sub_count);

    const matRes = await client.query(`
      SELECT count(*) as mat_count FROM study_materials WHERE certification_id = $1;
    `, [certId]);
    console.log('Study materials count:', matRes.rows[0].mat_count);
  }

  await client.end();
}

inspectCC().catch(console.error);
