import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function inspectDocxExact() {
  const docxPath = path.resolve(__dirname, '../../my_documents/cisa/CISA Sample Questions domain 1 QA.docx');
  const { value } = await mammoth.extractRawText({ path: docxPath });
  const lines = value.split('\n');

  console.log('--- Lines 1 to 30 ---');
  for (let i = 0; i < 30; i++) {
    console.log(`[${i}] ${JSON.stringify(lines[i])}`);
  }

  console.log('\n--- Lines around 2340 to 2370 (Answer section) ---');
  for (let i = 2340; i < 2370; i++) {
    console.log(`[${i}] ${JSON.stringify(lines[i])}`);
  }
}

inspectDocxExact();
