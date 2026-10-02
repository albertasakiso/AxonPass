/* ===================================================================
   APILIGU LEARNING PASS — ReviewGrid Component
   Interactive grid showing answered, flagged, and skipped questions.
   Allows jumping directly to any question during review.
   =================================================================== */

import type { Question, SessionAnswer } from '../../types';

interface ReviewGridProps {
  questions: Question[];
  answers: Record<string, SessionAnswer>;
  currentIndex: number;
  flaggedIds: Set<string>;
  onSelectIndex: (index: number) => void;
  onClose?: () => void;
}

export default function ReviewGrid({
  questions,
  answers,
  currentIndex,
  flaggedIds,
  onSelectIndex,
  onClose,
}: ReviewGridProps) {
  let answeredCount = 0;
  let flaggedCount = 0;
  let skippedCount = 0;

  questions.forEach((q) => {
    const ans = answers[q.id];
    if (ans && ans.status === 'answered') {
      answeredCount += 1;
    } else {
      skippedCount += 1;
    }
    if (flaggedIds.has(q.id)) {
      flaggedCount += 1;
    }
  });

  return (
    <div className="card" style={{ maxWidth: '640px', width: '100%', margin: '0 auto' }}>
      <div className="card-header flex items-center justify-between">
        <span>Question Navigator</span>
        {onClose && (
          <button type="button" className="btn btn-sm btn-ghost" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <div className="card-body">
        {/* Legend */}
        <div className="flex items-center gap-4 flex-wrap mb-4 text-xs">
          <div className="flex items-center gap-1">
            <span
              style={{
                width: 14,
                height: 14,
                backgroundColor: 'var(--color-primary)',
                borderRadius: '3px',
                display: 'inline-block',
              }}
            />
            <span>Answered ({answeredCount})</span>
          </div>

          <div className="flex items-center gap-1">
            <span
              style={{
                width: 14,
                height: 14,
                backgroundColor: 'var(--color-warning-bg)',
                border: '1px solid var(--color-warning)',
                borderRadius: '3px',
                display: 'inline-block',
              }}
            />
            <span>Flagged ({flaggedCount})</span>
          </div>

          <div className="flex items-center gap-1">
            <span
              style={{
                width: 14,
                height: 14,
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: '3px',
                display: 'inline-block',
              }}
            />
            <span>Unanswered ({skippedCount})</span>
          </div>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
            gap: 'var(--space-2)',
            maxHeight: '320px',
            overflowY: 'auto',
            padding: 'var(--space-1)',
          }}
        >
          {questions.map((q, idx) => {
            const ans = answers[q.id];
            const isAnswered = ans && ans.status === 'answered';
            const isFlagged = flaggedIds.has(q.id);
            const isCurrent = idx === currentIndex;

            let bgColor = 'var(--color-bg-subtle)';
            let textColor = 'var(--color-ink)';
            let borderColor = 'var(--border-color)';

            if (isAnswered) {
              bgColor = 'var(--color-primary-surface)';
              textColor = 'var(--color-primary)';
              borderColor = 'var(--color-primary)';
            }

            if (isCurrent) {
              borderColor = 'var(--color-ink)';
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  onSelectIndex(idx);
                  if (onClose) onClose();
                }}
                style={{
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: bgColor,
                  color: textColor,
                  border: `2px solid ${borderColor}`,
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: isCurrent ? 'bold' : 'normal',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                aria-label={`Question ${idx + 1}: ${isAnswered ? 'Answered' : 'Unanswered'}${
                  isFlagged ? ', Flagged' : ''
                }`}
              >
                {idx + 1}
                {isFlagged && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 1,
                      right: 1,
                      fontSize: '8px',
                    }}
                  >
                    🚩
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
