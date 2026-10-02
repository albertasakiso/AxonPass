/* ===================================================================
   APILIGU LEARNING PASS — App Header
   Features Global Certification Track Selector, Real-Time Sync & Streak
   =================================================================== */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSyncStore } from '../../stores/syncStore';
import { useAuthStore } from '../../stores/authStore';
import { useProgressStore } from '../../stores/progressStore';
import { supabase } from '../../lib/supabase';
import { AuthModal } from '../auth/AuthModal';
import { UserProfileModal } from '../profile/UserProfileModal';
import type { Certification } from '../../types';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'Learning Pass' }: HeaderProps) {
  const navigate = useNavigate();
  const { status, isOnline, pendingCount } = useSyncStore();
  const { user, isAuthenticated, activeCertificationSlug, setActiveCertification } = useAuthStore();
  const { streakDays } = useProgressStore();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'sign_in' | 'sign_up'>('sign_up');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    async function loadCerts() {
      const { data } = await supabase.from('certifications').select('*').order('created_at');
      if (data && data.length > 0) {
        setCertifications(data);
      }
    }
    loadCerts();
  }, []);

  const getSyncLabel = () => {
    if (!isOnline) return { className: 'sync-offline', text: 'Offline', dot: '' };
    if (status === 'pending') return { className: 'sync-pending', text: `${pendingCount} syncing`, dot: 'pulse' };
    if (status === 'error') return { className: 'sync-pending', text: 'Sync Error', dot: '' };
    return { className: 'sync-synced', text: 'Synced', dot: '' };
  };

  const sync = getSyncLabel();

  return (
    <>
      <header className="app-header">
        {/* Left: App Brand & Track Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <button
            onClick={() => navigate('/')}
            className="btn-ghost"
            style={{
              padding: '4px 6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 'bold',
              color: 'var(--color-primary)',
            }}
            title="Go to Home"
          >
            <span style={{ fontSize: '1.2rem' }}>📘</span>
            <span className="app-header-title mobile-only">{title}</span>
          </button>

          {certifications.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <select
                value={activeCertificationSlug}
                onChange={(e) => setActiveCertification(e.target.value)}
                className="input"
                style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '2px 8px',
                  height: '28px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderColor: 'var(--border-color)',
                  cursor: 'pointer',
                  maxWidth: '140px',
                }}
                title="Switch Exam Track"
              >
                {certifications.map((c) => (
                  <option key={c.id} value={c.slug}>
                    🎯 {c.code || c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right: Streak, Sync Badge, Coursera Account Controls & Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {/* Streak Pill */}
          <div
            onClick={() => navigate('/insights')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#b45309',
              backgroundColor: '#fef3c7',
              border: '1px solid #fde68a',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
            }}
            title={`${streakDays} Day Study Streak`}
          >
            <span>🔥</span>
            <span>{streakDays}d</span>
          </div>

          {/* Sync Indicator */}
          <div className={`sync-indicator ${sync.className}`} style={{ fontSize: '11px', padding: '2px 8px' }}>
            <span className={`sync-dot ${sync.dot}`} aria-hidden="true" />
            <span className="desktop-only">{sync.text}</span>
          </div>

          {/* User Account / Coursera Auth Controls */}
          {isAuthenticated && user ? (
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="btn-ghost"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '2px 8px 2px 4px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
              }}
              title="Open Learner Profile & Study Goals"
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {(user.full_name || user.email || 'U').slice(0, 2).toUpperCase()}
              </div>
              <span
                className="desktop-only"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-ink)',
                  maxWidth: '100px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.full_name?.split(' ')[0] || user.email.split('@')[0]}
              </span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => {
                  setAuthModalMode('sign_in');
                  setIsAuthModalOpen(true);
                }}
                className="btn btn-ghost btn-xs"
                style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px' }}
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('sign_up');
                  setIsAuthModalOpen(true);
                }}
                className="btn btn-primary btn-xs"
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                }}
              >
                Join for Free
              </button>
            </div>
          )}

          {/* Mobile Settings Icon */}
          <button
            onClick={() => navigate('/settings')}
            className="btn btn-ghost btn-sm mobile-only"
            style={{ padding: '4px', width: '32px', height: '32px', minHeight: '32px', borderRadius: 'var(--radius-full)' }}
            title="Settings & Preferences"
            aria-label="Settings"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Coursera-Style Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authModalMode}
      />

      {/* Coursera-Style User Profile & Learning Management Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}

