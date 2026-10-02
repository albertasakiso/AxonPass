import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const docxPath = path.resolve(__dirname, '../../my_documents/cisa/CISA Sample Questions domain 1 QA.docx');
  const { value } = await mammoth.extractRawText({ path: docxPath });
  
  // Find where answers start or if there is an Answer section
  const lines = value.split('\n');
  console.log('Total lines:', lines.length);

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (/answer|rationale|solution|key/i.test(l) && l.length < 50) {
      console.log(`Line ${i}: ${l}`);
    }
  }

  // Print the last 2000 chars of docx
  console.log('\nLast 2000 chars:\n', value.slice(-2000));
}

run();
