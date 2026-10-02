/* ===================================================================
   AXONPASS — Coursera-Style User Profile & Learning Management Modal
   Comprehensive learner management: study targets, target exam countdown,
   cross-device cloud sync, readiness metrics, and account settings.
   =================================================================== */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useProgressStore } from '../../stores/progressStore';
import { syncUserProgressToCloud, type SyncResult } from '../../lib/syncUserProgress';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/db';
import type { Certification } from '../../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { user, updateProfile, signOut, activeCertificationSlug, setActiveCertification } = useAuthStore();
  const {
    streakDays,
    totalAttempted,
    totalCorrect,
    overallAccuracy,
    totalStudyMinutes,
    predictedScaledScore,
    refreshProgress,
  } = useProgressStore();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [dailyGoal, setDailyGoal] = useState<number>(user?.daily_study_goal_minutes || 45);
  const [targetExamDate, setTargetExamDate] = useState<string>(user?.target_exam_date || '');
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Self-Service: Password Update
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Self-Service: Account Deletion Request
  const [userStatus, setUserStatus] = useState<string>(user?.status || 'active');
  const [deletionFeedback, setDeletionFeedback] = useState<string | null>(null);

  // Sync state with store on open
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setDailyGoal(user.daily_study_goal_minutes || 45);
      setTargetExamDate(user.target_exam_date || '');
    }
  }, [user, isOpen]);

  // Load certifications
  useEffect(() => {
    async function loadCerts() {
      const { data } = await supabase.from('certifications').select('*').order('created_at');
      if (data && data.length > 0) setCertifications(data);
    }
    loadCerts();
  }, []);

  if (!isOpen || !user) return null;

  // Calculate days remaining to exam
  const daysToExam = targetExamDate ? Math.ceil((new Date(targetExamDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  // Initials for avatar
  const initials = (user.full_name || user.email || 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveFeedback(null);
    try {
      const ok = await updateProfile({
        full_name: fullName.trim(),
        daily_study_goal_minutes: dailyGoal,
        target_exam_date: targetExamDate || null,
      });

      if (ok) {
        setSaveFeedback('✓ Profile and study goals saved successfully!');
        setTimeout(() => setSaveFeedback(null), 3000);
      } else {
        setSaveFeedback('⚠️ Failed to save changes.');
      }
    } catch {
      setSaveFeedback('⚠️ Error saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloudSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res: SyncResult = await syncUserProgressToCloud();
      if (res.success) {
        await refreshProgress();
        setSyncFeedback(`✓ Synced ${res.uploadedCount} local records to Cloud.`);
      } else {
        setSyncFeedback(`⚠️ Sync notice: ${res.error || 'Check connection'}`);
      }
    } catch (e: any) {
      setSyncFeedback(`⚠️ Sync failed: ${e.message}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(null), 4000);
    }
  };

  // Self-Service: Password Update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);
    if (newPassword.length < 6) {
      setPasswordFeedback({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPasswordFeedback({ type: 'error', message: error.message });
      } else {
        setPasswordFeedback({ type: 'success', message: '✓ Password updated successfully.' });
        setNewPassword('');
        setConfirmPassword('');
        setIsChangingPassword(false);
      }
    } catch (err: any) {
      setPasswordFeedback({ type: 'error', message: err.message || 'Failed to update password.' });
    }
  };

  // Self-Service: Account Deletion Request
  const handleRequestDeletion = async () => {
    try {
      const { error } = await supabase.rpc('self_request_account_deletion');
      if (error) {
        setDeletionFeedback(`⚠️ ${error.message}`);
      } else {
        setUserStatus('deletion_requested');
        setDeletionFeedback('✓ Account deletion request submitted. An administrator will review and process your request.');
      }
    } catch (err: any) {
      setDeletionFeedback(`⚠️ ${err.message}`);
    }
  };

  // Self-Service: Cancel Account Deletion Request
  const handleCancelDeletion = async () => {
    try {
      const { error } = await supabase.rpc('self_cancel_account_deletion');
      if (error) {
        setDeletionFeedback(`⚠️ ${error.message}`);
      } else {
        setUserStatus('active');
        setDeletionFeedback('✓ Account deletion request cancelled.');
      }
    } catch (err: any) {
      setDeletionFeedback(`⚠️ ${err.message}`);
    }
  };

  // Export Learning Transcript
  const handleExportData = async () => {
    try {
      const progress = await db.userProgress.toArray();
      const sessions = await db.quizSessions.toArray();
      const exportObject = {
        platform: 'AxonPass Learning Platform',
        exportedAt: new Date().toISOString(),
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          streakDays,
          totalStudyMinutes,
          overallAccuracy,
        },
        progress,
        sessions,
      };

      const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `axonpass_transcript_${user.email.split('@')[0]}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(`Export error: ${e.message}`);
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          overflowY: 'auto',
          padding: 0,
          border: '1px solid var(--border-color)',
        }}
      >
        {/* Coursera-Style Header Banner */}
        <div
          style={{
            padding: '24px 28px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
            color: '#fff',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#fff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            ✕
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Avatar Circle */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: '#fff',
                fontSize: '22px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                border: '3px solid rgba(255,255,255,0.4)',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  {user.full_name || 'Active Learner'}
                </h2>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor: 'rgba(59, 130, 246, 0.3)',
                    border: '1px solid rgba(147, 197, 253, 0.4)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    color: '#93c5fd',
                  }}
                >
                  {user.role === 'owner' ? '👑 Owner' : user.role === 'admin' ? '🛡️ Admin' : '🎓 Verified Learner'}
                </span>

                {(user.role === 'owner' || user.role === 'admin') && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/admin');
                    }}
                    className="btn btn-xs"
                    style={{
                      backgroundColor: '#f59e0b',
                      color: '#000',
                      fontWeight: 800,
                      fontSize: '10px',
                      borderRadius: 'var(--radius-full)',
                      padding: '2px 8px',
                      cursor: 'pointer',
                      border: 'none',
                    }}
                    title="Open Enterprise Admin & User Management Studio"
                  >
                    ⚙️ Admin Studio →
                  </button>
                )}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '2px' }}>
                {user.email}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.65, marginTop: '4px' }}>
                Member since {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Learning Stats Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            backgroundColor: 'var(--border-color)',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#b45309' }}>
              🔥 {streakDays}d
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-ink-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Study Streak
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary)' }}>
              {totalCorrect}/{totalAttempted}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-ink-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Correct / Seen
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#16a34a' }}>
              {overallAccuracy}%
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-ink-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Accuracy
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#7c3aed' }}>
              {predictedScaledScore ? `${predictedScaledScore}` : `${totalStudyMinutes}m`}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-ink-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              {predictedScaledScore ? 'Predicted Score' : 'Study Time'}
            </div>
          </div>
        </div>

        {/* Modal Body / Settings Form */}
        <div style={{ padding: '24px 28px' }}>
          {/* Cloud Synchronization Card */}
          <div
            className="card"
            style={{
              padding: '14px 16px',
              marginBottom: '20px',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>☁️</span> Cloud Progress Sync
                <span className="badge badge-success" style={{ fontSize: '10px' }}>Active</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                Syncs Leitner boxes, quiz history, and notes to your free cloud storage.
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloudSync}
              disabled={isSyncing}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <span>{isSyncing ? '⟳ Syncing...' : '🔄 Sync Progress'}</span>
            </button>
          </div>

          {syncFeedback && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: syncFeedback.startsWith('✓') ? '#dcfce7' : '#fee2e2',
                color: syncFeedback.startsWith('✓') ? '#166534' : '#991b1b',
                fontSize: '11px',
                marginBottom: '16px',
              }}
            >
              {syncFeedback}
            </div>
          )}

          {saveFeedback && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: saveFeedback.startsWith('✓') ? '#dcfce7' : '#fee2e2',
                color: saveFeedback.startsWith('✓') ? '#166534' : '#991b1b',
                fontSize: '11px',
                marginBottom: '16px',
              }}
            >
              {saveFeedback}
            </div>
          )}

          <form onSubmit={handleSaveProfile}>
            {/* Full Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                Learner Display Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your Full Name"
                className="input"
                style={{ width: '100%', fontSize: '13px' }}
              />
            </div>

            {/* Target Certification Track */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                Current Certification Track
              </label>
              <select
                value={activeCertificationSlug}
                onChange={(e) => setActiveCertification(e.target.value)}
                className="input"
                style={{ width: '100%', fontSize: '13px' }}
              >
                {certifications.map((c) => (
                  <option key={c.id} value={c.slug}>
                    🎯 {c.code || c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Exam Date & Countdown */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>
                  Target Exam Date
                </label>
                {daysToExam !== null && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: daysToExam > 0 ? 'var(--color-primary)' : '#dc2626',
                    }}
                  >
                    ⏱ {daysToExam > 0 ? `${daysToExam} days remaining` : daysToExam === 0 ? 'Exam is Today!' : 'Exam date passed'}
                  </span>
                )}
              </div>
              <input
                type="date"
                value={targetExamDate}
                onChange={(e) => setTargetExamDate(e.target.value)}
                className="input"
                style={{ width: '100%', fontSize: '13px' }}
              />
            </div>

            {/* Coursera-Style Daily Study Target */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>
                  Daily Study Goal
                </label>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {dailyGoal} minutes/day
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                {[15, 30, 45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyGoal(mins)}
                    style={{
                      padding: '8px 4px',
                      border: dailyGoal === mins ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                      backgroundColor: dailyGoal === mins ? 'var(--color-primary-subtle)' : 'var(--color-bg)',
                      color: dailyGoal === mins ? 'var(--color-primary)' : 'var(--color-ink)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Self-Service: Password Management */}
            <div
              className="card"
              style={{
                padding: '14px 16px',
                marginBottom: '16px',
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-ink)' }}>
                    🔐 Account Password
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                    Self-service credential management
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className="btn btn-xs btn-secondary"
                  style={{ fontSize: '11px' }}
                >
                  {isChangingPassword ? 'Cancel' : 'Change Password'}
                </button>
              </div>

              {isChangingPassword && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>
                      New Password (min 6 characters)
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="input"
                      style={{ width: '100%', fontSize: '12px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>
                      Repeat Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="input"
                      style={{ width: '100%', fontSize: '12px' }}
                    />
                  </div>
                  {passwordFeedback && (
                    <div
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '11px',
                        marginBottom: '8px',
                        backgroundColor: passwordFeedback.type === 'success' ? '#dcfce7' : '#fee2e2',
                        color: passwordFeedback.type === 'success' ? '#166534' : '#991b1b',
                      }}
                    >
                      {passwordFeedback.message}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleUpdatePassword}
                    className="btn btn-primary btn-xs"
                    style={{ fontWeight: 700 }}
                  >
                    Save New Password
                  </button>
                </div>
              )}
            </div>

            {/* Self-Service: Data Export & Privacy */}
            <div
              className="card"
              style={{
                padding: '14px 16px',
                marginBottom: '20px',
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-ink)' }}>
                    📦 Learning History &amp; Privacy
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                    Export your full study transcript or request account removal.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="btn btn-xs btn-secondary"
                  style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  title="Download complete question history and metrics JSON"
                >
                  <span>⬇</span> Export JSON
                </button>
              </div>

              {deletionFeedback && (
                <div
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    margin: '8px 0',
                    backgroundColor: deletionFeedback.startsWith('✓') ? '#dcfce7' : '#fee2e2',
                    color: deletionFeedback.startsWith('✓') ? '#166534' : '#991b1b',
                  }}
                >
                  {deletionFeedback}
                </div>
              )}

              <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                  {userStatus === 'deletion_requested'
                    ? '⚠️ Account deletion request pending review.'
                    : 'Need to permanently close your account?'}
                </span>
                {userStatus === 'deletion_requested' ? (
                  <button
                    type="button"
                    onClick={handleCancelDeletion}
                    className="btn btn-xs btn-secondary"
                    style={{ fontSize: '10px', fontWeight: 'bold' }}
                  >
                    Cancel Deletion Request
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRequestDeletion}
                    className="btn btn-xs btn-ghost"
                    style={{ fontSize: '10px', color: '#dc2626' }}
                  >
                    Request Deletion
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-primary"
                style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: 700 }}
              >
                {isSaving ? 'Saving...' : 'Save Study Goals'}
              </button>

              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  onClose();
                }}
                className="btn btn-secondary"
                style={{ padding: '10px 16px', fontSize: '13px', color: '#dc2626' }}
              >
                Sign Out
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
