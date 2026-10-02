/* ===================================================================
   APILIGU LEARNING PASS — Field Mapping Studio
   Interactive column-mapping interface with auto-detection heuristics
   and live transformation preview (§7.5).
   =================================================================== */

import React, { useState, useEffect } from 'react';

interface FieldMappingStudioProps {
  detectedHeaders: string[];
  rawRows: Record<string, string>[];
  onMappingConfirm: (mapping: Record<string, string>) => void;
  onCancel: () => void;
}

const TARGET_FIELDS: { key: string; label: string; required: boolean; hints: string[] }[] = [
  { key: 'stem', label: 'Question Stem / Text', required: true, hints: ['stem', 'question', 'question_text', 'prompt', 'text'] },
  { key: 'optionA', label: 'Option A', required: true, hints: ['option_a', 'option a', 'a', 'choice_a', 'choice a', 'opt_a'] },
  { key: 'optionB', label: 'Option B', required: true, hints: ['option_b', 'option b', 'b', 'choice_b', 'choice b', 'opt_b'] },
  { key: 'optionC', label: 'Option C', required: true, hints: ['option_c', 'option c', 'c', 'choice_c', 'choice c', 'opt_c'] },
  { key: 'optionD', label: 'Option D', required: true, hints: ['option_d', 'option d', 'd', 'choice_d', 'choice d', 'opt_d'] },
  { key: 'correctAnswer', label: 'Correct Answer (A/B/C/D)', required: true, hints: ['correct_answer', 'correct answer', 'answer', 'ans', 'correct_option', 'key'] },
  { key: 'rationale', label: 'Rationale / Explanation', required: false, hints: ['rationale', 'explanation', 'expl', 'reason', 'justification'] },
  { key: 'domain', label: 'Domain Number / Code', required: false, hints: ['domain', 'domain_number', 'domain_id', 'domain code', 'chapter'] },
  { key: 'difficulty', label: 'Difficulty (easy/medium/hard)', required: false, hints: ['difficulty', 'level', 'diff'] },
];

export const FieldMappingStudio: React.FC<FieldMappingStudioProps> = ({
  detectedHeaders,
  rawRows,
  onMappingConfirm,
  onCancel,
}) => {
  const [mapping, setMapping] = useState<Record<string, string>>({});

  // Auto-detect columns on mount
  useEffect(() => {
    const initialMapping: Record<string, string> = {};
    for (const target of TARGET_FIELDS) {
      for (const header of detectedHeaders) {
        const normHeader = header.toLowerCase().replace(/[\s-_]+/g, '');
        for (const hint of target.hints) {
          const normHint = hint.toLowerCase().replace(/[\s-_]+/g, '');
          if (normHeader === normHint) {
            initialMapping[target.key] = header;
            break;
          }
        }
        if (initialMapping[target.key]) break;
      }
    }
    setMapping(initialMapping);
  }, [detectedHeaders]);

  const handleFieldChange = (targetKey: string, sourceHeader: string) => {
    setMapping((prev) => ({
      ...prev,
      [targetKey]: sourceHeader,
    }));
  };

  const previewRows = rawRows.slice(0, 4);

  return (
    <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <div className="ereader-meta-badge">
            🗺️ Interactive Field Mapping Studio
          </div>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-ink)', margin: 'var(--space-1) 0 0 0' }}>
            Map Imported Columns to System Schema
          </h2>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)', margin: '2px 0 0 0' }}>
            Match your uploaded spreadsheet columns to the standard question attributes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={() => onMappingConfirm(mapping)}
            className="btn btn-primary"
            disabled={!mapping.stem || !mapping.optionA || !mapping.optionB || !mapping.correctAnswer}
          >
            Confirm Mapping ➔
          </button>
        </div>
      </div>

      {/* Grid of Mappings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', backgroundColor: 'var(--color-bg-subtle)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
        {TARGET_FIELDS.map((target) => {
          const selected = mapping[target.key] || '';
          return (
            <div key={target.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: target.required ? 'var(--color-ink)' : 'var(--color-ink-muted)' }}>
                  {target.label} {target.required && <strong style={{ color: 'var(--color-error)' }}>*</strong>}
                </span>
                {selected && (
                  <span style={{ fontSize: '10px', color: 'var(--color-success)', fontWeight: 'bold' }}>
                    ✓ Mapped
                  </span>
                )}
              </div>

              <select
                value={selected}
                onChange={(e) => handleFieldChange(target.key, e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-md)',
                  border: selected ? '1px solid var(--color-primary-light)' : '1px solid var(--color-bg-muted)',
                  fontSize: 'var(--text-xs)',
                  backgroundColor: '#fff',
                }}
              >
                <option value="">-- Choose matching column --</option>
                {detectedHeaders.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* Live 4-Row Transformation Preview */}
      <div>
        <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', textTransform: 'uppercase', color: 'var(--color-ink-muted)', marginBottom: 'var(--space-2)', letterSpacing: '0.05em' }}>
          Live Data Preview (First {previewRows.length} Rows)
        </h4>

        <div style={{ overflowX: 'auto', border: '1px solid var(--color-bg-muted)', borderRadius: 'var(--radius-lg)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-subtle)', borderBottom: '2px solid var(--color-bg-muted)', textAlign: 'left' }}>
                <th style={{ padding: 'var(--space-2)' }}>#</th>
                <th style={{ padding: 'var(--space-2)' }}>Mapped Stem</th>
                <th style={{ padding: 'var(--space-2)' }}>Option A</th>
                <th style={{ padding: 'var(--space-2)' }}>Option B</th>
                <th style={{ padding: 'var(--space-2)' }}>Ans</th>
                <th style={{ padding: 'var(--space-2)' }}>Mapped Rationale</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-bg-muted)' }}>
                  <td style={{ padding: 'var(--space-2)', fontFamily: 'var(--font-mono)' }}>{idx + 1}</td>
                  <td style={{ padding: 'var(--space-2)', maxWidth: '240px' }}>
                    {mapping.stem && row[mapping.stem] ? row[mapping.stem].slice(0, 60) + '...' : <span style={{ color: 'var(--color-error)' }}>Unmapped</span>}
                  </td>
                  <td style={{ padding: 'var(--space-2)', maxWidth: '140px' }}>
                    {mapping.optionA && row[mapping.optionA] ? row[mapping.optionA].slice(0, 30) : '-'}
                  </td>
                  <td style={{ padding: 'var(--space-2)', maxWidth: '140px' }}>
                    {mapping.optionB && row[mapping.optionB] ? row[mapping.optionB].slice(0, 30) : '-'}
                  </td>
                  <td style={{ padding: 'var(--space-2)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    {mapping.correctAnswer && row[mapping.correctAnswer] ? row[mapping.correctAnswer] : '-'}
                  </td>
                  <td style={{ padding: 'var(--space-2)', maxWidth: '200px' }}>
                    {mapping.rationale && row[mapping.rationale] ? row[mapping.rationale].slice(0, 50) + '...' : <span className="text-muted">Auto-generated</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
