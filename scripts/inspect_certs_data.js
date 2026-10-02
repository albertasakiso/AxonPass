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

async function main() {
  const { data: certs } = await supabase.from('certifications').select('id, name, slug, code');
  console.log('Certifications found:', certs);

  for (const c of certs || []) {
    const { count: domCount } = await supabase.from('domains').select('id', { count: 'exact', head: true }).eq('certification_id', c.id);
    const { count: topCount } = await supabase.from('topics').select('id', { count: 'exact', head: true }).eq('certification_id', c.id);
    const { count: matCount } = await supabase.from('study_materials').select('id', { count: 'exact', head: true }).eq('certification_id', c.id);
    const { count: qCount } = await supabase.from('questions').select('id', { count: 'exact', head: true }).eq('certification_id', c.id);
    const { count: docCount } = await supabase.from('document_ingestion_ledger').select('id', { count: 'exact', head: true }).eq('certification_slug', c.slug);
    console.log(`[Cert: ${c.slug} (${c.code || c.name})] Domains: ${domCount}, Topics: ${topCount}, Materials: ${matCount}, Questions: ${qCount}, IngestedDocs: ${docCount}`);
  }

  // Also check distinct certification_slug in document_ingestion_ledger
  const { data: ledgerSlugs } = await supabase.from('document_ingestion_ledger').select('certification_slug');
  const distinct = [...new Set(ledgerSlugs?.map(d => d.certification_slug))];
  console.log('\nDistinct certification_slug values in document_ingestion_ledger:', distinct);
}

main().catch(console.error);
