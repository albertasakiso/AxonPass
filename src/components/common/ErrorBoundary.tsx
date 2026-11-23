/* ===================================================================
   ANOXPASS — Resilient Route & Feature Error Boundary
   Prevents runtime component exceptions from crashing the entire SPA.
   =================================================================== */

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected rendering error occurred.',
    };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div
          className="card"
          role="alert"
          style={{
            margin: 'var(--space-6) auto',
            maxWidth: '640px',
            padding: 'var(--space-6)',
            textAlign: 'center',
            borderLeft: '4px solid var(--color-error)',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>⚠️</div>
          <h3 style={{ margin: '0 0 var(--space-2) 0' }}>
            {this.props.fallbackTitle || 'Something went wrong in this module'}
          </h3>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>
            {this.state.errorMessage}
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary btn-sm" onClick={this.handleReset}>
              ↻ Retry Module
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => window.location.reload()}>
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
