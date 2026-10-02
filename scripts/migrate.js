import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file directly to get connection string
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
  // fallback to direct connection string in .env
  const match = envContent.match(/postgresql:\/\/[^\s]+/);
  if (match) {
    directUrl = match[0];
  }
}

if (!directUrl) {
  console.error('No Postgres connection URL found in .env');
  process.exit(1);
}

console.log('Connecting to Supabase Postgres database...');

const client = new Client({
  connectionString: directUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function runMigrations() {
  try {
    await client.connect();
    console.log('Connected successfully to database.');

    const migrationsDir = path.resolve(__dirname, '../supabase/migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`Found ${files.length} migration files to execute:`);
    files.forEach(f => console.log(`  - ${f}`));

    for (const file of files) {
      console.log(`\nExecuting migration: ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      await client.query(sql);
      console.log(`  ✓ ${file} applied successfully.`);
    }

    console.log('\n=============================================');
    console.log('All migrations completed successfully!');
    console.log('=============================================');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
