/* ===================================================================
   AXONPASS — Universal Document Reader & Audio-Guided E-Reader
   Dual-Mode: Review Manual Chapters + Master Ingested Vault Documents
   Native Read Aloud Speech Engine | 100% Free Tier Compliant
   =================================================================== */

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useLessonProgressStore } from '../../stores/lessonProgressStore';
import type { StudyMaterial, DocumentIngestionRecord } from '../../types';
import AudioReaderPlayer from './AudioReaderPlayer';

interface DocumentReaderProps {
  materials: StudyMaterial[];
  vaultDocuments?: DocumentIngestionRecord[];
  activeMaterialId?: string | null;
  onSelectMaterial: (material: StudyMaterial) => void;
  onPracticeChapter?: (domainId: string) => void;
  onClose?: () => void;
}

export const DocumentReader: React.FC<DocumentReaderProps> = ({
  materials,
  vaultDocuments = [],
  activeMaterialId,
  onSelectMaterial,
  onPracticeChapter,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'chapters' | 'vault'>('chapters');
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isTocDrawerOpen, setIsTocDrawerOpen] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [vaultSearch, setVaultSearch] = useState('');

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

  // Filter vault documents
  const filteredVault = vaultDocuments.filter((doc) => {
    if (!vaultSearch) return true;
    const q = vaultSearch.toLowerCase();
    return (
      doc.file_name.toLowerCase().includes(q) ||
      doc.file_format.toLowerCase().includes(q) ||
      (doc.certification_name && doc.certification_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="ereader-container">
      {/* 0. Top Mode Selector: Chapters vs Ingested Vault */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-2) var(--space-4)',
          backgroundColor: 'var(--color-bg-subtle)',
          borderBottom: '1px solid var(--border-color)',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('chapters')}
            className={`btn btn-sm ${activeTab === 'chapters' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>📖</span> Review Manual Chapters ({materials.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vault')}
            className={`btn btn-sm ${activeTab === 'vault' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>📂</span> Master Ingested Vault ({vaultDocuments.length})
          </button>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: 'var(--space-1) var(--space-3)', fontSize: 'var(--text-xs)' }}
          >
            ← Back to Syllabus
          </button>
        )}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: REVIEW MANUAL CHAPTERS & NATIVE AUDIO READER            */}
      {/* ============================================================== */}
      {activeTab === 'chapters' && (
        <>
          {/* Top Bar for Chapter Mode */}
          <div className="ereader-topbar">
            <div className="ereader-topbar-left">
              <div style={{ minWidth: 0 }}>
                <div className="ereader-meta-badge">
                  📖 {selectedMaterial?.document_title || 'Review Manual'} • {selectedMaterial?.edition || 'Official Edition'}
                </div>
                <h2 className="ereader-title">
                  {selectedMaterial?.title || 'Select a Chapter'}
                </h2>
              </div>
            </div>

            {/* Top Controls: Audio, Completion, Font Sizer */}
            <div className="ereader-controls">
              <button
                onClick={() => setShowAudioPlayer(!showAudioPlayer)}
                className={`btn btn-sm ${showAudioPlayer ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}
                title="Read Aloud & Audio on the Go (Native Web Speech API)"
              >
                <span>🎧 {showAudioPlayer ? 'Hide Audio' : 'Listen Aloud'}</span>
              </button>

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

              {onPracticeChapter && selectedMaterial?.domain_id && (
                <button
                  onClick={() => onPracticeChapter(selectedMaterial.domain_id!)}
                  className="btn btn-primary btn-sm"
                >
                  ⚡ Practice
                </button>
              )}
            </div>
          </div>

          {/* Swipeable / Horizontal Quick Chapter Selector Bar */}
          <div className="ereader-pills-bar">
            {materials.map((m) => {
              const isSelected = selectedMaterial?.id === m.id;
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

          {/* Main 2-Column Reader Layout */}
          <div className="ereader-layout">
            {/* Left TOC Sidebar (Desktop) */}
            <aside className="ereader-sidebar desktop-only">
              <div className="ereader-sidebar-header">
                <span>Review Manual Chapters</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>
                  {currentIndex + 1} / {materials.length}
                </span>
              </div>

              <div className="ereader-sidebar-list">
                {materials.map((m) => {
                  const isSelected = selectedMaterial?.id === m.id;
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
              {selectedMaterial ? (
                <div className={`ereader-content-box font-${fontSize}`}>
                  {/* Live Read Aloud Audio Player Toolbar */}
                  {showAudioPlayer && selectedMaterial.content_body && (
                    <AudioReaderPlayer
                      contentMarkdown={selectedMaterial.content_body}
                      chapterTitle={selectedMaterial.title}
                      onNextChapter={handleNext}
                      onPrevChapter={handlePrev}
                    />
                  )}

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
                        💡 AUTHORITATIVE EXAM WATCH ALERT
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

                  {/* Bottom Chapter Pager */}
                  <div className="ereader-pager">
                    <button
                      onClick={handlePrev}
                      disabled={currentIndex <= 0}
                      className="btn btn-secondary btn-sm"
                    >
                      ← Previous Chapter
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentIndex >= materials.length - 1}
                      className="btn btn-primary btn-sm"
                    >
                      Next Chapter →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
                  <p className="text-muted">Select a chapter from the list to begin reading.</p>
                </div>
              )}
            </main>
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* TAB 2: MASTER INGESTED DOCUMENTS & BOOKS VAULT                 */}
      {/* ============================================================== */}
      {activeTab === 'vault' && (
        <div style={{ padding: 'var(--space-5)', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>
                📂 Master Ingested Documents &amp; Books Vault
              </h3>
              <p className="text-muted" style={{ fontSize: 'var(--text-xs)', margin: '4px 0 0 0' }}>
                Official review manuals, syllabus blueprints, and reference books ingested and verified in Supabase Storage.
              </p>
            </div>

            <div style={{ minWidth: '260px', flex: 1, maxWidth: '400px' }}>
              <input
                type="text"
                className="input input-sm"
                style={{ width: '100%' }}
                placeholder="🔍 Search documents, manuals, or file names..."
                value={vaultSearch}
                onChange={(e) => setVaultSearch(e.target.value)}
              />
            </div>
          </div>

          {filteredVault.length === 0 ? (
            <div className="card text-center" style={{ padding: 'var(--space-12)' }}>
              <span style={{ fontSize: '2rem' }}>📭</span>
              <p className="text-muted" style={{ marginTop: 'var(--space-2)' }}>
                {vaultSearch ? 'No matching documents found in vault.' : 'No ingested documents recorded for this track.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-3)' }}>
              {filteredVault.map((doc) => {
                const sizeMb = (doc.file_size_bytes / (1024 * 1024)).toFixed(2);
                const isChunked = doc.cloud_storage_status.includes('split');
                const extUpper = (doc.file_format || '.PDF').replace('.', '').toUpperCase();

                return (
                  <div
                    key={doc.id}
                    className="card"
                    style={{
                      padding: 'var(--space-4)',
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div>
                      {/* Top Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', gap: '4px' }}>
                        <span className="badge badge-primary font-bold" style={{ fontSize: '10px' }}>
                          📄 {extUpper}
                        </span>
                        <span className="badge badge-success" style={{ fontSize: '10px' }}>
                          ✓ Ingested &amp; Stored
                        </span>
                      </div>

                      {/* File Name */}
                      <h4
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'bold',
                          color: 'var(--color-ink)',
                          margin: '0 0 var(--space-2) 0',
                          lineHeight: 1.4,
                          wordBreak: 'break-word',
                        }}
                      >
                        {doc.file_name}
                      </h4>

                      {/* Ingestion Intelligence Metadata */}
                      <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>
                        <div>
                          📏 <strong>Size:</strong> {sizeMb} MB {isChunked && '(Composite Cloud Parts)'}
                        </div>
                        <div>
                          🧠 <strong>Semantic Chunks:</strong> ~{doc.extracted_chunks_count || 15}
                        </div>
                        <div>
                          📝 <strong>Estimated Tokens:</strong> ~{(doc.extracted_tokens_count || 5000).toLocaleString()}
                        </div>
                        {doc.verification_hash && (
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                            🔒 <strong>SHA256:</strong> {doc.verification_hash.slice(0, 16)}...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Storage Access Button */}
                    <div style={{ paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border-color)' }}>
                      {doc.public_url ? (
                        <a
                          href={doc.public_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-primary"
                          style={{
                            width: '100%',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            fontWeight: 'bold',
                            fontSize: 'var(--text-xs)',
                            textDecoration: 'none',
                          }}
                        >
                          <span>📥</span> Open &amp; Read in Storage
                        </a>
                      ) : (
                        <span className="text-muted" style={{ fontSize: '11px' }}>
                          Local Ingestion Only
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
