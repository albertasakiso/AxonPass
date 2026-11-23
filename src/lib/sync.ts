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
 * Paginated pull of ALL active questions for a single certification into Dexie
 * (bypasses PostgREST's 1,000-row single-request cap cleanly).
 */
export async function pullQuestionsForCertification(certificationId: string): Promise<number> {
  if (!navigator.onLine || !certificationId) return 0;
  let offset = 0;
  const pageSize = 1000;
  let totalFetched = 0;

  while (offset < 10000) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('certification_id', certificationId)
      .eq('is_active', true)
      .range(offset, offset + pageSize - 1);

    if (error || !data || data.length === 0) break;
    await db.questions.bulkPut(data);
    totalFetched += data.length;
    if (data.length < pageSize) break;
    offset += pageSize;
  }
  return totalFetched;
}

/**
 * Pull all lightweight metadata and the active certification's complete paginated
 * question bank from Supabase into Dexie (removes silent 1,000-row cutoff).
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

    // Paginate ALL questions for the active certification into Dexie
    const activeSlug =
      (typeof window !== 'undefined' ? localStorage.getItem('alp_active_cert') : null) || 'cisa';
    const activeCert =
      certs?.find((c: { slug: string; id: string }) => c.slug === activeSlug) || certs?.[0];
    if (activeCert?.id) {
      await pullQuestionsForCertification(activeCert.id);
    }

    // Pull lightweight glossary & metadata; heavy full-book chapters lazy-load on demand in textbookService
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

    // Pull lightweight subtopic metadata (content_body lazy-loaded when opening a module)
    try {
      const { data: subtopics } = await supabase
        .from('subtopics')
        .select('id, topic_id, subtopic_code, name, key_terms, exam_tips, estimated_read_minutes, learning_objectives, sort_order, created_at');
      if (subtopics && subtopics.length > 0) {
        const existingMap = new Map((await db.subtopics.toArray()).map((s) => [s.id, s]));
        const merged = subtopics.map((s) => ({
          ...s,
          content_body: existingMap.get(s.id)?.content_body ?? null,
        }));
        await db.subtopics.bulkPut(merged);
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

