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

async function apply() {
  await client.connect();
  const sql = fs.readFileSync(path.resolve(__dirname, '../supabase/migrations/019_free_tier_cleaner_and_cert_isolation.sql'), 'utf8');
  console.log('Applying Migration 019...');
  await client.query(sql);
  console.log('✓ Migration 019 applied successfully!');

  // Test the new metrics RPC
  const metricsRes = await client.query('SELECT get_database_storage_metrics() as metrics');
  console.log('Test Metrics RPC output:', metricsRes.rows[0].metrics);

  await client.end();
}

apply().catch(console.error);
