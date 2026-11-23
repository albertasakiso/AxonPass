/* ===================================================================
   APILIGU LEARNING PASS — Universal Concept Graph & Knowledge Map Explorer
   100% Free, Interactive Visual Ontology Across All 15 Certifications
   =================================================================== */

import React, { useState, useMemo, useEffect } from 'react';
import { fetchKnowledgeNodesForCert, resolveCertCodeForGraph } from '../../lib/ml/knowledgeGraphService';
import type { KnowledgeNode } from '../../lib/ml/types';

interface ConceptGraphExplorerProps {
  certSlug?: string;
  certCode?: string;
  certName?: string;
  onStartTopicQuiz?: (topicCode: string) => void;
}

export const ConceptGraphExplorer: React.FC<ConceptGraphExplorerProps> = ({
  certSlug = 'cisa',
  certCode,
  certName,
  onStartTopicQuiz,
}) => {
  const [resolvedCode, setResolvedCode] = useState<string>(() => resolveCertCodeForGraph(certSlug || certCode));
  const [certNodes, setCertNodes] = useState<KnowledgeNode[]>([]);
  const [loadingNodes, setLoadingNodes] = useState<boolean>(true);
  const [selectedDomain, setSelectedDomain] = useState<number | 'all'>('all');
  const [activeNodeId, setActiveNodeId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let active = true;
    setLoadingNodes(true);
    fetchKnowledgeNodesForCert(certSlug || certCode).then(({ code, nodes }) => {
      if (!active) return;
      setResolvedCode(code);
      setCertNodes(nodes);
      setActiveNodeId(nodes[0]?.id || '');
      setSelectedDomain('all');
      setSearchQuery('');
      setLoadingNodes(false);
    }).catch(() => {
      if (active) setLoadingNodes(false);
    });
    return () => {
      active = false;
    };
  }, [certCode, certSlug]);

  // Dynamically compute domains for this certification
  const availableDomains = useMemo(() => {
    const doms = Array.from(new Set(certNodes.map((n) => n.domainNumber)));
    return doms.sort((a, b) => a - b);
  }, [certNodes]);

  const filteredNodes = useMemo(() => {
    return certNodes.filter((node) => {
      const matchDomain = selectedDomain === 'all' || node.domainNumber === selectedDomain;
      const matchSearch =
        !searchQuery.trim() ||
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.topicCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (node.domainName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchDomain && matchSearch;
    });
  }, [certNodes, selectedDomain, searchQuery]);

  const activeNode = useMemo(() => {
    return certNodes.find((n) => n.id === activeNodeId) || certNodes[0] || null;
  }, [certNodes, activeNodeId]);

  if (loadingNodes && certNodes.length === 0) {
    return (
      <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center', borderRadius: 'var(--radius-xl)' }}>
        <p className="text-muted">Loading {resolvedCode} concept ontology from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div className="ereader-meta-badge">
          🧠 {resolvedCode} AI Knowledge Ontology &amp; Concept Dependency Map
        </div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: 'var(--color-ink)', margin: '0 0 var(--space-1) 0' }}>
          {certName || resolvedCode} Interactive Knowledge Graph
        </h2>
        <p className="text-muted" style={{ fontSize: 'var(--text-sm)', margin: 0 }}>
          Explore cognitive linkages, prerequisites, official task statements, and review manual sections across {certNodes.length} mapped topic nodes.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        {/* Domain Filter Pills */}
        <div className="segmented-nav" style={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
          <button
            type="button"
            className={`segmented-pill ${selectedDomain === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedDomain('all')}
          >
            All Domains ({availableDomains.length})
          </button>
          {availableDomains.map((d) => (
            <button
              key={d}
              type="button"
              className={`segmented-pill ${selectedDomain === d ? 'active' : ''}`}
              onClick={() => setSelectedDomain(d)}
            >
              Domain {d}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <input
          type="search"
          placeholder="🔍 Search concepts or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input"
          style={{ fontSize: 'var(--text-xs)', maxWidth: '240px', padding: '6px 12px' }}
        />
      </div>

      {/* Main Grid: Left Node List + Right Detail Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
        
        {/* Left Column: Concept Nodes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }}>
          {filteredNodes.length === 0 ? (
            <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-ink-muted)', fontSize: 'var(--text-xs)' }}>
              No concept nodes found matching &quot;{searchQuery}&quot; in Domain {selectedDomain}
            </div>
          ) : (
            filteredNodes.map((node) => {
              const isSelected = activeNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNodeId(node.id)}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--color-primary-surface)' : 'var(--color-bg-subtle)',
                    border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-color)'}`,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                      [{node.topicCode}] D{node.domainNumber}
                    </span>
                    {node.taskStatements && node.taskStatements.length > 0 && (
                      <span style={{ fontSize: '10px', color: 'var(--color-ink-muted)' }}>
                        {node.taskStatements.slice(0, 3).join(', ')}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--color-ink)' }}>
                    {node.name}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Node Inspector */}
        {activeNode && (
          <div
            className="card"
            style={{
              padding: 'var(--space-5)',
              backgroundColor: 'var(--color-bg-subtle)',
              borderLeft: '4px solid var(--color-primary)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span className="badge badge-primary" style={{ fontSize: '11px', fontWeight: 'bold' }}>
                  Domain {activeNode.domainNumber}: {activeNode.domainName} • Topic {activeNode.topicCode}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                  {activeNode.manualSection}
                </span>
              </div>

              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--color-ink)', marginBottom: 'var(--space-3)' }}>
                {activeNode.name}
              </h3>

              <p style={{ fontSize: 'var(--text-xs)', lineHeight: 1.6, color: 'var(--color-ink)', marginBottom: 'var(--space-4)' }}>
                {activeNode.summary}
              </p>

              {/* Cognitive Dependencies & Linked Concepts */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--color-ink-muted)', marginBottom: 'var(--space-1)' }}>
                  Cognitive Prerequisites &amp; Related Concepts
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  {activeNode.prerequisites && activeNode.prerequisites.length > 0 ? (
                    activeNode.prerequisites.map((req) => (
                      <span key={req} className="badge badge-neutral" style={{ fontSize: '10px' }}>
                        Prerequisite: {req}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                      Foundational topic (No prior dependencies)
                    </span>
                  )}

                  {activeNode.relatedNodes && activeNode.relatedNodes.map((rel) => {
                    const relatedObj = certNodes.find((n) => n.topicCode === rel || n.id === rel);
                    return (
                      <button
                        key={rel}
                        onClick={() => relatedObj && setActiveNodeId(relatedObj.id)}
                        className="badge badge-primary"
                        style={{ fontSize: '10px', cursor: 'pointer', border: 'none' }}
                        title={relatedObj ? `Jump to ${relatedObj.name}` : undefined}
                      >
                        🔗 Linked: {relatedObj ? relatedObj.name : rel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Keywords Index */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--color-ink-muted)', marginBottom: 'var(--space-1)' }}>
                  Key Blueprint Terms &amp; Ontology Nodes
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {activeNode.keywords.map((kw) => (
                    <span
                      key={kw}
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--color-ink)',
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Quiz for Topic Code */}
            {onStartTopicQuiz && (
              <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  onClick={() => onStartTopicQuiz(activeNode.topicCode)}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', fontWeight: 'bold' }}
                >
                  ⚡ Practice Topic {activeNode.topicCode} Questions
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConceptGraphExplorer;
