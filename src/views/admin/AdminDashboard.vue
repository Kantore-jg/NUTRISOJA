<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Package,
  FileText,
  Megaphone,
  Inbox,
  Plus,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-vue-next'
import { productService } from '@/src/services/productService'
import { blogService } from '@/src/services/blogService'
import { adService } from '@/src/services/adService'
import { messageService } from '@/src/services/messageService'
import { storageService } from '@/src/services/storageService'
import { useToastStore } from '@/src/stores/toast'
import ConfirmModal from '@/src/components/common/ConfirmModal.vue'

const toast = useToastStore()

const stats = ref({
  productsCount: 0,
  availableProductsCount: 0,
  articlesCount: 0,
  publishedArticlesCount: 0,
  adsCount: 0,
  activeAdsCount: 0,
  unreadMessagesCount: 0,
  totalMessagesCount: 0,
})

const recentMessages = ref([])
const loading = ref(true)
const resetModalOpen = ref(false)

const fetchDashboardData = async () => {
  loading.value = true
  try {
    const [products, articles, ads, messages] = await Promise.all([
      productService.getAll(),
      blogService.getAll('all'),
      adService.getAll(),
      messageService.getAll(),
    ])

    stats.value = {
      productsCount: products.length,
      availableProductsCount: products.filter((p) => p.available).length,
      articlesCount: articles.length,
      publishedArticlesCount: articles.filter((a) => a.status === 'published').length,
      adsCount: ads.length,
      activeAdsCount: ads.filter((a) => a.isActive).length,
      unreadMessagesCount: messages.filter((m) => !m.isRead).length,
      totalMessagesCount: messages.length,
    }

    recentMessages.value = messages.slice(0, 5)
  } catch (err) {
    console.error(err)
    toast.error('Impossible de charger les statistiques.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  document.title = 'Tableau de bord | Admin NUTRI SOJA Burundi'
  fetchDashboardData()
})

const handleMarkAsRead = async (id) => {
  try {
    await messageService.markAsRead(id, true)
    toast.success('Message marqué comme lu.')
    fetchDashboardData()
  } catch {
    toast.error('Erreur de mise à jour.')
  }
}

const handleResetDemoData = async () => {
  try {
    await storageService.resetAllToDefaults()
    toast.success('Données de démonstration réinitialisées avec succès !')
    resetModalOpen.value = false
    fetchDashboardData()
  } catch {
    toast.error('Erreur lors de la réinitialisation.')
  }
}

const statCards = [
  {
    title: 'Produits au Catalogue',
    valueKey: 'productsCount',
    subKey: 'availableProductsCount',
    subLabel: 'en stock disponible',
    icon: Package,
    color: 'bg-emerald-500',
    link: '/admin/produits',
    cta: 'Gérer les produits',
  },
  {
    title: 'Articles du Blog',
    valueKey: 'articlesCount',
    subKey: 'publishedArticlesCount',
    subLabel: 'articles publiés en ligne',
    icon: FileText,
    color: 'bg-blue-500',
    link: '/admin/articles',
    cta: 'Gérer les articles',
  },
  {
    title: 'Campagnes & Publicités',
    valueKey: 'adsCount',
    subKey: 'activeAdsCount',
    subLabel: 'actives sur le carrousel',
    icon: Megaphone,
    color: 'bg-amber-500',
    link: '/admin/publicites',
    cta: 'Gérer le carrousel',
  },
  {
    title: 'Messages de Contact',
    valueKey: 'unreadMessagesCount',
    subKey: 'totalMessagesCount',
    subLabel: 'messages au total',
    icon: Inbox,
    dynamicColor: true,
    link: '/admin/messages',
    cta: 'Ouvrir la boîte',
  },
]
</script>

<template>
  <div class="space-y-8 max-w-7xl mx-auto">
    <!-- TOP HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
          Tableau de Bord
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Supervisez le contenu du site vitrine et le traitement des commandes de NUTRI SOJA Burundi.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="resetModalOpen = true"
          class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
          title="Réinitialiser les données aux valeurs initiales"
        >
          <RotateCcw class="w-3.5 h-3.5 text-[#2E7D32]" />
          <span>Réinitialiser la Démo</span>
        </button>
      </div>
    </div>

    <!-- STAT CARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div
        v-for="(card, idx) in statCards"
        :key="idx"
        class="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex flex-col justify-between hover:border-gray-200 transition-all"
      >
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-500">
              {{ card.title }}
            </span>
            <div
              class="w-9 h-9 rounded-xl text-white flex items-center justify-center shadow-xs"
              :class="card.dynamicColor
                ? (stats.unreadMessagesCount > 0 ? 'bg-red-500' : 'bg-gray-500')
                : card.color"
            >
              <component :is="card.icon" class="w-4 h-4" />
            </div>
          </div>

          <div class="font-heading font-black text-3xl text-gray-900 mb-1">
            {{ loading ? '...' : stats[card.valueKey] }}
          </div>

          <p class="text-xs text-gray-500">{{ stats[card.subKey] }} {{ card.subLabel }}</p>
        </div>

        <div class="pt-4 mt-4 border-t border-gray-100">
          <RouterLink
            :to="card.link"
            class="text-xs font-bold text-[#2E7D32] hover:text-[#1B5E20] flex items-center justify-between"
          >
            <span>{{ card.cta }}</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- QUICK ACTIONS -->
    <div class="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 space-y-4">
      <h2 class="font-heading font-bold text-base text-gray-900">Actions rapides</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <RouterLink
          to="/admin/produits?new=true"
          class="flex items-center gap-3 p-3.5 rounded-xl bg-[#2E7D32]/5 hover:bg-[#2E7D32]/10 border border-[#2E7D32]/20 transition-all group"
        >
          <div class="w-8 h-8 rounded-lg bg-[#2E7D32] text-white flex items-center justify-center">
            <Plus class="w-4 h-4" />
          </div>
          <div>
            <p class="text-xs font-bold text-gray-900 group-hover:text-[#2E7D32]">Ajouter un produit</p>
            <p class="text-[11px] text-gray-500">Boisson, farine ou dérivé</p>
          </div>
        </RouterLink>

        <RouterLink
          to="/admin/articles?new=true"
          class="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50/50 hover:bg-blue-50 border border-blue-200/60 transition-all group"
        >
          <div class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <Plus class="w-4 h-4" />
          </div>
          <div>
            <p class="text-xs font-bold text-gray-900 group-hover:text-blue-600">Rédiger un article</p>
            <p class="text-[11px] text-gray-500">Nutrition, recettes, communauté</p>
          </div>
        </RouterLink>

        <RouterLink
          to="/admin/publicites?new=true"
          class="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50/50 hover:bg-amber-50 border border-amber-200/60 transition-all group"
        >
          <div class="w-8 h-8 rounded-lg bg-[#D4A017] text-white flex items-center justify-center">
            <Plus class="w-4 h-4" />
          </div>
          <div>
            <p class="text-xs font-bold text-gray-900 group-hover:text-[#D4A017]">Créer une publicité</p>
            <p class="text-[11px] text-gray-500">Bannière pour carrousel d'accueil</p>
          </div>
        </RouterLink>
      </div>
    </div>

    <!-- RECENT MESSAGES TABLE -->
    <div class="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 class="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
            <Inbox class="w-4 h-4 text-[#2E7D32]" />
            Derniers messages du formulaire de contact
          </h3>
          <p class="text-xs text-gray-500 mt-0.5">
            Demandes de devis ONG, commandes ou demandes de distribution au Burundi
          </p>
        </div>
        <RouterLink
          to="/admin/messages"
          class="text-xs font-bold text-[#2E7D32] hover:text-[#1B5E20] flex items-center gap-1"
        >
          <span>Voir tous les messages ({{ stats.totalMessagesCount }})</span>
          <ExternalLink class="w-3.5 h-3.5" />
        </RouterLink>
      </div>

      <div v-if="recentMessages.length === 0" class="p-8 text-center text-sm text-gray-500">
        Aucun message reçu pour le moment.
      </div>

      <div v-else class="divide-y divide-gray-100">
        <div
          v-for="msg in recentMessages"
          :key="msg.id"
          class="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
          :class="!msg.isRead ? 'bg-amber-50/40' : 'hover:bg-gray-50'"
        >
          <div class="space-y-1 max-w-2xl">
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-gray-900">{{ msg.name }}</span>
              <span class="text-xs text-gray-500">({{ msg.email }})</span>
              <span
                v-if="!msg.isRead"
                class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700"
              >
                Nouveau
              </span>
            </div>
            <p class="text-xs font-semibold text-gray-800">{{ msg.subject }}</p>
            <p class="text-xs text-gray-600 line-clamp-1">{{ msg.message }}</p>
            <div class="flex items-center gap-2 text-[11px] text-gray-400">
              <Clock class="w-3 h-3" />
              <span>
                {{ new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                }) }}
              </span>
              <span v-if="msg.phone">• Tél : {{ msg.phone }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              v-if="!msg.isRead"
              @click="handleMarkAsRead(msg.id)"
              class="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1"
            >
              <CheckCircle2 class="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Marquer lu</span>
            </button>
            <RouterLink
              to="/admin/messages"
              class="px-3 py-1.5 rounded-lg bg-[#2E7D32] text-white text-xs font-semibold hover:bg-[#1B5E20]"
            >
              Répondre
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- CONFIRM RESET MODAL -->
    <ConfirmModal
      :is-open="resetModalOpen"
      title="Réinitialiser les données de démonstration ?"
      message="Cette action va réinitialiser tous les produits, articles, publicités et messages aux données d'origine pré-enregistrées. Êtes-vous sûr de vouloir continuer ?"
      confirm-label="Oui, réinitialiser"
      cancel-label="Annuler"
      :is-destructive="false"
      @confirm="handleResetDemoData"
      @cancel="resetModalOpen = false"
    />
  </div>
</template>
