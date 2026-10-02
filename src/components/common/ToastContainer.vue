<script setup>
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-vue-next'
import { useToastStore } from '@/src/stores/toast'

const toast = useToastStore()

function toastClasses(type) {
  switch (type) {
    case 'success': return 'bg-emerald-50 border-emerald-200 text-emerald-950'
    case 'error': return 'bg-red-50 border-red-200 text-red-950'
    case 'warning': return 'bg-amber-50 border-amber-200 text-amber-950'
    default: return 'bg-blue-50 border-blue-200 text-blue-950'
  }
}
</script>

<template>
  <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none p-2">
    <div
      v-for="item in toast.toasts"
      :key="item.id"
      role="alert"
      :class="[
        'pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border transition-all duration-300 transform translate-y-0',
        toastClasses(item.type)
      ]"
    >
      <div class="shrink-0 mt-0.5">
        <CheckCircle2 v-if="item.type === 'success'" class="w-5 h-5 text-emerald-600" />
        <AlertCircle v-else-if="item.type === 'error'" class="w-5 h-5 text-red-600" />
        <AlertTriangle v-else-if="item.type === 'warning'" class="w-5 h-5 text-amber-600" />
        <Info v-else class="w-5 h-5 text-blue-600" />
      </div>
      <div class="flex-1 text-sm">
        <h5 v-if="item.title" class="font-semibold mb-0.5">{{ item.title }}</h5>
        <p class="leading-snug">{{ item.message }}</p>
      </div>
      <button
        @click="toast.removeToast(item.id)"
        class="text-gray-400 hover:text-gray-700 transition-colors p-1"
        aria-label="Fermer la notification"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
