/* ===================================================================
   AXONPASS — Universal Document Reader & Audio-Guided E-Reader
   Dual-Mode: Review Manual Chapters + Master Ingested Vault Documents
   Native Read Aloud Speech Engine | In-App PDF Viewer | 100% Free Tier
   =================================================================== */

import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useLessonProgressStore } from '../../stores/lessonProgressStore';
import type { StudyMaterial, DocumentIngestionRecord, Topic, Subtopic, Domain } from '../../types';
import AudioReaderPlayer from './AudioReaderPlayer';

/**
 * Format raw storage filenames into clean, human-friendly titles.
 * Example: "CISA_Review_Manual_27th_Edition_English.part_1" -> "CISA Review Manual (27th Edition) — Part 1"
 */
export function formatCleanDocumentTitle(fileName: string): string {
  if (!fileName) return 'Study Material';
  let clean = fileName;

  // Detect .part_N
  let partSuffix = '';
  const partMatch = clean.match(/\.part_(\d+)$/i);
  if (partMatch) {
    partSuffix = ` — Part ${partMatch[1]}`;
    clean = clean.replace(/\.part_\d+$/i, '');
  }

  // Remove common extensions (.pdf, .epub, .docx, .txt)
  clean = clean.replace(/\.(pdf|epub|docx|txt|doc|md)$/i, '');

  // Remove timestamp or uuid prefixes like 1738291823_ or uuid_
  clean = clean.replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[_-]?/i, '');
  clean = clean.replace(/^\d{10,}[_-]?/, '');

  // Replace underscores and multiple dashes with spaces
  clean = clean.replace(/[_-]+/g, ' ').trim();

  // Acronym standardizations
  const acronyms = [
    'CISA', 'CISSP', 'ISC2', 'CC', 'AWS', 'SAA', 'C03', 'NIST', 'CRISC',
    'CISM', 'GRC', 'FIFA', 'SOC', 'ITAF', 'ISO', 'IEC', 'CSF', 'RMF',
    'PMP', 'BIA', 'BCP', 'DRP', 'CIA', 'IAM', 'RBAC', 'AI', 'COBIT',
    'IRP', 'DR', 'BC', 'CBK', 'DLP', 'CYSA', 'CCSP', 'CGEIT'
  ];

  const words = clean.split(' ').map((w) => {
    const upper = w.toUpperCase();
    if (acronyms.includes(upper)) return upper;
    if (w.length <= 3 && !['and', 'for', 'the', 'of', 'in', 'to', 'on', 'at', 'by', 'vs', 'with'].includes(w.toLowerCase())) {
      return upper;
    }
    // Capitalize first letter
    return w.charAt(0).toUpperCase() + w.slice(1);
  });

  return words.join(' ') + partSuffix;
}

interface DocumentReaderProps {
  materials: StudyMaterial[];
  vaultDocuments?: DocumentIngestionRecord[];
  allTopics?: Topic[];
  allSubtopics?: Subtopic[];
  domains?: Domain[];
  activeCertificationSlug?: string;
  activeMaterialId?: string | null;
  onSelectMaterial: (material: StudyMaterial) => void;
  onPracticeSection?: (subtopic: Subtopic, topic?: Topic | null) => void;
  onPracticeChapter?: (domainId: string) => void;
  onClose?: () => void;
}

