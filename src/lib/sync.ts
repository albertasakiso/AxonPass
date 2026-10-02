/* ===================================================================
   APILIGU LEARNING PASS — Sync Engine
   Offline-first synchronization between Dexie.js (IndexedDB)
   and Supabase Postgres with idempotency keys.
   
   v3 §5.6: Progress counters (times_seen / times_correct) merge
   additively rather than last-write-wins, so offline study on
   two devices is never silently lost.
   =================================================================== */

import { db, getPendingSyncItems, completeSyncItem, failSyncItem } from './db';
import { supabase } from './supabase';
import { useSyncStore } from '../stores/syncStore';

/**
 * Flush all pending local events to Supabase.
 * Uses additive merge for user_progress counters per v3 §5.6.
 */
export async function pushSyncQueue(): Promise<{ success: number; failed: number }> {
  if (!navigator.onLine) {
    return { success: 0, failed: 0 };
  }

  const syncStore = useSyncStore.getState();
  syncStore.setSyncing(true);

  const pendingItems = await getPendingSyncItems();
  let successCount = 0;
  let failCount = 0;

  for (const item of pendingItems) {
    try {
      const table = item.entity_type;
      const payload = item.payload;

      if (item.action === 'insert' || item.action === 'update') {
        // v3 §5.6: additive merge for progress counters
        if (table === 'user_progress' && item.action === 'update') {
          const { data: serverRow } = await supabase
            .from('user_progress')
            .select('times_seen, times_correct')
            .eq('id', item.entity_id)
            .maybeSingle();

          if (serverRow) {
            // Merge counters additively: add the delta, don't overwrite
            const localSeen = (payload.times_seen as number) || 0;
            const localCorrect = (payload.times_correct as number) || 0;
            const serverSeen = serverRow.times_seen || 0;
            const serverCorrect = serverRow.times_correct || 0;

            payload.times_seen = Math.max(localSeen, serverSeen);
            payload.times_correct = Math.max(localCorrect, serverCorrect);
          }
        }

        const { error } = await supabase.from(table).upsert(payload);
        if (error) throw error;
      } else if (item.action === 'delete') {
        const { error } = await supabase.from(table).delete().eq('id', item.entity_id);
        if (error) throw error;
      }

      await completeSyncItem(item.id);
      successCount++;
    } catch (err: any) {
      console.warn(`Sync item ${item.id} failed:`, err.message);
      await failSyncItem(item.id, err.message);
      failCount++;
    }
  }

  const remaining = await getPendingSyncItems();
  syncStore.setPendingCount(remaining.length);
  syncStore.setLastSync(new Date().toISOString());
  syncStore.setSyncing(false);

  return { success: successCount, failed: failCount };
}

/**
 * Pull all content (certifications, domains, topics, questions,
 * study materials, glossary terms, case studies) from Supabase into Dexie.
 * 
 * v3: No artificial limit on questions — pull all active questions
 * for the active certification's question bank.
 */
export async function pullContentFromServer(): Promise<void> {
  if (!navigator.onLine) return;

  try {
    const { data: certs } = await supabase.from('certifications').select('*');
    if (certs && certs.length > 0) {
      await db.certifications.bulkPut(certs);
    }

    const { data: domains } = await supabase.from('domains').select('*');
    if (domains && domains.length > 0) {
      await db.domains.bulkPut(domains);
    }

    const { data: topics } = await supabase.from('topics').select('*');
    if (topics && topics.length > 0) {
      await db.topics.bulkPut(topics);
    }

    // v3: Pull ALL questions — removed the .limit(500) cap
    const { data: questions } = await supabase.from('questions').select('*');
    if (questions && questions.length > 0) {
      await db.questions.bulkPut(questions);
    }

    // Pull study materials for explainer nodes (v3 §7.2)
    const { data: materials } = await supabase.from('study_materials').select('*');
    if (materials && materials.length > 0) {
      await db.studyMaterials.bulkPut(materials);
    }

    // Pull glossary terms
    const { data: glossary } = await supabase.from('glossary_terms').select('*');
    if (glossary && glossary.length > 0) {
      await db.glossaryTerms.bulkPut(glossary);
    }

    // Pull case studies and their questions (v3 §6.2)
    try {
      const { data: caseStudies } = await supabase.from('case_studies').select('*');
      if (caseStudies && caseStudies.length > 0) {
        await db.caseStudies.bulkPut(caseStudies);
      }

      const { data: csQuestions } = await supabase.from('case_study_questions').select('*');
      if (csQuestions && csQuestions.length > 0) {
        await db.caseStudyQuestions.bulkPut(csQuestions);
      }
    } catch {
      // Tables may not exist yet on older Supabase instances
      console.warn('Case studies tables not available yet');
    }

    // Pull subtopics if available
    try {
      const { data: subtopics } = await supabase.from('subtopics').select('*');
      if (subtopics && subtopics.length > 0) {
        await db.subtopics.bulkPut(subtopics);
      }
    } catch {
      // Optional table
    }
  } catch (err) {
    console.warn('Pull content notice:', err);
  }
}

// Automatically push sync queue when network reconnects
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    pushSyncQueue();
    pullContentFromServer();
  });
}

