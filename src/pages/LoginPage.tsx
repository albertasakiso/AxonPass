/* ===================================================================
   APILIGU LEARNING PASS — Login Page
   Multi-mode authentication: Sign In, Create Account, Magic Link,
   Password Reset, and Offline Guest Access.
   =================================================================== */

import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { AxonPassLogo } from '../components/common/AxonPassLogo';

type AuthMode = 'sign_in' | 'sign_up' | 'magic_link' | 'forgot_password';

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    signIn,
    signUp,
    signInWithMagicLink,
    resetPassword,
    isLoading,
    error,
    successMessage,
    clearError,
    clearSuccessMessage,
  } = useAuthStore();

  const [mode, setMode] = useState<AuthMode>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localValidation, setLocalValidation] = useState<string | null>(null);

  useEffect(() => {
    clearError();
    clearSuccessMessage();
  }, [clearError, clearSuccessMessage]);

  const switchMode = (newMode: AuthMode) => {
    clearError();
    clearSuccessMessage();
    setLocalValidation(null);
    setMode(newMode);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    clearSuccessMessage();
    setLocalValidation(null);

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setLocalValidation('Please enter a valid email address.');
      return;
    }

    if (mode === 'sign_in') {
      if (!password) {
        setLocalValidation('Please enter your password.');
        return;
      }
      const ok = await signIn(cleanEmail, password);
      if (ok) {
        navigate('/');
      }
    } else if (mode === 'sign_up') {
      if (password.length < 6) {
        setLocalValidation('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalValidation('Passwords do not match. Please verify.');
        return;
      }
      const res = await signUp(cleanEmail, password, fullName);
      if (res.success && !res.requiresEmailConfirmation) {
        navigate('/');
      }
    } else if (mode === 'magic_link') {
      await signInWithMagicLink(cleanEmail);
    } else if (mode === 'forgot_password') {
      await resetPassword(cleanEmail);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Brand Banner */}
        <div className="login-brand" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'inline-flex', marginBottom: 'var(--space-2)' }}>
            <AxonPassLogo size={64} />
          </div>
          <h1 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: '0 0 var(--space-1) 0',
            background: 'linear-gradient(135deg, #FFFFFF 30%, #38BDF8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            AxonPass
          </h1>
          <p style={{
            color: 'var(--color-ink-muted)',
            fontSize: 'var(--text-sm)',
            maxWidth: '380px',
            margin: '0 auto',
            lineHeight: 1.5,
          }}>
            Neural Certification Mastery &amp; Edge Psychometrics Platform
          </p>
        </div>

        {/* Auth Card */}
        <div className="login-card">
          <h2>
            {mode === 'sign_in' && 'Sign In to Your Account'}
            {mode === 'sign_up' && 'Create Your Account'}
            {mode === 'magic_link' && 'Sign In with Magic Link'}
            {mode === 'forgot_password' && 'Reset Your Password'}
          </h2>

          {/* Success Banner */}
          {successMessage && (
            <div
              className="badge-success mb-4"
              style={{
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-relaxed)',
              }}
              role="status"
            >
              {successMessage}
            </div>
          )}

          {/* Error Banner */}
          {(error || localValidation) && (
            <div
              className="badge-error mb-4"
              style={{
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-relaxed)',
              }}
              role="alert"
            >
              {localValidation || error}
            </div>
          )}

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Full Name for Sign Up */}
            {mode === 'sign_up' && (
              <div className="input-group">
                <label htmlFor="fullName" className="input-label">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  className="input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Albert Apuliga"
                  autoComplete="name"
                />
              </div>
            )}

            {/* Email Address */}
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            {/* Password for Sign In & Sign Up */}
            {(mode === 'sign_in' || mode === 'sign_up') && (
              <div className="input-group">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="input-label" style={{ marginBottom: 0 }}>
                    Password
                  </label>
                  {mode === 'sign_in' && (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ padding: 0, fontSize: 'var(--text-xs)', color: 'var(--color-primary-light)' }}
                      onClick={() => switchMode('forgot_password')}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete={mode === 'sign_in' ? 'current-password' : 'new-password'}
                    style={{ paddingRight: '48px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-ink-muted)',
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '👁️' : '🔒'}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password for Sign Up */}
            {mode === 'sign_up' && (
              <div className="input-group">
                <label htmlFor="confirmPassword" className="input-label">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  autoComplete="new-password"
                />
              </div>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={isLoading}
              style={{ marginTop: 'var(--space-2)' }}
            >
              {isLoading ? (
                <span className="animate-spin" aria-hidden="true">
                  ⟳
                </span>
              ) : mode === 'sign_in' ? (
                'Sign In →'
              ) : mode === 'sign_up' ? (
                'Create Account & Start Learning →'
              ) : mode === 'magic_link' ? (
                'Send Magic Link 📧'
              ) : (
                'Send Reset Instructions ✉️'
              )}
            </button>

            {/* Mode Switchers */}
            <div className="flex flex-col gap-2 mt-4 text-center text-sm">
              {mode === 'sign_in' && (
                <>
                  <div>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="font-semibold"
                      style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: 0 }}
                      onClick={() => switchMode('sign_up')}
                    >
                      Create one here
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => switchMode('magic_link')}
                  >
                    ✉️ Sign in with passwordless Magic Link
                  </button>
                </>
              )}

              {mode === 'sign_up' && (
                <div>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="font-semibold"
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: 0 }}
                    onClick={() => switchMode('sign_in')}
                  >
                    Sign in here
                  </button>
                </div>
              )}

              {(mode === 'magic_link' || mode === 'forgot_password') && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => switchMode('sign_in')}
                >
                  ← Back to Password Sign In
                </button>
              )}
            </div>

            <div
              style={{
                marginTop: 'var(--space-6)',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--color-surface-subtle)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-ink-muted)',
                textAlign: 'center',
                border: '1px solid var(--border-color)',
              }}
            >
              🔒 <strong>Strictly Gated Access:</strong> You must sign in or create an account to access the question banks, diagnostic tools, and study materials.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
