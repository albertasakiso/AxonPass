/* ===================================================================
   APILIGU LEARNING PASS — Enhanced Lesson Viewer Modal
   Features:
   - Mark as Completed (✓) / Needs Relearning (🔄)
   - Sequential Submodule Navigation (← Previous / Next →)
   - Submodule progress tracking & exam alerts
   - Instant 10-Q topic practice launcher
   =================================================================== */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useLessonProgressStore } from '../../stores/lessonProgressStore';
import type { Subtopic, Topic, Domain } from '../../types';

interface LessonViewerProps {
  subtopic: Subtopic;
  topic?: Topic | null;
  domain?: Domain | null;
  allSubtopics?: Subtopic[];
  onClose: () => void;
  onSelectSubtopic?: (subtopic: Subtopic) => void;
  onPracticeTopic?: (topicId: string) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  subtopic,
  topic,
  domain,
  allSubtopics = [],
  onClose,
  onSelectSubtopic,
  onPracticeTopic,
}) => {
  const {
    toggleSubtopicComplete,
    toggleSubtopicRelearn,
    isSubtopicCompleted,
    isSubtopicRelearn,
  } = useLessonProgressStore();

  const isCompleted = isSubtopicCompleted(subtopic.id);
  const isRelearn = isSubtopicRelearn(subtopic.id);
  const [justCelebrated, setJustCelebrated] = useState(false);

  // Find index in sequence of all subtopics
  const currentIndex = allSubtopics.findIndex(s => s.id === subtopic.id);
  const prevSubtopic = currentIndex > 0 ? allSubtopics[currentIndex - 1] : null;
  const nextSubtopic = currentIndex >= 0 && currentIndex < allSubtopics.length - 1 ? allSubtopics[currentIndex + 1] : null;

  const handleToggleComplete = () => {
    const nowDone = toggleSubtopicComplete(subtopic.id);
    if (nowDone) {
      setJustCelebrated(true);
      setTimeout(() => setJustCelebrated(false), 2500);
    }
  };

  const handleToggleRelearn = () => {
    toggleSubtopicRelearn(subtopic.id);
  };

  return (
    <div className="reader-modal-overlay animate-fade-in" onClick={onClose}>
      <div className="reader-modal-dialog" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Header Bar */}
        <div className="reader-modal-header" style={{ flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div className="ereader-meta-badge" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span>{domain ? `Domain ${domain.domain_number}: ${domain.name}` : 'Module'}</span>
              <span>•</span>
              <span>{topic ? `Section ${topic.topic_code}` : ''}</span>
              <span>•</span>
              <span>⏱ {subtopic.estimated_read_minutes || 15} min read</span>
              {allSubtopics.length > 0 && (
                <>
                  <span>•</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    Lesson {currentIndex + 1} of {allSubtopics.length}
                  </span>
                </>
              )}
            </div>

            <h2 className="ereader-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
              <span className="topic-code-tag" style={{ fontSize: 'var(--text-sm)' }}>{subtopic.subtopic_code}</span>
              <span>{subtopic.name}</span>
            </h2>
          </div>

          {/* Top Actions: Complete, Relearn, Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            
            {/* Mark as Completed Button */}
            <button
              onClick={handleToggleComplete}
              className={`btn btn-sm ${isCompleted ? 'btn-success' : 'btn-secondary'}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 'bold',
                fontSize: 'var(--text-xs)',
                backgroundColor: isCompleted ? 'var(--color-success)' : undefined,
                color: isCompleted ? '#fff' : undefined,
              }}
              title={isCompleted ? 'Completed (Tap to undo)' : 'Mark lesson as completed'}
            >
              <span>{isCompleted ? '✓ Completed' : 'Mark as Complete'}</span>
            </button>

            {/* Relearn Flag Button */}
            <button
              onClick={handleToggleRelearn}
              className={`btn btn-sm ${isRelearn ? 'btn-warning' : 'btn-secondary'}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: 'var(--text-xs)',
                backgroundColor: isRelearn ? '#f59e0b' : undefined,
                color: isRelearn ? '#fff' : undefined,
                borderColor: isRelearn ? '#d97706' : undefined,
              }}
              title="Flag this submodule for repeat study"
            >
              <span>🔄</span>
              <span>{isRelearn ? 'Needs Relearning' : 'Relearn'}</span>
            </button>

            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ minHeight: '36px', width: '36px', padding: 0, borderRadius: 'var(--radius-full)' }}
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Lesson Progress Bar */}
        {allSubtopics.length > 0 && (
          <div style={{ width: '100%', height: '3px', backgroundColor: 'var(--color-bg-muted)' }}>
            <div
              style={{
                height: '100%',
                backgroundColor: isCompleted ? 'var(--color-success)' : 'var(--color-primary)',
                width: `${Math.round(((currentIndex + 1) / allSubtopics.length) * 100)}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        )}

        {/* Scrollable Lesson Body */}
        <div className="reader-modal-body">
          
          {/* Celebration Banner when just completed */}
          {justCelebrated && (
            <div
              className="animate-fade-in mb-4 p-3"
              style={{
                backgroundColor: '#dcfce7',
                border: '1px solid #86efac',
                borderRadius: 'var(--radius-lg)',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'bold',
              }}
            >
              <span>🎉</span>
              <span>Great job! Submodule {subtopic.subtopic_code} marked as completed.</span>
            </div>
          )}

          {/* Learning Objectives Callout */}
          {subtopic.learning_objectives && (
            <div className="callout-box callout-objectives">
              <div className="callout-title">
                🎯 Learning Objectives
              </div>
              <p className="callout-content">{subtopic.learning_objectives}</p>
            </div>
          )}

          {/* Exam Tips Callout */}
          {subtopic.exam_tips && (
            <div className="callout-box callout-exam-alert">
              <div className="callout-title">
                💡 ISACA / Exam Watch Alert
              </div>
              <p className="callout-content">{subtopic.exam_tips}</p>
            </div>
          )}

          {/* Key Terms Chips */}
          {subtopic.key_terms && subtopic.key_terms.length > 0 && (
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', textTransform: 'uppercase', color: 'var(--color-ink-muted)', marginBottom: 'var(--space-2)' }}>
                Key Vocabulary &amp; Terms:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                {subtopic.key_terms.map((term, i) => (
                  <span key={i} className="term-chip">
                    🏷️ {term}
                  </span>
                ))}
              </div>
            </div>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-bg-muted)', margin: 'var(--space-6) 0' }} />

          {/* Main Markdown Text */}
          <div className="ereader-prose font-normal">
            {subtopic.content_body ? (
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                {subtopic.content_body}
              </ReactMarkdown>
            ) : (
              <p className="text-muted" style={{ fontStyle: 'italic' }}>
                No detailed content body available for this subtopic.
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions & Sequential Navigation */}
        <div className="reader-modal-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          
          {/* Left: Previous Lesson Navigation */}
          <div>
            {prevSubtopic ? (
              <button
                onClick={() => onSelectSubtopic && onSelectSubtopic(prevSubtopic)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                <span>←</span>
                <span className="desktop-only">{prevSubtopic.subtopic_code} {prevSubtopic.name.slice(0, 20)}...</span>
                <span className="mobile-only">Prev</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
            )}
          </div>

          {/* Center: Topic Practice Launcher & Relearn status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {onPracticeTopic && topic && (
              <button
                onClick={() => onPracticeTopic(topic.id)}
                className="btn btn-secondary btn-sm"
                style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)', borderColor: 'var(--color-primary-200)' }}
              >
                ⚡ Practice Section {topic.topic_code}
              </button>
            )}
          </div>

          {/* Right: Next Lesson Navigation */}
          <div>
            {nextSubtopic ? (
              <button
                onClick={() => onSelectSubtopic && onSelectSubtopic(nextSubtopic)}
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                <span className="desktop-only">{nextSubtopic.subtopic_code} {nextSubtopic.name.slice(0, 20)}...</span>
                <span className="mobile-only">Next</span>
                <span>→</span>
              </button>
            ) : (
              <button
                onClick={handleToggleComplete}
                className="btn btn-success btn-sm"
              >
                {isCompleted ? '✓ All Done' : '✓ Mark Done & Finish'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
