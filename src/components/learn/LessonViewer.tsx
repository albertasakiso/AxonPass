/* ===================================================================
   APILIGU LEARNING PASS — Enhanced Lesson Viewer Modal
   Features:
   - Mark as Completed (✓) / Needs Relearning (🔄)
   - Sequential Submodule Navigation (← Previous / Next →)
   - Submodule progress tracking & exam alerts
   - Instant 10-Q topic practice launcher
   =================================================================== */

import React, { useState, useEffect } from 'react';
import { useLessonProgressStore } from '../../stores/lessonProgressStore';
import { speechEngine } from '../../lib/audio/speechEngine';
import AdobeContentReader from './AdobeContentReader';
import type { Subtopic, Topic, Domain } from '../../types';

interface LessonViewerProps {
  subtopic: Subtopic;
  topic?: Topic | null;
  domain?: Domain | null;
  allSubtopics?: Subtopic[];
  onClose: () => void;
  onSelectSubtopic?: (subtopic: Subtopic) => void;
  onPracticeTopic?: (topicId: string) => void;
  onPracticeSection?: (subtopic: Subtopic, topic?: Topic | null) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  subtopic,
  topic,
  domain,
  allSubtopics = [],
  onClose,
  onSelectSubtopic,
  onPracticeTopic,
  onPracticeSection,
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

  // Stop speech when closing lesson modal
  useEffect(() => {
    return () => {
      speechEngine.stop();
    };
  }, []);

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
    <div className="lesson-fullscreen-page animate-fade-in" role="region" aria-label="Lesson Content Reader">
      {/* Top Header Bar */}
      <div className="lesson-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1, minWidth: '240px' }}>
          {/* Back to Syllabus / Course Outline button */}
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}
            title="Return to Course Syllabus"
          >
            <span>←</span>
            <span>Syllabus</span>
          </button>

          {/* Breadcrumb Hierarchy */}
          <div className="lesson-breadcrumb">
            <span className="lesson-breadcrumb-item">{domain ? `Domain ${domain.domain_number}` : 'Module'}</span>
            <span>›</span>
            {topic && (
              <>
                <span className="lesson-breadcrumb-item">{topic.topic_code}</span>
                <span>›</span>
              </>
            )}
            <span className="lesson-breadcrumb-active">{subtopic.subtopic_code} {subtopic.name}</span>
          </div>
        </div>

        {/* Top Actions: Counter, Complete, Relearn, Close */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {allSubtopics.length > 0 && (
            <span className="desktop-only" style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-primary)', marginRight: 'var(--space-2)' }}>
              Lesson {currentIndex + 1} of {allSubtopics.length}
            </span>
          )}

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
            <span>{isCompleted ? '✓ Completed' : 'Mark Complete'}</span>
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
            <span className="desktop-only">{isRelearn ? 'Needs Relearning' : 'Relearn'}</span>
          </button>

          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ minHeight: '32px', width: '32px', padding: 0, borderRadius: 'var(--radius-full)' }}
            title="Return to Syllabus (Esc)"
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

      {/* Scrollable Full-Page Lesson Body */}
      <div className="lesson-page-body">
        <div className="lesson-page-container">
          {/* Subtopic Header Banner */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <div className="ereader-meta-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <span>{domain ? `Domain ${domain.domain_number}: ${domain.name}` : 'Module'}</span>
              <span>•</span>
              <span>{topic ? `Section ${topic.topic_code}` : ''}</span>
              <span>•</span>
              <span>⏱ {subtopic.estimated_read_minutes || 15} min read</span>
            </div>
            <h1 className="ereader-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', margin: 0 }}>
              <span className="topic-code-tag" style={{ fontSize: 'var(--text-base)' }}>{subtopic.subtopic_code}</span>
              <span>{subtopic.name}</span>
            </h1>
          </div>
          
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

          {/* Main Markdown Text with Adobe-Style Read Aloud */}
          <div className="ereader-prose font-normal">
            <AdobeContentReader
              contentMarkdown={subtopic.content_body || 'No detailed content body available for this subtopic.'}
              chapterTitle={`${subtopic.subtopic_code} — ${subtopic.name}`}
              showAudioControlsInitially={false}
            />
          </div>

          {/* Section Practice Callout Banner */}
          <div
            className="card mt-6 mb-2"
            style={{
              padding: 'var(--space-4) var(--space-5)',
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--border-color)',
              borderLeft: '4px solid var(--color-primary)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ fontSize: '1.1rem' }}>🎯</span>
                <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--color-ink)' }}>
                  Finished reading {subtopic.subtopic_code}?
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                Lock in your knowledge with 10 questions focused <strong>exclusively</strong> on {subtopic.name}.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onPracticeSection) {
                  onPracticeSection(subtopic, topic);
                } else if (onPracticeTopic && topic) {
                  onPracticeTopic(topic.id);
                }
              }}
              className="btn btn-primary btn-sm"
              style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
            >
              ⚡ Practice This Section Questions (10Q)
            </button>
          </div>
        </div>
      </div>

      {/* Footer Actions & Sequential Navigation */}
      <div className="lesson-page-footer">
        
        {/* Left: Previous Lesson Navigation */}
        <div>
          {prevSubtopic ? (
            <button
              onClick={() => onSelectSubtopic && onSelectSubtopic(prevSubtopic)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              <span>←</span>
              <span className="desktop-only">{prevSubtopic.subtopic_code} {prevSubtopic.name.slice(0, 24)}...</span>
              <span className="mobile-only">Prev</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              <span>←</span>
              <span>Back to Syllabus</span>
            </button>
          )}
        </div>

        {/* Center: Topic / Section Practice Launcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {(onPracticeSection || (onPracticeTopic && topic)) && (
            <button
              onClick={() => {
                if (onPracticeSection) {
                  onPracticeSection(subtopic, topic);
                } else if (onPracticeTopic && topic) {
                  onPracticeTopic(topic.id);
                }
              }}
              className="btn btn-primary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 'bold',
              }}
            >
              ⚡ Practice Section {subtopic.subtopic_code}
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
              <span className="desktop-only">{nextSubtopic.subtopic_code} {nextSubtopic.name.slice(0, 24)}...</span>
              <span className="mobile-only">Next</span>
              <span>→</span>
            </button>
          ) : (
            <button
              onClick={handleToggleComplete}
              className="btn btn-success btn-sm"
            >
              {isCompleted ? '✓ Completed' : '✓ Mark Done & Finish'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
