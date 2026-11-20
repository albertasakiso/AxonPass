/* ===================================================================
   ANOXPASS — Top Leadership Books Hub
   Anchored by 'The Score Takes Care of Itself' by Bill Walsh + Classics
   =================================================================== */

import { useState, useMemo } from 'react';
import { LEADERSHIP_BOOKS } from '../data';
import type { LeadershipBook } from '../types/academy';
import {
  useAcademyProgressStore,
  type BookMasteryNote,
} from '../stores/academyProgressStore';
import { LocalCoachDrawer } from '../components/academy/LocalCoachDrawer';

export default function BooksHubPage() {
  const featuredBook = useMemo(
    () => LEADERSHIP_BOOKS.find((b) => b.featured) || LEADERSHIP_BOOKS[0],
    []
  );
  const [selectedBook, setSelectedBook] = useState<LeadershipBook>(featuredBook);
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState<BookMasteryNote['noteType']>('takeaway');
  const [coachOpen, setCoachOpen] = useState(false);
  const [coachPrompt, setCoachPrompt] = useState<string | undefined>(undefined);

  const {
    bookNotes,
    addBookNote,
    toggleBookNoteCompleted,
    deleteBookNote,
    addFsrsCard,
  } = useAcademyProgressStore();

  const currentBookNotes = useMemo(
    () => bookNotes.filter((n) => n.bookId === selectedBook.id),
    [bookNotes, selectedBook.id]
  );

  function handleSaveNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteContent.trim()) return;
    addBookNote({
      bookId: selectedBook.id,
      noteType,
      content: noteContent.trim(),
    });
    setNoteContent('');
  }

  function openBookCoach(promptText: string) {
    setCoachPrompt(promptText);
    setCoachOpen(true);
  }

  return (
    <div className="academy-page">
      {/* Hero Banner */}
      <section className="academy-hero">
        <div className="academy-hero-content">
          <div>
            <h1>📖 Top Leadership Books Hub</h1>
            <p>
              Distilled executive playbooks, mental models, and action drills from the world&apos;s
              greatest leadership classics — anchored by Bill Walsh&apos;s{' '}
              <strong>The Score Takes Care of Itself</strong>.
            </p>
            <div className="academy-hero-badges">
              <span className="hero-pill">🏆 {LEADERSHIP_BOOKS.length} Leadership Classics</span>
              <span className="hero-pill">📝 {bookNotes.length} Personal Notes &amp; Actions</span>
              <span className="hero-pill">🤖 Socratic Book Mentor</span>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ background: '#fff', color: 'var(--color-primary)', fontWeight: 700 }}
            onClick={() =>
              openBookCoach(
                `Quiz me on the Standard of Performance from "${selectedBook.title}" by ${selectedBook.author}.`
              )
            }
          >
            🤖 Discuss with AI Mentor
          </button>
        </div>
      </section>

      {/* Books Selector Grid */}
      <section className="books-grid">
        {LEADERSHIP_BOOKS.map((book) => {
          const isSelected = selectedBook.id === book.id;
          const noteCount = bookNotes.filter((n) => n.bookId === book.id).length;

          return (
            <article
              key={book.id}
              className={`mastery-card ${book.featured ? 'mastery-card--featured' : ''}`}
              style={{
                cursor: 'pointer',
                outline: isSelected ? '2px solid var(--color-primary-light)' : 'none',
              }}
              onClick={() => setSelectedBook(book)}
            >
              <div className="mastery-card-header">
                <span className={`tier-badge ${book.featured ? 'tier-badge--4' : 'tier-badge--2'}`}>
                  {book.featured ? '⭐ Anchor Classic' : book.category}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
                  {book.readTimeMinutes} min · {book.year}
                </span>
              </div>

              <div>
                <h3 className="mastery-card-title">{book.title}</h3>
                <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary-light)' }}>
                  by {book.author}
                </p>
                <p style={{ margin: '6px 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                  {book.subtitle}
                </p>
              </div>

              <div className="mastery-card-meta" style={{ marginTop: 'auto' }}>
                <span>💡 {book.keyIdeas.length} Key Ideas</span>
                <span>📝 {noteCount} Notes</span>
              </div>
            </article>
          );
        })}
      </section>

      {/* Active Book Deep-Dive Playbook */}
      <section className="roadmap-drawer" aria-label={`${selectedBook.title} Playbook`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <span className="tier-badge tier-badge--4">
              {selectedBook.category} · Core Framework: {selectedBook.coreFramework}
            </span>
            <h2 style={{ margin: '6px 0 0', fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)' }}>
              {selectedBook.title}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)' }}>
              {selectedBook.author} ({selectedBook.year}) — {selectedBook.executiveSummary}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() =>
              openBookCoach(
                `Walk me through applying "${selectedBook.coreFramework}" from ${selectedBook.title} to a real-world engineering & cybersecurity team.`
              )
            }
          >
            🤖 Apply Framework with AI
          </button>
        </div>

        {/* Key Ideas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          <h3 style={{ margin: 0, fontSize: 'var(--text-base)' }}>💡 Key Ideas &amp; Action Drills</h3>
          {selectedBook.keyIdeas.map((idea) => (
            <div key={idea.id} className="book-key-idea">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <strong style={{ fontSize: 'var(--text-sm)' }}>
                  {idea.number}. {idea.title}
                </strong>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() =>
                    addFsrsCard({
                      sourceType: 'book',
                      sourceId: selectedBook.id,
                      front: `[${selectedBook.title}] ${idea.title}: What is the mental model & action drill?`,
                      back: `Mental Model: ${idea.mentalModel}\nAction Drill: ${idea.actionDrill}`,
                      tags: [selectedBook.id, 'leadership-book'],
                    })
                  }
                >
                  + FSRS
                </button>
              </div>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                {idea.summary}
              </p>
              {idea.quote && (
                <blockquote style={{ margin: '4px 0', paddingLeft: '10px', borderLeft: '3px solid var(--color-accent-gold)', fontStyle: 'italic', fontSize: 'var(--text-xs)' }}>
                  “{idea.quote}”
                </blockquote>
              )}
              <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span>🧠 <strong>Mental Model:</strong> {idea.mentalModel}</span>
                <span>⚡ <strong>Action Drill:</strong> {idea.actionDrill}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Personal Notes, Highlights & Action Items (Realtime Synced) */}
        <div style={{ marginTop: 'var(--space-6)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-5)' }}>
          <h3 style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--text-base)' }}>
            📝 Personal Notes, Highlights &amp; Action Items
          </h3>

          <form onSubmit={handleSaveNote} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['takeaway', 'highlight', 'action_item', 'note'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`tier-pill ${noteType === t ? 'active' : ''}`}
                  onClick={() => setNoteType(t)}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
            <textarea
              className="book-notes-area"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder={`Capture a ${noteType.replace('_', ' ')} from ${selectedBook.title}...`}
            />
            <div>
              <button type="submit" className="btn btn-primary btn-sm" disabled={!noteContent.trim()}>
                Save Note (+15 XP)
              </button>
            </div>
          </form>

          {currentBookNotes.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'var(--space-4)' }}>
              {currentBookNotes.map((n) => (
                <div
                  key={n.id}
                  className={`roadmap-step ${n.isCompleted ? 'completed' : ''}`}
                  style={{ alignItems: 'center' }}
                >
                  <button
                    type="button"
                    className="roadmap-step-check"
                    onClick={() => toggleBookNoteCompleted(n.id)}
                    aria-label="Toggle note completed"
                  >
                    {n.isCompleted ? '✓' : ''}
                  </button>
                  <div style={{ flex: 1 }}>
                    <span className="tier-badge tier-badge--2" style={{ marginBottom: '4px' }}>
                      {n.noteType.replace('_', ' ')}
                    </span>
                    <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', textDecoration: n.isCompleted ? 'line-through' : 'none' }}>
                      {n.content}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={() => deleteBookNote(n.id)}
                    aria-label="Delete note"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <LocalCoachDrawer
        isOpen={coachOpen}
        onClose={() => setCoachOpen(false)}
        initialMode="leadership_mentor"
        initialPrompt={coachPrompt}
        contextDomain={selectedBook.title}
      />
    </div>
  );
}
