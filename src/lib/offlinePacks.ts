/* ===================================================================
   ANOXPASS — On-Demand Per-Certification Offline Study Pack Manager
   Caches paginated exam questions (Dexie) and unabridged textbook
   chapters/sections (localStorage cache) for airplane-mode study.
   =================================================================== */

import { supabase } from './supabase';
import { db } from './db';
import { pullQuestionsForCertification } from './sync';
import { fetchTextbooksForCert, fetchChapterSections, toDbCertSlug } from './textbookService';

export interface OfflinePackStatus {
  certSlug: string;
  cachedQuestions: number;
  cachedChapters: number;
  estimatedMb: number;
}

export function getOfflinePackStatus(certSlug: string, cachedQuestions = 0): OfflinePackStatus {
  const dbSlug = toDbCertSlug(certSlug);
  let bytes = cachedQuestions * 950;
  let cachedChapters = 0;

  if (typeof window !== 'undefined') {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || '';
      if (k.startsWith('anoxpass_tb_ch_v1_')) {
        const val = localStorage.getItem(k) || '';
        if (val.includes(dbSlug)) {
          cachedChapters++;
          bytes += val.length * 2;
        }
      }
    }
  }

  return {
    certSlug: dbSlug,
    cachedQuestions,
    cachedChapters,
    estimatedMb: Number((bytes / (1024 * 1024)).toFixed(2)),
  };
}

export async function inspectCachedQuestionCount(certSlug: string): Promise<number> {
  const cert = await db.certifications.where('slug').equals(toDbCertSlug(certSlug)).first();
  if (!cert) return db.questions.count();
  return db.questions.where('certification_id').equals(cert.id).count();
}

export async function downloadCertificationOfflinePack(
  certSlug: string,
  onProgress?: (message: string) => void
): Promise<{ questionsCached: number; chaptersCached: number }> {
  const dbSlug = toDbCertSlug(certSlug);
  onProgress?.(`Fetching certification blueprint for ${dbSlug.toUpperCase()}...`);

  const { data: certRow } = await supabase
    .from('certifications')
    .select('*')
    .eq('slug', dbSlug)
    .maybeSingle();

  let questionsCached = 0;
  if (certRow?.id) {
    await db.certifications.put(certRow);
    onProgress?.(`Downloading paginated question bank for ${dbSlug.toUpperCase()}...`);
    questionsCached = await pullQuestionsForCertification(certRow.id);
  }

  onProgress?.(`Loading textbook hierarchy for ${dbSlug.toUpperCase()}...`);
  const { chapters } = await fetchTextbooksForCert(dbSlug);
  let chaptersCached = 0;
  // Cache up to 40 primary chapters synchronously in batches of 4 for safe browser storage footprint
  const targetChapters = chapters.slice(0, 40);
  for (let i = 0; i < targetChapters.length; i += 4) {
    const batch = targetChapters.slice(i, i + 4);
    await Promise.all(batch.map((ch) => fetchChapterSections(ch.id)));
    chaptersCached += batch.length;
    onProgress?.(`Cached ${chaptersCached}/${targetChapters.length} textbook chapters offline...`);
  }

  return { questionsCached, chaptersCached };
}

export async function clearOfflineChapterCache(): Promise<void> {
  if (typeof window !== 'undefined') {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || '';
      if (k.startsWith('anoxpass_tb_ch_v1_')) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  }
}
