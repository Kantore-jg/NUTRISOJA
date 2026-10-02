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
          <h1 class="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1C1C1C] leading-[1.15] tracking-tight">
            La force nutritionnelle du <span class="text-[#2E7D32]">soja</span> cultivé avec fierté au Burundi.
          </h1>

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
            <RouterLink
              to="/contact"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#1C1C1C] font-semibold text-base border border-gray-300 hover:border-[#2E7D32] hover:bg-[#2E7D32]/5 shadow-xs transition-all"
            >
              <span>Nous contacter &amp; Devis ONG</span>
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

              <!-- Overlaid Badge -->
              <div class="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/40">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">
                      Produit Phare
                    </span>
                    <h4 class="font-heading font-bold text-gray-900 text-sm sm:text-base">
                      Lait de Soja NutriSoy &amp; TotoFort
                    </h4>
                    <p class="text-xs text-gray-500">Disponible dans plus de 150 points de vente</p>
                  </div>
                  <span class="text-sm font-extrabold text-[#D4A017] bg-[#1C1C1C] px-3 py-1.5 rounded-xl">
                    Dès 1 800 BIF
                  </span>
                </div>
              </div>
            </div>

            <!-- FLOATING BENEFIT PILL -->
            <div class="absolute -top-4 -right-4 sm:-right-6 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-[#D4A017]/20 flex items-center justify-center text-[#D4A017] font-bold text-lg">
                38%
              </div>
              <div>
                <p class="text-xs font-bold text-gray-900">Riche en Protéines</p>
                <p class="text-[11px] text-gray-500">8 acides aminés essentiels</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
