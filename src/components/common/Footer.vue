<script setup>
import { RouterLink } from 'vue-router'
import { MapPin, Phone, Mail, Clock, ArrowRight, Shield } from 'lucide-vue-next'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-[#1C1C1C] text-[#F5F1E8] pt-16 pb-12 border-t-4 border-[#2E7D32]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        <!-- COLONNE 1: ENTREPRISE -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <img
              src="/assets/logo.png"
              alt="NUTRI SOJA Burundi"
              class="w-12 h-12 rounded-xl object-cover shadow-md ring-1 ring-white/20"
            />
            <span class="font-heading font-bold text-xl tracking-tight text-white">
              NUTRI <span class="text-[#D4A017]">SOJA</span>
            </span>
          </div>
          <p class="text-sm text-gray-300 leading-relaxed">
            Entreprise agroalimentaire burundaise pionnière dans la transformation et la valorisation du soja cultivé localement. Nous nourrissons le Burundi avec des produits sains, riches en protéines et accessibles à tous.
          </p>
        </div>

        <!-- COLONNE 2: PRODUITS -->
        <div>
          <h4 class="font-heading font-semibold text-base text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            Nos Gammes
          </h4>
          <ul class="space-y-2.5 text-sm">
            <li>
              <RouterLink to="/produits?cat=boissons" class="text-gray-300 hover:text-[#D4A017] transition-colors flex items-center gap-1.5">
                <ArrowRight class="w-3.5 h-3.5 text-[#2E7D32]" />
                Laits de soja (Nature &amp; Vanille)
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/produits?cat=farines" class="text-gray-300 hover:text-[#D4A017] transition-colors flex items-center gap-1.5">
                <ArrowRight class="w-3.5 h-3.5 text-[#2E7D32]" />
                Farines fortifiées TotoFort
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/produits?cat=farines" class="text-gray-300 hover:text-[#D4A017] transition-colors flex items-center gap-1.5">
                <ArrowRight class="w-3.5 h-3.5 text-[#2E7D32]" />
                Farine pâtissière et boulangère
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/produits?cat=derives" class="text-gray-300 hover:text-[#D4A017] transition-colors flex items-center gap-1.5">
                <ArrowRight class="w-3.5 h-3.5 text-[#2E7D32]" />
                Tofu artisanal frais &amp; fumé
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/produits?cat=derives" class="text-gray-300 hover:text-[#D4A017] transition-colors flex items-center gap-1.5">
                <ArrowRight class="w-3.5 h-3.5 text-[#2E7D32]" />
                Huile pure de première pression
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- COLONNE 3: LIENS RAPIDES -->
        <div>
          <h4 class="font-heading font-semibold text-base text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            Navigation
          </h4>
          <ul class="space-y-2.5 text-sm">
            <li>
              <RouterLink to="/a-propos" class="text-gray-300 hover:text-[#D4A017] transition-colors">
                Notre Histoire &amp; Engagements
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/blog" class="text-gray-300 hover:text-[#D4A017] transition-colors">
                Conseils Nutrition &amp; Recettes
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/contact" class="text-gray-300 hover:text-[#D4A017] transition-colors">
                Partenariats ONG &amp; Écoles
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/contact" class="text-gray-300 hover:text-[#D4A017] transition-colors">
                Devenir Revendeur Agréé
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/admin" class="text-amber-400/90 hover:text-amber-300 transition-colors flex items-center gap-1.5 pt-1">
                <Shield class="w-4 h-4" />
                Espace d'administration
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- COLONNE 4: CONTACT & COORDONNÉES -->
        <div>
          <h4 class="font-heading font-semibold text-base text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            Siège &amp; Ateliers
          </h4>
          <ul class="space-y-3 text-sm text-gray-300">
            <li class="flex items-start gap-2.5">
              <MapPin class="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
              <span>Zone Industrielle, Avenue des Usines, Bujumbura, Burundi</span>
            </li>
            <li class="flex items-center gap-2.5">
              <Phone class="w-4 h-4 text-[#D4A017] shrink-0" />
              <span>+257 22 25 78 90 / +257 79 98 00 00</span>
            </li>
            <li class="flex items-center gap-2.5">
              <Mail class="w-4 h-4 text-[#D4A017] shrink-0" />
              <span>contact@nutrisoja.bi</span>
            </li>
            <li class="flex items-center gap-2.5">
              <Clock class="w-4 h-4 text-[#D4A017] shrink-0" />
              <span>Lun - Ven : 07h30 - 17h00 | Sam : 08h00 - 13h00</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- BOTTOM BAR -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <p>© {{ currentYear }} NUTRI SOJA Burundi .Tous droits réservés</p>
        <div class="flex items-center gap-6">
          <RouterLink to="/contact" class="hover:text-white transition-colors">
            Mentions Légales &amp; Qualité
          </RouterLink>
          <RouterLink to="/admin" class="hover:text-[#D4A017] transition-colors flex items-center gap-1">
            <Shield class="w-3.5 h-3.5" />
            Accès Back-office
          </RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>
