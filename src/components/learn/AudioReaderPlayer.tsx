/* ===================================================================
   AXONPASS — Audio Reader & Read Aloud Player Component
   Listen on the Go | Sentence Highlighting & Native Speech Engine
   =================================================================== */

import { useState, useEffect } from 'react';
import {
  speechEngine,
  type SpeechPlaybackState,
  type SpeechVoiceOption,
} from '../../lib/audio/speechEngine';

interface AudioReaderPlayerProps {
  contentMarkdown: string;
  chapterTitle?: string;
  onSentenceHighlight?: (sentence: string, index: number) => void;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
}

export default function AudioReaderPlayer({
  contentMarkdown,
  chapterTitle,
  onSentenceHighlight,
  onNextChapter,
  onPrevChapter,
}: AudioReaderPlayerProps) {
  const [state, setState] = useState<SpeechPlaybackState>(speechEngine.getState());
  const [voices, setVoices] = useState<SpeechVoiceOption[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);

  // Subscribe to speech engine updates
  useEffect(() => {
    const unsubState = speechEngine.onStateChange((s) => {
      setState(s);
      if (autoAdvance && !s.isPlaying && s.totalSentences > 0 && s.currentIndex >= s.totalSentences - 1 && onNextChapter) {
        onNextChapter();
      }
    });

    const unsubSentence = speechEngine.onSentenceChange((index, sentence) => {
      if (onSentenceHighlight) {
        onSentenceHighlight(sentence, index);
      }
    });

    setVoices(speechEngine.getAvailableVoices());

    return () => {
      unsubState();
      unsubSentence();
    };
  }, [onSentenceHighlight, autoAdvance, onNextChapter]);

  // When chapter content changes, load new text into engine
  useEffect(() => {
    if (contentMarkdown) {
      speechEngine.loadText(contentMarkdown);
    }
  }, [contentMarkdown]);

  const handleTogglePlay = () => {
    if (state.isPlaying && !state.isPaused) {
      speechEngine.pause();
    } else if (state.isPaused) {
      speechEngine.resume();
    } else {
      speechEngine.play(contentMarkdown);
    }
  };

  const handleStop = () => {
    speechEngine.stop();
  };

  const handleSpeedChange = (rate: number) => {
    speechEngine.setRate(rate);
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    speechEngine.setVoiceByURI(e.target.value);
  };

  const percent =
    state.totalSentences > 0
      ? Math.round(((state.currentIndex + 1) / state.totalSentences) * 100)
      : 0;

  if (isMinimized) {
    return (
      <div
        className="card shadow-lg animate-fade-in"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
          padding: '8px 16px',
          backgroundColor: 'var(--color-bg)',
          border: '2px solid var(--color-primary)',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
        }}
      >
        <button
          type="button"
          className="btn btn-xs btn-primary"
          onClick={handleTogglePlay}
          style={{ width: '32px', height: '32px', borderRadius: '50%', padding: 0 }}
        >
          {state.isPlaying && !state.isPaused ? '⏸' : '▶'}
        </button>

        <div style={{ fontSize: '11px', fontWeight: 'bold' }}>
          🎧 {state.isPlaying ? 'Speaking...' : 'Audio Paused'} ({percent}%)
        </div>

        <button
          type="button"
          className="btn btn-xs btn-ghost"
          onClick={() => setIsMinimized(false)}
          title="Expand Player"
        >
          ▲
        </button>
      </div>
    );
  }

  return (
    <div
      className="card shadow-lg animate-slide-up"
      style={{
        position: 'sticky',
        top: '64px',
        zIndex: 40,
        margin: '0 0 var(--space-4) 0',
        padding: 'var(--space-3) var(--space-4)',
        backgroundColor: 'var(--color-bg)',
        border: '1px solid var(--color-primary-200)',
        borderLeft: '4px solid var(--color-primary)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px rgba(0, 35, 102, 0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🎧</span>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
              Read Aloud — Audio on the Go
            </div>
            {chapterTitle && (
              <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                {chapterTitle}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Voice Selector */}
          {voices.length > 0 && (
            <select
              className="select select-xs"
              style={{ fontSize: '11px', maxWidth: '170px' }}
              value={state.selectedVoiceURI || ''}
              onChange={handleVoiceChange}
              title="Select Voice"
            >
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  🗣 {v.name}
                </option>
              ))}
            </select>
          )}

          {/* Speed Presets */}
          <div style={{ display: 'flex', gap: '2px', backgroundColor: 'var(--color-bg-subtle)', padding: '2px', borderRadius: 'var(--radius-sm)' }}>
            {[1.0, 1.25, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => handleSpeedChange(rate)}
                style={{
                  border: 'none',
                  background: state.rate === rate ? 'var(--color-primary)' : 'transparent',
                  color: state.rate === rate ? '#fff' : 'var(--color-ink-muted)',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                }}
              >
                {rate}x
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-xs btn-ghost"
            onClick={() => setIsMinimized(true)}
            title="Minimize to Floating Bar"
          >
            ▼
          </button>
        </div>
      </div>

      {/* Playback Controls & Scrubber */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {onPrevChapter && (
            <button
              type="button"
              className="btn btn-xs btn-secondary"
              onClick={onPrevChapter}
              title="Previous Chapter"
            >
              ⏮ Ch
            </button>
          )}

          <button
            type="button"
            className="btn btn-xs btn-secondary"
            onClick={() => speechEngine.skipPrev()}
            title="Previous Sentence"
          >
            ⏪
          </button>

          <button
            type="button"
            className={`btn btn-sm ${state.isPlaying && !state.isPaused ? 'btn-warning' : 'btn-primary'}`}
            onClick={handleTogglePlay}
            style={{ fontWeight: 'bold', minWidth: '72px' }}
          >
            {state.isPlaying && !state.isPaused ? '⏸ Pause' : '▶ Listen'}
          </button>

          <button
            type="button"
            className="btn btn-xs btn-secondary"
            onClick={() => speechEngine.skipNext()}
            title="Next Sentence"
          >
            ⏩
          </button>

          {onNextChapter && (
            <button
              type="button"
              className="btn btn-xs btn-secondary"
              onClick={onNextChapter}
              title="Next Chapter"
            >
              Ch ⏭
            </button>
          )}

          <button
            type="button"
            className="btn btn-xs btn-ghost"
            onClick={handleStop}
            title="Stop Speech"
          >
            ⏹ Stop
          </button>

          <button
            type="button"
            className={`btn btn-xs ${autoAdvance ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setAutoAdvance(!autoAdvance)}
            title="Continuous listening: auto-advance to next chapter when speech ends"
            style={{ fontSize: '10px', padding: '2px 8px' }}
          >
            Auto-Next: {autoAdvance ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Progress & Sentence Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '180px', maxWidth: '300px' }}>
          <div
            style={{
              flex: 1,
              height: '6px',
              backgroundColor: 'var(--color-bg-subtle)',
              borderRadius: '3px',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = clickX / rect.width;
              const targetSentence = Math.floor(ratio * state.totalSentences);
              speechEngine.seekTo(targetSentence);
            }}
          >
            <div
              style={{
                width: `${percent}%`,
                height: '100%',
                backgroundColor: 'var(--color-primary)',
                transition: 'width 0.2s ease',
              }}
            />
          </div>

          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-muted)' }}>
            {state.totalSentences > 0 ? `${state.currentIndex + 1}/${state.totalSentences}` : '0/0'}
          </span>
        </div>
      </div>

      {/* Live Spoken Sentence Subtitle */}
      {state.isPlaying && state.currentSentence && (
        <div
          style={{
            marginTop: '8px',
            padding: '6px 10px',
            backgroundColor: 'var(--color-primary-surface)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            color: 'var(--color-primary)',
            fontStyle: 'italic',
            lineHeight: 1.4,
          }}
        >
          🗣 &quot;{state.currentSentence}&quot;
        </div>
      )}
    </div>
  );
}
