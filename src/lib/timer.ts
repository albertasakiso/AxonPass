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

export interface OfficialExamProfile {
  certCode: string;
  totalQuestions: number;
  durationMinutes: number;
  passingScorePercent: number;
  scheduledBreakQuestionIndex: number;
  breakDurationMinutes: number;
}

export const OFFICIAL_EXAM_PROFILES: Record<string, OfficialExamProfile> = {
  'cisa': { certCode: 'CISA', totalQuestions: 150, durationMinutes: 240, passingScorePercent: 75, scheduledBreakQuestionIndex: 75, breakDurationMinutes: 10 },
  'cism': { certCode: 'CISM', totalQuestions: 150, durationMinutes: 240, passingScorePercent: 75, scheduledBreakQuestionIndex: 75, breakDurationMinutes: 10 },
  'cissp': { certCode: 'CISSP', totalQuestions: 125, durationMinutes: 180, passingScorePercent: 70, scheduledBreakQuestionIndex: 62, breakDurationMinutes: 10 },
  'ccsp': { certCode: 'CCSP', totalQuestions: 125, durationMinutes: 180, passingScorePercent: 70, scheduledBreakQuestionIndex: 62, breakDurationMinutes: 10 },
  'isc2-cc': { certCode: 'CC', totalQuestions: 100, durationMinutes: 120, passingScorePercent: 70, scheduledBreakQuestionIndex: 50, breakDurationMinutes: 10 },
  'crisc': { certCode: 'CRISC', totalQuestions: 150, durationMinutes: 240, passingScorePercent: 75, scheduledBreakQuestionIndex: 75, breakDurationMinutes: 10 },
  'cgeit': { certCode: 'CGEIT', totalQuestions: 150, durationMinutes: 240, passingScorePercent: 75, scheduledBreakQuestionIndex: 75, breakDurationMinutes: 10 },
  'comptia-sec-plus': { certCode: 'SECURITY+', totalQuestions: 90, durationMinutes: 90, passingScorePercent: 83, scheduledBreakQuestionIndex: 45, breakDurationMinutes: 5 },
  'cysa': { certCode: 'CYSA+', totalQuestions: 90, durationMinutes: 90, passingScorePercent: 83, scheduledBreakQuestionIndex: 45, breakDurationMinutes: 5 },
  'comptia-network-plus': { certCode: 'NETWORK+', totalQuestions: 90, durationMinutes: 90, passingScorePercent: 80, scheduledBreakQuestionIndex: 45, breakDurationMinutes: 5 },
  'comptia-a-plus': { certCode: 'A+', totalQuestions: 90, durationMinutes: 90, passingScorePercent: 75, scheduledBreakQuestionIndex: 45, breakDurationMinutes: 5 },
  'aws-csaa': { certCode: 'SAA-C03', totalQuestions: 65, durationMinutes: 130, passingScorePercent: 72, scheduledBreakQuestionIndex: 32, breakDurationMinutes: 10 },
  'gslc': { certCode: 'GSLC', totalQuestions: 115, durationMinutes: 180, passingScorePercent: 70, scheduledBreakQuestionIndex: 57, breakDurationMinutes: 10 },
  'nist-grc': { certCode: 'NIST', totalQuestions: 100, durationMinutes: 120, passingScorePercent: 75, scheduledBreakQuestionIndex: 50, breakDurationMinutes: 10 },
  'fifa-agent': { certCode: 'FIFA-AGENT', totalQuestions: 50, durationMinutes: 60, passingScorePercent: 75, scheduledBreakQuestionIndex: 25, breakDurationMinutes: 5 },
};

export function getOfficialExamProfile(certSlugOrCode: string): OfficialExamProfile {
  const clean = (certSlugOrCode || '').toLowerCase().trim();
  const aliasMap: Record<string, string> = {
    'cisa': 'cisa',
    'cc': 'isc2-cc',
    'isc2-cc': 'isc2-cc',
    'cissp': 'cissp',
    'cism': 'cism',
    'crisc': 'crisc',
    'ccsp': 'ccsp',
    'cgeit': 'cgeit',
    'cysa': 'cysa',
    'cysa+': 'cysa',
    'comptia-a-plus': 'comptia-a-plus',
    'a+': 'comptia-a-plus',
    'aplus': 'comptia-a-plus',
    'comptia-network-plus': 'comptia-network-plus',
    'network+': 'comptia-network-plus',
    'comptia-sec-plus': 'comptia-sec-plus',
    'security+': 'comptia-sec-plus',
    'aws-csaa': 'aws-csaa',
    'saa-c03': 'aws-csaa',
    'nist-grc': 'nist-grc',
    'nist': 'nist-grc',
    'gslc': 'gslc',
    'fifa-agent': 'fifa-agent',
  };

  const key = aliasMap[clean] || 'cisa';
  return OFFICIAL_EXAM_PROFILES[key] || OFFICIAL_EXAM_PROFILES['cisa'];
}

