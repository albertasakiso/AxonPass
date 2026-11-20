/* ===================================================================
   ANOXPASS — Pure TypeScript FSRS v4.5 Spaced-Repetition Scheduler
   Free Spaced Repetition Scheduler (100% open-source algorithm).
   =================================================================== */

import type { FSRSCard, FSRSRating, FSRSState } from '../types/academy';

// Default FSRS v4.5 weights (w0..w18)
const W = [
  0.40255, 1.18385, 3.173, 15.69105,
  7.1949, 0.5345, 1.4604, 0.0046,
  1.54575, 0.1192, 1.01925, 1.9395,
  0.11, 0.29605, 2.2698, 0.2315,
  2.9898, 0.51655, 0.6621,
] as const;

const REQUEST_RETENTION = 0.9;
const MAXIMUM_INTERVAL = 36500; // 100 years in days
const FACTOR = 19 / 81;
const DECAY = -0.5;

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

function daysBetween(fromIso: string | undefined, toDate: Date): number {
  if (!fromIso) return 0;
  const diffMs = toDate.getTime() - new Date(fromIso).getTime();
  return Math.max(0, diffMs / (1000 * 60 * 60 * 24));
}

function addDays(date: Date, days: number): string {
  const next = new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  return next.toISOString();
}

function initStability(rating: FSRSRating): number {
  return Math.max(0.1, W[rating - 1]);
}

function initDifficulty(rating: FSRSRating): number {
  return clamp(W[4] - Math.exp(W[5] * (rating - 1)) + 1, 1, 10);
}

function nextDifficulty(d: number, rating: FSRSRating): number {
  const deltaD = -W[6] * (rating - 3);
  const nextD = d + deltaD * ((10 - d) / 9);
  // Mean reversion toward initial difficulty for rating=4
  const meanReverted = W[7] * initDifficulty(4) + (1 - W[7]) * nextD;
  return clamp(meanReverted, 1, 10);
}

/**
 * Compute current memory retrievability R(t, S) in [0, 1].
 */
export function getRetrievability(card: FSRSCard, now: Date = new Date()): number {
  if (card.state === 'new' || card.stability <= 0) return 0;
  const elapsed = daysBetween(card.lastReview, now);
  return Math.pow(1 + FACTOR * (elapsed / card.stability), DECAY);
}

function nextInterval(stability: number): number {
  const interval = (stability / FACTOR) * (Math.pow(REQUEST_RETENTION, 1 / DECAY) - 1);
  return Math.min(Math.max(Math.round(interval), 1), MAXIMUM_INTERVAL);
}

function nextRecallStability(d: number, s: number, r: number, rating: FSRSRating): number {
  const hardPenalty = rating === 2 ? W[15] : 1;
  const easyBonus = rating === 4 ? W[16] : 1;
  const nextS =
    s *
    (1 +
      Math.exp(W[8]) *
        (11 - d) *
        Math.pow(s, -W[9]) *
        (Math.exp((1 - r) * W[10]) - 1) *
        hardPenalty *
        easyBonus);
  return Math.max(0.1, Number(nextS.toFixed(4)));
}

function nextForgetStability(d: number, s: number, r: number): number {
  const nextS =
    W[11] *
    Math.pow(d, -W[12]) *
    (Math.pow(s + 1, W[13]) - 1) *
    Math.exp((1 - r) * W[14]);
  return Math.max(0.1, Math.min(s, Number(nextS.toFixed(4))));
}

/**
 * Create a brand-new FSRS card ready for immediate review.
 */
export function createNewFSRSCard(params: {
  id: string;
  sourceType: FSRSCard['sourceType'];
  sourceId: string;
  front: string;
  back: string;
  tags?: string[];
  now?: Date;
}): FSRSCard {
  const now = params.now ?? new Date();
  return {
    id: params.id,
    sourceType: params.sourceType,
    sourceId: params.sourceId,
    front: params.front,
    back: params.back,
    tags: params.tags ?? [],
    due: now.toISOString(),
    stability: 0,
    difficulty: 5,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    state: 'new',
  };
}

/**
 * Schedule an FSRSCard given a user rating:
 * 1 = Again, 2 = Hard, 3 = Good, 4 = Easy.
 */
export function scheduleCard(
  card: FSRSCard,
  rating: FSRSRating,
  now: Date = new Date()
): FSRSCard {
  const elapsedDays = Math.round(daysBetween(card.lastReview, now));
  let stability = card.stability;
  let difficulty = card.difficulty;
  let scheduledDays = 0;
  let state: FSRSState = card.state;
  let lapses = card.lapses;
  const reps = card.reps + 1;

  if (card.state === 'new') {
    stability = initStability(rating);
    difficulty = initDifficulty(rating);
    if (rating === 1) {
      state = 'learning';
      scheduledDays = 0;
    } else if (rating === 2) {
      state = 'learning';
      scheduledDays = 1;
    } else if (rating === 3) {
      state = 'review';
      scheduledDays = nextInterval(stability);
    } else {
      state = 'review';
      scheduledDays = Math.max(nextInterval(stability), 4);
    }
  } else {
    const r = getRetrievability(card, now);
    difficulty = nextDifficulty(card.difficulty, rating);

    if (rating === 1) {
      lapses += 1;
      stability = nextForgetStability(difficulty, Math.max(card.stability, 0.1), r);
      state = 'relearning';
      scheduledDays = 0;
    } else {
      stability = nextRecallStability(difficulty, Math.max(card.stability, 0.1), r, rating);
      state = 'review';
      scheduledDays = nextInterval(stability);
    }
  }

  // For 'Again' (scheduledDays === 0), review again in 10 minutes
  const due =
    scheduledDays === 0
      ? new Date(now.getTime() + 10 * 60 * 1000).toISOString()
      : addDays(now, scheduledDays);

  return {
    ...card,
    stability: Number(stability.toFixed(4)),
    difficulty: Number(difficulty.toFixed(4)),
    elapsedDays,
    scheduledDays,
    reps,
    lapses,
    state,
    lastReview: now.toISOString(),
    due,
  };
}

/**
 * Return all cards due on or before `now`, ordered oldest-due first.
 */
export function getDueCards(cards: FSRSCard[], now: Date = new Date()): FSRSCard[] {
  const nowMs = now.getTime();
  return cards
    .filter((c) => new Date(c.due).getTime() <= nowMs)
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
}
