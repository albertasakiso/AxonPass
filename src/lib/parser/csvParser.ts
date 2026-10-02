/* ===================================================================
   APILIGU LEARNING PASS — CSV/JSON Question Parser
   Client-side parsing with Papa Parse and schema validation.
   =================================================================== */

import Papa from 'papaparse';
import type { ParsedQuestion } from '../../types';
import { validateQuestion } from './validator';

export interface ParseOutcome {
  questions: ParsedQuestion[];
  validCount: number;
  flaggedCount: number;
  errorsCount: number;
  totalRows: number;
}

/**
 * Parse CSV string into structured questions.
 */
export function parseCSVQuestions(csvContent: string): Promise<ParseOutcome> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/[\s-]+/g, '_'),
      complete: (results) => {
        const rows = results.data as Record<string, string>[];
        const parsed: ParsedQuestion[] = [];
        let valid = 0;
        let flagged = 0;
        let errors = 0;

        rows.forEach((row, index) => {
          const rowNum = index + 1;
          const externalId = row['external_id'] || row['id'] || `Q-${rowNum}`;
          const stem = row['stem'] || row['question'] || row['question_text'] || '';
          const optionA = row['option_a'] || row['a'] || '';
          const optionB = row['option_b'] || row['b'] || '';
          const optionC = row['option_c'] || row['c'] || '';
          const optionD = row['option_d'] || row['d'] || '';
          const correctAnswer = (row['correct_answer'] || row['answer'] || row['correct_option'] || '').toUpperCase();
          const rationale = row['rationale'] || row['explanation'] || '';
          const domain = row['domain'] || row['domain_code'] || '1';
          const topic = row['topic'] || row['topic_code'] || '';
          const difficulty = (row['difficulty'] || 'medium').toLowerCase();

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
            valid += 1;
          } else {
            errors += 1;
          }

          if (validation.warnings.length > 0) {
            flagged += 1;
          }

          parsed.push({
            rowNumber: rowNum,
            externalId,
            stem,
            optionA,
            optionB,
            optionC,
            optionD,
            correctAnswer,
            rationale,
            domain,
            topic,
            difficulty,
            tags: row['tags'] ? row['tags'].split(',').map((t) => t.trim()) : [],
            sourceReference: row['source_reference'] || row['reference'] || '',
            confidence: 'verified',
            validationErrors: validation.errors.map((e) => e.message),
            answerSources: [
              {
                source: 'manual',
                answer: correctAnswer,
                confidence: 1.0,
              },
            ],
          });
        });

        resolve({
          questions: parsed,
          validCount: valid,
          flaggedCount: flagged,
          errorsCount: errors,
          totalRows: rows.length,
        });
      },
      error: (err: Error) => {
        reject(err);
      },
    });
  });
}

/**
 * Parse JSON array into structured questions.
 */
export function parseJSONQuestions(jsonContent: string): ParseOutcome {
  const data = JSON.parse(jsonContent);
  const rows = Array.isArray(data) ? data : data.questions || [];

  const parsed: ParsedQuestion[] = [];
  let valid = 0;
  let flagged = 0;
  let errors = 0;

  rows.forEach((item: any, index: number) => {
    const rowNum = index + 1;
    const externalId = item.externalId || item.id || `Q-${rowNum}`;
    const stem = item.stem || item.question || '';
    const optionA = item.optionA || item.options?.A || item.option_a || '';
    const optionB = item.optionB || item.options?.B || item.option_b || '';
    const optionC = item.optionC || item.options?.C || item.option_c || '';
    const optionD = item.optionD || item.options?.D || item.option_d || '';
    const correctAnswer = (item.correctAnswer || item.answer || item.correct_answer || '').toUpperCase();
    const rationale = item.rationale || item.explanation || '';

    const validation = validateQuestion(
      { stem, optionA, optionB, optionC, optionD, correctAnswer, rationale },
      rowNum
    );

    if (validation.isValid) valid += 1;
    else errors += 1;
    if (validation.warnings.length > 0) flagged += 1;

    parsed.push({
      rowNumber: rowNum,
      externalId,
      stem,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      rationale,
      domain: item.domain || '1',
      topic: item.topic || '',
      difficulty: item.difficulty || 'medium',
      tags: item.tags || [],
      sourceReference: item.sourceReference || '',
      confidence: 'verified',
      validationErrors: validation.errors.map((e) => e.message),
      answerSources: [
        {
          source: 'manual',
          answer: correctAnswer,
          confidence: 1.0,
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
