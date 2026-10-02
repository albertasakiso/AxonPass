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

async function inspectLedger() {
  await client.connect();
  const cols = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'document_ingestion_ledger'
    ORDER BY ordinal_position
  `);
  console.log('Columns in document_ingestion_ledger:');
  console.log(cols.rows.map(r => `  - ${r.column_name} (${r.data_type})`).join('\n'));

  // Ensure public_url column exists
  const hasPublicUrl = cols.rows.some(r => r.column_name === 'public_url');
  if (!hasPublicUrl) {
    console.log('Adding column public_url to document_ingestion_ledger...');
    await client.query(`ALTER TABLE public.document_ingestion_ledger ADD COLUMN IF NOT EXISTS public_url TEXT`);
    console.log('✓ Added public_url column.');
  }

  // Ensure storage_path column exists
  const hasStoragePath = cols.rows.some(r => r.column_name === 'storage_path');
  if (!hasStoragePath) {
    console.log('Adding column storage_path to document_ingestion_ledger...');
    await client.query(`ALTER TABLE public.document_ingestion_ledger ADD COLUMN IF NOT EXISTS storage_path TEXT`);
    console.log('✓ Added storage_path column.');
  }

  // Check RLS policies on storage.objects for my_documents
  try {
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access for my_documents'
        ) THEN
          CREATE POLICY "Public Access for my_documents" ON storage.objects
          FOR SELECT USING (bucket_id = 'my_documents');
        END IF;
      END $$;
    `);
    console.log('✓ Storage public read policy verified.');
  } catch (e) {
    console.log('Policy note:', e.message);
  }

  await client.end();
}

inspectLedger().catch(console.error);
