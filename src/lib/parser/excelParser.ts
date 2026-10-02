/* ===================================================================
   APILIGU LEARNING PASS — Excel Question Parser
   Native .xlsx and .xls parser using SheetJS (xlsx)
   =================================================================== */

import * as XLSX from 'xlsx';
import type { ParsedQuestion } from '../../types';
import type { ParseOutcome } from './csvParser';
import { validateQuestion } from './validator';

export interface ExcelSheetData {
  sheetName: string;
  headers: string[];
  rows: Record<string, string>[];
  totalRows: number;
}

/**
 * Extract sheets and raw table data from an Excel ArrayBuffer.
 */
export function inspectExcelWorkbook(arrayBuffer: ArrayBuffer): ExcelSheetData[] {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const results: ExcelSheetData[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rawJson = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { header: 1 });
    
    if (rawJson.length === 0) continue;

    const headers = (rawJson[0] as any[]).map((h) => String(h || '').trim());
    const dataRows = rawJson.slice(1);

    const rows: Record<string, string>[] = [];
    for (const r of dataRows) {
      if (!r || r.length === 0) continue;
      const rowObj: Record<string, string> = {};
      let hasContent = false;

      headers.forEach((header, idx) => {
        const val = r[idx] !== undefined && r[idx] !== null ? String(r[idx]).trim() : '';
        if (val) hasContent = true;
        rowObj[header] = val;
      });

      if (hasContent) {
        rows.push(rowObj);
      }
    }

    results.push({
      sheetName,
      headers,
      rows,
      totalRows: rows.length,
    });
  }

  return results;
}

/**
 * Parse Excel sheet rows into structured ParsedQuestion items.
 */
export function parseExcelQuestions(
  rows: Record<string, string>[],
  columnMapping?: Record<string, string>,
  sourceFileName = 'excel_import.xlsx'
): ParseOutcome {
  const parsed: ParsedQuestion[] = [];
  let valid = 0;
  let flagged = 0;
  let errors = 0;

  // Standard or mapped field lookups
  const getField = (row: Record<string, string>, fieldKey: string, fallbacks: string[]): string => {
    if (columnMapping && columnMapping[fieldKey] && row[columnMapping[fieldKey]] !== undefined) {
      return row[columnMapping[fieldKey]].trim();
    }
    for (const key of Object.keys(row)) {
      const normalized = key.toLowerCase().replace(/[\s-_]+/g, '');
      for (const fb of fallbacks) {
        if (normalized === fb.toLowerCase().replace(/[\s-_]+/g, '')) {
          return row[key].trim();
        }
      }
    }
    return '';
  };

  rows.forEach((row, index) => {
    const rowNum = index + 1;
    const stem = getField(row, 'stem', ['stem', 'question', 'question_text', 'question text', 'prompt']);
    const optionA = getField(row, 'optionA', ['option_a', 'option a', 'a', 'choice_a', 'choice a', 'opt_a']);
    const optionB = getField(row, 'optionB', ['option_b', 'option b', 'b', 'choice_b', 'choice b', 'opt_b']);
    const optionC = getField(row, 'optionC', ['option_c', 'option c', 'c', 'choice_c', 'choice c', 'opt_c']);
    const optionD = getField(row, 'optionD', ['option_d', 'option d', 'd', 'choice_d', 'choice d', 'opt_d']);
    const rawAnswer = getField(row, 'correctAnswer', ['correct_answer', 'correct answer', 'answer', 'correct_option', 'correct option', 'ans', 'key']);
    const rationale = getField(row, 'rationale', ['rationale', 'explanation', 'expl', 'reason', 'justification']);
    const domain = getField(row, 'domain', ['domain', 'domain_number', 'domain_id', 'domain code', 'chapter']) || '1';
    const topic = getField(row, 'topic', ['topic', 'topic_code', 'topic_id', 'subtopic']) || '';
    const difficulty = getField(row, 'difficulty', ['difficulty', 'level', 'diff']) || 'medium';

    // Normalize correct answer to A, B, C, D
    let correctAnswer = rawAnswer.toUpperCase();
    if (correctAnswer.includes('OPTION 1') || correctAnswer === '1') correctAnswer = 'A';
    else if (correctAnswer.includes('OPTION 2') || correctAnswer === '2') correctAnswer = 'B';
    else if (correctAnswer.includes('OPTION 3') || correctAnswer === '3') correctAnswer = 'C';
    else if (correctAnswer.includes('OPTION 4') || correctAnswer === '4') correctAnswer = 'D';
    else if (correctAnswer.length > 1) {
      const firstChar = correctAnswer.charAt(0);
      if (['A', 'B', 'C', 'D'].includes(firstChar)) {
        correctAnswer = firstChar;
      }
    }

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

    const isVerified = Boolean(rationale && rationale.length > 20 && correctAnswer);

    parsed.push({
      rowNumber: rowNum,
      externalId: `XLS-${rowNum}`,
      stem,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer: ['A', 'B', 'C', 'D'].includes(correctAnswer) ? correctAnswer : 'A',
      rationale: rationale || `Extracted from ${sourceFileName}: Correct option is ${correctAnswer}.`,
      domain,
      topic,
      difficulty,
      sourceReference: sourceFileName,
      confidence: isVerified ? 'verified' : 'unverified',
      validationErrors: validation.errors.map((e) => e.message),
      answerSources: [
        {
          source: 'answer_key',
          answer: correctAnswer,
          confidence: isVerified ? 0.95 : 0.7,
        },
      ],
    });
  });

  return {
    questions: parsed,
    validCount: valid,
    flaggedCount: flagged,
    errorsCount: errors,
    totalRows: rows.length,
  };
}
