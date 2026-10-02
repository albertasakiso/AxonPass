import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

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

const client = new Client({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false },
});

async function verify() {
  await client.connect();
  const summary = await client.query(`
    SELECT 
      count(*) as total_files,
      round(sum(file_size_bytes) / (1024 * 1024), 2) as total_size_mb,
      count(distinct certification_slug) as total_certs,
      count(*) FILTER (WHERE public_url IS NOT NULL) as files_with_storage_url,
      count(*) FILTER (WHERE cloud_storage_status LIKE 'split%') as chunked_large_files
    FROM public.document_ingestion_ledger
  `);
  console.log('\n--- SUPABASE INGESTION LEDGER AUDIT ---');
  console.log(summary.rows[0]);

  const samples = await client.query(`
    SELECT file_name, certification_name, cloud_storage_status, public_url 
    FROM public.document_ingestion_ledger 
    ORDER BY file_size_bytes DESC 
    LIMIT 4
  `);
  console.log('\n--- TOP 4 LARGEST INGESTED FILES ---');
  samples.rows.forEach(r => {
    console.log(`- [${r.certification_name}] ${r.file_name}`);
    console.log(`  Status: ${r.cloud_storage_status}`);
    console.log(`  Storage URL: ${r.public_url}`);
  });

  await client.end();
}

verify().catch(console.error);
