import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docxPath = path.resolve(__dirname, '../CISA Sample Questions domain 1 QA.docx');

async function inspectDocx() {
  console.log('Extracting text from DOCX:', docxPath);
  const result = await mammoth.extractRawText({ path: docxPath });
  const text = result.value;

  console.log(`Total extracted characters: ${text.length}`);
  console.log('\n--- SAMPLE (first 1,500 chars) ---');
  console.log(text.slice(0, 1500));

  // Write out raw text for inspection
  const outPath = path.resolve(__dirname, '../scratch/parsed_docx_raw.txt');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, text, 'utf8');
  console.log(`\nFull extracted raw text written to ${outPath}`);
}

inspectDocx();
