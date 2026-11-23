/* ===================================================================
   ANOXPASS — Real-Time 2PL IRT Computerized Adaptive Testing (CAT)
   Pure TypeScript adaptive item selection + Fisher information +
   variable-length 95% confidence stopping rule (zero external APIs).
   =================================================================== */

import type { Question } from '../../types';
import { getCertScoreScale } from '../ml/bktEngine';

export interface CatResponseItem {
  question: Question;
  correct: boolean;
  difficultyB: number;
  thetaAfter: number;
  seAfter: number;
}

export interface CatStateEstimate {
  theta: number;
  standardError: number;
  ciLowTheta: number;
  ciHighTheta: number;
  scaledScore: number;
  passingProbability: number;
  shouldStop: boolean;
  stopReason: 'confidence_pass' | 'confidence_fail' | 'max_items' | null;
}

export function difficultyToB(difficulty?: string | null): number {
  const d = (difficulty || 'medium').toLowerCase();
  if (d === 'easy') return -1.1;
  if (d === 'hard') return 1.15;
  return 0.0;
}

export function irt2plProbability(theta: number, b: number, a = 1.25): number {
  const z = a * (theta - b);
  return 1 / (1 + Math.exp(-z));
}

export function fisherInformation(theta: number, b: number, a = 1.25): number {
  const p = irt2plProbability(theta, b, a);
  return a * a * p * (1 - p);
}

/**
 * Selects the next highest-information unanswered question while maintaining domain balance.
 */
export function selectNextCatQuestion(
  pool: Question[],
  answeredIds: Set<string>,
  currentTheta: number,
  domainCounts: Record<string, number>
): Question | null {
  const candidates = pool.filter((q) => !answeredIds.has(q.id));
  if (candidates.length === 0) return null;

  const minDomainCount = Math.min(
    ...candidates.map((q) => domainCounts[q.domain_id] || 0)
  );

  let bestQ = candidates[0];
  let bestScore = -Infinity;

  for (const q of candidates) {
    const b = difficultyToB(q.difficulty);
    const info = fisherInformation(currentTheta, b);
    const dCount = domainCounts[q.domain_id] || 0;
    // Encourage domain balance without overriding item information
    const balanceBonus = dCount === minDomainCount ? 0.35 : 0;
    // Small deterministic tie-breaker jitter for variety across sessions
    const jitter = ((q.question_number || 1) % 7) * 0.005;
    const score = info + balanceBonus + jitter;
    if (score > bestScore) {
      bestScore = score;
      bestQ = q;
    }
  }

  return bestQ;
}

/**
 * Updates latent ability theta via bounded EAP/Newton-Raphson step with N(0,1) prior
 * and evaluates variable-length 95% confidence stopping criteria around passing cut score.
 */
export function updateCatAbility(
  responses: Array<{ b: number; correct: boolean; a?: number }>,
  certCode: string,
  minItems = 20,
  maxItems = 40
): CatStateEstimate {
  const passTheta = 0.0; // Calibrated difficulty cut-off matching standard passing score
  let theta = 0.0;

  if (responses.length > 0) {
    // 6-step Newton-Raphson MAP estimation with standard normal prior N(0, 1)
    for (let iter = 0; iter < 6; iter++) {
      let grad = -theta; // Prior derivative -theta / 1^2
      let hess = -1.0;   // Prior second derivative -1
      for (const r of responses) {
        const a = r.a ?? 1.25;
        const p = irt2plProbability(theta, r.b, a);
        const y = r.correct ? 1 : 0;
        grad += a * (y - p);
        hess -= a * a * p * (1 - p);
      }
      const step = grad / Math.abs(hess || 1);
      theta = Math.max(-3.0, Math.min(3.0, theta + step));
    }
  }

  let totalInfo = 1.0; // Prior precision = 1.0
  for (const r of responses) {
    totalInfo += fisherInformation(theta, r.b, r.a ?? 1.25);
  }
  const standardError = Number((1 / Math.sqrt(totalInfo)).toFixed(3));
  const z95 = 1.96;
  const ciLowTheta = Number((theta - z95 * standardError).toFixed(3));
  const ciHighTheta = Number((theta + z95 * standardError).toFixed(3));

  const scale = getCertScoreScale(certCode);
  const rawScaled = Math.round(scale.offset + theta * scale.scaleFactor);
  const scaledScore = Math.max(scale.min, Math.min(scale.max, rawScaled));

  // Logistic passing probability centered at passing cut score
  const zPass = (theta - passTheta) / Math.max(0.15, standardError);
  const passingProbability = Number((1 / (1 + Math.exp(-zPass * 1.4))).toFixed(3));

  let shouldStop = false;
  let stopReason: CatStateEstimate['stopReason'] = null;

  if (responses.length >= maxItems) {
    shouldStop = true;
    stopReason = 'max_items';
  } else if (responses.length >= minItems) {
    if (ciLowTheta > passTheta) {
      shouldStop = true;
      stopReason = 'confidence_pass';
    } else if (ciHighTheta < passTheta) {
      shouldStop = true;
      stopReason = 'confidence_fail';
    }
  }

  return {
    theta: Number(theta.toFixed(3)),
    standardError,
    ciLowTheta,
    ciHighTheta,
    scaledScore,
    passingProbability,
    shouldStop,
    stopReason,
  };
}
