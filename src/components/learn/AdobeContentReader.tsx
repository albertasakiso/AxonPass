/* ===================================================================
   AXONPASS — Adobe-Style Interactive Content Reader & Read Aloud Engine
   Real-Time Sentence Highlighting | Click-to-Read From Anywhere
   Auto-Scroll Follow-Along | In-App Audio Guide | 100% Free Web Speech
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

export interface ParsedSentence {
  index: number;
  raw: string;
  cleanSpeech: string;
}

export interface ParsedBlock {
  type: 'heading' | 'paragraph' | 'list' | 'blockquote' | 'code' | 'divider';
  headingLevel?: number;
  raw: string;
  sentences: ParsedSentence[];
}

/**
 * Segment raw markdown into structured blocks and discrete sentences for
 * synchronized audio speech synthesis and line-by-line visual tracking.
 */
export function segmentDocumentForSpeech(markdown: string): {
  blocks: ParsedBlock[];
  allSentences: ParsedSentence[];
} {
  if (!markdown) return { blocks: [], allSentences: [] };

  const lines = markdown.split(/\r?\n/);
  const blocks: ParsedBlock[] = [];
  let currentBlockLines: string[] = [];
  let currentType: 'paragraph' | 'list' | 'blockquote' | 'code' = 'paragraph';
  let inCodeBlock = false;

  const flushBlock = () => {
    if (currentBlockLines.length === 0) return;
    const rawText = currentBlockLines.join('\n');
    blocks.push({ type: currentType, raw: rawText, sentences: [] });
    currentBlockLines = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Handle code blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        currentBlockLines.push(line);
        flushBlock();
        inCodeBlock = false;
        currentType = 'paragraph';
        continue;
      } else {
        flushBlock();
        inCodeBlock = true;
        currentType = 'code';
        currentBlockLines.push(line);
        continue;
      }
    }

    if (inCodeBlock) {
      currentBlockLines.push(line);
      continue;
    }

    // Blank lines delimit blocks
    if (!trimmed) {
      flushBlock();
      currentType = 'paragraph';
      continue;
    }

    // Horizontal rules
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flushBlock();
      blocks.push({ type: 'divider', raw: trimmed, sentences: [] });
      currentType = 'paragraph';
      continue;
    }

    // Headings (# .. ######)
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushBlock();
      blocks.push({
        type: 'heading',
        headingLevel: headingMatch[1].length,
        raw: trimmed,
        sentences: [],
      });
      currentType = 'paragraph';
      continue;
    }

    // Blockquotes (>)
    if (trimmed.startsWith('>')) {
      if (currentType !== 'blockquote') {
        flushBlock();
        currentType = 'blockquote';
      }
      currentBlockLines.push(line);
      continue;
    }

    // Bullet lists (- , * , + , 1. )
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('+ ') || /^\d+\.\s/.test(trimmed)) {
      if (currentType !== 'list') {
        flushBlock();
        currentType = 'list';
      }
      currentBlockLines.push(line);
      continue;
    }

    // Regular paragraph continuation
    if (currentType !== 'paragraph') {
      flushBlock();
      currentType = 'paragraph';
    }
    currentBlockLines.push(line);
  }

  flushBlock();

  // Segment each block into sentences
  const allSentences: ParsedSentence[] = [];
  let globalIndex = 0;

  for (const block of blocks) {
    if (block.type === 'divider' || block.type === 'code') {
      continue;
    }

    if (block.type === 'heading') {
      const headingClean = block.raw.replace(/^#{1,6}\s+/, '').trim();
      const sentence: ParsedSentence = {
        index: globalIndex++,
        raw: block.raw.replace(/^#{1,6}\s+/, ''),
        cleanSpeech: headingClean + '.',
      };
      block.sentences = [sentence];
      allSentences.push(sentence);
      continue;
    }

    if (block.type === 'list') {
      const listLines = block.raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
      for (const line of listLines) {
        const itemClean = line.replace(/^[-*+]\s+|\d+\.\s+/, '').trim();
        const sentence: ParsedSentence = {
          index: globalIndex++,
          raw: line,
          cleanSpeech: itemClean.replace(/[*_`]/g, '') + '.',
        };
        block.sentences.push(sentence);
        allSentences.push(sentence);
      }
      continue;
    }

    // Paragraph or blockquote: split by sentence punctuation boundary (. ! ?)
    const regex = /(?<=[.!?])\s+(?=[A-Z0-9*#_`"'(])/g;
    const splitParts = block.raw.split(regex).map((s) => s.trim()).filter(Boolean);

    for (const part of splitParts) {
      const clean = part
        .replace(/^>\s+/, '')
        .replace(/[*_`#]/g, '')
        .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
        .trim();

      const sentence: ParsedSentence = {
        index: globalIndex++,
        raw: part,
        cleanSpeech: clean,
      };
      block.sentences.push(sentence);
      allSentences.push(sentence);
    }
  }

  return { blocks, allSentences };
}

export interface AdobeContentReaderProps {
  contentMarkdown: string;
  chapterTitle?: string;
  fontSize?: 'sm' | 'base' | 'lg' | 'xl';
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
  showAudioControlsInitially?: boolean;
}

export default function AdobeContentReader({
  contentMarkdown,
  chapterTitle,
  fontSize = 'base',
  onNextChapter,
  onPrevChapter,
  showAudioControlsInitially = true,
}: AdobeContentReaderProps) {
  const [playbackState, setPlaybackState] = useState<SpeechPlaybackState>(speechEngine.getState());
  const [voices, setVoices] = useState<SpeechVoiceOption[]>([]);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showToolbar, setShowToolbar] = useState(showAudioControlsInitially);
  const [followAlong, setFollowAlong] = useState(true);
  const [autoAdvanceChapter, setAutoAdvanceChapter] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Parse document into structured blocks and synchronized sentences
  const { blocks, allSentences } = useMemo(() => {
    return segmentDocumentForSpeech(contentMarkdown);
  }, [contentMarkdown]);

  // Load sentences into speechEngine when content changes
  useEffect(() => {
    if (allSentences.length > 0) {
      speechEngine.loadSentences(allSentences.map((s) => s.cleanSpeech));
      setActiveSentenceIndex(null);
    }
  }, [allSentences]);

  // Subscribe to speechEngine state and sentence changes
  useEffect(() => {
    const unsubState = speechEngine.onStateChange((s) => {
      setPlaybackState(s);
      if (s.isPlaying) {
        setActiveSentenceIndex(s.currentIndex);
      } else if (!s.isPaused) {
        setActiveSentenceIndex(null);
      }

      // Check auto-advance to next chapter when speech ends
      if (
        autoAdvanceChapter &&
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

      // Adobe-style auto-scroll to keep active sentence centered in view
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
  }, [followAlong, autoAdvanceChapter, onNextChapter]);

  // Handle click-to-read from any sentence
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

  const handleSpeedChange = (rate: number) => {
    speechEngine.setRate(rate);
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    speechEngine.setVoiceByURI(e.target.value);
  };

  const percent =
    allSentences.length > 0 && activeSentenceIndex !== null
      ? Math.round(((activeSentenceIndex + 1) / allSentences.length) * 100)
      : playbackState.totalSentences > 0
      ? Math.round(((playbackState.currentIndex + 1) / playbackState.totalSentences) * 100)
      : 0;

  const currentDisplaySentence =
    activeSentenceIndex !== null && allSentences[activeSentenceIndex]
      ? allSentences[activeSentenceIndex].cleanSpeech
      : playbackState.currentSentence;

  return (
    <div ref={containerRef} className="adobe-reader-container" style={{ position: 'relative' }}>
      {/* ──────────────────────────────────────────────────────────── */}
      {/* FLOATING CORNER PILL (WHEN MINIMIZED)                         */}
      {/* ──────────────────────────────────────────────────────────── */}
      {showToolbar && isMinimized && (
        <div
          className="card shadow-lg animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999,
            padding: '6px 14px',
            backgroundColor: 'var(--color-bg)',
            border: '2px solid var(--color-primary)',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <button
            type="button"
            className="btn btn-xs btn-primary"
            onClick={handleTogglePlay}
            style={{ width: '32px', height: '32px', borderRadius: '50%', padding: 0 }}
            title={playbackState.isPlaying && !playbackState.isPaused ? 'Pause' : 'Play'}
          >
            {playbackState.isPlaying && !playbackState.isPaused ? '⏸' : '▶'}
          </button>

          <div
            onClick={() => setIsMinimized(false)}
            style={{
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Click to expand player"
          >
            <span>🎧</span>
            <span>{percent}%</span>
          </div>

          <button
            type="button"
            className="btn btn-xs btn-ghost"
            onClick={() => speechEngine.skipNext()}
            title="Next Sentence"
            style={{ padding: '2px 4px' }}
          >
            ⏩
          </button>

          <button
            type="button"
            className="btn btn-xs btn-secondary"
            onClick={() => setIsMinimized(false)}
            title="Expand Full Controls"
            style={{ fontSize: '10px', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}
          >
            ⤢ Controls
          </button>

          <button
            type="button"
            className="btn btn-xs btn-ghost"
            onClick={() => {
              handleStop();
              setShowToolbar(false);
            }}
            title="Close Audio Reader"
            style={{ padding: '2px 4px', fontSize: '12px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* ADOBE / EDGE STYLE AUDIO CONTROL BAR (DOCKED/EXPANDED)        */}
      {/* ──────────────────────────────────────────────────────────── */}
      {showToolbar && !isMinimized && (
        <div
          className="card shadow-lg animate-slide-up"
          style={{
            margin: '0 0 var(--space-4) 0',
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--border-color)',
            borderLeft: '4px solid var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 6px 20px rgba(0, 35, 102, 0.08)',
          }}
        >
          {/* Top Bar: Title & Configuration */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem' }}>🎧</span>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                  Adobe-Style Read Aloud — Audio on the Go
                </div>
                {chapterTitle && (
                  <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                    {chapterTitle}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Voice Selector */}
              {voices.length > 0 && (
                <select
                  className="select select-xs"
                  style={{ fontSize: '11px', maxWidth: '170px' }}
                  value={playbackState.selectedVoiceURI || ''}
                  onChange={handleVoiceChange}
                  title="Select Reading Voice"
                >
                  {voices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      🗣 {v.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Speed Presets */}
              <div
                style={{
                  display: 'flex',
                  gap: '2px',
                  backgroundColor: 'var(--color-bg-subtle)',
                  padding: '2px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => handleSpeedChange(rate)}
                    style={{
                      border: 'none',
                      background: playbackState.rate === rate ? 'var(--color-primary)' : 'transparent',
                      color: playbackState.rate === rate ? '#fff' : 'var(--color-ink-muted)',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      padding: '2px 5px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Follow-Along Auto Scroll Toggle */}
              <button
                type="button"
                className={`btn btn-xs ${followAlong ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFollowAlong(!followAlong)}
                title="Automatically scroll page to keep spoken sentence in view (Adobe Reader style)"
                style={{ fontSize: '10px', padding: '2px 8px' }}
              >
                📜 Follow: {followAlong ? 'ON' : 'OFF'}
              </button>

              <button
                type="button"
                className="btn btn-xs btn-secondary"
                onClick={() => setIsMinimized(true)}
                title="Minimize to Floating Corner Pill"
                style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
              >
                <span>—</span>
                <span>Mini</span>
              </button>

              <button
                type="button"
                className="btn btn-xs btn-ghost"
                onClick={() => {
                  handleStop();
                  setShowToolbar(false);
                }}
                title="Stop & Close Player"
                style={{ fontSize: '12px', padding: '2px 6px' }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Playback Controls & Progress Scrubber */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
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
                className={`btn btn-sm ${
                  playbackState.isPlaying && !playbackState.isPaused ? 'btn-warning' : 'btn-primary'
                }`}
                onClick={handleTogglePlay}
                style={{ fontWeight: 'bold', minWidth: '78px' }}
              >
                {playbackState.isPlaying && !playbackState.isPaused ? '⏸ Pause' : '▶ Listen'}
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
                className={`btn btn-xs ${autoAdvanceChapter ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setAutoAdvanceChapter(!autoAdvanceChapter)}
                title="Auto-advance to next chapter when speech reaches the end"
                style={{ fontSize: '10px', padding: '2px 6px' }}
              >
                Auto-Next: {autoAdvanceChapter ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Progress & Sentence Counter */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: '1',
                minWidth: '180px',
                maxWidth: '320px',
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: '6px',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                title="Click anywhere to jump in the audio"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  const targetSentence = Math.floor(ratio * (allSentences.length || 1));
                  handleSentenceClick(targetSentence);
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

              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-ink-muted)',
                  whiteSpace: 'nowrap',
                }}
              >
                {allSentences.length > 0 && activeSentenceIndex !== null
                  ? `${activeSentenceIndex + 1}/${allSentences.length}`
                  : `0/${allSentences.length}`}
              </span>
            </div>
          </div>

          {/* Live Spoken Sentence Subtitle Box */}
          {playbackState.isPlaying && currentDisplaySentence && (
            <div
              className="animate-fade-in"
              style={{
                marginTop: '8px',
                padding: '6px 12px',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                borderLeft: '3px solid #f59e0b',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                color: 'var(--color-ink)',
                lineHeight: 1.4,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ fontSize: '1rem' }}>🗣</span>
              <span style={{ fontStyle: 'italic' }}>&quot;{currentDisplaySentence}&quot;</span>
            </div>
          )}

          {/* Interactive Adobe Reader User Guidance */}
          <div
            style={{
              marginTop: '6px',
              fontSize: '10px',
              color: 'var(--color-ink-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>💡</span>
            <span>
              <strong>Adobe Read Aloud:</strong> Tap or click on <em>any sentence or paragraph</em> below to immediately start reading from that point.
            </span>
          </div>
        </div>
      )}

      {/* Floating Read Aloud Launcher if Toolbar is Hidden */}
      {!showToolbar && (
        <div style={{ marginBottom: 'var(--space-3)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => {
              setShowToolbar(true);
              setIsMinimized(false);
              handleTogglePlay();
            }}
            className="btn btn-sm btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: 'var(--text-xs)',
              fontWeight: 'bold',
              borderRadius: 'var(--radius-full)',
            }}
          >
            <span>🎧</span>
            <span>Listen with Adobe Read Aloud</span>
          </button>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* INTERACTIVE READING PROSE SURFACE                             */}
      {/* ──────────────────────────────────────────────────────────── */}
      <article className={`ereader-prose font-size-${fontSize}`}>
        {blocks.map((block, bIdx) => {
          if (block.type === 'divider') {
            return (
              <hr
                key={bIdx}
                style={{
                  border: 'none',
                  borderTop: '1px solid var(--border-color)',
                  margin: 'var(--space-6) 0',
                }}
              />
            );
          }

          if (block.type === 'code') {
            return (
              <div key={bIdx} style={{ margin: 'var(--space-4) 0' }}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {block.raw}
                </ReactMarkdown>
              </div>
            );
          }

          if (block.type === 'heading') {
            const sentence = block.sentences[0];
            const isActive = sentence && activeSentenceIndex === sentence.index && playbackState.isPlaying;
            const level = Math.min(6, Math.max(1, block.headingLevel || 2));
            const headingTag = `h${level}`;

            const headingContent = sentence ? (
              <span
                id={`reader-sentence-${sentence.index}`}
                onClick={() => handleSentenceClick(sentence.index)}
                className={`ereader-sentence ${isActive ? 'ereader-sentence-active' : ''}`}
                title="Click to start reading here (Adobe Read Aloud)"
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
                className: 'ereader-block-heading',
                style: { position: 'relative' },
              },
              headingContent
            );
          }

          if (block.type === 'list') {
            return (
              <ul key={bIdx} className="ereader-block-list">
                {block.sentences.map((sentence) => {
                  const isActive = activeSentenceIndex === sentence.index && playbackState.isPlaying;
                  const itemContent = sentence.raw.replace(/^[-*+]\s+|\d+\.\s+/, '');

                  return (
                    <li key={sentence.index} style={{ marginBottom: '6px' }}>
                      <span
                        id={`reader-sentence-${sentence.index}`}
                        onClick={() => handleSentenceClick(sentence.index)}
                        className={`ereader-sentence ${isActive ? 'ereader-sentence-active' : ''}`}
                        title="Click to start reading here (Adobe Read Aloud)"
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{ p: ({ children }) => <>{children}</> }}
                        >
                          {itemContent}
                        </ReactMarkdown>
                      </span>
                    </li>
                  );
                })}
              </ul>
            );
          }

          if (block.type === 'blockquote') {
            return (
              <blockquote key={bIdx} className="ereader-block-quote">
                {block.sentences.map((sentence) => {
                  const isActive = activeSentenceIndex === sentence.index && playbackState.isPlaying;
                  const quoteContent = sentence.raw.replace(/^>\s*/, '');

                  return (
                    <span
                      key={sentence.index}
                      id={`reader-sentence-${sentence.index}`}
                      onClick={() => handleSentenceClick(sentence.index)}
                      className={`ereader-sentence ${isActive ? 'ereader-sentence-active' : ''}`}
                      title="Click to start reading here (Adobe Read Aloud)"
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{ p: ({ children }) => <>{children}</> }}
                      >
                        {quoteContent}
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
                    title="Click to start reading here (Adobe Read Aloud)"
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
    </div>
  );
}
