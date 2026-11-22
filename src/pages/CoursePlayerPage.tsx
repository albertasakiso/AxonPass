/* ===================================================================
   ANOXPASS — End-to-End Certification Course Player
   Routes: /learn (Catalog) & /learn/:certId (Interactive Course Player)
   =================================================================== */

import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CERTIFICATION_COURSES, getCourseByCertId } from '../data';
import {
  DIFFICULTY_TIER_META,
  type DifficultyTier,
} from '../types/academy';
import type { CourseLesson } from '../types/course';
import { useAcademyProgressStore } from '../stores/academyProgressStore';
import { LocalCoachDrawer } from '../components/academy/LocalCoachDrawer';
import { StorageEfficiencyPanel } from '../components/academy/StorageEfficiencyPanel';
import AdobeContentReader from '../components/learn/AdobeContentReader';
import {
  fetchSynthesizedLessons,
  fetchSynthesizedQuestions,
  type SynthesizedExamQuestion,
} from '../lib/synthesizedCloudContent';

const TIERS: DifficultyTier[] = [1, 2, 3, 4, 5];

function lessonToSpeechMarkdown(lesson: CourseLesson): string {
  const sections: string[] = [`# ${lesson.title}`, lesson.summary];
  if (lesson.learningObjectives?.length) {
    sections.push('## Learning Objectives\n' + lesson.learningObjectives.map((o) => `- ${o}`).join('\n'));
  }
  for (const c of lesson.coreConcepts || []) {
    sections.push(`## ${c.heading}\n${c.explanation}${c.mentalModel ? `\n\n> Mental Model: ${c.mentalModel}` : ''}`);
  }
  if (lesson.realWorldScenario) {
    sections.push(
      `## Real-World Scenario: ${lesson.realWorldScenario.title}\n${lesson.realWorldScenario.situation}\n\n${lesson.realWorldScenario.analysis}\n\nTakeaway: ${lesson.realWorldScenario.takeaway}`
    );
  }
  if (lesson.examTraps?.length) {
    sections.push('## Exam Traps & Pro Tips\n' + lesson.examTraps.map((t) => `- ${t}`).join('\n'));
  }
  return sections.join('\n\n');
}

type WorkspaceView =
  | { type: 'lesson'; domainId: string; lessonId: string }
  | { type: 'capstone' }
  | { type: 'strategy' }
  | { type: 'cloud_sim' };

