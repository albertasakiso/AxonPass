/* ===================================================================
   APILIGU LEARNING PASS — 5-Box Leitner Spaced Repetition Engine
   
   Deterministic, explainable, offline-compatible.
   No paid AI dependency.
   
   Calendar-day intervals (v3 §7.4):
   Box 0: New or just missed          → Immediately (next session)
   Box 1: 1 correct, not consistent   → +1 day
   Box 2: 2 consecutive correct       → +3 days
   Box 3: 3 consecutive correct       → +7 days (mastery threshold met)
   Box 4: Sustained mastery (4+)      → +14–30 days (light-touch decay check)
   
   Incorrect answer → Reset to Box 0, consecutive_correct = 0
   =================================================================== */

import type { UserProgress } from '../types';

/** Review intervals in hours for each box level */
const BOX_INTERVALS_HOURS: Record<number, number> = {
  0: 0,       // Immediate
  1: 24,      // 1 day
  2: 72,      // 3 days
  3: 168,     // 7 days
  4: 720,     // 30 days
};

/** Default mastery threshold percentage */
const DEFAULT_MASTERY_THRESHOLD = 80;

/**
 * Advance a question one box after a correct answer.
 */
export function advanceBox(progress: UserProgress): Partial<UserProgress> {
  const newBox = Math.min(progress.box_level + 1, 4);
  const newConsecutive = progress.consecutive_correct + 1;
  const nextReview = calculateNextReview(newBox);

  return {
    box_level: newBox,
    consecutive_correct: newConsecutive,
    times_seen: progress.times_seen + 1,
    times_correct: progress.times_correct + 1,
    last_seen_at: new Date().toISOString(),
    next_review_at: nextReview,
  };
}

/**
 * Reset a question to Box 0 after an incorrect answer.
 */
export function resetBox(progress: UserProgress): Partial<UserProgress> {
  return {
    box_level: 0,
    consecutive_correct: 0,
    times_seen: progress.times_seen + 1,
    // times_correct stays the same
    last_seen_at: new Date().toISOString(),
    next_review_at: new Date().toISOString(), // Review immediately
  };
}

/**
 * Create initial progress for a never-seen question.
 */
export function createInitialProgress(
  userId: string,
  questionId: string,
  domainId: string,
  topicId: string | null
): Omit<UserProgress, 'id'> {
  return {
    user_id: userId,
    question_id: questionId,
    domain_id: domainId,
    topic_id: topicId,
    box_level: 0,
    consecutive_correct: 0,
    times_seen: 0,
    times_correct: 0,
    last_seen_at: null,
    next_review_at: null,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Calculate the next review timestamp based on box level.
 */
function calculateNextReview(boxLevel: number): string {
  const hours = BOX_INTERVALS_HOURS[boxLevel] || 0;
  const now = new Date();
  now.setHours(now.getHours() + hours);
  return now.toISOString();
}

/**
 * Check if a question is due for review.
 */
export function isDueForReview(progress: UserProgress): boolean {
  if (!progress.next_review_at) return true;
  return new Date() >= new Date(progress.next_review_at);
}

/**
 * Calculate mastery percentage for a set of progress items.
 * Mastery = percentage of items at Box 3 or above.
 */
export function calculateMastery(progressItems: UserProgress[]): number {
  if (progressItems.length === 0) return 0;
  const masteredCount = progressItems.filter(p => p.box_level >= 3).length;
  return Math.round((masteredCount / progressItems.length) * 100);
}

/**
 * Check if a domain/module meets the mastery threshold.
 */
export function isMastered(
  progressItems: UserProgress[],
  threshold: number = DEFAULT_MASTERY_THRESHOLD
): boolean {
  return calculateMastery(progressItems) >= threshold;
}

/**
 * Check if a domain is "exam ready" per v3 §7.4.
 * Stricter than isMastered(): returns true only if EVERY seen question
 * is at Box 3 or above (matching the v3 language: "every question the
 * learner has seen in it sits at Box 3 or above").
 */
export function isExamReady(progressItems: UserProgress[]): boolean {
  if (progressItems.length === 0) return false;
  const seenItems = progressItems.filter(p => p.times_seen > 0);
  if (seenItems.length === 0) return false;
  return seenItems.every(p => p.box_level >= 3);
}

/**
 * Calculate adaptive priority score for question selection.
 * Higher score = more urgently needs review.
 * 
 * Priority = miss_severity + overdue_weight + low_mastery_weight - recent_success_weight
 */
export function calculatePriority(progress: UserProgress): number {
  let priority = 0;

  // Miss severity: lower box = higher priority
  priority += (4 - progress.box_level) * 25;

  // Overdue weight
  if (progress.next_review_at) {
    const overdueDays = Math.max(
      0,
      (Date.now() - new Date(progress.next_review_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    priority += Math.min(overdueDays * 10, 50);
  }

  // Low mastery weight (never-seen items get highest priority)
  if (progress.times_seen === 0) {
    priority += 30;
  } else {
    const accuracy = progress.times_correct / progress.times_seen;
    priority += (1 - accuracy) * 40;
  }

  // Recent success dampens priority
  if (progress.consecutive_correct >= 3) {
    priority -= 20;
  }

  return Math.max(0, Math.round(priority));
}

/**
 * Sort questions by adaptive priority (highest first).
 */
export function sortByPriority(progressItems: UserProgress[]): UserProgress[] {
  return [...progressItems].sort(
    (a, b) => calculatePriority(b) - calculatePriority(a)
  );
}

/**
 * Get the mastery level label for a given percentage.
 */
export function getMasteryLabel(percentage: number): {
  label: string;
  color: string;
} {
  if (percentage >= 85) return { label: 'Mastered', color: 'var(--color-success)' };
  if (percentage >= 60) return { label: 'Proficient', color: 'var(--color-primary-light)' };
  if (percentage >= 25) return { label: 'Learning', color: 'var(--color-warning)' };
  return { label: 'Not Started', color: 'var(--color-ink-subtle)' };
}
