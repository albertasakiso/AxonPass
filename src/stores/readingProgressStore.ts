/* ===================================================================
   ANOXPASS — Cross-Device Reading & Read-Aloud Progress Store
   Tracks section status, audio sentence resume index, highlights,
   bookmarks, personal notes, and chapter quiz scores with Supabase
   Realtime + localStorage offline fallback.
   =================================================================== */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { realtimeSync } from '../lib/realtimeSync';
import { toDbCertSlug } from '../lib/textbookService';
import { useAcademyProgressStore } from './academyProgressStore';

export type ReadingStatus = 'unread' | 'in_progress' | 'completed' | 'relearn';

export interface ReadingHighlight {
  id: string;
  text: string;
  color: 'amber' | 'green' | 'blue';
  createdAt: string;
}

export interface ReadingProgressRecord {
  certificationSlug: string;
  textbookId: string;
  chapterId: string;
  sectionId: string;
  status: ReadingStatus;
  scrollPct: number;
  lastSentenceIndex: number;
  highlights: ReadingHighlight[];
  notesMarkdown: string;
  bookmarked: boolean;
  chapterQuizBestPct?: number;
  updatedAt: string;
}

export interface LastReadPointer {
  certificationSlug: string;
  textbookId: string;
  chapterId: string;
  sectionId: string;
  sectionTitle: string;
  sentenceIndex: number;
  updatedAt: string;
}

export interface SectionMetaInput {
  certificationSlug: string;
  textbookId: string;
  chapterId: string;
  sectionId: string;
  sectionTitle?: string;
}

interface ReadingProgressState {
  records: Record<string, ReadingProgressRecord>;
  lastReadByCert: Record<string, LastReadPointer>;
  chapterQuizScores: Record<string, number>;

  loadForCert: (certSlug: string) => Promise<void>;
  setSectionStatus: (meta: SectionMetaInput, status: ReadingStatus) => void;
  saveAudioPosition: (meta: SectionMetaInput, sentenceIndex: number, scrollPct?: number) => void;
  toggleBookmark: (meta: SectionMetaInput) => boolean;
  addHighlight: (meta: SectionMetaInput, text: string, color?: ReadingHighlight['color']) => void;
  removeHighlight: (meta: SectionMetaInput, highlightId: string) => void;
  saveNotes: (meta: SectionMetaInput, notesMarkdown: string) => void;
  recordChapterQuizScore: (chapterId: string, scorePct: number) => void;
  getSectionRecord: (sectionId: string) => ReadingProgressRecord | undefined;
  getCertReadingStats: (sectionIds: string[]) => {
    completed: number;
    relearn: number;
    bookmarked: number;
    total: number;
    percent: number;
  };
}

function makeDefaultRecord(meta: SectionMetaInput): ReadingProgressRecord {
  return {
    certificationSlug: toDbCertSlug(meta.certificationSlug),
    textbookId: meta.textbookId,
    chapterId: meta.chapterId,
    sectionId: meta.sectionId,
    status: 'unread',
    scrollPct: 0,
    lastSentenceIndex: 0,
    highlights: [],
    notesMarkdown: '',
    bookmarked: false,
    updatedAt: new Date().toISOString(),
  };
}

let audioSyncTimer: ReturnType<typeof setTimeout> | null = null;

function pushProgressRow(rec: ReadingProgressRecord) {
  void realtimeSync.upsertRow(
    'user_reading_progress',
    {
      certification_slug: rec.certificationSlug,
      textbook_id: rec.textbookId,
      chapter_id: rec.chapterId,
      section_id: rec.sectionId,
      status: rec.status,
      scroll_pct: rec.scrollPct,
      last_sentence_index: rec.lastSentenceIndex,
      highlights_json: rec.highlights,
      notes_markdown: rec.notesMarkdown,
      bookmarked: rec.bookmarked,
      chapter_quiz_best_pct: rec.chapterQuizBestPct ?? null,
      updated_at: rec.updatedAt,
    },
    'user_id,section_id'
  );
}

