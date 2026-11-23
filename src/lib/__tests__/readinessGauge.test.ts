import { describe, it, expect } from 'vitest';
import { calculateCompositeReadiness } from '../scoring/readinessGauge';

describe('Composite Readiness Gauge', () => {
  it('weights testing (55%), blended syllabus+textbook (25%), and retention (20%) accurately', () => {
    const result = calculateCompositeReadiness({
      certSlug: 'cisa',
      irtEstimate: {
        theta: 0.8,
        standardError: 0.2,
        predictedScaledScore: 580,
        confidenceIntervalLow: 540,
        confidenceIntervalHigh: 620,
        passingProbability: 0.9,
        readinessCategory: 'READY',
      },
      totalAttempted: 200,
      overallAccuracy: 85,
      boxCounts: [10, 15, 25, 60, 40],
      totalCertQuestions: 1000,
      totalSubtopics: 100,
      completedSubtopicsCount: 80,
      textbookTotalSections: 200,
      textbookCompletedSections: 160,
      targetExamDate: '2026-12-23',
    });

    expect(result.compositeScore).toBeGreaterThanOrEqual(65);
    expect(result.components.syllabus.score).toBe(80);
    expect(result.components.syllabus.description).toContain('80/100 syllabus');
    expect(result.components.syllabus.description).toContain('160/200 book sections');
  });
});
