import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/src/services/authService';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isLoading = ref(true);

  const isAuthenticated = computed(() => !!user.value);

  function init() {
    user.value = authService.getCurrentUser();
    isLoading.value = false;
  }

  async function login(email, password) {
    const loggedUser = await authService.login(email, password);
    user.value = loggedUser;
  }

  async function logout() {
    await authService.logout();
    user.value = null;
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    init,
    login,
    logout,
  };
});
