/* ===================================================================
   ANOXPASS — Textbook Service & Lazy Chapter Cache
   Provides lightweight TOC metadata + on-demand lazy loading of full
   book-structured sections + Postgres Full-Text Search (search_tsv).
   =================================================================== */

import { supabase, isSupabaseConfigured } from './supabase';

export interface Textbook {
  id: string;
  certification_slug: string;
  certification_id: string | null;
  title: string;
  author: string | null;
  edition: string | null;
  source_file: string;
  is_primary: boolean;
  total_chapters: number;
  total_sections: number;
  total_words: number;
  est_read_hours: number;
  sort_order: number;
}

export interface TextbookChapter {
  id: string;
  textbook_id: string;
  certification_slug: string;
  domain_number: number | null;
  chapter_number: number;
  part_label: string | null;
  title: string;
  summary: string | null;
  learning_objectives: string[];
  key_takeaways: string[];
  page_start: number | null;
  page_end: number | null;
  word_count: number;
  est_read_minutes: number;
  sort_order: number;
}

export interface TextbookSection {
  id: string;
  chapter_id: string;
  textbook_id: string;
  certification_slug: string;
  section_code: string | null;
  title: string;
  heading_level: number;
  content_markdown: string;
  word_count: number;
  est_read_minutes: number;
  key_terms: string[];
  exam_tips: string | null;
  page_start: number | null;
  page_end: number | null;
  sort_order: number;
}

export interface TextbookSectionMeta {
  id: string;
  chapter_id: string;
  textbook_id: string;
  certification_slug: string;
  section_code: string | null;
  title: string;
  word_count: number;
  est_read_minutes: number;
  sort_order: number;
}

export interface TextbookSearchHit {
  id: string;
  chapter_id: string;
  textbook_id: string;
  certification_slug: string;
  section_code: string | null;
  title: string;
  snippet: string;
  word_count: number;
}

const COURSE_TO_DB_SLUG: Record<string, string> = {
  'aws-saa-c03': 'aws-csaa',
  'isc2-ccsp': 'ccsp',
  'comptia-cysa-plus': 'cysa',
  'grc-enterprise': 'grc',
  gslc: 'giac-security-leadership',
};

const DB_TO_COURSE_ID: Record<string, string> = {
  'aws-csaa': 'aws-saa-c03',
  ccsp: 'isc2-ccsp',
  cysa: 'comptia-cysa-plus',
  grc: 'grc-enterprise',
  'giac-security-leadership': 'gslc',
};

export function toDbCertSlug(slugOrId: string): string {
  const s = (slugOrId || '').trim().toLowerCase();
  return COURSE_TO_DB_SLUG[s] || s || 'cisa';
}

export function toCourseCertId(slugOrId: string): string {
  const s = (slugOrId || '').trim().toLowerCase();
  return DB_TO_COURSE_ID[s] || s || 'cisa';
}

// In-memory LRU-like chapter cache so switching back and forth is 0ms
const chapterSectionsCache = new Map<string, TextbookSection[]>();
const CACHE_KEY_PREFIX = 'anoxpass_tb_ch_v1_';

/**
 * Fetches lightweight textbook metadata, chapters, and section TOC (no heavy content_markdown).
 */
export async function fetchTextbooksForCert(certSlug: string): Promise<{
  textbooks: Textbook[];
  chapters: TextbookChapter[];
  sectionMetas: TextbookSectionMeta[];
}> {
  if (!isSupabaseConfigured) {
    return { textbooks: [], chapters: [], sectionMetas: [] };
  }

  const dbSlug = toDbCertSlug(certSlug);

  try {
    const { data: booksData, error: bErr } = await supabase
      .from('textbooks')
      .select('*')
      .eq('certification_slug', dbSlug)
      .order('sort_order');

    if (bErr || !booksData || booksData.length === 0) {
      return { textbooks: [], chapters: [], sectionMetas: [] };
    }

    const { data: chData } = await supabase
      .from('textbook_chapters')
      .select('*')
      .eq('certification_slug', dbSlug)
      .order('sort_order');

    const { data: secMetaData } = await supabase
      .from('textbook_sections')
      .select('id, chapter_id, textbook_id, certification_slug, section_code, title, word_count, est_read_minutes, sort_order')
      .eq('certification_slug', dbSlug)
      .order('sort_order');

    return {
      textbooks: booksData as Textbook[],
      chapters: (chData || []) as TextbookChapter[],
      sectionMetas: (secMetaData || []) as TextbookSectionMeta[],
    };
  } catch (err) {
    console.warn('[TextbookService] fetchTextbooksForCert fallback:', err);
    return { textbooks: [], chapters: [], sectionMetas: [] };
  }
}

