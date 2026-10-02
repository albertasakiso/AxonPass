/* ===================================================================
   APILIGU LEARNING PASS — Unified Composite Readiness & Pacing Engine
   Synthesizes Empirical Testing (IRT 2PL), Syllabus Reading Coverage,
   and Leitner Memory Stability into a Gold-Standard "Gauge to Excellence".
   =================================================================== */

import type { IrtAbilityEstimate } from '../ml/types';
import { supabase } from '../supabase';

export type ReadinessTier = 'NEEDS_REMEDIATION' | 'DEVELOPING' | 'EXAM_READY' | 'EXCELLENCE';

export interface ReadinessComponent {
  label: string;
  weight: number;      // e.g. 0.55
  score: number;       // 0 to 100
  weightedScore: number;
  description: string;
  badge: string;
}

export interface DailyPacingQuota {
  targetExamDate: string | null;
  daysRemaining: number | null;
  dailyLessonsTarget: number;
  dailyQuestionsTarget: number;
  dailyReviewsTarget: number;
  isPacingActive: boolean;
  statusMessage: string;
}

export interface CompositeReadinessResult {
  compositeScore: number; // 0 to 100
  tier: ReadinessTier;
  tierLabel: string;
  tierColor: string;
  tierDescription: string;
  components: {
    testing: ReadinessComponent;
    syllabus: ReadinessComponent;
    retention: ReadinessComponent;
  };
  pacing: DailyPacingQuota;
}

export interface CompositeReadinessInput {
  certSlug: string;
  irtEstimate: IrtAbilityEstimate | null;
  totalAttempted: number;
  overallAccuracy: number;
  boxCounts: [number, number, number, number, number];
  totalCertQuestions: number;
  totalSubtopics: number;
  completedSubtopicsCount: number;
  targetExamDate?: string | null;
}

/**
 * Calculates the Unified Composite Readiness Index (0-100%) and daily study quotas.
 */
