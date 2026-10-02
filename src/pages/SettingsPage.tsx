/* ===================================================================
   APILIGU LEARNING PASS — Settings Page
   Manages certification track, theme, study targets, data export, and session.
   =================================================================== */

import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore';
import type { Certification } from '../types';
import AiClusterConfigPanel from '../components/admin/AiClusterConfigPanel';
import FreeTierStorageMonitor from '../components/admin/FreeTierStorageMonitor';

export default function SettingsPage() {
  const { user, signOut, activeCertificationSlug, setActiveCertification } = useAuthStore();
  const { refreshProgress } = useProgressStore();
  const isAdmin = user?.role === 'owner' || user?.role === 'admin';

  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [themeMode, setThemeMode] = useState<string>(() => {
    return localStorage.getItem('alp_theme_mode') || 'system';
  });
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(() => {
    return parseInt(localStorage.getItem('alp_daily_goal') || '60', 10);
  });
  const [studyReminders, setStudyReminders] = useState<boolean>(() => {
    return localStorage.getItem('alp_reminder_study') !== 'false';
  });
  const [breakReminders, setBreakReminders] = useState<boolean>(() => {
    return localStorage.getItem('alp_reminder_break') !== 'false';
  });
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    async function loadCerts() {
      const { data } = await supabase.from('certifications').select('*').order('created_at');
      if (data) setCertifications(data);
    }
    loadCerts();
  }, []);

  const handleThemeChange = (mode: string) => {
    setThemeMode(mode);
    localStorage.setItem('alp_theme_mode', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else if (mode === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.documentElement.classList.remove('light-theme');
    }
  };

  const handleGoalChange = (minutes: number) => {
    setDailyGoalMinutes(minutes);
    localStorage.setItem('alp_daily_goal', minutes.toString());
  };

  const toggleStudyReminders = () => {
    const next = !studyReminders;
    setStudyReminders(next);
    localStorage.setItem('alp_reminder_study', next.toString());
  };

  const toggleBreakReminders = () => {
    const next = !breakReminders;
    setBreakReminders(next);
    localStorage.setItem('alp_reminder_break', next.toString());
  };

  const handleExportData = async () => {
    try {
      const progress = await db.userProgress.toArray();
      const sessions = await db.quizSessions.toArray();
      const answers = await db.sessionAnswers.toArray();

      const currentCert = certifications.find(c => c.slug === activeCertificationSlug);

      const exportData = {
        exportedAt: new Date().toISOString(),
        user: user?.email || 'local_owner',
        certification: currentCert?.name || 'CISA (28th Edition)',
        progressSummary: {
          totalQuestionsTracked: progress.length,
          totalSessionsTaken: sessions.length,
          totalAnswersLogged: answers.length,
        },
        progress,
        sessions,
        answers,
      };

      const jsonStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `learningpass_${activeCertificationSlug}_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setExportNotice('✓ Progress data successfully exported to JSON file.');
      setTimeout(() => setExportNotice(null), 5000);
    } catch (err: any) {
      setExportNotice(`Export failed: ${err.message}`);
    }
  };

  const handleResetProgress = async () => {
    try {
      if (user?.id) {
        await db.userProgress.where('user_id').equals(user.id).delete();
        await db.quizSessions.where('user_id').equals(user.id).delete();
      } else {
        await db.userProgress.clear();
        await db.quizSessions.clear();
        await db.sessionAnswers.clear();
      }
      await refreshProgress();
      setShowResetConfirm(false);
      setExportNotice('✓ Your personal learning progress and quiz history has been reset.');
      setTimeout(() => setExportNotice(null), 5000);
    } catch (err: any) {
      setExportNotice(`Reset failed: ${err.message}`);
    }
  };

  return (
    <div style={{ paddingBottom: 'var(--space-12)' }}>
      <div className="mb-6">
        <h1 className="mb-1">Settings &amp; Preferences</h1>
        <p className="text-muted">Customize your exam track, appearance, study targets, and data backups</p>
      </div>

      {exportNotice && (
        <div
          className="mb-6 p-3 badge-success"
          style={{
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
          }}
        >
          {exportNotice}
        </div>
      )}

      {/* Profile & Certification Track */}
      <div className="settings-section">
        <h3>Exam Track &amp; Architecture</h3>
        <div className="card">
          <div className="card-body">
            <div className="settings-row">
              <div className="settings-label">
                <h4>Active Exam Blueprint</h4>
                <p>Switch your primary learning syllabus and question bank</p>
              </div>
              <select
                value={activeCertificationSlug}
                onChange={(e) => setActiveCertification(e.target.value)}
                className="input"
                style={{ width: 'auto', minWidth: '220px', fontWeight: 'bold', fontSize: 'var(--text-xs)' }}
              >
                {certifications.map((c) => (
                  <option key={c.id} value={c.slug}>
                    🎯 {c.name || c.code}
                  </option>
                ))}
              </select>
            </div>

            <div className="settings-row">
              <div className="settings-label">
                <h4>Database Engine</h4>
                <p>Offline-First IndexedDB (Dexie.js) + Supabase Cloud Sync</p>
              </div>
              <span className="badge badge-success">Offline Ready</span>
            </div>

            <div className="settings-row">
              <div className="settings-label">
                <h4>Timezone</h4>
                <p>Used for daily streaks and review scheduling</p>
              </div>
              <span className="text-sm text-muted">
                {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scalable AI Compute Cluster & Multi-Machine Configuration (Admins & Owners Only) */}
      {isAdmin && (
        <div className="settings-admin-boundary mb-8">
          <div className="mb-3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                backgroundColor: 'rgba(234, 179, 8, 0.15)',
                border: '1px solid rgba(234, 179, 8, 0.4)',
                color: '#ca8a04',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              🛡️ Infrastructure &amp; System Configuration (Admin Only)
            </span>
          </div>
          <AiClusterConfigPanel />
          <FreeTierStorageMonitor />
        </div>
      )}

      {/* Appearance & Themes */}
      <div className="settings-section">
        <h3>Appearance</h3>
        <div className="card">
          <div className="card-body">
            <div className="settings-row">
              <div className="settings-label">
                <h4>Theme Mode</h4>
                <p>Adjust visual contrast and color palette</p>
              </div>
              <div className="flex gap-2">
                {[
                  { id: 'system', label: '💻 Auto' },
                  { id: 'light', label: '☀️ Light' },
                  { id: 'dark', label: '🌙 Dark' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`btn btn-sm ${themeMode === t.id ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handleThemeChange(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Study Goals */}
      <div className="settings-section">
        <h3>Study Goals &amp; Pacing</h3>
        <div className="card">
          <div className="card-body">
            <div className="settings-row">
              <div className="settings-label">
                <h4>Daily Study Target</h4>
                <p>Target minutes of active study per day</p>
              </div>
              <div className="flex gap-2">
                {[30, 45, 60, 90, 120].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`btn btn-sm ${dailyGoalMinutes === m ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handleGoalChange(m)}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
            <div className="settings-row">
              <div className="settings-label">
                <h4>Timer Compression</h4>
                <p>Simulation pacing acceleration factor</p>
              </div>
              <span className="text-mono font-bold text-primary">-15% factor (~82s/Q)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications & Reminders */}
      <div className="settings-section">
        <h3>Study Reminders</h3>
        <div className="card">
          <div className="card-body">
            <div className="settings-row">
              <div className="settings-label">
                <h4>Daily Spaced Repetition Reminder</h4>
                <p>Prompts you when Leitner review items are due</p>
              </div>
              <button
                type="button"
                className={`btn btn-sm ${studyReminders ? 'btn-success' : 'btn-ghost'}`}
                onClick={toggleStudyReminders}
              >
                {studyReminders ? '✓ Enabled' : 'Disabled'}
              </button>
            </div>
            <div className="settings-row">
              <div className="settings-label">
                <h4>Ergonomic Break Reminders</h4>
                <p>Suggests a 5-minute break after 45 minutes of continuous study</p>
              </div>
              <button
                type="button"
                className={`btn btn-sm ${breakReminders ? 'btn-success' : 'btn-ghost'}`}
                onClick={toggleBreakReminders}
              >
                {breakReminders ? '✓ Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="settings-section">
        <h3>Data &amp; Privacy</h3>
        <div className="card">
          <div className="card-body">
            <div className="settings-row">
              <div className="settings-label">
                <h4>Export Progress Backup</h4>
                <p>Download complete Leitner progress, quiz attempts, and scores as JSON</p>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={handleExportData}
              >
                📥 Export JSON Backup
              </button>
            </div>
            <div className="settings-row">
              <div className="settings-label">
                <h4>Question Bank Privacy</h4>
                <p>All imported question banks are isolated to your private client database</p>
              </div>
              <span className="badge badge-success">Zero Third-Party Sharing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="settings-section">
        <h3 style={{ color: 'var(--color-error)' }}>Danger Zone</h3>
        <div className="card" style={{ borderColor: 'var(--color-error-border)' }}>
          <div className="card-body">
            <div className="settings-row">
              <div className="settings-label">
                <h4>Reset Learning Progress</h4>
                <p>Clear all local quiz sessions, Leitner box progress, and accuracy stats.</p>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                onClick={() => setShowResetConfirm(true)}
              >
                🗑️ Reset Progress
              </button>
            </div>

            <div className="settings-row">
              <div className="settings-label">
                <h4>Sign Out</h4>
                <p>Sign out of your Supabase account session. All local offline study data remains intact.</p>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-error"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="reader-modal-overlay animate-fade-in" onClick={() => setShowResetConfirm(false)}>
          <div className="card" style={{ maxWidth: '440px', margin: 'auto', padding: 'var(--space-6)' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: 'var(--color-error)', margin: '0 0 var(--space-2) 0' }}>⚠️ Reset All Progress?</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)', marginBottom: 'var(--space-6)' }}>
              This will erase all test attempts, Leitner memory box statistics, and study streak records from your browser's IndexedDB. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-error btn-sm"
                onClick={handleResetProgress}
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

