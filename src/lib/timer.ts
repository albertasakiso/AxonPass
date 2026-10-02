/* ===================================================================
   APILIGU LEARNING PASS — Timer Compression Engine
   
   Formula from v2 spec §7.3:
   allotted_time = (cert.duration_min ÷ cert.question_count) × session.question_count × 0.85
   
   Example: Full CISA (150Q / 240min):
   240 ÷ 150 × 150 × 0.85 = 204 minutes (3h 24m)
   Per-question: ~82 seconds (vs 96 real)
   =================================================================== */

const COMPRESSION_FACTOR = 0.85;

export interface TimerConfig {
  certDurationMinutes: number;
  certTotalQuestions: number;
  sessionQuestionCount: number;
  compressionFactor?: number;
}

/**
 * Calculate compressed time limit for a quiz session.
 * Returns time in seconds.
 */
export function calculateTimeLimit(config: TimerConfig): number {
  const factor = config.compressionFactor ?? COMPRESSION_FACTOR;
  const timePerQuestion = config.certDurationMinutes / config.certTotalQuestions;
  const totalMinutes = timePerQuestion * config.sessionQuestionCount * factor;
  return Math.round(totalMinutes * 60);
}

/**
 * Calculate per-question pacing in seconds.
 */
export function calculatePacePerQuestion(config: TimerConfig): number {
  const totalSeconds = calculateTimeLimit(config);
  return Math.round(totalSeconds / config.sessionQuestionCount);
}

/**
 * Format seconds into a human-readable timer string (HH:MM:SS or MM:SS).
 */
export function formatTimer(seconds: number): string {
  const isNegative = seconds < 0;
  const abs = Math.abs(Math.floor(seconds));
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;

  const prefix = isNegative ? '-' : '';

  if (h > 0) {
    return `${prefix}${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${prefix}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Format seconds into a human-readable duration (e.g., "3h 24m").
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}m`;
  return `${seconds}s`;
}

/**
 * Get the timer severity level based on remaining time.
 */
export function getTimerSeverity(
  remainingSeconds: number,
  totalSeconds: number
): 'normal' | 'warning' | 'critical' {
  const percentRemaining = (remainingSeconds / totalSeconds) * 100;
  if (percentRemaining <= 10) return 'critical';
  if (percentRemaining <= 25) return 'warning';
  return 'normal';
}

/**
 * Calculate pacing status (ahead, on_pace, behind).
 */
export function getPacingStatus(
  questionsAnswered: number,
  totalQuestions: number,
  elapsedSeconds: number,
  totalSeconds: number
): { status: 'ahead' | 'on_pace' | 'behind'; message: string } {
  if (totalQuestions === 0 || totalSeconds === 0) {
    return { status: 'on_pace', message: 'On pace' };
  }

  const expectedProgress = (elapsedSeconds / totalSeconds) * totalQuestions;
  const diff = questionsAnswered - expectedProgress;

  if (diff > 1) {
    return {
      status: 'ahead',
      message: `${Math.round(diff)} questions ahead of pace`,
    };
  } else if (diff < -1) {
    return {
      status: 'behind',
      message: `${Math.round(Math.abs(diff))} questions behind pace`,
    };
  }
  return { status: 'on_pace', message: 'On pace' };
}

/** Pre-computed CISA exam profiles */
export const CISA_PROFILES = {
  /** Official-like CISA simulation: 150Q / 204min compressed */
  examSimulation: {
    certDurationMinutes: 240,
    certTotalQuestions: 150,
    sessionQuestionCount: 150,
  },
  /** Endurance drill: 1000Q / 135min (8.1s per question) */
  enduranceDrill: {
    certDurationMinutes: 135,
    certTotalQuestions: 1000,
    sessionQuestionCount: 1000,
    compressionFactor: 1.0, // No compression — already custom timing
  },
  /** Quick check: 10Q */
  quickCheck: (count: number = 10) => ({
    certDurationMinutes: 240,
    certTotalQuestions: 150,
    sessionQuestionCount: count,
  }),
  /** Domain practice: 50Q per domain */
  domainPractice: (count: number = 50) => ({
    certDurationMinutes: 240,
    certTotalQuestions: 150,
    sessionQuestionCount: count,
  }),
};
