/* ===================================================================
   ANOXPASS — Coursera / O'Reilly / Kindle 3-Pane Full Textbook Reader
   Book -> Chapter -> Subchapter Hierarchy + Mobile Slide-Over TOC +
   "On This Page" Outline + Paper/Serif Comfort Controls + Shimmer States
   =================================================================== */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  fetchTextbooksForCert,
  fetchChapterSections,
  searchFullTextbooks,
  toDbCertSlug,
  toCourseCertId,
  type Textbook,
  type TextbookChapter,
  type TextbookSection,
  type TextbookSectionMeta,
  type TextbookSearchHit,
} from '../../lib/textbookService';
import { fetchSynthesizedLessons } from '../../lib/synthesizedCloudContent';
import type { CourseLesson } from '../../types/course';
import { useReadingProgressStore } from '../../stores/readingProgressStore';
import { useAcademyProgressStore } from '../../stores/academyProgressStore';
import { cleanEditorialTitle, type SectionHeading } from '../../lib/contentNormalizer';
import AdobeContentReader, { type ReadingTheme, type ReadingFont } from './AdobeContentReader';

interface FullTextbookReaderProps {
  certSlug: string;
  certName?: string;
  initialSearchQuery?: string;
  initialChapterId?: string;
  initialSectionId?: string;
  onPracticeChapterQuiz?: (domainNumber: number | null, chapterTitle: string, chapterId: string) => void;
  onAskCoach?: (prompt: string) => void;
}

function ChapterProgressRing({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.min(1, done / total) : 0;
  const r = 8;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="10" cy="10" r={r} fill="none" stroke="var(--color-bg-muted)" strokeWidth="2.5" />
      <circle
        cx="10"
        cy="10"
        r={r}
        fill="none"
        stroke={pct >= 1 ? 'var(--color-success)' : 'var(--color-primary)'}
        strokeWidth="2.5"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 10 10)"
      />
    </svg>
  );
}

