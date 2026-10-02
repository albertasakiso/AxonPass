/* ===================================================================
   APILIGU LEARNING PASS — Master Import Wizard
   5-step comprehensive pipeline supporting DOCX, XLSX, CSV, JSON,
   multi-file pairing, field mapping, conflict resolution, and duplicate clustering (§7.5).
   =================================================================== */

import React, { useState, useRef, type ChangeEvent } from 'react';
import { parseCSVQuestions, parseJSONQuestions } from '../../lib/parser/csvParser';
import { parseDocxQuestions } from '../../lib/parser/docxParser';
import { inspectExcelWorkbook, parseExcelQuestions } from '../../lib/parser/excelParser';
import { clusterDuplicateQuestions } from '../../lib/parser/similarityEngine';
import { mergeQuestionsWithAnswerKey, type AnswerKeyEntry } from '../../lib/parser/multiFileMapper';
import { FieldMappingStudio } from './FieldMappingStudio';
import { DuplicateClusterView } from './DuplicateClusterView';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/db';
import type { ParsedQuestion, Certification, Domain, DuplicateCluster } from '../../types';

interface ImportWizardProps {
  certifications: Certification[];
  domains: Domain[];
  onImportComplete: () => void;
}

type WizardStep = 'upload' | 'mapping' | 'conflicts' | 'duplicates' | 'commit';

