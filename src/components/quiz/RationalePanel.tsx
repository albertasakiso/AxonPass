/* ===================================================================
   APILIGU LEARNING PASS — RationalePanel Component
   Displays explanations, correct answer justification,
   distractor breakdown, source confidence badge, and AI Dissector.
   =================================================================== */

import { useState } from 'react';
import type { Question } from '../../types';
import AiExplainerDrawer from './AiExplainerDrawer';

interface RationalePanelProps {
  question: Question;
  selectedOption: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
}

export default function RationalePanel({
  question,
  selectedOption,
  isCorrect,
}: RationalePanelProps) {
  const [showAiExplainer, setShowAiExplainer] = useState(false);

  return (
    <div
      className={`rationale-panel ${isCorrect ? 'correct' : 'incorrect'}`}
      role="region"
      aria-label="Answer Explanation"
    >
      <div className={`rationale-header ${isCorrect ? 'correct' : 'incorrect'}`}>
        <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>
          {isCorrect ? '✓' : '✗'}
        </span>
        <span>
          {isCorrect
            ? `Correct! (Option ${selectedOption})`
            : `Incorrect — You chose Option ${selectedOption}, but Option ${question.correct_answer} is the correct answer`}
        </span>
      </div>

      <div className="rationale-body">
        <p style={{ fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-2)' }}>
          ISACA Rationale:
        </p>
        <p style={{ whiteSpace: 'pre-line' }}>{question.rationale}</p>
      </div>

      {/* AI Cognitive Dissection Action Bar */}
      <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)' }}>
        <button
          type="button"
          onClick={() => setShowAiExplainer(true)}
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

      {/* Task and Reference Meta */}
      <div
        className="flex items-center justify-between flex-wrap gap-2"
        style={{
          marginTop: 'var(--space-4)',
          paddingTop: 'var(--space-3)',
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          fontSize: 'var(--text-xs)',
        }}
      >
        <div className="flex items-center gap-2">
          {question.task_statement && (
            <span className="badge badge-primary">Task {question.task_statement}</span>
          )}
          {question.source_reference && (
            <span className="text-muted">Ref: {question.source_reference}</span>
          )}
        </div>

        <div className="rationale-confidence">
          <span
            className={`badge ${
              question.source_confidence === 'verified'
                ? 'badge-success'
                : 'badge-warning'
            }`}
          >
            {question.source_confidence === 'verified' ? '✓ Verified Key' : '⚠ Unverified Key'}
          </span>
        </div>
      </div>

      {/* AI Explainer Modal Drawer */}
      {showAiExplainer && (
        <AiExplainerDrawer
          question={question}
          selectedOption={selectedOption}
          onClose={() => setShowAiExplainer(false)}
        />
      )}
    </div>
  );
}
