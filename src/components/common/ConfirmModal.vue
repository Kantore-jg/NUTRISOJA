<script setup>
import { AlertTriangle, X } from 'lucide-vue-next'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  confirmLabel: { type: String, default: 'Confirmer' },
  cancelLabel: { type: String, default: 'Annuler' },
  isDestructive: { type: Boolean, default: true },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
    <div
      role="dialog"
      aria-modal="true"
      class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 transform transition-all animate-scaleUp"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
              isDestructive ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
            ]"
          >
            <AlertTriangle class="w-5 h-5" />
          </div>
          <h3 class="font-heading font-bold text-lg text-gray-900">{{ title }}</h3>
        </div>
        <button
          @click="emit('cancel')"
          class="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
          aria-label="Fermer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <p class="mt-3 text-sm text-gray-600 leading-relaxed">{{ message }}</p>

      <div class="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          @click="emit('cancel')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
        >
          {{ cancelLabel }}
        </button>
        <button
          type="button"
          @click="emit('confirm')"
          :class="[
            'px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition-all',
            isDestructive
              ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
              : 'bg-[#2E7D32] hover:bg-[#1B5E20]'
          ]"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>
