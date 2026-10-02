import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  try {
    const docxPath = path.resolve(__dirname, '../../my_documents/cisa/CISA Sample Questions domain 1 QA.docx');
    if (fs.existsSync(docxPath)) {
      const { value } = await mammoth.extractRawText({ path: docxPath });
      console.log('=== CISA Sample Questions domain 1 QA.docx ===');
      console.log('Text length:', value.length);
      console.log('First 1200 chars:\n', value.slice(0, 1200));
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
