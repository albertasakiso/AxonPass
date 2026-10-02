/* ===================================================================
   APILIGU LEARNING PASS — Universal Multi-Cert Version Delta Viewer
   Displays comparative domain weight shifts, newly added competencies,
   executive rationale, and high-yield exam traps for any certification track.
   =================================================================== */

import React, { useState, useMemo } from 'react';
import { getCertDeltaMatrix, type DeltaFeature } from '../../data/certVersionDeltas';

interface CertVersionDeltaViewerProps {
  certSlug?: string;
  certCode?: string;
  onStartDeltaQuiz?: () => void;
}

export const CertVersionDeltaViewer: React.FC<CertVersionDeltaViewerProps> = ({
  certSlug = 'cisa',
  certCode,
  onStartDeltaQuiz,
}) => {
  const deltaMatrix = useMemo(() => {
    return getCertDeltaMatrix(certCode || certSlug);
  }, [certSlug, certCode]);

  const {
    certName,
    oldVersionLabel,
    newVersionLabel,
    releaseYear,
    executiveSummary,
    domainWeights,
    features,
  } = deltaMatrix;

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFeature, setActiveFeature] = useState<DeltaFeature | null>(features[0] || null);

  // Sync active feature when matrix changes
  React.useEffect(() => {
    setActiveFeature(features[0] || null);
    setSelectedCategory('All');
    setSearchQuery('');
  }, [deltaMatrix]);

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    features.forEach((f) => set.add(f.category));
    return Array.from(set);
  }, [features]);

  const filteredFeatures = useMemo(() => {
    return features.filter((f) => {
      const matchCat = selectedCategory === 'All' || f.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.keyTerms.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
        f.domainName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [features, selectedCategory, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* 1. Header Banner & Executive Overview */}
      <div
        className="card"
        style={{
          padding: 'var(--space-6)',
          background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-primary-surface) 100%)',
          border: '1px solid var(--color-primary)',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
              <span className="badge badge-primary font-bold" style={{ fontSize: '11px' }}>
                ✨ {deltaMatrix.certCode} Curriculum Evolution ({releaseYear})
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                {oldVersionLabel} ➔ {newVersionLabel}
              </span>
            </div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', margin: '0 0 var(--space-2) 0', color: 'var(--color-ink)' }}>
              {certName} — Official Blueprint Delta &amp; Gap Matrix
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: 0 }}>
              {executiveSummary}
            </p>
          </div>

          {onStartDeltaQuiz && (
            <button
              onClick={onStartDeltaQuiz}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <span>⚡</span> Practice {deltaMatrix.certCode} Delta Questions
            </button>
          )}
        </div>
      </div>

      {/* 2. Comparative Domain Weight Shift Grid */}
      <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0, color: 'var(--color-ink)' }}>
              Official Domain Blueprint Re-Weighting Analysis
            </h3>
            <p className="text-muted" style={{ fontSize: 'var(--text-xs)', margin: '2px 0 0 0' }}>
              Comparative breakdown showing exact percentage shifts between {oldVersionLabel} and {newVersionLabel}.
            </p>
          </div>
          <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
            {domainWeights.length} Blueprint Domains
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {domainWeights.map((d) => (
            <div
              key={d.domain}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-primary)',
                      color: '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  >
                    D{d.domain}
                  </span>
                  <span style={{ fontWeight: '600', fontSize: 'var(--text-sm)', color: 'var(--color-ink)' }}>
                    {d.name}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span className={`badge ${d.delta > 0 ? 'badge-success' : d.delta < 0 ? 'badge-warning' : 'badge-neutral'}`} style={{ fontWeight: 'bold' }}>
                    {d.delta > 0 ? `+${d.delta}%` : d.delta < 0 ? `${d.delta}%` : '0% (Unchanged)'}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                    {d.vOld}% ➔ <strong style={{ color: d.delta > 0 ? 'var(--color-success)' : 'var(--color-ink)' }}>{d.vNew}%</strong>
                  </span>
                </div>
              </div>

              {/* Progress bars: old vs new */}
              <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', marginTop: 'var(--space-1)' }}>
                <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${Math.min(100, d.vNew * 2.5)}%`,
                      height: '100%',
                      backgroundColor: d.delta > 0 ? 'var(--color-success)' : 'var(--color-primary)',
                      borderRadius: 'var(--radius-full)',
                    }}
                  />
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)', fontStyle: 'italic', minWidth: '220px' }}>
                  {d.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Deep-Dive Added Competencies & High-Yield Traps */}
      <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0, color: 'var(--color-ink)' }}>
              High-Yield Competencies &amp; Delta Deep Dive
            </h3>
            <p className="text-muted" style={{ fontSize: 'var(--text-xs)', margin: '2px 0 0 0' }}>
              Inspect critical new concepts, operational responsibilities, and official exam traps.
            </p>
          </div>

          {/* Search filter */}
          <input
            type="search"
            placeholder="🔍 Search delta topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{ fontSize: 'var(--text-xs)', maxWidth: '240px', padding: '6px 12px' }}
          />
        </div>

        {/* Category Pills */}
        <div className="segmented-nav mb-4" style={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`segmented-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Master-Detail Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
          {/* Left Column: Feature Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxHeight: '480px', overflowY: 'auto' }}>
            {filteredFeatures.map((f) => {
              const isSelected = activeFeature?.id === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => setActiveFeature(f)}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: isSelected ? 'var(--color-primary-surface)' : 'var(--color-bg-subtle)',
                    border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-color)'}`,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '10px' }}>
                      Domain {f.domain}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--color-ink-muted)' }}>
                      {f.sectionRef}
                    </span>
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--color-ink)' }}>
                    {f.title}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Inspector */}
          {activeFeature && (
            <div
              className="card"
              style={{
                padding: 'var(--space-5)',
                backgroundColor: 'var(--color-bg-subtle)',
                borderLeft: '4px solid var(--color-primary)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span className="badge badge-primary font-bold">
                    Domain {activeFeature.domain}: {activeFeature.domainName}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                    Ref: {activeFeature.sectionRef}
                  </span>
                </div>
                <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--color-ink)', margin: 0 }}>
                  {activeFeature.title}
                </h4>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--color-ink-muted)', marginBottom: '4px' }}>
                  Why This Was Added
                </div>
                <p style={{ fontSize: 'var(--text-xs)', lineHeight: 1.6, margin: 0, color: 'var(--color-ink)' }}>
                  {activeFeature.whyAdded}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--color-ink-muted)', marginBottom: '4px' }}>
                  Professional / Auditor Responsibility
                </div>
                <p style={{ fontSize: 'var(--text-xs)', lineHeight: 1.6, margin: 0, color: 'var(--color-ink)' }}>
                  {activeFeature.roleResponsibility}
                </p>
              </div>

              {/* Exam Trap Alert Callout */}
              <div
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #FCD34D',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '14px' }}>⚠️</span>
                  <strong style={{ fontSize: '11px', color: '#92400E', textTransform: 'uppercase' }}>
                    Exam Alert &amp; Common Trap
                  </strong>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', margin: 0, color: '#B45309', lineHeight: 1.5 }}>
                  {activeFeature.examTip}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--color-ink-muted)', marginBottom: '6px' }}>
                  Key Blueprint Terms
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {activeFeature.keyTerms.map((term) => (
                    <span
                      key={term}
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--color-ink)',
                      }}
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Backwards-compatible export for any legacy imports
export const CisaVersionDeltaViewer: React.FC<{ onStartDeltaQuiz?: () => void }> = ({ onStartDeltaQuiz }) => {
  return <CertVersionDeltaViewer certSlug="cisa" onStartDeltaQuiz={onStartDeltaQuiz} />;
};

export default CertVersionDeltaViewer;
