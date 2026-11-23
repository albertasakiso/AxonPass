/* ===================================================================
   ANOXPASS — Adaptive Daily Study Mission Dashboard Card
   =================================================================== */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { downloadStudyPlanIcs, type DailyStudyMission } from '../../lib/studyPlanner';
import { toDbCertSlug } from '../../lib/textbookService';

interface DailyMissionCardProps {
  certName: string;
  mission: DailyStudyMission;
  onLaunchWeakDrill?: () => void;
}

export const DailyMissionCard: React.FC<DailyMissionCardProps> = ({
  certName,
  mission,
  onLaunchWeakDrill,
}) => {
  const navigate = useNavigate();

  return (
    <section
      className="card mb-5"
      style={{
        padding: 'var(--space-5)',
        borderLeft: `4px solid ${mission.isCatchUp ? 'var(--color-warning)' : 'var(--color-primary)'}`,
        background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-subtle) 100%)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: 'var(--space-3)' }}>
        <div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4px' }}>
            <span className="badge badge-primary" style={{ fontSize: '10px' }}>
              📅 Today’s Adaptive Study Mission
            </span>
            {mission.daysRemaining !== null && (
              <span className={`badge ${mission.isCatchUp ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '10px' }}>
                {mission.isCatchUp ? `⚡ Catch-Up · ${mission.daysRemaining}d left` : `${mission.daysRemaining} days to exam`}
              </span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 600 }}>
            {mission.summaryLine}
          </p>
        </div>

        <button
          type="button"
          className="btn btn-xs btn-secondary"
          onClick={() => downloadStudyPlanIcs(certName, mission)}
          title="Download 7-day study calendar (.ics)"
        >
          📅 Export 7-Day .ICS
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ justifyContent: 'space-between', height: 'auto', padding: '10px 12px' }}
          onClick={() => navigate(`/learn/${toDbCertSlug(mission.certSlug)}?tab=textbook`)}
        >
          <span>📖 Read {mission.sectionsTarget} Subchapter(s)</span>
          <span>→</span>
        </button>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ justifyContent: 'space-between', height: 'auto', padding: '10px 12px' }}
          onClick={() => navigate('/academy?tab=fsrs')}
        >
          <span>🧠 Clear {mission.fsrsTarget} FSRS Cards</span>
          <span>→</span>
        </button>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          style={{ justifyContent: 'space-between', height: 'auto', padding: '10px 12px' }}
          onClick={() => (onLaunchWeakDrill ? onLaunchWeakDrill() : navigate('/practice'))}
        >
          <span>
            ⚡ Drill {mission.questionsTarget} Qs{mission.weakDomainName ? ` (${mission.weakDomainName.slice(0, 16)})` : ''}
          </span>
          <span>→</span>
        </button>
      </div>
    </section>
  );
};

export default DailyMissionCard;
