import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function extractTextFromWordXml(xmlPath) {
  if (!fs.existsSync(xmlPath)) return '';
  const xml = fs.readFileSync(xmlPath, 'utf8');
  
  // Replace paragraph endings with newlines
  let text = xml.replace(/<\/w:p>/g, '\n');
  // Replace tab characters
  text = text.replace(/<w:tab\/>/g, '\t');
  // Strip all xml tags
  text = text.replace(/<[^>]+>/g, '');
  // Clean up HTML entities
  text = text.replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&apos;/g, "'");
  
  // Clean multiple newlines
  return text.split('\n').map(l => l.trim()).filter(Boolean).join('\n');
}

const v1Xml = path.resolve(__dirname, 'temp_spec_v1/word/document.xml');
const v2Xml = path.resolve(__dirname, 'temp_spec_v2/word/document.xml');

const textV1 = extractTextFromWordXml(v1Xml);
const textV2 = extractTextFromWordXml(v2Xml);

fs.writeFileSync(path.resolve(__dirname, 'SPEC_V1.md'), textV1);
fs.writeFileSync(path.resolve(__dirname, 'SPEC_V2.md'), textV2);

console.log('=== SPEC V1 EXTRACTED (Length: ' + textV1.length + ' chars) ===');
console.log('=== SPEC V2 EXTRACTED (Length: ' + textV2.length + ' chars) ===');
