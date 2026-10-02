/* ===================================================================
   APILIGU LEARNING PASS — Timer Component
   Displays countdown with pacing indicator, severity colors,
   and pause/resume controls.
   =================================================================== */

import { useEffect } from 'react';
import { formatTimer, getTimerSeverity, getPacingStatus } from '../../lib/timer';

interface TimerProps {
  totalSeconds: number;
  remainingSeconds: number;
  questionsAnswered: number;
  totalQuestions: number;
  isRunning: boolean;
  isPaused: boolean;
  onTick: () => void;
  onPause?: () => void;
  onResume?: () => void;
}

export default function Timer({
  totalSeconds,
  remainingSeconds,
  questionsAnswered,
  totalQuestions,
  isRunning,
  isPaused,
  onTick,
  onPause,
  onResume,
}: TimerProps) {
  useEffect(() => {
    if (!isRunning || isPaused) return;

    const interval = setInterval(() => {
      onTick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, onTick]);

  const severity = getTimerSeverity(remainingSeconds, totalSeconds);
  const elapsed = totalSeconds - remainingSeconds;
  const pacing = getPacingStatus(questionsAnswered, totalQuestions, elapsed, totalSeconds);

  return (
    <div className="flex items-center gap-3" role="timer" aria-label="Session Timer">
      <div className={`timer ${severity}`}>
        <span>{formatTimer(remainingSeconds)}</span>
      </div>

      {totalQuestions > 5 && (
        <div className="desktop-only text-xs" style={{ color: 'var(--color-ink-muted)' }}>
          <span
            className={`badge ${
              pacing.status === 'ahead'
                ? 'badge-success'
                : pacing.status === 'behind'
                ? 'badge-warning'
                : 'badge-neutral'
            }`}
          >
            {pacing.message}
          </span>
        </div>
      )}

      {onPause && onResume && (
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={isPaused ? onResume : onPause}
          aria-label={isPaused ? 'Resume Quiz' : 'Pause Quiz'}
        >
          {isPaused ? '▶ Resume' : '⏸ Pause'}
        </button>
      )}
    </div>
  );
}
