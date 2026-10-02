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

async function inspectCertContent() {
  const { data: certs } = await supabase.from('certifications').select('*');
  
  for (const c of certs) {
    const { data: doms } = await supabase.from('domains').select('id, name, domain_number').eq('certification_id', c.id);
    console.log(`\n=== Cert: ${c.slug} (${c.name}) [${c.code}] ===`);
    console.log(`  Domains count: ${doms?.length || 0}`);
    
    if (doms && doms.length > 0) {
      for (const d of doms) {
        const { data: tops } = await supabase.from('topics').select('id, name, topic_code').eq('domain_id', d.id);
        let subCount = 0;
        if (tops && tops.length > 0) {
          const { count } = await supabase.from('subtopics').select('id', { count: 'exact', head: true }).in('topic_id', tops.map(t => t.id));
          subCount = count || 0;
        }
        console.log(`    Domain ${d.domain_number}: ${d.name} -> ${tops?.length || 0} topics, ${subCount} subtopics`);
      }
    }

    const { count: studyCount } = await supabase.from('study_materials').select('id', { count: 'exact', head: true }).eq('certification_id', c.id);
    const { count: qCount } = await supabase.from('questions').select('id', { count: 'exact', head: true }).eq('certification_id', c.id);
    console.log(`  Study Materials count: ${studyCount || 0}`);
    console.log(`  Questions count: ${qCount || 0}`);
  }
}

inspectCertContent().catch(console.error);
