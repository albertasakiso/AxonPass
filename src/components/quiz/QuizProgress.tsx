/* ===================================================================
   APILIGU LEARNING PASS — QuizProgress Component
   Header bar during quiz with question count, progress bar,
   and flag button.
   =================================================================== */

interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
  isFlagged: boolean;
  onToggleFlag: () => void;
  onOpenReviewGrid?: () => void;
}

export default function QuizProgress({
  currentIndex,
  totalQuestions,
  isFlagged,
  onToggleFlag,
  onOpenReviewGrid,
}: QuizProgressProps) {
  const percent = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="quiz-question-number">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          {onOpenReviewGrid && (
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={onOpenReviewGrid}
              style={{ padding: 'var(--space-1) var(--space-2)', fontSize: 'var(--text-xs)' }}
              aria-label="View Question Grid"
            >
              Grid ⊞
            </button>
          )}
        </div>

        <button
          type="button"
          className={`quiz-flag-btn btn btn-ghost btn-sm ${isFlagged ? 'flagged' : ''}`}
          onClick={onToggleFlag}
          aria-label={isFlagged ? 'Unflag this question' : 'Flag this question for review'}
        >
          <span aria-hidden="true">{isFlagged ? '🚩' : '🏳️'}</span>
          <span>{isFlagged ? 'Flagged' : 'Flag'}</span>
        </button>
      </div>

      <div className="progress-bar progress-bar-sm">
        <div
          className="progress-bar-fill"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={totalQuestions}
        />
      </div>
    </div>
  );
}
