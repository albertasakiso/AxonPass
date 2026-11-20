/* ===================================================================
   ANOXPASS — 3-Tier Local-First & Compact Supabase Storage Panel
   Displays live local RAG compression stats & Supabase DB footprint.
   =================================================================== */

import { useEffect, useState } from 'react';
import {
  fetchLocalStorageStats,
  type LocalStorageStats,
} from '../../lib/ai/localCoachService';
import {
  fetchSynthesisJobProgress,
  type SynthesisJobRow,
} from '../../lib/synthesizedCloudContent';
import { supabase } from '../../lib/supabase';

interface SupabaseTableAuditRow {
  table_name?: string;
  total_mb?: number;
  row_estimate?: number;
}

const SYNTHESIS_CMD = 'python local_ai_pipeline.py --synthesize-all --sync-supabase';

export function StorageEfficiencyPanel() {
  const [localStats, setLocalStats] = useState<LocalStorageStats | null>(null);
  const [dbAudit, setDbAudit] = useState<SupabaseTableAuditRow[]>([]);
  const [synthesisJobs, setSynthesisJobs] = useState<SynthesisJobRow[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchLocalStorageStats().then(setLocalStats).catch(() => {});
    fetchSynthesisJobProgress().then(setSynthesisJobs).catch(() => {});

    supabase
      .rpc('get_supabase_storage_audit')
      .then(
        ({ data }) => {
          if (Array.isArray(data)) {
            setDbAudit(data.slice(0, 5) as SupabaseTableAuditRow[]);
          }
        },
        () => {}
      );
  }, []);

  const totalTopTablesMb = dbAudit.reduce((sum, r) => sum + Number(r.total_mb || 0), 0);
  const totalSynthLessons = synthesisJobs.reduce((sum, j) => sum + j.lessons_created, 0);
  const totalSynthQuestions = synthesisJobs.reduce((sum, j) => sum + j.questions_created, 0);

  function handleCopyCommand() {
    navigator.clipboard?.writeText(SYNTHESIS_CMD).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  return (
    <section className="storage-panel" aria-label="Storage Efficiency Architecture">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="tier-badge tier-badge--1">3-Tier Hybrid Storage</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-ink-muted)' }}>
              {localStats?.bridgeOnline
                ? `Local Bridge Online · ${localStats.compression_savings_percent.toFixed(1)}% Saved`
                : 'Zero Raw PDFs & Zero Float32 Vectors in Cloud'}
            </span>
          </div>
          <h3 style={{ margin: '4px 0 0', fontSize: 'var(--text-base)', fontFamily: 'var(--font-display)' }}>
            💾 Local-First RAG + Compact Supabase Sync (&le; {localStats?.supabase_budget_cap_mb ?? 25} MB Cloud Cap)
          </h3>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-xs"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? 'Hide Details ▲' : 'Inspect Storage & CLI ▼'}
        </button>
      </div>

      <div className="storage-tiers-grid">
        <div className="storage-tier-card">
          <strong>Tier 1 · Local Corpus &amp; Int8 RAG</strong>
          <p style={{ margin: '4px 0 0', color: 'var(--color-ink-muted)' }}>
            Raw PDFs &amp; dense vectors stay 100% local in <code>ml_engine/</code> (zlib + int8 quantization, SHA-256 dedup).
            {localStats?.bridgeOnline && (
              <>
                <br />
                <strong>{localStats.optimized_local_mb.toFixed(1)} MB</strong> ({localStats.unique_chunks.toLocaleString()} chunks)
              </>
            )}
          </p>
        </div>

        <div className="storage-tier-card">
          <strong>Tier 2 · Compact Cloud Pack (&le; 25 MB)</strong>
          <p style={{ margin: '4px 0 0', color: 'var(--color-ink-muted)' }}>
            Only distilled study units &amp; <code>tsvector</code> FTS in Postgres <code>knowledge_units</code> — zero raw blobs, zero pgvector bloat.
            {localStats?.bridgeOnline && localStats.compact_cloud_pack_gz_mb > 0 && (
              <>
                <br />
                Pack size: <strong>{localStats.compact_cloud_pack_gz_mb.toFixed(2)} MB</strong> gz
              </>
            )}
          </p>
        </div>

        <div className="storage-tier-card">
          <strong>Tier 3 · Realtime Progress Sync</strong>
          <p style={{ margin: '4px 0 0', color: 'var(--color-ink-muted)' }}>
            Lightweight JSON progress, FSRS cards, XP &amp; notes synced via Supabase Realtime + localStorage fallback.
            {dbAudit.length > 0 && (
              <>
                <br />
                Top 5 DB tables: <strong>{totalTopTablesMb.toFixed(1)} MB</strong>
              </>
            )}
          </p>
        </div>
      </div>

      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-3)' }}>
          {dbAudit.length > 0 && (
            <div>
              <strong style={{ fontSize: 'var(--text-xs)' }}>Live Supabase Table Footprint (Top 5)</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                {dbAudit.map((row, idx) => (
                  <span key={row.table_name || idx} className="tier-badge tier-badge--2">
                    {row.table_name}: {Number(row.total_mb || 0).toFixed(1)} MB
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <strong style={{ fontSize: 'var(--text-xs)' }}>
                Cloud Synthesis &amp; Compact Ingestion CLI
                {synthesisJobs.length > 0 && (
                  <> · {totalSynthLessons} Cloud Lessons · {totalSynthQuestions} Exam Qs</>
                )}
              </strong>
              <button
                type="button"
                className="btn btn-primary btn-xs"
                onClick={handleCopyCommand}
              >
                {copied ? '✓ Copied!' : '📋 Copy Overnight Synthesizer Cmd'}
              </button>
            </div>
            <div className="concept-formula" style={{ marginTop: '6px', whiteSpace: 'pre-wrap' }}>
              {`${SYNTHESIS_CMD}\npython local_ai_pipeline.py --optimize-storage\npython local_ai_pipeline.py --export-compact-pack --max-mb 25`}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default StorageEfficiencyPanel;
