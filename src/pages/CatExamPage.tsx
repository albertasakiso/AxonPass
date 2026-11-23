/* ===================================================================
   ANOXPASS — Real-Time 2PL IRT Computerized Adaptive Testing (CAT)
   Dynamic theta estimation, Fisher information item selection, and
   ISC2-style variable-length 95% confidence stopping rules.
   =================================================================== */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import {
  selectNextCatQuestion,
  updateCatAbility,
  difficultyToB,
  type CatResponseItem,
} from '../lib/scoring/catEngine';
import { toDbCertSlug } from '../lib/textbookService';
import type { Certification, Question } from '../types';

export default function CatExamPage() {
  const navigate = useNavigate();
  const { activeCertificationSlug, setActiveCertification } = useAuthStore();

  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [selectedSlug, setSelectedSlug] = useState(activeCertificationSlug || 'cissp');
  const [pool, setPool] = useState<Question[]>([]);
  const [loadingPool, setLoadingPool] = useState(true);

  const [catLengthPreset, setCatLengthPreset] = useState<'quick' | 'variable'>('quick');
  const [phase, setPhase] = useState<'setup' | 'running' | 'complete'>('setup');

  const [responses, setResponses] = useState<CatResponseItem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOpt, setSelectedOpt] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [stopReason, setStopReason] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('certifications')
      .select('*')
      .order('created_at')
      .then(({ data }) => {
        if (data) setCertifications(data);
      });
  }, []);

  const currentCert = useMemo(
    () => certifications.find((c) => c.slug === selectedSlug) || null,
    [certifications, selectedSlug]
  );

  useEffect(() => {
    if (!currentCert) return;
    setLoadingPool(true);
    supabase
      .from('questions')
      .select('*')
      .eq('certification_id', currentCert.id)
      .eq('is_active', true)
      .limit(350)
      .then(({ data }) => {
        setPool(data || []);
        setLoadingPool(false);
      });
  }, [currentCert]);

  const minItems = catLengthPreset === 'quick' ? 15 : 100;
  const maxItems = catLengthPreset === 'quick' ? 30 : 150;

  const currentEstimate = useMemo(() => {
    return updateCatAbility(
      responses.map((r) => ({ b: r.difficultyB, correct: r.correct })),
      currentCert?.code || selectedSlug.toUpperCase(),
      minItems,
      maxItems
    );
  }, [responses, currentCert, selectedSlug, minItems, maxItems]);

  const startCatExam = () => {
    const first = selectNextCatQuestion(pool, new Set(), 0.0, {});
    if (!first) return;
    setResponses([]);
    setCurrentQuestion(first);
    setSelectedOpt(null);
    setStopReason(null);
    setPhase('running');
  };

  const handleSubmitCatAnswer = () => {
    if (!currentQuestion || !selectedOpt) return;
    const isCorrect = selectedOpt === currentQuestion.correct_answer;
    const b = difficultyToB(currentQuestion.difficulty);
    const nextInput = [...responses.map((r) => ({ b: r.difficultyB, correct: r.correct })), { b, correct: isCorrect }];
    const est = updateCatAbility(
      nextInput,
      currentCert?.code || selectedSlug.toUpperCase(),
      minItems,
      maxItems
    );

    const newResponses: CatResponseItem[] = [
      ...responses,
      {
        question: currentQuestion,
        correct: isCorrect,
        difficultyB: b,
        thetaAfter: est.theta,
        seAfter: est.standardError,
      },
    ];
    setResponses(newResponses);
    setSelectedOpt(null);

    if (est.shouldStop || newResponses.length >= pool.length) {
      setStopReason(est.stopReason || 'max_items');
      setPhase('complete');
      return;
    }

    const answeredIds = new Set(newResponses.map((r) => r.question.id));
    const domCounts: Record<string, number> = {};
    for (const r of newResponses) {
      domCounts[r.question.domain_id] = (domCounts[r.question.domain_id] || 0) + 1;
    }
    const nextQ = selectNextCatQuestion(pool, answeredIds, est.theta, domCounts);
    if (!nextQ) {
      setStopReason('max_items');
      setPhase('complete');
    } else {
      setCurrentQuestion(nextQ);
    }
  };

  const trajectoryData = responses.map((r, idx) => ({
    item: `Q${idx + 1}`,
    theta: r.thetaAfter,
    difficulty: r.difficultyB,
  }));

  const missedResponses = responses.filter((r) => !r.correct);

  return (
    <div style={{ paddingBottom: 'var(--space-12)' }}>
      <div className="learn-header-banner mb-5">
        <div>
          <div className="learn-header-badge">🎯 2-Parameter Logistic IRT Computerized Adaptive Testing</div>
          <h1 className="learn-header-title">
            {currentCert?.code || selectedSlug.toUpperCase()} Adaptive CAT Exam Simulator
          </h1>
          <p className="learn-header-desc">
            Selects every next question in real time using Fisher Information matched to your live latent ability θ and terminates automatically when your 95% confidence interval clears the pass threshold.
          </p>
        </div>
        <div className="learn-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/practice')}>
            ← Back to Practice
          </button>
        </div>
      </div>

      {phase === 'setup' && (
        <div className="card" style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-4)', maxWidth: '760px', margin: '0 auto' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Certification Exam Pool
            </label>
            <select
              className="input"
              style={{ width: '100%' }}
              value={selectedSlug}
              onChange={(e) => {
                setSelectedSlug(e.target.value);
                setActiveCertification(e.target.value);
              }}
            >
              {certifications.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <button
              type="button"
              className={`btn ${catLengthPreset === 'quick' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '14px', height: 'auto', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}
              onClick={() => setCatLengthPreset('quick')}
            >
              <strong>⚡ Quick Adaptive CAT (15–30 Qs)</strong>
              <span style={{ fontSize: '11px', opacity: 0.85 }}>Rapid θ calibration with 95% CI stopping rule</span>
            </button>
            <button
              type="button"
              className={`btn ${catLengthPreset === 'variable' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '14px', height: 'auto', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}
              onClick={() => setCatLengthPreset('variable')}
            >
              <strong>🏛️ ISC2-Style Full CAT (100–150 Qs)</strong>
              <span style={{ fontSize: '11px', opacity: 0.85 }}>Official variable-length endurance simulation</span>
            </button>
          </div>

          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
            Loaded item pool: <strong>{loadingPool ? 'Loading...' : `${pool.length} calibrated items`}</strong> across all official domains.
          </div>

          <button
            type="button"
            className="btn btn-primary"
            disabled={loadingPool || pool.length < 10}
            onClick={startCatExam}
          >
            🚀 Begin Adaptive CAT Session
          </button>
        </div>
      )}

      {phase === 'running' && currentQuestion && (
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          {/* Live Psychometric Telemetry Bar */}
          <div className="card" style={{ padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <div>
              <strong>Item {responses.length + 1}</strong> (min {minItems} / max {maxItems}) · Difficulty:{' '}
              <span className="badge badge-primary" style={{ textTransform: 'uppercase' }}>{currentQuestion.difficulty}</span>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}>
              <span>Live θ: <strong>{currentEstimate.theta.toFixed(2)}</strong></span>
              <span>95% CI: [{currentEstimate.ciLowTheta.toFixed(2)}, {currentEstimate.ciHighTheta.toFixed(2)}]</span>
              <span>Scaled: <strong>{currentEstimate.scaledScore}</strong></span>
              <span>Pass Prob: <strong>{Math.round(currentEstimate.passingProbability * 100)}%</strong></span>
            </div>
          </div>

          <div className="card" style={{ padding: 'var(--space-6)' }}>
            {currentQuestion.scenario_text && (
              <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--color-bg-subtle)', marginBottom: '12px', fontSize: 'var(--text-xs)' }}>
                {currentQuestion.scenario_text}
              </div>
            )}
            <h2 style={{ fontSize: 'var(--text-lg)', marginTop: 0, lineHeight: 1.5 }}>{currentQuestion.stem}</h2>
            <div style={{ display: 'grid', gap: '10px', marginTop: 'var(--space-4)' }}>
              {(['A', 'B', 'C', 'D'] as const).map((key) => {
                const txt = currentQuestion[`option_${key.toLowerCase() as 'a' | 'b' | 'c' | 'd'}`];
                const isSel = selectedOpt === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedOpt(key)}
                    className={`concept-option-btn ${isSel ? 'active' : ''}`}
                    style={{
                      textAlign: 'left',
                      borderColor: isSel ? 'var(--color-primary)' : undefined,
                      backgroundColor: isSel ? 'var(--color-primary-surface)' : undefined,
                    }}
                  >
                    <strong>{key}.</strong> {txt}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-5)' }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPhase('complete')}>
                End Session Early
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!selectedOpt}
                onClick={handleSubmitCatAnswer}
              >
                Submit &amp; Adapt Next Item →
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === 'complete' && (
        <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
          <div className="card" style={{ padding: 'var(--space-6)', borderLeft: `5px solid ${currentEstimate.passingProbability >= 0.7 ? 'var(--color-success)' : 'var(--color-warning)'}` }}>
            <h2 style={{ margin: '0 0 8px 0' }}>
              CAT Exam Complete — {responses.length} Items ·{' '}
              {stopReason === 'confidence_pass'
                ? '95% Confidence PASS'
                : stopReason === 'confidence_fail'
                ? '95% Confidence Needs Remediation'
                : 'Maximum Length Reached'}
            </h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: 'var(--text-sm)' }}>
              <span>Final θ: <strong>{currentEstimate.theta.toFixed(2)}</strong></span>
              <span>Predicted Score: <strong>{currentEstimate.scaledScore}</strong></span>
              <span>Pass Probability: <strong>{Math.round(currentEstimate.passingProbability * 100)}%</strong></span>
              <span>Raw Accuracy: <strong>{responses.length > 0 ? Math.round((responses.filter((r) => r.correct).length / responses.length) * 100) : 0}%</strong></span>
            </div>
            <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setPhase('setup')}>
                ↻ Run Another CAT
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate(`/learn/${toDbCertSlug(selectedSlug)}?tab=textbook`)}>
                📖 Study Full Textbook
              </button>
            </div>
          </div>

          {trajectoryData.length > 1 && (
            <div className="card" style={{ padding: 'var(--space-5)' }}>
              <h3 style={{ marginTop: 0 }}>Real-Time Ability (θ) Trajectory vs Passing Standard (θ = 0.0)</h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={trajectoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="item" />
                    <YAxis domain={[-3, 3]} />
                    <Tooltip />
                    <ReferenceLine y={0} stroke="#10b981" strokeDasharray="4 4" label="Pass Cut" />
                    <Line type="monotone" dataKey="theta" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} name="Ability θ" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {missedResponses.length > 0 && (
            <div className="card" style={{ padding: 'var(--space-5)', display: 'grid', gap: '10px' }}>
              <h3 style={{ margin: 0 }}>Missed Items &amp; Textbook Remediation ({missedResponses.length})</h3>
              {missedResponses.map((r, i) => (
                <div key={r.question.id} style={{ padding: '12px', borderRadius: '8px', background: 'var(--color-error-bg)', border: '1px solid var(--color-error-border)' }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                    {i + 1}. {r.question.stem}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', marginTop: '6px' }}>
                    <strong>Correct [{r.question.correct_answer}]:</strong> {r.question.rationale}
                  </div>
                  <button
                    type="button"
                    className="btn btn-xs btn-secondary"
                    style={{ marginTop: '8px' }}
                    onClick={() => {
                      const q = (r.question.source_reference || r.question.tags?.[0] || r.question.stem.split(/\s+/).slice(0, 5).join(' ')).trim();
                      navigate(`/learn/${toDbCertSlug(selectedSlug)}?tab=textbook&q=${encodeURIComponent(q)}`);
                    }}
                  >
                    📖 Review in Full Textbook
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
