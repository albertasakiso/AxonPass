import pg from 'pg';
import fs from 'fs';
import path from 'path';
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

async function checkSecrets() {
  await client.connect();
  console.log('--- CHECKING SUPABASE JWT SECRETS / CONFIG ---');

  // Check vault
  try {
    const vault = await client.query('SELECT * FROM vault.decrypted_secrets');
    console.log('Vault secrets:', vault.rows);
  } catch (e) {
    console.log('Vault query:', e.message);
  }

  // Check custom settings
  try {
    const settings = await client.query(`
      SELECT name, setting FROM pg_settings 
      WHERE name LIKE '%jwt%' OR name LIKE '%auth%' OR name LIKE '%secret%'
    `);
    console.log('PG Settings:', settings.rows);
  } catch (e) {
    console.log('PG settings query:', e.message);
  }

  // Check auth schema configuration / tables
  try {
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'auth'
    `);
    console.log('Auth tables:', tables.rows.map(r => r.table_name));
  } catch (e) {
    console.log('Auth schema tables query:', e.message);
  }

  await client.end();
}

checkSecrets();
