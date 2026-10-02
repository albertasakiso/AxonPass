/* ===================================================================
   APILIGU LEARNING PASS — Question Editor Modal
   Full CRUD editor with Markdown/KaTeX preview and confidence controls.
   =================================================================== */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Question, Certification, Domain } from '../../types';

interface QuestionEditorModalProps {
  question?: Question | null;
  certifications: Certification[];
  domains: Domain[];
  onSave: (questionData: Partial<Question>) => Promise<void>;
  onClose: () => void;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  question,
  certifications,
  domains,
  onSave,
  onClose,
}) => {
  const [stem, setStem] = useState(question?.stem || '');
  const [scenarioText, setScenarioText] = useState(question?.scenario_text || '');
  const [optionA, setOptionA] = useState(question?.option_a || '');
  const [optionB, setOptionB] = useState(question?.option_b || '');
  const [optionC, setOptionC] = useState(question?.option_c || '');
  const [optionD, setOptionD] = useState(question?.option_d || '');
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>(question?.correct_answer || 'A');
  const [rationale, setRationale] = useState(question?.rationale || '');
  const [certificationId, setCertificationId] = useState(question?.certification_id || certifications[0]?.id || '');
  const [domainId, setDomainId] = useState(question?.domain_id || domains[0]?.id || '');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(question?.difficulty || 'medium');
  const [confidence, setConfidence] = useState<'verified' | 'unverified'>(question?.source_confidence || 'verified');
  const [tags, setTags] = useState<string>(question?.tags?.join(', ') || '');
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const filteredDomains = domains.filter((d) => d.certification_id === certificationId);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stem || !optionA || !optionB || !optionC || !optionD || !rationale) {
      alert('Please fill in the stem, all 4 options, and the rationale.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        stem,
        scenario_text: scenarioText || null,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_answer: correctAnswer,
        rationale,
        certification_id: certificationId,
        domain_id: domainId,
        difficulty,
        source_confidence: confidence,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        is_active: true,
      });
      onClose();
    } catch (err: any) {
      alert(`Error saving question: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="reader-modal-overlay animate-fade-in">
      <div
        className="reader-modal-dialog"
        style={{ maxWidth: '840px', maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="reader-modal-header">
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
              CONTENT STUDIO • {question ? 'EDIT QUESTION' : 'NEW QUESTION'}
            </span>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', margin: 0 }}>
              {question ? `Edit Question #${question.question_number || ''}` : 'Create New Standard Question'}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="btn btn-secondary"
              style={{ fontSize: 'var(--text-xs)' }}
            >
              {previewMode ? '✏️ Edit Mode' : '👁️ KaTeX Preview'}
            </button>
            <button onClick={onClose} className="reader-close-btn">
              ✕
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="reader-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          
          {previewMode ? (
            /* Live Markdown & Math Preview */
            <div className="card" style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-bg-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <span className="domain-pill">Live Preview</span>
                <span className={`domain-weight`} style={{ backgroundColor: confidence === 'verified' ? 'var(--color-success-bg)' : 'var(--color-warning-bg)', color: confidence === 'verified' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                  {confidence === 'verified' ? '✓ Verified' : 'ℹ️ Standard Key'}
                </span>
              </div>

              {scenarioText && (
                <div style={{ padding: 'var(--space-3)', backgroundColor: '#fff', borderLeft: '4px solid var(--color-primary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-xs)' }}>
                  <strong>Scenario:</strong> {scenarioText}
                </div>
              )}

              <div className="ereader-prose font-normal">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {stem || '*No stem entered yet.*'}
                </ReactMarkdown>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                {[
                  { label: 'A', text: optionA },
                  { label: 'B', text: optionB },
                  { label: 'C', text: optionC },
                  { label: 'D', text: optionD },
                ].map((opt) => (
                  <div
                    key={opt.label}
                    style={{
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: opt.label === correctAnswer ? 'var(--color-success-bg)' : '#fff',
                      border: opt.label === correctAnswer ? '1px solid var(--color-success-border)' : '1px solid var(--color-bg-muted)',
                      fontSize: 'var(--text-xs)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)'
                    }}
                  >
                    <strong>{opt.label}:</strong> {opt.text || `Option ${opt.label}`}
                    {opt.label === correctAnswer && <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓ Correct</span>}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', backgroundColor: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>
                  Rationale & Explanation:
                </div>
                <div className="ereader-prose font-normal" style={{ fontSize: 'var(--text-xs)' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {rationale || '*No rationale entered.*'}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ) : (
            /* Input Fields */
            <>
              {/* Certification & Domain Selectors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                    Certification Track
                  </label>
                  <select
                    value={certificationId}
                    onChange={(e) => setCertificationId(e.target.value)}
                    style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)', fontSize: 'var(--text-xs)' }}
                  >
                    {certifications.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                    Domain
                  </label>
                  <select
                    value={domainId}
                    onChange={(e) => setDomainId(e.target.value)}
                    style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)', fontSize: 'var(--text-xs)' }}
                  >
                    {filteredDomains.map((d) => (
                      <option key={d.id} value={d.id}>
                        Domain {d.domain_number}: {d.name.slice(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Scenario Context (Optional) */}
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                  Scenario Context (Optional)
                </label>
                <textarea
                  value={scenarioText}
                  onChange={(e) => setScenarioText(e.target.value)}
                  rows={2}
                  placeholder="Optional case study or background scenario..."
                  style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)', fontSize: 'var(--text-xs)' }}
                />
              </div>

              {/* Question Stem */}
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                  Question Stem / Text *
                </label>
                <textarea
                  value={stem}
                  onChange={(e) => setStem(e.target.value)}
                  rows={3}
                  placeholder="Enter the question stem (supports LaTeX math formulas like $AR = IR \times CR \times DR$)..."
                  required
                  style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)', fontSize: 'var(--text-xs)' }}
                />
              </div>

              {/* Options A - D */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                    Option A *
                  </label>
                  <input
                    type="text"
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    required
                    style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)', fontSize: 'var(--text-xs)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                    Option B *
                  </label>
                  <input
                    type="text"
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    required
                    style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)', fontSize: 'var(--text-xs)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                    Option C *
                  </label>
                  <input
                    type="text"
                    value={optionC}
                    onChange={(e) => setOptionC(e.target.value)}
                    required
                    style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)', fontSize: 'var(--text-xs)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                    Option D *
                  </label>
                  <input
                    type="text"
                    value={optionD}
                    onChange={(e) => setOptionD(e.target.value)}
                    required
                    style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)', fontSize: 'var(--text-xs)' }}
                  />
                </div>
              </div>

              {/* Correct Answer & Metadata */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
                <div>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                    Correct Answer *
                  </label>
                  <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value as any)}
                    style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary-light)', fontSize: 'var(--text-xs)', fontWeight: 'bold' }}
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                    Confidence Marker (§7.5)
                  </label>
                  <select
                    value={confidence}
                    onChange={(e) => setConfidence(e.target.value as any)}
                    style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)', fontSize: 'var(--text-xs)' }}
                  >
                    <option value="verified">Verified Key (Corroborated)</option>
                    <option value="unverified">Unverified / Single Source</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)', fontSize: 'var(--text-xs)' }}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Rationale */}
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                  Detailed Rationale / Best-Fit Explanation *
                </label>
                <textarea
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  rows={3}
                  placeholder="Explain why the correct option is best, and why distractors are inferior..."
                  required
                  style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)', fontSize: 'var(--text-xs)' }}
                />
              </div>

              {/* Tags */}
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                  Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. audit-charter, governance, ITAF"
                  style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)', fontSize: 'var(--text-xs)' }}
                />
              </div>
            </>
          )}

          {/* Footer Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-bg-muted)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="btn btn-primary">
              {isSaving ? 'Saving...' : '💾 Save Question'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