export function calculateCompositeReadiness(input: CompositeReadinessInput): CompositeReadinessResult {
  const {
    certSlug,
    irtEstimate,
    totalAttempted,
    overallAccuracy,
    boxCounts,
    totalCertQuestions,
    totalSubtopics,
    completedSubtopicsCount,
    targetExamDate = null,
  } = input;

  // 1. Empirical Testing Component (Weight: 55%)
  // Uses IRT predicted scaled score or accuracy
  let rawTestingScore = 0;
  let testingDescription = '';
  if (irtEstimate && irtEstimate.predictedScaledScore) {
    // CISA scale: 200 to 800. Passing is 450.
    // Normalized to 0 - 100 where 450 is ~75% readiness
    const normalizedScore = Math.min(100, Math.max(0, ((irtEstimate.predictedScaledScore - 200) / 600) * 100));
    const passProbBonus = (irtEstimate.passingProbability || 0.5) * 10;
    rawTestingScore = Math.min(100, Math.round(normalizedScore * 0.9 + passProbBonus));
    testingDescription = `IRT Scaled Score ${irtEstimate.predictedScaledScore}/800 (${Math.round(irtEstimate.passingProbability * 100)}% Pass Prob)`;
  } else if (totalAttempted > 0) {
    rawTestingScore = Math.min(100, Math.round(overallAccuracy * 0.9));
    testingDescription = `${overallAccuracy}% raw accuracy across ${totalAttempted} answered questions`;
  } else {
    rawTestingScore = 0;
    testingDescription = 'No practice exams or diagnostics completed yet';
  }

  const testingComponent: ReadinessComponent = {
    label: 'Exam Simulator & IRT Ability',
    weight: 0.55,
    score: rawTestingScore,
    weightedScore: Math.round(rawTestingScore * 0.55),
    description: testingDescription,
    badge: rawTestingScore >= 75 ? 'Pass Ready' : rawTestingScore >= 60 ? 'Borderline' : 'Diagnostic Needed',
  };

  // 2. Syllabus Reading Coverage Component (Weight: 25%)
  // Ratio of completed subtopics to total syllabus lessons
  const safeTotalSubtopics = Math.max(1, totalSubtopics);
  const rawSyllabusScore = Math.min(100, Math.round((completedSubtopicsCount / safeTotalSubtopics) * 100));
  const syllabusComponent: ReadinessComponent = {
    label: 'Course Syllabus Mastery',
    weight: 0.25,
    score: rawSyllabusScore,
    weightedScore: Math.round(rawSyllabusScore * 0.25),
    description: `${completedSubtopicsCount} of ${totalSubtopics} syllabus submodules completed`,
    badge: rawSyllabusScore >= 80 ? 'Mastered' : rawSyllabusScore >= 50 ? 'In Progress' : 'Early Stage',
  };

  // 3. Cognitive Retention Stability Component (Weight: 20%)
  // Based on Leitner Spaced Repetition Boxes (Box 3 Mastered + Box 4 Retained)
  const masteredInBoxes = (boxCounts[3] || 0) + (boxCounts[4] || 0);
  const totalInBoxes = boxCounts.reduce((a, b) => a + b, 0);
  let rawRetentionScore = 0;
  if (totalInBoxes > 0) {
    const masteredRatio = masteredInBoxes / totalInBoxes;
    // Saturation factor: having 20 mastered questions out of 20 is great, but out of a 1000 bank has a cap
    const saturationFactor = Math.min(1.0, totalInBoxes / Math.max(30, Math.min(150, totalCertQuestions * 0.3)));
    rawRetentionScore = Math.min(100, Math.round(masteredRatio * 100 * saturationFactor));
  }

  const retentionComponent: ReadinessComponent = {
    label: 'Long-Term Memory Retention',
    weight: 0.20,
    score: rawRetentionScore,
    weightedScore: Math.round(rawRetentionScore * 0.20),
    description: `${masteredInBoxes} questions retained in Leitner Boxes 3 & 4`,
    badge: rawRetentionScore >= 70 ? 'Consolidated' : rawRetentionScore >= 35 ? 'Developing' : 'Review Needed',
  };

  // Compute Overarching Composite Score (0 to 100)
  const compositeScore = Math.min(
    100,
    Math.round(
      testingComponent.weightedScore +
      syllabusComponent.weightedScore +
      retentionComponent.weightedScore
    )
  );

  // Determine Readiness Tier
  let tier: ReadinessTier = 'NEEDS_REMEDIATION';
  let tierLabel = 'Needs Remediation';
  let tierColor = 'var(--color-error)';
  let tierDescription = 'Focus on syllabus reading and baseline diagnostic drills to establish foundational mastery.';

  if (compositeScore >= 85) {
    tier = 'EXCELLENCE';
    tierLabel = 'Excellence & High Mastery';
    tierColor = '#10b981'; // emerald green
    tierDescription = 'Candidate demonstrates exceptional readiness with strong retention, high IRT passing probability, and comprehensive syllabus coverage.';
  } else if (compositeScore >= 75) {
    tier = 'EXAM_READY';
    tierLabel = 'Exam Ready';
    tierColor = '#2563eb'; // royal primary blue
    tierDescription = 'Statistically predicted to comfortably pass the examination under standard proctored conditions.';
  } else if (compositeScore >= 60) {
    tier = 'DEVELOPING';
    tierLabel = 'Developing / Borderline';
    tierColor = '#f59e0b'; // amber
    tierDescription = 'Solid foundational knowledge. Target weaker blueprint domains and practice Box 0–1 missed questions.';
  }

  // Calculate Daily Pacing & Milestones
  const resolvedTargetDate = targetExamDate || getTargetExamDate(certSlug);
  const pacing = calculateDailyPacing(
    resolvedTargetDate,
    totalSubtopics,
    completedSubtopicsCount,
    totalCertQuestions,
    totalAttempted,
    boxCounts[0] + boxCounts[1] // due reviews
  );

  return {
    compositeScore,
    tier,
    tierLabel,
    tierColor,
    tierDescription,
    components: {
      testing: testingComponent,
      syllabus: syllabusComponent,
      retention: retentionComponent,
    },
    pacing,
  };
}

/**
 * Calculates daily reading and question practice quotas based on target exam date.
 */
