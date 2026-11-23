/* ===================================================================
   ANOXPASS — Interactive Performance-Based Question (PBQ) Labs Page
   =================================================================== */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PBQ_LABS } from '../data/pbqLabs';
import PbqLabPlayer from '../components/quiz/pbq/PbqLabPlayer';
import { useAuthStore } from '../stores/authStore';
import { useAcademyProgressStore } from '../stores/academyProgressStore';

export default function PbqLabsPage() {
  const navigate = useNavigate();
  const { activeCertificationSlug } = useAuthStore();
  const { completeCourseDrill } = useAcademyProgressStore();
  const [certFilter, setCertFilter] = useState<string>('all');

  const filteredLabs = useMemo(() => {
    if (certFilter === 'all') return PBQ_LABS;
    if (certFilter === 'active') {
      const m = PBQ_LABS.filter((l) => l.certSlug === activeCertificationSlug);
      return m.length > 0 ? m : PBQ_LABS;
    }
    return PBQ_LABS.filter((l) => l.certSlug === certFilter);
  }, [certFilter, activeCertificationSlug]);

  const [selectedLabId, setSelectedLabId] = useState<string>(
    () => PBQ_LABS.find((l) => l.certSlug === activeCertificationSlug)?.id || PBQ_LABS[0].id
  );
  const [scoresByLab, setScoresByLab] = useState<Record<string, number>>({});

  const activeLab = filteredLabs.find((l) => l.id === selectedLabId) || filteredLabs[0] || PBQ_LABS[0];

  return (
    <div style={{ paddingBottom: 'var(--space-12)' }}>
      <div className="learn-header-banner mb-5">
        <div>
          <div className="learn-header-badge">🧪 Performance-Based Exam Simulator</div>
          <h1 className="learn-header-title">Interactive PBQ &amp; Hands-On Labs</h1>
          <p className="learn-header-desc">
            Practice non-MCQ performance-based simulations: firewall ACL rule ordering, Zero Trust component mapping, RFC 3227 forensics volatility order, AWS VPC triage, ISACA audit evidence, quantitative ALE math, and FIFA fee caps.
          </p>
        </div>
        <div className="learn-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/practice')}>
            ← Practice Hub
          </button>
        </div>
      </div>

      <div className="tier-filter-bar mb-4" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button type="button" className={`tier-pill ${certFilter === 'all' ? 'active' : ''}`} onClick={() => setCertFilter('all')}>
          All Labs ({PBQ_LABS.length})
        </button>
        <button type="button" className={`tier-pill ${certFilter === 'active' ? 'active' : ''}`} onClick={() => setCertFilter('active')}>
          Active Track ({activeCertificationSlug.toUpperCase()})
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 'var(--space-5)', alignItems: 'start' }}>
        {/* Left List */}
        <div className="card" style={{ padding: 'var(--space-3)', display: 'grid', gap: '8px' }}>
          {filteredLabs.map((l) => {
            const isSel = l.id === activeLab.id;
            const sc = scoresByLab[l.id];
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setSelectedLabId(l.id)}
                className={`btn btn-sm ${isSel ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'space-between', textAlign: 'left', height: 'auto', padding: '10px 12px', whiteSpace: 'normal' }}
              >
                <span>
                  <strong style={{ fontSize: '11px', display: 'block' }}>{l.certCode} · {l.mechanic.toUpperCase()}</strong>
                  {l.title}
                </span>
                {typeof sc === 'number' && (
                  <span className="badge badge-success" style={{ marginLeft: '6px' }}>{sc}%</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Interactive PBQ Stage */}
        <div style={{ gridColumn: 'span 2' }}>
          <PbqLabPlayer
            lab={activeLab}
            onCompleteLab={(labId, scorePct, xp) => {
              setScoresByLab((prev) => ({ ...prev, [labId]: scorePct }));
              if (scorePct >= 75) {
                completeCourseDrill({ certId: activeLab.certSlug, drillId: labId, xpReward: xp });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
