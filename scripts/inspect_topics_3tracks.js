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

async function listTrackTopics() {
  await client.connect();
  const certs = ['A+', 'NETWORK+', 'GSLC'];
  for (const c of certs) {
    console.log(`\n=== Topics for ${c} ===`);
    const res = await client.query(`
      SELECT c.code, d.domain_number, d.name as domain_name, t.id as topic_id, t.topic_code, t.name as topic_name
      FROM certifications c
      JOIN domains d ON d.certification_id = c.id
      JOIN topics t ON t.domain_id = d.id
      WHERE c.code = $1
      ORDER BY d.domain_number, t.sort_order;
    `, [c]);
    res.rows.forEach(r => {
      console.log(`[D${r.domain_number}] ${r.topic_code}: ${r.topic_name} (ID: ${r.topic_id})`);
    });
  }
  await client.end();
}

listTrackTopics().catch(console.error);
