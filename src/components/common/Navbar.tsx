import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Leaf, MessageSquare, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Nos Produits', path: '/produits' },
    { label: 'Actualités & Santé', path: '/blog' },
    { label: 'À Propos', path: '/a-propos' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F5F1E8]/95 backdrop-blur-md border-b border-[#2E7D32]/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#2E7D32] rounded-lg p-1">
            <div className="w-11 h-11 rounded-xl bg-[#2E7D32] flex items-center justify-center shadow-md text-white group-hover:bg-[#1B5E20] transition-colors">
              <Leaf className="w-6 h-6 text-[#D4A017]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl tracking-tight text-[#1C1C1C] group-hover:text-[#2E7D32] transition-colors">
                NUTRI <span className="text-[#2E7D32]">SOJA</span>
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#5A5A5A]">
                Agroalimentaire du Burundi
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-[#2E7D32] bg-[#2E7D32]/10 font-semibold'
                      : 'text-[#1C1C1C] hover:text-[#2E7D32] hover:bg-[#2E7D32]/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Order via WhatsApp */}
            <a
              href="https://wa.me/25779000000?text=Bonjour%20NUTRI%20SOJA,%20je%20souhaite%20commander%20vos%20produits"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-sm font-semibold hover:bg-[#1B5E20] shadow-sm hover:shadow transition-all"
            >
              <MessageSquare className="w-4 h-4 text-[#D4A017]" />
              <span>Commander</span>
            </a>

            {/* Admin link badge */}
            <Link
              to="/admin"
              className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                isAuthenticated
                  ? 'bg-amber-100/70 border-amber-300 text-amber-900 hover:bg-amber-200'
                  : 'bg-white/80 border-gray-200 text-gray-600 hover:text-[#2E7D32] hover:border-[#2E7D32]/40'
              }`}
              title={isAuthenticated ? 'Espace Admin connecté' : 'Accès Espace Admin'}
            >
              <Shield className="w-4 h-4 text-[#2E7D32]" />
              <span className="hidden lg:inline">{isAuthenticated ? 'Admin (Actif)' : 'Admin'}</span>
            </Link>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/admin"
              className="p-2 rounded-lg text-gray-600 hover:text-[#2E7D32]"
              aria-label="Accéder au back-office"
            >
              <Shield className="w-5 h-5 text-[#2E7D32]" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#1C1C1C] hover:bg-[#2E7D32]/10 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              aria-label="Menu principal"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="md:hidden border-b border-[#2E7D32]/15 bg-[#F5F1E8] px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-[#2E7D32] text-white font-semibold'
                    : 'text-[#1C1C1C] hover:bg-[#2E7D32]/10'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-[#2E7D32]/15 flex flex-col gap-2">
            <a
              href="https://wa.me/25779000000?text=Bonjour%20NUTRI%20SOJA,%20je%20souhaite%20commander%20vos%20produits"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#2E7D32] text-white font-semibold shadow-sm"
            >
              <MessageSquare className="w-5 h-5 text-[#D4A017]" />
              <span>Commander via WhatsApp</span>
            </a>
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700"
            >
              <Shield className="w-4 h-4 text-[#2E7D32]" />
              <span>Espace d'administration</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
