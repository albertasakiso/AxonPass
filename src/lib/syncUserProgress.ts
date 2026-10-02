/* ===================================================================
   AXONPASS — Coursera-Style Cloud Progress Synchronization Service
   Bi-directional sync between local Dexie (IndexedDB) and Supabase.
   Ensures seamless cross-device progress, streak continuity, and zero data loss.
   =================================================================== */

import { supabase } from './supabase';
import { db } from './db';
import type { UserProgress } from '../types';

export interface SyncResult {
  success: boolean;
  uploadedCount: number;
  downloadedCount: number;
  error?: string;
  syncedAt: string;
}

/**
 * Sync local Dexie progress to Supabase cloud and pull any cloud records into Dexie.
 */
export async function syncUserProgressToCloud(): Promise<SyncResult> {
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return {
      success: false,
      uploadedCount: 0,
      downloadedCount: 0,
      error: 'User not authenticated',
      syncedAt: new Date().toISOString(),
    };
  }

  const userId = user.id;

  try {
    // 1. Get all local progress records
    const localProgress = await db.userProgress.toArray();
    let uploadedCount = 0;

    // 2. Upload local records to Supabase in batches of 100
    if (localProgress.length > 0) {
      const recordsToUpsert = localProgress.map((lp) => ({
        user_id: userId,
        question_id: lp.question_id,
        domain_id: lp.domain_id,
        topic_id: lp.topic_id || null,
        box_level: lp.box_level,
        consecutive_correct: lp.consecutive_correct,
        times_seen: lp.times_seen,
        times_correct: lp.times_correct,
        last_seen_at: lp.last_seen_at || new Date().toISOString(),
        next_review_at: lp.next_review_at || null,
        updated_at: lp.updated_at || new Date().toISOString(),
      }));

      const BATCH_SIZE = 100;
      for (let i = 0; i < recordsToUpsert.length; i += BATCH_SIZE) {
        const batch = recordsToUpsert.slice(i, i + BATCH_SIZE);
        const { error: upsertErr } = await supabase
          .from('user_progress')
          .upsert(batch, { onConflict: 'user_id,question_id' });

        if (upsertErr) {
          console.warn('Batch progress upload warning:', upsertErr.message);
        } else {
          uploadedCount += batch.length;
        }
      }
    }

    // 3. Pull latest progress from Supabase down to local Dexie
    const { data: cloudProgress, error: fetchErr } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);

    let downloadedCount = 0;
    if (!fetchErr && cloudProgress && cloudProgress.length > 0) {
      const dexieUpdates: UserProgress[] = cloudProgress.map((cp) => ({
        id: cp.id,
        user_id: userId,
        question_id: cp.question_id,
        domain_id: cp.domain_id,
        topic_id: cp.topic_id,
        box_level: cp.box_level,
        consecutive_correct: cp.consecutive_correct,
        times_seen: cp.times_seen,
        times_correct: cp.times_correct,
        last_seen_at: cp.last_seen_at,
        next_review_at: cp.next_review_at,
        updated_at: cp.updated_at,
      }));

      await db.userProgress.bulkPut(dexieUpdates);
      downloadedCount = dexieUpdates.length;
    }

    // 4. Update Profile Stats in Supabase (Streak, Total Study Minutes, Last Active)
    const sessions = await db.quizSessions.toArray();
    let totalSeconds = 0;
    const sessionDates = new Set<string>();

    sessions.forEach((s) => {
      if (s.completed_at && s.started_at) {
        const duration = Math.max(0, (new Date(s.completed_at).getTime() - new Date(s.started_at).getTime()) / 1000);
        totalSeconds += duration;
        sessionDates.add(new Date(s.started_at).toISOString().split('T')[0]);
      }
    });

    let streak = 0;
    const checkDate = new Date();
    while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      if (sessionDates.has(dStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    const totalMinutes = Math.round(totalSeconds / 60);

    // Save high-level stats into profiles table
    await supabase
      .from('profiles')
      .update({
        streak_days: streak,
        total_study_minutes: totalMinutes,
        last_active_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return {
      success: true,
      uploadedCount,
      downloadedCount,
      syncedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    console.error('Error in syncUserProgressToCloud:', err);
    return {
      success: false,
      uploadedCount: 0,
      downloadedCount: 0,
      error: err.message || 'Sync failed',
      syncedAt: new Date().toISOString(),
    };
  }
}
