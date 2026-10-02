import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../.env');
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

async function reportStudyMaterials() {
  await client.connect();
  const res = await client.query(`
    SELECT c.name as cert_name, c.slug, count(sm.id) as total_modules
    FROM study_materials sm
    JOIN certifications c ON sm.certification_id = c.id
    GROUP BY c.name, c.slug
    ORDER BY c.slug
  `);

  console.log('=== STUDY MATERIALS & MANUAL MODULES REPORT ===\n');
  for (const r of res.rows) {
    console.log(`- [${r.slug.toUpperCase()}] ${r.cert_name}: ${r.total_modules} full modules/chapters`);
  }

  const detailedRes = await client.query(`
    SELECT sm.section_number, sm.title, sm.estimated_read_minutes, sm.page_start, sm.page_end
    FROM study_materials sm
    JOIN certifications c ON sm.certification_id = c.id
    WHERE c.slug = 'cisa'
    ORDER BY sm.sort_order
  `);

  console.log('\n--- CISA Full Module Index (20 Modules) ---');
  for (const m of detailedRes.rows) {
    console.log(`  [${m.section_number}] ${m.title} (~${m.estimated_read_minutes} min | pp.${m.page_start}-${m.page_end})`);
  }

  await client.end();
}

reportStudyMaterials();
