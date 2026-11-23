import { describe, it, expect } from 'vitest';
import { buildDailyStudyMission, generateStudyPlanIcs } from '../studyPlanner';

describe('Adaptive Exam-Date Study Planner', () => {
  it('computes catch-up mission quotas and produces valid RFC 5545 ICS output', () => {
    const now = new Date('2026-11-23T08:00:00Z');
    const mission = buildDailyStudyMission(
      {
        certSlug: 'comptia-security-plus',
        certName: 'CompTIA Security+ (SY0-701)',
        targetExamDate: '2026-12-01',
        remainingBookSections: 60,
        fsrsDueCount: 12,
        weakDomainName: 'Security Operations',
      },
      now
    );

    expect(mission.daysRemaining).toBe(8);
    expect(mission.isCatchUp).toBe(true);
    expect(mission.sectionsTarget).toBe(8);

    const ics = generateStudyPlanIcs('CompTIA Security+', mission, 3, now);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toContain('Security Operations');
  });
});