export function calculateDailyPacing(
  targetDateStr: string | null,
  totalSubtopics: number,
  completedSubtopics: number,
  totalQuestions: number,
  attemptedQuestions: number,
  dueReviewsCount: number
): DailyPacingQuota {
  if (!targetDateStr) {
    return {
      targetExamDate: null,
      daysRemaining: null,
      dailyLessonsTarget: 2,
      dailyQuestionsTarget: 15,
      dailyReviewsTarget: 10,
      isPacingActive: false,
      statusMessage: 'Set your scheduled exam date to unlock customized daily study quotas.',
    };
  }

  const targetDate = new Date(targetDateStr);
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const daysRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  const remainingLessons = Math.max(0, totalSubtopics - completedSubtopics);
  const remainingQuestions = Math.max(0, Math.min(totalQuestions, 200) - attemptedQuestions);

  const dailyLessonsTarget = Math.max(1, Math.ceil(remainingLessons / daysRemaining));
  const dailyQuestionsTarget = Math.max(5, Math.ceil(remainingQuestions / daysRemaining));
  const dailyReviewsTarget = Math.max(5, Math.ceil(dueReviewsCount / Math.min(7, daysRemaining)));

  let statusMessage = '';
  if (daysRemaining <= 7) {
    statusMessage = `⚠️ Final Week Sprint (${daysRemaining} days left)! Focus on Leitner review cards and full mock simulations.`;
  } else if (daysRemaining <= 30) {
    statusMessage = `🎯 Peak Study Window (${daysRemaining} days remaining). Maintain your daily quota to hit 100% readiness.`;
  } else {
    statusMessage = `🗓️ Steady Prep Mode (${daysRemaining} days until test). Steady daily pace ensures maximum retention.`;
  }

  return {
    targetExamDate: targetDateStr,
    daysRemaining,
    dailyLessonsTarget,
    dailyQuestionsTarget,
    dailyReviewsTarget,
    isPacingActive: true,
    statusMessage,
  };
}

// ──────────────────────────────────────────────
// Target Exam Date Local Storage Persistence
// ──────────────────────────────────────────────
const STORAGE_PREFIX = 'alp_target_date_';

export function getTargetExamDate(certSlug: string): string | null {
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${certSlug}`) || null;
  } catch {
    return null;
  }
}

export function saveTargetExamDate(certSlug: string, dateStr: string | null): void {
  try {
    if (dateStr) {
      localStorage.setItem(`${STORAGE_PREFIX}${certSlug}`, dateStr);
    } else {
      localStorage.removeItem(`${STORAGE_PREFIX}${certSlug}`);
    }
  } catch (err) {
    console.warn('Failed to save target exam date:', err);
  }
}

/**
 * Launches an evenly balanced 20-question cross-domain baseline diagnostic exam.
 */
export async function launchDiagnosticExam(
  certId: string,
  startQuiz: (
    questions: any[],
    sessionType: any,
    timeLimitSeconds: number,
    certId: string,
    domainId?: any,
    feedbackPolicy?: any,
    topicId?: any,
    sectionTitle?: any
  ) => Promise<void>,
  navigate: (path: string) => void
): Promise<void> {
  // Query domains for this certification
  const { data: domains } = await supabase
    .from('domains')
    .select('id, domain_number, name')
    .eq('certification_id', certId)
    .order('domain_number');

  let diagnosticQuestions: any[] = [];

  if (domains && domains.length > 0) {
    const perDomain = Math.max(2, Math.floor(20 / domains.length));
    for (const d of domains) {
      const { data: qData } = await supabase
        .from('questions')
        .select('*')
        .eq('certification_id', certId)
        .eq('domain_id', d.id)
        .eq('is_active', true)
        .limit(perDomain);

      if (qData && qData.length > 0) {
        diagnosticQuestions.push(...qData);
      }
    }
  }

  // Fallback to general questions if cross-domain queries yield < 15
  if (diagnosticQuestions.length < 15) {
    const { data: fallbackQ } = await supabase
      .from('questions')
      .select('*')
      .eq('certification_id', certId)
      .eq('is_active', true)
      .limit(20);

    if (fallbackQ && fallbackQ.length > 0) {
      diagnosticQuestions = fallbackQ;
    }
  }

  if (diagnosticQuestions.length > 0) {
    await startQuiz(
      diagnosticQuestions,
      'quick_check',
      1500, // 25 minutes
      certId,
      null,
      'immediate',
      null,
      '20-Question Adaptive Baseline Diagnostic'
    );
    navigate('/quiz');
  }
}
