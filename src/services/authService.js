const AUTH_STORAGE_KEY = 'nutrisoja_auth_session';

const DEMO_ADMIN = {
  id: 'usr-admin-01',
  email: 'admin@nutrisoja.bi',
  name: 'Directeur Général (Admin)',
  role: 'admin',
};

export const authService = {
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  async login(email, password) {
    await new Promise((res) => setTimeout(res, 250));

    const cleanEmail = email.trim().toLowerCase();

    if (
      (cleanEmail === 'admin@nutrisoja.bi' && password === 'NutriSoja2026!') ||
      (cleanEmail === 'admin@nutrisoja.bi' && password.length >= 6) ||
      cleanEmail === 'demo@nutrisoja.bi'
    ) {
      const user = {
        ...DEMO_ADMIN,
        email: cleanEmail,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    throw new Error('Identifiants incorrects. Veuillez utiliser admin@nutrisoja.bi / NutriSoja2026!');
  },

  async logout() {
    await new Promise((res) => setTimeout(res, 100));
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};
