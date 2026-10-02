import React, { useState } from 'react';
import type { TaskStatement } from '../../types';

interface TaskStatementsDrawerProps {
  taskStatements: TaskStatement[];
  onClose: () => void;
}

const domainNames: Record<number, string> = {
  1: 'Domain 1: Information System Auditing Process (18%)',
  2: 'Domain 2: Governance and Management of IT (18%)',
  3: 'Domain 3: Information Systems Acquisition, Development & Implementation (12%)',
  4: 'Domain 4: Information Systems Operations and Business Resilience (26%)',
  5: 'Domain 5: Protection of Information Assets (26%)',
};

export const TaskStatementsDrawer: React.FC<TaskStatementsDrawerProps> = ({ taskStatements, onClose }) => {
  const [selectedDomain, setSelectedDomain] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTasks = taskStatements.filter(t => {
    const matchDomain = selectedDomain === 'all' || (t.related_domains && t.related_domains.includes(selectedDomain));
    const matchSearch =
      t.task_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDomain && matchSearch;
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '900px',
          width: '90%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span className="badge badge-primary" style={{ fontSize: 'var(--text-xs)' }}>
                ISACA CISA JOB PRACTICE
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                Official Task Statements ({taskStatements.length})
              </span>
            </div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-ink)', margin: 'var(--space-1) 0 0 0' }}>
              IS Auditor Task Statements & Competencies
            </h2>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: 'var(--space-1) var(--space-3)', minHeight: '32px' }}
          >
            ✕ Close
          </button>
        </div>

        {/* Toolbar: Domain Selector & Search */}
        <div style={{ padding: 'var(--space-4) var(--space-6)', backgroundColor: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-border)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedDomain('all')}
              className={`btn btn-secondary ${selectedDomain === 'all' ? 'active' : ''}`}
              style={{
                fontSize: 'var(--text-xs)',
                padding: 'var(--space-1) var(--space-3)',
                backgroundColor: selectedDomain === 'all' ? 'var(--color-primary)' : undefined,
                color: selectedDomain === 'all' ? '#fff' : undefined,
              }}
            >
              All Domains
            </button>
            {[1, 2, 3, 4, 5].map(dom => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`btn btn-secondary ${selectedDomain === dom ? 'active' : ''}`}
                style={{
                  fontSize: 'var(--text-xs)',
                  padding: 'var(--space-1) var(--space-3)',
                  backgroundColor: selectedDomain === dom ? 'var(--color-primary)' : undefined,
                  color: selectedDomain === dom ? '#fff' : undefined,
                }}
              >
                Domain {dom}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search task statements (e.g. T1.1, encryption, BIA)..."
            className="input"
            style={{ maxWidth: '300px', fontSize: 'var(--text-xs)' }}
          />
        </div>

        {/* Task List Content */}
        <div style={{ padding: 'var(--space-6)', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {filteredTasks.length === 0 ? (
            <div className="text-center" style={{ padding: 'var(--space-12)' }}>
              <p className="text-muted">No task statements match your filter criteria.</p>
            </div>
          ) : (
            filteredTasks.map(task => {
              const domainNum = task.related_domains?.[0] || 1;
              return (
                <div
                  key={task.id}
                  style={{
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--weight-bold)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          color: 'var(--color-primary)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        {task.task_code}
                      </span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                        {domainNames[domainNum] || `Domain ${domainNum}`}
                      </span>
                    </div>

                    <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                      Official Competency
                    </span>
                  </div>

                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink)', fontWeight: 'var(--weight-medium)', margin: 0, lineHeight: 1.5 }}>
                    {task.description}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
