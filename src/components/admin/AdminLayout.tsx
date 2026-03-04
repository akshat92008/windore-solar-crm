import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Map, FolderOpen, Settings, LogOut, Bell, Search, Sun, Kanban } from 'lucide-react';
import { cn } from '../../lib/utils';
import AdminLogin, { useAdminAuth } from './AdminLogin';

export default function AdminLayout() {
  const location = useLocation();
  const { authed, login, logout } = useAdminAuth();

  // Show login gate if not authenticated
  if (!authed) {
    return <AdminLogin onLogin={login} />;
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Leads', path: '/admin/leads' },
    { icon: Kanban, label: 'Kanban Board', path: '/admin/kanban' },
    { icon: Map, label: 'Projects', path: '/admin/projects' },
    { icon: FolderOpen, label: 'Documents', path: '/admin/documents' },
  ];

  return (
    <div className="min-h-screen bg-earth-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-earth-200 flex flex-col hidden md:flex fixed h-full z-10">
        <div className="h-20 flex items-center px-6 border-b border-earth-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-solar-500 p-1.5 rounded-md text-white">
              <Sun className="h-5 w-5" />
            </div>
            <span className="font-display font-bold text-xl text-earth-900 tracking-tight">Windore CRM</span>
          </Link>
        </div>

        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-earth-400 uppercase tracking-wider mb-4 px-2">Main Menu</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-earth-900 text-white shadow-sm"
                    : "text-earth-600 hover:bg-earth-100 hover:text-earth-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-solar-400" : "text-earth-400")} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-earth-100">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-earth-600 hover:bg-earth-100 hover:text-earth-900 w-full transition-colors">
            <Settings className="w-5 h-5 text-earth-400" />
            Settings
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors mt-1">
            <LogOut className="w-5 h-5 text-red-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-earth-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center bg-earth-50 px-4 py-2 rounded-full border border-earth-200 w-96 focus-within:ring-2 focus-within:ring-solar-500 focus-within:border-transparent transition-all">
            <Search className="w-5 h-5 text-earth-400 mr-2" />
            <input
              type="text"
              placeholder="Search leads, projects, or documents..."
              className="bg-transparent border-none focus:outline-none text-sm w-full text-earth-900 placeholder-earth-400"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-earth-400 hover:text-earth-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-earth-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-earth-900">Alex Morgan</div>
                <div className="text-xs text-earth-500">Sales Manager</div>
              </div>
              <img
                src="https://i.pravatar.cc/150?img=32"
                alt="Profile"
                className="w-10 h-10 rounded-full border border-earth-200"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
