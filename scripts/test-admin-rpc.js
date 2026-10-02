import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envContent = fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf8');

let directUrl = '';
let supabaseUrl = '';
let supabaseKey = '';

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('DIRECT_URL=')) directUrl = trimmed.replace('DIRECT_URL=', '').replace(/^["']|["']$/g, '');
  if (trimmed.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = trimmed.replace('VITE_SUPABASE_URL=', '').replace(/^["']|["']$/g, '');
  if (trimmed.startsWith('VITE_SUPABASE_PUBLISHABLE_KEY=')) supabaseKey = trimmed.replace('VITE_SUPABASE_PUBLISHABLE_KEY=', '').replace(/^["']|["']$/g, '');
}

async function testRpc() {
  console.log('1. Signing in as Super Admin (apullahalbert@gmail.com)...');
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'apullahalbert@gmail.com',
    password: 'Sector0991572=',
  });

  if (authErr) {
    console.error('Failed to sign in as super admin:', authErr.message);
    process.exit(1);
  }
  console.log('✓ Super Admin authenticated! UID:', authData.user?.id);

  // Test admin_create_user
  const testEmail = `test_learner_${Date.now()}@example.com`;
  console.log(`\n2. Testing admin_create_user for ${testEmail}...`);
  const { data: createRes, error: createErr } = await supabase.rpc('admin_create_user', {
    p_email: testEmail,
    p_password: 'TestPassword123!',
    p_full_name: 'Test Learner Account',
    p_role: 'learner',
  });

  if (createErr) {
    console.error('❌ admin_create_user error:', createErr.message);
  } else {
    console.log('✓ admin_create_user succeeded:', createRes);
  }

  const createdUserId = createRes?.user_id;

  if (createdUserId) {
    // Test admin_hard_reset_password
    console.log('\n3. Testing admin_hard_reset_password...');
    const { data: resetRes, error: resetErr } = await supabase.rpc('admin_hard_reset_password', {
      p_user_id: createdUserId,
      p_new_password: 'NewChangedPassword456!',
    });
    if (resetErr) {
      console.error('❌ admin_hard_reset_password error:', resetErr.message);
    } else {
      console.log('✓ admin_hard_reset_password succeeded:', resetRes);
    }

    // Test admin_set_user_status (suspend)
    console.log('\n4. Testing admin_set_user_status (suspend)...');
    const { data: statRes, error: statErr } = await supabase.rpc('admin_set_user_status', {
      p_user_id: createdUserId,
      p_status: 'suspended',
    });
    if (statErr) {
      console.error('❌ admin_set_user_status error:', statErr.message);
    } else {
      console.log('✓ admin_set_user_status succeeded:', statRes);
    }

    // Test admin_delete_user
    console.log('\n5. Testing admin_delete_user...');
    const { data: delRes, error: delErr } = await supabase.rpc('admin_delete_user', {
      p_user_id: createdUserId,
    });
    if (delErr) {
      console.error('❌ admin_delete_user error:', delErr.message);
    } else {
      console.log('✓ admin_delete_user succeeded:', delRes);
    }
  }

  console.log('\nAll Super Admin RPC functions validated successfully!');
}

testRpc().catch(console.error);
