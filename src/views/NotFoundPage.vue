<script setup>
import { Home, ArrowLeft, Leaf } from 'lucide-vue-next'
</script>

<template>
  <div class="py-24 md:py-32 bg-[#F5F1E8] min-h-[70vh] flex items-center justify-center">
    <div class="max-w-md mx-auto px-4 text-center space-y-6">
      <div class="w-16 h-16 rounded-2xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center mx-auto">
        <Leaf class="w-8 h-8 text-[#D4A017]" />
      </div>

      <span class="font-heading font-black text-6xl text-[#2E7D32]">404</span>

      <h1 class="font-heading font-extrabold text-2xl text-[#1C1C1C]">
        Page introuvable
      </h1>

      <p class="text-sm text-gray-600 leading-relaxed">
        La page que vous tentez d'ouvrir n'existe pas ou a été déplacée.
        Retrouvez nos produits au soja et notre actualité sur l'accueil.
      </p>

      <div class="flex items-center justify-center gap-3 pt-2">
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E7D32] text-white text-sm font-semibold hover:bg-[#1B5E20] transition-colors"
        >
          <Home class="w-4 h-4" />
          <span>Page d'accueil</span>
        </RouterLink>
        <RouterLink
          to="/produits"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Nos produits</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
