/* ===================================================================
   ANOXPASS — Coursera / Udemy / Kindle Full Textbook Reader
   Book -> Part -> Chapter -> Subchapter Hierarchy + Lazy Chapter Cache
   + Adobe-Style Read Aloud + Highlights/Notes + FSRS + Mastery Checks
   =================================================================== */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  fetchTextbooksForCert,
  fetchChapterSections,
  searchFullTextbooks,
  toDbCertSlug,
  type Textbook,
  type TextbookChapter,
  type TextbookSection,
  type TextbookSectionMeta,
  type TextbookSearchHit,
} from '../../lib/textbookService';
import { useReadingProgressStore } from '../../stores/readingProgressStore';
import { useAcademyProgressStore } from '../../stores/academyProgressStore';
import AdobeContentReader from './AdobeContentReader';

interface FullTextbookReaderProps {
  certSlug: string;
  certName?: string;
  initialSearchQuery?: string;
  initialChapterId?: string;
  initialSectionId?: string;
  onPracticeChapterQuiz?: (domainNumber: number | null, chapterTitle: string, chapterId: string) => void;
  onAskCoach?: (prompt: string) => void;
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
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [focusMode, setFocusMode] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');

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
  const addToast = useCallback((msg: string, _kind?: string) => {
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
      const [toc] = await Promise.all([
        fetchTextbooksForCert(dbSlug),
        loadForCert(dbSlug),
      ]);
      if (!active) return;

      setTextbooks(toc.textbooks);
      setChapters(toc.chapters);
      setSectionMetas(toc.sectionMetas);

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

  // Trigger initial search if deep-linked from ResultsPage (?q=...)
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
          setSelectedSectionId((prev) =>
            prev && secs.some((s) => s.id === prev) ? prev : secs[0].id
          );
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
    const el = document.querySelector('.full-textbook-stage');
    if (el) el.scrollTop = 0;
  }, []);

