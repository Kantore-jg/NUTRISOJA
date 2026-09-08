import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Leaf, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin@nutrisoja.bi');
  const [password, setPassword] = useState('NutriSoja2026!');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Destination redirect
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin';

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    try {
      await login(email, password);
      success('Connexion réussie ! Bienvenue sur le back-office NUTRI SOJA.');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Identifiants incorrects';
      setFormError(msg);
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@nutrisoja.bi');
    setPassword('NutriSoja2026!');
    setFormError('');
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2E7D32] flex items-center justify-center shadow-lg text-white">
            <Leaf className="w-7 h-7 text-[#D4A017]" />
          </div>
          <div className="text-left">
            <span className="font-heading font-extrabold text-2xl tracking-tight text-[#1C1C1C]">
              NUTRI <span className="text-[#2E7D32]">SOJA</span>
            </span>
            <span className="block text-xs uppercase tracking-wider text-gray-500 font-medium">
              Administration Sécurisée
            </span>
          </div>
        </Link>
        <h2 className="font-heading font-bold text-2xl text-gray-900">
          Connexion au Back-Office
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Gérez le catalogue produits, les articles du blog, les bannières et messages.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-gray-100">
          {formError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Adresse Email Administrateur
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nutrisoja.bi"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Mot de Passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-semibold shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Vérification...</span>
              ) : (
                <>
                  <span>Accéder au panneau d'administration</span>
                  <ArrowRight className="w-4 h-4 text-[#D4A017]" />
                </>
              )}
            </button>
          </form>

          {/* DEMO CREDENTIALS SHORTCUT BOX */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Identifiants Démo Pré-remplis</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Email : <strong className="text-gray-900">admin@nutrisoja.bi</strong><br />
                Mot de passe : <strong className="text-gray-900">NutriSoja2026!</strong>
              </p>
              <button
                type="button"
                onClick={handleDemoFill}
                className="w-full mt-2 py-1.5 px-3 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold text-[11px] transition-colors shadow-2xs"
              >
                Remplir automatiquement les accès de test
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-xs font-semibold text-gray-500 hover:text-[#2E7D32] transition-colors"
              >
                ← Retourner au site vitrine public
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
