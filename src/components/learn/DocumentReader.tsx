import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useLessonProgressStore } from '../../stores/lessonProgressStore';
import type { StudyMaterial } from '../../types';

interface DocumentReaderProps {
  materials: StudyMaterial[];
  activeMaterialId?: string | null;
  onSelectMaterial: (material: StudyMaterial) => void;
  onPracticeChapter?: (domainId: string) => void;
  onClose?: () => void;
}

export const DocumentReader: React.FC<DocumentReaderProps> = ({
  materials,
  activeMaterialId,
  onSelectMaterial,
  onPracticeChapter,
  onClose,
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isTocDrawerOpen, setIsTocDrawerOpen] = useState(false);

  const { toggleChapterComplete, isChapterCompleted } = useLessonProgressStore();

  useEffect(() => {
    if (activeMaterialId) {
      const found = materials.find((m) => m.id === activeMaterialId);
      if (found) setSelectedMaterial(found);
    } else if (materials.length > 0 && !selectedMaterial) {
      setSelectedMaterial(materials[0]);
    }
  }, [activeMaterialId, materials, selectedMaterial]);

  const currentIndex = selectedMaterial
    ? materials.findIndex((m) => m.id === selectedMaterial.id)
    : -1;

  const isCompleted = selectedMaterial ? isChapterCompleted(selectedMaterial.chapter_number ?? 0) : false;

  const handleSelect = (m: StudyMaterial) => {
    setSelectedMaterial(m);
    onSelectMaterial(m);
    setIsTocDrawerOpen(false);
    // Smooth scroll to top of reader
    const stage = document.querySelector('.ereader-main-stage');
    if (stage) stage.scrollTop = 0;
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      handleSelect(materials[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < materials.length - 1) {
      handleSelect(materials[currentIndex + 1]);
    }
  };

  if (!selectedMaterial) {
    return (
      <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
        <p className="text-muted">No document or manual chapters available for this track.</p>
      </div>
    );
  }

  return (
    <div className="ereader-container">
      
      {/* 1. Mobile & Desktop Top Navigation Bar */}
      <div className="ereader-topbar">
        <div className="ereader-topbar-left">
          {onClose && (
            <button
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ padding: 'var(--space-1) var(--space-3)' }}
            >
              ← Back
            </button>
          )}
          <div style={{ minWidth: 0 }}>
            <div className="ereader-meta-badge">
              📖 {selectedMaterial.document_title || 'Review Manual'} • {selectedMaterial.edition || '28th Ed.'}
            </div>
            <h2 className="ereader-title">
              {selectedMaterial.title}
            </h2>
          </div>
        </div>

        {/* Top Controls: Complete Toggle, Font Sizer & Practice Button */}
        <div className="ereader-controls">
          <button
            onClick={() => selectedMaterial && toggleChapterComplete(selectedMaterial.chapter_number ?? 0)}
            className={`btn btn-sm ${isCompleted ? 'btn-success' : 'btn-secondary'}`}
            style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}
            title={isCompleted ? 'Completed (Tap to undo)' : 'Mark chapter as completed'}
          >
            <span>{isCompleted ? '✓ Completed' : 'Mark as Complete'}</span>
          </button>

          <button
            onClick={() => setIsTocDrawerOpen(!isTocDrawerOpen)}
            className="btn btn-secondary btn-sm mobile-only"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <span>📑</span>
            <span>Ch. {currentIndex + 1}/{materials.length}</span>
          </button>

          <div className="font-size-group desktop-only">
            <button
              onClick={() => setFontSize('normal')}
              className={`font-size-btn ${fontSize === 'normal' ? 'active' : ''}`}
              title="Standard Font Size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`font-size-btn ${fontSize === 'large' ? 'active' : ''}`}
              title="Large Font Size"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`font-size-btn ${fontSize === 'xlarge' ? 'active' : ''}`}
              title="Extra Large Font Size"
            >
              A++
            </button>
          </div>

          {onPracticeChapter && selectedMaterial.domain_id && (
            <button
              onClick={() => onPracticeChapter(selectedMaterial.domain_id)}
              className="btn btn-primary btn-sm"
            >
              ⚡ Practice
            </button>
          )}
        </div>
      </div>

      {/* 2. Swipeable / Horizontal Quick Chapter Selector (Mobile-First Bar) */}
      <div className="ereader-pills-bar">
        {materials.map((m) => {
          const isSelected = m.id === selectedMaterial.id;
          const chapterDone = isChapterCompleted(m.chapter_number ?? 0);
          const label = m.chapter_number === 0 
            ? 'Ch. 0 Blueprint & Gap' 
            : `Ch. ${m.chapter_number} Domain ${m.chapter_number}`;
          return (
            <button
              key={m.id}
              onClick={() => handleSelect(m)}
              className={`ereader-pill-tab ${isSelected ? 'active' : ''}`}
            >
              <span className="pill-num">{chapterDone ? '✓ ' : ''}Chapter {m.chapter_number}</span>
              <span className="pill-title">{label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main 2-Column Layout */}
      <div className="ereader-layout">
        
        {/* Left TOC Sidebar (Visible on Desktop >= 992px) */}
        <aside className="ereader-sidebar desktop-only">
          <div className="ereader-sidebar-header">
            <span>Review Manual Chapters</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>
              {currentIndex + 1} / {materials.length}
            </span>
          </div>

          <div className="ereader-sidebar-list">
            {materials.map((m) => {
              const isSelected = m.id === selectedMaterial.id;
              const chapterDone = isChapterCompleted(m.chapter_number ?? 0);
              return (
                <div
                  key={m.id}
                  onClick={() => handleSelect(m)}
                  className={`ereader-chapter-card ${isSelected ? 'active' : ''}`}
                >
                  <div className="ereader-chapter-header">
                    <span className="ereader-chapter-code" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {chapterDone && <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span>}
                      <span>{m.chapter_number === 0 ? 'Blueprint & Gap' : `Domain ${m.chapter_number}`}</span>
                    </span>
                    <span className="ereader-chapter-time">
                      ⏱ {m.estimated_read_minutes || 45}m
                    </span>
                  </div>
                  <h4 className="ereader-chapter-title">
                    {m.title}
                  </h4>
                  {m.page_start && m.page_end && (
                    <div className="ereader-chapter-pages">
                      Pages {m.page_start}–{m.page_end}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Center Main Stage Reader */}
        <main className="ereader-main-stage">
          <div className={`ereader-content-box font-${fontSize}`}>
            
            {/* Chapter Takeaways Alert Box */}
            {selectedMaterial.key_takeaways && (
              <div className="callout-box callout-objectives" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="callout-title">
                  🎯 CHAPTER CORE OBJECTIVES &amp; TAKEAWAYS
                </div>
                <p className="callout-content">{selectedMaterial.key_takeaways}</p>
              </div>
            )}

            {/* Exam Alert Watch Box */}
            {selectedMaterial.exam_tips && (
              <div className="callout-box callout-exam-alert" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="callout-title">
                  💡 ISACA / EXAM WATCH ALERT
                </div>
                <p className="callout-content">{selectedMaterial.exam_tips}</p>
              </div>
            )}

            {/* Chapter Markdown Prose */}
            <div className="ereader-prose">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                {selectedMaterial.content_body || ''}
              </ReactMarkdown>
            </div>

            {/* Bottom Chapter Navigation Footer */}
            <div className="ereader-footer-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-12)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-border)' }}>
              <button
                disabled={currentIndex <= 0}
                onClick={handlePrev}
                className="btn btn-secondary btn-sm"
              >
                ← Prev Chapter
              </button>

              <button
                onClick={() => selectedMaterial && toggleChapterComplete(selectedMaterial.chapter_number ?? 0)}
                className={`btn btn-sm ${isCompleted ? 'btn-success' : 'btn-secondary'}`}
              >
                {isCompleted ? '✓ Chapter Completed' : '✓ Mark as Complete'}
              </button>

              <button
                disabled={currentIndex >= materials.length - 1}
                onClick={handleNext}
                className="btn btn-primary btn-sm"
              >
                Next Chapter →
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* 4. Mobile TOC Bottom-Sheet Drawer */}
      {isTocDrawerOpen && (
        <div className="modal-backdrop animate-fade-in mobile-only" onClick={() => setIsTocDrawerOpen(false)}>
          <div className="mobile-sheet-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-sheet-header">
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', margin: 0 }}>
                📑 Select Chapter
              </h3>
              <button
                onClick={() => setIsTocDrawerOpen(false)}
                className="btn btn-secondary btn-sm"
                style={{ width: '32px', height: '32px', padding: 0, borderRadius: 'var(--radius-full)' }}
              >
                ✕
              </button>
            </div>

            <div className="mobile-sheet-body">
              {materials.map((m) => {
                const isSelected = m.id === selectedMaterial.id;
                const chapterDone = isChapterCompleted(m.chapter_number ?? 0);
                return (
                  <div
                    key={m.id}
                    onClick={() => handleSelect(m)}
                    className={`ereader-chapter-card ${isSelected ? 'active' : ''}`}
                    style={{ marginBottom: 'var(--space-2)' }}
                  >
                    <div className="ereader-chapter-header">
                      <span className="ereader-chapter-code">
                        {chapterDone && '✓ '}{m.chapter_number === 0 ? 'Blueprint & Gap' : `Domain ${m.chapter_number}`}
                      </span>
                      <span className="ereader-chapter-time">
                        ⏱ {m.estimated_read_minutes || 45}m
                      </span>
                    </div>
                    <h4 className="ereader-chapter-title">
                      {m.title}
                    </h4>
                    {m.page_start && m.page_end && (
                      <div className="ereader-chapter-pages">
                        Pages {m.page_start}–{m.page_end}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

