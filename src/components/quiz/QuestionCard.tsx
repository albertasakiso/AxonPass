/* ===================================================================
   APILIGU LEARNING PASS — QuestionCard Component
   Single question layout presenting stem, scenario (if present),
   confidence badge, tags, answer options, and immediate feedback.
   =================================================================== */

import { useState, useEffect } from 'react';
import type { Question } from '../../types';
import OptionButton from './OptionButton';
import RationalePanel from './RationalePanel';

interface QuestionCardProps {
  question: Question;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isSubmitted: boolean;
  showFeedback: boolean;
  onSelectOption: (option: 'A' | 'B' | 'C' | 'D') => void;
}

export default function QuestionCard({
  question,
  selectedOption,
  isSubmitted,
  showFeedback,
  onSelectOption,
}: QuestionCardProps) {
  const [strikethroughs, setStrikethroughs] = useState<Set<string>>(new Set());
  const [isScenarioExpanded, setIsScenarioExpanded] = useState(true);

  // Reset strikethroughs when question changes
  useEffect(() => {
    setStrikethroughs(new Set());
    setIsScenarioExpanded(true);
  }, [question.id]);

  const toggleStrikethrough = (label: string) => {
    setStrikethroughs((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const isCorrect = selectedOption === question.correct_answer;

  const options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[] = [
    { label: 'A', text: question.option_a },
    { label: 'B', text: question.option_b },
    { label: 'C', text: question.option_c },
    { label: 'D', text: question.option_d },
  ];

  return (
    <div className="quiz-page" role="article" aria-label="Exam Question">
      
      {/* Question Header Meta & Confidence Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
            Q{question.question_number || 1}
          </span>
          {question.source_reference && (
            <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
              • {question.source_reference.replace(/\.pdf|\.md|\.docx/i, '')}
            </span>
          )}
        </div>

        {/* Verified Confidence Marker (§7.5) */}
        <div>
          <span
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: question.source_confidence === 'verified' ? 'var(--color-success-bg)' : 'var(--color-bg-subtle)',
              color: question.source_confidence === 'verified' ? 'var(--color-success)' : 'var(--color-ink-muted)',
              border: question.source_confidence === 'verified' ? '1px solid var(--color-success-border)' : '1px solid var(--border-color)',
              fontWeight: 'var(--weight-bold)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {question.source_confidence === 'verified' ? '✓ Verified Key' : 'ℹ️ Standard Key'}
          </span>
        </div>
      </div>

      {/* Scenario text if present */}
      {question.scenario_text && (
        <div
          className="card mb-4"
          style={{
            backgroundColor: 'var(--color-bg-subtle)',
            borderLeft: '4px solid var(--color-primary)',
          }}
        >
          <div className="card-body" style={{ padding: 'var(--space-4)' }}>
            <div
              onClick={() => setIsScenarioExpanded(!isScenarioExpanded)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                marginBottom: isScenarioExpanded ? 'var(--space-2)' : 0,
              }}
            >
              <h4 className="text-xs text-muted uppercase font-bold" style={{ letterSpacing: '0.05em', margin: 0 }}>
                📑 Scenario Context
              </h4>
              <span style={{ fontSize: '11px', color: 'var(--color-primary-light)', fontWeight: 'bold' }}>
                {isScenarioExpanded ? 'Collapse ▲' : 'Expand ▼'}
              </span>
            </div>
            {isScenarioExpanded && (
              <p className="text-sm" style={{ lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
                {question.scenario_text}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Question Stem */}
      <h2 className="quiz-stem" style={{ color: 'var(--color-ink)', fontSize: 'var(--text-lg)', lineHeight: 1.5, marginBottom: 'var(--space-5)' }}>
        {question.stem}
      </h2>

      {/* Options List with Strike-Through Elimination */}
      <div className="quiz-options" role="radiogroup" aria-label="Answer options" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {options.map((opt) => (
          <OptionButton
            key={opt.label}
            label={opt.label}
            text={opt.text}
            isSelected={selectedOption === opt.label}
            isCorrect={opt.label === question.correct_answer}
            isStrikethrough={strikethroughs.has(opt.label)}
            showFeedback={showFeedback && isSubmitted}
            disabled={isSubmitted && showFeedback}
            onClick={() => onSelectOption(opt.label)}
            onToggleStrikethrough={() => toggleStrikethrough(opt.label)}
          />
        ))}
      </div>

      {/* Rationale feedback */}
      {showFeedback && isSubmitted && selectedOption && (
        <RationalePanel
          question={question}
          selectedOption={selectedOption}
          isCorrect={isCorrect}
        />
      )}
    </div>
  );
}
