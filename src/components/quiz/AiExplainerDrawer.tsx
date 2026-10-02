/* ===================================================================
   AXONPASS — AI Cognitive Explainer & Local Ollama Reasoning Drawer
   Dual-Engine: Instant In-Browser Edge Matrix + Local Ollama Stream
   Direct Connection via IP or Tailscale | Zero Cloud Cost
   =================================================================== */

import { useState, useMemo, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Question } from '../../types';
import { buildDeepProblemExplanation } from '../../lib/ml/explainerEngine';
import type { OptionJustification } from '../../lib/ml/types';
import {
  getOllamaSettings,
  saveOllamaSettings,
  testOllamaConnection,
  streamOllamaExplanation,
  type OllamaSettings,
} from '../../lib/ai/ollamaService';
import {
  getClusterMachines,
  setActiveMachine,
  type AiClusterMachine,
} from '../../lib/ai/aiClusterStore';

interface AiExplainerDrawerProps {
  question: Question;
  selectedOption?: 'A' | 'B' | 'C' | 'D' | null;
  onClose: () => void;
  onPracticeSimilarTopic?: (topicCode: string) => void;
}

export default function AiExplainerDrawer({
  question,
  selectedOption,
  onClose,
  onPracticeSimilarTopic,
}: AiExplainerDrawerProps) {
  // Engine Tab State
  const [activeEngine, setActiveEngine] = useState<'edge' | 'ollama'>('edge');

  // Ollama Streaming State
  const [ollamaSettings, setOllamaSettings] = useState<OllamaSettings>(getOllamaSettings());
  const [clusterMachines, setClusterMachines] = useState<AiClusterMachine[]>(getClusterMachines);
  const activeClusterNode = clusterMachines.find((m) => m.isActive) || clusterMachines[0];

  const handleClusterNodeChange = (nodeId: string) => {
    const updated = setActiveMachine(nodeId);
    setClusterMachines(getClusterMachines());
    if (updated) {
      setOllamaSettings(getOllamaSettings());
    }
  };

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [streamError, setStreamError] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  // Config Test State
  const [testStatus, setTestStatus] = useState<{
    testing: boolean;
    ok?: boolean;
    models?: string[];
    latencyMs?: number;
    error?: string;
  }>({ testing: false });

  // Abort controller reference
  const abortControllerRef = useRef<AbortController | null>(null);

  // In-Browser Edge Explanation (Zero Latency)
  const explanation = useMemo(() => {
    return buildDeepProblemExplanation(question);
  }, [question]);

  const {
    operatorAnalysis,
    topicCode,
    topicName,
    reviewManualSection,
    taskStatementCode,
    keyConcepts,
    optionsBreakdown,
    takeawayRule,
    examTrapHeuristic,
  } = explanation;

  // Cleanup streaming on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleStartOllamaStream = async () => {
    if (isStreaming) return;
    setIsStreaming(true);
    setStreamedText('');
    setStreamError(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await streamOllamaExplanation(
        question,
        selectedOption,
        (chunk) => {
          setStreamedText(chunk);
        },
        controller.signal
      );
    } catch (err: unknown) {
      if (controller.signal.aborted) {
        setStreamError('Reasoning generation was cancelled.');
      } else {
        const msg = err instanceof Error ? err.message : String(err);
        setStreamError(msg);
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const handleStopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsStreaming(false);
  };

  const handleTestConnection = async () => {
    setTestStatus({ testing: true });
    const res = await testOllamaConnection(ollamaSettings.endpoint);
    setTestStatus({
      testing: false,
      ok: res.ok,
      models: res.models,
      latencyMs: res.latencyMs,
      error: res.error,
    });
    if (res.ok && res.models.length > 0) {
      // If current model not in list, auto-select first available or axonpass-mentor
      if (!res.models.includes(ollamaSettings.model)) {
        const preferred = res.models.includes('axonpass-mentor') ? 'axonpass-mentor' : res.models[0];
        const updated = saveOllamaSettings({ model: preferred });
        setOllamaSettings(updated);
      }
    }
  };

  const handleSaveEndpoint = (newEndpoint: string) => {
    const updated = saveOllamaSettings({ endpoint: newEndpoint.trim() });
    setOllamaSettings(updated);
  };

  const handleSaveModel = (newModel: string) => {
    const updated = saveOllamaSettings({ model: newModel });
    setOllamaSettings(updated);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 'var(--z-modal)' }}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '820px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          padding: 0,
        }}
        role="dialog"
        aria-label="AI Cognitive Problem Dissection"
      >
        {/* Modal Header */}
        <div
          className="modal-header"
          style={{
            padding: 'var(--space-3) var(--space-5)',
            backgroundColor: 'var(--color-primary-surface)',
            borderBottom: '1px solid var(--color-primary-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '1.4rem' }}>🧠</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                Axon Cognitive Dissection &amp; Exact Solver
              </h3>
              <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                Grounding: [{topicCode}] {topicName} • {reviewManualSection}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={onClose}
            aria-label="Close explainer"
            style={{ fontSize: '1.2rem', padding: '4px 8px' }}
          >
            ✕
          </button>
        </div>

        {/* Engine Switcher Tab Bar */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--color-bg-subtle)',
            borderBottom: '1px solid var(--border-color)',
            padding: '0 var(--space-4)',
            gap: 'var(--space-2)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveEngine('edge')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              borderBottom: activeEngine === 'edge' ? '3px solid var(--color-primary)' : '3px solid transparent',
              fontWeight: activeEngine === 'edge' ? 'bold' : 'normal',
              color: activeEngine === 'edge' ? 'var(--color-primary)' : 'var(--color-ink-muted)',
              cursor: 'pointer',
              fontSize: 'var(--text-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>⚡</span> Edge Cognitive Matrix (0ms • Offline)
          </button>

          <button
            type="button"
            onClick={() => setActiveEngine('ollama')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              borderBottom: activeEngine === 'ollama' ? '3px solid var(--color-primary)' : '3px solid transparent',
              fontWeight: activeEngine === 'ollama' ? 'bold' : 'normal',
              color: activeEngine === 'ollama' ? 'var(--color-primary)' : 'var(--color-ink-muted)',
              cursor: 'pointer',
              fontSize: 'var(--text-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🦙</span> Local Ollama Reasoner (Tailscale / LAN)
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div
          className="modal-body"
          style={{
            padding: 'var(--space-5)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          {/* ==================== TAB 1: EDGE COGNITIVE MATRIX ==================== */}
          {activeEngine === 'edge' && (
            <>
              {/* Section 1: ISACA Focus Operator Badge */}
              <div
                className="card"
                style={{
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderLeft: '4px solid var(--color-primary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                    🎯 Detected Decision Operator: {operatorAnalysis.highlightPhrase}
                  </span>
                  <span className="badge badge-primary" style={{ fontSize: '10px' }}>
                    Cognitive Rule Engine
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', margin: '0 0 var(--space-2) 0', lineHeight: 1.5, color: 'var(--color-ink)' }}>
                  <strong>Decision Logic:</strong> {operatorAnalysis.decisionRule}
                </p>
                <div style={{ fontSize: '11px', color: 'var(--color-warning)', fontWeight: '600' }}>
                  ⚠️ Exam Trap Warning: {operatorAnalysis.examTrapWarning}
                </div>
              </div>

              {/* Section 2: Option-by-Option Justification Matrix */}
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--color-ink)', marginBottom: 'var(--space-3)' }}>
                  ⚖️ Option-by-Option Justification Matrix
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {optionsBreakdown.map((opt: OptionJustification) => {
                    const isSelected = selectedOption === opt.label;
                    const isCorrect = opt.verdict === 'CORRECT_KEY';

                    let borderColor = 'var(--border-color)';
                    let bgColor = 'var(--color-bg)';
                    let badgeClass = 'badge-neutral';
                    let verdictLabel = 'Plausible Distractor';

                    if (isCorrect) {
                      borderColor = 'var(--color-success-border)';
                      bgColor = 'var(--color-success-bg)';
                      badgeClass = 'badge-success';
                      verdictLabel = '✓ Authoritative Correct Key';
                    } else if (opt.verdict === 'SECONDARY_ACTION') {
                      badgeClass = 'badge-warning';
                      verdictLabel = '⏳ Secondary Action (Wrong Timing)';
                    } else if (opt.verdict === 'IRRELEVANT_OUT_OF_SCOPE') {
                      badgeClass = 'badge-error';
                      verdictLabel = '✗ Irrelevant / Invalid Principle';
                    }

                    return (
                      <div
                        key={opt.label}
                        style={{
                          border: `1px solid ${borderColor}`,
                          borderRadius: 'var(--radius-md)',
                          padding: 'var(--space-3)',
                          backgroundColor: bgColor,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)', flexWrap: 'wrap', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <strong style={{ fontSize: 'var(--text-sm)', color: isCorrect ? 'var(--color-success)' : 'var(--color-ink)' }}>
                              [{opt.label}] {opt.text}
                            </strong>
                            {isSelected && (
                              <span className="badge badge-primary" style={{ fontSize: '10px' }}>
                                Your Choice
                              </span>
                            )}
                          </div>
                          <span className={`badge ${badgeClass}`} style={{ fontSize: '10px' }}>
                            {verdictLabel}
                          </span>
                        </div>

                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', margin: '0 0 var(--space-1) 0', lineHeight: 1.5 }}>
                          <strong>Why:</strong> {opt.reasoning}
                        </p>

                        <div style={{ fontSize: '11px', color: isCorrect ? 'var(--color-success)' : 'var(--color-ink-subtle)', fontStyle: 'italic' }}>
                          {opt.flawOrAdvantage}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Authoritative Textbook Citation & High-Yield Rule */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 'var(--space-4)',
                }}
              >
                <div className="card" style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-bg-subtle)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--color-ink-muted)', marginBottom: '4px' }}>
                    📖 Official Syllabus Grounding
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    {reviewManualSection}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                    Task Statement: {taskStatementCode}
                  </div>
                </div>

                <div className="card" style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-bg-subtle)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--color-ink-muted)', marginBottom: '4px' }}>
                    💡 Key Knowledge Anchors
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {keyConcepts.map((kc: string) => (
                      <span key={kc} className="badge badge-neutral" style={{ fontSize: '10px' }}>
                        #{kc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 4: High-Yield Memory Takeaway & Trap Alert */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 'var(--space-3)',
                }}
              >
                <div
                  style={{
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--color-primary-surface)',
                    border: '1px solid var(--color-primary-200)',
                  }}
                >
                  <h4 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    🧠 Memory Anchor Rule
                  </h4>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', lineHeight: 1.5, color: 'var(--color-ink)' }}>
                    {takeawayRule}
                  </p>
                </div>

                <div
                  style={{
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--color-warning-surface, #FEF3C7)',
                    border: '1px solid var(--color-warning-border, #FCD34D)',
                  }}
                >
                  <h4 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--text-xs)', color: '#92400E', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    ⚠️ Candidate Trap Warning
                  </h4>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', lineHeight: 1.5, color: '#78350F' }}>
                    {examTrapHeuristic}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ==================== TAB 2: LOCAL OLLAMA REASONER ==================== */}
          {activeEngine === 'ollama' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Ollama Connection & Status Control Header */}
              <div
                className="card"
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 'var(--space-2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ fontSize: '1.2rem' }}>🔌</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-ink)' }}>Node:</span>
                      <select
                        className="select select-xs"
                        style={{ fontSize: '11px', fontWeight: 'bold', padding: '1px 6px', maxWidth: '240px' }}
                        value={activeClusterNode?.id}
                        onChange={(e) => handleClusterNodeChange(e.target.value)}
                      >
                        {clusterMachines.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.address})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                      Model: <strong>{ollamaSettings.model}</strong> • <code>{ollamaSettings.endpoint}</code>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <button
                    type="button"
                    className="btn btn-xs btn-secondary"
                    onClick={() => setShowConfig(!showConfig)}
                  >
                    ⚙️ {showConfig ? 'Hide Config' : 'Configure Endpoint'}
                  </button>

                  {!isStreaming ? (
                    <button
                      type="button"
                      className="btn btn-xs btn-primary"
                      onClick={handleStartOllamaStream}
                      style={{ fontWeight: 'bold' }}
                    >
                      ▶ {streamedText ? 'Re-Dissect with Ollama' : 'Start Ollama Reasoner'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-xs btn-warning"
                      onClick={handleStopStream}
                      style={{ fontWeight: 'bold' }}
                    >
                      ⏹ Stop Streaming
                    </button>
                  )}
                </div>
              </div>

              {/* Collapsible Config & Health Check Panel */}
              {showConfig && (
                <div
                  className="card"
                  style={{
                    padding: 'var(--space-4)',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-primary-200)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-3)',
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: 'var(--text-xs)', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                    Ollama IP &amp; Tailscale Settings
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-2)' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                        Ollama Base URL (Local LAN or Tailscale IP / HTTPS URL):
                      </label>
                      <input
                        type="text"
                        className="input input-sm"
                        style={{ width: '100%', fontSize: '12px' }}
                        value={ollamaSettings.endpoint}
                        onChange={(e) => handleSaveEndpoint(e.target.value)}
                        placeholder="http://localhost:11434 or http://100.x.y.z:11434"
                      />
                    </div>

                    <div style={{ alignSelf: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={handleTestConnection}
                        disabled={testStatus.testing}
                      >
                        {testStatus.testing ? 'Pinging...' : 'Test Connection'}
                      </button>
                    </div>
                  </div>

                  {testStatus.latencyMs !== undefined && (
                    <div
                      style={{
                        fontSize: '11px',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: testStatus.ok ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                        color: testStatus.ok ? 'var(--color-success)' : 'var(--color-error)',
                      }}
                    >
                      {testStatus.ok ? (
                        <>✓ Connected in {testStatus.latencyMs}ms. Detected {testStatus.models?.length || 0} models.</>
                      ) : (
                        <>✕ {testStatus.error}</>
                      )}
                    </div>
                  )}

                  {testStatus.models && testStatus.models.length > 0 && (
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                        Select Installed Model:
                      </label>
                      <select
                        className="select select-sm"
                        style={{ width: '100%', fontSize: '12px' }}
                        value={ollamaSettings.model}
                        onChange={(e) => handleSaveModel(e.target.value)}
                      >
                        {testStatus.models.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', lineHeight: 1.4 }}>
                    <strong>Tailscale Setup Tip:</strong> To connect from anywhere, set <code>OLLAMA_ORIGINS=&quot;*&quot;</code> and <code>OLLAMA_HOST=&quot;0.0.0.0:11434&quot;</code>. For deployed HTTPS apps, run <code>tailscale serve --bg 11434</code> on your host.
                  </div>
                </div>
              )}

              {/* Streaming Output Display */}
              <div
                className="card"
                style={{
                  minHeight: '260px',
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                {isStreaming && !streamedText && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-primary)', fontSize: 'var(--text-xs)' }}>
                    <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                    <span>Streaming real-time cognitive reasoning from {ollamaSettings.model}...</span>
                  </div>
                )}

                {streamError && (
                  <div
                    style={{
                      padding: 'var(--space-3)',
                      backgroundColor: 'var(--color-error-bg)',
                      border: '1px solid var(--color-error-border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--color-error)',
                      fontSize: 'var(--text-xs)',
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Connection Alert:</strong> {streamError}
                    <div style={{ marginTop: 'var(--space-2)', fontSize: '11px', color: 'var(--color-ink)' }}>
                      Quick Fix: Check that Ollama is running and has CORS enabled:
                      <pre style={{ margin: '4px 0', padding: '4px', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '4px' }}>
                        set OLLAMA_ORIGINS=&quot;*&quot; &amp;&amp; ollama serve
                      </pre>
                    </div>
                  </div>
                )}

                {streamedText ? (
                  <div className="prose" style={{ fontSize: 'var(--text-xs)', lineHeight: 1.6 }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {streamedText}
                    </ReactMarkdown>
                  </div>
                ) : !isStreaming && !streamError ? (
                  <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-ink-muted)' }}>
                    <span style={{ fontSize: '2rem' }}>🦙</span>
                    <p style={{ margin: 'var(--space-2) 0 0 0', fontSize: 'var(--text-xs)' }}>
                      Click <strong>&quot;Start Ollama Reasoner&quot;</strong> to stream an exhaustive 4-part psychometric dissection and option matrix from your local workstation.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div
          className="modal-footer"
          style={{
            padding: 'var(--space-3) var(--space-5)',
            backgroundColor: 'var(--color-bg-subtle)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
          }}
        >
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
          >
            Close Dissection
          </button>

          {onPracticeSimilarTopic && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                onClose();
                onPracticeSimilarTopic(topicCode);
              }}
            >
              ⚡ Drill Correlated Topic [{topicCode}] →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
