/* ===================================================================
   APILIGU LEARNING PASS — Database Types
   Maps 1:1 to Supabase tables and Dexie.js local schema
   =================================================================== */

export interface Certification {
  id: string;
  slug: string;
  code: string | null;                    // v3 §6.2 — e.g. 'CISA', 'CISM'
  body: string | null;                    // v3 §6.2 — e.g. 'ISACA', 'ISC2'
  name: string;
  version: string;
  publisher: string;
  format: 'fixed_form' | 'adaptive_cat';  // v3 §7.2 — exam format
  total_domains: number;
  total_exam_questions: number;
  exam_duration_minutes: number;
  passing_score_percent: number;           // App's internal study threshold
  passing_scaled_score: number | null;     // v3 §6.2 — real exam: 450/800 for ISACA, 700/1000 for CISSP
  scaled_score_min: number | null;         // v3 §6.2 — 200 for ISACA, 0 for ISC2
  scaled_score_max: number | null;         // v3 §6.2 — 800 for ISACA, 1000 for ISC2
  study_mastery_threshold_pct: number | null; // v3 §6.2 — separate from passing_scaled_score
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Domain {
  id: string;
  certification_id: string;
  domain_number: number;
  code: string | null;                     // v3 §6.2 — e.g. '1', '2'
  name: string;
  exam_weight_percent: number;
  approx_exam_questions: number;
  part_a_title: string | null;
  part_b_title: string | null;
  learning_objectives: string | null;
  suggested_resources: string | null;
  sort_order: number;
  created_at: string;
}

export interface Topic {
  id: string;
  domain_id: string;
  topic_code: string;
  name: string;
  part: 'A' | 'B';
  content_summary: string | null;
  sort_order: number;
  created_at: string;
}

export interface Subtopic {
  id: string;
  topic_id: string;
  subtopic_code: string;
  name: string;
  content_body: string | null;
  key_terms: string[];
  exam_tips?: string | null;
  estimated_read_minutes?: number;
  learning_objectives?: string | null;
  sort_order: number;
  created_at: string;
}

export interface Question {
  id: string;
  certification_id: string;
  domain_id: string;
  topic_id: string | null;
  subtopic_id: string | null;
  question_number: number;
  question_type: 'mcq' | 'scenario' | 'case_study';
  stem: string;
  scenario_text: string | null;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  rationale: string;
  incorrect_rationale_a: string | null;
  incorrect_rationale_b: string | null;
  incorrect_rationale_c: string | null;
  incorrect_rationale_d: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  task_statement: string | null;
  tags: string[];
  source_reference: string | null;
  source_confidence: 'verified' | 'unverified';
  content_hash: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskStatement {
  id: string;
  certification_id: string;
  task_code: string;
  description: string;
  related_domains: number[];
  created_at: string;
}

export interface CaseStudy {
  id: string;
  domain_id: string;
  title: string;
  scenario_text: string;
  sort_order: number;
  created_at: string;
}

export interface CaseStudyQuestion {
  id: string;
  case_study_id: string;
  question_number: number;
  stem: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  rationale: string | null;
  sort_order: number;
  created_at: string;
}

export interface UserProfile {
  id: string; // = auth.users.id
  email: string;
  full_name: string | null;
  selected_certification_id: string | null;
  daily_study_goal_minutes: number;
  timezone: string;
  onboarding_state: 'pending' | 'in_progress' | 'completed';
  role: 'owner' | 'admin' | 'learner' | 'student' | 'user';
  created_at: string;
  last_active_at: string | null;
  target_exam_date?: string | null;
  streak_days?: number;
  avatar_url?: string | null;
  readiness_score?: number;
  total_study_minutes?: number;
}

export interface UserProgress {
  id: string;
  user_id: string;
  question_id: string;
  domain_id: string;
  topic_id: string | null;
  box_level: number;          // 0-4 (Leitner box)
  consecutive_correct: number;
  times_seen: number;
  times_correct: number;
  last_seen_at: string | null;
  next_review_at: string | null;
  updated_at: string;
}

export interface QuizSession {
  id: string;
  user_id: string;
  certification_id: string;
  domain_id: string | null;
  topic_id: string | null;
  session_type: SessionType;
  total_questions: number;
  time_limit_seconds: number;
  started_at: string;
  completed_at: string | null;
  total_correct: number | null;
  total_incorrect: number | null;
  total_skipped: number | null;
  score_percent: number | null;
  passed: boolean | null;
  status: 'in_progress' | 'completed' | 'abandoned';
  created_at: string;
}

export type SessionType =
  | 'practice'
  | 'quick_check'
  | 'module_check'
  | 'domain_practice'
  | 'domain_drill'
  | 'topic_drill'
  | 'exam_simulation'
  | 'exam_sim'
  | 'endurance_drill'
  | 'repair_set'
  | 'adaptive_review';

export interface SessionAnswer {
  id: string;
  quiz_session_id: string;
  question_id: string;
  selected_answer: 'A' | 'B' | 'C' | 'D' | null;
  is_correct: boolean | null;
  time_taken_seconds: number | null;
  is_flagged: boolean;
  status: 'unseen' | 'answered' | 'flagged' | 'skipped';
  answered_at: string | null;
  client_event_id: string; // UUID for idempotent sync
}

export interface StudyMaterial {
  id: string;
  certification_id: string;
  domain_id: string;
  topic_id: string | null;
  title: string;
  content_type: 'text' | 'diagram' | 'table' | 'glossary';
  content_body: string;
  document_title?: string | null;
  edition?: string | null;
  chapter_number?: number | null;
  section_number?: string | null;
  page_start?: number | null;
  page_end?: number | null;
  estimated_read_minutes?: number | null;
  file_reference?: string | null;
  key_takeaways?: string | null;
  exam_tips?: string | null;
  sort_order: number;
  created_at: string;
}

export interface GlossaryTerm {
  id: string;
  certification_id: string;
  term: string;
  acronym: string | null;
  definition: string;
  category?: string | null;
  domain_id: string | null;
  created_at: string;
}

export interface ImportBatch {
  id: string;
  user_id: string;
  filename: string;
  file_type: 'csv' | 'json' | 'docx' | 'xlsx';
  imported_at: string;
  parser_version: string;
  questions_found: number;
  questions_flagged: number;
  status: 'pending' | 'parsing' | 'review' | 'published' | 'failed';
  created_at: string;
}

export interface ImportFlag {
  id: string;
  question_id: string | null;
  batch_id: string;
  flag_type: 'answer_source_conflict' | 'possible_duplicate' | 'missing_rationale' | 'parse_error' | 'validation_error';
  detail_text: string;
  resolved: boolean;
  resolved_at: string | null;
  created_at: string;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  type: 'study_reminder' | 'break_reminder' | 'review_due' | 'goal_reminder';
  enabled: boolean;
  schedule_time: string | null;  // HH:mm format
  schedule_days: number[];       // 0=Sun, 1=Mon, ..., 6=Sat
  created_at: string;
}

export interface AuditEvent {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface NotificationLog {
  id: string;
  user_id: string;
  type: string;
  title: string | null;
  body: string | null;
  scheduled_at: string | null;
  delivered_at: string | null;
  dismissed_at: string | null;
  created_at: string;
}

export interface AppConfig {
  key: string;
  value: unknown;
  description: string | null;
  updated_at: string;
}

export interface DocumentIngestionRecord {
  id: string;
  file_name: string;
  file_path: string;
  file_size_bytes: number;
  file_format: string;
  certification_slug: string;
  certification_name: string;
  ingestion_status: 'ingested_and_indexed' | 'distilled_to_knowledge_graph' | 'vector_embedded';
  extracted_tokens_count: number;
  extracted_chunks_count: number;
  mapped_domains: number[];
  mapped_topics_count: number;
  associated_questions_count: number;
  cloud_storage_bytes: number;
  cloud_storage_status: string;
  public_url?: string;
  storage_path?: string;
  ingestion_timestamp: string;
  verification_hash: string;
  created_at: string;
}

