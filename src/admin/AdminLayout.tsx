import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FileText,
  Megaphone,
  Inbox,
  Database,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Leaf,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { messageService } from '../services/messageService';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      const messages = await messageService.getAll();
      setUnreadCount(messages.filter((m) => !m.isRead).length);
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    success('Déconnexion réussie.');
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Tableau de bord', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Produits', path: '/admin/produits', icon: Package },
    { label: 'Articles de blog', path: '/admin/articles', icon: FileText },
    { label: 'Publicités & Bannières', path: '/admin/publicites', icon: Megaphone },
    { label: 'Messages de contact', path: '/admin/messages', icon: Inbox, badge: unreadCount },
    { label: 'Configuration Supabase', path: '/admin/supabase', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans">
      {/* MOBILE HEADER */}
      <header className="md:hidden bg-[#1C1C1C] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2E7D32] flex items-center justify-center text-white">
            <Leaf className="w-4 h-4 text-[#D4A017]" />
          </div>
          <span className="font-heading font-bold text-base text-white">
            NUTRI <span className="text-[#D4A017]">ADMIN</span>
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-300 hover:text-white"
          aria-label="Menu administration"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* SIDEBAR NAVIGATION (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1C1C1C] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* LOGO */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white shadow-sm">
                <Leaf className="w-5 h-5 text-[#D4A017]" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-lg text-white block">
                  NUTRI <span className="text-[#D4A017]">SOJA</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                  Back-Office
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* NAV LINKS */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#2E7D32] text-white shadow-xs font-semibold'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#D4A017]" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white animate-pulse">
                      {item.badge}
                    </span>
                  ) : null}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* USER PROFILE & LOGOUT */}
        <div className="p-4 border-t border-white/10 space-y-3">
          {/* Public site link */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-amber-300 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Voir le site public
            </span>
            <span className="text-[10px] text-gray-400">Nouvel onglet</span>
          </Link>

          {/* User info */}
          <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-xs shrink-0">
                <Shield className="w-4 h-4 text-[#D4A017]" />
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrateur'}</p>
                <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              title="Se déconnecter"
              aria-label="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* BACKDROP FOR MOBILE */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};
