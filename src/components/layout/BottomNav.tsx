/* ===================================================================
   APILIGU LEARNING PASS — Bottom Navigation (Mobile)
   Includes Home, Learn, Practice, Insights, and More sheet (Paths, Academy, Books, Settings)
   =================================================================== */

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../types';
import { useProgressStore } from '../../stores/progressStore';
import { useAuthStore } from '../../stores/authStore';
import { triggerHaptic } from '../../lib/haptics';

export default function BottomNav() {
  const { reviewDueCount } = useProgressStore();
  const { user } = useAuthStore();
  const [moreOpen, setMoreOpen] = useState(false);
  const isAdmin = user?.role === 'owner' || user?.role === 'admin';

  const primaryNav = NAV_ITEMS.filter((i) => ['home', 'learn', 'practice', 'insights'].includes(i.id));
  const moreLinks = [
    { id: 'paths', label: 'Paths', path: '/paths', icon: '🗺️' },
    { id: 'academy', label: 'Academy', path: '/academy', icon: '🎓' },
    { id: 'books', label: 'Books', path: '/books', icon: '📖' },
    { id: 'courses', label: 'Courses', path: '/courses', icon: '🎯' },
    { id: 'settings', label: 'Settings', path: '/settings', icon: '⚙️' },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', path: '/admin', icon: '🛡️' }] : []),
  ];

  return (
    <>
      {moreOpen && (
        <div
          className="mobile-only mobile-more-sheet"
          role="dialog"
          aria-label="More Navigation Options"
          style={{
            position: 'fixed',
            bottom: '68px',
            right: '12px',
            zIndex: 60,
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '8px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.22)',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '6px',
            minWidth: '210px',
          }}
        >
          {moreLinks.map((m) => (
            <NavLink
              key={m.id}
              to={m.path}
              onClick={() => {
                triggerHaptic(8);
                setMoreOpen(false);
              }}
              className={({ isActive }) => `btn btn-xs ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'flex-start', gap: '6px', padding: '8px 10px' }}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </NavLink>
          ))}
        </div>
      )}

      <nav className="bottom-nav mobile-only" role="navigation" aria-label="Main navigation">
        {primaryNav.map((item) => {
          const showBadge = item.id === 'practice' && reviewDueCount > 0;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => {
                triggerHaptic(8);
                setMoreOpen(false);
              }}
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

        <button
          type="button"
          onClick={() => {
            triggerHaptic(8);
            setMoreOpen((s) => !s);
          }}
          className={`nav-item ${moreOpen ? 'active' : ''}`}
          aria-expanded={moreOpen}
          aria-label="More destinations"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span className="nav-icon" aria-hidden="true">⋯</span>
          <span>More</span>
        </button>
      </nav>
    </>
  );
}
