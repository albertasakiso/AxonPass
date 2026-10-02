/* ===================================================================
   APILIGU LEARNING PASS — Unified Composite Readiness Gauge Component
   Visualizes the overarching Readiness Index (0-100%), constituent
   components (Testing, Syllabus, Memory Retention), and Target Date Pacing.
   =================================================================== */

import React, { useState } from 'react';
import type { CompositeReadinessResult } from '../../lib/scoring/readinessGauge';
import { saveTargetExamDate } from '../../lib/scoring/readinessGauge';

interface CompositeReadinessGaugeProps {
  readiness: CompositeReadinessResult;
  certSlug: string;
  certCode: string;
  onRefresh?: () => void;
  onStartDiagnostic?: () => void;
}

export const CompositeReadinessGauge: React.FC<CompositeReadinessGaugeProps> = ({
  readiness,
  certSlug,
  certCode,
  onRefresh,
  onStartDiagnostic,
}) => {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(readiness.pacing.targetExamDate || '');

  const { compositeScore, tierLabel, tierColor, tierDescription, components, pacing } = readiness;

  const handleSaveDate = (e: React.FormEvent) => {
    e.preventDefault();
    saveTargetExamDate(certSlug, selectedDate || null);
    setIsEditingDate(false);
    if (onRefresh) onRefresh();
  };

  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - (compositeScore / 100) * circumference;

  return (
    <div
      className="card mb-6"
      style={{
        padding: 'var(--space-6)',
        background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-subtle) 100%)',
        border: '1px solid var(--color-card-border)',
        boxShadow: 'var(--shadow-md)',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '1.25rem' }}>🏆</span>
            <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>
              {certCode} Exam Readiness &amp; Mastery Gauge
            </h3>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
            Scientific synthesis of IRT 2PL test accuracy, course syllabus reading, and spaced memory retention.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span
            className="badge"
            style={{
              backgroundColor: `${tierColor}15`,
              color: tierColor,
              border: `1px solid ${tierColor}40`,
              fontWeight: 'bold',
              fontSize: '12px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
            }}
          >
            ● {tierLabel}
          </span>
          {onStartDiagnostic && compositeScore < 50 && (
            <button
              onClick={onStartDiagnostic}
              className="btn btn-primary btn-sm"
              style={{ fontWeight: 'bold', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <span>⚡</span>
              <span>Calibrate Baseline (20Q)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Gauge Circle + Component Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', alignItems: 'center' }}>
        
        {/* Left: Circular Readiness Radial Gauge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
            <svg width="120" height="120" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="46"
                stroke="var(--color-bg-muted)"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r="46"
                stroke={tierColor}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--color-ink)', lineHeight: 1 }}>
                {compositeScore}%
              </span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                READINESS
              </span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--color-ink)', marginBottom: '4px' }}>
              Passing Threshold: 75%
            </div>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
              {tierDescription}
            </p>
          </div>
        </div>

        {/* Right: Three Pillars of Excellence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          
          {/* Component 1: Testing & IRT (55%) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)', marginBottom: '3px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--color-ink)' }}>
                🎯 {components.testing.label} <span style={{ color: 'var(--color-ink-muted)', fontWeight: 'normal' }}>(55% Weight)</span>
              </span>
              <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>
                {components.testing.score}%
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-bg-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${components.testing.score}%`,
                  backgroundColor: 'var(--color-primary)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
              {components.testing.description}
            </div>
          </div>

          {/* Component 2: Syllabus Mastery (25%) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)', marginBottom: '3px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--color-ink)' }}>
                📖 {components.syllabus.label} <span style={{ color: 'var(--color-ink-muted)', fontWeight: 'normal' }}>(25% Weight)</span>
              </span>
              <span style={{ fontWeight: 'bold', color: 'var(--color-success)' }}>
                {components.syllabus.score}%
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-bg-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${components.syllabus.score}%`,
                  backgroundColor: 'var(--color-success)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
              {components.syllabus.description}
            </div>
          </div>

          {/* Component 3: Retention Stability (20%) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)', marginBottom: '3px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--color-ink)' }}>
                🧠 {components.retention.label} <span style={{ color: 'var(--color-ink-muted)', fontWeight: 'normal' }}>(20% Weight)</span>
              </span>
              <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>
                {components.retention.score}%
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-bg-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${components.retention.score}%`,
                  backgroundColor: '#f59e0b',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
              {components.retention.description}
            </div>
          </div>

        </div>
      </div>

      {/* Target Exam Date & Daily Pacing Milestone Bar */}
      <div
        style={{
          marginTop: 'var(--space-5)',
          paddingTop: 'var(--space-4)',
          borderTop: '1px solid var(--color-card-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            style={{
              padding: '6px 10px',
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: 'var(--text-xs)',
            }}
          >
            <span>📅</span>
            <strong>Target Exam:</strong>
            {pacing.isPacingActive ? (
              <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                {pacing.targetExamDate} ({pacing.daysRemaining} days left)
              </span>
            ) : (
              <span style={{ color: 'var(--color-ink-muted)' }}>Not set</span>
            )}
            <button
              type="button"
              onClick={() => setIsEditingDate(!isEditingDate)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0 4px', fontSize: '11px', textDecoration: 'underline' }}
            >
              {pacing.isPacingActive ? 'Edit' : 'Set Date'}
            </button>
          </div>

          {pacing.isPacingActive && (
            <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
              <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                📚 {pacing.dailyLessonsTarget} lessons/day
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                ⚡ {pacing.dailyQuestionsTarget} questions/day
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                🔄 {pacing.dailyReviewsTarget} reviews/day
              </span>
            </div>
          )}
        </div>

        <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
          {pacing.statusMessage}
        </div>
      </div>

      {/* Date Picker Form Drawer */}
      {isEditingDate && (
        <form
          onSubmit={handleSaveDate}
          className="animate-fade-in"
          style={{
            marginTop: 'var(--space-3)',
            padding: 'var(--space-3)',
            backgroundColor: 'var(--color-bg-subtle)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            flexWrap: 'wrap',
          }}
        >
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>
            Enter your scheduled exam date:
          </label>
          <input
            type="date"
            className="input input-sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
            style={{ width: '160px' }}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Save Target Date
          </button>
          {readiness.pacing.targetExamDate && (
            <button
              type="button"
              onClick={() => {
                saveTargetExamDate(certSlug, null);
                setSelectedDate('');
                setIsEditingDate(false);
                if (onRefresh) onRefresh();
              }}
              className="btn btn-secondary btn-sm"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsEditingDate(false)}
            className="btn btn-ghost btn-sm"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default CompositeReadinessGauge;
