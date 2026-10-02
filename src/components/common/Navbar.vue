<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Menu, X, MessageSquare, Shield } from 'lucide-vue-next'
import { useAuthStore } from '@/src/stores/auth'

const auth = useAuthStore()
const isOpen = ref(false)

const navLinks = [
  { label: 'Accueil', path: '/' },
  { label: 'Nos Produits', path: '/produits' },
  { label: 'Actualités & Santé', path: '/blog' },
  { label: 'À Propos', path: '/a-propos' },
  { label: 'Contact', path: '/contact' },
]

const route = useRoute()

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-[#F5F1E8]/95 backdrop-blur-md border-b border-[#2E7D32]/10 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- LOGO -->
        <RouterLink
          to="/"
          class="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#2E7D32] rounded-xl"
        >
          <img
            src="/assets/logo.png"
            alt="NUTRI SOJA Burundi — La saveur naturelle"
            class="h-14 w-14 sm:h-16 sm:w-16 rounded-xl object-cover shadow-md ring-1 ring-[#2E7D32]/15 group-hover:ring-[#2E7D32]/40 transition-all"
          />
          <div class="flex flex-col">
            <span class="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-[#1C1C1C] group-hover:text-[#2E7D32] transition-colors">
              NUTRI SOJA BURUNDI
            </span>
            <span class="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-[#5A5A5A]">
              La saveur naturelle
            </span>
          </div>
        </RouterLink>

        <!-- DESKTOP NAVIGATION -->
        <nav class="hidden md:flex items-center gap-1 lg:gap-2">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :class="[
              'px-3.5 py-2 rounded-lg text-sm font-medium transition-all',
              isActive(link.path)
                ? 'text-[#2E7D32] bg-[#2E7D32]/10 font-semibold'
                : 'text-[#1C1C1C] hover:text-[#2E7D32] hover:bg-[#2E7D32]/5'
            ]"
          >
            {{ link.label }}
          </RouterLink>
        </nav>

        <!-- ACTIONS -->
        <div class="hidden md:flex items-center gap-3">
          <a
            href="https://wa.me/25779000000?text=Bonjour%20NUTRI%20SOJA,%20je%20souhaite%20commander%20vos%20produits"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-sm font-semibold hover:bg-[#1B5E20] shadow-sm hover:shadow transition-all"
          >
            <MessageSquare class="w-4 h-4 text-[#D4A017]" />
            <span>Commander</span>
          </a>

          <RouterLink
            to="/admin"
            :class="[
              'p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors',
              auth.isAuthenticated
                ? 'bg-amber-100/70 border-amber-300 text-amber-900 hover:bg-amber-200'
                : 'bg-white/80 border-gray-200 text-gray-600 hover:text-[#2E7D32] hover:border-[#2E7D32]/40'
            ]"
            :title="auth.isAuthenticated ? 'Espace Admin connecté' : 'Accès Espace Admin'"
          >
            <Shield class="w-4 h-4 text-[#2E7D32]" />
            <span class="hidden lg:inline">{{ auth.isAuthenticated ? 'Admin (Actif)' : 'Admin' }}</span>
          </RouterLink>
        </div>

        <!-- MOBILE MENU TOGGLE -->
        <div class="flex md:hidden items-center gap-2">
          <RouterLink
            to="/admin"
            class="p-2 rounded-lg text-gray-600 hover:text-[#2E7D32]"
            aria-label="Accéder au back-office"
          >
            <Shield class="w-5 h-5 text-[#2E7D32]" />
          </RouterLink>
          <button
            @click="isOpen = !isOpen"
            class="p-2 rounded-lg text-[#1C1C1C] hover:bg-[#2E7D32]/10 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            aria-label="Menu principal"
            :aria-expanded="isOpen"
          >
            <X v-if="isOpen" class="w-6 h-6" />
            <Menu v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- MOBILE DROPDOWN -->
    <div v-if="isOpen" class="md:hidden border-b border-[#2E7D32]/15 bg-[#F5F1E8] px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
      <RouterLink
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        @click="isOpen = false"
        :class="[
          'block px-4 py-2.5 rounded-lg text-base font-medium transition-colors',
          isActive(link.path)
            ? 'bg-[#2E7D32] text-white font-semibold'
            : 'text-[#1C1C1C] hover:bg-[#2E7D32]/10'
        ]"
      >
        {{ link.label }}
      </RouterLink>
      <div class="pt-3 border-t border-[#2E7D32]/15 flex flex-col gap-2">
        <a
          href="https://wa.me/25779000000?text=Bonjour%20NUTRI%20SOJA,%20je%20souhaite%20commander%20vos%20produits"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#2E7D32] text-white font-semibold shadow-sm"
        >
          <MessageSquare class="w-5 h-5 text-[#D4A017]" />
          <span>Commander via WhatsApp</span>
        </a>
        <RouterLink
          to="/admin"
          @click="isOpen = false"
          class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700"
        >
          <Shield class="w-4 h-4 text-[#2E7D32]" />
          <span>Espace d'administration</span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>
