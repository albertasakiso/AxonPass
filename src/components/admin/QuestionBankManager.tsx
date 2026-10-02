/* ===================================================================
   APILIGU LEARNING PASS — Question Bank Manager
   Full-featured search, filter, inline edit, bulk actions, and export.
   =================================================================== */

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/db';
import { exportQuestionsToExcel, exportQuestionsToCsv } from '../../lib/parser/templateGenerator';
import { QuestionEditorModal } from './QuestionEditorModal';
import type { Question, Certification, Domain } from '../../types';

interface QuestionBankManagerProps {
  certifications: Certification[];
  domains: Domain[];
}

export const QuestionBankManager: React.FC<QuestionBankManagerProps> = ({
  certifications,
  domains,
}) => {
  const [selectedCertId, setSelectedCertId] = useState<string>(certifications[0]?.id || '');
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedConfidence, setSelectedConfidence] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;

  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Load Questions
  const loadQuestions = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('questions')
      .select('*', { count: 'exact' });

    if (selectedCertId) {
      query = query.eq('certification_id', selectedCertId);
    }
    if (selectedDomainId !== 'all') {
      query = query.eq('domain_id', selectedDomainId);
    }
    if (selectedDifficulty !== 'all') {
      query = query.eq('difficulty', selectedDifficulty);
    }
    if (selectedConfidence !== 'all') {
      query = query.eq('source_confidence', selectedConfidence);
    }
    if (searchTerm.trim()) {
      query = query.ilike('stem', `%${searchTerm.trim()}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await query
      .order('question_number', { ascending: true })
      .range(from, to);

    if (data) {
      setQuestions(data);
      setTotalCount(count || 0);
    } else if (error) {
      console.error('Error loading questions:', error);
    }
    setLoading(false);
  }, [selectedCertId, selectedDomainId, selectedDifficulty, selectedConfidence, searchTerm, page]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleToggleSelectAll = () => {
    if (selectedQuestionIds.size === questions.length) {
      setSelectedQuestionIds(new Set());
    } else {
      setSelectedQuestionIds(new Set(questions.map((q) => q.id)));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkStatusChange = async (active: boolean) => {
    if (selectedQuestionIds.size === 0) return;
    const ids = Array.from(selectedQuestionIds);
    await supabase.from('questions').update({ is_active: active }).in('id', ids);
    await db.questions.where('id').anyOf(ids).modify({ is_active: active });
    setSelectedQuestionIds(new Set());
    loadQuestions();
  };

  const handleBulkDelete = async () => {
    if (selectedQuestionIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedQuestionIds.size} questions? This action cannot be undone.`)) return;
    const ids = Array.from(selectedQuestionIds);
    await supabase.from('questions').delete().in('id', ids);
    await db.questions.bulkDelete(ids);
    setSelectedQuestionIds(new Set());
    loadQuestions();
  };

  const handleSaveQuestion = async (qData: Partial<Question>) => {
    if (editingQuestion) {
      // Update existing
      await supabase.from('questions').update(qData).eq('id', editingQuestion.id);
      await db.questions.update(editingQuestion.id, qData);
    } else {
      // Insert new
      const newQ = {
        ...qData,
        id: crypto.randomUUID(),
        question_number: totalCount + 1,
        question_type: 'mcq' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Question;
      await supabase.from('questions').insert(newQ);
      await db.questions.put(newQ);
    }
    loadQuestions();
  };

  const handleExport = async (format: 'xlsx' | 'csv' | 'json') => {
    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('certification_id', selectedCertId);

    if (!data || data.length === 0) {
      alert('No questions available to export.');
      return;
    }

    const currentCert = certifications.find((c) => c.id === selectedCertId);
    const certSlug = currentCert?.slug || 'certification';

    if (format === 'xlsx') {
      exportQuestionsToExcel(data, certSlug);
    } else if (format === 'csv') {
      exportQuestionsToCsv(data, `${certSlug}_questions`);
    } else {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${certSlug}_questions_backup.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const filteredDomains = domains.filter((d) => d.certification_id === selectedCertId);

  return (
    <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
      
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-ink)', margin: 0 }}>
            Question Bank Manager ({totalCount.toLocaleString()} Total Questions)
          </h2>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)', margin: '2px 0 0 0' }}>
            Filter, edit, batch manage, and export questions across all active certification blueprints.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <button onClick={() => setIsCreatingNew(true)} className="btn btn-primary" style={{ fontSize: 'var(--text-xs)' }}>
            ➕ Add Question
          </button>
          <button onClick={() => handleExport('xlsx')} className="btn btn-secondary" style={{ fontSize: 'var(--text-xs)' }}>
            📊 Export .XLSX
          </button>
          <button onClick={() => handleExport('csv')} className="btn btn-secondary" style={{ fontSize: 'var(--text-xs)' }}>
            📄 Export .CSV
          </button>
          <button onClick={() => handleExport('json')} className="btn btn-secondary" style={{ fontSize: 'var(--text-xs)' }}>
            💾 Export .JSON
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)', backgroundColor: 'var(--color-bg-subtle)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)' }}>
        
        {/* Search */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
            Search Stem
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            placeholder="Type keywords..."
            style={{ width: '100%', padding: 'var(--space-1) var(--space-2)', fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)' }}
          />
        </div>

        {/* Cert */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
            Certification Track
          </label>
          <select
            value={selectedCertId}
            onChange={(e) => { setSelectedCertId(e.target.value); setSelectedDomainId('all'); setPage(1); }}
            style={{ width: '100%', padding: 'var(--space-1) var(--space-2)', fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)' }}
          >
            {certifications.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name.split('—')[0].trim()}
              </option>
            ))}
          </select>
        </div>

        {/* Domain */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
            Domain
          </label>
          <select
            value={selectedDomainId}
            onChange={(e) => { setSelectedDomainId(e.target.value); setPage(1); }}
            style={{ width: '100%', padding: 'var(--space-1) var(--space-2)', fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)' }}
          >
            <option value="all">All Domains</option>
            {filteredDomains.map((d) => (
              <option key={d.id} value={d.id}>
                Domain {d.domain_number}: {d.name.slice(0, 20)}...
              </option>
            ))}
          </select>
        </div>

        {/* Confidence */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
            Confidence Level (§7.5)
          </label>
          <select
            value={selectedConfidence}
            onChange={(e) => { setSelectedConfidence(e.target.value); setPage(1); }}
            style={{ width: '100%', padding: 'var(--space-1) var(--space-2)', fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)' }}
          >
            <option value="all">All Confidence</option>
            <option value="verified">Verified Key (Corroborated)</option>
            <option value="unverified">Unverified Key</option>
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
            Difficulty
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => { setSelectedDifficulty(e.target.value); setPage(1); }}
            style={{ width: '100%', padding: 'var(--space-1) var(--space-2)', fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-muted)' }}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

      </div>

      {/* Bulk Action Bar */}
      {selectedQuestionIds.size > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-primary-50)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', border: '1px solid var(--color-primary-200)' }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
            {selectedQuestionIds.size} question(s) selected
          </span>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button onClick={() => handleBulkStatusChange(true)} className="btn btn-secondary" style={{ fontSize: '11px', minHeight: '28px' }}>
              ✓ Activate
            </button>
            <button onClick={() => handleBulkStatusChange(false)} className="btn btn-secondary" style={{ fontSize: '11px', minHeight: '28px' }}>
              ⏸ Deactivate
            </button>
            <button onClick={handleBulkDelete} className="btn btn-secondary" style={{ fontSize: '11px', minHeight: '28px', color: 'var(--color-error)' }}>
              🗑 Delete
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
          <div className="animate-spin" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>⟳</div>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)' }}>Loading question records...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="card text-center" style={{ padding: 'var(--space-12)' }}>
          <p className="text-muted">No questions found matching your filter criteria.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-bg-muted)', borderRadius: 'var(--radius-lg)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-subtle)', borderBottom: '2px solid var(--color-bg-muted)', textAlign: 'left' }}>
                <th style={{ padding: 'var(--space-3)', width: '30px' }}>
                  <input
                    type="checkbox"
                    checked={selectedQuestionIds.size === questions.length && questions.length > 0}
                    onChange={handleToggleSelectAll}
                  />
                </th>
                <th style={{ padding: 'var(--space-3)' }}>#</th>
                <th style={{ padding: 'var(--space-3)' }}>Question Stem</th>
                <th style={{ padding: 'var(--space-3)' }}>Ans</th>
                <th style={{ padding: 'var(--space-3)' }}>Confidence</th>
                <th style={{ padding: 'var(--space-3)' }}>Difficulty</th>
                <th style={{ padding: 'var(--space-3)' }}>Status</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => {
                const isSelected = selectedQuestionIds.has(q.id);
                return (
                  <tr key={q.id} style={{ borderBottom: '1px solid var(--color-bg-muted)', backgroundColor: isSelected ? 'var(--color-primary-50)' : undefined }}>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectOne(q.id)}
                      />
                    </td>
                    <td style={{ padding: 'var(--space-3)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                      {q.question_number || '•'}
                    </td>
                    <td style={{ padding: 'var(--space-3)', maxWidth: '380px' }}>
                      <div style={{ fontWeight: 'var(--weight-medium)', color: 'var(--color-ink)', marginBottom: '2px' }}>
                        {q.stem}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                        <strong>A:</strong> {q.option_a.slice(0, 30)} | <strong>B:</strong> {q.option_b.slice(0, 30)}
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-3)', fontWeight: 'bold', color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>
                      {q.correct_answer}
                    </td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 'bold', backgroundColor: q.source_confidence === 'verified' ? 'var(--color-success-bg)' : 'var(--color-bg-subtle)', color: q.source_confidence === 'verified' ? 'var(--color-success)' : 'var(--color-ink-muted)', border: q.source_confidence === 'verified' ? '1px solid var(--color-success-border)' : '1px solid var(--color-bg-muted)' }}>
                        {q.source_confidence === 'verified' ? '✓ Verified' : 'ℹ️ Standard'}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-3)', textTransform: 'capitalize' }}>
                      {q.difficulty}
                    </td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <span style={{ color: q.is_active ? 'var(--color-success)' : 'var(--color-ink-muted)', fontWeight: 'bold' }}>
                        {q.is_active ? '● Active' : '○ Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-3)', textAlign: 'right' }}>
                      <button
                        onClick={() => setEditingQuestion(q)}
                        className="btn btn-secondary"
                        style={{ fontSize: '11px', padding: '2px 8px', minHeight: '26px' }}
                      >
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)' }}>
        <span className="text-muted">
          Showing {Math.min((page - 1) * pageSize + 1, totalCount)} to {Math.min(page * pageSize, totalCount)} of {totalCount} questions
        </span>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="btn btn-secondary"
            style={{ fontSize: '11px', minHeight: '28px' }}
          >
            ← Previous
          </button>
          <span style={{ display: 'flex', alignItems: 'center', padding: '0 var(--space-2)', fontWeight: 'bold' }}>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="btn btn-secondary"
            style={{ fontSize: '11px', minHeight: '28px' }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Modal for Edit or Create */}
      {(editingQuestion || isCreatingNew) && (
        <QuestionEditorModal
          question={editingQuestion}
          certifications={certifications}
          domains={domains}
          onSave={handleSaveQuestion}
          onClose={() => { setEditingQuestion(null); setIsCreatingNew(false); }}
        />
      )}

    </div>
  );
};
