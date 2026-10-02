/* ===================================================================
   APILIGU LEARNING PASS — Bottom Navigation (Mobile)
   =================================================================== */

import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../types';
import { useProgressStore } from '../../stores/progressStore';
import { useAuthStore } from '../../stores/authStore';
import { triggerHaptic } from '../../lib/haptics';

export default function BottomNav() {
  const { reviewDueCount } = useProgressStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'owner' || user?.role === 'admin';
  const visibleNavItems = NAV_ITEMS.filter((item) => item.id !== 'admin' || isAdmin);

  return (
    <nav className="bottom-nav mobile-only" role="navigation" aria-label="Main navigation">
      {visibleNavItems.map((item) => {
        const showBadge = item.id === 'practice' && reviewDueCount > 0;

        return (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={() => triggerHaptic(8)}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            aria-label={`${item.label}${showBadge ? ` (${reviewDueCount} reviews due)` : ''}`}
          >
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              {showBadge && (
                <span className="nav-badge-count" aria-hidden="true">
                  {reviewDueCount > 99 ? '99+' : reviewDueCount}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
