/* ===================================================================
   ANOXPASS — Difficulty-Ranked Certification Mastery Paths Hub
   Tiers 1 (Foundational) -> 5 (Executive) + Interactive Path-to-Success
   =================================================================== */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CERTIFICATION_PATHS } from '../data';
import {
  DIFFICULTY_TIER_META,
  type CertificationPath,
  type DifficultyTier,
} from '../types/academy';
import { useAcademyProgressStore } from '../stores/academyProgressStore';
import { useAuthStore } from '../stores/authStore';
import { toDbCertSlug } from '../lib/textbookService';
import { LocalCoachDrawer } from '../components/academy/LocalCoachDrawer';
import { StorageEfficiencyPanel } from '../components/academy/StorageEfficiencyPanel';

const TIERS: DifficultyTier[] = [1, 2, 3, 4, 5];

export default function PathsPage() {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<DifficultyTier | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePath, setActivePath] = useState<CertificationPath | null>(null);
  const [coachOpen, setCoachOpen] = useState(false);
  const [coachPrompt, setCoachPrompt] = useState<string | undefined>(undefined);

  const {
    pathProgress,
    certCourseProgress,
    togglePathMilestone,
    updatePathTargetDate,
    addFsrsCard,
  } = useAcademyProgressStore();

  const filteredPaths = useMemo(() => {
    return CERTIFICATION_PATHS.filter((p) => {
      if (selectedTier !== 'all' && p.tier !== selectedTier) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.certCode.toLowerCase().includes(q) ||
          p.provider.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => a.tier - b.tier);
  }, [selectedTier, searchQuery]);

  const totalCompletedMilestones = useMemo(() => {
    return Object.values(pathProgress).reduce(
      (sum, rec) => sum + rec.completedMilestones.length,
      0
    );
  }, [pathProgress]);

  function openCoachForPath(path: CertificationPath) {
    setCoachPrompt(
      `Create a focused 7-day study sprint for ${path.title} (${path.certCode}, Tier ${path.tier} ${path.tierLabel}). Focus on the highest-weight exam domains.`
    );
    setCoachOpen(true);
  }

  return (
    <div className="academy-page">
      {/* Hero Banner */}
      <section className="academy-hero">
        <div className="academy-hero-content">
          <div>
            <h1>🗺️ Difficulty-Ranked Certification Mastery Paths</h1>
            <p>
              Structured Path-to-Success roadmaps ranked from Tier 1 (Foundational) to Tier 5
              (Executive), integrated directly with your local <code>my_documents/</code> study
              library, domain weights, readiness gates, and Supabase Realtime progress sync.
            </p>
            <div className="academy-hero-badges">
              <span className="hero-pill">🎯 {CERTIFICATION_PATHS.length} Certification Tracks</span>
              <span className="hero-pill">✅ {totalCompletedMilestones} Milestones Completed</span>
              <span className="hero-pill">🧠 Local Open-Weights RAG</span>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setCoachPrompt(undefined);
              setCoachOpen(true);
            }}
            style={{ background: '#fff', color: 'var(--color-primary)', fontWeight: 700 }}
          >
            🤖 Ask Local Exam Proctor
          </button>
        </div>
      </section>

      {/* Storage Efficiency Architecture Panel */}
      <StorageEfficiencyPanel />

      {/* Tier Filter & Search */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="tier-filter-bar" role="tablist" aria-label="Filter by difficulty tier">
          <button
            type="button"
            className={`tier-pill ${selectedTier === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedTier('all')}
          >
            All Tiers ({CERTIFICATION_PATHS.length})
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
          placeholder="Search CISA, AWS, CISSP, FIFA..."
          className="input"
          style={{ maxWidth: '260px', padding: '6px 12px', fontSize: 'var(--text-sm)' }}
        />
      </div>

      {/* Selected Path Interactive Roadmap Drawer */}
      {activePath && (
        <section className="roadmap-drawer" aria-label={`${activePath.title} Path to Success`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className={`tier-badge tier-badge--${activePath.tier}`}>
                  Tier {activePath.tier} · {activePath.tierLabel}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
                  {activePath.provider} · {activePath.estimatedHours}h est. · Pass: {activePath.passingScore}
                </span>
              </div>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)' }}>
                {activePath.title} — Path to Success
              </h2>
              <p style={{ margin: '6px 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)' }}>
                {activePath.description}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => openCoachForPath(activePath)}
              >
                🤖 AI Study Sprint
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setActivePath(null)}
              >
                Close ✕
              </button>
            </div>
          </div>

          {/* Target Exam Date & Local Docs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
              <span>📅 Target Exam Date:</span>
              <input
                type="date"
                value={pathProgress[activePath.id]?.targetExamDate || ''}
                onChange={(e) => updatePathTargetDate(activePath.id, e.target.value)}
                style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color-strong)' }}
              />
            </label>
            {activePath.myDocumentsRefs.length > 0 && (
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                <strong>📂 Local Study Corpus:</strong> {activePath.myDocumentsRefs.join(', ')}
              </div>
            )}
          </div>

          {/* Domain Weights */}
          <div style={{ marginTop: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', margin: '0 0 var(--space-2)' }}>Exam Domain Blueprint</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {activePath.domainWeights.map((dw) => (
                <div
                  key={dw.domain}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-primary-50)',
                    border: '1px solid var(--color-primary-100)',
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  <strong>{dw.domain}</strong> ({dw.weightPercent}%)
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Milestones */}
          <div className="roadmap-steps">
            {activePath.milestones.map((m) => {
              const completed =
                pathProgress[activePath.id]?.completedMilestones.includes(m.id) ?? false;
              return (
                <div key={m.id} className={`roadmap-step ${completed ? 'completed' : ''}`}>
                  <button
                    type="button"
                    className="roadmap-step-check"
                    onClick={() =>
                      togglePathMilestone(
                        activePath.id,
                        m.id,
                        activePath.tier,
                        activePath.milestones.length,
                        m.xpReward
                      )
                    }
                    aria-label={`Mark ${m.title} as ${completed ? 'incomplete' : 'complete'}`}
                  >
                    {completed ? '✓' : ''}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                      <strong style={{ fontSize: 'var(--text-sm)' }}>
                        Step {m.order}: {m.title}
                      </strong>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary-light)' }}>
                        +{m.xpReward} XP · {m.estimatedHours}h
                      </span>
                    </div>
                    <p style={{ margin: '4px 0', fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                      {m.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '11px', marginTop: '6px' }}>
                      <span>📦 <strong>Deliverable:</strong> {m.deliverable}</span>
                      <span>🚦 <strong>Gate:</strong> {m.readinessGate}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={() =>
                      addFsrsCard({
                        sourceType: 'certification',
                        sourceId: activePath.id,
                        front: `[${activePath.certCode}] ${m.title}: What is the readiness gate & key deliverable?`,
                        back: `Deliverable: ${m.deliverable}\nReadiness Gate: ${m.readinessGate}`,
                        tags: [activePath.certCode, `tier-${activePath.tier}`],
                      })
                    }
                    title="Add milestone to FSRS spaced repetition queue"
                  >
                    + FSRS
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Certification Paths Grid */}
      <section className="paths-grid">
        {filteredPaths.map((path) => {
          const rec = pathProgress[path.id];
          const doneCount = rec?.completedMilestones.length ?? 0;
          const pct = Math.round((doneCount / Math.max(1, path.milestones.length)) * 100);

          return (
            <article key={path.id} className="mastery-card">
              <div className="mastery-card-header">
                <span className={`tier-badge tier-badge--${path.tier}`}>
                  Tier {path.tier} · {path.tierLabel}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-ink-muted)' }}>
                  {path.provider}
                </span>
              </div>

              <div>
                <h3 className="mastery-card-title">{path.title}</h3>
                <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                  {path.tagline}
                </p>
              </div>

              <div className="mastery-card-meta">
                <span>⏱ {path.estimatedHours}h</span>
                <span>📝 {path.questionCount} Qs</span>
                <span>🎯 Pass {path.passingScore}</span>
                {path.myDocumentsRefs.length > 0 && <span>📂 Local Docs</span>}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', fontWeight: 600 }}>
                  <span>Roadmap Progress</span>
                  <span>
                    {doneCount}/{path.milestones.length} ({pct}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: 'var(--space-2)', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => {
                    const dbSlug = toDbCertSlug(path.id);
                    useAuthStore.getState().setActiveCertification(dbSlug);
                    navigate(`/learn/${dbSlug}?tab=textbook`);
                  }}
                >
                  📖 Full Textbook
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    const dbSlug = toDbCertSlug(path.id);
                    useAuthStore.getState().setActiveCertification(dbSlug);
                    navigate(`/learn/${dbSlug}?tab=guided`);
                  }}
                  title="Open Interactive Guided Course & Labs"
                >
                  {(certCourseProgress[path.id]?.completedLessonIds.length ?? 0) > 0
                    ? `🎓 ${certCourseProgress[path.id].completedLessonIds.length} done`
                    : '🎓 Guided'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActivePath(path)}
                  title="Open Path-to-Success Roadmap"
                >
                  🗺️
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => openCoachForPath(path)}
                  title="Ask Local AI Proctor"
                >
                  🤖
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <LocalCoachDrawer
        isOpen={coachOpen}
        onClose={() => setCoachOpen(false)}
        initialMode="exam_proctor"
        initialPrompt={coachPrompt}
        contextDomain={activePath?.certCode}
      />
    </div>
  );
}
