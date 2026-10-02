/* ===================================================================
   APILIGU LEARNING PASS — Concept Graph & Knowledge Map Explorer
   100% Free, Interactive Visual Ontology of CISA 28th Edition Topics
   =================================================================== */

import React, { useState, useMemo } from 'react';
import { CISA_KNOWLEDGE_GRAPH } from '../../lib/ml/knowledgeGraph';

interface ConceptGraphExplorerProps {
  onStartTopicQuiz?: (topicCode: string) => void;
}

export const ConceptGraphExplorer: React.FC<ConceptGraphExplorerProps> = ({
  onStartTopicQuiz,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<number | 'all'>('all');
  const [activeNodeId, setActiveNodeId] = useState<string>(CISA_KNOWLEDGE_GRAPH[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredNodes = useMemo(() => {
    return CISA_KNOWLEDGE_GRAPH.filter((node) => {
      const matchDomain = selectedDomain === 'all' || node.domainNumber === selectedDomain;
      const matchSearch =
        !searchQuery.trim() ||
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.topicCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchDomain && matchSearch;
    });
  }, [selectedDomain, searchQuery]);

  const activeNode = useMemo(() => {
    return CISA_KNOWLEDGE_GRAPH.find((n) => n.id === activeNodeId) || CISA_KNOWLEDGE_GRAPH[0];
  }, [activeNodeId]);

  return (
    <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div className="ereader-meta-badge">
          🧠 AI Knowledge Ontology &amp; Concept Dependency Map
        </div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: 'var(--color-ink)', margin: '0 0 var(--space-1) 0' }}>
          Interactive Concept Knowledge Graph
        </h2>
        <p className="text-muted" style={{ fontSize: 'var(--text-sm)', margin: 0 }}>
          Explore cognitive linkages, prerequisites, ISACA task statements, and 28th Edition review manual sections.
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
            All Domains (5)
          </button>
          {[1, 2, 3, 4, 5].map((d) => (
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
          {filteredNodes.map((node) => {
            const isSelected = node.id === activeNodeId;
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
                  <span style={{ fontSize: '10px', color: 'var(--color-ink-muted)' }}>
                    {node.taskStatements.join(', ')}
                  </span>
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--color-ink)' }}>
                  {node.name}
                </div>
              </div>
            );
          })}
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
                  Domain {activeNode.domainNumber} • Topic {activeNode.topicCode}
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

              {/* Keywords Tag Cloud */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--color-ink-muted)', marginBottom: '6px' }}>
                  🏷️ Ingested Concept Keywords
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {activeNode.keywords.map((kw) => (
                    <span key={kw} className="badge badge-neutral" style={{ fontSize: '11px' }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Task Statements & Prerequisites */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div style={{ padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--color-ink-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Task Statements
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-primary)', marginTop: '2px' }}>
                    {activeNode.taskStatements.join(', ')}
                  </div>
                </div>

                <div style={{ padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--color-ink-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Prerequisites
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-ink)', marginTop: '2px' }}>
                    {activeNode.prerequisites.length > 0 ? activeNode.prerequisites.join(', ') : 'None (Core Entry)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {onStartTopicQuiz && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onStartTopicQuiz(activeNode.topicCode)}
                style={{ width: '100%', marginTop: 'var(--space-4)' }}
              >
                ⚡ Start 10-Q Practice Drill on [{activeNode.topicCode}] →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
