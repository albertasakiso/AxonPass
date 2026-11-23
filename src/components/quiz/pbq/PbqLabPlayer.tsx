/* ===================================================================
   ANOXPASS — Interactive PBQ Lab Player Component
   Supports Ordering (move up/down), Matching & Triage matrices.
   =================================================================== */

import React, { useState, useEffect } from 'react';
import type { PbqLab } from '../../../data/pbqLabs';

interface PbqLabPlayerProps {
  lab: PbqLab;
  onCompleteLab?: (labId: string, scorePct: number, xpReward: number) => void;
}

export const PbqLabPlayer: React.FC<PbqLabPlayerProps> = ({ lab, onCompleteLab }) => {
  const [orderList, setOrderList] = useState(lab.orderingItems || []);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setOrderList(lab.orderingItems || []);
    setSelections({});
    setSubmitted(false);
  }, [lab]);

  const moveItem = (index: number, delta: -1 | 1) => {
    if (submitted) return;
    const nextIdx = index + delta;
    if (nextIdx < 0 || nextIdx >= orderList.length) return;
    const copy = [...orderList];
    const [item] = copy.splice(index, 1);
    copy.splice(nextIdx, 0, item);
    setOrderList(copy);
  };

  let correctCount = 0;
  let totalChecks = 0;

  if (lab.mechanic === 'ordering' && lab.correctOrderIds) {
    totalChecks = lab.correctOrderIds.length;
    correctCount = orderList.filter((it, idx) => it.id === lab.correctOrderIds![idx]).length;
  } else if (lab.rows) {
    totalChecks = lab.rows.length;
    correctCount = lab.rows.filter((r) => selections[r.id] === r.correctOption).length;
  }

  const scorePct = totalChecks > 0 ? Math.round((correctCount / totalChecks) * 100) : 0;

  const handleGrade = () => {
    setSubmitted(true);
    onCompleteLab?.(lab.id, scorePct, lab.xpReward);
  };

  const handleReset = () => {
    setOrderList(lab.orderingItems || []);
    setSelections({});
    setSubmitted(false);
  };

  return (
    <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: 'var(--space-4)' }}>
        <div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <span className="badge badge-primary">{lab.certCode}</span>
            <span className="badge badge-neutral" style={{ textTransform: 'uppercase' }}>{lab.mechanic} PBQ</span>
            <span className="badge badge-success">+{lab.xpReward} XP</span>
          </div>
          <h2 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>{lab.title}</h2>
        </div>
        <button type="button" className="btn btn-xs btn-ghost" onClick={handleReset}>
          ↻ Reset Lab
        </button>
      </div>

      <div
        style={{
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-bg-subtle)',
          borderLeft: '4px solid var(--color-primary)',
          fontSize: 'var(--text-sm)',
          lineHeight: 1.6,
          marginBottom: 'var(--space-5)',
        }}
      >
        <strong>Scenario Brief:</strong> {lab.scenario}
      </div>

      {/* Ordering Mechanic */}
      {lab.mechanic === 'ordering' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: 'var(--space-5)' }}>
          {orderList.map((item, idx) => {
            const expectedId = lab.correctOrderIds?.[idx];
            const isSlotRight = submitted && item.id === expectedId;
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${submitted ? (isSlotRight ? 'var(--color-success)' : 'var(--color-error)') : 'var(--border-color)'}`,
                  backgroundColor: submitted
                    ? isSlotRight
                      ? 'var(--color-success-bg)'
                      : 'var(--color-error-bg)'
                    : 'var(--color-bg)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary)' }}>
                    #{idx + 1}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{item.label}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>{item.detail}</div>
                  </div>
                </div>
                {!submitted && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      className="btn btn-xs btn-secondary"
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, -1)}
                      aria-label={`Move ${item.label} up`}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-secondary"
                      disabled={idx === orderList.length - 1}
                      onClick={() => moveItem(idx, 1)}
                      aria-label={`Move ${item.label} down`}
                    >
                      ↓
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {submitted && lab.orderingRationale && (
            <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-subtle)', fontSize: 'var(--text-xs)', lineHeight: 1.55 }}>
              <strong>💡 Official PBQ Rubric:</strong> {lab.orderingRationale}
            </div>
          )}
        </div>
      )}

      {/* Matching & Triage Mechanics */}
      {lab.mechanic !== 'ordering' && lab.rows && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: 'var(--space-5)' }}>
          {lab.rows.map((row, idx) => {
            const chosen = selections[row.id] || '';
            const isRight = submitted && chosen === row.correctOption;
            return (
              <div
                key={row.id}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${submitted ? (isRight ? 'var(--color-success)' : 'var(--color-error)') : 'var(--border-color)'}`,
                  backgroundColor: submitted
                    ? isRight
                      ? 'var(--color-success-bg)'
                      : 'var(--color-error-bg)'
                    : 'var(--color-bg)',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: '8px' }}>
                  {idx + 1}. {row.prompt}
                </div>
                <select
                  className="input"
                  disabled={submitted}
                  value={chosen}
                  onChange={(e) => setSelections((prev) => ({ ...prev, [row.id]: e.target.value }))}
                  style={{ width: '100%', fontSize: 'var(--text-xs)' }}
                >
                  <option value="">-- Select Best Decision / Component --</option>
                  {row.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {submitted && (
                  <div style={{ marginTop: '8px', fontSize: 'var(--text-xs)', lineHeight: 1.5 }}>
                    <strong>{isRight ? '✓ Correct:' : `✗ Correct Answer: ${row.correctOption}`}</strong> — {row.rationale}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        {submitted ? (
          <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: scorePct >= 80 ? 'var(--color-success)' : 'var(--color-warning)' }}>
            Score: {correctCount}/{totalChecks} ({scorePct}%) {scorePct === 100 ? `· +${lab.xpReward} XP Mastered!` : '· Review rubric above'}
          </div>
        ) : (
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
            Complete all {totalChecks} items then click Grade PBQ.
          </div>
        )}
        <button
          type="button"
          className="btn btn-primary"
          disabled={submitted}
          onClick={handleGrade}
        >
          {submitted ? '✓ Graded' : '✓ Grade PBQ Simulation'}
        </button>
      </div>
    </div>
  );
};

export default PbqLabPlayer;
