/* ===================================================================
   AXONPASS — Adobe-Style Interactive Content Reader & Read Aloud Engine
   Rich Editorial Typography | Docked Mini-Player | Real Lists, Tables,
   Callouts, Copyable Code | Balanced Sentence Highlighting
   =================================================================== */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {
  speechEngine,
  type SpeechPlaybackState,
  type SpeechVoiceOption,
} from '../../lib/audio/speechEngine';
import { segmentDocumentForSpeech, type CalloutKind } from '../../lib/audio/speechSegmenter';
import type { SectionHeading } from '../../lib/contentNormalizer';

export type ReadingTheme = 'light' | 'sepia' | 'dark';
export type ReadingFont = 'sans' | 'serif';

export interface AdobeContentReaderProps {
  contentMarkdown: string;
  chapterTitle?: string;
  bookTitle?: string;
  fontSize?: 'sm' | 'base' | 'lg' | 'xl';
  readingTheme?: ReadingTheme;
  readingFont?: ReadingFont;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
  showAudioControlsInitially?: boolean;
  initialSentenceIndex?: number;
  onSentenceProgress?: (index: number) => void;
  onHighlightSave?: (selectedText: string) => void;
  onCreateFlashcard?: (selectedText: string) => void;
  onAskTutor?: (selectedText: string) => void;
  onHeadingsExtracted?: (headings: SectionHeading[]) => void;
}

const CALLOUT_META: Record<CalloutKind, { icon: string; label: string }> = {
  tip: { icon: '💡', label: 'Exam Tip' },
  warning: { icon: '⚠️', label: 'Watch Out' },
  definition: { icon: '📘', label: 'Key Definition' },
  takeaway: { icon: '🎯', label: 'Key Takeaway' },
  note: { icon: '📝', label: 'Important Note' },
};

const SPEED_PRESETS = [0.75, 1.0, 1.25, 1.5, 2.0];

