import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = path.resolve(__dirname, '../../my_documents/cisa/dumps/0 to 100 CISA dumps.pdf');

async function testPdf() {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);
  console.log(`Total Pages: ${data.numpages}`);
  console.log(`Extracted Text Length: ${data.text.length}`);
  console.log('\n--- SAMPLE 2000 CHARS ---');
  console.log(data.text.slice(0, 2000));
}

testPdf();
