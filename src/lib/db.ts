/* ===================================================================
   APILIGU LEARNING PASS — Dexie.js Local Database
   Offline-first IndexedDB schema mirroring server tables
   =================================================================== */

import Dexie, { type Table } from 'dexie';
import type {
  Certification,
  Domain,
  Topic,
  Subtopic,
  Question,
  CaseStudy,
  CaseStudyQuestion,
  UserProgress,
  QuizSession,
  SessionAnswer,
  StudyMaterial,
  GlossaryTerm,
  NotificationLog,
  SyncQueueItem,
  DocumentIngestionRecord,
} from '../types';

export class LearningPassDB extends Dexie {
  certifications!: Table<Certification>;
  domains!: Table<Domain>;
  topics!: Table<Topic>;
  subtopics!: Table<Subtopic>;
  questions!: Table<Question>;
  caseStudies!: Table<CaseStudy>;
  caseStudyQuestions!: Table<CaseStudyQuestion>;
  userProgress!: Table<UserProgress>;
  quizSessions!: Table<QuizSession>;
  sessionAnswers!: Table<SessionAnswer>;
  studyMaterials!: Table<StudyMaterial>;
  glossaryTerms!: Table<GlossaryTerm>;
  notificationsLog!: Table<NotificationLog>;
  documentIngestionLedger!: Table<DocumentIngestionRecord>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super('LearningPassDB');

    this.version(1).stores({
      // Content tables (pulled from server)
      certifications: 'id, slug',
      domains: 'id, certification_id, domain_number, sort_order',
      topics: 'id, domain_id, topic_code, sort_order',
      subtopics: 'id, topic_id, subtopic_code, sort_order',
      questions: 'id, certification_id, domain_id, topic_id, question_number, difficulty, is_active, content_hash',

      // Learner state (bidirectional sync)
      userProgress: 'id, user_id, question_id, domain_id, box_level, next_review_at',
      quizSessions: 'id, user_id, certification_id, domain_id, session_type, status, created_at',
      sessionAnswers: 'id, quiz_session_id, question_id, client_event_id, status',

      // Content (pulled from server)
      studyMaterials: 'id, certification_id, domain_id, topic_id, sort_order',
      glossaryTerms: 'id, certification_id, term',

      // Sync queue (local only, push to server)
      syncQueue: 'id, entity_type, entity_id, client_event_id, status, created_at',
    });

    // v3 schema additions: case studies, case study questions, notifications log
    this.version(2).stores({
      caseStudies: 'id, domain_id, sort_order',
      caseStudyQuestions: 'id, case_study_id, question_number, sort_order',
      notificationsLog: 'id, user_id, type, scheduled_at',
    });

    // v4 schema additions: document ingestion ledger
    this.version(3).stores({
      documentIngestionLedger: 'id, certification_slug, file_format, ingestion_status',
    });
  }
}

export const db = new LearningPassDB();

/**
 * Add an item to the sync queue for eventual server push.
 */
export async function enqueueSync(
  entityType: string,
  entityId: string,
  action: 'insert' | 'update' | 'delete',
  payload: Record<string, unknown>,
  clientEventId: string
): Promise<void> {
  await db.syncQueue.put({
    id: clientEventId,
    entity_type: entityType,
    entity_id: entityId,
    action,
    payload,
    client_event_id: clientEventId,
    created_at: new Date().toISOString(),
    retry_count: 0,
    status: 'pending',
  });
}

/**
 * Get all pending items in creation order.
 */
export async function getPendingSyncItems(): Promise<SyncQueueItem[]> {
  return db.syncQueue
    .where('status')
    .equals('pending')
    .sortBy('created_at');
}

/**
 * Mark a sync item as completed and remove it.
 */
export async function completeSyncItem(id: string): Promise<void> {
  await db.syncQueue.delete(id);
}

/**
 * Mark a sync item as failed and increment retry count.
 */
export async function failSyncItem(id: string, error: string): Promise<void> {
  const item = await db.syncQueue.get(id);
  if (item) {
    await db.syncQueue.update(id, {
      retry_count: item.retry_count + 1,
      status: item.retry_count >= 5 ? 'error' : 'pending',
      error_message: error,
    });
  }
}