/**
 * Lazy-loads full unabridged section markdown for a single chapter on demand,
 * caching cleanly in memory + localStorage for instant offline re-reading.
 */
export async function fetchChapterSections(chapterId: string): Promise<TextbookSection[]> {
  if (!chapterId) return [];

  const memHit = chapterSectionsCache.get(chapterId);
  if (memHit) return memHit;

  if (typeof window !== 'undefined') {
    try {
      const localRaw = window.localStorage.getItem(`${CACHE_KEY_PREFIX}${chapterId}`);
      if (localRaw) {
        const parsed = JSON.parse(localRaw) as TextbookSection[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          chapterSectionsCache.set(chapterId, parsed);
          return parsed;
        }
      }
    } catch {
      // Ignore corrupt cache
    }
  }

  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('textbook_sections')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('sort_order');

    if (error || !data) return [];

    const sections = data as TextbookSection[];
    chapterSectionsCache.set(chapterId, sections);

    if (typeof window !== 'undefined' && sections.length > 0) {
      try {
        const serialized = JSON.stringify(sections);
        // Only persist locally if chapter is <= 750 KB to respect browser localStorage limits
        if (serialized.length <= 750_000) {
          window.localStorage.setItem(`${CACHE_KEY_PREFIX}${chapterId}`, serialized);
        }
      } catch {
        // QuotaExceededError is non-fatal; memory cache still works
      }
    }

    return sections;
  } catch (err) {
    console.warn('[TextbookService] fetchChapterSections error:', err);
    return [];
  }
}

/**
 * Instant Postgres Full-Text Search across the entire certification textbook library.
 */
export async function searchFullTextbooks(
  certSlug: string,
  query: string,
  limit: number = 15
): Promise<TextbookSearchHit[]> {
  const cleanQ = query.trim();
  if (!isSupabaseConfigured || !cleanQ) return [];

  const dbSlug = toDbCertSlug(certSlug);

  try {
    const { data, error } = await supabase
      .from('textbook_sections')
      .select('id, chapter_id, textbook_id, certification_slug, section_code, title, content_markdown, word_count')
      .eq('certification_slug', dbSlug)
      .textSearch('search_tsv', cleanQ, { type: 'websearch', config: 'english' })
      .limit(limit);

    let rows = (data || []) as TextbookSection[];

    if ((error || rows.length === 0) && cleanQ.length >= 2) {
      const safeLike = cleanQ.replace(/[%_]/g, '');
      const { data: fallbackData } = await supabase
        .from('textbook_sections')
        .select('id, chapter_id, textbook_id, certification_slug, section_code, title, content_markdown, word_count')
        .eq('certification_slug', dbSlug)
        .or(`title.ilike.%${safeLike}%,content_markdown.ilike.%${safeLike}%`)
        .limit(limit);
      rows = (fallbackData || []) as TextbookSection[];
    }

    const lowerQ = cleanQ.toLowerCase();
    return rows.map((r) => {
      const md = r.content_markdown || '';
      const idx = md.toLowerCase().indexOf(lowerQ.split(/\s+/)[0] || '');
      const start = Math.max(0, idx - 70);
      const rawSnip = md.slice(start, start + 210).replace(/[#*_`>\n]+/g, ' ').trim();
      return {
        id: r.id,
        chapter_id: r.chapter_id,
        textbook_id: r.textbook_id,
        certification_slug: r.certification_slug,
        section_code: r.section_code,
        title: r.title,
        snippet: (start > 0 ? '...' : '') + rawSnip + (start + 210 < md.length ? '...' : ''),
        word_count: r.word_count,
      };
    });
  } catch (err) {
    console.warn('[TextbookService] searchFullTextbooks fallback:', err);
    return [];
  }
}
