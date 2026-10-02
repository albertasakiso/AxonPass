/* ===================================================================
   APILIGU LEARNING PASS — Side Rail Navigation (Desktop)
   =================================================================== */

import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../types';

export default function SideRail() {
  return (
    <aside className="side-rail desktop-only" role="navigation" aria-label="Main navigation">
      <div className="side-rail-logo">
        <span aria-hidden="true">📘</span> Learning Pass
      </div>

      <nav className="side-rail-nav">
        {NAV_ITEMS.map((item) => (
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
