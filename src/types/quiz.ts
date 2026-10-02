/* ===================================================================
   APILIGU LEARNING PASS — Quiz & Session Types
   =================================================================== */

import type { Question, SessionAnswer } from './database';

export type AnswerOption = 'A' | 'B' | 'C' | 'D';

export interface QuizConfig {
  sessionType: import('./database').SessionType;
  certificationId: string;
  domainId?: string;
  topicId?: string;
  questionCount: number;
  timeLimitSeconds: number;
  feedbackPolicy: 'immediate' | 'delayed' | 'after_submit';
  shuffleOptions: boolean;
  allowFlagging: boolean;
  allowSkipping: boolean;
  allowReview: boolean;
  allowPause: boolean;
}

export interface ActiveQuizState {
  sessionId: string;
  config: QuizConfig;
  questions: Question[];
  answers: Map<string, SessionAnswer>;
  currentIndex: number;
  timeRemainingSeconds: number;
  startedAt: number;
  isPaused: boolean;
  isSubmitted: boolean;
  flaggedQuestionIds: Set<string>;
}

export interface QuizResult {
  sessionId: string;
  totalQuestions: number;
  totalAnswered: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalSkipped: number;
  scorePercent: number;
  passed: boolean;
  timeTakenSeconds: number;
  timeAllocatedSeconds: number;
  domainBreakdown: DomainScore[];
  weakConcepts: WeakConcept[];
}

export interface DomainScore {
  domainId: string;
  domainName: string;
  domainNumber: number;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  avgTimeSeconds: number;
}

export interface WeakConcept {
  topicId: string;
  topicName: string;
  domainId: string;
  incorrectCount: number;
  totalAttempts: number;
  accuracy: number;
  suggestedAction: 'relearn' | 'repair_set' | 'retry_check';
}

export interface ExamProfile {
  id: string;
  name: string;
  description: string;
  sessionType: import('./database').SessionType;
  questionCount: number;
  durationMinutes: number;
  compressedDurationMinutes: number;
  feedbackPolicy: 'immediate' | 'delayed';
  domainWeights?: Record<string, number>;
  isCustom: boolean;
}

export interface TimerState {
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  warningThresholdPercent: number;  // e.g. 25% remaining
  criticalThresholdPercent: number; // e.g. 10% remaining
}
