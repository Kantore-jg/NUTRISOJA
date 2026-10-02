<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Package,
  FileText,
  Megaphone,
  Inbox,
  Database,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Leaf,
  Shield,
} from 'lucide-vue-next'
import { useAuthStore } from '@/src/stores/auth'
import { useToastStore } from '@/src/stores/toast'
import { messageService } from '@/src/services/messageService'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()
const route = useRoute()

const mobileMenuOpen = ref(false)
const unreadCount = ref(0)
let interval = null

const fetchUnread = async () => {
  const messages = await messageService.getAll()
  unreadCount.value = messages.filter((m) => !m.isRead).length
}

onMounted(() => {
  fetchUnread()
  interval = setInterval(fetchUnread, 10000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

const handleLogout = async () => {
  await auth.logout()
  toast.success('Déconnexion réussie.')
  router.push('/admin/login')
}

const navItems = [
  { label: 'Tableau de bord', path: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Produits', path: '/admin/produits', icon: Package },
  { label: 'Articles de blog', path: '/admin/articles', icon: FileText },
  { label: 'Publicités & Bannières', path: '/admin/publicites', icon: Megaphone },
  { label: 'Messages de contact', path: '/admin/messages', icon: Inbox },
  { label: 'Configuration Supabase', path: '/admin/supabase', icon: Database },
]

const isActive = (item) => {
  if (item.exact) return route.path === item.path
  return route.path.startsWith(item.path)
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans">
    <!-- MOBILE HEADER -->
    <header class="md:hidden bg-[#1C1C1C] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-[#2E7D32] flex items-center justify-center text-white">
          <Leaf class="w-4 h-4 text-[#D4A017]" />
        </div>
        <span class="font-heading font-bold text-base text-white">
          NUTRI <span class="text-[#D4A017]">ADMIN</span>
        </span>
      </div>
      <button
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="p-2 text-gray-300 hover:text-white"
        aria-label="Menu administration"
      >
        <X v-if="mobileMenuOpen" class="w-6 h-6" />
        <Menu v-else class="w-6 h-6" />
      </button>
    </header>

    <!-- SIDEBAR NAVIGATION -->
    <aside
      class="fixed inset-y-0 left-0 z-40 w-64 bg-[#1C1C1C] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen"
      :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div>
        <!-- LOGO -->
        <div class="p-6 border-b border-white/10 flex items-center justify-between">
          <RouterLink to="/admin" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white shadow-sm">
              <Leaf class="w-5 h-5 text-[#D4A017]" />
            </div>
            <div>
              <span class="font-heading font-extrabold text-lg text-white block">
                NUTRI <span class="text-[#D4A017]">SOJA</span>
              </span>
              <span class="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                Back-Office
              </span>
            </div>
          </RouterLink>
          <button
            @click="mobileMenuOpen = false"
            class="md:hidden text-gray-400 hover:text-white p-1"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- NAV LINKS -->
        <nav class="p-4 space-y-1.5">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            @click="mobileMenuOpen = false"
            class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            :class="isActive(item)
              ? 'bg-[#2E7D32] text-white shadow-xs font-semibold'
              : 'text-gray-300 hover:bg-white/5 hover:text-white'"
          >
            <div class="flex items-center gap-3">
              <component :is="item.icon" class="w-4 h-4 text-[#D4A017]" />
              <span>{{ item.label }}</span>
            </div>
            <span
              v-if="item.label === 'Messages de contact' && unreadCount > 0"
              class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white animate-pulse"
            >
              {{ unreadCount }}
            </span>
          </RouterLink>
        </nav>
      </div>

      <!-- USER PROFILE & LOGOUT -->
      <div class="p-4 border-t border-white/10 space-y-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-amber-300 bg-white/5 hover:bg-white/10 transition-colors"
        >
          <span class="flex items-center gap-2">
            <ExternalLink class="w-3.5 h-3.5" />
            Voir le site public
          </span>
          <span class="text-[10px] text-gray-400">Nouvel onglet</span>
        </a>

        <div class="p-3 rounded-xl bg-white/5 flex items-center justify-between">
          <div class="flex items-center gap-2.5 overflow-hidden">
            <div class="w-8 h-8 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-xs shrink-0">
              <Shield class="w-4 h-4 text-[#D4A017]" />
            </div>
            <div class="truncate text-left">
              <p class="text-xs font-bold text-white truncate">{{ auth.user?.name || 'Administrateur' }}</p>
              <p class="text-[10px] text-gray-400 truncate">{{ auth.user?.email }}</p>
            </div>
          </div>

          <button
            @click="handleLogout"
            class="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Se déconnecter"
            aria-label="Se déconnecter"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- BACKDROP FOR MOBILE -->
    <div
      v-if="mobileMenuOpen"
      @click="mobileMenuOpen = false"
      class="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs md:hidden"
    />

    <!-- MAIN CONTENT AREA -->
    <main class="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <RouterView />
    </main>
  </div>
</template>
