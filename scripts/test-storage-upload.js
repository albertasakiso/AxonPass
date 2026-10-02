import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');

let supabaseUrl = '';
let secretKey = '';

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('SUPABASE_URL=')) {
    supabaseUrl = trimmed.replace('SUPABASE_URL=', '').replace(/^["']|["']$/g, '');
  }
  if (trimmed.startsWith('SUPABASE_SECRET_KEY=')) {
    secretKey = trimmed.replace('SUPABASE_SECRET_KEY=', '').replace(/^["']|["']$/g, '');
  }
}

const supabase = createClient(supabaseUrl, secretKey);

async function testLargeUpload() {
  const testFile = 'd:/SECTOR FUSION PROJECTS/apiliguPass/my_documents/FIFA AGENT LICENSE/20260115_Study Materials_EN_FINAL_CLEAN.pdf';
  console.log('Testing upload of 61.8MB file...');
  const buffer = fs.readFileSync(testFile);
  const { data, error } = await supabase.storage
    .from('my_documents')
    .upload('test_fifa_clean.pdf', buffer, {
      contentType: 'application/pdf',
      upsert: true
    });

  if (error) {
    console.error('Large file upload error:', error);
  } else {
    console.log('Large file upload succeeded:', data);
    await supabase.storage.from('my_documents').remove(['test_fifa_clean.pdf']);
  }
}

testLargeUpload().catch(console.error);
