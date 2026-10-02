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

async function check() {
  await client.connect();
  const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
  console.log('Public tables (' + tables.rows.length + '):');
  console.log(tables.rows.map(r => '  - ' + r.table_name).join('\n'));

  try {
    const storageBuckets = await client.query("SELECT * FROM storage.buckets");
    console.log('\nStorage buckets:');
    console.log(storageBuckets.rows);
    const storageObjects = await client.query("SELECT count(*), coalesce(sum(length(metadata::text)), 0) FROM storage.objects");
    console.log('\nStorage objects count:', storageObjects.rows[0]);
  } catch (e) {
    console.log('\nStorage query note:', e.message);
  }

  await client.end();
}

check().catch(console.error);
