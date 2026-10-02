/* ===================================================================
   APILIGU LEARNING PASS — Quiz Store (Zustand)
   Manages active quiz sessions, question navigation, timer,
   immediate feedback, answer submission, and result calculation.
   =================================================================== */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  Question,
  SessionAnswer,
  QuizSession,
  QuizResult,
  DomainScore,
  WeakConcept,
  SessionType,
} from '../types';
import { db, enqueueSync } from '../lib/db';
import { advanceBox, resetBox, createInitialProgress } from '../lib/leitner';
import { useAuthStore } from './authStore';

interface QuizState {
  // Session info
  sessionId: string | null;
  sessionType: SessionType;
  certificationId: string;
  domainId: string | null;
  questions: Question[];
  currentIndex: number;

  // Answers & feedback
  answers: Record<string, SessionAnswer>;
  flaggedQuestionIds: Set<string>;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
  isAnswerSubmitted: boolean;

  // Timing
  timeLimitSeconds: number;
  timeRemainingSeconds: number;
  timeTakenSeconds: number;
  questionStartTimestamp: number;
  isTimerRunning: boolean;
  isPaused: boolean;

  // Mode settings
  feedbackPolicy: 'immediate' | 'delayed';

  // Completion
  isCompleted: boolean;
  result: QuizResult | null;

  // Actions
  startQuiz: (
    questions: Question[],
    sessionType: SessionType,
    timeLimitSeconds: number,
    certificationId: string,
    domainId?: string | null,
    feedbackPolicy?: 'immediate' | 'delayed'
  ) => Promise<void>;
  selectOption: (option: 'A' | 'B' | 'C' | 'D') => void;
  submitAnswer: (userId?: string) => Promise<void>;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  toggleFlag: (questionId: string) => void;
  pauseQuiz: () => void;
  resumeQuiz: () => void;
  tickTimer: () => void;
  finishQuiz: (userId?: string) => Promise<QuizResult>;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  sessionId: null,
  sessionType: 'practice',
  certificationId: 'a0000000-0000-0000-0000-000000000001',
  domainId: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  flaggedQuestionIds: new Set<string>(),
  selectedAnswer: null,
  isAnswerSubmitted: false,
  timeLimitSeconds: 0,
  timeRemainingSeconds: 0,
  timeTakenSeconds: 0,
  questionStartTimestamp: Date.now(),
  isTimerRunning: false,
  isPaused: false,
  feedbackPolicy: 'immediate',
  isCompleted: false,
  result: null,

  startQuiz: async (
    questions,
    sessionType,
    timeLimitSeconds,
    certificationId,
    domainId = null,
    feedbackPolicy = 'immediate'
  ) => {
    const sessionId = uuidv4();
    const initialAnswers: Record<string, SessionAnswer> = {};

    questions.forEach((q) => {
      initialAnswers[q.id] = {
        id: uuidv4(),
        quiz_session_id: sessionId,
        question_id: q.id,
        selected_answer: null,
        is_correct: null,
        time_taken_seconds: null,
        is_flagged: false,
        status: 'unseen',
        answered_at: null,
        client_event_id: uuidv4(),
      };
    });

    set({
      sessionId,
      sessionType,
      certificationId,
      domainId,
      questions,
      currentIndex: 0,
      answers: initialAnswers,
      flaggedQuestionIds: new Set<string>(),
      selectedAnswer: null,
      isAnswerSubmitted: false,
      timeLimitSeconds,
      timeRemainingSeconds: timeLimitSeconds,
      timeTakenSeconds: 0,
      questionStartTimestamp: Date.now(),
      isTimerRunning: true,
      isPaused: false,
      feedbackPolicy,
      isCompleted: false,
      result: null,
    });

    // Save session in Dexie
    const currentUserId = useAuthStore.getState().user?.id || 'anonymous';
    const sessionRecord: QuizSession = {
      id: sessionId,
      user_id: currentUserId,
      certification_id: certificationId,
      domain_id: domainId,
      topic_id: null,
      session_type: sessionType,
      total_questions: questions.length,
      time_limit_seconds: timeLimitSeconds,
      started_at: new Date().toISOString(),
      completed_at: null,
      total_correct: null,
      total_incorrect: null,
      total_skipped: null,
      score_percent: null,
      passed: null,
      status: 'in_progress',
      created_at: new Date().toISOString(),
    };

    await db.quizSessions.put(sessionRecord);
  },

  selectOption: (option) => {
    const { isAnswerSubmitted, feedbackPolicy } = get();
    if (isAnswerSubmitted && feedbackPolicy === 'immediate') return;
    set({ selectedAnswer: option });
  },