export default function AdobeContentReader({
  contentMarkdown,
  chapterTitle,
  bookTitle,
  fontSize = 'base',
  readingTheme = 'light',
  readingFont = 'sans',
  onNextChapter,
  onPrevChapter,
  showAudioControlsInitially = false,
  initialSentenceIndex = 0,
  onSentenceProgress,
  onHighlightSave,
  onCreateFlashcard,
  onAskTutor,
  onHeadingsExtracted,
}: AdobeContentReaderProps) {
  const [playbackState, setPlaybackState] = useState<SpeechPlaybackState>(speechEngine.getState());
  const [voices, setVoices] = useState<SpeechVoiceOption[]>([]);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);
  const [showToolbar, setShowToolbar] = useState(showAudioControlsInitially);
  const [audioOptionsOpen, setAudioOptionsOpen] = useState(false);
  const [followAlong, setFollowAlong] = useState(true);
  const [autoAdvanceChapter, setAutoAdvanceChapter] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  const [selectionFeedback, setSelectionFeedback] = useState<string | null>(null);
  const [sleepMode, setSleepMode] = useState<'off' | 'end' | 15 | 30 | 60>('off');
  const [sleepSecondsLeft, setSleepSecondsLeft] = useState<number>(0);
  const [copiedBlockKey, setCopiedBlockKey] = useState<number | null>(null);

  const bookmarkKey = `anoxpass_audio_bmarks_v1_${bookTitle || 'book'}_${chapterTitle || 'ch'}`;
  const [audioBookmarks, setAudioBookmarks] = useState<Array<{ sentenceIndex: number; label: string }>>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(bookmarkKey) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      setAudioBookmarks(JSON.parse(localStorage.getItem(bookmarkKey) || '[]'));
    } catch {
      setAudioBookmarks([]);
    }
  }, [bookmarkKey]);

  // Sleep Timer Countdown
  useEffect(() => {
    if (typeof sleepMode !== 'number' || !playbackState.isPlaying || playbackState.isPaused) return;
    const timer = window.setInterval(() => {
      setSleepSecondsLeft((prev) => {
        if (prev <= 1) {
          speechEngine.pause();
          setSleepMode('off');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [sleepMode, playbackState.isPlaying, playbackState.isPaused]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showAudioControlsInitially) {
      setShowToolbar(true);
    }
  }, [showAudioControlsInitially]);

  // Parse normalized document into coherent editorial blocks & synchronized sentences
  const { blocks, allSentences } = useMemo(() => {
    return segmentDocumentForSpeech(contentMarkdown);
  }, [contentMarkdown]);

  // Emit H2/H3 section outline headings for the right "On This Page" aside
  useEffect(() => {
    if (!onHeadingsExtracted) return;
    const extracted: SectionHeading[] = blocks
      .filter((b) => b.type === 'heading' && b.headingId && (b.headingLevel === 2 || b.headingLevel === 3))
      .map((b) => ({
        id: b.headingId as string,
        level: b.headingLevel as number,
        text: b.raw.replace(/^#{1,6}\s+/, '').replace(/[*_`]/g, '').trim(),
      }));
    onHeadingsExtracted(extracted);
  }, [blocks, onHeadingsExtracted]);

  // Load sentences into speechEngine when content changes
  useEffect(() => {
    if (allSentences.length > 0) {
      speechEngine.setTrackMetadata(chapterTitle || 'Lesson Audio', bookTitle || 'AxonPass Textbook');
      speechEngine.loadSentences(allSentences.map((s) => s.cleanSpeech));
      setActiveSentenceIndex(null);
    }
  }, [allSentences, chapterTitle, bookTitle]);

  // Subscribe to speechEngine state & sentence changes
  useEffect(() => {
    const unsubState = speechEngine.onStateChange((s) => {
      setPlaybackState(s);
      if (s.isPlaying) {
        setActiveSentenceIndex(s.currentIndex);
      } else if (!s.isPaused) {
        setActiveSentenceIndex(null);
      }

      if (
        autoAdvanceChapter &&
        sleepMode !== 'end' &&
        !s.isPlaying &&
        s.totalSentences > 0 &&
        s.currentIndex >= s.totalSentences - 1 &&
        onNextChapter
      ) {
        onNextChapter();
      }
    });

    const unsubSentence = speechEngine.onSentenceChange((index) => {
      setActiveSentenceIndex(index);
      onSentenceProgress?.(index);

      if (followAlong) {
        const sentenceEl = document.getElementById(`reader-sentence-${index}`);
        if (sentenceEl) {
          sentenceEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    setVoices(speechEngine.getAvailableVoices());

    return () => {
      unsubState();
      unsubSentence();
    };
  }, [followAlong, autoAdvanceChapter, sleepMode, onNextChapter, onSentenceProgress]);

  const handleMouseUpSelection = () => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection()?.toString().trim() || '';
    if (sel.length >= 8 && sel.length <= 1200) {
      setSelectedText(sel);
    } else if (sel.length === 0) {
      setSelectedText('');
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }
      if (e.key === '[') {
        speechEngine.setRate(Math.max(0.5, Number((speechEngine.getState().rate - 0.25).toFixed(2))));
      } else if (e.key === ']') {
        speechEngine.setRate(Math.min(2.5, Number((speechEngine.getState().rate + 0.25).toFixed(2))));
      } else if (e.shiftKey && e.key === 'ArrowRight') {
        speechEngine.skipNext();
      } else if (e.shiftKey && e.key === 'ArrowLeft') {
        speechEngine.skipPrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleSentenceClick = (sentenceIndex: number) => {
    setShowToolbar(true);
    speechEngine.playFromSentence(sentenceIndex, allSentences.map((s) => s.cleanSpeech));
  };

  const handleTogglePlay = () => {
    setShowToolbar(true);
    if (playbackState.isPlaying && !playbackState.isPaused) {
      speechEngine.pause();
    } else if (playbackState.isPaused) {
      speechEngine.resume();
    } else {
      speechEngine.playFromSentence(
        activeSentenceIndex ?? 0,
        allSentences.map((s) => s.cleanSpeech)
      );
    }
  };

  const handleStop = () => {
    speechEngine.stop();
    setActiveSentenceIndex(null);
  };

  const handleCycleSpeed = () => {
    const curIdx = SPEED_PRESETS.findIndex((r) => Math.abs(r - playbackState.rate) < 0.05);
    const nextRate = SPEED_PRESETS[(curIdx + 1) % SPEED_PRESETS.length];
    speechEngine.setRate(nextRate);
  };

  const percent =
    allSentences.length > 0 && activeSentenceIndex !== null
      ? Math.round(((activeSentenceIndex + 1) / allSentences.length) * 100)
      : playbackState.totalSentences > 0
      ? Math.round(((playbackState.currentIndex + 1) / playbackState.totalSentences) * 100)
      : 0;

  return (
    <div
      ref={containerRef}
      className={`adobe-reader-container reader-theme-${readingTheme} reader-font-${readingFont}`}
      style={{
        position: 'relative',
        paddingBottom: showToolbar ? '88px' : undefined,
      }}
    >
      {/* Slim Quick Listen / Resume Launcher when Docked Audio Player is Closed */}
      {!showToolbar && allSentences.length > 0 && (
        <div style={{ marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
          {initialSentenceIndex > 0 && initialSentenceIndex < allSentences.length && (
            <button
              type="button"
              onClick={() => handleSentenceClick(initialSentenceIndex)}
              className="btn btn-sm btn-primary"
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              ▶ Resume Audio ({initialSentenceIndex + 1}/{allSentences.length})
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setShowToolbar(true);
              handleTogglePlay();
            }}
            className="btn btn-sm btn-secondary"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            🎧 Listen Read Aloud
          </button>
        </div>
      )}

      {/* Kindle-Style Sticky Text Selection Toolbar */}
      {(selectedText || selectionFeedback) && (
        <div className="selection-action-bar">
          {selectionFeedback ? (
            <span style={{ fontWeight: 700, color: '#86efac' }}>✓ {selectionFeedback}</span>
          ) : (
            <>
              <span style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.9 }}>
                “{selectedText.slice(0, 70)}{selectedText.length > 70 ? '...' : ''}”
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-xs btn-secondary"
                  onClick={() => speechEngine.speakSnippet(selectedText)}
                >
                  🎧 Read
                </button>
                {onHighlightSave && (
                  <button
                    type="button"
                    className="btn btn-xs btn-warning"
                    onClick={() => {
                      onHighlightSave(selectedText);
                      setSelectionFeedback('Saved highlight to your notes');
                      setSelectedText('');
                      setTimeout(() => setSelectionFeedback(null), 2200);
                    }}
                  >
                    🟡 Highlight
                  </button>
                )}
                {onCreateFlashcard && (
                  <button
                    type="button"
                    className="btn btn-xs btn-primary"
                    onClick={() => {
                      onCreateFlashcard(selectedText);
                      setSelectionFeedback('Added to FSRS Review Queue');
                      setSelectedText('');
                      setTimeout(() => setSelectionFeedback(null), 2200);
                    }}
                  >
                    🃏 FSRS Card
                  </button>
                )}
                {onAskTutor && (
                  <button
                    type="button"
                    className="btn btn-xs btn-secondary"
                    onClick={() => {
                      onAskTutor(selectedText);
                      setSelectedText('');
                    }}
                  >
                    🤖 Ask Tutor
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-xs btn-ghost"
                  style={{ color: '#fff' }}
                  onClick={() => setSelectedText('')}
                >
                  ✕
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Editorial Prose Surface */}
      <article className={`ereader-prose font-size-${fontSize}`} onMouseUp={handleMouseUpSelection}>
        {blocks.map((block, bIdx) => {
          if (block.type === 'divider') {
            return (
              <hr
                key={bIdx}
                style={{
                  border: 'none',
                  borderTop: '1px solid var(--reader-border, var(--border-color))',
                  margin: 'var(--space-6) 0',
                }}
              />
            );
          }

          if (block.type === 'code') {
            const fenceLines = block.raw.split('\n');
            const langLabel = fenceLines[0]?.replace(/^```/, '').trim() || 'code';
            const innerCode = fenceLines.slice(1, fenceLines[fenceLines.length - 1]?.trim().startsWith('```') ? -1 : undefined).join('\n');
            return (
              <div key={bIdx} className="editorial-code-block">
                <div className="editorial-code-header">
                  <span>{langLabel.toUpperCase()}</span>
                  <button
                    type="button"
                    className="btn btn-xs btn-ghost"
                    style={{ color: '#CBD5E1', padding: '2px 8px', minHeight: '22px' }}
                    onClick={() => {
                      navigator.clipboard?.writeText(innerCode).catch(() => {});
                      setCopiedBlockKey(bIdx);
                      setTimeout(() => setCopiedBlockKey((prev) => (prev === bIdx ? null : prev)), 1800);
                    }}
                  >
                    {copiedBlockKey === bIdx ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <pre>
                  <code>{innerCode}</code>
                </pre>
              </div>
            );
          }

          if (block.type === 'table') {
            return (
              <div key={bIdx} className="editorial-table-wrap">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {block.raw}
                </ReactMarkdown>
              </div>
            );
          }

          if (block.type === 'heading') {
            const sentence = block.sentences[0];
            const isActive = sentence && activeSentenceIndex === sentence.index && playbackState.isPlaying;
            const level = Math.min(4, Math.max(1, block.headingLevel || 2));
            const headingTag = `h${level}`;
            const headingClass =
              level === 2
                ? 'ereader-block-heading editorial-heading-h2'
                : level === 3
                ? 'ereader-block-heading editorial-heading-h3'
                : level === 4
                ? 'ereader-block-heading editorial-heading-h4'
                : 'ereader-block-heading';

            const headingContent = sentence ? (
              <span
                id={`reader-sentence-${sentence.index}`}
                onClick={() => handleSentenceClick(sentence.index)}
                className={`ereader-sentence ${isActive ? 'ereader-sentence-active' : ''}`}
                title="Click to start Read Aloud from this heading"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{ p: ({ children }) => <>{children}</> }}
                >
                  {sentence.raw}
                </ReactMarkdown>
              </span>
            ) : (
              block.raw.replace(/^#{1,6}\s+/, '')
            );

            return React.createElement(
              headingTag,
              {
                key: bIdx,
                id: block.headingId,
                className: headingClass,
              },
              headingContent
            );
          }

          if (block.type === 'callout') {
            const kind = block.calloutKind || 'note';
            const meta = CALLOUT_META[kind];
            return (
              <div key={bIdx} className={`editorial-callout editorial-callout--${kind}`}>
                <div className="editorial-callout-header">
                  <span>{meta.icon}</span>
                  <span>{meta.label}</span>
                </div>
                <div>
                  {block.sentences.map((sentence) => {
                    const isActive = activeSentenceIndex === sentence.index && playbackState.isPlaying;
                    return (
                      <span
                        key={sentence.index}
                        id={`reader-sentence-${sentence.index}`}
                        onClick={() => handleSentenceClick(sentence.index)}
                        className={`ereader-sentence ${isActive ? 'ereader-sentence-active' : ''}`}
                        title="Click to start Read Aloud here"
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{ p: ({ children }) => <>{children}</> }}
                        >
                          {sentence.raw}
                        </ReactMarkdown>{' '}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          }

          if (block.type === 'list') {
            const ListTag = block.ordered ? 'ol' : 'ul';
            const listClass = block.ordered ? 'ereader-block-olist' : 'ereader-block-list';
            return (
              <ListTag key={bIdx} className={listClass}>
                {block.sentences.map((sentence) => {
                  const isActive = activeSentenceIndex === sentence.index && playbackState.isPlaying;
                  return (
                    <li
                      key={sentence.index}
                      className={sentence.indentLevel ? 'ereader-list-nested' : undefined}
                    >
                      <span
                        id={`reader-sentence-${sentence.index}`}
                        onClick={() => handleSentenceClick(sentence.index)}
                        className={`ereader-sentence ${isActive ? 'ereader-sentence-active' : ''}`}
                        title="Click to start Read Aloud from this bullet"
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{ p: ({ children }) => <>{children}</> }}
                        >
                          {sentence.raw}
                        </ReactMarkdown>
                      </span>
                    </li>
                  );
                })}
              </ListTag>
            );
          }

          if (block.type === 'blockquote') {
            return (
              <blockquote key={bIdx} className="ereader-block-quote">
                {block.sentences.map((sentence) => {
                  const isActive = activeSentenceIndex === sentence.index && playbackState.isPlaying;
                  return (
                    <span
                      key={sentence.index}
                      id={`reader-sentence-${sentence.index}`}
                      onClick={() => handleSentenceClick(sentence.index)}
                      className={`ereader-sentence ${isActive ? 'ereader-sentence-active' : ''}`}
                      title="Click to start Read Aloud here"
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{ p: ({ children }) => <>{children}</> }}
                      >
                        {sentence.raw}
                      </ReactMarkdown>{' '}
                    </span>
                  );
                })}
              </blockquote>
            );
          }

          // Default: Paragraph
          return (
            <p key={bIdx} className="ereader-block-paragraph">
              {block.sentences.map((sentence) => {
                const isActive = activeSentenceIndex === sentence.index && playbackState.isPlaying;
                return (
                  <span
                    key={sentence.index}
                    id={`reader-sentence-${sentence.index}`}
                    onClick={() => handleSentenceClick(sentence.index)}
                    className={`ereader-sentence ${isActive ? 'ereader-sentence-active' : ''}`}
                    title="Click to start Read Aloud from this sentence"
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{ p: ({ children }) => <>{children}</> }}
                    >
                      {sentence.raw}
                    </ReactMarkdown>{' '}
                  </span>
                );
              })}
            </p>
          );
        })}
      </article>

      {/* Unified Non-Colliding Docked Bottom Audio Mini-Player */}
      {showToolbar && (
        <div className="docked-audio-bar animate-slide-up" role="region" aria-label="Read Aloud Audio Player">
          <div className="docked-audio-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {onPrevChapter && (
                <button type="button" className="btn btn-xs btn-ghost" onClick={onPrevChapter} title="Previous Section">
                  ⏮
                </button>
              )}
              <button type="button" className="btn btn-xs btn-secondary" onClick={() => speechEngine.skipPrev()} title="Previous Sentence">
                ⏪
              </button>
              <button
                type="button"
                className={`btn btn-sm ${playbackState.isPlaying && !playbackState.isPaused ? 'btn-warning' : 'btn-primary'}`}
                onClick={handleTogglePlay}
                style={{ minHeight: '34px', padding: '0 14px', fontWeight: 700 }}
              >
                {playbackState.isPlaying && !playbackState.isPaused ? '⏸ Pause' : '▶ Listen'}
              </button>
              <button type="button" className="btn btn-xs btn-secondary" onClick={() => speechEngine.skipNext()} title="Next Sentence">
                ⏩
              </button>
              {onNextChapter && (
                <button type="button" className="btn btn-xs btn-ghost" onClick={onNextChapter} title="Next Section">
                  ⏭
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '140px' }}>
              <div
                className="docked-audio-scrubber"
                title="Click to jump in audio"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  handleSentenceClick(Math.floor(ratio * (allSentences.length || 1)));
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
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-muted)', whiteSpace: 'nowrap' }}>
                {activeSentenceIndex !== null ? `${activeSentenceIndex + 1}/${allSentences.length}` : `0/${allSentences.length}`}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                className="btn btn-xs btn-secondary"
                onClick={handleCycleSpeed}
                title="Cycle Playback Speed"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}
              >
                {playbackState.rate}x
              </button>
              <button
                type="button"
                className={`btn btn-xs ${audioOptionsOpen ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setAudioOptionsOpen((o) => !o)}
                title="Voice, Sleep Timer & Audio Bookmarks"
              >
                ⚙ Options
              </button>
              <button
                type="button"
                className="btn btn-xs btn-ghost"
                onClick={() => {
                  handleStop();
                  setShowToolbar(false);
                  setAudioOptionsOpen(false);
                }}
                title="Close Audio Player"
              >
                ✕
              </button>
            </div>
          </div>

          {audioOptionsOpen && (
            <div className="docked-audio-popover">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {voices.length > 0 && (
                  <select
                    className="select select-xs"
                    style={{ fontSize: '11px', maxWidth: '175px' }}
                    value={playbackState.selectedVoiceURI || ''}
                    onChange={(e) => speechEngine.setVoiceByURI(e.target.value)}
                    title="Reading Voice"
                  >
                    {voices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        🗣 {v.name}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  className="select select-xs"
                  style={{ fontSize: '11px' }}
                  value={String(sleepMode)}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === 'off' || v === 'end') {
                      setSleepMode(v);
                      setSleepSecondsLeft(0);
                    } else {
                      const mins = Number(v) as 15 | 30 | 60;
                      setSleepMode(mins);
                      setSleepSecondsLeft(mins * 60);
                    }
                  }}
                  title="Sleep Timer"
                >
                  <option value="off">⏱ Sleep: Off</option>
                  <option value="15">⏱ 15 min</option>
                  <option value="30">⏱ 30 min</option>
                  <option value="60">⏱ 60 min</option>
                  <option value="end">⏱ End of Section</option>
                </select>
                {typeof sleepMode === 'number' && sleepSecondsLeft > 0 && (
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>
                    {Math.floor(sleepSecondsLeft / 60)}:{String(sleepSecondsLeft % 60).padStart(2, '0')}
                  </span>
                )}

                <button
                  type="button"
                  className={`btn btn-xs ${followAlong ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFollowAlong(!followAlong)}
                >
                  📜 Follow: {followAlong ? 'ON' : 'OFF'}
                </button>
                <button
                  type="button"
                  className={`btn btn-xs ${autoAdvanceChapter ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setAutoAdvanceChapter(!autoAdvanceChapter)}
                >
                  Auto-Next: {autoAdvanceChapter ? 'ON' : 'OFF'}
                </button>
                <button
                  type="button"
                  className="btn btn-xs btn-secondary"
                  onClick={() => {
                    const idx = activeSentenceIndex ?? playbackState.currentIndex ?? 0;
                    const snippet = (allSentences[idx]?.cleanSpeech || `Sentence ${idx + 1}`).slice(0, 26);
                    const next = [
                      ...audioBookmarks.filter((b) => b.sentenceIndex !== idx),
                      { sentenceIndex: idx, label: `#${idx + 1} · ${snippet}` },
                    ].slice(-5);
                    setAudioBookmarks(next);
                    try {
                      localStorage.setItem(bookmarkKey, JSON.stringify(next));
                    } catch {
                      // ignore
                    }
                  }}
                >
                  🔖 Bookmark
                </button>
              </div>

              {audioBookmarks.length > 0 && (
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', width: '100%' }}>
                  {audioBookmarks.map((bm) => (
                    <button
                      key={bm.sentenceIndex}
                      type="button"
                      className="btn btn-xs btn-ghost"
                      style={{ fontSize: '10px', border: '1px solid var(--border-color)' }}
                      onClick={() => handleSentenceClick(bm.sentenceIndex)}
                    >
                      ▶ {bm.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
