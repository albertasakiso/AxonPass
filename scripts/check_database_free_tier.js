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

async function checkDatabaseUsage() {
  await client.connect();
  console.log('=== SUPABASE DATABASE SIZE & FREE TIER AUDIT ===\n');

  // Overall database size
  const dbSizeRes = await client.query(`
    SELECT pg_size_pretty(pg_database_size(current_database())) as total_db_size,
           pg_database_size(current_database()) as total_bytes
  `);
  console.log('Total Database Size:', dbSizeRes.rows[0].total_db_size, `(${((dbSizeRes.rows[0].total_bytes / (500 * 1024 * 1024)) * 100).toFixed(2)}% of 500MB Free Tier cap)\n`);

  // Top 15 tables by size
  const tables = await client.query(`
    SELECT 
      table_name,
      pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as total_size,
      pg_total_relation_size(quote_ident(table_name)) as size_bytes
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC
    LIMIT 15;
  `);

  console.log('Top Tables by Disk Space:');
  tables.rows.forEach(r => {
    console.log(`  - ${r.table_name.padEnd(30, ' ')} : ${r.total_size}`);
  });

  await client.end();
}

checkDatabaseUsage().catch(console.error);
