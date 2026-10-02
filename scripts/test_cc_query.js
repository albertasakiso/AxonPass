import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envContent = fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf8');

let url = '', key = '';
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('VITE_SUPABASE_URL=')) url = trimmed.replace('VITE_SUPABASE_URL=', '').replace(/^["']|["']$/g, '');
  if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) key = trimmed.replace('VITE_SUPABASE_ANON_KEY=', '').replace(/^["']|["']$/g, '');
}

const supabase = createClient(url, key);

async function check() {
  const { data: cert, error: cErr } = await supabase.from('certifications').select('*').eq('slug', 'isc2-cc').single();
  console.log('Cert:', cert, 'Error:', cErr);
  if (!cert) return;

  const { data: doms, error: dErr } = await supabase.from('domains').select('*').eq('certification_id', cert.id).order('domain_number');
  console.log('Domains count for CC:', doms?.length, 'Error:', dErr);
  
  if (doms && doms.length > 0) {
    console.log('First domain:', doms[0]);
    const { data: tops, error: tErr } = await supabase.from('topics').select('*').eq('domain_id', doms[0].id);
    console.log('Topics for Domain 1:', tops?.length, 'Error:', tErr);
    if (tops && tops.length > 0) {
      console.log('First topic:', tops[0]);
      const { data: subs, error: sErr } = await supabase.from('subtopics').select('*').in('topic_id', tops.map(t => t.id));
      console.log('Subtopics for Domain 1 topics:', subs?.length, 'Error:', sErr);
      if (subs && subs.length > 0) {
        console.log('First subtopic:', subs[0]);
      }
    }
  }

  // Also check study_materials for CC
  const { data: mats, error: mErr } = await supabase.from('study_materials').select('*').eq('certification_id', cert.id);
  console.log('Study materials for CC:', mats?.length, 'Error:', mErr);

  // Also check vault documents for CC
  const { data: vaultDocs, error: vErr } = await supabase.from('document_ingestion_ledger').select('*').eq('certification_slug', 'isc2-cc');
  console.log('Vault docs for CC:', vaultDocs?.length, 'Error:', vErr);
}

check().catch(console.error);
