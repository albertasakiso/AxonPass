/* ===================================================================
   ANOXPASS — Adaptive Exam-Date Daily Mission Planner & ICS Exporter
   Converts targetExamDate, remaining textbook sections, FSRS due count,
   and weak domains into an actionable daily mission & .ics calendar.
   =================================================================== */

export interface DailyStudyMissionInput {
  certSlug: string;
  certName: string;
  targetExamDate: string | null;
  remainingBookSections: number;
  fsrsDueCount: number;
  weakDomainName?: string | null;
  weakDomainId?: string | null;
  dailyQuestionsDefault?: number;
}

export interface DailyStudyMission {
  certSlug: string;
  daysRemaining: number | null;
  isCatchUp: boolean;
  sectionsTarget: number;
  fsrsTarget: number;
  questionsTarget: number;
  weakDomainName: string | null;
  weakDomainId: string | null;
  summaryLine: string;
}

export function buildDailyStudyMission(input: DailyStudyMissionInput, now = new Date()): DailyStudyMission {
  let daysRemaining: number | null = null;
  if (input.targetExamDate) {
    const diff = Math.ceil(
      (new Date(input.targetExamDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    daysRemaining = Math.max(1, diff);
  }

  const effectiveDays = daysRemaining ?? 30;
  const rawSectionsPerDay = Math.ceil(Math.max(1, input.remainingBookSections) / effectiveDays);
  const sectionsTarget = Math.min(8, Math.max(1, rawSectionsPerDay));
  const fsrsTarget = Math.min(40, Math.max(5, input.fsrsDueCount));
  const questionsTarget =
    daysRemaining !== null && daysRemaining <= 14
      ? 35
      : input.dailyQuestionsDefault ?? 20;

  const isCatchUp = daysRemaining !== null && daysRemaining <= 14 && input.remainingBookSections > daysRemaining * 3;
  const summaryLine = daysRemaining !== null
    ? `${daysRemaining} days to exam · Read ${sectionsTarget} book section(s), clear ${fsrsTarget} FSRS card(s), drill ${questionsTarget} Qs`
    : `Read ${sectionsTarget} book section(s), clear ${fsrsTarget} FSRS card(s), drill ${questionsTarget} Qs today`;

  return {
    certSlug: input.certSlug,
    daysRemaining,
    isCatchUp,
    sectionsTarget,
    fsrsTarget,
    questionsTarget,
    weakDomainName: input.weakDomainName || null,
    weakDomainId: input.weakDomainId || null,
    summaryLine,
  };
}

function toIcsDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}

export function generateStudyPlanIcs(
  certName: string,
  mission: DailyStudyMission,
  daysToGenerate = 7,
  startDate = new Date()
): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AnoxPass//Adaptive Study Planner//EN',
    'CALSCALE:GREGORIAN',
  ];

  for (let i = 0; i < daysToGenerate; i++) {
    const start = new Date(startDate);
    start.setDate(start.getDate() + i);
    start.setHours(8, 0, 0, 0);
    const end = new Date(start.getTime() + 45 * 60 * 1000);
    lines.push(
      'BEGIN:VEVENT',
      `UID:anoxpass-${mission.certSlug}-day-${i + 1}@anoxpass.local`,
      `DTSTAMP:${toIcsDate(startDate)}`,
      `DTSTART:${toIcsDate(start)}`,
      `DTEND:${toIcsDate(end)}`,
      `SUMMARY:${certName} Daily Mission: ${mission.sectionsTarget} Sections + ${mission.questionsTarget} Qs`,
      `DESCRIPTION:Read ${mission.sectionsTarget} textbook subchapters, review ${mission.fsrsTarget} FSRS flashcards, and drill ${mission.questionsTarget} exam questions${mission.weakDomainName ? ` (Focus: ${mission.weakDomainName})` : ''}.`,
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadStudyPlanIcs(certName: string, mission: DailyStudyMission): void {
  const ics = generateStudyPlanIcs(certName, mission);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `anoxpass_${mission.certSlug}_study_plan.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
