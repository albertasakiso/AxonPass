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
  console.log('=== AUDITING STUDY MATERIALS CONTENT LENGTHS ACROSS ALL 15 TRACKS ===\n');

  const res = await client.query(`
    SELECT sm.id, sm.title, sm.chapter_number, length(sm.content_body) as char_len,
           c.code as cert_code, c.name as cert_name,
           d.domain_number, d.name as domain_name
    FROM study_materials sm
    JOIN certifications c ON sm.certification_id = c.id
    LEFT JOIN domains d ON sm.domain_id = d.id
    ORDER BY c.code, sm.chapter_number, sm.sort_order
  `);

  const certSummary = {};

  for (const r of res.rows) {
    if (!certSummary[r.cert_code]) {
      certSummary[r.cert_code] = { count: 0, total_chars: 0, min_chars: Infinity, max_chars: 0, short_count: 0 };
    }
    certSummary[r.cert_code].count++;
    certSummary[r.cert_code].total_chars += r.char_len;
    if (r.char_len < certSummary[r.cert_code].min_chars) certSummary[r.cert_code].min_chars = r.char_len;
    if (r.char_len > certSummary[r.cert_code].max_chars) certSummary[r.cert_code].max_chars = r.char_len;
    if (r.char_len < 4000) {
      certSummary[r.cert_code].short_count++;
      console.log(`[SHORT] [${r.cert_code.padEnd(10)}] (${r.char_len} chars) "${r.title}"`);
    }
  }

  console.log('\n=== SUMMARY PER CERTIFICATION ===');
  for (const [code, data] of Object.entries(certSummary)) {
    const avg = Math.round(data.total_chars / data.count);
    console.log(`[${code.padEnd(12)}] Chapters: ${data.count} | Avg Chars: ${avg.toLocaleString()} | Min: ${data.min_chars.toLocaleString()} | Max: ${data.max_chars.toLocaleString()} | Short (<4k): ${data.short_count}`);
  }

  await client.end();
}

run().catch(console.error);
