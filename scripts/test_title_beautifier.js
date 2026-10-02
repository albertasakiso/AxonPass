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

function formatCleanDocumentTitle(fileName) {
  if (!fileName) return 'Document';

  let clean = fileName;

  // Detect .part_N
  let partSuffix = '';
  const partMatch = clean.match(/\.part_(\d+)$/i);
  if (partMatch) {
    partSuffix = ` — Part ${partMatch[1]}`;
    clean = clean.replace(/\.part_\d+$/i, '');
  }

  // Remove common extensions (.pdf, .epub, .docx, .txt)
  clean = clean.replace(/\.(pdf|epub|docx|txt|doc|md)$/i, '');

  // Remove timestamp or uuid prefixes like 1738291823_ or uuid_
  clean = clean.replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[_-]?/i, '');
  clean = clean.replace(/^\d{10,}[_-]?/, '');

  // Replace underscores and multiple dashes with spaces
  clean = clean.replace(/[_-]+/g, ' ').trim();

  // Acronym standardizations
  const acronyms = ['CISA', 'CISSP', 'ISC2', 'CC', 'AWS', 'SAA', 'C03', 'NIST', 'CRISC', 'CISM', 'GRC', 'FIFA', 'SOC', 'ITAF', 'ISO', 'IEC', 'CSF', 'RMF', 'PMP', 'BIA', 'BCP', 'DRP', 'CIA', 'IAM', 'RBAC', 'AI', 'COBIT'];
  const words = clean.split(' ').map(w => {
    const upper = w.toUpperCase();
    if (acronyms.includes(upper)) return upper;
    if (w.length <= 3 && !['and', 'for', 'the', 'of', 'in', 'to', 'on', 'at', 'by'].includes(w.toLowerCase())) {
      return upper;
    }
    // Capitalize first letter
    return w.charAt(0).toUpperCase() + w.slice(1);
  });

  return words.join(' ') + partSuffix;
}

async function run() {
  await client.connect();
  const sample = await client.query(`
    SELECT certification_slug, file_name 
    FROM document_ingestion_ledger 
    ORDER BY random() 
    LIMIT 15;
  `);

  console.log('Testing title beautifier:');
  for (const row of sample.rows) {
    console.log(`[${row.certification_slug}] "${row.file_name}"`);
    console.log(`  -> "${formatCleanDocumentTitle(row.file_name)}"`);
  }

  await client.end();
}

run().catch(console.error);
