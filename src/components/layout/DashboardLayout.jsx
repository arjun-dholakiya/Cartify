import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

/* ─── Dashboard Layout ── */
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <main className="lg:ml-60 pt-14 min-h-screen">
        <div className="p-4 sm:p-5 lg:p-7 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