export const useReadingProgressStore = create<ReadingProgressState>()(
  persist(
    (set, get) => ({
      records: {},
      lastReadByCert: {},
      chapterQuizScores: {},

      loadForCert: async (certSlug: string) => {
        if (!isSupabaseConfigured || (typeof navigator !== 'undefined' && !navigator.onLine)) return;
        try {
          const { data: authData } = await supabase.auth.getUser();
          const userId = authData?.user?.id;
          if (!userId) return;

          const dbSlug = toDbCertSlug(certSlug);
          const { data, error } = await supabase
            .from('user_reading_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('certification_slug', dbSlug);

          if (error || !data) return;

          set((state) => {
            const nextRecords = { ...state.records };
            const nextChapterScores = { ...state.chapterQuizScores };
            let newest: LastReadPointer | null = state.lastReadByCert[dbSlug] || null;

            for (const row of data as Array<Record<string, unknown>>) {
              const secId = String(row.section_id || '');
              if (!secId) continue;
              const updatedAt = String(row.updated_at || new Date().toISOString());
              const existing = nextRecords[secId];
              if (!existing || updatedAt >= existing.updatedAt) {
                nextRecords[secId] = {
                  certificationSlug: dbSlug,
                  textbookId: String(row.textbook_id || ''),
                  chapterId: String(row.chapter_id || ''),
                  sectionId: secId,
                  status: (row.status as ReadingStatus) || 'unread',
                  scrollPct: Number(row.scroll_pct || 0),
                  lastSentenceIndex: Number(row.last_sentence_index || 0),
                  highlights: Array.isArray(row.highlights_json)
                    ? (row.highlights_json as ReadingHighlight[])
                    : [],
                  notesMarkdown: String(row.notes_markdown || ''),
                  bookmarked: Boolean(row.bookmarked),
                  chapterQuizBestPct:
                    typeof row.chapter_quiz_best_pct === 'number'
                      ? row.chapter_quiz_best_pct
                      : undefined,
                  updatedAt,
                };
              }
              if (typeof row.chapter_quiz_best_pct === 'number' && row.chapter_id) {
                const chId = String(row.chapter_id);
                nextChapterScores[chId] = Math.max(
                  nextChapterScores[chId] || 0,
                  row.chapter_quiz_best_pct
                );
              }
              if (!newest || updatedAt > newest.updatedAt) {
                newest = {
                  certificationSlug: dbSlug,
                  textbookId: String(row.textbook_id || ''),
                  chapterId: String(row.chapter_id || ''),
                  sectionId: secId,
                  sectionTitle: newest?.sectionTitle || 'Resume Section',
                  sentenceIndex: Number(row.last_sentence_index || 0),
                  updatedAt,
                };
              }
            }

            return {
              records: nextRecords,
              chapterQuizScores: nextChapterScores,
              lastReadByCert: newest
                ? { ...state.lastReadByCert, [dbSlug]: newest }
                : state.lastReadByCert,
            };
          });
        } catch (err) {
          console.warn('[ReadingProgressStore] loadForCert notice:', err);
        }
      },

      setSectionStatus: (meta, status) => {
        const now = new Date().toISOString();
        const dbSlug = toDbCertSlug(meta.certificationSlug);
        const prev = get().records[meta.sectionId] || makeDefaultRecord(meta);
        const wasCompleted = prev.status === 'completed';

        const updated: ReadingProgressRecord = {
          ...prev,
          certificationSlug: dbSlug,
          textbookId: meta.textbookId || prev.textbookId,
          chapterId: meta.chapterId || prev.chapterId,
          status,
          scrollPct: status === 'completed' ? 100 : prev.scrollPct,
          updatedAt: now,
        };

        set((state) => ({
          records: { ...state.records, [meta.sectionId]: updated },
          lastReadByCert: {
            ...state.lastReadByCert,
            [dbSlug]: {
              certificationSlug: dbSlug,
              textbookId: updated.textbookId,
              chapterId: updated.chapterId,
              sectionId: meta.sectionId,
              sectionTitle: meta.sectionTitle || state.lastReadByCert[dbSlug]?.sectionTitle || 'Section',
              sentenceIndex: updated.lastSentenceIndex,
              updatedAt: now,
            },
          },
        }));

        if (!wasCompleted && status === 'completed') {
          useAcademyProgressStore.getState().awardXp(25, `Completed textbook section`);
        }

        pushProgressRow(updated);
      },

      saveAudioPosition: (meta, sentenceIndex, scrollPct) => {
        const now = new Date().toISOString();
        const dbSlug = toDbCertSlug(meta.certificationSlug);
        const prev = get().records[meta.sectionId] || makeDefaultRecord(meta);
        const updated: ReadingProgressRecord = {
          ...prev,
          certificationSlug: dbSlug,
          textbookId: meta.textbookId || prev.textbookId,
          chapterId: meta.chapterId || prev.chapterId,
          status: prev.status === 'unread' ? 'in_progress' : prev.status,
          lastSentenceIndex: Math.max(0, sentenceIndex),
          scrollPct: scrollPct !== undefined ? scrollPct : prev.scrollPct,
          updatedAt: now,
        };

        set((state) => ({
          records: { ...state.records, [meta.sectionId]: updated },
          lastReadByCert: {
            ...state.lastReadByCert,
            [dbSlug]: {
              certificationSlug: dbSlug,
              textbookId: updated.textbookId,
              chapterId: updated.chapterId,
              sectionId: meta.sectionId,
              sectionTitle: meta.sectionTitle || state.lastReadByCert[dbSlug]?.sectionTitle || 'Section',
              sentenceIndex: updated.lastSentenceIndex,
              updatedAt: now,
            },
          },
        }));

        if (audioSyncTimer) clearTimeout(audioSyncTimer);
        audioSyncTimer = setTimeout(() => {
          pushProgressRow(updated);
        }, 1200);
      },

      toggleBookmark: (meta) => {
        const now = new Date().toISOString();
        const prev = get().records[meta.sectionId] || makeDefaultRecord(meta);
        const nextBookmarked = !prev.bookmarked;
        const updated: ReadingProgressRecord = {
          ...prev,
          certificationSlug: toDbCertSlug(meta.certificationSlug),
          bookmarked: nextBookmarked,
          updatedAt: now,
        };
        set((state) => ({
          records: { ...state.records, [meta.sectionId]: updated },
        }));
        pushProgressRow(updated);
        return nextBookmarked;
      },

      addHighlight: (meta, text, color = 'amber') => {
        const clean = text.trim();
        if (!clean) return;
        const now = new Date().toISOString();
        const prev = get().records[meta.sectionId] || makeDefaultRecord(meta);
        const highlight: ReadingHighlight = {
          id: `hl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
          text: clean,
          color,
          createdAt: now,
        };
        const updated: ReadingProgressRecord = {
          ...prev,
          certificationSlug: toDbCertSlug(meta.certificationSlug),
          highlights: [highlight, ...prev.highlights],
          updatedAt: now,
        };
        set((state) => ({
          records: { ...state.records, [meta.sectionId]: updated },
        }));
        pushProgressRow(updated);
      },

      removeHighlight: (meta, highlightId) => {
        const prev = get().records[meta.sectionId];
        if (!prev) return;
        const updated: ReadingProgressRecord = {
          ...prev,
          highlights: prev.highlights.filter((h) => h.id !== highlightId),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          records: { ...state.records, [meta.sectionId]: updated },
        }));
        pushProgressRow(updated);
      },

      saveNotes: (meta, notesMarkdown) => {
        const prev = get().records[meta.sectionId] || makeDefaultRecord(meta);
        const updated: ReadingProgressRecord = {
          ...prev,
          certificationSlug: toDbCertSlug(meta.certificationSlug),
          notesMarkdown,
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          records: { ...state.records, [meta.sectionId]: updated },
        }));
        pushProgressRow(updated);
      },

      recordChapterQuizScore: (chapterId, scorePct) => {
        set((state) => ({
          chapterQuizScores: {
            ...state.chapterQuizScores,
            [chapterId]: Math.max(state.chapterQuizScores[chapterId] || 0, scorePct),
          },
        }));
      },

      getSectionRecord: (sectionId) => get().records[sectionId],

      getCertReadingStats: (sectionIds) => {
        if (!sectionIds || sectionIds.length === 0) {
          return { completed: 0, relearn: 0, bookmarked: 0, total: 0, percent: 0 };
        }
        const recs = get().records;
        let completed = 0;
        let relearn = 0;
        let bookmarked = 0;
        for (const id of sectionIds) {
          const r = recs[id];
          if (!r) continue;
          if (r.status === 'completed') completed++;
          if (r.status === 'relearn') relearn++;
          if (r.bookmarked) bookmarked++;
        }
        return {
          completed,
          relearn,
          bookmarked,
          total: sectionIds.length,
          percent: Math.round((completed / sectionIds.length) * 100),
        };
      },
    }),
    { name: 'anoxpass-reading-progress-v1' }
  )
);