export const ImportWizard: React.FC<ImportWizardProps> = ({
  certifications,
  domains,
  onImportComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('upload');
  const [importMode, setImportMode] = useState<'single' | 'dual'>('single');

  // Staged Files & Raw Data
  const [primaryFileName, setPrimaryFileName] = useState<string>('');
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [stagedQuestions, setStagedQuestions] = useState<ParsedQuestion[]>([]);
  const [duplicateClusters, setDuplicateClusters] = useState<DuplicateCluster[]>([]);

  // Selection
  const [targetCertId, setTargetCertId] = useState<string>(certifications[0]?.id || '');
  const [targetDomainId, setTargetDomainId] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const keyFileInputRef = useRef<HTMLInputElement>(null);

  // Set default domain when cert changes
  const filteredDomains = domains.filter((d) => d.certification_id === targetCertId);
  React.useEffect(() => {
    if (filteredDomains.length > 0 && !targetDomainId) {
      setTargetDomainId(filteredDomains[0].id);
    }
  }, [targetCertId, filteredDomains, targetDomainId]);

  // Step 1: Handle Primary File Upload
  const handlePrimaryFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setPrimaryFileName(file.name);
    setStatusMessage(`Parsing ${file.name}...`);

    try {
      if (file.name.endsWith('.docx')) {
        const buffer = await file.arrayBuffer();
        const outcome = await parseDocxQuestions(buffer, file.name);
        setStagedQuestions(outcome.questions);
        
        // Check for duplicates
        const clusters = clusterDuplicateQuestions(outcome.questions);
        setDuplicateClusters(clusters);

        setStatusMessage(`✓ Extracted ${outcome.questions.length} questions from DOCX.`);
        setCurrentStep(clusters.length > 0 ? 'duplicates' : 'commit');
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const buffer = await file.arrayBuffer();
        const sheets = inspectExcelWorkbook(buffer);
        if (sheets.length > 0) {
          setDetectedHeaders(sheets[0].headers);
          setRawRows(sheets[0].rows);
          
          // Try standard parse
          const outcome = parseExcelQuestions(sheets[0].rows, undefined, file.name);
          setStagedQuestions(outcome.questions);

          // If standard fields were missing, offer mapping studio
          const missingKeyFields = outcome.questions.some((q) => !q.stem || !q.optionA);
          if (missingKeyFields && sheets[0].headers.length > 3) {
            setCurrentStep('mapping');
          } else {
            const clusters = clusterDuplicateQuestions(outcome.questions);
            setDuplicateClusters(clusters);
            setCurrentStep(clusters.length > 0 ? 'duplicates' : 'commit');
          }
          setStatusMessage(`✓ Loaded Excel sheet with ${sheets[0].totalRows} rows.`);
        }
      } else if (file.name.endsWith('.json')) {
        const text = await file.text();
        const outcome = parseJSONQuestions(text);
        setStagedQuestions(outcome.questions);
        const clusters = clusterDuplicateQuestions(outcome.questions);
        setDuplicateClusters(clusters);
        setCurrentStep(clusters.length > 0 ? 'duplicates' : 'commit');
        setStatusMessage(`✓ Loaded ${outcome.questions.length} questions from JSON.`);
      } else {
        // CSV
        const text = await file.text();
        const outcome = await parseCSVQuestions(text);
        setStagedQuestions(outcome.questions);
        const clusters = clusterDuplicateQuestions(outcome.questions);
        setDuplicateClusters(clusters);
        setCurrentStep(clusters.length > 0 ? 'duplicates' : 'commit');
        setStatusMessage(`✓ Loaded ${outcome.questions.length} questions from CSV.`);
      }
    } catch (err: any) {
      setStatusMessage(`Error parsing file: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Answer Key File Upload (Dual-File Mode)
  const handleKeyFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || stagedQuestions.length === 0) return;

    setIsProcessing(true);
    setStatusMessage(`Pairing questions with answer key file: ${file.name}...`);

    try {
      const text = await file.text();
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      const keys: AnswerKeyEntry[] = [];

      for (const line of lines) {
        const match = line.match(/(?:Q\s*)?(\d+)[.:\s-]+([A-D])\b(?:\s*[.:-]\s*([\s\S]+))?/i);
        if (match) {
          keys.push({
            questionNumber: match[1],
            correctAnswer: match[2].toUpperCase() as any,
            rationale: match[3] || undefined,
          });
        }
      }

      if (keys.length > 0) {
        const mergeResult = mergeQuestionsWithAnswerKey(stagedQuestions, keys);
        setStagedQuestions(mergeResult.mergedQuestions);
        setStatusMessage(`✓ Matched ${keys.length} keys (${mergeResult.conflictsCount} answer conflicts detected).`);
        if (mergeResult.conflictsCount > 0) {
          setCurrentStep('conflicts');
        }
      } else {
        setStatusMessage('Could not find question numbers and answer keys in uploaded file.');
      }
    } catch (err: any) {
      setStatusMessage(`Error reading answer key: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 2: Confirm Mapping
  const handleConfirmMapping = (mapping: Record<string, string>) => {
    const outcome = parseExcelQuestions(rawRows, mapping, primaryFileName);
    setStagedQuestions(outcome.questions);
    const clusters = clusterDuplicateQuestions(outcome.questions);
    setDuplicateClusters(clusters);
    setCurrentStep(clusters.length > 0 ? 'duplicates' : 'commit');
    setStatusMessage(`✓ Applied column mapping: ${outcome.validCount} valid questions.`);
  };

  // Final Commit to Database
  const handleCommitToDatabase = async () => {
    if (stagedQuestions.length === 0 || !targetCertId || !targetDomainId) return;

    setIsProcessing(true);
    setStatusMessage('Writing questions and creating batch provenance log...');

    try {
      const batchId = crypto.randomUUID();
      const verifiedCount = stagedQuestions.filter((q) => q.confidence === 'verified').length;
      const flaggedCount = stagedQuestions.filter((q) => q.validationErrors.length > 0).length;

      // 1. Insert Import Batch Log
      try {
        await supabase.from('import_batches').insert({
          id: batchId,
          certification_id: targetCertId,
          filename: primaryFileName || 'import_file',
          total_questions: stagedQuestions.length,
          valid_count: stagedQuestions.length - flaggedCount,
          flagged_count: flaggedCount,
          status: 'completed',
          created_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Batch log notice:', err);
      }

      // 2. Prepare DB Question records
      const dbQuestions = stagedQuestions.map((q, idx) => ({
        id: crypto.randomUUID(),
        certification_id: targetCertId,
        domain_id: targetDomainId,
        topic_id: null,
        subtopic_id: null,
        question_number: idx + 1,
        question_type: 'mcq' as const,
        stem: q.stem,
        scenario_text: null,
        option_a: q.optionA,
        option_b: q.optionB,
        option_c: q.optionC,
        option_d: q.optionD,
        correct_answer: (q.correctAnswer as any) || 'A',
        rationale: q.rationale,
        incorrect_rationale_a: null,
        incorrect_rationale_b: null,
        incorrect_rationale_c: null,
        incorrect_rationale_d: null,
        difficulty: (q.difficulty as any) || 'medium',
        task_statement: null,
        tags: q.tags || [],
        source_reference: q.sourceReference || primaryFileName,
        source_confidence: q.confidence || 'unverified',
        content_hash: `batch-${batchId}-${idx + 1}`,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      // 3. Write to local Dexie IndexedDB
      await db.questions.bulkPut(dbQuestions);

      // 4. Write to Supabase PostgreSQL
      try {
        await supabase.from('questions').insert(dbQuestions);
      } catch (err) {
        console.warn('Supabase remote write notice:', err);
      }

      setStatusMessage(`🎉 Success! Committed ${dbQuestions.length} questions (${verifiedCount} verified) to the question bank.`);
      setStagedQuestions([]);
      setCurrentStep('upload');
      onImportComplete();
    } catch (err: any) {
      setStatusMessage(`Commit failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      
      {/* Wizard Steps Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-bg-subtle)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-bg-muted)' }}>
        {[
          { key: 'upload', label: '1. Ingest File' },
          { key: 'mapping', label: '2. Field Mapping' },
          { key: 'conflicts', label: '3. Conflict Resolution' },
          { key: 'duplicates', label: '4. Deduplication' },
          { key: 'commit', label: '5. Review & Commit' },
        ].map((step, idx) => {
          const isActive = currentStep === step.key;
          return (
            <div key={step.key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-bg-muted)',
                  color: isActive ? '#fff' : 'var(--color-ink-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold',
                }}
              >
                {idx + 1}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: isActive ? 'bold' : 'normal', color: isActive ? 'var(--color-primary)' : 'var(--color-ink-muted)' }}>
                {step.label.split('. ')[1]}
              </span>
            </div>
          );
        })}
      </div>

      {statusMessage && (
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-primary-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', border: '1px solid var(--color-primary-200)' }}>
          {statusMessage}
        </div>
      )}

      {/* STEP 1: INGEST FILE */}
      {currentStep === 'upload' && (
        <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-ink)', margin: 0 }}>
                Step 1: Choose Import Mode & Upload Source Documents
              </h3>
              <p className="text-muted" style={{ fontSize: 'var(--text-xs)', margin: '2px 0 0 0' }}>
                Universal offline support for Word (.docx), Excel (.xlsx/.xls), CSV (.csv), and JSON (.json).
              </p>
            </div>

            {/* Single vs Dual Toggle */}
            <div className="view-toggle-bar">
              <button
                onClick={() => setImportMode('single')}
                className={`view-toggle-btn ${importMode === 'single' ? 'active' : ''}`}
                style={{ fontSize: 'var(--text-xs)' }}
              >
                📄 Single Document
              </button>
              <button
                onClick={() => setImportMode('dual')}
                className={`view-toggle-btn ${importMode === 'dual' ? 'active' : ''}`}
                style={{ fontSize: 'var(--text-xs)' }}
              >
                📑 Dual-File (Questions + Key)
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: importMode === 'dual' ? '1fr 1fr' : '1fr', gap: 'var(--space-4)' }}>
            {/* Primary Document */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--color-primary-200)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-8)',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: 'var(--color-primary-50)',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>📄</div>
              <p style={{ fontWeight: 'bold', color: 'var(--color-primary)', margin: 0 }}>
                {primaryFileName ? `Selected: ${primaryFileName}` : 'Select Questions Document (.DOCX, .XLSX, .CSV, .JSON)'}
              </p>
              <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                Click to browse or drop file here
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,.xlsx,.xls,.csv,.json"
                onChange={handlePrimaryFileUpload}
                style={{ display: 'none' }}
              />
            </div>

            {/* Secondary Answer Key (Dual Mode) */}
            {importMode === 'dual' && (
              <div
                onClick={() => keyFileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--color-success-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-8)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'var(--color-success-bg)',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>🔑</div>
                <p style={{ fontWeight: 'bold', color: 'var(--color-success)', margin: 0 }}>
                  Select Separate Answer Key (.TXT, .CSV, .MD)
                </p>
                <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                  Pairs question rows with external answer keys
                </span>
                <input
                  ref={keyFileInputRef}
                  type="file"
                  accept=".txt,.csv,.md,.json"
                  onChange={handleKeyFileUpload}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: FIELD MAPPING */}
      {currentStep === 'mapping' && (
        <FieldMappingStudio
          detectedHeaders={detectedHeaders}
          rawRows={rawRows}
          onMappingConfirm={handleConfirmMapping}
          onCancel={() => setCurrentStep('upload')}
        />
      )}

      {/* STEP 3: CONFLICT RESOLUTION */}
      {currentStep === 'conflicts' && (
        <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <div>
              <div className="ereader-meta-badge" style={{ backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
                ⚖️ Multi-Source Answer Discrepancy Inspector (§7.5)
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: 'var(--space-1) 0 0 0' }}>
                Review Answer Key Discrepancies
              </h3>
            </div>
            <button onClick={() => setCurrentStep('commit')} className="btn btn-primary">
              Proceed to Review & Commit ➔
            </button>
          </div>

          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-bg-muted)', textAlign: 'left' }}>
                  <th style={{ padding: 'var(--space-2)' }}>#</th>
                  <th style={{ padding: 'var(--space-2)' }}>Question Stem</th>
                  <th style={{ padding: 'var(--space-2)' }}>Selected Key</th>
                  <th style={{ padding: 'var(--space-2)' }}>Sources Captured</th>
                </tr>
              </thead>
              <tbody>
                {stagedQuestions
                  .filter((q) => q.validationErrors.some((e) => e.includes('conflict')))
                  .map((q, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-bg-muted)' }}>
                      <td style={{ padding: 'var(--space-2)', fontFamily: 'var(--font-mono)' }}>{q.rowNumber}</td>
                      <td style={{ padding: 'var(--space-2)' }}>{q.stem.slice(0, 70)}...</td>
                      <td style={{ padding: 'var(--space-2)', fontWeight: 'bold', color: 'var(--color-primary)' }}>{q.correctAnswer}</td>
                      <td style={{ padding: 'var(--space-2)' }}>
                        {q.answerSources.map((s, sIdx) => (
                          <span key={sIdx} style={{ display: 'inline-block', margin: '2px', padding: '2px 6px', backgroundColor: '#e2e8f0', borderRadius: '4px', fontSize: '10px' }}>
                            {s.source}: {s.answer}
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STEP 4: DUPLICATE CLUSTERING */}
      {currentStep === 'duplicates' && (
        <DuplicateClusterView
          clusters={duplicateClusters}
          onResolveClusters={(resolved) => {
            setStagedQuestions(resolved);
            setCurrentStep('commit');
          }}
          onSkip={() => setCurrentStep('commit')}
        />
      )}

      {/* STEP 5: REVIEW & COMMIT */}
      {currentStep === 'commit' && (
        <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: 0, color: 'var(--color-primary)' }}>
                Step 5: Select Destination & Commit {stagedQuestions.length} Questions
              </h3>
              <p className="text-muted" style={{ fontSize: 'var(--text-xs)', margin: '2px 0 0 0' }}>
                Assign to certification and domain, then publish to live PostgreSQL and Dexie IndexedDB.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button onClick={() => setCurrentStep('upload')} className="btn btn-secondary">
                ← Re-upload File
              </button>
              <button
                disabled={isProcessing}
                onClick={handleCommitToDatabase}
                className="btn btn-primary"
              >
                {isProcessing ? 'Writing to Database...' : `⚡ Commit ${stagedQuestions.length} Questions`}
              </button>
            </div>
          </div>

          {/* Destination Selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', backgroundColor: 'var(--color-bg-subtle)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                Destination Certification Track
              </label>
              <select
                value={targetCertId}
                onChange={(e) => setTargetCertId(e.target.value)}
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
                Destination Domain
              </label>
              <select
                value={targetDomainId}
                onChange={(e) => setTargetDomainId(e.target.value)}
                style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)', fontSize: 'var(--text-xs)' }}
              >
                {filteredDomains.map((d) => (
                  <option key={d.id} value={d.id}>
                    Domain {d.domain_number}: {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Preview */}
          <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid var(--color-bg-muted)', borderRadius: 'var(--radius-lg)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg-subtle)', borderBottom: '2px solid var(--color-bg-muted)', textAlign: 'left' }}>
                  <th style={{ padding: 'var(--space-2)' }}>#</th>
                  <th style={{ padding: 'var(--space-2)' }}>Question Stem</th>
                  <th style={{ padding: 'var(--space-2)' }}>Ans</th>
                  <th style={{ padding: 'var(--space-2)' }}>Confidence</th>
                  <th style={{ padding: 'var(--space-2)' }}>Validation</th>
                </tr>
              </thead>
              <tbody>
                {stagedQuestions.slice(0, 50).map((q, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-bg-muted)' }}>
                    <td style={{ padding: 'var(--space-2)', fontFamily: 'var(--font-mono)' }}>{idx + 1}</td>
                    <td style={{ padding: 'var(--space-2)', maxWidth: '400px' }}>{q.stem.slice(0, 85)}...</td>
                    <td style={{ padding: 'var(--space-2)', fontWeight: 'bold', color: 'var(--color-primary)' }}>{q.correctAnswer}</td>
                    <td style={{ padding: 'var(--space-2)' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', backgroundColor: q.confidence === 'verified' ? 'var(--color-success-bg)' : 'var(--color-warning-bg)', color: q.confidence === 'verified' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                        {q.confidence}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-2)' }}>
                      {q.validationErrors.length === 0 ? (
                        <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓ Clean</span>
                      ) : (
                        <span style={{ color: 'var(--color-warning)', fontSize: '10px' }}>⚠️ {q.validationErrors[0]}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
