/* ===================================================================
   ANOXPASS — Streak, XP, FSRS Due & Supabase Realtime Status Bar
   =================================================================== */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAcademyProgressStore } from '../../stores/academyProgressStore';
import { useAuthStore } from '../../stores/authStore';

export function StreakXpBar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    gamification,
    realtimeStatus,
    connectedDevices,
    getDueFsrsCards,
    initRealtime,
  } = useAcademyProgressStore();

  useEffect(() => {
    initRealtime(user?.id ?? null);
  }, [user?.id, initRealtime]);

  const dueCount = getDueFsrsCards().length;
  const isLive = realtimeStatus === 'connected';

  return (
    <div className="streak-xp-bar" aria-label="Learning progress and realtime sync status">
      <button
        type="button"
        className="stat-chip stat-chip--streak"
        onClick={() => navigate('/academy')}
        title={`Current streak: ${gamification.currentStreak} days (Best: ${gamification.longestStreak}d)`}
      >
        <span>🔥</span>
        <span>{gamification.currentStreak}d</span>
      </button>

      <button
        type="button"
        className="stat-chip stat-chip--xp"
        onClick={() => navigate('/paths')}
        title={`Level ${gamification.currentLevel} • ${gamification.totalXp} Total XP (${gamification.todayXp}/${gamification.dailyXpGoal} XP today)`}
      >
        <span>⚡</span>
        <span>Lv.{gamification.currentLevel}</span>
        <span className="desktop-only">· {gamification.totalXp} XP</span>
      </button>

      {dueCount > 0 && (
        <button
          type="button"
          className="stat-chip stat-chip--fsrs"
          onClick={() => navigate('/academy?tab=fsrs')}
          title={`${dueCount} FSRS spaced-repetition cards due for review`}
        >
          <span>🧠</span>
          <span>{dueCount} due</span>
        </button>
      )}

      <div
        className={`stat-chip ${isLive ? 'stat-chip--realtime' : 'stat-chip--offline'}`}
        title={
          isLive
            ? `Supabase Realtime Live (${connectedDevices.length || 1} active device)`
            : 'Local-first offline sync active'
        }
      >
        {isLive && <span className="realtime-pulse" aria-hidden="true" />}
        <span className="desktop-only">
          {isLive ? `Live${connectedDevices.length > 1 ? ` (${connectedDevices.length})` : ''}` : 'Local'}
        </span>
      </div>
    </div>
  );
}

export default StreakXpBar;
