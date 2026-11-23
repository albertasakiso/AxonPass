/* ===================================================================
   ANOXPASS — Skill Academies & FSRS Spaced-Repetition Review Hub
   Public Speaking · Speed & Deep Reading · Leadership Mastery · FSRS
   =================================================================== */

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ACADEMY_TRACKS } from '../data';
import type { AcademyId, AcademyLesson, FSRSRating } from '../types/academy';
import { useAcademyProgressStore } from '../stores/academyProgressStore';
import { downloadAnkiCsv, forecastRetention7Days } from '../lib/fsrs';
import { analyzeSpeechLocally, type LocalCoachMode } from '../lib/ai/localCoachService';
import { LocalCoachDrawer } from '../components/academy/LocalCoachDrawer';
import AdobeContentReader from '../components/learn/AdobeContentReader';

type AcademyTab = AcademyId | 'fsrs';

export default function AcademyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as AcademyTab) || 'public-speaking';
  const [activeTab, setActiveTab] = useState<AcademyTab>(initialTab);
  const [selectedLesson, setSelectedLesson] = useState<AcademyLesson | null>(null);

  // Interactive drill timer & notes
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [timerRunning, setTimerRunning] = useState(false);
  const [drillResponse, setDrillResponse] = useState('');

  // FSRS review state
  const [showAnswer, setShowAnswer] = useState(false);
  const [fsrsFilter, setFsrsFilter] = useState<'all' | 'mcq' | 'certification' | 'academy'>('all');
  const [clozeFront, setClozeFront] = useState('');
  const [clozeBack, setClozeBack] = useState('');
  const [clozeTag, setClozeTag] = useState('custom');

  // AI Coach Drawer
  const [coachOpen, setCoachOpen] = useState(false);
  const [coachMode, setCoachMode] = useState<LocalCoachMode>('speech_coach');
  const [coachPrompt, setCoachPrompt] = useState<string | undefined>(undefined);
  const [showLessonAudio, setShowLessonAudio] = useState(false);

  const {
    lessonProgress,
    completeAcademyLesson,
    addFsrsCard,
    reviewFsrsCard,
    getDueFsrsCards,
    fsrsCards,
  } = useAcademyProgressStore();

  useEffect(() => {
    const t = searchParams.get('tab') as AcademyTab | null;
    if (t && ['public-speaking', 'reading-mastery', 'leadership-mastery', 'fsrs'].includes(t)) {
      setActiveTab(t);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) return;
    const id = window.setInterval(() => {
      setTimerSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning, timerSeconds]);

  const currentTrack = useMemo(
    () => ACADEMY_TRACKS.find((t) => t.id === activeTab) || ACADEMY_TRACKS[0],
    [activeTab]
  );

  const dueCards = getDueFsrsCards();
  const filteredDueCards = useMemo(() => {
    if (fsrsFilter === 'all') return dueCards;
    if (fsrsFilter === 'mcq') return dueCards.filter((c) => c.id.startsWith('mcq-') || c.tags?.includes('Missed MCQ'));
    if (fsrsFilter === 'certification') return dueCards.filter((c) => c.sourceType === 'certification');
    return dueCards.filter((c) => c.sourceType === 'academy' || c.sourceType === 'book');
  }, [dueCards, fsrsFilter]);
  const activeCard = filteredDueCards[0] || null;
  const retentionForecast = useMemo(() => forecastRetention7Days(fsrsCards), [fsrsCards]);

  const speechMetrics = useMemo(() => {
    if (activeTab !== 'public-speaking' || !drillResponse.trim()) return null;
    return analyzeSpeechLocally(drillResponse);
  }, [activeTab, drillResponse]);

  function switchTab(tab: AcademyTab) {
    setActiveTab(tab);
    setSelectedLesson(null);
    setTimerRunning(false);
    setSearchParams({ tab });
  }

  function openLesson(lesson: AcademyLesson) {
    setSelectedLesson(lesson);
    setTimerSeconds(lesson.drill.durationMinutes * 60);
    setTimerRunning(false);
    setDrillResponse('');
  }

  function formatTimer(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function handleCompleteLesson(lesson: AcademyLesson) {
    completeAcademyLesson({
      trackId: currentTrack.id,
      moduleId: lesson.moduleId,
      lessonId: lesson.id,
      practiceMinutes: lesson.durationMinutes,
      xpReward: lesson.xpReward,
      notes: drillResponse.trim() || undefined,
    });
  }

  function handleRateCard(rating: FSRSRating) {
    if (!activeCard) return;
    reviewFsrsCard(activeCard.id, rating);
    setShowAnswer(false);
  }

  return (
    <div className="academy-page">
      {/* Hero */}
      <section className="academy-hero">
        <div className="academy-hero-content">
          <div>
            <h1>🎓 Personal Mastery Academies & FSRS Review</h1>
            <p>
              Deliberate-practice academies for Public Speaking, Speed &amp; Deep Reading, and
              Executive Leadership — paired with timed interactive drills, local AI coaching, and
              FSRS v4.5 spaced repetition.
            </p>
            <div className="academy-hero-badges">
              <span className="hero-pill">🎙️ Public Speaking</span>
              <span className="hero-pill">📖 Reading Mastery</span>
              <span className="hero-pill">🏆 Leadership</span>
              <span className="hero-pill">🧠 {dueCards.length} FSRS Due</span>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ background: '#fff', color: 'var(--color-primary)', fontWeight: 700 }}
            onClick={() => {
              setCoachMode(activeTab === 'fsrs' ? 'exam_proctor' : currentTrack.coachMode);
              setCoachPrompt(undefined);
              setCoachOpen(true);
            }}
          >
            🤖 Open Local AI Coach
          </button>
        </div>
      </section>

      {/* Academy Tabs */}
      <div className="tier-filter-bar" role="tablist">
        {ACADEMY_TRACKS.map((track) => (
          <button
            key={track.id}
            type="button"
            className={`tier-pill ${activeTab === track.id ? 'active' : ''}`}
            onClick={() => switchTab(track.id)}
          >
            <span>{track.icon}</span>
            <span>{track.title}</span>
          </button>
        ))}
        <button
          type="button"
          className={`tier-pill ${activeTab === 'fsrs' ? 'active' : ''}`}
          onClick={() => switchTab('fsrs')}
        >
          <span>🧠</span>
          <span>FSRS Review Queue ({dueCards.length})</span>
        </button>
      </div>

      {/* FSRS Review Queue Tab */}
      {activeTab === 'fsrs' ? (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Unified FSRS Filter + 7-Day Forecast + Anki Export Toolbar */}
          <div className="card" style={{ padding: 'var(--space-4)', display: 'grid', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {([
                  { id: 'all', label: `All Due (${dueCards.length})` },
                  { id: 'mcq', label: 'Missed MCQs' },
                  { id: 'certification', label: 'Textbooks & Certs' },
                  { id: 'academy', label: 'Academies & Books' },
                ] as const).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`btn btn-xs ${fsrsFilter === f.id ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => {
                      setFsrsFilter(f.id);
                      setShowAnswer(false);
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-xs btn-secondary"
                disabled={fsrsCards.length === 0}
                onClick={() => downloadAnkiCsv(fsrsCards)}
              >
                📥 Export Anki Deck ({fsrsCards.length} Cards .CSV)
              </button>
            </div>

            {/* 7-Day Retention Forecast Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(92px, 1fr))', gap: '6px' }}>
              {retentionForecast.map((d) => (
                <div
                  key={d.dayLabel}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: 'var(--color-bg-subtle)',
                    border: '1px solid var(--border-color)',
                    fontSize: '11px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{d.dayLabel}</div>
                  <div style={{ color: 'var(--color-primary)' }}>{d.dueCount} due</div>
                  <div style={{ color: 'var(--color-ink-muted)', fontSize: '10px' }}>{d.avgRetrievabilityPct}% R</div>
                </div>
              ))}
            </div>
          </div>

          {activeCard ? (
            <div className="fsrs-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                <span>Source: {activeCard.sourceType.toUpperCase()}</span>
                <span>
                  {filteredDueCards.length} due in view · {fsrsCards.length} total cards
                </span>
              </div>
              <h2 style={{ margin: 'var(--space-2) 0', fontSize: 'var(--text-xl)' }}>
                {activeCard.front}
              </h2>

              {!showAnswer ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ alignSelf: 'center', minWidth: '180px' }}
                  onClick={() => setShowAnswer(true)}
                >
                  Reveal Answer
                </button>
              ) : (
                <>
                  <div
                    style={{
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg-subtle)',
                      border: '1px solid var(--border-color)',
                      textAlign: 'left',
                      whiteSpace: 'pre-wrap',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    {activeCard.back}
                  </div>
                  <div className="fsrs-rating-grid">
                    <button type="button" className="fsrs-btn fsrs-btn--again" onClick={() => handleRateCard(1)}>
                      1 · Again
                    </button>
                    <button type="button" className="fsrs-btn fsrs-btn--hard" onClick={() => handleRateCard(2)}>
                      2 · Hard
                    </button>
                    <button type="button" className="fsrs-btn fsrs-btn--good" onClick={() => handleRateCard(3)}>
                      3 · Good
                    </button>
                    <button type="button" className="fsrs-btn fsrs-btn--easy" onClick={() => handleRateCard(4)}>
                      4 · Easy
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="fsrs-card">
              <div style={{ fontSize: '2.5rem' }}>🎉</div>
              <h2 style={{ margin: 0 }}>All Caught Up!</h2>
              <p style={{ color: 'var(--color-ink-muted)', margin: 0 }}>
                You have 0 FSRS cards due in this view ({fsrsCards.length} total cards in your deck). Missed MCQs, textbook highlights, and Cloze cards automatically sync here.
              </p>
            </div>
          )}

          {/* Quick Cloze Flashcard Creator */}
          <div className="card" style={{ padding: 'var(--space-4)', display: 'grid', gap: '8px' }}>
            <strong style={{ fontSize: 'var(--text-sm)' }}>➕ Quick Cloze / Active Recall Card</strong>
            <input
              type="text"
              className="input"
              placeholder="Front / Cloze prompt (e.g. Under ITAF 4th Ed, {{c1::Standards}} are mandatory requirements)"
              value={clozeFront}
              onChange={(e) => setClozeFront(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="input"
                style={{ flex: 2, minWidth: '200px' }}
                placeholder="Back answer / explanation..."
                value={clozeBack}
                onChange={(e) => setClozeBack(e.target.value)}
              />
              <input
                type="text"
                className="input"
                style={{ flex: 1, minWidth: '120px' }}
                placeholder="Tag (e.g. CISA)"
                value={clozeTag}
                onChange={(e) => setClozeTag(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  if (!clozeFront.trim() || !clozeBack.trim()) return;
                  addFsrsCard({
                    sourceType: 'certification',
                    sourceId: 'custom-cloze',
                    front: clozeFront.trim(),
                    back: clozeBack.trim(),
                    tags: ['Cloze', clozeTag.trim() || 'custom'],
                  });
                  setClozeFront('');
                  setClozeBack('');
                }}
              >
                Add Card
              </button>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Selected Lesson Interactive Drill Workspace */}
          {selectedLesson && (
            <section className="roadmap-drawer">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <div>
                  <span className="tier-badge tier-badge--2">
                    {selectedLesson.frameworkName || currentTrack.title} · {selectedLesson.durationMinutes} min
                  </span>
                  <h2 style={{ margin: '6px 0 0', fontFamily: 'var(--font-display)' }}>
                    {selectedLesson.title}
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)' }}>
                    {selectedLesson.summary}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${showLessonAudio ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setShowLessonAudio((s) => !s)}
                  >
                    🎧 {showLessonAudio ? 'Hide Audio' : 'Read Aloud'}
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelectedLesson(null)}>
                    Close ✕
                  </button>
                </div>
              </div>

              {showLessonAudio && (
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <AdobeContentReader
                    contentMarkdown={`# ${selectedLesson.title}\n\n${selectedLesson.summary}\n\n## Key Concepts\n${selectedLesson.keyConcepts.map((k) => `- ${k}`).join('\n')}\n\n## Actionable Takeaway\n${selectedLesson.actionableTakeaway}\n\n## Practice Drill: ${selectedLesson.drill.title}\n${selectedLesson.drill.prompt}\n\n${selectedLesson.drill.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`}
                    chapterTitle={selectedLesson.title}
                    bookTitle={currentTrack.title}
                    showAudioControlsInitially={true}
                  />
                </div>
              )}

              {/* Key Concepts */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'var(--space-4)' }}>
                {selectedLesson.keyConcepts.map((kc) => (
                  <span key={kc} className="tier-badge tier-badge--3">
                    {kc}
                  </span>
                ))}
              </div>

              <div
                style={{
                  marginTop: 'var(--space-4)',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-primary-50)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                <strong>💡 Actionable Takeaway:</strong> {selectedLesson.actionableTakeaway}
              </div>

              {/* Interactive Timed Practice Drill */}
              <div className="drill-box" style={{ marginTop: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 'var(--text-base)' }}>
                      ⚡ Practice Drill: {selectedLesson.drill.title}
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                      {selectedLesson.drill.prompt}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="drill-timer-display">{formatTimer(timerSeconds)}</span>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setTimerRunning((r) => !r)}
                    >
                      {timerRunning ? 'Pause' : 'Start Timer'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setTimerRunning(false);
                        setTimerSeconds(selectedLesson.drill.durationMinutes * 60);
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: 'var(--text-xs)', color: 'var(--color-ink)' }}>
                  {selectedLesson.drill.steps.map((step) => (
                    <li key={step} style={{ marginBottom: '4px' }}>
                      {step}
                    </li>
                  ))}
                </ol>

                <textarea
                  className="book-notes-area"
                  value={drillResponse}
                  onChange={(e) => setDrillResponse(e.target.value)}
                  placeholder="Write your speech transcript, SQ3R summary, Zettelkasten note, or leadership reflection here..."
                />

                {speechMetrics && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary)' }}>
                    <span>📝 {speechMetrics.wordCount} words</span>
                    <span>🗣️ Fillers: {speechMetrics.fillerCount} ({speechMetrics.fillerRatePercent}%)</span>
                    <span>⭐ Delivery Score: {speechMetrics.deliveryScore}/100</span>
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleCompleteLesson(selectedLesson)}
                  >
                    ✓ Complete Lesson (+{selectedLesson.xpReward} XP)
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                      addFsrsCard({
                        sourceType: 'academy',
                        sourceId: selectedLesson.id,
                        front: `[${currentTrack.title}] ${selectedLesson.title}: What is the core takeaway?`,
                        back: selectedLesson.actionableTakeaway,
                        tags: [currentTrack.id],
                      })
                    }
                  >
                    + Add to FSRS Queue
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setCoachMode(selectedLesson.drill.coachMode);
                      setCoachPrompt(
                        drillResponse.trim()
                          ? `Evaluate my practice drill for "${selectedLesson.title}":\n\n${drillResponse}`
                          : `Coach me through the drill "${selectedLesson.drill.title}": ${selectedLesson.drill.prompt}`
                      );
                      setCoachOpen(true);
                    }}
                  >
                    🤖 Get AI Feedback
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Modules & Lessons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {currentTrack.modules.map((mod) => (
              <section key={mod.id} className="mastery-card">
                <div className="mastery-card-header">
                  <div>
                    <h2 className="mastery-card-title">
                      Module {mod.order}: {mod.title}
                    </h2>
                    <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                      {mod.subtitle} · ~{mod.estimatedMinutes} min
                    </p>
                  </div>
                </div>

                <div className="paths-grid">
                  {mod.lessons.map((lesson) => {
                    const isDone = lessonProgress[lesson.id]?.completed ?? false;
                    return (
                      <div
                        key={lesson.id}
                        className="roadmap-step"
                        style={{
                          flexDirection: 'column',
                          background: isDone ? 'var(--color-success-bg)' : 'var(--color-bg-subtle)',
                          borderColor: isDone ? 'var(--color-success-border)' : 'var(--border-color)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
                          <strong style={{ fontSize: 'var(--text-sm)' }}>
                            {isDone ? '✅ ' : '📘 '}
                            {lesson.title}
                          </strong>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary-light)' }}>
                            +{lesson.xpReward} XP
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                          {lesson.summary}
                        </p>
                        <button
                          type="button"
                          className="btn btn-primary btn-xs"
                          style={{ marginTop: '6px' }}
                          onClick={() => openLesson(lesson)}
                        >
                          {isDone ? 'Practice Again' : 'Start Lesson & Drill'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      <LocalCoachDrawer
        isOpen={coachOpen}
        onClose={() => setCoachOpen(false)}
        initialMode={coachMode}
        initialPrompt={coachPrompt}
        contextDomain={currentTrack.title}
      />
    </div>
  );
}
