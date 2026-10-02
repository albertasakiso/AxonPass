/* ===================================================================
   APILIGU LEARNING PASS — Import Batch History View
   Audit trail for past import runs and provenance tracking (§7.5).
   =================================================================== */

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { ImportBatch } from '../../types';

export const BatchHistoryView: React.FC = () => {
  const [batches, setBatches] = useState<ImportBatch[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBatches = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('import_batches')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setBatches(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBatches();
  }, []);

  return (
    <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: 0 }}>
            Import Provenance & Batch History
          </h2>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)', margin: '2px 0 0 0' }}>
            Auditable log of all past document extractions, parsed question counts, and validation metrics.
          </p>
        </div>
        <button onClick={loadBatches} className="btn btn-secondary" style={{ fontSize: 'var(--text-xs)' }}>
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <div className="animate-spin" style={{ fontSize: '1.8rem', color: 'var(--color-primary)' }}>⟳</div>
        </div>
      ) : batches.length === 0 ? (
        <div className="card text-center" style={{ padding: 'var(--space-8)', backgroundColor: 'var(--color-bg-subtle)' }}>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>No external import batches logged yet.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-bg-muted)', borderRadius: 'var(--radius-lg)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-subtle)', borderBottom: '2px solid var(--color-bg-muted)', textAlign: 'left' }}>
                <th style={{ padding: 'var(--space-3)' }}>Import Date</th>
                <th style={{ padding: 'var(--space-3)' }}>Source Filename</th>
                <th style={{ padding: 'var(--space-3)' }}>Type</th>
                <th style={{ padding: 'var(--space-3)' }}>Questions Found</th>
                <th style={{ padding: 'var(--space-3)' }}>Flagged Issues</th>
                <th style={{ padding: 'var(--space-3)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--color-bg-muted)' }}>
                  <td style={{ padding: 'var(--space-3)', fontFamily: 'var(--font-mono)' }}>
                    {b.created_at ? new Date(b.created_at).toLocaleString() : 'Recent'}
                  </td>
                  <td style={{ padding: 'var(--space-3)', fontWeight: 'bold' }}>
                    📄 {b.filename}
                  </td>
                  <td style={{ padding: 'var(--space-3)', textTransform: 'uppercase' }}>
                    {b.file_type || 'docx'}
                  </td>
                  <td style={{ padding: 'var(--space-3)', fontFamily: 'var(--font-mono)' }}>
                    {b.questions_found || 0}
                  </td>
                  <td style={{ padding: 'var(--space-3)', color: (b.questions_flagged || 0) > 0 ? 'var(--color-warning)' : 'var(--color-ink-muted)' }}>
                    {b.questions_flagged || 0}
                  </td>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', fontWeight: 'bold' }}>
                      {b.status || 'published'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
