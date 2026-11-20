/* ===================================================================
   ANOXPASS — Academy, Mastery Paths, Books, FSRS & Gamification Store
   Zustand store with localStorage persistence + Supabase Realtime sync.
   =================================================================== */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DifficultyTier, FSRSCard, FSRSRating } from '../types/academy';
import { createNewFSRSCard, getDueCards, scheduleCard } from '../lib/fsrs';
import {
  realtimeSync,
  type PresenceDevice,
  type RealtimeConnectionStatus,
} from '../lib/realtimeSync';

export interface CertPathProgressRecord {
  pathId: string;
  difficultyTier: DifficultyTier;
  status: 'not_started' | 'in_progress' | 'exam_ready' | 'certified';
  completedMilestones: string[];
  readinessScore: number;
  hoursLogged: number;
  targetExamDate?: string;
  updatedAt: string;
}

export interface AcademyLessonProgressRecord {
  trackId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  drillScore?: number;
  practiceMinutes: number;
  notes?: string;
  completedAt?: string;
  updatedAt: string;
}

export interface BookMasteryNote {
  id: string;
  bookId: string;
  keyIdeaId?: string;
  noteType: 'note' | 'highlight' | 'takeaway' | 'action_item';
  content: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConceptCheckRecord {
  correct: boolean;
  attempts: number;
  lastAnsweredAt: string;
}

export interface CertCourseProgressRecord {
  certId: string;
  completedLessonIds: string[];
  conceptCheckScores: Record<string, ConceptCheckRecord>;
  completedDrillIds: string[];
  domainMastery: Record<string, number>;
  lastLessonId?: string;
  totalXpEarned: number;
  updatedAt: string;
}

export interface CertCourseStats {
  completedLessons: number;
  totalLessons: number;
  percentComplete: number;
  conceptChecksCorrect: number;
  conceptChecksAttempted: number;
  drillsCompleted: number;
  lastLessonId?: string;
}

export interface GamificationStats {
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null; // YYYY-MM-DD
  dailyXpGoal: number;
  todayXp: number;
  activityLog: Record<string, number>; // { "YYYY-MM-DD": xp }
}

interface AcademyProgressState {
  pathProgress: Record<string, CertPathProgressRecord>;
  certCourseProgress: Record<string, CertCourseProgressRecord>;
  lessonProgress: Record<string, AcademyLessonProgressRecord>;
  bookNotes: BookMasteryNote[];
  fsrsCards: FSRSCard[];
  gamification: GamificationStats;
  realtimeStatus: RealtimeConnectionStatus;
  connectedDevices: PresenceDevice[];
  lastRealtimeSyncAt: string | null;

  // Certification Paths
  togglePathMilestone: (
    pathId: string,
    milestoneId: string,
    difficultyTier: DifficultyTier,
    totalMilestones: number,
    xpReward?: number
  ) => void;
  updatePathTargetDate: (pathId: string, targetExamDate: string) => void;

  // End-to-End Certification Courses
  completeCertLesson: (params: {
    certId: string;
    lessonId: string;
    domainId?: string;
    xpReward?: number;
  }) => void;
  recordConceptCheck: (params: {
    certId: string;
    checkId: string;
    correct: boolean;
    xpReward?: number;
  }) => void;
  completeCourseDrill: (params: {
    certId: string;
    drillId: string;
    xpReward?: number;
  }) => void;
  getCertCourseStats: (certId: string, totalLessons: number) => CertCourseStats;

  // Skill Academies
  completeAcademyLesson: (params: {
    trackId: string;
    moduleId: string;
    lessonId: string;
    drillScore?: number;
    practiceMinutes?: number;
    xpReward?: number;
    notes?: string;
  }) => void;

  // Book Mastery Hub
  addBookNote: (params: {
    bookId: string;
    keyIdeaId?: string;
    noteType: BookMasteryNote['noteType'];
    content: string;
  }) => void;
  toggleBookNoteCompleted: (noteId: string) => void;
  deleteBookNote: (noteId: string) => void;