export default function CoursePlayerPage({ embeddedCertId }: { embeddedCertId?: string }) {
  const { certId: routeCertId } = useParams<{ certId?: string }>();
  const certId = embeddedCertId || routeCertId;
  const isEmbedded = Boolean(embeddedCertId);
  const navigate = useNavigate();

  // Catalog filters
  const [selectedTier, setSelectedTier] = useState<DifficultyTier | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Course player state
  const [activeView, setActiveView] = useState<WorkspaceView | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [showGlossary, setShowGlossary] = useState(false);
  const [showAudioLesson, setShowAudioLesson] = useState(false);
  const [showModelSolution, setShowModelSolution] = useState(false);
  const [flashcardsAdded, setFlashcardsAdded] = useState<Record<string, boolean>>({});

  // Local AI Coach drawer
  const [coachOpen, setCoachOpen] = useState(false);
  const [coachPrompt, setCoachPrompt] = useState<string | undefined>(undefined);

  // Cloud-synthesized lessons & mock exam questions (learn-from-anywhere)
  const [cloudLessons, setCloudLessons] = useState<CourseLesson[]>([]);
  const [cloudQuestions, setCloudQuestions] = useState<SynthesizedExamQuestion[]>([]);
  const [mockAnswers, setMockAnswers] = useState<Record<string, number>>({});
  const [mockSubmitted, setMockSubmitted] = useState(false);

  const {
    certCourseProgress,
    completeCertLesson,
    recordConceptCheck,
    completeCourseDrill,
    getCertCourseStats,
    addFsrsCard,
  } = useAcademyProgressStore();

  const course = useMemo(
    () => (certId ? getCourseByCertId(certId) : undefined),
    [certId]
  );

  // Flattened lesson list for Prev/Next navigation
  const flatLessons = useMemo(() => {
    if (!course) return [];
    const list: { domainId: string; domainTitle: string; lesson: CourseLesson }[] = [];
    for (const d of course.domains) {
      for (const l of d.lessons) {
        list.push({ domainId: d.id, domainTitle: d.title, lesson: l });
      }
    }
    return list;
  }, [course]);

  // Initialize active lesson when entering a course
  useEffect(() => {
    if (!course || flatLessons.length === 0) {
      setActiveView(null);
      return;
    }
    const savedLast = certCourseProgress[course.certId]?.lastLessonId;
    const match = savedLast
      ? flatLessons.find((f) => f.lesson.id === savedLast)
      : flatLessons[0];
    const target = match || flatLessons[0];
    setActiveView({ type: 'lesson', domainId: target.domainId, lessonId: target.lesson.id });
    setSelectedOptions({});
    setCheckedSteps({});
    setShowGlossary(false);
    setShowModelSolution(false);
    setMockAnswers({});
    setMockSubmitted(false);
    fetchSynthesizedLessons(course.certId).then(setCloudLessons).catch(() => setCloudLessons([]));
    fetchSynthesizedQuestions(course.certId, 50).then(setCloudQuestions).catch(() => setCloudQuestions([]));
  }, [course?.certId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── CATALOG VIEW (/learn) ──
  if (!certId || !course) {
    const filteredCourses = CERTIFICATION_COURSES.filter((c) => {
      if (selectedTier !== 'all' && c.tier !== selectedTier) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.certCode.toLowerCase().includes(q) ||
          c.provider.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => a.tier - b.tier);

    return (
      <div className="academy-page">
        <section className="academy-hero">
          <div className="academy-hero-content">
            <div>
              <h1>📚 End-to-End Certification Courses</h1>
              <p>
                Master any certification from zero to exam-ready inside AnoxPass — complete with
                official domain blueprints, mental models, real-world scenarios, interactive
                concept checks, hands-on drills, FSRS flashcards, and local open-weights AI tutoring.
              </p>
              <div className="academy-hero-badges">
                <span className="hero-pill">🎓 {CERTIFICATION_COURSES.length} Full Courses</span>
                <span className="hero-pill">🧠 FSRS Flashcards Built-In</span>
                <span className="hero-pill">🤖 Lesson-Aware Local AI Tutor</span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ background: '#fff', color: 'var(--color-primary)', fontWeight: 700 }}
              onClick={() => navigate('/paths')}
            >
              🗺️ View Mastery Paths
            </button>
          </div>
        </section>

        <StorageEfficiencyPanel />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="tier-filter-bar" role="tablist">
            <button
              type="button"
              className={`tier-pill ${selectedTier === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedTier('all')}
            >
              All Courses ({CERTIFICATION_COURSES.length})
            </button>
            {TIERS.map((tier) => (
              <button
                key={tier}
                type="button"
                className={`tier-pill ${selectedTier === tier ? 'active' : ''}`}
                onClick={() => setSelectedTier(tier)}
              >
                Tier {tier}: {DIFFICULTY_TIER_META[tier].label}
              </button>
            ))}
          </div>

          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="input"
            style={{ maxWidth: '240px', padding: '6px 12px', fontSize: 'var(--text-sm)' }}
          />
        </div>

        <section className="paths-grid">
          {filteredCourses.map((c) => {
            const totalLessons = c.domains.reduce((sum, d) => sum + d.lessons.length, 0);
            const stats = getCertCourseStats(c.certId, totalLessons);

            return (
              <article key={c.certId} className="mastery-card">
                <div className="mastery-card-header">
                  <span className={`tier-badge tier-badge--${c.tier}`}>
                    Tier {c.tier} · {DIFFICULTY_TIER_META[c.tier].label}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-ink-muted)' }}>
                    {c.provider}
                  </span>
                </div>

                <div>
                  <h3 className="mastery-card-title">{c.title}</h3>
                  <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                    {c.tagline}
                  </p>
                </div>

                <div className="mastery-card-meta">
                  <span>🏛️ {c.domains.length} Domains</span>
                  <span>📖 {totalLessons} Lessons</span>
                  <span>⏱ {c.estimatedTotalHours}h</span>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', fontWeight: 600 }}>
                    <span>Course Mastery</span>
                    <span>
                      {stats.completedLessons}/{totalLessons} ({stats.percentComplete}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill progress-fill--emerald"
                      style={{ width: `${stats.percentComplete}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: 'auto' }}
                  onClick={() => navigate(`/learn/${c.certId}`)}
                >
                  {stats.completedLessons > 0
                    ? `Continue Learning (${stats.percentComplete}%)`
                    : 'Start Course'}
                </button>
              </article>
            );
          })}
        </section>
      </div>
    );
  }

  // ── COURSE PLAYER VIEW (/learn/:certId) ──
  const totalLessons = flatLessons.length;
  const stats = getCertCourseStats(course.certId, totalLessons);
  const progressRec = certCourseProgress[course.certId];
  const completedIds = new Set(progressRec?.completedLessonIds || []);
  const completedDrills = new Set(progressRec?.completedDrillIds || []);

  const currentIdx =
    activeView?.type === 'lesson'
      ? flatLessons.findIndex((f) => f.lesson.id === activeView.lessonId)
      : -1;
  const currentEntry = currentIdx >= 0 ? flatLessons[currentIdx] : null;
  const activeLesson = currentEntry?.lesson || null;

  function goToLesson(domainId: string, lessonId: string) {
    setActiveView({ type: 'lesson', domainId, lessonId });
    setSelectedOptions({});
    setCheckedSteps({});
    setShowGlossary(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleOptionSelect(checkId: string, optionIdx: number, correctIndex: number) {
    if (selectedOptions[checkId] !== undefined) return;
    setSelectedOptions((prev) => ({ ...prev, [checkId]: optionIdx }));
    recordConceptCheck({
      certId: course!.certId,
      checkId,
      correct: optionIdx === correctIndex,
      xpReward: 15,
    });
  }

  function handleAddLessonFlashcards(lesson: CourseLesson) {
    lesson.flashcards.forEach((fc, idx) => {
      addFsrsCard({
        id: `course-${course!.certId}-${lesson.id}-fc-${idx}`,
        sourceType: 'certification',
        sourceId: course!.certId,
        front: `[${course!.certCode}] ${fc.front}`,
        back: fc.back,
        tags: [course!.certCode, fc.tag],
      });
    });
    setFlashcardsAdded((prev) => ({ ...prev, [lesson.id]: true }));
  }

  function handleCompleteAndContinue() {
    if (!activeLesson || !currentEntry) return;
    completeCertLesson({
      certId: course!.certId,
      lessonId: activeLesson.id,
      domainId: currentEntry.domainId,
      xpReward: 50,
    });
    if (currentIdx + 1 < flatLessons.length) {
      const next = flatLessons[currentIdx + 1];
      goToLesson(next.domainId, next.lesson.id);
    } else {
      setActiveView({ type: 'capstone' });
    }
  }

  return (
    <div className="academy-page">
      {/* Top Course Banner */}
      {!isEmbedded && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/learn')}
            >
              ← All Courses
            </button>
            <div>
              <span className={`tier-badge tier-badge--${course.tier}`}>
                {course.certCode} · Tier {course.tier}
              </span>
              <h1 style={{ margin: '2px 0 0', fontSize: 'var(--text-xl)', fontFamily: 'var(--font-display)' }}>
                {course.title}
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ minWidth: '140px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                <span>Progress</span>
                <span>{stats.percentComplete}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill progress-fill--emerald" style={{ width: `${stats.percentComplete}%` }} />
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/practice')}
            >
              ✍️ Exam Simulator
            </button>
          </div>
        </div>
      )}

      {/* Main Split Layout: Syllabus + Lesson Workspace */}
      <div className="course-player-layout">
        {/* Left Syllabus Rail */}
        <aside className="course-syllabus" aria-label="Course Syllabus">
          {course.domains.map((dom) => (
            <div key={dom.id}>
              <div className="syllabus-domain-header">
                <span>D{dom.domainNumber}: {dom.title}</span>
                <span>{dom.examWeightPercent}%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                {dom.lessons.map((lesson) => {
                  const isDone = completedIds.has(lesson.id);
                  const isActive =
                    activeView?.type === 'lesson' && activeView.lessonId === lesson.id;
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      className={`syllabus-lesson-btn ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                      onClick={() => goToLesson(dom.id, lesson.id)}
                    >
                      <span>{isDone ? '✅' : '○'}</span>
                      <span>{lesson.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              type="button"
              className={`syllabus-lesson-btn ${activeView?.type === 'capstone' ? 'active' : ''}`}
              onClick={() => setActiveView({ type: 'capstone' })}
            >
              <span>🏆</span>
              <span>Capstone Case Study</span>
            </button>
            <button
              type="button"
              className={`syllabus-lesson-btn ${activeView?.type === 'strategy' ? 'active' : ''}`}
              onClick={() => setActiveView({ type: 'strategy' })}
            >
              <span>🎯</span>
              <span>Exam Strategy Blueprint</span>
            </button>
            <button
              type="button"
              className={`syllabus-lesson-btn ${activeView?.type === 'cloud_sim' ? 'active' : ''}`}
              onClick={() => setActiveView({ type: 'cloud_sim' })}
            >
              <span>☁️</span>
              <span>
                AI Cloud Modules &amp; Mock Exam
                {(cloudLessons.length > 0 || cloudQuestions.length > 0) &&
                  ` (${cloudLessons.length + cloudQuestions.length})`}
              </span>
            </button>
          </div>
        </aside>

        {/* Main Interactive Workspace */}
        <main className="course-workspace">
          {activeView?.type === 'capstone' ? (
            <>
              <span className="tier-badge tier-badge--4">🏆 Capstone Case Study</span>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>{course.capstone.title}</h2>
              <div className="scenario-card">
                <strong>Executive Scenario</strong>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                  {course.capstone.scenario}
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', margin: '0 0 var(--space-2)' }}>Required Deliverables</h3>
                <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: 'var(--text-sm)' }}>
                  {course.capstone.tasks.map((t) => (
                    <li key={t} style={{ marginBottom: '6px' }}>{t}</li>
                  ))}
                </ol>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowModelSolution((s) => !s)}
                >
                  {showModelSolution ? 'Hide Model Solution' : 'Reveal Model Solution'}
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setCoachPrompt(`Review my approach to the ${course.certCode} Capstone Case Study "${course.capstone.title}". Walk me through the key decision points.`);
                    setCoachOpen(true);
                  }}
                >
                  🤖 Discuss Capstone with AI Proctor
                </button>
              </div>
              {showModelSolution && (
                <div className="concept-card">
                  <strong>Model Solution</strong>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', whiteSpace: 'pre-wrap' }}>
                    {course.capstone.modelSolution}
                  </p>
                </div>
              )}
            </>
          ) : activeView?.type === 'strategy' ? (
            <>
              <span className="tier-badge tier-badge--3">🎯 Exam Strategy Blueprint</span>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>
                {course.certCode} — Exam-Day Mastery Plan
              </h2>
              <div className="concept-card">
                <strong>Exam Format</strong>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>{course.examStrategy.examFormat}</p>
              </div>
              <div className="concept-card">
                <strong>Time Management Plan</strong>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>{course.examStrategy.timeManagementPlan}</p>
              </div>
              <div className="exam-traps-box">
                <strong>🧠 Exam Mindset Rules</strong>
                <ul style={{ margin: '8px 0 0', paddingLeft: '1.25rem', fontSize: 'var(--text-sm)' }}>
                  {course.examStrategy.mindsetRules.map((r) => (
                    <li key={r} style={{ marginBottom: '4px' }}>{r}</li>
                  ))}
                </ul>
              </div>
              <div className="concept-card">
                <strong>✅ Final Week Checklist</strong>
                <ul style={{ margin: '6px 0 0', paddingLeft: '1.25rem', fontSize: 'var(--text-sm)' }}>
                  {course.examStrategy.finalWeekChecklist.map((item) => (
                    <li key={item} style={{ marginBottom: '4px' }}>{item}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : activeView?.type === 'cloud_sim' ? (
            <>
              <span className="tier-badge tier-badge--1">☁️ Cloud-Synced Learn-From-Anywhere</span>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>
                {course.certCode} — AI-Synthesized Cloud Modules &amp; Mock Exam
              </h2>
              {cloudLessons.length === 0 && cloudQuestions.length === 0 ? (
                <div className="concept-card">
                  <strong>No cloud-synthesized units synced yet for {course.certCode}</strong>
                  <p style={{ margin: '4px 0', fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)' }}>
                    Run the unattended Ollama batch synthesizer once on your machine to generate
                    100%-coverage lessons &amp; realistic mock exam questions from <code>my_documents/</code> and sync compact text-only rows to Supabase:
                  </p>
                  <div className="concept-formula">
                    {`python local_ai_pipeline.py --synthesize-cert ${course.certId} --sync-supabase`}
                  </div>
                </div>
              ) : (
                <>
                  {cloudLessons.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      <h3 style={{ margin: 0, fontSize: 'var(--text-base)' }}>
                        📖 Cloud-Synthesized Lessons ({cloudLessons.length})
                      </h3>
                      {cloudLessons.map((cl) => (
                        <div key={cl.id} className="concept-card">
                          <strong>{cl.title}</strong>
                          <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                            {cl.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {cloudQuestions.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: 'var(--text-base)' }}>
                          ✍️ Cloud Mock Exam Simulator ({cloudQuestions.length} Questions)
                        </h3>
                        {mockSubmitted ? (
                          <span className="tier-badge tier-badge--1">
                            Score:{' '}
                            {cloudQuestions.filter((q) => mockAnswers[q.id] === q.correct_index).length}
                            /{cloudQuestions.length}
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary btn-xs"
                            onClick={() => setMockSubmitted(true)}
                          >
                            Submit Mock Exam
                          </button>
                        )}
                      </div>

                      {cloudQuestions.map((q, idx) => {
                        const chosen = mockAnswers[q.id];
                        return (
                          <div key={q.id} className="concept-check-card">
                            <strong style={{ fontSize: 'var(--text-sm)' }}>
                              Q{idx + 1}. [{q.domain_name}] {q.question_text}
                            </strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {q.options.map((opt, oIdx) => {
                                let cls = 'concept-option-btn';
                                if (mockSubmitted) {
                                  if (oIdx === q.correct_index) cls += ' correct';
                                  else if (oIdx === chosen) cls += ' wrong';
                                } else if (chosen === oIdx) {
                                  cls += ' active';
                                }
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    disabled={mockSubmitted}
                                    className={cls}
                                    style={
                                      !mockSubmitted && chosen === oIdx
                                        ? { borderColor: 'var(--color-primary)', background: 'var(--color-primary-50)' }
                                        : undefined
                                    }
                                    onClick={() =>
                                      setMockAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                                    }
                                  >
                                    {String.fromCharCode(65 + oIdx)}. {opt}
                                  </button>
                                );
                              })}
                            </div>
                            {mockSubmitted && (
                              <div style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-2)', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                                <strong>Rationale:</strong> {q.rationale}
                                {q.exam_trap && (
                                  <>
                                    <br />
                                    <strong>⚠️ Trap:</strong> {q.exam_trap}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </>
          ) : activeLesson ? (
            <>
              {/* Lesson Header */}
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="tier-badge tier-badge--2">
                    {currentEntry?.domainTitle} · ~{activeLesson.estimatedMinutes} min
                  </span>
                  {activeLesson.sourceRefs?.map((ref) => (
                    <span key={ref} className="tier-badge tier-badge--1">
                      📂 {ref}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)' }}>
                      {activeLesson.title}
                    </h2>
                    <p style={{ margin: '6px 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)' }}>
                      {activeLesson.summary}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`btn btn-sm ${showAudioLesson ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setShowAudioLesson((s) => !s)}
                  >
                    🎧 {showAudioLesson ? 'Hide Read Aloud' : 'Listen to Lesson'}
                  </button>
                </div>
              </div>

              {showAudioLesson && (
                <div className="card" style={{ padding: 'var(--space-4)', borderLeft: '4px solid var(--color-primary)' }}>
                  <AdobeContentReader
                    contentMarkdown={lessonToSpeechMarkdown(activeLesson)}
                    chapterTitle={activeLesson.title}
                    bookTitle={`${course.certCode} Guided Lesson`}
                    showAudioControlsInitially={true}
                    onNextChapter={handleCompleteAndContinue}
                  />
                </div>
              )}

              {/* Learning Objectives */}
              <div className="concept-card">
                <strong style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                  Learning Objectives
                </strong>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: 'var(--text-sm)' }}>
                  {activeLesson.learningObjectives.map((obj) => (
                    <li key={obj} style={{ marginBottom: '4px' }}>{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Core Concepts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <h3 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>Core Concepts</h3>
                {activeLesson.coreConcepts.map((c) => (
                  <div key={c.heading} className="concept-card">
                    <strong style={{ fontSize: 'var(--text-base)' }}>{c.heading}</strong>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>{c.explanation}</p>
                    {c.mentalModel && (
                      <div className="concept-mental-model">
                        <strong>🧠 Mental Model:</strong> {c.mentalModel}
                      </div>
                    )}
                    {c.formulaOrRule && (
                      <div className="concept-formula">{c.formulaOrRule}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Real-World Scenario */}
              <div className="scenario-card">
                <strong style={{ fontSize: 'var(--text-base)' }}>
                  🌍 Real-World Scenario: {activeLesson.realWorldScenario.title}
                </strong>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>
                  <strong>Situation:</strong> {activeLesson.realWorldScenario.situation}
                </p>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>
                  <strong>Analysis:</strong> {activeLesson.realWorldScenario.analysis}
                </p>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>
                  💡 Takeaway: {activeLesson.realWorldScenario.takeaway}
                </p>
              </div>

              {/* Exam Traps */}
              <div className="exam-traps-box">
                <strong style={{ fontSize: 'var(--text-sm)' }}>⚠️ Exam Traps &amp; Pro Tips</strong>
                <ul style={{ margin: '6px 0 0', paddingLeft: '1.25rem', fontSize: 'var(--text-sm)' }}>
                  {activeLesson.examTraps.map((trap) => (
                    <li key={trap} style={{ marginBottom: '4px' }}>{trap}</li>
                  ))}
                </ul>
              </div>

              {/* Expandable Key Terms Glossary */}
              <div>
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={() => setShowGlossary((g) => !g)}
                >
                  {showGlossary ? 'Hide Key Terms Glossary ▲' : `📖 Key Terms Glossary (${activeLesson.keyTerms.length}) ▼`}
                </button>
                {showGlossary && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px', marginTop: 'var(--space-3)' }}>
                    {activeLesson.keyTerms.map((kt) => (
                      <div key={kt.term} className="concept-card" style={{ padding: 'var(--space-3)' }}>
                        <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)' }}>{kt.term}</strong>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>{kt.definition}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Concept Checks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <h3 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>✅ Interactive Concept Checks</h3>
                {activeLesson.conceptChecks.map((cc, qIdx) => {
                  const chosen = selectedOptions[cc.id];
                  const answered = chosen !== undefined;
                  return (
                    <div key={cc.id} className="concept-check-card">
                      <strong style={{ fontSize: 'var(--text-sm)' }}>
                        Q{qIdx + 1}. {cc.question}
                      </strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {cc.options.map((opt, oIdx) => {
                          let cls = 'concept-option-btn';
                          if (answered) {
                            if (oIdx === cc.correctIndex) cls += ' correct';
                            else if (oIdx === chosen) cls += ' wrong';
                          }
                          return (
                            <button
                              key={opt}
                              type="button"
                              disabled={answered}
                              className={cls}
                              onClick={() => handleOptionSelect(cc.id, oIdx, cc.correctIndex)}
                            >
                              {String.fromCharCode(65 + oIdx)}. {opt}
                            </button>
                          );
                        })}
                      </div>
                      {answered && (
                        <div style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-subtle)' }}>
                          <strong>{chosen === cc.correctIndex ? '✅ Correct (+15 XP)!' : '❌ Review Rationale:'}</strong>{' '}
                          {cc.rationale}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Practical Drill / Lab */}
              <div className="drill-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 'var(--text-base)' }}>
                      🛠️ Practical Drill: {activeLesson.practicalDrill.title}
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                      {activeLesson.practicalDrill.prompt}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={() => {
                      setCoachPrompt(
                        `Coach me on the ${course.certCode} lesson "${activeLesson.title}" practical drill "${activeLesson.practicalDrill.title}": ${activeLesson.practicalDrill.prompt}`
                      );
                      setCoachOpen(true);
                    }}
                  >
                    🤖 Coach Me on This Drill
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activeLesson.practicalDrill.steps.map((step, sIdx) => {
                    const key = `${activeLesson.id}-step-${sIdx}`;
                    return (
                      <label key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={!!checkedSteps[key]}
                          onChange={(e) => setCheckedSteps((prev) => ({ ...prev, [key]: e.target.checked }))}
                        />
                        <span>{step}</span>
                      </label>
                    );
                  })}
                </div>

                <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                  <strong>Success Criteria:</strong> {activeLesson.practicalDrill.successCriteria}
                </div>

                <div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    disabled={completedDrills.has(`${activeLesson.id}-drill`)}
                    onClick={() =>
                      completeCourseDrill({
                        certId: course.certId,
                        drillId: `${activeLesson.id}-drill`,
                        xpReward: 25,
                      })
                    }
                  >
                    {completedDrills.has(`${activeLesson.id}-drill`)
                      ? '✅ Drill Completed'
                      : 'Mark Drill Complete (+25 XP)'}
                  </button>
                </div>
              </div>

              {/* Flashcard Deck Strip */}
              <div className="concept-card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                  <strong style={{ fontSize: 'var(--text-sm)' }}>
                    🧠 Lesson Flashcards ({activeLesson.flashcards.length} cards)
                  </strong>
                  <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                    Push these high-yield flashcards into your FSRS v4.5 spaced-repetition queue.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={!!flashcardsAdded[activeLesson.id]}
                  onClick={() => handleAddLessonFlashcards(activeLesson)}
                >
                  {flashcardsAdded[activeLesson.id]
                    ? '✅ Added to FSRS Queue'
                    : `+ Add ${activeLesson.flashcards.length} Cards to FSRS`}
                </button>
              </div>

              {/* Lesson Completion Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-4)' }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  disabled={currentIdx <= 0}
                  onClick={() => {
                    const prev = flatLessons[currentIdx - 1];
                    goToLesson(prev.domainId, prev.lesson.id);
                  }}
                >
                  ← Previous Lesson
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCompleteAndContinue}
                >
                  {completedIds.has(activeLesson.id)
                    ? 'Next Lesson →'
                    : 'Complete Lesson & Continue (+50 XP) →'}
                </button>
              </div>
            </>
          ) : null}
        </main>
      </div>

      <LocalCoachDrawer
        isOpen={coachOpen}
        onClose={() => setCoachOpen(false)}
        initialMode="exam_proctor"
        initialPrompt={coachPrompt}
        contextDomain={course.certCode}
      />
    </div>
  );
}
