/* ===================================================================
   APILIGU LEARNING PASS — App Router
   =================================================================== */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useAuthStore } from './stores/authStore';
import AppShell from './components/layout/AppShell';
import { pullContentFromServer, pushSyncQueue } from './lib/sync';

// Lazy-loaded pages for fast initial bundle
const LoginPage = lazy(() => import('./pages/LoginPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <div
          className="animate-spin"
          style={{
            fontSize: '2rem',
            color: 'var(--color-primary)',
            marginBottom: 'var(--space-3)',
          }}
          aria-hidden="true"
        >
          ⟳
        </div>
        <p className="text-xs text-muted">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return <PageLoader />;
  }

  // Strict Zero-Trust Gate: No unauthenticated guest access. Must log in or create an account.
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Block suspended users
  if (user.status === 'suspended') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: 'var(--space-6)', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🚫</div>
        <h2 style={{ color: 'var(--color-error)', marginBottom: 'var(--space-2)' }}>Account Suspended</h2>
        <p style={{ maxWidth: '480px', color: 'var(--color-ink-muted)', marginBottom: 'var(--space-6)' }}>
          Your account has been suspended by an administrator. You do not currently have access to AxonPass modules.
        </p>
        <button
          onClick={() => useAuthStore.getState().signOut()}
          className="btn btn-secondary btn-sm"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.role === 'owner' || user.role === 'admin';
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { initialize, isAuthenticated } = useAuthStore();

  useEffect(() => {
    initialize();
    pullContentFromServer();
    pushSyncQueue();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public route */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
            }
          />

          {/* Protected routes under app shell */}
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
