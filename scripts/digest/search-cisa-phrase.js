import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function searchAllMaterials() {
  const cisaDir = path.resolve(__dirname, '../../my_documents/cisa');
  const dumpsDir = path.join(cisaDir, 'dumps');

  const files = [
    path.join(cisaDir, 'CISA MCQ DUMP.pdf'),
    path.join(cisaDir, 'CISA Review Manual 27ed 2019.pdf'),
    ...fs.readdirSync(dumpsDir).filter(f => f.endsWith('.pdf')).map(f => path.join(dumpsDir, f))
  ];

  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    try {
      const buf = fs.readFileSync(f);
      const parser = new PDFParse({ data: buf });
      const res = await parser.getText();
      const text = res.text;

      const idx = text.toLowerCase().indexOf('morale');
      if (idx !== -1) {
        console.log(`\nFound 'morale' match in ${path.basename(f)}:`);
        const snippet = text.slice(Math.max(0, idx - 200), Math.min(text.length, idx + 400));
        console.log(snippet);
      }
    } catch (err) {
      // skip
    }
  }
}

searchAllMaterials();
