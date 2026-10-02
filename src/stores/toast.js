import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([]);

  function removeToast(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  function showToast({ type, message, title, duration = 4000 }) {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    toasts.value = [...toasts.value, { id, type, message, title, duration }];

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }

  function success(message, title) {
    showToast({ type: 'success', message, title });
  }

  function error(message, title) {
    showToast({ type: 'error', message, title });
  }

  function warning(message, title) {
    showToast({ type: 'warning', message, title });
  }

  function info(message, title) {
    showToast({ type: 'info', message, title });
  }

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
});
