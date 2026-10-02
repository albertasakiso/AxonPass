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

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY
);

async function testFullAuthFlow() {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'TestUserPass123!';

  console.log(`\n1. Creating account for: ${testEmail}`);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        full_name: 'Test CISA Learner',
      },
    },
  });

  if (signUpError) {
    console.error('Sign up error:', signUpError);
    return;
  }
  console.log('✓ Account created. User ID:', signUpData.user?.id);

  console.log('\n2. Testing instant sign-in with the newly created account...');
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (signInError) {
    console.error('Sign in error:', signInError);
  } else {
    console.log('✓ SUCCESS! Instant sign-in succeeded.');
    console.log('Session token:', signInData.session?.access_token.slice(0, 30) + '...');
  }
}

testFullAuthFlow();
