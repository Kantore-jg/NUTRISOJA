<script setup>
defineProps({
  rows: { type: Number, default: 5 },
})
</script>

<template>
  <div class="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div class="h-12 bg-gray-100 border-b border-gray-200" />
    <div class="divide-y divide-gray-100">
      <div v-for="i in rows" :key="i" class="p-4 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 w-1/3">
          <div class="w-10 h-10 rounded-lg bg-gray-200 shrink-0" />
          <div class="space-y-1.5 w-full">
            <div class="h-4 bg-gray-200 rounded w-3/4" />
            <div class="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
        <div class="h-4 bg-gray-200 rounded w-20" />
        <div class="h-4 bg-gray-200 rounded w-24" />
        <div class="h-8 bg-gray-200 rounded-lg w-16" />
      </div>
    </div>
  </div>
</template>
