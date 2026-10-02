/* ===================================================================
   APILIGU LEARNING PASS — Template Generator & Exporter
   Generates native Excel (.xlsx) and CSV templates, and exports
   question banks into .xlsx, .csv, and .json formats.
   =================================================================== */

import * as XLSX from 'xlsx';
import type { Question } from '../../types';

/**
 * Generate and trigger download for a clean, styled Excel (.xlsx) Question Template.
 */
export function downloadExcelQuestionTemplate() {
  const sampleData = [
    {
      'Question Stem': 'What is the primary objective of an IS Audit Charter?',
      'Option A': 'To outline the detailed daily audit work schedule',
      'Option B': 'To establish the authority, scope, and responsibility of the audit function',
      'Option C': 'To specify the exact CAATs software versions to be used',
      'Option D': 'To document individual performance metrics for staff auditors',
      'Correct Answer': 'B',
      'Rationale / Explanation': 'The IS Audit Charter is the highest-level governance document that establishes the formal authority, scope, and responsibility of the audit function and must be approved by the Board or Audit Committee.',
      'Domain': '1',
      'Difficulty': 'medium',
      'Tags': 'governance, charter, authority',
    },
    {
      'Question Stem': 'In a quantitative risk analysis, an asset has a value of $400,000. An exploit has an Exposure Factor (EF) of 25% and an Annualized Rate of Occurrence (ARO) of 0.5. What is the Annualized Loss Expectancy (ALE)?',
      'Option A': '$200,000',
      'Option B': '$100,000',
      'Option C': '$50,000',
      'Option D': '$25,000',
      'Correct Answer': 'C',
      'Rationale / Explanation': 'SLE = Asset Value ($400,000) * EF (0.25) = $100,000. ALE = SLE ($100,000) * ARO (0.5) = $50,000 per year.',
      'Domain': '2',
      'Difficulty': 'hard',
      'Tags': 'risk-analysis, formulas, ALE',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 60 }, // Stem
    { wch: 35 }, // Option A
    { wch: 35 }, // Option B
    { wch: 35 }, // Option C
    { wch: 35 }, // Option D
    { wch: 15 }, // Correct Answer
    { wch: 60 }, // Rationale
    { wch: 10 }, // Domain
    { wch: 12 }, // Difficulty
    { wch: 25 }, // Tags
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Question_Template');

  XLSX.writeFile(workbook, 'ApiliguPass_Question_Import_Template.xlsx');
}

/**
 * Export questions array to a clean, formatted Excel (.xlsx) file.
 */
export function exportQuestionsToExcel(questions: Question[], certName: string) {
  const exportRows = questions.map((q, idx) => ({
    'ID': q.id,
    'Number': q.question_number || idx + 1,
    'Question Stem': q.stem,
    'Option A': q.option_a,
    'Option B': q.option_b,
    'Option C': q.option_c,
    'Option D': q.option_d,
    'Correct Answer': q.correct_answer,
    'Rationale': q.rationale,
    'Confidence': q.source_confidence,
    'Difficulty': q.difficulty,
    'Reference': q.source_reference || '',
    'Created At': q.created_at || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  worksheet['!cols'] = [
    { wch: 38 },
    { wch: 8 },
    { wch: 60 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 15 },
    { wch: 50 },
    { wch: 15 },
    { wch: 12 },
    { wch: 30 },
    { wch: 24 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');

  XLSX.writeFile(workbook, `${certName.toLowerCase().replace(/\s+/g, '_')}_questions_export.xlsx`);
}

/**
 * Export questions array to a clean CSV file.
 */
export function exportQuestionsToCsv(questions: Question[], filename: string) {
  const headers = [
    'question_number',
    'stem',
    'option_a',
    'option_b',
    'option_c',
    'option_d',
    'correct_answer',
    'rationale',
    'confidence',
    'difficulty',
    'source_reference'
  ];

  const rows = questions.map((q, idx) => [
    q.question_number || idx + 1,
    `"${(q.stem || '').replace(/"/g, '""')}"`,
    `"${(q.option_a || '').replace(/"/g, '""')}"`,
    `"${(q.option_b || '').replace(/"/g, '""')}"`,
    `"${(q.option_c || '').replace(/"/g, '""')}"`,
    `"${(q.option_d || '').replace(/"/g, '""')}"`,
    q.correct_answer,
    `"${(q.rationale || '').replace(/"/g, '""')}"`,
    q.source_confidence,
    q.difficulty,
    `"${(q.source_reference || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
