<script setup>
import { RouterLink } from 'vue-router'
import { ArrowRight, CheckCircle, ShieldCheck } from 'lucide-vue-next'
</script>

<template>
  <section class="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-gradient-to-b from-[#F5F1E8] via-[#FAF8F5] to-[#F5F1E8]">
    <!-- Subtle organic background shapes -->
    <div class="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#2E7D32]/5 blur-3xl rounded-full pointer-events-none" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <!-- TEXT CONTENT -->
        <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
          <h3 class="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1C1C1C] leading-[1.15] tracking-tight">
            « La saveur naturelle »          </h3>

          <p class="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Des laits végétaux onctueux, des farines enrichies pour nourrissons et du tofu artisanal frais.
            Une source naturelle de protéines complètes, abordable et saine pour les familles, les écoles et les partenaires nutritionnels.
          </p>

          <!-- CTAs -->
          <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <RouterLink
              to="/produits"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#2E7D32] text-white font-semibold text-base hover:bg-[#1B5E20] shadow-md hover:shadow-lg transition-all"
            >
              <span>Découvrir nos produits</span>
              <ArrowRight class="w-5 h-5 text-[#D4A017]" />
            </RouterLink>
            
          </div>

          <!-- TRUST BADGES -->
          <div class="pt-6 border-t border-[#2E7D32]/15 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-gray-700">
            <div class="flex items-center gap-2">
              <CheckCircle class="w-4 h-4 text-[#2E7D32]" />
              <span class="font-medium">100% Graines locales</span>
            </div>
            <div class="flex items-center gap-2">
              <ShieldCheck class="w-4 h-4 text-[#2E7D32]" />
              <span class="font-medium">Normes de salubrité certifiées</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle class="w-4 h-4 text-[#2E7D32]" />
              <span class="font-medium">Sans lactose &amp; Sans cholestérol</span>
            </div>
          </div>
        </div>

        <!-- PRODUCT VISUAL SHOWCASE -->
        <div class="lg:col-span-5 relative">
          <div class="relative mx-auto max-w-md lg:max-w-none">
            <div class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80"
                alt="Gamme de produits NUTRI SOJA Burundi"
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