export const FullTextbookReader: React.FC<FullTextbookReaderProps> = ({
  certSlug,
  certName,
  initialSearchQuery = '',
  initialChapterId,
  initialSectionId,
  onPracticeChapterQuiz,
  onAskCoach,
}) => {
  const dbSlug = useMemo(() => toDbCertSlug(certSlug), [certSlug]);

  const [loadingToc, setLoadingToc] = useState(true);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [chapters, setChapters] = useState<TextbookChapter[]>([]);
  const [sectionMetas, setSectionMetas] = useState<TextbookSectionMeta[]>([]);

  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [chapterSections, setChapterSections] = useState<TextbookSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [tocFilter, setTocFilter] = useState<'all' | 'unread' | 'completed' | 'relearn' | 'bookmarked'>('all');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  // Persisted Kindle-style reading comfort preferences
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>(() => {
    try {
      const saved = localStorage.getItem('anox_reader_size');
      if (saved === 'normal' || saved === 'large' || saved === 'xlarge') return saved;
    } catch {
      // ignore
    }
    return 'normal';
  });
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>(() => {
    try {
      const saved = localStorage.getItem('anox_reader_theme');
      if (saved === 'light' || saved === 'sepia' || saved === 'dark') return saved;
    } catch {
      // ignore
    }
    return 'light';
  });
  const [readingFont, setReadingFont] = useState<ReadingFont>(() => {
    try {
      const saved = localStorage.getItem('anox_reader_font');
      if (saved === 'sans' || saved === 'serif') return saved;
    } catch {
      // ignore
    }
    return 'sans';
  });

  useEffect(() => {
    try {
      localStorage.setItem('anox_reader_size', fontSize);
      localStorage.setItem('anox_reader_theme', readingTheme);
      localStorage.setItem('anox_reader_font', readingFont);
    } catch {
      // ignore
    }
  }, [fontSize, readingTheme, readingFont]);

  const [focusMode, setFocusMode] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const [synthesizedLessons, setSynthesizedLessons] = useState<CourseLesson[]>([]);
  const [showCompanions, setShowCompanions] = useState(false);

  // In-page right outline state
  const [sectionHeadings, setSectionHeadings] = useState<SectionHeading[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);

  // Full-book search state
  const [searchInput, setSearchInput] = useState(initialSearchQuery);
  const [searchResults, setSearchResults] = useState<TextbookSearchHit[] | null>(null);
  const [searching, setSearching] = useState(false);

  const {
    records,
    lastReadByCert,
    chapterQuizScores,
    loadForCert,
    setSectionStatus,
    saveAudioPosition,
    toggleBookmark,
    addHighlight,
    removeHighlight,
    saveNotes,
  } = useReadingProgressStore();

  const { addFsrsCard } = useAcademyProgressStore();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const addToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg((prev) => (prev === msg ? null : prev)), 2400);
  }, []);

  // 1. Load Textbook TOC & Reading Progress when certification changes
  useEffect(() => {
    let active = true;
    setLoadingToc(true);
    setSearchResults(null);
    setChapterSections([]);

    async function load() {
      const [toc, aiLessons] = await Promise.all([
        fetchTextbooksForCert(dbSlug),
        fetchSynthesizedLessons(toCourseCertId(dbSlug)),
        loadForCert(dbSlug),
      ]);
      if (!active) return;

      setTextbooks(toc.textbooks);
      setChapters(toc.chapters);
      setSectionMetas(toc.sectionMetas);
      setSynthesizedLessons(aiLessons);

      if (toc.textbooks.length > 0) {
        const lastPtr = lastReadByCert[dbSlug];
        const targetBook =
          (initialChapterId && toc.chapters.find((c) => c.id === initialChapterId)?.textbook_id) ||
          (lastPtr && toc.textbooks.find((b) => b.id === lastPtr.textbookId)?.id) ||
          toc.textbooks[0].id;

        setSelectedBookId(targetBook);

        const bookChapters = toc.chapters.filter((c) => c.textbook_id === targetBook);
        const targetCh =
          (initialChapterId && bookChapters.find((c) => c.id === initialChapterId)) ||
          (lastPtr && bookChapters.find((c) => c.id === lastPtr.chapterId)) ||
          bookChapters[0];

        if (targetCh) {
          setSelectedChapterId(targetCh.id);
          setExpandedChapters({ [targetCh.id]: true });
          const targetSecId = initialSectionId || (lastPtr?.chapterId === targetCh.id ? lastPtr.sectionId : null);
          if (targetSecId) setSelectedSectionId(targetSecId);
        } else {
          setSelectedChapterId(null);
        }
      } else {
        setSelectedBookId(null);
        setSelectedChapterId(null);
      }
      setLoadingToc(false);
    }

    void load();
    return () => {
      active = false;
    };
  }, [dbSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (initialSearchQuery && initialSearchQuery.trim().length >= 2) {
      setSearchInput(initialSearchQuery);
      void runSearch(initialSearchQuery);
    }
  }, [initialSearchQuery, dbSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  // 2. Lazy-load full sections whenever selectedChapterId changes
  useEffect(() => {
    if (!selectedChapterId) {
      setChapterSections([]);
      return;
    }
    let active = true;
    setLoadingChapter(true);
    fetchChapterSections(selectedChapterId)
      .then((secs) => {
        if (!active) return;
        setChapterSections(secs);
        if (secs.length > 0) {
          setSelectedSectionId((prev) => (prev && secs.some((s) => s.id === prev) ? prev : secs[0].id));
        }
      })
      .finally(() => {
        if (active) setLoadingChapter(false);
      });
    return () => {
      active = false;
    };
  }, [selectedChapterId]);

  const activeBook = useMemo(
    () => textbooks.find((b) => b.id === selectedBookId) || textbooks[0] || null,
    [textbooks, selectedBookId]
  );

  const bookChapters = useMemo(
    () => chapters.filter((c) => !activeBook || c.textbook_id === activeBook.id),
    [chapters, activeBook]
  );

  const activeChapter = useMemo(
    () => bookChapters.find((c) => c.id === selectedChapterId) || bookChapters[0] || null,
    [bookChapters, selectedChapterId]
  );

  const activeSection = useMemo(
    () => chapterSections.find((s) => s.id === selectedSectionId) || chapterSections[0] || null,
    [chapterSections, selectedSectionId]
  );

  const activeRecord = activeSection ? records[activeSection.id] : undefined;

  useEffect(() => {
    setNotesDraft(activeRecord?.notesMarkdown || '');
    setSectionHeadings([]);
    setActiveHeadingId(null);
  }, [activeSection?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const bookStats = useMemo(() => {
    const ids = sectionMetas
      .filter((m) => !activeBook || m.textbook_id === activeBook.id)
      .map((m) => m.id);
    if (ids.length === 0) return { completed: 0, relearn: 0, bookmarked: 0, total: 0, percent: 0 };
    let completed = 0;
    let relearn = 0;
    let bookmarked = 0;
    for (const id of ids) {
      const r = records[id];
      if (!r) continue;
      if (r.status === 'completed') completed++;
      if (r.status === 'relearn') relearn++;
      if (r.bookmarked) bookmarked++;
    }
    return {
      completed,
      relearn,
      bookmarked,
      total: ids.length,
      percent: Math.round((completed / ids.length) * 100),
    };
  }, [sectionMetas, activeBook, records]);

  async function runSearch(qOverride?: string) {
    const q = (qOverride ?? searchInput).trim();
    if (q.length < 2) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const hits = await searchFullTextbooks(dbSlug, q, 20);
      setSearchResults(hits);
    } finally {
      setSearching(false);
    }
  }

  const jumpToSection = useCallback((bookId: string, chapterId: string, sectionId: string) => {
    setSelectedBookId(bookId);
    setSelectedChapterId(chapterId);
    setSelectedSectionId(sectionId);
    setExpandedChapters((prev) => ({ ...prev, [chapterId]: true }));
    setSearchResults(null);
    setMobileTocOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const flatBookMetas = useMemo(
    () =>
      sectionMetas
        .filter((m) => !activeBook || m.textbook_id === activeBook.id)
        .sort((a, b) => {
          const ca = bookChapters.findIndex((c) => c.id === a.chapter_id);
          const cb = bookChapters.findIndex((c) => c.id === b.chapter_id);
          if (ca !== cb) return ca - cb;
          return a.sort_order - b.sort_order;
        }),
    [sectionMetas, activeBook, bookChapters]
  );

  const flatIndex = activeSection
    ? flatBookMetas.findIndex((m) => m.id === activeSection.id)
    : -1;

  const handleNextSection = useCallback(() => {
    if (flatIndex >= 0 && flatIndex < flatBookMetas.length - 1) {
      const next = flatBookMetas[flatIndex + 1];
      jumpToSection(next.textbook_id, next.chapter_id, next.id);
    }
  }, [flatIndex, flatBookMetas, jumpToSection]);

  const handlePrevSection = useCallback(() => {
    if (flatIndex > 0) {
      const prev = flatBookMetas[flatIndex - 1];
      jumpToSection(prev.textbook_id, prev.chapter_id, prev.id);
    }
  }, [flatIndex, flatBookMetas, jumpToSection]);

  if (loadingToc) {
    return (
      <div className="full-textbook-grid">
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <div className="skeleton-shimmer skeleton-line skeleton-line--title" />
          <div className="skeleton-shimmer skeleton-line" />
          <div className="skeleton-shimmer skeleton-line skeleton-line--short" />
          <div className="skeleton-shimmer skeleton-line" />
        </div>
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div className="skeleton-shimmer skeleton-line skeleton-line--title" />
          <div className="skeleton-shimmer skeleton-line" />
          <div className="skeleton-shimmer skeleton-line" />
          <div className="skeleton-shimmer skeleton-line skeleton-line--short" />
        </div>
      </div>
    );
  }

  if (textbooks.length === 0) {
    return (
      <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>📚</div>
        <h3 style={{ margin: '0 0 8px' }}>No Full Textbooks Synced for {certName || dbSlug.toUpperCase()} Yet</h3>
        <p className="text-muted text-sm" style={{ maxWidth: '520px', margin: '0 auto var(--space-4)' }}>
          Run the local textbook extractor to populate full book chapters and subchapters from <code>my_documents/</code>:
        </p>
        <code style={{ display: 'inline-block', padding: '8px 14px', borderRadius: '8px', background: 'var(--color-bg-subtle)' }}>
          python scripts/extract_all_books_to_supabase.py --cert {dbSlug} --apply
        </code>
      </div>
    );
  }

  const sectionMetaInput = activeSection
    ? {
        certificationSlug: dbSlug,
        textbookId: activeSection.textbook_id,
        chapterId: activeSection.chapter_id,
        sectionId: activeSection.id,
        sectionTitle: cleanEditorialTitle(activeSection.title),
      }
    : null;

  const hasOutline = sectionHeadings.length >= 2 && !focusMode;

  return (
    <div className="full-textbook-shell">
      {toastMsg && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: 'calc(var(--header-height) + 14px)',
            right: '20px',
            zIndex: 'var(--z-toast)' as unknown as number,
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-ink)',
            color: 'var(--color-ink-inverse)',
            fontSize: '12px',
            fontWeight: 700,
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          ✓ {toastMsg}
        </div>
      )}

      {/* Unified Sticky Reader Toolbar (Books + Search + Reading Comfort Controls) */}
      <div className="reader-unified-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: '1 1 280px' }}>
          <button
            type="button"
            className="btn btn-xs btn-secondary"
            onClick={() => setMobileTocOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            📖 Contents
          </button>

          {textbooks.length > 1 ? (
            <select
              className="input"
              aria-label="Select Textbook"
              value={activeBook?.id || ''}
              onChange={(e) => {
                const bId = e.target.value;
                setSelectedBookId(bId);
                const firstCh = chapters.find((c) => c.textbook_id === bId);
                if (firstCh) {
                  setSelectedChapterId(firstCh.id);
                  setExpandedChapters({ [firstCh.id]: true });
                }
              }}
              style={{
                fontSize: '12px',
                fontWeight: 700,
                padding: '4px 10px',
                minHeight: '34px',
                maxWidth: '280px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {textbooks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.is_primary ? '⭐ ' : '📘 '}
                  {cleanEditorialTitle(b.title)} ({b.total_chapters} Ch)
                </option>
              ))}
            </select>
          ) : (
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>
              📘 {cleanEditorialTitle(activeBook?.title || 'Official Manual')}
            </span>
          )}

          <span className="badge badge-success" style={{ fontSize: '11px' }}>
            ✓ {bookStats.completed}/{bookStats.total} ({bookStats.percent}%)
          </span>
        </div>

        {/* Search & Kindle Comfort Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void runSearch();
            }}
            style={{ display: 'flex', gap: '4px' }}
          >
            <input
              type="search"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (!e.target.value.trim()) setSearchResults(null);
              }}
              placeholder="🔍 Search book..."
              className="input"
              style={{ width: '165px', minHeight: '34px', padding: '4px 10px', fontSize: '12px' }}
            />
            <button type="submit" className="btn btn-xs btn-secondary" disabled={searching}>
              {searching ? '...' : 'Find'}
            </button>
          </form>

          {/* Paper Theme Switcher */}
          <div className="font-size-group" role="group" aria-label="Paper Theme">
            <button
              type="button"
              onClick={() => setReadingTheme('light')}
              className={`font-size-btn ${readingTheme === 'light' ? 'active' : ''}`}
              title="Crisp Light Paper"
            >
              ☀
            </button>
            <button
              type="button"
              onClick={() => setReadingTheme('sepia')}
              className={`font-size-btn ${readingTheme === 'sepia' ? 'active' : ''}`}
              title="Warm Sepia Paper"
            >
              📜
            </button>
            <button
              type="button"
              onClick={() => setReadingTheme('dark')}
              className={`font-size-btn ${readingTheme === 'dark' ? 'active' : ''}`}
              title="Night Ink Theme"
            >
              🌙
            </button>
          </div>

          {/* Serif / Sans Toggle */}
          <button
            type="button"
            onClick={() => setReadingFont((f) => (f === 'sans' ? 'serif' : 'sans'))}
            className={`btn btn-xs ${readingFont === 'serif' ? 'btn-primary' : 'btn-secondary'}`}
            title="Toggle Sans-Serif / Editorial Serif"
          >
            {readingFont === 'serif' ? 'Serif' : 'Sans'}
          </button>

          {/* Font Size */}
          <div className="font-size-group" role="group" aria-label="Text Size">
            <button type="button" onClick={() => setFontSize('normal')} className={`font-size-btn ${fontSize === 'normal' ? 'active' : ''}`}>A</button>
            <button type="button" onClick={() => setFontSize('large')} className={`font-size-btn ${fontSize === 'large' ? 'active' : ''}`}>A+</button>
            <button type="button" onClick={() => setFontSize('xlarge')} className={`font-size-btn ${fontSize === 'xlarge' ? 'active' : ''}`}>A++</button>
          </div>

          <button
            type="button"
            onClick={() => setFocusMode((f) => !f)}
            className={`btn btn-xs ${focusMode ? 'btn-primary' : 'btn-secondary'}`}
            title="Distraction-Free Focus Mode"
          >
            {focusMode ? '◧ Show Sidebars' : '⛶ Focus'}
          </button>
        </div>

        {/* Inline Full-Text Search Results */}
        {searchResults && (
          <div
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong style={{ fontSize: '12px' }}>
                Matches for “{searchInput}” ({searchResults.length})
              </strong>
              <button type="button" className="btn btn-xs btn-ghost" onClick={() => setSearchResults(null)}>
                ✕ Close
              </button>
            </div>
            {searchResults.length === 0 ? (
              <p className="text-muted text-xs" style={{ margin: 0 }}>
                No matching textbook sections found. Try a broader keyword.
              </p>
            ) : (
              <div style={{ display: 'grid', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
                {searchResults.map((hit) => (
                  <button
                    key={hit.id}
                    type="button"
                    onClick={() => jumpToSection(hit.textbook_id, hit.chapter_id, hit.id)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--color-bg)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {hit.section_code ? `${hit.section_code} · ` : ''}{cleanEditorialTitle(hit.title)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                      {hit.snippet}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile TOC Drawer Backdrop */}
      {mobileTocOpen && (
        <div
          className="mobile-toc-backdrop"
          onClick={() => setMobileTocOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main 3-Pane Editorial Workspace */}
      <div className={`full-textbook-grid ${focusMode ? 'focus-mode' : ''} ${hasOutline ? 'has-outline' : ''}`}>
        {/* Left Pane: Book Table of Contents */}
        {!focusMode && (
          <aside className={`full-textbook-toc card ${mobileTocOpen ? 'mobile-open' : ''}`} aria-label="Book Table of Contents">
            <div style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                  {activeBook?.author || 'Official Manual'}
                </div>
                {mobileTocOpen && (
                  <button type="button" className="btn btn-xs btn-ghost" onClick={() => setMobileTocOpen(false)}>
                    ✕
                  </button>
                )}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px', lineHeight: 1.3 }}>
                {cleanEditorialTitle(activeBook?.title || '')}
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                {(['all', 'unread', 'completed', 'relearn', 'bookmarked'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setTocFilter(f)}
                    className={`btn btn-xs ${tocFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '10px', padding: '2px 7px' }}
                  >
                    {f === 'all' ? 'All' : f === 'unread' ? 'Unread' : f === 'completed' ? '✓ Done' : f === 'relearn' ? '🔄 Relearn' : '★ Saved'}
                  </button>
                ))}
              </div>
            </div>

            <div className="full-textbook-toc-list">
              {bookChapters.map((ch) => {
                const chMetas = sectionMetas
                  .filter((m) => m.chapter_id === ch.id)
                  .sort((a, b) => a.sort_order - b.sort_order);
                const visibleMetas = chMetas.filter((m) => {
                  const rec = records[m.id];
                  if (tocFilter === 'completed') return rec?.status === 'completed';
                  if (tocFilter === 'relearn') return rec?.status === 'relearn';
                  if (tocFilter === 'bookmarked') return Boolean(rec?.bookmarked);
                  if (tocFilter === 'unread') return !rec || rec.status === 'unread' || rec.status === 'in_progress';
                  return true;
                });
                if (tocFilter !== 'all' && visibleMetas.length === 0) return null;

                const isOpen = Boolean(expandedChapters[ch.id] || selectedChapterId === ch.id);
                const chDoneCount = chMetas.filter((m) => records[m.id]?.status === 'completed').length;
                const chQuizScore = chapterQuizScores[ch.id];

                return (
                  <div key={ch.id} className="toc-chapter-group">
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedChapters((prev) => ({ ...prev, [ch.id]: !isOpen }));
                        if (selectedChapterId !== ch.id) {
                          setSelectedChapterId(ch.id);
                        }
                      }}
                      className={`toc-chapter-btn ${selectedChapterId === ch.id ? 'active' : ''}`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '6px' }}>
                        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary)' }}>
                          {ch.part_label || `Chapter ${ch.chapter_number}`}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {typeof chQuizScore === 'number' && (
                            <span className={`badge ${chQuizScore >= 80 ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                              {chQuizScore}%
                            </span>
                          )}
                          <ChapterProgressRing done={chDoneCount} total={chMetas.length} />
                          <span style={{ fontSize: '10px', color: 'var(--color-ink-muted)' }}>
                            {chDoneCount}/{chMetas.length}
                          </span>
                          <span style={{ fontSize: '10px' }}>{isOpen ? '▾' : '▸'}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 600, textAlign: 'left', marginTop: '3px', lineHeight: 1.35 }}>
                        {cleanEditorialTitle(ch.title)}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="toc-subchapter-list">
                        {visibleMetas.map((sec) => {
                          const rec = records[sec.id];
                          const isSecActive = activeSection?.id === sec.id;
                          return (
                            <button
                              key={sec.id}
                              type="button"
                              onClick={() => jumpToSection(sec.textbook_id, sec.chapter_id, sec.id)}
                              className={`toc-subchapter-btn ${isSecActive ? 'active' : ''} ${rec?.status === 'completed' ? 'done' : ''}`}
                            >
                              <span className="toc-sub-status">
                                {rec?.status === 'completed' ? '✓' : rec?.status === 'relearn' ? '🔄' : rec?.bookmarked ? '★' : '○'}
                              </span>
                              <span className="toc-sub-title">
                                {sec.section_code ? <strong>{sec.section_code} </strong> : null}
                                {cleanEditorialTitle(sec.title)}
                              </span>
                              <span style={{ fontSize: '10px', color: 'var(--color-ink-muted)', flexShrink: 0 }}>
                                {sec.est_read_minutes}m
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* Center Pane: Editorial Reading Stage */}
        <main className={`full-textbook-stage card reader-theme-${readingTheme}`}>
          {loadingChapter ? (
            <div className="editorial-prose-column" style={{ padding: 'var(--space-6) 0' }}>
              <div className="skeleton-shimmer skeleton-line skeleton-line--title" />
              <div className="skeleton-shimmer skeleton-line" />
              <div className="skeleton-shimmer skeleton-line" />
              <div className="skeleton-shimmer skeleton-line skeleton-line--short" />
              <div className="skeleton-shimmer skeleton-line" />
              <div className="skeleton-shimmer skeleton-line" />
            </div>
          ) : activeSection && activeChapter ? (
            <div className="editorial-prose-column">
              {/* Topic Header Card */}
              <div className="textbook-stage-topbar">
                <div style={{ minWidth: 0, flex: '1 1 320px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--reader-accent, var(--color-primary))', fontWeight: 700, letterSpacing: '0.02em' }}>
                    {cleanEditorialTitle(activeBook?.title || '')} › {cleanEditorialTitle(activeChapter.title)}
                  </div>
                  <h2 style={{ margin: '6px 0 0', fontSize: 'var(--text-2xl)', lineHeight: 1.25 }}>
                    {activeSection.section_code ? `${activeSection.section_code} — ` : ''}
                    {cleanEditorialTitle(activeSection.title)}
                  </h2>
                  <div style={{ fontSize: '12px', color: 'var(--reader-ink-muted, var(--color-ink-muted))', marginTop: '6px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span>⏱ ~{activeSection.est_read_minutes} min read</span>
                    <span>📝 {activeSection.word_count.toLocaleString()} words</span>
                    {activeSection.page_start ? (
                      <span>📄 Pages {activeSection.page_start}{activeSection.page_end && activeSection.page_end !== activeSection.page_start ? `–${activeSection.page_end}` : ''}</span>
                    ) : null}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setShowAudio((s) => !s)}
                    className={`btn btn-xs ${showAudio ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    🎧 {showAudio ? 'Audio On' : 'Read Aloud'}
                  </button>

                  {sectionMetaInput && (
                    <button
                      type="button"
                      onClick={() => {
                        const saved = toggleBookmark(sectionMetaInput);
                        addToast(saved ? 'Section bookmarked ★' : 'Bookmark removed');
                      }}
                      className={`btn btn-xs ${activeRecord?.bookmarked ? 'btn-warning' : 'btn-secondary'}`}
                    >
                      {activeRecord?.bookmarked ? '★ Saved' : '☆ Save'}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowNotesDrawer((n) => !n)}
                    className={`btn btn-xs ${showNotesDrawer ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    🗒 Notes ({(activeRecord?.highlights.length || 0) + (activeRecord?.notesMarkdown ? 1 : 0)})
                  </button>

                  {(synthesizedLessons.length > 0 || activeSection.exam_tips || (activeSection.key_terms?.length ?? 0) > 0) && (
                    <button
                      type="button"
                      onClick={() => setShowCompanions((c) => !c)}
                      className={`btn btn-xs ${showCompanions ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      💡 Study Guide {showCompanions ? '▲' : '▼'}
                    </button>
                  )}
                </div>
              </div>

              {/* Single Clean Collapsible Study Guide Accordion (Replaces Multi-Card Pre-Prose Stack) */}
              {showCompanions && (
                <div className="editorial-callout editorial-callout--definition" style={{ marginBottom: 'var(--space-5)' }}>
                  <div className="editorial-callout-header">
                    <span>📚 Section Key Concepts &amp; Exam Companion</span>
                  </div>
                  {activeSection.key_terms && activeSection.key_terms.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 'var(--space-3)' }}>
                      {activeSection.key_terms.map((t, i) => (
                        <span key={i} className="term-chip">{t}</span>
                      ))}
                    </div>
                  )}
                  {activeSection.exam_tips && (
                    <p style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--text-sm)' }}>
                      <strong>💡 Exam Watch:</strong> {activeSection.exam_tips}
                    </p>
                  )}
                  {synthesizedLessons.length > 0 && (() => {
                    const secKeywords = (activeSection.title + ' ' + activeChapter.title)
                      .toLowerCase()
                      .split(/[^a-z0-9]+/)
                      .filter((w) => w.length > 4);
                    const matchedAi =
                      synthesizedLessons.find((l) =>
                        secKeywords.some((k) => (l.title + ' ' + l.summary).toLowerCase().includes(k))
                      ) ||
                      synthesizedLessons[Math.max(0, (activeChapter.chapter_number || 1) - 1) % synthesizedLessons.length];
                    if (!matchedAi) return null;
                    return (
                      <div style={{ fontSize: 'var(--text-xs)', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                        <strong>🧠 AI Mental Model — {matchedAi.title}:</strong> {matchedAi.summary}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Collapsible Personal Notes & Highlights */}
              {showNotesDrawer && sectionMetaInput && (
                <div className="editorial-callout editorial-callout--note" style={{ marginBottom: 'var(--space-5)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong>🗒 Personal Study Notes &amp; Highlights (Synced)</strong>
                    <button type="button" className="btn btn-xs btn-ghost" onClick={() => setShowNotesDrawer(false)}>✕</button>
                  </div>

                  {activeRecord && activeRecord.highlights.length > 0 && (
                    <div style={{ marginBottom: '10px', display: 'grid', gap: '6px' }}>
                      {activeRecord.highlights.map((hl) => (
                        <div
                          key={hl.id}
                          style={{
                            padding: '6px 10px',
                            backgroundColor: 'rgba(245, 158, 11, 0.14)',
                            borderLeft: '3px solid #f59e0b',
                            borderRadius: '4px',
                            fontSize: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '8px',
                          }}
                        >
                          <span>“{hl.text}”</span>
                          <button
                            type="button"
                            className="btn btn-xs btn-ghost"
                            onClick={() => removeHighlight(sectionMetaInput, hl.id)}
                            title="Delete highlight"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <textarea
                    rows={3}
                    className="input"
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    placeholder="Write key takeaways, exam formulas, or questions about this subchapter..."
                    style={{ width: '100%', fontSize: '13px', marginBottom: '8px' }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      saveNotes(sectionMetaInput, notesDraft);
                      addToast('Notes saved & synced');
                    }}
                  >
                    💾 Save Notes
                  </button>
                </div>
              )}

              {/* Full Unabridged Book Content + Docked Read Aloud */}
              <AdobeContentReader
                contentMarkdown={activeSection.content_markdown}
                chapterTitle={`${activeSection.section_code ? activeSection.section_code + ' ' : ''}${cleanEditorialTitle(activeSection.title)}`}
                bookTitle={cleanEditorialTitle(activeBook?.title || '')}
                fontSize={fontSize === 'normal' ? 'base' : fontSize === 'large' ? 'lg' : 'xl'}
                readingTheme={readingTheme}
                readingFont={readingFont}
                showAudioControlsInitially={showAudio}
                initialSentenceIndex={activeRecord?.lastSentenceIndex || 0}
                onHeadingsExtracted={setSectionHeadings}
                onSentenceProgress={(idx) => {
                  if (sectionMetaInput) saveAudioPosition(sectionMetaInput, idx);
                }}
                onHighlightSave={(sel) => {
                  if (sectionMetaInput) {
                    addHighlight(sectionMetaInput, sel, 'amber');
                    addToast('Highlight saved to section notes');
                  }
                }}
                onCreateFlashcard={(sel) => {
                  addFsrsCard({
                    front: `${cleanEditorialTitle(activeSection.title)} (${dbSlug.toUpperCase()})`,
                    back: sel,
                    sourceType: 'certification',
                    sourceId: activeSection.id,
                    tags: [dbSlug, cleanEditorialTitle(activeChapter.title)],
                  });
                  addToast('Added selection to FSRS spaced-repetition queue!');
                }}
                onAskTutor={(sel) => {
                  onAskCoach?.(
                    `Explain this passage from "${cleanEditorialTitle(activeBook?.title || '')}" (${cleanEditorialTitle(activeChapter.title)} > ${cleanEditorialTitle(activeSection.title)}) clearly and highlight any exam traps:\n\n"${sel}"`
                  );
                }}
                onNextChapter={flatIndex < flatBookMetas.length - 1 ? handleNextSection : undefined}
                onPrevChapter={flatIndex > 0 ? handlePrevSection : undefined}
              />

              {/* Bottom Mastery Action Strip */}
              <div className="textbook-mastery-strip">
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {sectionMetaInput && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          const next = activeRecord?.status === 'completed' ? 'in_progress' : 'completed';
                          setSectionStatus(sectionMetaInput, next);
                          if (next === 'completed') addToast('+25 XP — Subchapter Mastered!');
                        }}
                        className={`btn btn-sm ${activeRecord?.status === 'completed' ? 'btn-success' : 'btn-primary'}`}
                      >
                        {activeRecord?.status === 'completed' ? '✓ Subchapter Completed' : '✓ Mark Complete (+25 XP)'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const next = activeRecord?.status === 'relearn' ? 'in_progress' : 'relearn';
                          setSectionStatus(sectionMetaInput, next);
                        }}
                        className={`btn btn-sm ${activeRecord?.status === 'relearn' ? 'btn-warning' : 'btn-secondary'}`}
                      >
                        🔄 {activeRecord?.status === 'relearn' ? 'Flagged for Relearn' : 'Relearn'}
                      </button>
                    </>
                  )}

                  {onPracticeChapterQuiz && (
                    <button
                      type="button"
                      onClick={() =>
                        onPracticeChapterQuiz(activeChapter.domain_number, activeChapter.title, activeChapter.id)
                      }
                      className="btn btn-sm btn-primary"
                    >
                      ⚡ Chapter Check (10Q)
                    </button>
                  )}

                  {onAskCoach && (
                    <button
                      type="button"
                      onClick={() =>
                        onAskCoach(
                          `Quiz me or clarify key exam concepts from ${cleanEditorialTitle(activeBook?.title || '')} — ${cleanEditorialTitle(activeChapter.title)} (${cleanEditorialTitle(activeSection.title)}).`
                        )
                      }
                      className="btn btn-sm btn-secondary"
                    >
                      🤖 Ask AI Tutor
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    disabled={flatIndex <= 0}
                    onClick={handlePrevSection}
                    className="btn btn-sm btn-secondary"
                  >
                    ← Prev
                  </button>
                  <button
                    type="button"
                    disabled={flatIndex < 0 || flatIndex >= flatBookMetas.length - 1}
                    onClick={handleNextSection}
                    className="btn btn-sm btn-primary"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: 'var(--space-10)', textAlign: 'center' }}>
              <p className="text-muted">Select any chapter or subchapter from the Table of Contents to begin reading.</p>
            </div>
          )}
        </main>

        {/* Right Pane: Auto-Generated "On This Page" Mini-Outline */}
        {hasOutline && (
          <aside className="on-this-page-aside" aria-label="On This Page">
            <div className="on-this-page-title">On This Page</div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {sectionHeadings.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => {
                    setActiveHeadingId(h.id);
                    const el = document.getElementById(h.id);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`on-this-page-link ${h.level === 3 ? 'is-h3' : ''} ${activeHeadingId === h.id ? 'active' : ''}`}
                >
                  {h.text}
                </button>
              ))}
            </nav>
          </aside>
        )}
      </div>
    </div>
  );
};
