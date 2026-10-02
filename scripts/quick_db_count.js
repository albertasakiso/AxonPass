import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envContent = fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf8');

let directUrl = '';
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('DIRECT_URL=')) {
    directUrl = trimmed.replace('DIRECT_URL=', '').replace(/^["']|["']$/g, '');
    break;
  }
}

const client = new Client({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  await client.connect();
  const res = await client.query(`
    SELECT 
      c.slug,
      c.code,
      c.name,
      count(DISTINCT d.id) as domains,
      count(DISTINCT t.id) as topics,
      count(DISTINCT s.id) as subtopics,
      count(DISTINCT sm.id) as study_materials,
      count(DISTINCT dil.id) as vault_docs
    FROM certifications c
    LEFT JOIN domains d ON d.certification_id = c.id
    LEFT JOIN topics t ON t.domain_id = d.id
    LEFT JOIN subtopics s ON s.topic_id = t.id
    LEFT JOIN study_materials sm ON sm.certification_id = c.id
    LEFT JOIN document_ingestion_ledger dil ON dil.certification_slug = c.slug
    GROUP BY c.id, c.slug, c.code, c.name
    ORDER BY c.name
  `);
  
  console.table(res.rows);
  await client.end();
}

run().catch(console.error);
