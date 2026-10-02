import React, { useState, useMemo } from 'react';
import type { GlossaryTerm } from '../../types';

interface GlossaryDrawerProps {
  terms: GlossaryTerm[];
  onClose: () => void;
}

export const GlossaryDrawer: React.FC<GlossaryDrawerProps> = ({ terms, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    terms.forEach(t => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [terms]);

  const filteredTerms = useMemo(() => {
    return terms.filter(t => {
      const matchSearch = t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.acronym && t.acronym.toLowerCase().includes(searchTerm.toLowerCase())) ||
        t.definition.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [terms, searchTerm, selectedCategory]);

  return (
    <div className="reader-modal-overlay animate-fade-in" onClick={onClose}>
      <div className="reader-modal-dialog" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="reader-modal-header">
          <div>
            <h2 className="ereader-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span>📖</span> Master Glossary & Flashcards
            </h2>
            <p className="text-muted" style={{ fontSize: 'var(--text-xs)', margin: 0, marginTop: '2px' }}>
              {terms.length} verified terms and definitions available offline
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ minHeight: '36px', width: '36px', padding: 0, borderRadius: 'var(--radius-full)' }}
          >
            ✕
          </button>
        </div>

        {/* Search & Category Filter */}
        <div style={{ padding: 'var(--space-4) var(--space-6)', backgroundColor: 'var(--color-bg-subtle)', borderBottom: '1px solid var(--color-bg-muted)' }}>
          <input
            type="text"
            placeholder="Search glossary terms, acronyms, or definitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ width: '100%', marginBottom: 'var(--space-3)' }}
          />

          {categories.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: '2px' }}>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`btn btn-secondary ${selectedCategory === 'all' ? 'active' : ''}`}
                style={{
                  minHeight: '28px',
                  padding: '2px 10px',
                  fontSize: 'var(--text-xs)',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: selectedCategory === 'all' ? 'var(--color-primary)' : 'var(--color-bg)',
                  color: selectedCategory === 'all' ? 'var(--color-ink-inverse)' : 'var(--color-ink)',
                }}
              >
                All ({terms.length})
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-secondary ${selectedCategory === cat ? 'active' : ''}`}
                  style={{
                    minHeight: '28px',
                    padding: '2px 10px',
                    fontSize: 'var(--text-xs)',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-bg)',
                    color: selectedCategory === cat ? 'var(--color-ink-inverse)' : 'var(--color-ink)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Term Cards List */}
        <div className="reader-modal-body">
          {filteredTerms.length === 0 ? (
            <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
              <p className="text-muted">No glossary terms match your search.</p>
            </div>
          ) : (
            filteredTerms.map((t) => (
              <div
                key={t.id}
                className="card"
                style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-3)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{ fontWeight: 'var(--weight-bold)', color: 'var(--color-ink)', fontSize: 'var(--text-base)' }}>
                      {t.term}
                    </span>
                    {t.acronym && (
                      <span className="topic-code-tag">
                        {t.acronym}
                      </span>
                    )}
                  </div>
                  {t.category && (
                    <span className="term-chip" style={{ margin: 0 }}>
                      {t.category}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink)', lineHeight: 1.5, margin: 0 }}>
                  {t.definition}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="reader-modal-footer">
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
            Showing {filteredTerms.length} of {terms.length} terms
          </span>
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Close Glossary
          </button>
        </div>
      </div>
    </div>
  );
};
