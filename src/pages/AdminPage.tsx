/* ===================================================================
   APILIGU LEARNING PASS — Enterprise Admin & Content Studio
   Unified management hub for Multi-File Import Wizard, Question Bank Manager,
   Field Mapping Studio, Duplicate Clustering, and Template Generation (§7.5).
   =================================================================== */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { ImportWizard } from '../components/admin/ImportWizard';
import { QuestionBankManager } from '../components/admin/QuestionBankManager';
import { BatchHistoryView } from '../components/admin/BatchHistoryView';
import { AiIngestionAuditView } from '../components/admin/AiIngestionAuditView';
import { UserManager } from '../components/admin/UserManager';
import { downloadExcelQuestionTemplate } from '../lib/parser/templateGenerator';
import { QUESTIONS_TEMPLATE, ANSWERS_TEMPLATE, type Certification, type Domain } from '../types';

type AdminTab = 'users' | 'ai-audit' | 'import' | 'questions' | 'templates' | 'batches' | 'overview';

export default function AdminPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'owner' || user?.role === 'admin';

  const [activeTab, setActiveTab] = useState<AdminTab>('ai-audit');
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [stats, setStats] = useState<{
    totalQuestions: number;
    verifiedQuestions: number;
    totalCertifications: number;
    totalDomains: number;
  }>({
    totalQuestions: 0,
    verifiedQuestions: 0,
    totalCertifications: 0,
    totalDomains: 0,
  });

  const loadData = async () => {
    // Certs
    const { data: certData } = await supabase.from('certifications').select('*').order('created_at');
    if (certData) setCertifications(certData);

    // Domains
    const { data: domData } = await supabase.from('domains').select('*').order('domain_number');
    if (domData) setDomains(domData);

    // Questions count
    const { count: totalQ } = await supabase.from('questions').select('*', { count: 'exact', head: true });
    const { count: verifiedQ } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('source_confidence', 'verified');

    setStats({
      totalQuestions: totalQ || 0,
      verifiedQuestions: verifiedQ || 0,
      totalCertifications: certData?.length || 0,
      totalDomains: domData?.length || 0,
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const downloadCsvTemplate = (template: typeof QUESTIONS_TEMPLATE) => {
    let csv = template.requiredColumns.join(',') + (template.optionalColumns.length ? ',' + template.optionalColumns.join(',') : '') + '\n';
    if (template.sampleData.length > 0) {
      const row = template.sampleData[0];
      const cols = [...template.requiredColumns, ...template.optionalColumns];
      csv += cols.map((c) => `"${row[c] || ''}"`).join(',') + '\n';
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = template.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'users', label: '👥 User & Access Management', icon: '👥' },
    { id: 'ai-audit', label: '🧠 AI Ingestion & ML Audit (100%)', icon: '🧠' },
    { id: 'import', label: '📥 Import Pipeline & Wizard', icon: '📥' },
    { id: 'questions', label: '❓ Question Bank Manager', icon: '❓' },
    { id: 'templates', label: '📋 Download Templates', icon: '📋' },
    { id: 'batches', label: '📜 Batch History & Audit', icon: '📜' },
    { id: 'overview', label: '📊 System Overview', icon: '📊' },
  ];

  if (!isAdmin) {
    return (
      <div style={{ padding: 'var(--space-12) var(--space-4)', textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🛡️</div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
          Access Restricted
        </h2>
        <p style={{ color: 'var(--color-ink-muted)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-6)' }}>
          The Enterprise Admin &amp; Content Studio is restricted to system administrators and owners. Your current role is <strong>{user?.role || 'learner'}</strong>.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          ← Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 'var(--space-12)' }}>
      
      {/* Header Banner */}
      <div className="learn-header-banner">
        <div>
          <div className="learn-header-badge">
            <span>⚙️</span> Enterprise Content Studio & Pipeline
          </div>
          <h1 className="learn-header-title">
            Admin & Content Studio
          </h1>
          <p className="learn-header-desc">
            Universal offline parser for Word (.docx), Excel (.xlsx/.xls), CSV, and JSON. Features interactive field mapping, answer discrepancy resolution, and duplicate clustering.
          </p>
        </div>

        {/* Global Stats Pill */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <div style={{ padding: 'var(--space-2) var(--space-4)', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {stats.totalQuestions.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Questions in DB</div>
          </div>

          <div style={{ padding: 'var(--space-2) var(--space-4)', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: '#86efac', fontFamily: 'var(--font-mono)' }}>
              {stats.verifiedQuestions.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Verified Keys</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation Bar */}
      <div className="segmented-nav mb-6" role="tablist" style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`segmented-pill ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: ENTERPRISE USER & ACCESS MANAGEMENT */}
      {activeTab === 'users' && (
        <UserManager certifications={certifications} />
      )}

      {/* TAB 0: AI INGESTION & TRAINING AUDIT (100% COVERAGE & ZERO-STORAGE) */}
      {activeTab === 'ai-audit' && (
        <AiIngestionAuditView certifications={certifications} />
      )}

      {/* TAB 1: MASTER IMPORT WIZARD */}
      {activeTab === 'import' && (
        <ImportWizard
          certifications={certifications}
          domains={domains}
          onImportComplete={loadData}
        />
      )}

      {/* TAB 2: QUESTION BANK MANAGER */}
      {activeTab === 'questions' && (
        <QuestionBankManager
          certifications={certifications}
          domains={domains}
        />
      )}

      {/* TAB 3: DOWNLOAD TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: 0 }}>
              Standard Question Import Templates
            </h2>
            <p className="text-muted" style={{ fontSize: 'var(--text-xs)', margin: '4px 0 0 0' }}>
              Download our pre-styled templates to prepare questions for bulk import into the platform.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
            
            {/* Template Card 1: Excel .XLSX */}
            <div className="practice-mode-card">
              <div>
                <div className="practice-icon-box" style={{ backgroundColor: 'var(--color-success-bg)', borderColor: 'var(--color-success-border)' }}>
                  📊
                </div>
                <h3 className="practice-card-title">Microsoft Excel (.XLSX)</h3>
                <p className="practice-card-desc">
                  Full workbook with formatted column widths, field validation rules, and sample multi-choice questions.
                </p>
              </div>
              <button
                onClick={downloadExcelQuestionTemplate}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                📥 Download Excel Template (.XLSX)
              </button>
            </div>

            {/* Template Card 2: Standard CSV */}
            <div className="practice-mode-card">
              <div>
                <div className="practice-icon-box">
                  📄
                </div>
                <h3 className="practice-card-title">Standard Questions (.CSV)</h3>
                <p className="practice-card-desc">
                  Comma-separated file containing question stem, options A-D, correct answer, and detailed rationales.
                </p>
              </div>
              <button
                onClick={() => downloadCsvTemplate(QUESTIONS_TEMPLATE)}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                📥 Download Questions (.CSV)
              </button>
            </div>

            {/* Template Card 3: Separate Answer Key CSV */}
            <div className="practice-mode-card">
              <div>
                <div className="practice-icon-box" style={{ backgroundColor: 'var(--color-primary-100)', borderColor: 'var(--color-primary-200)' }}>
                  🔑
                </div>
                <h3 className="practice-card-title">Separate Answer Key (.CSV)</h3>
                <p className="practice-card-desc">
                  Ideal for Dual-File mode: maps question IDs to correct answer choices and explanation notes.
                </p>
              </div>
              <button
                onClick={() => downloadCsvTemplate(ANSWERS_TEMPLATE)}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                📥 Download Answer Key (.CSV)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: BATCH HISTORY & AUDIT */}
      {activeTab === 'batches' && (
        <BatchHistoryView />
      )}

      {/* TAB 5: SYSTEM OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="card text-center" style={{ padding: 'var(--space-6)' }}>
              <div className="stat-value" style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-primary)' }}>
                {stats.totalCertifications}
              </div>
              <div className="stat-label">Certification Tracks</div>
            </div>
            <div className="card text-center" style={{ padding: 'var(--space-6)' }}>
              <div className="stat-value" style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-primary)' }}>
                {stats.totalDomains}
              </div>
              <div className="stat-label">Total Exam Domains</div>
            </div>
            <div className="card text-center" style={{ padding: 'var(--space-6)' }}>
              <div className="stat-value" style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-primary)' }}>
                {stats.totalQuestions.toLocaleString()}
              </div>
              <div className="stat-label">Questions in Live DB</div>
            </div>
            <div className="card text-center" style={{ padding: 'var(--space-6)' }}>
              <div className="stat-value" style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-success)' }}>
                {stats.verifiedQuestions.toLocaleString()}
              </div>
              <div className="stat-label">Verified Corroborated</div>
            </div>
          </div>

          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: 'var(--space-4)', color: 'var(--color-primary)' }}>
              Architecture & Compliance Summary (§7.5)
            </h3>
            <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', lineHeight: 1.8, paddingLeft: 'var(--space-4)' }}>
              <li><strong>Local-First Parsing:</strong> Word (.docx via Mammoth), Excel (.xlsx/.xls via SheetJS), CSV, and JSON parse 100% on the client device without commercial runtime LLM API costs.</li>
              <li><strong>Multi-File Mapping:</strong> Separate question files and answer key documents can be merged side-by-side with discrepancy detection.</li>
              <li><strong>Near-Duplicate Clustering:</strong> N-gram token Jaccard similarity algorithms group near-duplicates for human admin review.</li>
              <li><strong>Idempotent Sync:</strong> All imported questions are staged to local IndexedDB and published to Supabase PostgreSQL with unique UUID keys and batch provenance logs.</li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}
