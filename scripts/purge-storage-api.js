import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');

let supabaseUrl = '';
let supabaseKey = '';

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('SUPABASE_URL=')) {
    supabaseUrl = trimmed.replace('SUPABASE_URL=', '').replace(/^["']|["']$/g, '');
  } else if (trimmed.startsWith('SUPABASE_SECRET_KEY=') || (trimmed.startsWith('SUPABASE_SERVICE_ROLE_KEY=') && !supabaseKey)) {
    supabaseKey = trimmed.replace(/^(SUPABASE_SECRET_KEY|SUPABASE_SERVICE_ROLE_KEY)=/, '').replace(/^["']|["']$/g, '');
  } else if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=') && !supabaseKey) {
    supabaseKey = trimmed.replace('VITE_SUPABASE_ANON_KEY=', '').replace(/^["']|["']$/g, '');
  }
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanStorageApi() {
  console.log('--- PURGING ALL CLOUD STORAGE OBJECTS VIA STORAGE API ---');
  
  const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
  if (bErr) {
    console.error('Error listing buckets:', bErr);
    return;
  }

  console.log(`Found ${buckets.length} storage buckets:`, buckets.map(b => b.name));

  for (const bucket of buckets) {
    console.log(`\nInspecting bucket: '${bucket.name}'...`);
    const { data: files, error: fErr } = await supabase.storage.from(bucket.name).list();
    if (files && files.length > 0) {
      console.log(`  Deleting ${files.length} files from '${bucket.name}'...`);
      const fileNames = files.map(f => f.name);
      const { error: delErr } = await supabase.storage.from(bucket.name).remove(fileNames);
      if (delErr) console.error('  Error removing files:', delErr);
      else console.log(`  ✓ Successfully deleted ${fileNames.length} files!`);
    } else {
      console.log(`  Bucket '${bucket.name}' is already empty (0 files).`);
    }

    // Now remove the bucket itself
    const { error: bucketDelErr } = await supabase.storage.deleteBucket(bucket.name);
    if (bucketDelErr) {
      console.log(`  Bucket delete notice: ${bucketDelErr.message}`);
    } else {
      console.log(`  ✓ Successfully deleted bucket '${bucket.name}'.`);
    }
  }

  const { data: remaining } = await supabase.storage.listBuckets();
  console.log(`\n✓ Final active cloud storage buckets in Supabase: ${remaining ? remaining.length : 0} (0 bytes used in cloud).`);
}

cleanStorageApi().catch(console.error);
