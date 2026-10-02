import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function inspectCisaFiles() {
  const dir = path.resolve(__dirname, '../../my_documents/cisa');
  
  // 1. Inspect 6e931cfe-f7e1-4339-93d6-0fbabdf0db52.pdf
  const pdf1 = path.join(dir, '6e931cfe-f7e1-4339-93d6-0fbabdf0db52.pdf');
  if (fs.existsSync(pdf1)) {
    const buf = fs.readFileSync(pdf1);
    const parser = new PDFParse({ data: buf });
    const res = await parser.getText();
    console.log('=== 6e931cfe... PDF Info ===');
    console.log('Total pages / text length:', res.text.length);
    console.log('Snippet:', res.text.slice(0, 500));
  }

  // 2. Inspect CISA PRACTICE 1.pdf
  const pdf2 = path.join(dir, 'CISA PRACTICE 1.pdf');
  if (fs.existsSync(pdf2)) {
    const buf = fs.readFileSync(pdf2);
    const parser = new PDFParse({ data: buf });
    const res = await parser.getText();
    console.log('\n=== CISA PRACTICE 1.pdf Info ===');
    console.log('Total text length:', res.text.length);
    console.log('Snippet:', res.text.slice(0, 500));
  }
}

inspectCisaFiles();
