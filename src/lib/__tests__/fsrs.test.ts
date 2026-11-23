import { describe, it, expect } from 'vitest';
import {
  createNewFSRSCard,
  scheduleCard,
  getDueCards,
  forecastRetention7Days,
  exportFsrsCardsToAnkiCsv,
} from '../fsrs';

describe('FSRS v4.5 Spaced Repetition Scheduler', () => {
  it('schedules a new card rated Good with positive stability and future due date', () => {
    const now = new Date('2026-11-23T12:00:00Z');
    const card = createNewFSRSCard({
      id: 'c1',
      sourceType: 'certification',
      sourceId: 'cisa',
      front: 'What is ITAF 4th Ed?',
      back: 'ISACA IT Audit Framework',
      tags: ['CISA'],
      now,
    });

    const next = scheduleCard(card, 3, now);
    expect(next.reps).toBe(1);
    expect(next.stability).toBeGreaterThan(0);
    expect(new Date(next.due).getTime()).toBeGreaterThan(now.getTime());
    expect(getDueCards([next], now)).toHaveLength(0);
  });

  it('forecasts 7 days and exports valid Anki CSV with escaping', () => {
    const now = new Date('2026-11-23T12:00:00Z');
    const card = createNewFSRSCard({
      id: 'c2',
      sourceType: 'book',
      sourceId: 'walsh',
      front: 'Bill Walsh "Standard of Performance"',
      back: 'Execute details reliably.',
      tags: ['Leadership'],
      now,
    });
    const forecast = forecastRetention7Days([card], now);
    expect(forecast).toHaveLength(7);
    expect(forecast[0].dueCount).toBe(1);

    const csv = exportFsrsCardsToAnkiCsv([card]);
    expect(csv).toContain('Front,Back,Tags');
    expect(csv).toContain('""Standard of Performance""');
  });
});
