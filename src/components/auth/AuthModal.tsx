/* ===================================================================
   AXONPASS — Coursera-Style Authentication Modal
   Seamless "Join for Free" / "Sign In" with goal-setting and
   automatic progress migration from guest session to cloud profile.
   =================================================================== */

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useProgressStore } from '../../stores/progressStore';
import { syncUserProgressToCloud } from '../../lib/syncUserProgress';
import { supabase } from '../../lib/supabase';
import { AxonPassLogo } from '../common/AxonPassLogo';
import type { Certification } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'sign_in' | 'sign_up';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'sign_up',
}) => {
  const [mode, setMode] = useState<'sign_in' | 'sign_up' | 'magic_link' | 'forgot_password'>(defaultMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dailyGoal, setDailyGoal] = useState<number>(30);
  const [selectedCertSlug, setSelectedCertSlug] = useState<string>('cisa');
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    signIn,
    signUp,
    signInWithMagicLink,
    resetPassword,
    activeCertificationSlug,
    setActiveCertification,
  } = useAuthStore();

  const { refreshProgress } = useProgressStore();

  useEffect(() => {
    if (defaultMode) setMode(defaultMode);
  }, [defaultMode, isOpen]);

  useEffect(() => {
    if (activeCertificationSlug) {
      setSelectedCertSlug(activeCertificationSlug);
    }
  }, [activeCertificationSlug]);

  // Load certifications for target track selector
  useEffect(() => {
    async function loadCerts() {
      const { data } = await supabase.from('certifications').select('*').order('created_at');
      if (data && data.length > 0) {
        setCertifications(data);
      }
    }
    loadCerts();
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLocalSuccess(null);
    setIsSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setLocalError('Please enter your email address.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (mode === 'sign_in') {
        if (!password) {
          setLocalError('Please enter your password.');
          setIsSubmitting(false);
          return;
        }
        const ok = await signIn(cleanEmail, password);
        if (ok) {
          await syncUserProgressToCloud();
          await refreshProgress();
          onClose();
        } else {
          setLocalError('Invalid email or password. Please verify your credentials.');
        }
      } else if (mode === 'sign_up') {
        if (password.length < 6) {
          setLocalError('Password must be at least 6 characters long.');
          setIsSubmitting(false);
          return;
        }
        const res = await signUp(cleanEmail, password, fullName);
        if (res.success) {
          if (res.requiresEmailConfirmation) {
            setLocalSuccess(`Confirmation email sent to ${cleanEmail}. Please check your inbox to activate your account.`);
          } else {
            // Update profile with goal & cert preference
            setActiveCertification(selectedCertSlug);
            await supabase.from('profiles').update({
              daily_study_goal_minutes: dailyGoal,
            }).eq('email', cleanEmail);
            
            // Sync any existing guest progress to new account
            await syncUserProgressToCloud();
            await refreshProgress(selectedCertSlug);
            onClose();
          }
        } else {
          setLocalError(res.message || 'Registration failed.');
        }
      } else if (mode === 'magic_link') {
        const ok = await signInWithMagicLink(cleanEmail);
        if (ok) {
          setLocalSuccess(`Magic sign-in link sent to ${cleanEmail}. Check your inbox.`);
        }
      } else if (mode === 'forgot_password') {
        const ok = await resetPassword(cleanEmail);
        if (ok) {
          setLocalSuccess(`Password reset instructions sent to ${cleanEmail}.`);
        }
      }
    } catch (err: any) {
      setLocalError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
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
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          padding: 0,
          border: '1px solid var(--border-color)',
        }}
      >
        {/* Modal Top Bar */}
        <div
          style={{
            padding: '24px 28px 16px 28px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <AxonPassLogo size={36} />
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.85, fontWeight: 'bold' }}>
                AxonPass Learning Platform
              </div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                {mode === 'sign_up' ? 'Join for Free' : mode === 'sign_in' ? 'Welcome Back' : 'Account Access'}
              </h2>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '12px', opacity: 0.85, lineHeight: 1.4 }}>
            {mode === 'sign_up'
              ? 'Build your mastery streak, sync Leitner boxes across all devices, and track exam readiness.'
              : 'Sign in to access your personal dashboard, review due questions, and study analytics.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--color-bg-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('sign_up');
              setLocalError(null);
              setLocalSuccess(null);
            }}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              borderBottom: mode === 'sign_up' ? '2px solid var(--color-primary)' : '2px solid transparent',
              backgroundColor: 'transparent',
              fontWeight: mode === 'sign_up' ? 700 : 500,
              color: mode === 'sign_up' ? 'var(--color-primary)' : 'var(--color-ink-muted)',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Join for Free
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('sign_in');
              setLocalError(null);
              setLocalSuccess(null);
            }}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              borderBottom: mode === 'sign_in' ? '2px solid var(--color-primary)' : '2px solid transparent',
              backgroundColor: 'transparent',
              fontWeight: mode === 'sign_in' ? 700 : 500,
              color: mode === 'sign_in' ? 'var(--color-primary)' : 'var(--color-ink-muted)',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Sign In
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
          {/* Error Message */}
          {localError && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
                fontSize: '12px',
                marginBottom: '16px',
                lineHeight: 1.4,
              }}
            >
              ⚠️ {localError}
            </div>
          )}

          {/* Success Message */}
          {localSuccess && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#dcfce7',
                border: '1px solid #86efac',
                color: '#166534',
                fontSize: '12px',
                marginBottom: '16px',
                lineHeight: 1.4,
              }}
            >
              ✓ {localSuccess}
            </div>
          )}

          {/* Full Name (Sign Up only) */}
          {mode === 'sign_up' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Taylor"
                className="input"
                style={{ width: '100%', fontSize: '13px' }}
                autoComplete="name"
              />
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="input"
              style={{ width: '100%', fontSize: '13px' }}
              required
              autoComplete="email"
            />
          </div>

          {/* Password (for sign in and sign up) */}
          {(mode === 'sign_in' || mode === 'sign_up') && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>
                  Password
                </label>
                {mode === 'sign_in' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot_password')}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '11px', cursor: 'pointer', padding: 0 }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'sign_up' ? 'Minimum 6 characters' : 'Enter your password'}
                className="input"
                style={{ width: '100%', fontSize: '13px' }}
                required
                autoComplete={mode === 'sign_up' ? 'new-password' : 'current-password'}
              />
            </div>
          )}

          {/* Target Track and Daily Study Goal (Sign Up Only) */}
          {mode === 'sign_up' && (
            <>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Target Certification Track
                </label>
                <select
                  value={selectedCertSlug}
                  onChange={(e) => setSelectedCertSlug(e.target.value)}
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Daily Study Target
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDailyGoal(mins)}
                      style={{
                        padding: '6px 4px',
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
                      {mins}m/day
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isSubmitting ? (
              <span>Connecting...</span>
            ) : mode === 'sign_up' ? (
              <span>🚀 Join for Free</span>
            ) : mode === 'sign_in' ? (
              <span>Sign In</span>
            ) : (
              <span>Send Instructions</span>
            )}
          </button>

          {/* Secondary Options */}
          <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--color-ink-muted)' }}>
            {mode === 'sign_in' && (
              <div>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('sign_up');
                    setLocalError(null);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
                >
                  Join for Free
                </button>
              </div>
            )}

            {mode === 'sign_up' && (
              <div>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('sign_in');
                    setLocalError(null);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
                >
                  Sign In
                </button>
              </div>
            )}

            {(mode === 'magic_link' || mode === 'forgot_password') && (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setMode('sign_in');
                    setLocalError(null);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
                >
                  ← Back to Sign In
                </button>
              </div>
            )}
          </div>

          {/* Guest reassurance note */}
          {mode === 'sign_up' && (
            <div
              style={{
                marginTop: '16px',
                padding: '8px 12px',
                backgroundColor: 'var(--color-bg-subtle)',
                borderRadius: 'var(--radius-md)',
                fontSize: '11px',
                color: 'var(--color-ink-muted)',
                textAlign: 'center',
              }}
            >
              🔒 100% Free Tier • No credit card required • Syncs with any device
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
