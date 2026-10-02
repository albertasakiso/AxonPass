/* ===================================================================
   APILIGU LEARNING PASS — ResultsPage Component
   Post-quiz results summary with score, scaled score (200-800),
   domain breakdown, weak area diagnostics, instant 10-Q repair,
   and question-by-question review with full rationales.
   =================================================================== */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../stores/quizStore';
import { formatDuration } from '../lib/timer';
import { supabase } from '../lib/supabase';
import AiExplainerDrawer from '../components/quiz/AiExplainerDrawer';
import type { Question } from '../types';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { result, questions, answers, flaggedQuestionIds, resetQuiz, startQuiz } = useQuizStore();
  const [isLaunchingRepair, setIsLaunchingRepair] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'flagged'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [activeExplainerQuestion, setActiveExplainerQuestion] = useState<Question | null>(null);

  if (!result) {
    return (
      <div className="quiz-page text-center" style={{ paddingTop: 'var(--space-12)' }}>
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3>No test results available</h3>
          <p>Complete a practice quiz or mock exam to view your score breakdown.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/practice')}
          >
            Go to Practice
          </button>
        </div>
      </div>
    );
  }

  const {
    scorePercent,
    passed,
    totalCorrect,
    totalIncorrect,
    totalSkipped,
    timeTakenSeconds,
    timeAllocatedSeconds,
    domainBreakdown,
    weakConcepts,
  } = result;

  // ISACA Scaled Score Estimate: Range 200 - 800 (Passing mark is 450, ~65-80%)
  const scaledScore = Math.min(800, Math.max(200, Math.round(200 + (scorePercent / 100) * 600)));
  const scaledPercent = Math.round(((scaledScore - 200) / 600) * 100);

  const handleLaunchTopicRepair = async (topicId: string, domainId?: string) => {
    setIsLaunchingRepair(true);
    try {
      const { data: questionsData } = await supabase
        .from('questions')
        .select('*')
        .eq('topic_id', topicId)
        .eq('is_active', true)
        .limit(10);

      if (questionsData && questionsData.length > 0) {
        const shuffled: Question[] = [...questionsData].sort(() => Math.random() - 0.5);
        await startQuiz(
          shuffled,
          'practice',
          600, // 10 mins
          shuffled[0].certification_id,
          domainId || null,
          'immediate'
        );
        navigate('/quiz');
      } else {
        navigate('/practice');
      }
    } catch {
      navigate('/practice');
    } finally {
      setIsLaunchingRepair(false);
    }
  };

  // Filter questions for review
  const filteredReviewQuestions = questions.filter((q) => {
    const ans = answers[q.id];
    const isCorrect = ans && ans.is_correct;
    const isFlagged = flaggedQuestionIds.has(q.id);

    if (reviewFilter === 'incorrect') return !isCorrect;
    if (reviewFilter === 'flagged') return isFlagged;
    return true;
  });

  return (
    <div className="quiz-page" style={{ paddingBottom: 'var(--space-16)' }}>
      {/* Hero Score Card */}
      <div className="card mb-6 results-hero" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <div className="card-body" style={{ textAlign: 'center', padding: 'var(--space-6) var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
            <span
              className={`badge ${passed ? 'badge-success' : 'badge-error'}`}
              style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-2) var(--space-4)', fontWeight: 'bold' }}
            >
              {passed ? '✓ PASSED (≥80% Mastery Met)' : '✗ BELOW 80% THRESHOLD'}
            </span>

            <span
              className="badge badge-primary"
              style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-2) var(--space-4)', fontWeight: 'bold' }}
            >
              Scaled Score: {scaledScore} / 800
            </span>
          </div>

          <div
            className={`results-score ${passed ? 'pass' : 'fail'}`}
            style={{
              fontSize: '3.5rem',
              fontWeight: 'bold',
              fontFamily: 'var(--font-display)',
              lineHeight: 1,
              marginBottom: 'var(--space-2)',
              color: passed ? 'var(--color-success)' : 'var(--color-error)',
            }}
          >
            {scorePercent}%
          </div>

          {/* Scaled Score Gauge Meter */}
          <div style={{ maxWidth: '380px', margin: '0 auto var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-ink-muted)', marginBottom: '4px' }}>
              <span>200 (Min)</span>
              <span style={{ fontWeight: 'bold', color: scaledScore >= 450 ? 'var(--color-success)' : 'var(--color-error)' }}>
                450 Pass Line
              </span>
              <span>800 (Max)</span>
            </div>

            <div style={{ position: 'relative', width: '100%', height: '10px', backgroundColor: 'var(--color-bg-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              {/* Pass mark line */}
              <div
                style={{
                  position: 'absolute',
                  left: `${Math.round(((450 - 200) / 600) * 100)}%`,
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  backgroundColor: '#000',
                  zIndex: 2,
                }}
              />
              <div
                style={{
                  height: '100%',
                  width: `${scaledPercent}%`,
                  backgroundColor: passed ? 'var(--color-success)' : 'var(--color-primary-light)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </div>

          <div className="results-status" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)', marginBottom: 'var(--space-4)' }}>
            {passed
              ? 'Excellent performance! You demonstrated strong conceptual mastery on this blueprint domain.'
              : 'Targeted remediation recommended. Review incorrect rationales below or launch the 10-Q repair drill.'}
          </div>

          <div className="flex justify-center gap-6 text-xs text-muted" style={{ flexWrap: 'wrap' }}>
            <span>
              ⏱ Time Taken: <strong>{formatDuration(timeTakenSeconds)}</strong> / {formatDuration(timeAllocatedSeconds)}
            </span>
            <span>
              ⚡ Average Pace: <strong>{Math.round(timeTakenSeconds / Math.max(1, result.totalQuestions))}s</strong> / question
            </span>
          </div>
        </div>
      </div>

      {/* Summary Stat Grid */}
      <div className="results-grid mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
        <div className="card stat-card text-center" style={{ padding: 'var(--space-3)' }}>
          <div className="stat-value text-success">{totalCorrect}</div>
          <div className="stat-label">Correct</div>
        </div>
        <div className="card stat-card text-center" style={{ padding: 'var(--space-3)' }}>
          <div className="stat-value text-error">{totalIncorrect}</div>
          <div className="stat-label">Incorrect</div>
        </div>
        <div className="card stat-card text-center" style={{ padding: 'var(--space-3)' }}>
          <div className="stat-value">{totalSkipped}</div>
          <div className="stat-label">Skipped</div>
        </div>
      </div>

      {/* Weak Concepts & Targeted Repair Actions */}
      {weakConcepts.length > 0 && (
        <div className="card mb-6" style={{ borderLeft: '4px solid var(--color-warning)' }}>
          <div className="card-header flex items-center justify-between">
            <span style={{ fontWeight: 'bold' }}>🎯 Targeted Repair Plan</span>
            <span className="badge badge-warning">{weakConcepts.length} Weak Concepts</span>
          </div>
          <div className="card-body">
            <p className="text-sm text-muted mb-4">
              The Leitner algorithm has scheduled these specific concepts for immediate remediation:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {weakConcepts.map((wc) => (
                <div
                  key={wc.topicId}
                  className="flex items-center justify-between p-3"
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    flexWrap: 'wrap',
                    gap: 'var(--space-2)',
                  }}
                >
                  <div>
                    <div className="font-semibold text-sm">{wc.topicName}</div>
                    <div className="text-xs text-muted">
                      {wc.incorrectCount} missed in this session · Accuracy: {wc.accuracy}%
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isLaunchingRepair}
                    className="btn btn-sm btn-primary"
                    onClick={() => handleLaunchTopicRepair(wc.topicId, wc.domainId)}
                  >
                    ⚡ Start 10-Q Repair Set →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Domain Breakdown */}
      {domainBreakdown.length > 0 && (
        <div className="card mb-6">
          <div className="card-header font-bold">Domain Breakdown</div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {domainBreakdown.map((d) => (
                <div key={d.domainId}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{d.domainName}</span>
                    <span className="text-mono font-bold text-sm">
                      {d.correctCount}/{d.totalQuestions} ({d.accuracy}%)
                    </span>
                  </div>
                  <div className="progress-bar progress-bar-sm">
                    <div
                      className={`progress-bar-fill ${
                        d.accuracy >= 80
                          ? 'success'
                          : d.accuracy >= 60
                          ? 'warning'
                          : 'error'
                      }`}
                      style={{ width: `${d.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Question Review List */}
      <div className="card mb-6">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <span className="font-bold">Detailed Question Review</span>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
            <button
              type="button"
              onClick={() => setReviewFilter('all')}
              className={`btn btn-sm ${reviewFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '11px', padding: '2px 8px', minHeight: '26px' }}
            >
              All ({questions.length})
            </button>
            <button
              type="button"
              onClick={() => setReviewFilter('incorrect')}
              className={`btn btn-sm ${reviewFilter === 'incorrect' ? 'btn-error' : 'btn-ghost'}`}
              style={{ fontSize: '11px', padding: '2px 8px', minHeight: '26px' }}
            >
              Missed ({totalIncorrect})
            </button>
            <button
              type="button"
              onClick={() => setReviewFilter('flagged')}
              className={`btn btn-sm ${reviewFilter === 'flagged' ? 'btn-warning' : 'btn-ghost'}`}
              style={{ fontSize: '11px', padding: '2px 8px', minHeight: '26px' }}
            >
              Flagged ({flaggedQuestionIds.size})
            </button>
          </div>
        </div>

        <div className="card-body" style={{ padding: 'var(--space-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {filteredReviewQuestions.map((q, idx) => {
              const ans = answers[q.id];
              const isCorrect = ans?.is_correct;
              const isFlagged = flaggedQuestionIds.has(q.id);
              const isExpanded = expandedQuestionId === q.id;

              return (
                <div
                  key={q.id}
                  style={{
                    border: `1px solid ${isCorrect ? 'var(--color-success-border)' : 'var(--color-error-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    backgroundColor: isCorrect ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                  }}
                >
                  <div
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    style={{
                      padding: 'var(--space-3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      gap: 'var(--space-2)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: '1.1rem' }}>{isCorrect ? '✓' : '✗'}</span>
                      <span style={{ fontWeight: 'bold', fontSize: 'var(--text-xs)', color: 'var(--color-ink)' }}>
                        Q{idx + 1}.
                      </span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {q.stem}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
                      {isFlagged && <span style={{ fontSize: '12px' }}>🚩</span>}
                      <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg)', borderTop: '1px solid var(--border-color)' }}>
                      <p style={{ fontWeight: '600', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
                        {q.stem}
                      </p>

                      {/* Options breakdown */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                        {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                          const optText = q[`option_${optKey.toLowerCase() as 'a' | 'b' | 'c' | 'd'}`];
                          const isSelected = ans?.selected_answer === optKey;
                          const isCorrectOpt = q.correct_answer === optKey;

                          let bg = 'var(--color-bg-subtle)';
                          let border = 'var(--border-color)';
                          let labelColor = 'var(--color-ink)';

                          if (isCorrectOpt) {
                            bg = 'var(--color-success-bg)';
                            border = 'var(--color-success-border)';
                            labelColor = 'var(--color-success)';
                          } else if (isSelected && !isCorrectOpt) {
                            bg = 'var(--color-error-bg)';
                            border = 'var(--color-error-border)';
                            labelColor = 'var(--color-error)';
                          }

                          return (
                            <div
                              key={optKey}
                              style={{
                                padding: 'var(--space-2) var(--space-3)',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: bg,
                                border: `1px solid ${border}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                fontSize: 'var(--text-xs)',
                              }}
                            >
                              <strong style={{ color: labelColor }}>[{optKey}]</strong>
                              <span style={{ flex: 1 }}>{optText}</span>
                              {isCorrectOpt && <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓ Correct Key</span>}
                              {isSelected && !isCorrectOpt && <span style={{ color: 'var(--color-error)', fontWeight: 'bold' }}>✗ Your Choice</span>}
                            </div>
                          );
                        })}
                      </div>

                      {/* Rationale explanation */}
                      <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '4px' }}>
                          💡 ISACA Rationale:
                        </div>
                        <p style={{ margin: 0, lineHeight: 1.5 }}>{q.rationale}</p>
                      </div>

                      {/* AI Cognitive Dissection Button */}
                      <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)' }}>
                        <button
                          type="button"
                          onClick={() => setActiveExplainerQuestion(q)}
                          className="btn btn-sm btn-primary"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            borderRadius: 'var(--radius-md)',
                          }}
                        >
                          <span>🧠</span> AI Cognitive Dissection &amp; Option Matrix →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex gap-4 flex-wrap justify-between" style={{ marginTop: 'var(--space-6)' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            resetQuiz();
            navigate('/');
          }}
        >
          ← Back to Dashboard
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            resetQuiz();
            navigate('/practice');
          }}
        >
          Take Another Practice Quiz →
        </button>
      </div>

      {/* AI Cognitive Dissection Drawer */}
      {activeExplainerQuestion && (
        <AiExplainerDrawer
          question={activeExplainerQuestion}
          selectedOption={answers[activeExplainerQuestion.id]?.selected_answer as 'A' | 'B' | 'C' | 'D' | null}
          onClose={() => setActiveExplainerQuestion(null)}
        />
      )}
    </div>
  );
}

