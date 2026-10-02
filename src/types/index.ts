/* ===================================================================
   APILIGU LEARNING PASS — Shared Types & Re-exports
   =================================================================== */

export type { 
  Certification,
  Domain,
  Topic,
  Subtopic,
  Question,
  TaskStatement,
  CaseStudy,
  CaseStudyQuestion,
  UserProfile,
  UserProgress,
  QuizSession,
  SessionType,
  SessionAnswer,
  StudyMaterial,
  GlossaryTerm,
  ImportBatch,
  ImportFlag,
  NotificationPreference,
  NotificationLog,
  AuditEvent,
  AppConfig,
  DocumentIngestionRecord,
} from './database';

export type {
  AnswerOption,
  QuizConfig,
  ActiveQuizState,
  QuizResult,
  DomainScore,
  WeakConcept,
  ExamProfile,
  TimerState,
} from './quiz';

export type {
  ImportJob,
  ImportError,
  ImportWarning,
  FieldMapping,
  ParsedQuestion,
  AnswerSource,
  DuplicateCluster,
  ImportTemplate,
} from './import';

export { QUESTIONS_TEMPLATE, ANSWERS_TEMPLATE } from './import';

// ──────────────────────────────────────────────
// Common utility types
// ──────────────────────────────────────────────

export type SyncStatus = 'synced' | 'pending' | 'conflict' | 'error';

export interface SyncQueueItem {
  id: string;
  entity_type: string;
  entity_id: string;
  action: 'insert' | 'update' | 'delete';
  payload: Record<string, unknown>;
  client_event_id: string;
  created_at: string;
  retry_count: number;
  status: SyncStatus;
  error_message?: string;
}

export interface MasteryLevel {
  label: string;
  threshold: number;
  color: string;
}

export const MASTERY_LEVELS: MasteryLevel[] = [
  { label: 'Not Started', threshold: 0, color: 'var(--color-ink-subtle)' },
  { label: 'Learning', threshold: 25, color: 'var(--color-warning)' },
  { label: 'Proficient', threshold: 60, color: 'var(--color-primary-light)' },
  { label: 'Mastered', threshold: 85, color: 'var(--color-success)' },
];

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', path: '/', icon: '🏠' },
  { id: 'learn', label: 'Learn', path: '/learn', icon: '📚' },
  { id: 'practice', label: 'Practice', path: '/practice', icon: '✍️' },
  { id: 'insights', label: 'Insights', path: '/insights', icon: '📊' },
  { id: 'admin', label: 'Admin', path: '/admin', icon: '⚙️' },
];
