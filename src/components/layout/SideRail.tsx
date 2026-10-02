/* ===================================================================
   APILIGU LEARNING PASS — Side Rail Navigation (Desktop)
   =================================================================== */

import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import { AxonPassLogo } from '../common/AxonPassLogo';

export default function SideRail() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'owner' || user?.role === 'admin';
  const visibleNavItems = NAV_ITEMS.filter((item) => item.id !== 'admin' || isAdmin);

  return (
    <aside className="side-rail desktop-only" role="navigation" aria-label="Main navigation">
      <div className="side-rail-logo" style={{ padding: 'var(--space-4) var(--space-4)' }}>
        <NavLink to="/" style={{ textDecoration: 'none' }}>
          <AxonPassLogo size={32} showText={true} />
        </NavLink>
      </div>

      <nav className="side-rail-nav">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `side-rail-item ${isActive ? 'active' : ''}`
            }
          >
            <span aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto" style={{ paddingTop: 'var(--space-8)' }}>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `side-rail-item ${isActive ? 'active' : ''}`
          }
        >
          <span aria-hidden="true">⚙️</span>
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}