  submitAnswer: async (userId) => {
    const currentUserId = userId || useAuthStore.getState().user?.id || 'anonymous';
    const {
      questions,
      currentIndex,
      selectedAnswer,
      answers,
      sessionId,
      questionStartTimestamp,
    } = get();

    if (!selectedAnswer || !sessionId) return;
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const timeSpent = Math.max(1, (Date.now() - questionStartTimestamp) / 1000);
    const isCorrect = selectedAnswer === currentQ.correct_answer;

    const currentAnswer = answers[currentQ.id];
    const clientEventId = currentAnswer?.client_event_id || uuidv4();

    const updatedAnswer: SessionAnswer = {
      ...currentAnswer,
      id: currentAnswer?.id || uuidv4(),
      quiz_session_id: sessionId,
      question_id: currentQ.id,
      selected_answer: selectedAnswer,
      is_correct: isCorrect,
      time_taken_seconds: timeSpent,
      status: 'answered',
      answered_at: new Date().toISOString(),
      client_event_id: clientEventId,
    };

    const newAnswers = {
      ...answers,
      [currentQ.id]: updatedAnswer,
    };

    set({
      answers: newAnswers,
      isAnswerSubmitted: true,
    });

    // Update Dexie session answer
    await db.sessionAnswers.put(updatedAnswer);

    // Update Leitner progress in Dexie & enqueue sync
    try {
      const existingProgress = await db.userProgress
        .where({ user_id: currentUserId, question_id: currentQ.id })
        .first();

      let updatedProgress;
      if (existingProgress) {
        const changes = isCorrect
          ? advanceBox(existingProgress)
          : resetBox(existingProgress);
        updatedProgress = { ...existingProgress, ...changes, updated_at: new Date().toISOString() };
      } else {
        const initial = createInitialProgress(currentUserId, currentQ.id, currentQ.domain_id, currentQ.topic_id);
        const changes = isCorrect
          ? advanceBox(initial as any)
          : resetBox(initial as any);
        updatedProgress = { id: uuidv4(), ...initial, ...changes };
      }

      await db.userProgress.put(updatedProgress);
      await enqueueSync('user_progress', updatedProgress.id, 'update', updatedProgress as any, clientEventId);
    } catch (e) {
      console.error('Failed to update local Leitner progress:', e);
    }
  },

  nextQuestion: () => {
    const { currentIndex, questions, answers } = get();
    if (currentIndex < questions.length - 1) {
      const nextQ = questions[currentIndex + 1];
      const existingAnswer = answers[nextQ.id];

      set({
        currentIndex: currentIndex + 1,
        selectedAnswer: existingAnswer?.selected_answer || null,
        isAnswerSubmitted: existingAnswer?.status === 'answered',
        questionStartTimestamp: Date.now(),
      });
    }
  },

  prevQuestion: () => {
    const { currentIndex, questions, answers } = get();
    if (currentIndex > 0) {
      const prevQ = questions[currentIndex - 1];
      const existingAnswer = answers[prevQ.id];

      set({
        currentIndex: currentIndex - 1,
        selectedAnswer: existingAnswer?.selected_answer || null,
        isAnswerSubmitted: existingAnswer?.status === 'answered',
        questionStartTimestamp: Date.now(),
      });
    }
  },

  goToQuestion: (index) => {
    const { questions, answers } = get();
    if (index >= 0 && index < questions.length) {
      const targetQ = questions[index];
      const existingAnswer = answers[targetQ.id];

      set({
        currentIndex: index,
        selectedAnswer: existingAnswer?.selected_answer || null,
        isAnswerSubmitted: existingAnswer?.status === 'answered',
        questionStartTimestamp: Date.now(),
      });
    }
  },

  toggleFlag: (questionId) => {
    const { flaggedQuestionIds, answers } = get();
    const nextFlags = new Set(flaggedQuestionIds);
    const isCurrentlyFlagged = nextFlags.has(questionId);

    if (isCurrentlyFlagged) {
      nextFlags.delete(questionId);
    } else {
      nextFlags.add(questionId);
    }

    const currentAnswer = answers[questionId];
    if (currentAnswer) {
      const updated = { ...currentAnswer, is_flagged: !isCurrentlyFlagged };
      set({
        flaggedQuestionIds: nextFlags,
        answers: { ...answers, [questionId]: updated },
      });
      db.sessionAnswers.put(updated);
    } else {
      set({ flaggedQuestionIds: nextFlags });
    }
  },

  pauseQuiz: () => set({ isPaused: true, isTimerRunning: false }),
  resumeQuiz: () => set({ isPaused: false, isTimerRunning: true }),

