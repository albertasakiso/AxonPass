import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const docxPath = path.resolve(__dirname, '../../my_documents/cisa/CISA Sample Questions domain 1 QA.docx');
  const { value } = await mammoth.extractRawText({ path: docxPath });
  
  console.log('Searching for Answer pattern in docx...');
  const answerMatches = value.match(/(?:Answer|ANS|Correct Answer|Explanation)[:\s]/gi);
  console.log('Answer matches count:', answerMatches ? answerMatches.length : 0);

  // Print a slice around question 1 to 5
  console.log('Slice around Q1-Q5:\n', value.slice(0, 3000));
}

run();
