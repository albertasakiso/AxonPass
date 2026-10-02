/* ===================================================================
   APILIGU LEARNING PASS — App Shell (Main Layout)
   =================================================================== */

import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import SideRail from './SideRail';
import Header from './Header';

export default function AppShell() {
  return (
    <div className="app-shell">
      <SideRail />
      <Header />
      <main className="app-content" role="main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
