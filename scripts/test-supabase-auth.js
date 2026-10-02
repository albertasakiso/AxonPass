import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) env[k] = v.join('=').replace(/^["']|["']$/g, '');
});

console.log('Testing Supabase Client Auth with URL:', env.VITE_SUPABASE_URL);
console.log('Key prefix:', env.VITE_SUPABASE_PUBLISHABLE_KEY?.slice(0, 15));

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY
);

async function testAuth() {
  console.log('\n--- 1. Testing Supabase Health / REST endpoint ---');
  const { data: certs, error: certsError } = await supabase.from('certifications').select('*');
  console.log('Certifications query result:', certs ? `Found ${certs.length} certs` : 'Failed');
  if (certsError) console.error('Certifications error:', certsError);

  console.log('\n--- 2. Testing signInWithPassword with intentional test ---');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'apullahalbert@gmail.com',
    password: 'TestPassword123!',
  });
  console.log('SignIn test response data:', data);
  console.log('SignIn test error:', error);
}

testAuth();