  // Flat section sequence within the active book for Prev/Next Subchapter navigation
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
      <div className="card" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
        <div className="animate-spin" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>⟳</div>
        <p className="text-muted mt-3">Loading unabridged textbooks &amp; chapters...</p>
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
        sectionTitle: activeSection.title,
      }
    : null;

  return (
    <div className="full-textbook-shell">
      {toastMsg && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '84px',
            right: '24px',
            zIndex: 100,
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-ink)',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 700,
            boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
          }}
        >
          ✓ {toastMsg}
        </div>
      )}
      {/* Top Book Selector, Search & Reading Toolbar */}
      <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          {/* Book Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-ink-muted)' }}>
              📚 BOOKS ({textbooks.length}):
            </span>
            {textbooks.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setSelectedBookId(b.id);
                  const firstCh = chapters.find((c) => c.textbook_id === b.id);
                  if (firstCh) {
                    setSelectedChapterId(firstCh.id);
                    setExpandedChapters({ [firstCh.id]: true });
                  }
                }}
                className={`btn btn-sm ${activeBook?.id === b.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '12px' }}
              >
                {b.is_primary ? '⭐ ' : '📘 '}
                {b.title.length > 48 ? b.title.slice(0, 45) + '...' : b.title} ({b.total_chapters} Ch · {b.est_read_hours}h)
              </button>
            ))}
          </div>

          {/* Right Controls: Search + Reading Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void runSearch();
              }}
              style={{ display: 'flex', gap: '6px' }}
            >
              <input
                type="search"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (!e.target.value.trim()) setSearchResults(null);
                }}
                placeholder="🔍 Search entire textbook..."
                className="input input-sm"
                style={{ minWidth: '210px', fontSize: '12px' }}
              />
              <button type="submit" className="btn btn-secondary btn-sm" disabled={searching}>
                {searching ? '...' : 'Find'}
              </button>
            </form>

            <span className="badge badge-success" style={{ fontSize: '11px', fontWeight: 700 }}>
              ✓ {bookStats.completed}/{bookStats.total} Sections ({bookStats.percent}%)
            </span>
          </div>
        </div>

        {/* Full-Text Search Results Drawer */}
        {searchResults && (
          <div
            style={{
              marginTop: 'var(--space-3)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong style={{ fontSize: '12px' }}>
                Search Results for “{searchInput}” ({searchResults.length})
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
              <div style={{ display: 'grid', gap: '6px', maxHeight: '260px', overflowY: 'auto' }}>
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
                      {hit.section_code ? `${hit.section_code} · ` : ''}{hit.title}
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

      {/* Main 2-Column Book Workspace */}
      <div className={`full-textbook-grid ${focusMode ? 'focus-mode' : ''}`}>
        {/* Left TOC Sidebar: Book -> Chapter -> Subchapter */}
        {!focusMode && (
          <aside className="full-textbook-toc card" aria-label="Book Table of Contents">
            <div style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                {activeBook?.author || 'Official Manual'} · {activeBook?.edition || ''}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>
                {activeBook?.title}
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {typeof chQuizScore === 'number' && (
                            <span className={`badge ${chQuizScore >= 80 ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                              Quiz {chQuizScore}%
                            </span>
                          )}
                          <span style={{ fontSize: '10px', color: 'var(--color-ink-muted)' }}>
                            {chDoneCount}/{chMetas.length}
                          </span>
                          <span style={{ fontSize: '10px' }}>{isOpen ? '▾' : '▸'}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 600, textAlign: 'left', marginTop: '2px', lineHeight: 1.3 }}>
                        {ch.title}
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
                                {sec.title}
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

        {/* Main Reading Stage */}
        <main className="full-textbook-stage card">
          {loadingChapter ? (
            <div style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
              <div className="animate-spin" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>⟳</div>
              <p className="text-muted mt-3">Loading full chapter content...</p>
            </div>
          ) : activeSection && activeChapter ? (
            <>
              {/* Stage Top Controls */}
              <div className="textbook-stage-topbar">
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 700 }}>
                    {activeBook?.title} › {activeChapter.title}
                  </div>
                  <h2 style={{ margin: '3px 0 0', fontSize: 'var(--text-lg)' }}>
                    {activeSection.section_code ? `${activeSection.section_code} — ` : ''}
                    {activeSection.title}
                  </h2>
                  <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', marginTop: '4px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
                    onClick={() => setShowAudio(!showAudio)}
                    className={`btn btn-sm ${showAudio ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    🎧 {showAudio ? 'Hide Audio' : 'Read Aloud'}
                  </button>

                  {sectionMetaInput && (
                    <button
                      type="button"
                      onClick={() => {
                        const saved = toggleBookmark(sectionMetaInput);
                        addToast(saved ? 'Section bookmarked ★' : 'Bookmark removed', 'info');
                      }}
                      className={`btn btn-sm ${activeRecord?.bookmarked ? 'btn-warning' : 'btn-secondary'}`}
                      title="Bookmark this subchapter"
                    >
                      {activeRecord?.bookmarked ? '★ Saved' : '☆ Save'}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowNotesDrawer(!showNotesDrawer)}
                    className={`btn btn-sm ${showNotesDrawer ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    🗒 Notes ({(activeRecord?.highlights.length || 0) + (activeRecord?.notesMarkdown ? 1 : 0)})
                  </button>

                  <div className="font-size-group">
                    <button type="button" onClick={() => setFontSize('normal')} className={`font-size-btn ${fontSize === 'normal' ? 'active' : ''}`}>A</button>
                    <button type="button" onClick={() => setFontSize('large')} className={`font-size-btn ${fontSize === 'large' ? 'active' : ''}`}>A+</button>
                    <button type="button" onClick={() => setFontSize('xlarge')} className={`font-size-btn ${fontSize === 'xlarge' ? 'active' : ''}`}>A++</button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFocusMode(!focusMode)}
                    className={`btn btn-sm ${focusMode ? 'btn-primary' : 'btn-secondary'}`}
                    title="Distraction-free Focus Mode"
                  >
                    {focusMode ? '◧ Show TOC' : '⛶ Focus'}
                  </button>
                </div>
              </div>

              {/* Key Terms & Exam Tip */}
              {activeSection.key_terms && activeSection.key_terms.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-ink-muted)' }}>Key Concepts:</span>
                  {activeSection.key_terms.map((t, i) => (
                    <span key={i} className="term-chip" style={{ fontSize: '11px' }}>{t}</span>
                  ))}
                </div>
              )}

              {activeSection.exam_tips && (
                <div className="callout-box callout-exam-alert" style={{ marginBottom: 'var(--space-4)' }}>
                  <div className="callout-title">💡 Exam Watch Alert</div>
                  <p className="callout-content" style={{ margin: 0 }}>{activeSection.exam_tips}</p>
                </div>
              )}

              {/* Collapsible Highlights & Personal Notes Drawer */}
              {showNotesDrawer && sectionMetaInput && (
                <div
                  className="card"
                  style={{
                    padding: 'var(--space-4)',
                    marginBottom: 'var(--space-4)',
                    backgroundColor: 'var(--color-bg-subtle)',
                    borderLeft: '4px solid var(--color-primary)',
                  }}
                >
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
                      addToast('Notes saved & synced', 'success');
                    }}
                  >
                    💾 Save Notes
                  </button>
                </div>
              )}

              {/* Full Unabridged Book Content + Adobe Read Aloud */}
              <AdobeContentReader
                contentMarkdown={activeSection.content_markdown}
                chapterTitle={`${activeSection.section_code ? activeSection.section_code + ' ' : ''}${activeSection.title}`}
                bookTitle={activeBook?.title}
                fontSize={fontSize === 'normal' ? 'base' : fontSize === 'large' ? 'lg' : 'xl'}
                showAudioControlsInitially={showAudio}
                initialSentenceIndex={activeRecord?.lastSentenceIndex || 0}
                onSentenceProgress={(idx) => {
                  if (sectionMetaInput) saveAudioPosition(sectionMetaInput, idx);
                }}
                onHighlightSave={(sel) => {
                  if (sectionMetaInput) {
                    addHighlight(sectionMetaInput, sel, 'amber');
                    addToast('Highlight saved to section notes', 'success');
                  }
                }}
                onCreateFlashcard={(sel) => {
                  addFsrsCard({
                    front: `${activeSection.title} (${dbSlug.toUpperCase()})`,
                    back: sel,
                    sourceType: 'certification',
                    sourceId: activeSection.id,
                    tags: [dbSlug, activeChapter.title],
                  });
                  addToast('Added selection to FSRS spaced-repetition queue!', 'success');
                }}
                onAskTutor={(sel) => {
                  onAskCoach?.(
                    `Explain this passage from "${activeBook?.title}" (${activeChapter.title} > ${activeSection.title}) clearly and highlight any exam traps:\n\n"${sel}"`
                  );
                }}
                onNextChapter={flatIndex < flatBookMetas.length - 1 ? handleNextSection : undefined}
                onPrevChapter={flatIndex > 0 ? handlePrevSection : undefined}
              />

              {/* Bottom Andela-Style Mastery Action Strip */}
              <div className="textbook-mastery-strip">
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {sectionMetaInput && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          const next = activeRecord?.status === 'completed' ? 'in_progress' : 'completed';
                          setSectionStatus(sectionMetaInput, next);
                          if (next === 'completed') addToast('+25 XP — Subchapter Mastered!', 'success');
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
                      ⚡ Chapter Mastery Check (10Q)
                    </button>
                  )}

                  {onAskCoach && (
                    <button
                      type="button"
                      onClick={() =>
                        onAskCoach(
                          `Quiz me or clarify key exam concepts from ${activeBook?.title} — ${activeChapter.title} (${activeSection.title}).`
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
                    ← Prev Subchapter
                  </button>
                  <button
                    type="button"
                    disabled={flatIndex < 0 || flatIndex >= flatBookMetas.length - 1}
                    onClick={handleNextSection}
                    className="btn btn-sm btn-primary"
                  >
                    Next Subchapter →
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: 'var(--space-10)', textAlign: 'center' }}>
              <p className="text-muted">Select any chapter or subchapter from the Table of Contents to begin reading.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
