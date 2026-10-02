import { triggerHaptic } from '../../lib/haptics';

interface OptionButtonProps {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
  isSelected: boolean;
  isCorrect?: boolean | null;
  isStrikethrough?: boolean;
  showFeedback: boolean;
  disabled?: boolean;
  onClick: () => void;
  onToggleStrikethrough?: () => void;
}

export default function OptionButton({
  label,
  text,
  isSelected,
  isCorrect,
  isStrikethrough = false,
  showFeedback,
  disabled = false,
  onClick,
  onToggleStrikethrough,
}: OptionButtonProps) {
  let stateClass = '';
  let icon = null;
  let statusText = '';

  if (showFeedback) {
    if (isCorrect === true) {
      stateClass = 'option-correct';
      icon = '✓';
      statusText = '(Correct Answer)';
    } else if (isSelected && isCorrect === false) {
      stateClass = 'option-incorrect';
      icon = '✗';
      statusText = '(Your Answer - Incorrect)';
    }
  } else if (isSelected) {
    stateClass = 'option-selected';
  } else if (isStrikethrough) {
    stateClass = 'option-strikethrough';
  }

  const handleSelect = () => {
    triggerHaptic(12);
    onClick();
  };

  const handleStrike = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic(8);
    if (onToggleStrikethrough) {
      onToggleStrikethrough();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '6px' }}>
      <button
        type="button"
        className={`option-btn ${stateClass}`}
        onClick={handleSelect}
        disabled={disabled}
        aria-label={`Option ${label}: ${text} ${isStrikethrough ? '(Eliminated)' : ''} ${statusText}`}
        aria-pressed={isSelected}
        style={{ flex: 1 }}
      >
        <div className="option-label" aria-hidden="true">
          {label}
        </div>
        <div className="option-text">
          <span>{text}</span>
        </div>
        {icon && (
          <div className="option-icon" aria-hidden="true" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            {icon}
          </div>
        )}
      </button>

      {/* Strike-Through / Elimination Toggle Button */}
      {!showFeedback && onToggleStrikethrough && (
        <button
          type="button"
          onClick={handleStrike}
          className={`strike-toggle-btn ${isStrikethrough ? 'active' : ''}`}
          title={isStrikethrough ? 'Restore option' : 'Eliminate distractor'}
          aria-label={`${isStrikethrough ? 'Restore' : 'Eliminate'} option ${label}`}
        >
          {isStrikethrough ? '↩' : '✕'}
        </button>
      )}
    </div>
  );
}
