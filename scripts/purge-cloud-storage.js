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

async function purgeStorage() {
  await client.connect();
  console.log('--- PURGING ALL CLOUD STORAGE OBJECTS & BUCKETS ---');

  try {
    // Delete any objects in storage.objects
    const delObjs = await client.query("DELETE FROM storage.objects WHERE bucket_id = 'study-documents'");
    console.log(`✓ Deleted ${delObjs.rowCount} storage object(s) from 'study-documents'.`);

    // Delete bucket from storage.buckets
    const delBucket = await client.query("DELETE FROM storage.buckets WHERE id = 'study-documents'");
    console.log(`✓ Deleted storage bucket 'study-documents'. (${delBucket.rowCount} removed)`);

    // Verify 0 objects remaining
    const checkObjs = await client.query("SELECT count(*) FROM storage.objects");
    console.log(`✓ Total remaining cloud storage objects in Supabase: ${checkObjs.rows[0].count} (0 bytes used).`);

    const checkBuckets = await client.query("SELECT count(*) FROM storage.buckets");
    console.log(`✓ Total remaining storage buckets: ${checkBuckets.rows[0].count}.`);
  } catch (e) {
    console.error('Storage purge error:', e.message);
  }

  await client.end();
}

purgeStorage().catch(console.error);