  // FSRS Spaced Repetition
  addFsrsCard: (params: {
    id?: string;
    sourceType: FSRSCard['sourceType'];
    sourceId: string;
    front: string;
    back: string;
    tags?: string[];
  }) => void;
  reviewFsrsCard: (cardId: string, rating: FSRSRating) => void;
  getDueFsrsCards: () => FSRSCard[];

  // Gamification
  awardXp: (amount: number, reason?: string) => void;

  // Realtime
  initRealtime: (userId: string | null) => Promise<void>;
  disconnectRealtime: () => void;
}

function todayDateStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function computeLevel(xp: number): number {
  return Math.max(1, Math.floor(xp / 250) + 1);
}

function applyXpToStats(stats: GamificationStats, amount: number): GamificationStats {
  const today = todayDateStr();
  const yesterday = yesterdayDateStr();
  const totalXp = stats.totalXp + amount;
  const currentLevel = computeLevel(totalXp);

  let currentStreak = stats.currentStreak;
  if (stats.lastActivityDate === today) {
    currentStreak = Math.max(1, stats.currentStreak);
  } else if (stats.lastActivityDate === yesterday) {
    currentStreak = stats.currentStreak + 1;
  } else {
    currentStreak = 1;
  }

  const longestStreak = Math.max(stats.longestStreak, currentStreak);
  const todayXp = (stats.activityLog[today] ?? 0) + amount;
  const activityLog = { ...stats.activityLog, [today]: todayXp };

  return {
    ...stats,
    totalXp,
    currentLevel,
    currentStreak,
    longestStreak,
    lastActivityDate: today,
    todayXp,
    activityLog,
  };
}

const DEFAULT_FSRS_CARDS: FSRSCard[] = [
  createNewFSRSCard({
    id: 'seed-walsh-standard',
    sourceType: 'book',
    sourceId: 'the-score-takes-care-of-itself',
    front: 'In Bill Walsh\'s "The Score Takes Care of Itself", what is the "Standard of Performance"?',
    back: 'A comprehensive set of explicit attitudes, habits, and operational expectations for every single role—focusing on perfecting the process so winning becomes a byproduct.',
    tags: ['leadership', 'bill-walsh', 'culture'],
  }),
  createNewFSRSCard({
    id: 'seed-speaking-prep',
    sourceType: 'academy',
    sourceId: 'public-speaking',
    front: 'What is the PREP framework for structured impromptu speaking?',
    back: 'Point (state your thesis) → Reason (why it matters) → Example (concrete proof/story) → Point (restate with authority).',
    tags: ['public-speaking', 'impromptu'],
  }),
  createNewFSRSCard({
    id: 'seed-reading-sq3r',
    sourceType: 'academy',
    sourceId: 'reading-mastery',
    front: 'What are the 5 phases of the SQ3R active reading system?',
    back: 'Survey → Question → Read → Recite → Review. It converts passive reading into active retrieval practice.',
    tags: ['reading', 'retention'],
  }),
];

const INITIAL_GAMIFICATION: GamificationStats = {
  totalXp: 0,
  currentLevel: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  dailyXpGoal: 100,
  todayXp: 0,
  activityLog: {},
};

export const useAcademyProgressStore = create<AcademyProgressState>()(
  persist(
    (set, get) => ({
      pathProgress: {},
      certCourseProgress: {},
      lessonProgress: {},
      bookNotes: [],
      fsrsCards: DEFAULT_FSRS_CARDS,
      gamification: INITIAL_GAMIFICATION,
      realtimeStatus: 'offline_local',
      connectedDevices: [],
      lastRealtimeSyncAt: null,

      togglePathMilestone: (pathId, milestoneId, difficultyTier, totalMilestones, xpReward = 50) => {
        const now = new Date().toISOString();
        const existing = get().pathProgress[pathId] ?? {
          pathId,
          difficultyTier,
          status: 'in_progress' as const,
          completedMilestones: [],
          readinessScore: 0,
          hoursLogged: 0,
          updatedAt: now,
        };

        const alreadyDone = existing.completedMilestones.includes(milestoneId);
        const completedMilestones = alreadyDone
          ? existing.completedMilestones.filter((id) => id !== milestoneId)
          : [...existing.completedMilestones, milestoneId];

        const readinessScore =
          totalMilestones > 0
            ? Math.round((completedMilestones.length / totalMilestones) * 100)
            : 0;
        const status: CertPathProgressRecord['status'] =
          readinessScore >= 100
            ? 'exam_ready'
            : completedMilestones.length > 0
              ? 'in_progress'
              : 'not_started';

        const updated: CertPathProgressRecord = {
          ...existing,
          difficultyTier,
          completedMilestones,
          readinessScore,
          status,
          updatedAt: now,
        };

        const nextGamification = alreadyDone
          ? get().gamification
          : applyXpToStats(get().gamification, xpReward);

        set((state) => ({
          pathProgress: { ...state.pathProgress, [pathId]: updated },
          gamification: nextGamification,
        }));

        void realtimeSync.upsertRow(
          'certification_path_progress',
          {
            path_id: pathId,
            difficulty_tier: difficultyTier,
            status,
            completed_milestones: completedMilestones,
            readiness_score: readinessScore,
            hours_logged: updated.hoursLogged,
            target_exam_date: updated.targetExamDate ?? null,
          },
          'user_id,path_id'
        );

        if (!alreadyDone) {
          void realtimeSync.broadcastMasteryEvent('milestone_completed', {
            pathId,
            milestoneId,
            xpReward,
          });
        }
      },

      updatePathTargetDate: (pathId, targetExamDate) => {
        const now = new Date().toISOString();
        const existing = get().pathProgress[pathId];
        if (!existing) return;
        const updated = { ...existing, targetExamDate, updatedAt: now };
        set((state) => ({
          pathProgress: { ...state.pathProgress, [pathId]: updated },
        }));
        void realtimeSync.upsertRow(
          'certification_path_progress',
          {
            path_id: pathId,
            difficulty_tier: updated.difficultyTier,
            status: updated.status,
            completed_milestones: updated.completedMilestones,
            readiness_score: updated.readinessScore,
            target_exam_date: targetExamDate,
          },
          'user_id,path_id'
        );
      },

      completeCertLesson: ({ certId, lessonId, domainId, xpReward = 50 }) => {
        const now = new Date().toISOString();
        const existing: CertCourseProgressRecord = get().certCourseProgress[certId] ?? {
          certId,
          completedLessonIds: [],
          conceptCheckScores: {},
          completedDrillIds: [],
          domainMastery: {},
          totalXpEarned: 0,
          updatedAt: now,
        };

        const alreadyDone = existing.completedLessonIds.includes(lessonId);
        const completedLessonIds = alreadyDone
          ? existing.completedLessonIds
          : [...existing.completedLessonIds, lessonId];

        const domainMastery = domainId
          ? {
              ...existing.domainMastery,
              [domainId]: Math.min(100, (existing.domainMastery[domainId] ?? 0) + (alreadyDone ? 0 : 25)),
            }
          : existing.domainMastery;

        const updated: CertCourseProgressRecord = {
          ...existing,
          completedLessonIds,
          domainMastery,
          lastLessonId: lessonId,
          totalXpEarned: existing.totalXpEarned + (alreadyDone ? 0 : xpReward),
          updatedAt: now,
        };

        const nextGamification = alreadyDone
          ? get().gamification
          : applyXpToStats(get().gamification, xpReward);

        set((state) => ({
          certCourseProgress: { ...state.certCourseProgress, [certId]: updated },
          gamification: nextGamification,
        }));

        void realtimeSync.upsertRow(
          'cert_course_progress',
          {
            cert_id: certId,
            completed_lesson_ids: updated.completedLessonIds,
            concept_check_scores: updated.conceptCheckScores,
            completed_drill_ids: updated.completedDrillIds,
            domain_mastery: updated.domainMastery,
            last_lesson_id: updated.lastLessonId ?? null,
            total_xp_earned: updated.totalXpEarned,
          },
          'user_id,cert_id'
        );

        if (!alreadyDone) {
          void realtimeSync.broadcastMasteryEvent('milestone_completed', {
            source: 'cert_course',
            certId,
            lessonId,
            xpReward,
          });
        }
      },

      recordConceptCheck: ({ certId, checkId, correct, xpReward = 15 }) => {
        const now = new Date().toISOString();
        const existing: CertCourseProgressRecord = get().certCourseProgress[certId] ?? {
          certId,
          completedLessonIds: [],
          conceptCheckScores: {},
          completedDrillIds: [],
          domainMastery: {},
          totalXpEarned: 0,
          updatedAt: now,
        };

        const prev = existing.conceptCheckScores[checkId];
        const firstCorrect = correct && !prev?.correct;

        const conceptCheckScores = {
          ...existing.conceptCheckScores,
          [checkId]: {
            correct: prev?.correct || correct,
            attempts: (prev?.attempts ?? 0) + 1,
            lastAnsweredAt: now,
          },
        };

        const updated: CertCourseProgressRecord = {
          ...existing,
          conceptCheckScores,
          totalXpEarned: existing.totalXpEarned + (firstCorrect ? xpReward : 0),
          updatedAt: now,
        };

        const nextGamification = firstCorrect
          ? applyXpToStats(get().gamification, xpReward)
          : get().gamification;

        set((state) => ({
          certCourseProgress: { ...state.certCourseProgress, [certId]: updated },
          gamification: nextGamification,
        }));

        void realtimeSync.upsertRow(
          'cert_course_progress',
          {
            cert_id: certId,
            completed_lesson_ids: updated.completedLessonIds,
            concept_check_scores: updated.conceptCheckScores,
            completed_drill_ids: updated.completedDrillIds,
            domain_mastery: updated.domainMastery,
            last_lesson_id: updated.lastLessonId ?? null,
            total_xp_earned: updated.totalXpEarned,
          },
          'user_id,cert_id'
        );
      },

      completeCourseDrill: ({ certId, drillId, xpReward = 35 }) => {
        const now = new Date().toISOString();
        const existing: CertCourseProgressRecord = get().certCourseProgress[certId] ?? {
          certId,
          completedLessonIds: [],
          conceptCheckScores: {},
          completedDrillIds: [],
          domainMastery: {},
          totalXpEarned: 0,
          updatedAt: now,
        };

        const alreadyDone = existing.completedDrillIds.includes(drillId);
        const completedDrillIds = alreadyDone
          ? existing.completedDrillIds
          : [...existing.completedDrillIds, drillId];

        const updated: CertCourseProgressRecord = {
          ...existing,
          completedDrillIds,
          totalXpEarned: existing.totalXpEarned + (alreadyDone ? 0 : xpReward),
          updatedAt: now,
        };

        const nextGamification = alreadyDone
          ? get().gamification
          : applyXpToStats(get().gamification, xpReward);

        set((state) => ({
          certCourseProgress: { ...state.certCourseProgress, [certId]: updated },
          gamification: nextGamification,
        }));

        void realtimeSync.upsertRow(
          'cert_course_progress',
          {
            cert_id: certId,
            completed_lesson_ids: updated.completedLessonIds,
            concept_check_scores: updated.conceptCheckScores,
            completed_drill_ids: updated.completedDrillIds,
            domain_mastery: updated.domainMastery,
            last_lesson_id: updated.lastLessonId ?? null,
            total_xp_earned: updated.totalXpEarned,
          },
          'user_id,cert_id'
        );
      },

      getCertCourseStats: (certId, totalLessons) => {
        const record = get().certCourseProgress[certId];
        if (!record) {
          return {
            completedLessons: 0,
            totalLessons,
            percentComplete: 0,
            conceptChecksCorrect: 0,
            conceptChecksAttempted: 0,
            drillsCompleted: 0,
          };
        }
        const checks = Object.values(record.conceptCheckScores);
        const completedLessons = record.completedLessonIds.length;
        return {
          completedLessons,
          totalLessons,
          percentComplete:
            totalLessons > 0 ? Math.min(100, Math.round((completedLessons / totalLessons) * 100)) : 0,
          conceptChecksCorrect: checks.filter((c) => c.correct).length,
          conceptChecksAttempted: checks.length,
          drillsCompleted: record.completedDrillIds.length,
          lastLessonId: record.lastLessonId,
        };
      },

      completeAcademyLesson: ({
        trackId,
        moduleId,
        lessonId,
        drillScore,
        practiceMinutes = 10,
        xpReward = 40,
        notes,
      }) => {
        const now = new Date().toISOString();
        const alreadyDone = Boolean(get().lessonProgress[lessonId]?.completed);
        const record: AcademyLessonProgressRecord = {
          trackId,
          moduleId,
          lessonId,
          completed: true,
          drillScore,
          practiceMinutes:
            (get().lessonProgress[lessonId]?.practiceMinutes ?? 0) + practiceMinutes,
          notes: notes ?? get().lessonProgress[lessonId]?.notes,
          completedAt: now,
          updatedAt: now,
        };

        const nextGamification = alreadyDone
          ? get().gamification
          : applyXpToStats(get().gamification, xpReward);

        set((state) => ({
          lessonProgress: { ...state.lessonProgress, [lessonId]: record },
          gamification: nextGamification,
        }));

        void realtimeSync.upsertRow(
          'academy_lesson_progress',
          {
            track_id: trackId,
            module_id: moduleId,
            lesson_id: lessonId,
            completed: true,
            drill_score: drillScore ?? null,
            practice_minutes: record.practiceMinutes,
            notes: record.notes ?? null,
            completed_at: now,
          },
          'user_id,lesson_id'
        );

        if (!alreadyDone) {
          void realtimeSync.broadcastMasteryEvent('xp_earned', {
            source: 'academy',
            lessonId,
            xpReward,
          });
        }
      },

      addBookNote: ({ bookId, keyIdeaId, noteType, content }) => {
        const trimmed = content.trim();
        if (!trimmed) return;
        const now = new Date().toISOString();
        const note: BookMasteryNote = {
          id: `note_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
          bookId,
          keyIdeaId,
          noteType,
          content: trimmed,
          isCompleted: false,
          createdAt: now,
          updatedAt: now,
        };

        const nextGamification = applyXpToStats(get().gamification, 15);
        set((state) => ({
          bookNotes: [note, ...state.bookNotes],
          gamification: nextGamification,
        }));

        void realtimeSync.upsertRow('book_mastery_notes', {
          book_id: bookId,
          key_idea_id: keyIdeaId ?? null,
          note_type: noteType,
          content: trimmed,
          is_completed: false,
        });
      },

      toggleBookNoteCompleted: (noteId) => {
        const now = new Date().toISOString();
        set((state) => ({
          bookNotes: state.bookNotes.map((n) =>
            n.id === noteId ? { ...n, isCompleted: !n.isCompleted, updatedAt: now } : n
          ),
        }));
      },

      deleteBookNote: (noteId) => {
        set((state) => ({
          bookNotes: state.bookNotes.filter((n) => n.id !== noteId),
        }));
        void realtimeSync.deleteRow('book_mastery_notes', noteId);
      },

      addFsrsCard: ({ id, sourceType, sourceId, front, back, tags }) => {
        const cardId =
          id ?? `fsrs_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
        const exists = get().fsrsCards.some((c) => c.id === cardId);
        if (exists) return;

        const card = createNewFSRSCard({
          id: cardId,
          sourceType,
          sourceId,
          front,
          back,
          tags,
        });

        set((state) => ({
          fsrsCards: [card, ...state.fsrsCards],
        }));

        void realtimeSync.upsertRow(
          'fsrs_cards',
          {
            card_key: card.id,
            source_type: card.sourceType,
            source_id: card.sourceId,
            front: card.front,
            back: card.back,
            stability: card.stability,
            difficulty: card.difficulty,
            elapsed_days: card.elapsedDays,
            scheduled_days: card.scheduledDays,
            reps: card.reps,
            lapses: card.lapses,
            state: 0,
            due: card.due,
          },
          'user_id,card_key'
        );
      },

      reviewFsrsCard: (cardId, rating) => {
        const card = get().fsrsCards.find((c) => c.id === cardId);
        if (!card) return;
        const updated = scheduleCard(card, rating);
        const xpReward = rating === 1 ? 5 : rating === 2 ? 10 : 15;
        const nextGamification = applyXpToStats(get().gamification, xpReward);

        set((state) => ({
          fsrsCards: state.fsrsCards.map((c) => (c.id === cardId ? updated : c)),
          gamification: nextGamification,
        }));

        const stateCode =
          updated.state === 'new'
            ? 0
            : updated.state === 'learning'
              ? 1
              : updated.state === 'review'
                ? 2
                : 3;

        void realtimeSync.upsertRow(
          'fsrs_cards',
          {
            card_key: updated.id,
            source_type: updated.sourceType,
            source_id: updated.sourceId,
            front: updated.front,
            back: updated.back,
            stability: updated.stability,
            difficulty: updated.difficulty,
            elapsed_days: updated.elapsedDays,
            scheduled_days: updated.scheduledDays,
            reps: updated.reps,
            lapses: updated.lapses,
            state: stateCode,
            due: updated.due,
            last_review: updated.lastReview ?? null,
          },
          'user_id,card_key'
        );

        void realtimeSync.broadcastMasteryEvent('fsrs_reviewed', {
          cardId,
          rating,
          xpReward,
        });
      },

      getDueFsrsCards: () => getDueCards(get().fsrsCards),

      awardXp: (amount, reason = 'study') => {
        const nextGamification = applyXpToStats(get().gamification, amount);
        set({ gamification: nextGamification });

        void realtimeSync.upsertRow(
          'user_gamification_stats',
          {
            total_xp: nextGamification.totalXp,
            current_level: nextGamification.currentLevel,
            current_streak: nextGamification.currentStreak,
            longest_streak: nextGamification.longestStreak,
            last_activity_date: nextGamification.lastActivityDate,
            daily_xp_goal: nextGamification.dailyXpGoal,
            today_xp: nextGamification.todayXp,
            activity_log: nextGamification.activityLog,
          },
          'user_id'
        );

        void realtimeSync.broadcastMasteryEvent('xp_earned', { amount, reason });
      },

      initRealtime: async (userId) => {
        await realtimeSync.connect(userId, {
          onStatusChange: (status) => {
            set({ realtimeStatus: status });
          },
          onPresenceSync: (devices) => {
            set({ connectedDevices: devices });
          },
          onPostgresChange: (event) => {
            set({ lastRealtimeSyncAt: event.timestamp });
          },
          onBroadcast: (event) => {
            set({ lastRealtimeSyncAt: event.timestamp });
          },
        });
      },

      disconnectRealtime: () => {
        realtimeSync.disconnect();
        set({ realtimeStatus: 'offline_local', connectedDevices: [] });
      },
    }),
    {
      name: 'anoxpass-academy-progress-v1',
      partialize: (state) => ({
        pathProgress: state.pathProgress,
        certCourseProgress: state.certCourseProgress,
        lessonProgress: state.lessonProgress,
        bookNotes: state.bookNotes,
        fsrsCards: state.fsrsCards,
        gamification: state.gamification,
      }),
    }
  )
);
