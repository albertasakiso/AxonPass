/* ===================================================================
   APILIGU LEARNING PASS — Import Pipeline Types
   =================================================================== */

export interface ImportJob {
  id: string;
  filename: string;
  fileType: 'csv' | 'json' | 'docx' | 'xlsx';
  fileSize: number;
  status: 'uploading' | 'parsing' | 'mapping' | 'validating' | 'review' | 'publishing' | 'published' | 'failed';
  progress: number; // 0-100
  totalRows: number;
  parsedRows: number;
  validRows: number;
  flaggedRows: number;
  errorRows: number;
  parserVersion: string;
  errors: ImportError[];
  warnings: ImportWarning[];
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ImportWarning {
  row: number;
  type: 'possible_duplicate' | 'answer_conflict' | 'missing_rationale' | 'low_confidence';
  message: string;
  details: string;
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  isRequired: boolean;
  transform?: 'uppercase' | 'trim' | 'strip_html';
}

export interface ParsedQuestion {
  rowNumber: number;
  externalId: string;
  stem: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  rationale: string;
  domain?: string;
  topic?: string;
  difficulty?: string;
  tags?: string[];
  sourceReference?: string;
  confidence: 'verified' | 'unverified';
  validationErrors: string[];
  duplicateOf?: string;
  answerSources: AnswerSource[];
}

export interface AnswerSource {
  source: 'inline' | 'answer_key' | 'rationale' | 'manual';
  answer: string;
  confidence: number; // 0-1
}

export interface DuplicateCluster {
  id: string;
  questions: ParsedQuestion[];
  similarityScore: number;
  resolution: 'pending' | 'keep_first' | 'keep_best' | 'merge' | 'keep_all';
}

export interface ImportTemplate {
  name: string;
  description: string;
  requiredColumns: string[];
  optionalColumns: string[];
  sampleData: Record<string, string>[];
}

// Canonical CSV templates
export const QUESTIONS_TEMPLATE: ImportTemplate = {
  name: 'questions.csv',
  description: 'Question stems and options',
  requiredColumns: ['external_id', 'stem', 'option_a', 'option_b', 'option_c', 'option_d'],
  optionalColumns: ['domain_code', 'topic_code', 'difficulty', 'tags', 'source_reference'],
  sampleData: [
    {
      external_id: 'D1-Q001',
      stem: 'Which of the following defines mandatory requirements for IS audit?',
      option_a: 'The IT Audit Framework (ITAF)',
      option_b: 'ISACA IS Audit and Assurance Guidelines',
      option_c: 'ISACA Code of Professional Ethics',
      option_d: 'ISACA IS Audit and Assurance Standards',
      domain_code: '1',
      difficulty: 'medium',
    },
  ],
};

export const ANSWERS_TEMPLATE: ImportTemplate = {
  name: 'answers.csv',
  description: 'Answer key and rationales',
  requiredColumns: ['external_id', 'correct_option'],
  optionalColumns: ['rationale', 'reference_locator'],
  sampleData: [
    {
      external_id: 'D1-Q001',
      correct_option: 'D',
      rationale: 'ISACA IS Audit and Assurance Standards define mandatory requirements...',
    },
  ],
};