export interface StaminaQuartile {
  quartile: number;
  label: string;
  rangeText: string;
  total: number;
  correct: number;
  accuracy: number;
  averageTimeSeconds: number;
}

export interface CognitiveFatigueAnalysis {
  quartiles: StaminaQuartile[];
  firstHalfAccuracy: number;
  secondHalfAccuracy: number;
  fatigueDelta: number;
  fatigueLevel: 'EXCELLENT_STAMINA' | 'STEADY_PACING' | 'MILD_FATIGUE' | 'SEVERE_FATIGUE';
  diagnosis: string;
  recommendation: string;
}

export function analyzeCognitiveFatigue(
  questions: any[],
  answers: Record<string, any>
): CognitiveFatigueAnalysis | null {
  if (questions.length < 12) return null;

  const qSize = Math.ceil(questions.length / 4);
  const quartiles: StaminaQuartile[] = [];

  for (let q = 0; q < 4; q++) {
    const start = q * qSize;
    const end = Math.min((q + 1) * qSize, questions.length);
    const slice = questions.slice(start, end);
    if (slice.length === 0) continue;

    let correct = 0;
    let totalTime = 0;
    slice.forEach((item) => {
      const a = answers[item.id];
      if (a && a.is_correct) correct++;
      if (a && a.time_taken_seconds) totalTime += a.time_taken_seconds;
    });

    const accuracy = Math.round((correct / slice.length) * 100);
    const avgTime = Math.round(totalTime / slice.length);

    quartiles.push({
      quartile: q + 1,
      label: `Quartile ${q + 1} (${q * 25 + 1}%–${(q + 1) * 25}%)`,
      rangeText: `Questions ${start + 1}–${end}`,
      total: slice.length,
      correct,
      accuracy,
      averageTimeSeconds: avgTime || 0,
    });
  }

  const firstHalfTotal = (quartiles[0]?.total || 0) + (quartiles[1]?.total || 0);
  const firstHalfCorrect = (quartiles[0]?.correct || 0) + (quartiles[1]?.correct || 0);
  const firstHalfAccuracy = firstHalfTotal > 0 ? Math.round((firstHalfCorrect / firstHalfTotal) * 100) : 0;

  const secondHalfTotal = (quartiles[2]?.total || 0) + (quartiles[3]?.total || 0);
  const secondHalfCorrect = (quartiles[2]?.correct || 0) + (quartiles[3]?.correct || 0);
  const secondHalfAccuracy = secondHalfTotal > 0 ? Math.round((secondHalfCorrect / secondHalfTotal) * 100) : 0;

  const fatigueDelta = secondHalfAccuracy - firstHalfAccuracy;

  let fatigueLevel: CognitiveFatigueAnalysis['fatigueLevel'] = 'STEADY_PACING';
  let diagnosis = '';
  let recommendation = '';

  if (fatigueDelta >= 4) {
    fatigueLevel = 'EXCELLENT_STAMINA';
    diagnosis = `Endurance Surge (+${fatigueDelta}% in final half).`;
    recommendation = 'You accelerate focus under protracted testing conditions. Pacing and mental endurance are in the 95th percentile.';
  } else if (fatigueDelta >= -5) {
    fatigueLevel = 'STEADY_PACING';
    diagnosis = `Steady Stamina (${fatigueDelta >= 0 ? '+' : ''}${fatigueDelta}% variance).`;
    recommendation = 'Consistent cognitive stamina maintained across all quartiles. Maintain this pacing rhythm during your official exam.';
  } else if (fatigueDelta >= -15) {
    fatigueLevel = 'MILD_FATIGUE';
    diagnosis = `Mild Mental Fatigue (${fatigueDelta}% drop in final stretch).`;
    recommendation = 'Accuracy began declining in the final quartile due to cognitive drain. Take full advantage of scheduled midpoint breaks.';
  } else {
    fatigueLevel = 'SEVERE_FATIGUE';
    diagnosis = `Late-Exam Cognitive Exhaustion (${fatigueDelta}% drop in final stretch).`;
    recommendation = 'Critical focus depletion after question 50. Prioritize 50Q–100Q protracted endurance simulations to condition psychological stamina before exam day.';
  }

  return {
    quartiles,
    firstHalfAccuracy,
    secondHalfAccuracy,
    fatigueDelta,
    fatigueLevel,
    diagnosis,
    recommendation,
  };
}

