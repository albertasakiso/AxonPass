import React, { useState } from 'react';

export const InteractiveCalculators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'audit_risk' | 'sle_ale' | 'sampling' | 'bia'>('audit_risk');

  // Calculator 1: Audit Risk Model
  const [ir, setIr] = useState<number>(0.8); // 80% (High)
  const [cr, setCr] = useState<number>(0.7); // 70% (High)
  const [targetAr, setTargetAr] = useState<number>(0.05); // 5%

  const rmm = ir * cr;
  const calculatedDr = Math.min(1, targetAr / (rmm || 0.01));
  const currentActualAr = ir * cr * calculatedDr;

  // Calculator 2: Quantitative Risk (SLE, ALE, CBA)
  const [assetValue, setAssetValue] = useState<number>(500000);
  const [exposureFactor, setExposureFactor] = useState<number>(0.4); // 40%
  const [aro, setAro] = useState<number>(0.2); // once every 5 years
  const [safeguardCost, setSafeguardCost] = useState<number>(10000); // $10,000/yr
  const [safeguardAroReduction, setSafeguardAroReduction] = useState<number>(0.04); // reduces to once every 25 yrs

  const sle = assetValue * exposureFactor;
  const currentAle = sle * aro;
  const modifiedAle = sle * safeguardAroReduction;
  const netBenefit = (currentAle - modifiedAle) - safeguardCost;

  // Calculator 3: Audit Sampling Size
  const [confidenceLevel, setConfidenceLevel] = useState<number>(95); // 95%
  const [tolerableError, setTolerableError] = useState<number>(5); // 5%
  const [expectedError, setExpectedError] = useState<number>(1.5); // 1.5%

  // Approximate sample size heuristic for attribute sampling
  const zScore = confidenceLevel === 99 ? 2.58 : confidenceLevel === 95 ? 1.96 : 1.645;
  const p = (expectedError / 100) || 0.01;
  const d = (tolerableError / 100) - p;
  const sampleSize = d > 0 ? Math.min(500, Math.max(25, Math.round((Math.pow(zScore, 2) * p * (1 - p)) / Math.pow(d, 2)))) : 999;

  // Calculator 4: BIA Timeline
  const [rpoHours, setRpoHours] = useState<number>(2);
  const [rtoHours, setRtoHours] = useState<number>(4);
  const [mtpdHours, setMtpdHours] = useState<number>(24);

  return (
    <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <div className="ereader-meta-badge">
            🧮 Interactive Audit Laboratory & Visual Simulators
          </div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-ink)', margin: 0 }}>
            Formula Calculators & What-If Simulators
          </h2>
          <p className="text-muted" style={{ fontSize: 'var(--text-sm)', margin: 'var(--space-1) 0 0 0' }}>
            Experiment with risk variables, audit risk formulas, quantitative loss models, and sampling levers in real time.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="segmented-nav" role="tablist">
          <button
            onClick={() => setActiveTab('audit_risk')}
            className={`segmented-pill ${activeTab === 'audit_risk' ? 'active' : ''}`}
            role="tab"
          >
            ⚖️ Audit Risk Model
          </button>
          <button
            onClick={() => setActiveTab('sle_ale')}
            className={`segmented-pill ${activeTab === 'sle_ale' ? 'active' : ''}`}
            role="tab"
          >
            💰 SLE / ALE / CBA
          </button>
          <button
            onClick={() => setActiveTab('sampling')}
            className={`segmented-pill ${activeTab === 'sampling' ? 'active' : ''}`}
            role="tab"
          >
            📊 Sampling Levers
          </button>
          <button
            onClick={() => setActiveTab('bia')}
            className={`segmented-pill ${activeTab === 'bia' ? 'active' : ''}`}
            role="tab"
          >
            ⏱️ BIA RTO/RPO
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SIMULATOR 1: THE AUDIT RISK MODEL                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'audit_risk' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            
            {/* Left Column: Sliders */}
            <div className="card" style={{ padding: 'var(--space-5)', backgroundColor: 'var(--color-bg-subtle)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)', color: 'var(--color-primary)' }}>
                1. Adjust Risk Parameters
              </h3>

              {/* Inherent Risk */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)' }}>
                  <span>Inherent Risk (IR)</span>
                  <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>{(ir * 100).toFixed(0)}% ({ir >= 0.7 ? 'HIGH' : ir >= 0.4 ? 'MEDIUM' : 'LOW'})</span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={ir}
                  onChange={(e) => setIr(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
                <p className="text-muted" style={{ fontSize: '11px', margin: '2px 0 0 0' }}>Susceptibility to error assuming zero controls.</p>
              </div>

              {/* Control Risk */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)' }}>
                  <span>Control Risk (CR)</span>
                  <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>{(cr * 100).toFixed(0)}% ({cr >= 0.7 ? 'HIGH' : cr >= 0.4 ? 'MEDIUM' : 'LOW'})</span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={cr}
                  onChange={(e) => setCr(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
                <p className="text-muted" style={{ fontSize: '11px', margin: '2px 0 0 0' }}>Probability internal controls fail to catch error.</p>
              </div>

              {/* Target Audit Risk */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)' }}>
                  <span>Target Acceptable Audit Risk (AR)</span>
                  <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>{(targetAr * 100).toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min={0.01}
                  max={0.10}
                  step={0.005}
                  value={targetAr}
                  onChange={(e) => setTargetAr(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
                <p className="text-muted" style={{ fontSize: '11px', margin: '2px 0 0 0' }}>Maximum acceptable risk of issuing clean opinion on bad system (standard = 5%).</p>
              </div>
            </div>

            {/* Right Column: Live Formula Output */}
            <div className="card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)', color: 'var(--color-primary)' }}>
                  2. Solved Detection Risk & Auditor Strategy
                </h3>

                <div style={{ backgroundColor: 'var(--color-primary-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)', border: '1px solid var(--color-primary-200)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>
                    Risk of Material Misstatement (RMM = IR × CR)
                  </div>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                    {(rmm * 100).toFixed(1)}% {rmm >= 0.5 ? '⚠️ (HIGH RISK ENVIRONMENT)' : '✅ (MODERATE/LOW)'}
                  </div>
                </div>

                <div style={{ backgroundColor: calculatedDr <= 0.1 ? 'var(--color-warning-bg)' : 'var(--color-bg-subtle)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: calculatedDr <= 0.1 ? '1px solid var(--color-warning-border)' : '1px solid var(--color-bg-muted)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: calculatedDr <= 0.1 ? 'var(--color-warning)' : 'var(--color-ink)', textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>
                    Required Detection Risk (DR = AR / RMM)
                  </div>
                  <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: calculatedDr <= 0.1 ? '#92400e' : 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                    {(calculatedDr * 100).toFixed(1)}%
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', marginTop: 'var(--space-2)' }}>
                    {calculatedDr <= 0.1
                      ? '🚨 CRITICAL: Detection risk must be set extremely low. The auditor MUST perform extensive substantive testing, use 100% population analytics (GAS), and enlarge sample sizes.'
                      : '✅ Moderate/High detection risk allowable. Standard substantive sampling and analytical reviews are sufficient.'}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-bg-muted)', fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                <strong>Formula Check:</strong> {(ir * 100).toFixed(0)}% (IR) × {(cr * 100).toFixed(0)}% (CR) × {(calculatedDr * 100).toFixed(1)}% (DR) = <strong>{(currentActualAr * 100).toFixed(1)}% (AR)</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SIMULATOR 2: QUANTITATIVE RISK & COST-BENEFIT ANALYSIS (CBA)  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'sle_ale' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
          
          {/* Controls */}
          <div className="card" style={{ padding: 'var(--space-5)', backgroundColor: 'var(--color-bg-subtle)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)', color: 'var(--color-primary)' }}>
              1. Asset & Safeguard Inputs
            </h3>

            <div style={{ marginBottom: 'var(--space-3)' }}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', display: 'block', marginBottom: 'var(--space-1)' }}>
                Asset Value (AV): ${assetValue.toLocaleString()}
              </label>
              <input
                type="range"
                min={50000}
                max={2000000}
                step={25000}
                value={assetValue}
                onChange={(e) => setAssetValue(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-3)' }}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', display: 'block', marginBottom: 'var(--space-1)' }}>
                Exposure Factor (EF): {(exposureFactor * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min={0.05}
                max={1.0}
                step={0.05}
                value={exposureFactor}
                onChange={(e) => setExposureFactor(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-3)' }}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', display: 'block', marginBottom: 'var(--space-1)' }}>
                Current ARO: {aro} times/year (Once every {(1 / aro).toFixed(1)} yrs)
              </label>
              <input
                type="range"
                min={0.05}
                max={2.0}
                step={0.05}
                value={aro}
                onChange={(e) => setAro(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-3)' }}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', display: 'block', marginBottom: 'var(--space-1)' }}>
                Annual Cost of Safeguard (ACS): ${safeguardCost.toLocaleString()}/yr
              </label>
              <input
                type="range"
                min={1000}
                max={50000}
                step={1000}
                value={safeguardCost}
                onChange={(e) => setSafeguardCost(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', display: 'block', marginBottom: 'var(--space-1)' }}>
                Modified ARO with Safeguard: {safeguardAroReduction} times/yr (Once every {(1 / safeguardAroReduction).toFixed(0)} yrs)
              </label>
              <input
                type="range"
                min={0.01}
                max={0.5}
                step={0.01}
                value={safeguardAroReduction}
                onChange={(e) => setSafeguardAroReduction(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Results */}
          <div className="card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)', color: 'var(--color-primary)' }}>
                2. Calculated Loss & CBA Decision
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', textTransform: 'uppercase', fontWeight: 'var(--weight-bold)' }}>Single Loss (SLE)</div>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                    ${Math.round(sle).toLocaleString()}
                  </div>
                </div>

                <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', textTransform: 'uppercase', fontWeight: 'var(--weight-bold)' }}>Current ALE</div>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-error)', fontFamily: 'var(--font-mono)' }}>
                    ${Math.round(currentAle).toLocaleString()}/yr
                  </div>
                </div>
              </div>

              <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', backgroundColor: netBenefit > 0 ? 'var(--color-success-bg)' : 'var(--color-error-bg)', border: netBenefit > 0 ? '1px solid var(--color-success-border)' : '1px solid var(--color-error-border)' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: netBenefit > 0 ? 'var(--color-success)' : 'var(--color-error)', textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>
                  Net Annual Benefit (ALE Reduction - Safeguard Cost)
                </div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: netBenefit > 0 ? 'var(--color-success)' : 'var(--color-error)', fontFamily: 'var(--font-mono)' }}>
                  {netBenefit > 0 ? `+$${Math.round(netBenefit).toLocaleString()}/year` : `-$${Math.abs(Math.round(netBenefit)).toLocaleString()}/year`}
                </div>
                <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', color: 'var(--color-ink)' }}>
                  {netBenefit > 0
                    ? '✅ ECONOMICALLY JUSTIFIED: The annual loss reduction exceeds the safeguard cost.'
                    : '❌ NOT JUSTIFIED: The safeguard cost exceeds the annualized loss savings.'}
                </p>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', marginTop: 'var(--space-3)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-bg-muted)' }}>
              Formula: (${Math.round(currentAle).toLocaleString()} - ${Math.round(modifiedAle).toLocaleString()}) - ${safeguardCost.toLocaleString()} = ${Math.round(netBenefit).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SIMULATOR 3: AUDIT SAMPLING SIZE LEVERS                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'sampling' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
          
          <div className="card" style={{ padding: 'var(--space-5)', backgroundColor: 'var(--color-bg-subtle)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)', color: 'var(--color-primary)' }}>
              1. Attribute Sampling Parameters
            </h3>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', display: 'block', marginBottom: 'var(--space-1)' }}>
                Desired Confidence Level: {confidenceLevel}%
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {[90, 95, 99].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setConfidenceLevel(lvl)}
                    className={`btn btn-secondary ${confidenceLevel === lvl ? 'active' : ''}`}
                    style={{ flex: 1, minHeight: '32px', fontSize: 'var(--text-xs)', backgroundColor: confidenceLevel === lvl ? 'var(--color-primary)' : 'var(--color-bg)', color: confidenceLevel === lvl ? '#fff' : 'var(--color-ink)' }}
                  >
                    {lvl}%
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', display: 'block', marginBottom: 'var(--space-1)' }}>
                Tolerable Error Rate (TER): {tolerableError}%
              </label>
              <input
                type="range"
                min={2}
                max={15}
                step={0.5}
                value={tolerableError}
                onChange={(e) => setTolerableError(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <p className="text-muted" style={{ fontSize: '11px', margin: '2px 0 0 0' }}>Max error rate acceptable without failing control.</p>
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', display: 'block', marginBottom: 'var(--space-1)' }}>
                Expected Error Rate (EER): {expectedError}%
              </label>
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={expectedError}
                onChange={(e) => setExpectedError(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <p className="text-muted" style={{ fontSize: '11px', margin: '2px 0 0 0' }}>Estimated historical population error rate.</p>
            </div>
          </div>

          <div className="card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)', color: 'var(--color-primary)' }}>
                2. Calculated Sample Size
              </h3>

              <div style={{ padding: 'var(--space-6)', backgroundColor: expectedError >= tolerableError ? 'var(--color-error-bg)' : 'var(--color-primary-50)', borderRadius: 'var(--radius-xl)', border: expectedError >= tolerableError ? '1px solid var(--color-error-border)' : '1px solid var(--color-primary-200)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--color-ink-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>
                  Recommended Audit Sample Size (n)
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 'var(--weight-bold)', color: expectedError >= tolerableError ? 'var(--color-error)' : 'var(--color-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                  {expectedError >= tolerableError ? 'FAILED' : sampleSize}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', color: 'var(--color-ink)' }}>
                  {expectedError >= tolerableError
                    ? '⚠️ Expected Error >= Tolerable Error. Control cannot be relied upon! Do not sample; proceed to substantive testing.'
                    : `Representative items to inspect across the audit period at ${confidenceLevel}% confidence.`}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', marginTop: 'var(--space-3)' }}>
              <strong>Exam Rule:</strong> As Confidence Level ↑, Sample Size ↑. As Tolerable Error ↑, Sample Size ↓. As Expected Error ↑, Sample Size ↑.
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SIMULATOR 4: BIA RTO / RPO TIMELINE VISUALIZER                */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'bia' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
            <div className="card" style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg-subtle)' }}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', display: 'block', marginBottom: 'var(--space-1)' }}>
                RPO (Data Loss Window): {rpoHours} Hours
              </label>
              <input
                type="range"
                min={0}
                max={24}
                step={1}
                value={rpoHours}
                onChange={(e) => setRpoHours(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>Max tolerable data loss measured back in time.</span>
            </div>

            <div className="card" style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg-subtle)' }}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', display: 'block', marginBottom: 'var(--space-1)' }}>
                RTO (Recovery Time): {rtoHours} Hours
              </label>
              <input
                type="range"
                min={1}
                max={48}
                step={1}
                value={rtoHours}
                onChange={(e) => setRtoHours(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>Max tolerable system downtime forward in time.</span>
            </div>

            <div className="card" style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg-subtle)' }}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', display: 'block', marginBottom: 'var(--space-1)' }}>
                MTPD (Maximum Outage): {mtpdHours} Hours
              </label>
              <input
                type="range"
                min={12}
                max={72}
                step={2}
                value={mtpdHours}
                onChange={(e) => setMtpdHours(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>Maximum Tolerable Period of Disruption before fatal loss.</span>
            </div>
          </div>

          {/* Visual Timeline Bar */}
          <div className="card" style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-xl)' }}>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)', color: 'var(--color-ink)' }}>
              Visual Business Impact Timeline (BIA)
            </h4>

            <div style={{ display: 'flex', alignItems: 'center', height: '60px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-bg-muted)' }}>
              <div style={{ flex: rpoHours || 1, backgroundColor: '#fde68a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#92400e', fontWeight: 'bold', fontSize: '11px' }}>
                <span>RPO Window</span>
                <span>-{rpoHours}h Data Loss</span>
              </div>

              <div title="Disaster Event" style={{ width: '6px', backgroundColor: 'var(--color-error)', height: '100%' }} />

              <div style={{ flex: rtoHours || 1, backgroundColor: '#bfdbfe', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#1e40af', fontWeight: 'bold', fontSize: '11px' }}>
                <span>RTO Recovery</span>
                <span>+{rtoHours}h Downtime</span>
              </div>

              <div style={{ flex: Math.max(1, mtpdHours - rtoHours), backgroundColor: '#e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#475569', fontWeight: 'bold', fontSize: '11px' }}>
                <span>Remaining Buffer to MTPD</span>
                <span>+{mtpdHours - rtoHours}h Safety Margin</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-ink-muted)', marginTop: 'var(--space-2)' }}>
              <span>Last Clean Backup Point</span>
              <strong style={{ color: 'var(--color-error)' }}>⚡ DISASTER EVENT</strong>
              <span>System Restored (RTO)</span>
              <span>Fatal Disruption Limit (MTPD)</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
