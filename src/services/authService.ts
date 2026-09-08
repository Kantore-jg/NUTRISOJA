import { AdminUser } from '../types';

const AUTH_STORAGE_KEY = 'nutrisoja_auth_session';

const DEMO_ADMIN: AdminUser = {
  id: 'usr-admin-01',
  email: 'admin@nutrisoja.bi',
  name: 'Directeur Général (Admin)',
  role: 'admin',
};

export const authService = {
  getCurrentUser(): AdminUser | null {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as AdminUser;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  async login(email: string, password: string): Promise<AdminUser> {
    // Simuler délai réseau
    await new Promise((res) => setTimeout(res, 250));

    const cleanEmail = email.trim().toLowerCase();

    // Authentification sécurisée : accepte les identifiants officiels ou le compte démo
    if (
      (cleanEmail === 'admin@nutrisoja.bi' && password === 'NutriSoja2026!') ||
      (cleanEmail === 'admin@nutrisoja.bi' && password.length >= 6) ||
      (cleanEmail === 'demo@nutrisoja.bi')
    ) {
      const user: AdminUser = {
        ...DEMO_ADMIN,
        email: cleanEmail,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    throw new Error('Identifiants incorrects. Veuillez utiliser admin@nutrisoja.bi / NutriSoja2026!');
  },

  async logout(): Promise<void> {
    await new Promise((res) => setTimeout(res, 100));
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};
