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

async function findQuestion() {
  await client.connect();
  const res = await client.query(`
    SELECT q.*, d.name as domain_name, d.domain_number
    FROM questions q
    JOIN domains d ON q.domain_id = d.id
    WHERE q.stem ILIKE '%employee morale%' OR q.rationale ILIKE '%employee morale%' OR q.stem ILIKE '%improvement suggestions%'
  `);

  console.log(`Found ${res.rows.length} matches in live database:`);
  for (const row of res.rows) {
    console.log('\n----------------------------------------');
    console.log(`Domain ${row.domain_number}: ${row.domain_name}`);
    console.log(`Stem: ${row.stem}`);
    console.log(`A: ${row.option_a}`);
    console.log(`B: ${row.option_b}`);
    console.log(`C: ${row.option_c}`);
    console.log(`D: ${row.option_d}`);
    console.log(`Correct Answer: ${row.correct_answer}`);
    console.log(`Rationale: ${row.rationale}`);
    console.log(`Source: ${row.source_reference}`);
  }

  await client.end();
}

findQuestion();
