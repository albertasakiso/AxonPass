import { describe, it, expect } from 'vitest';
import { difficultyToB, irt2plProbability, fisherInformation, updateCatAbility } from '../scoring/catEngine';

describe('2PL IRT Computerized Adaptive Testing (CAT) Engine', () => {
  it('increases theta monotonically after correct responses and reduces SE', () => {
    expect(difficultyToB('hard')).toBeGreaterThan(difficultyToB('easy'));
    expect(irt2plProbability(1.0, 0.0)).toBeGreaterThan(0.7);
    expect(fisherInformation(0.0, 0.0)).toBeGreaterThan(fisherInformation(2.5, -1.0));

    const allCorrect = Array.from({ length: 16 }, () => ({ b: 0.5, correct: true }));
    const est = updateCatAbility(allCorrect, 'CISSP', 15, 30);
    expect(est.theta).toBeGreaterThan(0.8);
    expect(est.standardError).toBeLessThan(0.6);
    expect(est.shouldStop).toBe(true);
    expect(est.stopReason).toBe('confidence_pass');
  });
});
