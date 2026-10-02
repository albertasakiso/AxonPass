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
    SELECT c.slug, c.name, count(s.id) as subtopic_count
    FROM certifications c
    JOIN domains d ON d.certification_id = c.id
    JOIN topics t ON t.domain_id = d.id
    JOIN subtopics s ON s.topic_id = t.id
    GROUP BY c.slug, c.name
  `);
  console.log('Subtopics by Certification:');
  console.table(res.rows);

  const matRes = await client.query(`
    SELECT c.slug, c.name, count(sm.id) as study_material_count
    FROM certifications c
    JOIN study_materials sm ON sm.certification_id = c.id
    GROUP BY c.slug, c.name
  `);
  console.log('\nStudy Materials by Certification:');
  console.table(matRes.rows);

  // Check how many subtopics exist in total and orphaned
  const orphanRes = await client.query(`
    SELECT count(*) as orphan_subtopics
    FROM subtopics s
    LEFT JOIN topics t ON s.topic_id = t.id
    WHERE t.id IS NULL
  `);
  console.log('\nOrphan subtopics (no matching topic):', orphanRes.rows[0].orphan_subtopics);

  await client.end();
}

run().catch(console.error);