export const DocumentReader: React.FC<DocumentReaderProps> = ({
  materials,
  vaultDocuments = [],
  allTopics = [],
  allSubtopics = [],
  domains = [],
  activeCertificationSlug = 'cisa',
  activeMaterialId,
  onSelectMaterial,
  onPracticeSection,
  onPracticeChapter,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'chapters' | 'subtopics' | 'vault'>('chapters');
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isTocDrawerOpen, setIsTocDrawerOpen] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  
  // Vault state
  const [vaultSearch, setVaultSearch] = useState('');
  const [selectedVaultCert, setSelectedVaultCert] = useState<string>('all');
  const [viewingVaultDoc, setViewingVaultDoc] = useState<DocumentIngestionRecord | null>(null);

  // Manuals filter (for certifications with multiple textbooks/editions)
  const distinctManualTitles = useMemo(() => {
    return Array.from(new Set(materials.map((m) => m.document_title).filter(Boolean))) as string[];
  }, [materials]);

  const [selectedManualFilter, setSelectedManualFilter] = useState<string>('all');

  const filteredMaterials = useMemo(() => {
    if (selectedManualFilter === 'all') return materials;
    return materials.filter((m) => m.document_title === selectedManualFilter);
  }, [materials, selectedManualFilter]);

  // Mobile detection & Viewer Mode
  const isMobile = typeof window !== 'undefined' && (
    window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
  const [viewerMode, setViewerMode] = useState<'google_docs' | 'native'>(isMobile ? 'google_docs' : 'native');

  // Auto-switch to google docs mode on mobile when opening a vault document
  useEffect(() => {
    if (viewingVaultDoc && isMobile) {
      setViewerMode('google_docs');
    }
  }, [viewingVaultDoc, isMobile]);

  const { toggleChapterComplete, isChapterCompleted } = useLessonProgressStore();

  // Initialize selected material
  useEffect(() => {
    if (activeMaterialId) {
      const found = filteredMaterials.find((m) => m.id === activeMaterialId);
      if (found) setSelectedMaterial(found);
    } else if (filteredMaterials.length > 0 && (!selectedMaterial || !filteredMaterials.some(m => m.id === selectedMaterial.id))) {
      setSelectedMaterial(filteredMaterials[0]);
    }
  }, [activeMaterialId, filteredMaterials, selectedMaterial]);

  // Initialize selected subtopic if available
  useEffect(() => {
    if (allSubtopics.length > 0 && !selectedSubtopic) {
      setSelectedSubtopic(allSubtopics[0]);
    }
  }, [allSubtopics, selectedSubtopic]);

  // Sync vault cert filter with active track
  useEffect(() => {
    if (activeCertificationSlug) {
      setSelectedVaultCert(activeCertificationSlug);
    }
  }, [activeCertificationSlug]);

  const currentIndex = selectedMaterial
    ? filteredMaterials.findIndex((m) => m.id === selectedMaterial.id)
    : -1;

  const isCompleted = selectedMaterial ? isChapterCompleted(selectedMaterial.chapter_number ?? 0) : false;

  const handleSelectMaterial = (m: StudyMaterial) => {
    setSelectedMaterial(m);
    onSelectMaterial(m);
    setIsTocDrawerOpen(false);
    const stage = document.querySelector('.ereader-main-stage');
    if (stage) stage.scrollTop = 0;
  };

  const handleSelectSubtopic = (sub: Subtopic) => {
    setSelectedSubtopic(sub);
    setIsTocDrawerOpen(false);
    const stage = document.querySelector('.ereader-main-stage');
    if (stage) stage.scrollTop = 0;
  };

  const handlePrevChapter = () => {
    if (currentIndex > 0) {
      handleSelectMaterial(filteredMaterials[currentIndex - 1]);
    }
  };

  const handleNextChapter = () => {
    if (currentIndex < filteredMaterials.length - 1) {
      handleSelectMaterial(filteredMaterials[currentIndex + 1]);
    }
  };

  // Distinct cert counts in vault
  const vaultCertCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    vaultDocuments.forEach((doc) => {
      const c = doc.certification_slug || 'other';
      counts[c] = (counts[c] || 0) + 1;
    });
    return counts;
  }, [vaultDocuments]);

  // Filter vault documents
  const filteredVault = useMemo(() => {
    return vaultDocuments.filter((doc) => {
      if (selectedVaultCert !== 'all' && doc.certification_slug !== selectedVaultCert) {
        return false;
      }
      if (!vaultSearch) return true;
      const q = vaultSearch.toLowerCase();
      const cleanTitle = formatCleanDocumentTitle(doc.file_name).toLowerCase();
      return (
        doc.file_name.toLowerCase().includes(q) ||
        cleanTitle.includes(q) ||
        doc.file_format.toLowerCase().includes(q) ||
        (doc.certification_slug && doc.certification_slug.toLowerCase().includes(q))
      );
    });
  }, [vaultDocuments, selectedVaultCert, vaultSearch]);

  // Active reading content and title
  const activeContentMarkdown = useMemo(() => {
    if (activeTab === 'subtopics' && selectedSubtopic) {
      return selectedSubtopic.content_body || `# ${selectedSubtopic.name}\n\n*No content body available for this section.*`;
    }
    return selectedMaterial?.content_body || '# Select a Chapter\n\nPlease select a chapter from the table of contents.';
  }, [activeTab, selectedSubtopic, selectedMaterial]);

  const activeTitle = useMemo(() => {
    if (activeTab === 'subtopics' && selectedSubtopic) {
      return `${selectedSubtopic.subtopic_code ? `[${selectedSubtopic.subtopic_code}] ` : ''}${selectedSubtopic.name}`;
    }
    return selectedMaterial?.title || 'Review Manual';
  }, [activeTab, selectedSubtopic, selectedMaterial]);

  return (
    <div className="ereader-container">
      {/* 0. Top Mode Selector */}
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
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('chapters')}
            className={`btn btn-sm ${activeTab === 'chapters' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>📖</span> Blueprint Chapters ({materials.length})
          </button>

          {allSubtopics.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('subtopics')}
              className={`btn btn-sm ${activeTab === 'subtopics' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>📑</span> Detailed Review Manual Lessons ({allSubtopics.length})
            </button>
          )}

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
      {/* TAB 1 & 2: READING MODE (CHAPTERS OR DETAILED SUBTOPICS)        */}
      {/* ============================================================== */}
      {(activeTab === 'chapters' || activeTab === 'subtopics') && (
        <>
          {/* Top Bar for Reader Mode */}
          <div className="ereader-topbar">
            <div className="ereader-topbar-left">
              <div style={{ minWidth: 0 }}>
                <div className="ereader-meta-badge">
                  📖 {activeTab === 'subtopics' ? 'Official In-Depth Curriculum' : selectedMaterial?.document_title || 'Review Manual'} • {activeCertificationSlug.toUpperCase()}
                </div>
                <h2 className="ereader-title" style={{ fontSize: 'var(--text-base)', margin: '2px 0 0 0' }}>
                  {activeTitle}
                </h2>
              </div>
            </div>

            {/* Top Controls: Audio, Completion, Font Sizer */}
            <div className="ereader-controls">
              <button
                onClick={() => setShowAudioPlayer(!showAudioPlayer)}
                className={`btn btn-sm ${showAudioPlayer ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                title="Read Aloud & Audio on the Go (Native Web Speech API)"
              >
                <span>🎧</span>
                <span>{showAudioPlayer ? 'Hide Audio' : 'Read Aloud'}</span>
              </button>

              {activeTab === 'chapters' && selectedMaterial && (
                <button
                  onClick={() => toggleChapterComplete(selectedMaterial.chapter_number ?? 0)}
                  className={`btn btn-sm ${isCompleted ? 'btn-success' : 'btn-secondary'}`}
                  style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}
                  title={isCompleted ? 'Completed (Tap to undo)' : 'Mark chapter as completed'}
                >
                  <span>{isCompleted ? '✓ Completed' : 'Mark as Complete'}</span>
                </button>
              )}

              <button
                onClick={() => setIsTocDrawerOpen(!isTocDrawerOpen)}
                className="btn btn-secondary btn-sm mobile-only"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <span>📑 TOC</span>
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

          {/* Quick Publication / Manual Filter Bar (if multiple manuals exist for this cert) */}
          {activeTab === 'chapters' && distinctManualTitles.length > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                backgroundColor: 'var(--color-bg)',
                borderBottom: '1px solid var(--border-color)',
                overflowX: 'auto',
                scrollbarWidth: 'none',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-ink-muted)', whiteSpace: 'nowrap' }}>
                📖 Select Manual:
              </span>
              <button
                type="button"
                onClick={() => setSelectedManualFilter('all')}
                className={`btn btn-xs ${selectedManualFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', fontSize: '10px' }}
              >
                All Volumes ({materials.length})
              </button>
              {distinctManualTitles.map((title) => {
                const count = materials.filter((m) => m.document_title === title).length;
                const shortTitle = title.length > 34 ? title.slice(0, 32) + '...' : title;
                return (
                  <button
                    key={title}
                    type="button"
                    onClick={() => setSelectedManualFilter(title)}
                    className={`btn btn-xs ${selectedManualFilter === title ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', fontSize: '10px' }}
                    title={title}
                  >
                    {shortTitle} ({count} Ch)
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Chapter Selector Pills for Chapter Mode */}
          {activeTab === 'chapters' && filteredMaterials.length > 0 && (
            <div className="ereader-pills-bar">
              {filteredMaterials.map((m) => {
                const isSelected = selectedMaterial?.id === m.id;
                const chapterDone = isChapterCompleted(m.chapter_number ?? 0);
                const isMultiDoc = distinctManualTitles.length > 1 && selectedManualFilter === 'all';
                const docTag = isMultiDoc && m.document_title
                  ? (m.document_title.includes('16th') ? '16th Ed' : m.document_title.includes('Leadership') ? 'CISO' : `Vol ${m.sort_order}`)
                  : '';
                const label = m.chapter_number === 0 
                  ? 'Ch. 0 Blueprint' 
                  : `Ch. ${m.chapter_number}${docTag ? ` • ${docTag}` : ''}`;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMaterial(m)}
                    className={`ereader-pill-tab ${isSelected ? 'active' : ''}`}
                    title={m.title}
                  >
                    <span className="pill-num">{chapterDone ? '✓ ' : ''}{label}</span>
                    <span className="pill-title">{m.title.slice(0, 26)}...</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Main 2-Column Reader Layout */}
          <div className="ereader-layout">
            {/* Left TOC Sidebar (Desktop) */}
            <aside className="ereader-sidebar desktop-only">
              <div className="ereader-sidebar-header">
                <span>{activeTab === 'subtopics' ? 'Textbook Modules' : 'Blueprint Chapters'}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>
                  {activeTab === 'subtopics' ? allSubtopics.length : filteredMaterials.length}
                </span>
              </div>

              <div className="ereader-sidebar-list">
                {activeTab === 'chapters' ? (
                  filteredMaterials.map((m) => {
                    const isSelected = selectedMaterial?.id === m.id;
                    const chapterDone = isChapterCompleted(m.chapter_number ?? 0);
                    const isMultiDoc = distinctManualTitles.length > 1 && selectedManualFilter === 'all';
                    return (
                      <div
                        key={m.id}
                        onClick={() => handleSelectMaterial(m)}
                        className={`ereader-sidebar-item ${isSelected ? 'active' : ''} ${chapterDone ? 'completed' : ''}`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                          <span className="ereader-sidebar-item-chapter">
                            Chapter {m.chapter_number}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {isMultiDoc && m.document_title && (
                              <span className="badge badge-secondary" style={{ fontSize: '9px', padding: '1px 5px' }}>
                                {m.document_title.includes('16th') ? '16th Ed' : m.document_title.includes('Leadership') ? 'CISO' : 'Vol'}
                              </span>
                            )}
                            {chapterDone && (
                              <span className="badge badge-success" style={{ fontSize: '10px' }}>
                                ✓ Done
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ereader-sidebar-item-title">
                          {m.title}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  allSubtopics.map((sub) => {
                    const isSelected = selectedSubtopic?.id === sub.id;
                    return (
                      <div
                        key={sub.id}
                        onClick={() => handleSelectSubtopic(sub)}
                        className={`ereader-sidebar-item ${isSelected ? 'active' : ''}`}
                        style={{ padding: '8px 12px' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                            {sub.subtopic_code || 'SEC'}
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--color-ink-muted)' }}>
                            ~{sub.estimated_read_minutes || 8} min
                          </span>
                        </div>
                        <div className="ereader-sidebar-item-title" style={{ fontSize: '12px' }}>
                          {sub.name}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </aside>

            {/* Main Stage: Reading Pane */}
            <main className="ereader-main-stage" style={{ paddingBottom: '140px' }}>
              {/* Optional Collapsible Audio Reader Player */}
              {showAudioPlayer && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <AudioReaderPlayer
                    contentMarkdown={activeContentMarkdown}
                    chapterTitle={activeTitle}
                    onNextChapter={handleNextChapter}
                    onPrevChapter={handlePrevChapter}
                    onClose={() => setShowAudioPlayer(false)}
                  />
                </div>
              )}

              {/* Subtopic Meta Header if in subtopic mode */}
              {activeTab === 'subtopics' && selectedSubtopic && (
                <div
                  className="card"
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    marginBottom: 'var(--space-4)',
                    backgroundColor: 'var(--color-bg-subtle)',
                    borderLeft: '4px solid var(--color-primary)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="badge badge-primary font-bold" style={{ fontSize: '11px' }}>
                      SECTION {selectedSubtopic.subtopic_code || 'MODULE'}
                    </span>
                    {(() => {
                      const topic = allTopics.find(t => t.id === selectedSubtopic.topic_id);
                      const domain = domains.find(d => topic && d.id === topic.domain_id);
                      return domain ? (
                        <span className="badge badge-secondary" style={{ fontSize: '10px' }}>
                          Domain {domain.domain_number}: {domain.name}
                        </span>
                      ) : null;
                    })()}
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                      ⏱ ~{selectedSubtopic.estimated_read_minutes || 8} mins read • High-Yield Lesson
                    </span>
                  </div>

                  {selectedSubtopic.key_terms && selectedSubtopic.key_terms.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-ink-muted)' }}>Key Terms:</span>
                      {selectedSubtopic.key_terms.map((t, idx) => (
                        <span key={idx} className="term-chip" style={{ fontSize: '10px' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Markdown Content Surface */}
              <article className={`ereader-prose font-size-${fontSize}`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {activeContentMarkdown}
                </ReactMarkdown>
              </article>

              {/* Exam Tip Callout if in subtopic mode */}
              {activeTab === 'subtopics' && selectedSubtopic?.exam_tips && (
                <div
                  style={{
                    marginTop: 'var(--space-6)',
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#fef3c7',
                    border: '1px solid #fde68a',
                    color: '#92400e',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 1.5,
                  }}
                >
                  <strong>💡 Exam Watch Guidance:</strong> {selectedSubtopic.exam_tips}
                </div>
              )}

              {/* Practice This Section Card */}
              {activeTab === 'subtopics' && selectedSubtopic && (
                <div
                  className="card mt-6 mb-4"
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
                        Finished reading {selectedSubtopic.subtopic_code}?
                      </h4>
                    </div>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                      Practice targeted questions for <strong>{selectedSubtopic.name}</strong> only.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onPracticeSection) {
                        const parentTopic = allTopics.find((t) => t.id === selectedSubtopic.topic_id);
                        onPracticeSection(selectedSubtopic, parentTopic);
                      }
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
                  >
                    ⚡ Practice This Section ({selectedSubtopic.subtopic_code})
                  </button>
                </div>
              )}

              {/* Practice Chapter Questions Card */}
              {activeTab === 'chapters' && selectedMaterial && selectedMaterial.domain_id && (
                <div
                  className="card mt-6 mb-4"
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
                        Finished {selectedMaterial.title}?
                      </h4>
                    </div>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                      Test your understanding of the concepts covered in this chapter.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onPracticeChapter && selectedMaterial.domain_id) {
                        onPracticeChapter(selectedMaterial.domain_id);
                      }
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
                  >
                    ⚡ Practice Chapter Questions
                  </button>
                </div>
              )}

              {/* Bottom Pagination */}
              {activeTab === 'chapters' && (
                <div className="ereader-footer-nav" style={{ marginTop: 'var(--space-8)' }}>
                  <button
                    onClick={handlePrevChapter}
                    disabled={currentIndex <= 0}
                    className="btn btn-secondary btn-sm"
                  >
                    ← Previous Chapter
                  </button>

                  <button
                    onClick={handleNextChapter}
                    disabled={currentIndex >= materials.length - 1}
                    className="btn btn-primary btn-sm"
                  >
                    Next Chapter →
                  </button>
                </div>
              )}
            </main>
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* TAB 3: MASTER INGESTED DOCUMENTS & BOOKS VAULT                 */}
      {/* ============================================================== */}
      {activeTab === 'vault' && (
        <div style={{ padding: 'var(--space-5)', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          {/* Vault Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>
                📂 Master Ingested Documents &amp; Books Vault
              </h3>
              <p className="text-muted" style={{ fontSize: 'var(--text-xs)', margin: '4px 0 0 0' }}>
                Complete archive of 352 official study manuals, books, and blueprints with in-app reading &amp; audio.
              </p>
            </div>

            <div style={{ minWidth: '260px', flex: 1, maxWidth: '400px' }}>
              <input
                type="text"
                className="input input-sm"
                style={{ width: '100%' }}
                placeholder="🔍 Search documents, manuals, or keywords..."
                value={vaultSearch}
                onChange={(e) => setVaultSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Certification Filter Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '8px',
              marginBottom: 'var(--space-4)',
              scrollbarWidth: 'none',
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedVaultCert('all')}
              className={`btn btn-xs ${selectedVaultCert === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', fontWeight: 'bold' }}
            >
              All Documents ({vaultDocuments.length})
            </button>

            {Object.entries(vaultCertCounts).map(([slug, count]) => (
              <button
                key={slug}
                type="button"
                onClick={() => setSelectedVaultCert(slug)}
                className={`btn btn-xs ${selectedVaultCert === slug ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)', fontWeight: 'bold', whiteSpace: 'nowrap' }}
              >
                🎯 {slug.toUpperCase()} ({count})
              </button>
            ))}
          </div>

          {/* Document Cards Grid */}
          {filteredVault.length === 0 ? (
            <div className="card text-center" style={{ padding: 'var(--space-12)' }}>
              <span style={{ fontSize: '2rem' }}>📭</span>
              <p className="text-muted" style={{ marginTop: 'var(--space-2)' }}>
                {vaultSearch ? 'No matching documents found in vault.' : 'No ingested documents recorded for this track.'}
              </p>
              {selectedVaultCert !== 'all' && (
                <button
                  onClick={() => setSelectedVaultCert('all')}
                  className="btn btn-secondary btn-sm mt-3"
                >
                  View All Certifications
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-3)' }}>
              {filteredVault.map((doc) => {
                const sizeMb = (doc.file_size_bytes / (1024 * 1024)).toFixed(2);
                const isChunked = doc.cloud_storage_status.includes('split');
                const extUpper = (doc.file_format || '.PDF').replace('.', '').toUpperCase();
                const cleanTitle = formatCleanDocumentTitle(doc.file_name);

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
                        <span className="badge badge-secondary" style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                          🎯 {doc.certification_slug}
                        </span>
                      </div>

                      {/* Clean Human-Friendly Title */}
                      <h4
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'bold',
                          color: 'var(--color-ink)',
                          margin: '0 0 4px 0',
                          lineHeight: 1.4,
                        }}
                      >
                        {cleanTitle}
                      </h4>

                      {/* Raw File Name */}
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-ink-muted)',
                          fontFamily: 'var(--font-mono)',
                          wordBreak: 'break-all',
                          marginBottom: 'var(--space-3)',
                        }}
                      >
                        {doc.file_name}
                      </div>

                      {/* Metadata Details */}
                      <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>
                        <div>
                          📏 <strong>Size:</strong> {sizeMb} MB {isChunked && '(Composite Cloud Parts)'}
                        </div>
                        <div>
                          🧠 <strong>Semantic Chunks:</strong> ~{doc.extracted_chunks_count || 15}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: Read In-App + Download */}
                    <div style={{ display: 'flex', gap: '6px', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border-color)' }}>
                      <button
                        type="button"
                        onClick={() => setViewingVaultDoc(doc)}
                        className="btn btn-sm btn-primary"
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontWeight: 'bold',
                          fontSize: 'var(--text-xs)',
                        }}
                      >
                        <span>📖</span> Read In-App
                      </button>

                      {doc.public_url && (
                        <a
                          href={doc.public_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-secondary"
                          style={{
                            padding: '4px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none',
                            fontSize: 'var(--text-xs)',
                          }}
                          title="Open or Download File Directly"
                        >
                          <span>⬇</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* IN-APP DOCUMENT VIEWER MODAL                                    */}
      {/* ============================================================== */}
      {viewingVaultDoc && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            padding: '12px',
            boxSizing: 'border-box',
          }}
        >
          {/* Modal Header Bar */}
          <div
            className="card"
            style={{
              padding: '10px 16px',
              marginBottom: '8px',
              backgroundColor: 'var(--color-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <span style={{ fontSize: '1.4rem' }}>📖</span>
              <div>
                <h3 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'bold', color: 'var(--color-ink)' }}>
                  {formatCleanDocumentTitle(viewingVaultDoc.file_name)}
                </h3>
                <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', display: 'flex', gap: '8px' }}>
                  <span>{viewingVaultDoc.file_name}</span>
                  <span>•</span>
                  <span>{(viewingVaultDoc.file_size_bytes / (1024 * 1024)).toFixed(2)} MB</span>
                  <span>•</span>
                  <span style={{ textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    {viewingVaultDoc.certification_slug}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Viewer Engine Toggle */}
              <div
                style={{
                  display: 'flex',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setViewerMode('google_docs')}
                  className={`btn btn-xs ${viewerMode === 'google_docs' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '10px', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}
                  title="Mobile-Safe HTML5 Canvas Renderer (Bypasses Chrome mobile iframe blocks)"
                >
                  ⚡ Mobile HTML5
                </button>
                <button
                  type="button"
                  onClick={() => setViewerMode('native')}
                  className={`btn btn-xs ${viewerMode === 'native' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '10px', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}
                  title="Direct PDF Stream (Desktop / Native Plugin)"
                >
                  📄 Direct PDF
                </button>
              </div>

              {viewingVaultDoc.public_url && (
                <a
                  href={viewingVaultDoc.public_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-xs btn-primary font-bold"
                  style={{
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    fontSize: '11px',
                  }}
                  title="Open in your phone's native PDF reader (Google Drive, Adobe Acrobat, etc.)"
                >
                  <span>📲</span> Open in Device App
                </a>
              )}

              {viewingVaultDoc.public_url && (
                <a
                  href={viewingVaultDoc.public_url}
                  download={viewingVaultDoc.file_name}
                  className="btn btn-xs btn-secondary"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px' }}
                  title="Download File Directly"
                >
                  <span>⬇</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => setViewingVaultDoc(null)}
                className="btn btn-sm btn-secondary"
                style={{ padding: '4px 12px', fontWeight: 'bold' }}
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Mobile Chrome Assistance Alert */}
          {isMobile && (
            <div
              style={{
                backgroundColor: 'rgba(254, 243, 199, 0.95)',
                color: '#92400e',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '11px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <span>
                💡 <strong>Mobile Chrome Alert:</strong> If preview does not render, use <strong>Mobile HTML5</strong> mode or tap <strong>Open in Device App</strong>.
              </span>
            </div>
          )}

          {/* Embedded Viewer Canvas */}
          <div
            style={{
              flex: 1,
              width: '100%',
              backgroundColor: '#fff',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              display: 'flex',
              position: 'relative',
            }}
          >
            {viewingVaultDoc.public_url ? (
              viewerMode === 'google_docs' ? (
                <iframe
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(viewingVaultDoc.public_url)}&embedded=true`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  title={viewingVaultDoc.file_name}
                  allow="fullscreen"
                />
              ) : (
                <iframe
                  src={`${viewingVaultDoc.public_url}#toolbar=1&navpanes=1`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  title={viewingVaultDoc.file_name}
                  allow="fullscreen"
                />
              )
            ) : (
              <div style={{ margin: 'auto', textAlign: 'center', padding: 'var(--space-8)' }}>
                <p className="text-muted">Document storage URL unavailable.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentReader;
