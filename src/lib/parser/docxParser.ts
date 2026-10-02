/* ===================================================================
   APILIGU LEARNING PASS — Mammoth DOCX Question Parser
   Client-side docx parsing with rule-based pattern extraction
   and confidence scoring (§7.5).
   =================================================================== */

import mammoth from 'mammoth';
import type { ParsedQuestion } from '../../types';
import type { ParseOutcome } from './csvParser';
import { validateQuestion } from './validator';

/**
 * Parse an ArrayBuffer containing a .docx file into structured questions.
 */
export async function parseDocxQuestions(arrayBuffer: ArrayBuffer, fileName: string): Promise<ParseOutcome> {
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value;

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const parsed: ParsedQuestion[] = [];
  let valid = 0;
  let flagged = 0;
  let errors = 0;

  // Split into potential question chunks by common question markers
  const chunks: string[] = [];
  let currentChunk: string[] = [];

  for (const line of lines) {
    const isNewQuestion = /^(\*\*)?(Q\d+[:.]|\d+[.:]\s+|Question\s+\d+[:.])/i.test(line);
    if (isNewQuestion && currentChunk.length > 0) {
      chunks.push(currentChunk.join('\n'));
      currentChunk = [];
    }
    currentChunk.push(line);
  }
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n'));
  }

  chunks.forEach((chunk, index) => {
    const rowNum = index + 1;
    let stem = '';
    let optionA = '';
    let optionB = '';
    let optionC = '';
    let optionD = '';
    let correctAnswer = '';
    let rationale = '';
    let confidence: 'verified' | 'unverified' = 'unverified';

    // 1. Try to extract stem
    const stemMatch = chunk.match(/^(\*\*)?(?:Q\d+[:.]|\d+[.:]|Question\s+\d+[:.])?\s*([\s\S]+?)(?=\n\s*(?:Option\s*1|Option\s*A|[A-D][.:]|\(A\)))/i);
    if (stemMatch) {
      stem = stemMatch[2].replace(/\*\*/g, '').trim();
    } else {
      const firstLine = chunk.split('\n')[0] || '';
      stem = firstLine.replace(/^(\*\*)?(?:Q\d+[:.]|\d+[.:]|Question\s+\d+[:.])?\s*/i, '').trim();
    }

    // 2. Extract options
    const optAMatch = chunk.match(/(?:Option\s*1|Option\s*A|A[.:]|\(A\))\s*([^\n]+)/i);
    const optBMatch = chunk.match(/(?:Option\s*2|Option\s*B|B[.:]|\(B\))\s*([^\n]+)/i);
    const optCMatch = chunk.match(/(?:Option\s*3|Option\s*C|C[.:]|\(C\))\s*([^\n]+)/i);
    const optDMatch = chunk.match(/(?:Option\s*4|Option\s*D|D[.:]|\(D\))\s*([^\n]+)/i);

    if (optAMatch) optionA = optAMatch[1].trim();
    if (optBMatch) optionB = optBMatch[1].trim();
    if (optCMatch) optionC = optCMatch[1].trim();
    if (optDMatch) optionD = optDMatch[1].trim();

    // 3. Extract Answer & Explanation
    const ansMatch = chunk.match(/(?:Correct Answer|Answer|ANS)[:.]\s*([^\n]+)/i);
    if (ansMatch) {
      const rawAns = ansMatch[1].trim();
      const firstLetter = rawAns.charAt(0).toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(firstLetter)) {
        correctAnswer = firstLetter;
      } else if (rawAns.toLowerCase().includes('option 1')) {
        correctAnswer = 'A';
      } else if (rawAns.toLowerCase().includes('option 2')) {
        correctAnswer = 'B';
      } else if (rawAns.toLowerCase().includes('option 3')) {
        correctAnswer = 'C';
      } else if (rawAns.toLowerCase().includes('option 4')) {
        correctAnswer = 'D';
      } else if (optionB && rawAns.toLowerCase().includes(optionB.toLowerCase())) {
        correctAnswer = 'B';
      } else if (optionC && rawAns.toLowerCase().includes(optionC.toLowerCase())) {
        correctAnswer = 'C';
      } else if (optionD && rawAns.toLowerCase().includes(optionD.toLowerCase())) {
        correctAnswer = 'D';
      } else {
        correctAnswer = 'A';
      }

      const explParts = rawAns.split(/[.:]\s+/);
      if (explParts.length > 1) {
        rationale = explParts.slice(1).join('. ').trim();
        confidence = 'verified';
      }
    }

    const explMatch = chunk.match(/(?:Explanation|Rationale)[:.]\s*([\s\S]+)/i);
    if (explMatch) {
      rationale = explMatch[1].trim();
      confidence = 'verified';
    }

    if (!rationale) {
      rationale = `Extracted from ${fileName}: Correct option is ${correctAnswer || 'A'}.`;
    }

    // Infer domain based on keywords
    let domain = '1';
    const lowerStem = stem.toLowerCase();
    if (lowerStem.includes('govern') || lowerStem.includes('strategy') || lowerStem.includes('cobit') || lowerStem.includes('board') || lowerStem.includes('steering')) domain = '2';
    else if (lowerStem.includes('development') || lowerStem.includes('sdlc') || lowerStem.includes('agile') || lowerStem.includes('testing') || lowerStem.includes('uat') || lowerStem.includes('acquisition')) domain = '3';
    else if (lowerStem.includes('operation') || lowerStem.includes('bcp') || lowerStem.includes('drp') || lowerStem.includes('incident') || lowerStem.includes('backup') || lowerStem.includes('rto') || lowerStem.includes('rpo')) domain = '4';
    else if (lowerStem.includes('security') || lowerStem.includes('crypto') || lowerStem.includes('firewall') || lowerStem.includes('access control') || lowerStem.includes('biometric') || lowerStem.includes('iam') || lowerStem.includes('forensic')) domain = '5';

    const validation = validateQuestion(
      {
        stem,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        rationale,
      },
      rowNum
    );

    if (validation.isValid) {
      valid++;
    } else if (validation.errors.length > 0) {
      errors++;
    } else {
      flagged++;
    }

    parsed.push({
      rowNumber: rowNum,
      externalId: `DOCX-${rowNum}`,
      stem,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      rationale,
      domain,
      topic: '',
      difficulty: 'medium',
      sourceReference: fileName,
      confidence,
      validationErrors: validation.errors.map((e) => e.message),
      answerSources: [
        {
          source: 'inline',
          answer: correctAnswer,
          confidence: confidence === 'verified' ? 0.95 : 0.7,
        },
      ],
    });
  });

  return {
    questions: parsed,
    validCount: valid,
    flaggedCount: flagged,
    errorsCount: errors,
    totalRows: chunks.length,
  };
}
