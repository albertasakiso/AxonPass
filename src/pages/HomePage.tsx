import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore';
import { useLessonProgressStore } from '../stores/lessonProgressStore';
import { useQuizStore } from '../stores/quizStore';
import { supabase } from '../lib/supabase';
import type { Certification, Domain, Question } from '../types';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, activeCertificationSlug } = useAuthStore();
  const { startQuiz } = useQuizStore();
  const [currentCert, setCurrentCert] = useState<Certification | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLaunching, setIsLaunching] = useState(false);

  const {
    streakDays,
    totalStudyMinutes,
    reviewDueCount,
    overallAccuracy,
    predictedScaledScore,
    irtEstimate,
    recentSessions,
    domainSummaries,
    refreshProgress,
  } = useProgressStore();

  const { completedSubtopicIds } = useLessonProgressStore();

  useEffect(() => {
    refreshProgress(activeCertificationSlug);
  }, [activeCertificationSlug, refreshProgress]);

  useEffect(() => {
    async function loadActiveCertAndDomains() {
      const { data: certData } = await supabase
        .from('certifications')
        .select('*')
        .eq('slug', activeCertificationSlug)
        .maybeSingle();

      if (certData) {
        setCurrentCert(certData);
        const { data: domData } = await supabase
          .from('domains')
          .select('*')
          .eq('certification_id', certData.id)
          .order('domain_number');
        if (domData) setDomains(domData);
      }
    }
    loadActiveCertAndDomains();
  }, [activeCertificationSlug]);

  const userName = user?.full_name || user?.email?.split('@')[0] || 'Learner';
  const dailyGoal = user?.daily_study_goal_minutes || 60;
  const certName = currentCert?.name || 'CISA (28th Edition Blueprint)';
  const dailyPercent = Math.min(100, Math.round((totalStudyMinutes / Math.max(1, dailyGoal)) * 100));

  // Launch a 10Q domain drill
  const handleLaunchDomainDrill = async (domainId: string) => {
    if (isLaunching) return;
    setIsLaunching(true);
    try {
      const certId = currentCert?.id || 'a0000000-0000-0000-0000-000000000001';
      const { data: qData } = await supabase
        .from('questions')
        .select('*')
        .eq('certification_id', certId)
        .eq('domain_id', domainId)
        .eq('is_active', true)
        .limit(10);

      if (qData && qData.length > 0) {
        const shuffled: Question[] = [...qData].sort(() => Math.random() - 0.5);
        await startQuiz(shuffled, 'practice', 600, certId, domainId, 'immediate');
        navigate('/quiz');
      } else {
        navigate('/practice');
      }
    } catch {
      navigate('/practice');
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div style={{ paddingBottom: 'var(--space-12)' }}>
      {/* 1. Header Greeting & Active Track Pill */}
      <div className="dashboard-greeting mb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
            <span className="badge badge-primary" style={{ fontSize: '11px', fontWeight: 'bold' }}>
              🎯 {currentCert?.code || 'CISA 28th'}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', fontWeight: 'bold' }}>
              {certName}
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 'bold', letterSpacing: '-0.02em' }}>
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-muted" style={{ margin: 'var(--space-1) 0 0 0', fontSize: 'var(--text-sm)' }}>
            Master core IS audit concepts with active recall and August 2024 blueprint weights.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ borderRadius: 'var(--radius-full)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          onClick={() => navigate('/practice')}
        >
          ⚡ Quick 10Q Drill
        </button>
      </div>

      {/* 2. Spaced Repetition Due Alert Banner */}
      {reviewDueCount > 0 && (
        <div
          className="card mb-6"
          style={{
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            borderColor: '#FCD34D',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ fontSize: '2rem', lineHeight: 1 }}>🧠</div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#92400E', fontSize: 'var(--text-sm)' }}>
                {reviewDueCount} Spaced-Repetition Reviews Due
              </div>
              <div style={{ color: '#B45309', fontSize: 'var(--text-xs)' }}>
                Reinforce weak concepts in Leitner Boxes 0–2 before memory retention decays.
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm"
            style={{
              backgroundColor: '#D97706',
              color: '#FFFFFF',
              borderColor: '#D97706',
              fontWeight: 'bold',
              borderRadius: 'var(--radius-md)',
            }}
            onClick={() => navigate('/practice')}
          >
            Clear Review Queue →
          </button>
        </div>
      )}

      {/* 3. Hero Journey Card (Resume Learning) */}
      <div
        className="dashboard-next-action"
        style={{
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
          background: 'var(--color-primary-gradient)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9, fontWeight: 'bold' }}>
            Structured Learning Journey
          </span>
          <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '11px' }}>
            {completedSubtopicIds.size} / 60 Lessons Completed
          </span>
        </div>

        <h3 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 'bold', color: '#FFFFFF' }}>
          🎯 Official CISA 28th Edition Syllabus
        </h3>
        <p style={{ opacity: 0.9, fontSize: 'var(--text-sm)', margin: 'var(--space-2) 0 var(--space-4) 0', lineHeight: 1.5, color: '#FFFFFF' }}>
          Follow the 5 domains, deep-dive submodules, and version 28 delta topics (AI in Audit, Zero Trust, DevSecOps).
        </p>

        {/* Progress bar inside hero */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: 0.85, marginBottom: '4px', color: '#FFFFFF' }}>
            <span>Curriculum Progress</span>
            <span>{Math.round((completedSubtopicIds.size / 60) * 100)}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.round((completedSubtopicIds.size / 60) * 100)}%`,
                height: '100%',
                backgroundColor: '#10B981',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn"
            style={{
              backgroundColor: '#FFFFFF',
              color: 'var(--color-primary)',
              fontWeight: 'bold',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)',
            }}
            onClick={() => navigate('/learn')}
          >
            Open Syllabus & Lessons →
          </button>
          <button
            type="button"
            className="btn"
            style={{
              backgroundColor: 'rgba(255,255,255,0.18)',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 'bold',
            }}
            onClick={() => navigate('/practice')}
          >
            150Q Mock Exam
          </button>
        </div>
      </div>

      {/* 4. Core Performance Stats Grid */}
      <div className="dashboard-stats" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card stat-card">
          <div className="stat-value">{streakDays} 🔥</div>
          <div className="stat-label">Study Streak</div>
        </div>

        <div className="card stat-card">
          <div className="stat-value" style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span>{totalStudyMinutes}m</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>/ {dailyGoal}m</span>
          </div>
          <div className="stat-label">Daily Goal ({dailyPercent}%)</div>
        </div>

        <div className="card stat-card">
          <div className="stat-value text-primary">{overallAccuracy}%</div>
          <div className="stat-label">Overall Accuracy</div>
        </div>

        <div className="card stat-card">
          <div className="stat-value" style={{ color: predictedScaledScore && predictedScaledScore >= 450 ? 'var(--color-success)' : 'var(--color-ink)' }}>
            {predictedScaledScore ? `${predictedScaledScore}` : '450+'}
          </div>
          <div className="stat-label">
            {irtEstimate ? `AI IRT Score (${Math.round(irtEstimate.passingProbability * 100)}% Pass Prob)` : 'Scaled Score (200-800)'}
          </div>
        </div>
      </div>

      {/* 5. Domain Readiness Blueprint Matrix */}
      <div className="dashboard-section" style={{ marginTop: 'var(--space-8)' }}>
        <div className="dashboard-section-header">
          <div>
            <h3 style={{ margin: 0 }}>Blueprint Domain Mastery</h3>
            <p className="text-muted" style={{ fontSize: 'var(--text-xs)', margin: '2px 0 0 0' }}>
              August 2024 ISACA weight distribution &amp; readiness
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/insights')}
            style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}
          >
            Full Radar →
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {domains.map((dom) => {
            const summary = domainSummaries.find(d => d.domainNumber === dom.domain_number);
            const accuracy = summary?.accuracy || 0;
            const attempted = summary?.attempted || 0;
            const isReady = summary?.isExamReady || accuracy >= 80;

            return (
              <div
                key={dom.id}
                className="card card-body"
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-3)',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1, minWidth: '220px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-primary-surface)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 'bold',
                      fontSize: 'var(--text-sm)',
                      flexShrink: 0,
                    }}
                  >
                    D{dom.domain_number}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {dom.name}
                      </h4>
                      <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                        {dom.exam_weight_percent}%
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: '4px' }}>
                      <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--color-bg-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${accuracy}%`,
                            height: '100%',
                            backgroundColor: isReady ? 'var(--color-success)' : accuracy > 50 ? 'var(--color-primary-light)' : 'var(--color-warning)',
                            borderRadius: 'var(--radius-full)',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)' }}>
                        {attempted > 0 ? `${accuracy}%` : 'Not Tested'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLaunchDomainDrill(dom.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '4px 10px', height: '32px', minHeight: '32px' }}
                >
                  Drill D{dom.domain_number} →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Quick Launchpad Hub */}
      <div className="dashboard-section" style={{ marginTop: 'var(--space-8)' }}>
        <div className="dashboard-section-header">
          <div>
            <h3 style={{ margin: 0 }}>Study Launchpad</h3>
            <p className="text-muted" style={{ fontSize: 'var(--text-xs)', margin: '2px 0 0 0' }}>
              Jump straight into any learning or testing module
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)' }}>
          <button
            type="button"
            className="card card-interactive card-body"
            style={{ textAlign: 'center', padding: 'var(--space-4) var(--space-3)' }}
            onClick={() => navigate('/practice')}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: 'var(--space-2)' }}>⚡</div>
            <div className="font-semibold text-sm">Quick 10Q Drill</div>
            <div className="text-xs text-muted">Immediate Rationale</div>
          </button>

          <button
            type="button"
            className="card card-interactive card-body"
            style={{ textAlign: 'center', padding: 'var(--space-4) var(--space-3)' }}
            onClick={() => navigate('/learn')}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: 'var(--space-2)' }}>📚</div>
            <div className="font-semibold text-sm">Review Manual</div>
            <div className="text-xs text-muted">60 Syllabus Topics</div>
          </button>

          <button
            type="button"
            className="card card-interactive card-body"
            style={{ textAlign: 'center', padding: 'var(--space-4) var(--space-3)' }}
            onClick={() => navigate('/learn')}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: 'var(--space-2)' }}>🧮</div>
            <div className="font-semibold text-sm">Calculators</div>
            <div className="text-xs text-muted">BIA / ALE / Sample</div>
          </button>

          <button
            type="button"
            className="card card-interactive card-body"
            style={{ textAlign: 'center', padding: 'var(--space-4) var(--space-3)' }}
            onClick={() => navigate('/insights')}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: 'var(--space-2)' }}>📊</div>
            <div className="font-semibold text-sm">Readiness Radar</div>
            <div className="text-xs text-muted">Scaled 200–800</div>
          </button>
        </div>
      </div>

      {/* 7. Recent Activity Feed */}
      <div className="dashboard-section" style={{ marginTop: 'var(--space-8)' }}>
        <div className="dashboard-section-header">
          <h3>Recent Test Activity</h3>
        </div>
        <div className="card">
          <div className="card-body" style={{ padding: 'var(--space-4)' }}>
            {recentSessions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {recentSessions.slice(0, 4).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3"
                    style={{
                      backgroundColor: 'var(--color-bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div>
                      <div className="font-semibold text-sm capitalize">
                        {s.session_type.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-muted">
                        {s.started_at ? new Date(s.started_at).toLocaleDateString() : ''} · {s.total_questions} questions
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-mono font-bold ${s.passed ? 'text-success' : 'text-primary'}`}>
                        {s.score_percent !== null ? `${s.score_percent}%` : 'In Progress'}
                      </div>
                      <span className={`badge ${s.passed ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '10px' }}>
                        {s.passed ? 'Passed (≥80%)' : 'Completed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 'var(--space-8) var(--space-4)', textAlign: 'center' }}>
                <div className="empty-state-icon" style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>📖</div>
                <h4 style={{ margin: '0 0 var(--space-2) 0' }}>No test sessions yet</h4>
                <p className="text-muted text-sm" style={{ marginBottom: 'var(--space-4)' }}>
                  Start with a quick 10-question drill to establish your readiness baseline.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('/practice')}
                >
                  Start Practice Drill
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

