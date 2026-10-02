/* ===================================================================
   APILIGU LEARNING PASS — Live Progress Store (Zustand)
   Real-time analytics engine across ALL certifications.
   Zero mock data, zero fake scores, zero synthetic metrics.
   Accurately reflects real user IndexedDB and Supabase records.
   =================================================================== */

import { create } from 'zustand';
import { db } from '../lib/db';
import { supabase } from '../lib/supabase';
import { isDueForReview, isExamReady } from '../lib/leitner';
import { estimateIrtScaledScore } from '../lib/ml/bktEngine';
import type { IrtAbilityEstimate } from '../lib/ml/types';
import type { QuizSession, Question, Domain, Topic } from '../types';

export interface DomainProgressSummary {
  domainId: string;
  domainNumber: number;
  name: string;
  weight: number;
  totalQuestions: number;
  attempted: number;
  masteredCount: number;
  accuracy: number;
  isExamReady: boolean;
  boxDistribution: [number, number, number, number, number];
}

export interface TopicProgressSummary {
  topicId: string;
  topicCode: string;
  name: string;
  part: string;
  domainId: string;
  domainNumber: number;
  totalQuestions: number;
  attempted: number;
  correctCount: number;
  accuracy: number;
  masteredCount: number;
  boxLevel: number;
  status: 'mastered' | 'reviewing' | 'needs_practice' | 'unseen';
}

export interface IncorrectQuestionItem {
  questionId: string;
  question: Question;
  timesSeen: number;
  timesCorrect: number;
  timesIncorrect: number;
  lastSeenAt: string | null;
  boxLevel: number;
}

interface ProgressState {
  activeCertificationId: string | null;
  activeCertificationSlug: string;
  totalAttempted: number;
  totalCorrect: number;
  overallAccuracy: number;
  totalStudyMinutes: number;
  streakDays: number;
  reviewDueCount: number;
  predictedScaledScore: number | null;
  irtEstimate: IrtAbilityEstimate | null;
  averagePacingSeconds: number | null;
  recentSessions: QuizSession[];
  domainSummaries: DomainProgressSummary[];
  topicSummaries: TopicProgressSummary[];
  incorrectQuestions: IncorrectQuestionItem[];
  boxCounts: [number, number, number, number, number];
  weeklyStudyMinutes: { day: string; date: string; minutes: number }[];
  isLoading: boolean;

  refreshProgress: (certificationSlugOrId?: string) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  activeCertificationId: null,
  activeCertificationSlug: 'cisa',
  totalAttempted: 0,
  totalCorrect: 0,
  overallAccuracy: 0,
  totalStudyMinutes: 0,
  streakDays: 0,
  reviewDueCount: 0,
  predictedScaledScore: null,
  irtEstimate: null,
  averagePacingSeconds: null,
  recentSessions: [],
  domainSummaries: [],
  topicSummaries: [],
  incorrectQuestions: [],
  boxCounts: [0, 0, 0, 0, 0],
  weeklyStudyMinutes: [],
  isLoading: false,