  tickTimer: () => {
    const { timeRemainingSeconds, isTimerRunning, isPaused, timeTakenSeconds } = get();
    if (!isTimerRunning || isPaused) return;

    if (timeRemainingSeconds <= 1) {
      set({ timeRemainingSeconds: 0, timeTakenSeconds: timeTakenSeconds + 1 });
      get().finishQuiz();
    } else {
      set({
        timeRemainingSeconds: timeRemainingSeconds - 1,
        timeTakenSeconds: timeTakenSeconds + 1,
      });
    }
  },

  finishQuiz: async (userId = 'local_user') => {
    const {
      sessionId,
      questions,
      answers,
      timeLimitSeconds,
      timeTakenSeconds,
      certificationId,
      domainId,
      sessionType,
    } = get();

    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    const domainMap: Record<string, { total: number; correct: number; totalTime: number; name: string; number: number }> = {};
    const topicMisses: Record<string, { count: number; total: number; name: string; domainId: string }> = {};

    questions.forEach((q) => {
      const ans = answers[q.id];
      const dId = q.domain_id;

      if (!domainMap[dId]) {
        domainMap[dId] = {
          total: 0,
          correct: 0,
          totalTime: 0,
          name: `Domain ${q.domain_id.slice(-1)}`,
          number: parseInt(q.domain_id.slice(-1)) || 1,
        };
      }

      domainMap[dId].total += 1;
      const spent = ans?.time_taken_seconds || 0;
      domainMap[dId].totalTime += spent;

      if (ans && ans.status === 'answered') {
        if (ans.is_correct) {
          correctCount += 1;
          domainMap[dId].correct += 1;
        } else {
          incorrectCount += 1;
          if (q.topic_id) {
            if (!topicMisses[q.topic_id]) {
              topicMisses[q.topic_id] = { count: 0, total: 0, name: q.tags?.[0] || 'Topic Concept', domainId: q.domain_id };
            }
            topicMisses[q.topic_id].count += 1;
            topicMisses[q.topic_id].total += 1;
          }
        }
      } else {
        skippedCount += 1;
      }
    });

    const scorePercent = questions.length > 0
      ? Math.round((correctCount / questions.length) * 100)
      : 0;
    const passed = scorePercent >= 80;

    const domainBreakdown: DomainScore[] = Object.entries(domainMap).map(([id, d]) => ({
      domainId: id,
      domainName: d.name,
      domainNumber: d.number,
      totalQuestions: d.total,
      correctCount: d.correct,
      accuracy: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0,
      avgTimeSeconds: d.total > 0 ? Math.round(d.totalTime / d.total) : 0,
    }));

    const weakConcepts: WeakConcept[] = Object.entries(topicMisses).map(([tId, t]) => ({
      topicId: tId,
      topicName: t.name,
      domainId: t.domainId,
      incorrectCount: t.count,
      totalAttempts: t.total,
      accuracy: Math.round(((t.total - t.count) / t.total) * 100),
      suggestedAction: t.count >= 3 ? 'relearn' : 'repair_set',
    }));

    const result: QuizResult = {
      sessionId: sessionId || uuidv4(),
      totalQuestions: questions.length,
      totalAnswered: correctCount + incorrectCount,
      totalCorrect: correctCount,
      totalIncorrect: incorrectCount,
      totalSkipped: skippedCount,
      scorePercent,
      passed,
      timeTakenSeconds,
      timeAllocatedSeconds: timeLimitSeconds,
      domainBreakdown,
      weakConcepts,
    };

    set({
      isTimerRunning: false,
      isCompleted: true,
      result,
    });

    // Update Dexie & sync queue
    if (sessionId) {
      const activeUserId = userId || useAuthStore.getState().user?.id || 'anonymous';
      const completedSession: QuizSession = {
        id: sessionId,
        user_id: activeUserId,
        certification_id: certificationId,
        domain_id: domainId,
        topic_id: null,
        session_type: sessionType,
        total_questions: questions.length,
        time_limit_seconds: timeLimitSeconds,
        started_at: new Date(Date.now() - timeTakenSeconds * 1000).toISOString(),
        completed_at: new Date().toISOString(),
        total_correct: correctCount,
        total_incorrect: incorrectCount,
        total_skipped: skippedCount,
        score_percent: scorePercent,
        passed,
        status: 'completed',
        created_at: new Date().toISOString(),
      };

      await db.quizSessions.put(completedSession);
      await enqueueSync('quiz_sessions', sessionId, 'update', completedSession as any, uuidv4());
    }

    return result;
  },

  resetQuiz: () => {
    set({
      sessionId: null,
      questions: [],
      currentIndex: 0,
      answers: {},
      flaggedQuestionIds: new Set<string>(),
      selectedAnswer: null,
      isAnswerSubmitted: false,
      isTimerRunning: false,
      isPaused: false,
      isCompleted: false,
      result: null,
    });
  },
}));
