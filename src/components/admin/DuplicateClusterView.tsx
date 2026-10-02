/* ===================================================================
   APILIGU LEARNING PASS — Duplicate Cluster Review View
   Side-by-side near-duplicate question resolver (§7.5).
   =================================================================== */

import React, { useState } from 'react';
import type { DuplicateCluster, ParsedQuestion } from '../../types';

interface DuplicateClusterViewProps {
  clusters: DuplicateCluster[];
  onResolveClusters: (resolvedQuestions: ParsedQuestion[]) => void;
  onSkip: () => void;
}

export const DuplicateClusterView: React.FC<DuplicateClusterViewProps> = ({
  clusters,
  onResolveClusters,
  onSkip,
}) => {
  const [decisions, setDecisions] = useState<Record<string, 'keep_all' | 'keep_first' | 'merge'>>({});

  const handleDecision = (clusterId: string, action: 'keep_all' | 'keep_first' | 'merge') => {
    setDecisions((prev) => ({
      ...prev,
      [clusterId]: action,
    }));
  };

  const handleApplyResolutions = () => {
    const retainedQuestions: ParsedQuestion[] = [];
    const excludedIds = new Set<string>();

    clusters.forEach((cluster) => {
      const decision = decisions[cluster.id] || 'keep_all';
      const primaryQ = cluster.questions[0];
      const duplicates = cluster.questions.slice(1);

      if (decision === 'keep_all') {
        retainedQuestions.push(...cluster.questions);
      } else if (decision === 'keep_first') {
        retainedQuestions.push(primaryQ);
        duplicates.forEach((d) => excludedIds.add(d.externalId));
      } else if (decision === 'merge') {
        const mergedRationale = `${primaryQ.rationale}\n\n[Additional Source Context]: ${duplicates.map((d) => d.rationale).join('; ')}`;
        retainedQuestions.push({
          ...primaryQ,
          rationale: mergedRationale,
          confidence: 'verified',
        });
        duplicates.forEach((d) => excludedIds.add(d.externalId));
      }
    });

    onResolveClusters(retainedQuestions);
  };

  return (
    <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <div className="ereader-meta-badge" style={{ backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)', borderColor: 'var(--color-warning-border)' }}>
            ⚠️ Near-Duplicate Detection Studio ({clusters.length} Clusters Found)
          </div>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-ink)', margin: 'var(--space-1) 0 0 0' }}>
            Review Potential Duplicate Questions
          </h2>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)', margin: '2px 0 0 0' }}>
            The similarity engine flagged questions with high N-gram token overlap. Choose how to handle each cluster.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button onClick={onSkip} className="btn btn-secondary">
            Keep All & Skip
          </button>
          <button onClick={handleApplyResolutions} className="btn btn-primary">
            Apply Decisions ({Object.keys(decisions).length}/{clusters.length}) ➔
          </button>
        </div>
      </div>

      {/* List of Clusters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {clusters.map((cluster, idx) => {
          const decision = decisions[cluster.id] || 'keep_all';
          const primaryQ = cluster.questions[0];
          const duplicates = cluster.questions.slice(1);

          return (
            <div
              key={cluster.id}
              style={{
                border: '1px solid var(--color-bg-muted)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
                backgroundColor: 'var(--color-bg-subtle)',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-bg-muted)', paddingBottom: 'var(--space-2)' }}>
                <span style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', color: 'var(--color-primary)' }}>
                  Cluster #{idx + 1} • Similarity: {(cluster.similarityScore * 100).toFixed(0)}%
                </span>

                {/* Resolution Buttons */}
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button
                    onClick={() => handleDecision(cluster.id, 'keep_all')}
                    className={`btn ${decision === 'keep_all' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '11px', padding: '2px 8px', minHeight: '28px' }}
                  >
                    Keep Both
                  </button>
                  <button
                    onClick={() => handleDecision(cluster.id, 'keep_first')}
                    className={`btn ${decision === 'keep_first' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '11px', padding: '2px 8px', minHeight: '28px' }}
                  >
                    Keep Primary Only
                  </button>
                  <button
                    onClick={() => handleDecision(cluster.id, 'merge')}
                    className={`btn ${decision === 'merge' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '11px', padding: '2px 8px', minHeight: '28px' }}
                  >
                    Merge Rationales
                  </button>
                </div>
              </div>

              {/* Side by Side Comparison Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                
                {/* Primary Question */}
                <div style={{ backgroundColor: '#fff', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>
                    Item A (Row #{primaryQ?.rowNumber || 1})
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-2)' }}>
                    {primaryQ?.stem}
                  </p>
                  <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                    <strong>Ans:</strong> {primaryQ?.correctAnswer} • <strong>Exp:</strong> {primaryQ?.rationale.slice(0, 80)}...
                  </div>
                </div>

                {/* Duplicate Question(s) */}
                <div style={{ backgroundColor: '#fff', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)' }}>
                  {duplicates.map((dup, dIdx) => (
                    <div key={dIdx}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#92400e', textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>
                        Item B (Row #{dup.rowNumber})
                      </div>
                      <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-2)' }}>
                        {dup.stem}
                      </p>
                      <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                        <strong>Ans:</strong> {dup.correctAnswer} • <strong>Exp:</strong> {dup.rationale.slice(0, 80)}...
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