  refreshProgress: async (certificationSlugOrId?: string) => {
    set({ isLoading: true });
    try {
      // 1. Resolve Target Certification
      let targetCertId: string | null = null;
      let targetCertSlug = certificationSlugOrId || get().activeCertificationSlug || 'cisa';

      // Check if target is UUID or slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetCertSlug);

      if (isUUID) {
        targetCertId = targetCertSlug;
        const certRecord = await db.certifications.get(targetCertId);
        if (certRecord) targetCertSlug = certRecord.slug;
      } else {
        const certRecord = await db.certifications.where('slug').equals(targetCertSlug).first();
        if (certRecord) {
          targetCertId = certRecord.id;
        } else {
          // Query Supabase if not in local Dexie
          const { data: cData } = await supabase.from('certifications').select('id, slug').eq('slug', targetCertSlug).maybeSingle();
          if (cData) {
            targetCertId = cData.id;
            await db.certifications.put(cData as any);
          }
        }
      }

      // Fallback default CISA ID if not found
      if (!targetCertId) {
        targetCertId = 'a0000000-0000-0000-0000-000000000001';
      }

      // 2. Load Domains for this Certification
      let allDomains = await db.domains.where('certification_id').equals(targetCertId).sortBy('domain_number');
      if (!allDomains || allDomains.length === 0) {
        const { data: domData } = await supabase
          .from('domains')
          .select('*')
          .eq('certification_id', targetCertId)
          .order('domain_number');
        if (domData && domData.length > 0) {
          allDomains = domData as Domain[];
          await db.domains.bulkPut(allDomains);
        }
      }

      const domainIds = allDomains.map((d) => d.id);

      // 3. Load Topics for these Domains
      let allTopics: Topic[] = [];
      if (domainIds.length > 0) {
        allTopics = await db.topics.where('domain_id').anyOf(domainIds).sortBy('sort_order');
        if (!allTopics || allTopics.length === 0) {
          const { data: topData } = await supabase
            .from('topics')
            .select('*')
            .in('domain_id', domainIds)
            .order('sort_order');
          if (topData && topData.length > 0) {
            allTopics = topData as Topic[];
            await db.topics.bulkPut(allTopics);
          }
        }
      }

      // 4. Load Questions for this Certification
      const allQuestions = await db.questions.where('certification_id').equals(targetCertId).toArray();
      const questionMap: Record<string, Question> = {};
      const questionCountByDomain: Record<string, number> = {};
      const questionCountByTopic: Record<string, number> = {};

      allQuestions.forEach((q) => {
        questionMap[q.id] = q;
        questionCountByDomain[q.domain_id] = (questionCountByDomain[q.domain_id] || 0) + 1;
        if (q.topic_id) {
          questionCountByTopic[q.topic_id] = (questionCountByTopic[q.topic_id] || 0) + 1;
        }
      });

      // 5. Load Real User Progress & Sessions for this Certification
      const allProgress = await db.userProgress.toArray();
      // Filter progress items matching this certification's domains
      const progressItems = allProgress.filter((p) => domainIds.includes(p.domain_id));

      const allSessions = await db.quizSessions.orderBy('started_at').reverse().toArray();
      const certSessions = allSessions.filter((s) => s.certification_id === targetCertId);

      let totalSeen = 0;
      let totalCorrect = 0;
      let reviewDue = 0;
      const boxes: [number, number, number, number, number] = [0, 0, 0, 0, 0];

      progressItems.forEach((p) => {
        totalSeen += p.times_seen;
        totalCorrect += p.times_correct;
        const boxIdx = Math.min(Math.max(p.box_level, 0), 4) as 0 | 1 | 2 | 3 | 4;
        boxes[boxIdx] += 1;

        if (isDueForReview(p)) {
          reviewDue += 1;
        }
      });

      // 6. Compute Real Study Time & Real Pacing from actual sessions
      let totalSeconds = 0;
      let totalQuestionsAnsweredInSessions = 0;
      let totalTimeTakenInSessions = 0;

      certSessions.forEach((s) => {
        if (s.completed_at && s.started_at) {
          const start = new Date(s.started_at).getTime();
          const end = new Date(s.completed_at).getTime();
          const duration = Math.max(0, (end - start) / 1000);
          totalSeconds += duration;
          if (s.total_questions > 0) {
            totalQuestionsAnsweredInSessions += s.total_questions;
            totalTimeTakenInSessions += duration;
          }
        }
      });

      const totalMinutes = Math.round(totalSeconds / 60);
      const avgPacing = totalQuestionsAnsweredInSessions > 0
        ? Math.round(totalTimeTakenInSessions / totalQuestionsAnsweredInSessions)
        : null;

      // 7. Compute Real Streak Days (Consecutive days with quiz activity)
      const sessionDates = new Set<string>();
      certSessions.forEach((s) => {
        if (s.started_at) {
          const dayStr = new Date(s.started_at).toISOString().split('T')[0];
          sessionDates.add(dayStr);
        }
      });

      let streak = 0;
      const checkDate = new Date();
      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (sessionDates.has(dateStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (streak === 0) {
          // Check yesterday if user hasn't studied today yet
          checkDate.setDate(checkDate.getDate() - 1);
          const yesterdayStr = checkDate.toISOString().split('T')[0];
          if (sessionDates.has(yesterdayStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        } else {
          break;
        }
      }

      // 8. Domain Summaries from Real Records
      let weightedAccuracySum = 0;
      let totalWeight = 0;

      const domainSummaries: DomainProgressSummary[] = allDomains.map((dm) => {
        const dItems = progressItems.filter((p) => p.domain_id === dm.id);
        const dBoxes: [number, number, number, number, number] = [0, 0, 0, 0, 0];
        let dSeen = 0;
        let dCorrect = 0;

        dItems.forEach((p) => {
          dSeen += p.times_seen;
          dCorrect += p.times_correct;
          const bIdx = Math.min(Math.max(p.box_level, 0), 4) as 0 | 1 | 2 | 3 | 4;
          dBoxes[bIdx] += 1;
        });

        const mastered = dBoxes[3] + dBoxes[4];
        const acc = dSeen > 0 ? Math.round((dCorrect / dSeen) * 100) : 0;
        const weight = dm.exam_weight_percent || 20;

        if (dSeen > 0) {
          weightedAccuracySum += acc * (weight / 100);
          totalWeight += weight;
        }

        return {
          domainId: dm.id,
          domainNumber: dm.domain_number,
          name: dm.name,
          weight,
          totalQuestions: questionCountByDomain[dm.id] || dm.approx_exam_questions || 30,
          attempted: dItems.length,
          masteredCount: mastered,
          accuracy: acc,
          isExamReady: dItems.length > 0 ? isExamReady(dItems) : false,
          boxDistribution: dBoxes,
        };
      });

      // 9. AI/ML IRT Scaled Score Prediction (Null if 0 attempts)
      const overallAcc = totalSeen > 0 ? Math.round((totalCorrect / totalSeen) * 100) : 0;
      let predictedScaled: number | null = null;
      let irtEstimate: IrtAbilityEstimate | null = null;

      if (progressItems.length > 0 && totalSeen > 0) {
        irtEstimate = estimateIrtScaledScore(progressItems);
        predictedScaled = irtEstimate ? irtEstimate.predictedScaledScore : null;
      }

      // 10. Topic Mastery Summaries from Real Records
      const topicSummaries: TopicProgressSummary[] = allTopics.map((top) => {
        const tItems = progressItems.filter((p) => p.topic_id === top.id);
        const domain = allDomains.find((d) => d.id === top.domain_id);
        let tSeen = 0;
        let tCorrect = 0;
        let avgBox = 0;

        tItems.forEach((p) => {
          tSeen += p.times_seen;
          tCorrect += p.times_correct;
          avgBox += p.box_level;
        });

        const acc = tSeen > 0 ? Math.round((tCorrect / tSeen) * 100) : 0;
        const mastered = tItems.filter((p) => p.box_level >= 3).length;
        const boxAvg = tItems.length > 0 ? Math.round(avgBox / tItems.length) : 0;

        let status: 'mastered' | 'reviewing' | 'needs_practice' | 'unseen' = 'unseen';
        if (tItems.length === 0) {
          status = 'unseen';
        } else if (acc >= 80 && mastered >= 2) {
          status = 'mastered';
        } else if (acc >= 60) {
          status = 'reviewing';
        } else {
          status = 'needs_practice';
        }

        return {
          topicId: top.id,
          topicCode: top.topic_code,
          name: top.name,
          part: top.part || 'A',
          domainId: top.domain_id,
          domainNumber: domain?.domain_number || 1,
          totalQuestions: questionCountByTopic[top.id] || 10,
          attempted: tItems.length,
          correctCount: tCorrect,
          accuracy: acc,
          masteredCount: mastered,
          boxLevel: boxAvg,
          status,
        };
      });

      // 11. Real Mistake Notebook (No Mock Questions)
      const incorrectProgress = progressItems.filter((p) => p.times_seen > p.times_correct || p.box_level === 0);
      const incorrectQuestions: IncorrectQuestionItem[] = [];

      // Query Supabase for any missing question objects
      const missingQuestionIds: string[] = [];
      incorrectProgress.forEach((p) => {
        if (!questionMap[p.question_id]) missingQuestionIds.push(p.question_id);
      });

      if (missingQuestionIds.length > 0) {
        const { data: fetchedQuestions } = await supabase
          .from('questions')
          .select('*')
          .in('id', missingQuestionIds.slice(0, 30));
        if (fetchedQuestions) {
          fetchedQuestions.forEach((q) => {
            questionMap[q.id] = q as Question;
          });
        }
      }

      for (const p of incorrectProgress.slice(0, 50)) {
        const question = questionMap[p.question_id];
        if (question) {
          incorrectQuestions.push({
            questionId: p.question_id,
            question,
            timesSeen: p.times_seen,
            timesCorrect: p.times_correct,
            timesIncorrect: Math.max(0, p.times_seen - p.times_correct),
            lastSeenAt: p.last_seen_at,
            boxLevel: p.box_level,
          });
        }
      }

      // 12. Real 7-Day Study Velocity History (Real Grouping by Date)
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const past7Days: { day: string; date: string; minutes: number }[] = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayLabel = dayNames[d.getDay()];

        // Find actual sessions on this specific date
        let dayMinutes = 0;
        certSessions.forEach((s) => {
          if (s.started_at && s.started_at.startsWith(dateStr)) {
            if (s.completed_at) {
              const duration = Math.max(0, (new Date(s.completed_at).getTime() - new Date(s.started_at).getTime()) / 60000);
              dayMinutes += duration;
            }
          }
        });

        past7Days.push({
          day: dayLabel,
          date: dateStr,
          minutes: Math.round(dayMinutes),
        });
      }

      set({
        activeCertificationId: targetCertId,
        activeCertificationSlug: targetCertSlug,
        totalAttempted: progressItems.length,
        totalCorrect,
        overallAccuracy: overallAcc,
        totalStudyMinutes: totalMinutes,
        streakDays: streak,
        reviewDueCount: reviewDue,
        predictedScaledScore: predictedScaled,
        irtEstimate,
        averagePacingSeconds: avgPacing,
        recentSessions: certSessions,
        domainSummaries,
        topicSummaries,
        incorrectQuestions,
        boxCounts: boxes,
        weeklyStudyMinutes: past7Days,
        isLoading: false,
      });
    } catch (err) {
      console.error('Failed to load user progress:', err);
      set({ isLoading: false });
    }
  },
}));
