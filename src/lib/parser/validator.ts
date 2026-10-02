/* ===================================================================
   APILIGU LEARNING PASS — Question Validation Engine
   Validates imported or manually entered questions against spec rules.
   =================================================================== */

import type { ParsedQuestion, ImportError } from '../../types';

export interface ValidationResult {
  isValid: boolean;
  errors: ImportError[];
  warnings: string[];
}

/**
 * Validate a question record according to ISACA CISA standard schema.
 */
export function validateQuestion(q: Partial<ParsedQuestion>, rowNumber: number): ValidationResult {
  const errors: ImportError[] = [];
  const warnings: string[] = [];

  // Stem check
  if (!q.stem || q.stem.trim().length < 10) {
    errors.push({
      row: rowNumber,
      field: 'stem',
      message: 'Question stem must be at least 10 characters long.',
      severity: 'error',
    });
  }

  // Options check
  const options = [q.optionA, q.optionB, q.optionC, q.optionD];
  const optionLabels = ['A', 'B', 'C', 'D'];

  options.forEach((opt, idx) => {
    if (!opt || opt.trim().length === 0) {
      errors.push({
        row: rowNumber,
        field: `option_${optionLabels[idx].toLowerCase()}`,
        message: `Option ${optionLabels[idx]} cannot be empty.`,
        severity: 'error',
      });
    }
  });

  // Duplicate options check
  const nonEmptyOpts = options.filter(Boolean).map(o => o?.trim().toLowerCase());
  const uniqueOpts = new Set(nonEmptyOpts);
  if (uniqueOpts.size < nonEmptyOpts.length) {
    errors.push({
      row: rowNumber,
      field: 'options',
      message: 'Options contain duplicate answers.',
      severity: 'error',
    });
  }

  // Correct answer check
  const validAnswers = ['A', 'B', 'C', 'D'];
  const formattedAns = q.correctAnswer?.trim().toUpperCase();
  if (!formattedAns || !validAnswers.includes(formattedAns)) {
    errors.push({
      row: rowNumber,
      field: 'correct_answer',
      message: 'Correct answer must be exactly one of A, B, C, or D.',
      severity: 'error',
    });
  }

  // Rationale check
  if (!q.rationale || q.rationale.trim().length < 5) {
    warnings.push('Question lacks a detailed rationale explanation.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
