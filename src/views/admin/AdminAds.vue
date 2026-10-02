<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Calendar,
} from 'lucide-vue-next'
import { adService } from '@/src/services/adService'
import { useToastStore } from '@/src/stores/toast'
import ConfirmModal from '@/src/components/common/ConfirmModal.vue'
import ImageUpload from '@/src/components/common/ImageUpload.vue'
import TableSkeleton from '@/src/components/common/TableSkeleton.vue'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const ads = ref([])
const loading = ref(true)

const modalOpen = ref(false)
const editingAd = ref(null)
const deleteId = ref(null)

const formData = ref({
  title: '',
  subtitle: '',
  image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  linkUrl: '/produits',
  ctaText: 'Découvrir la gamme',
  displayOrder: 1,
  isActive: true,
  startDate: '',
  endDate: '',
})

const loadAds = async () => {
  loading.value = true
  try {
    const data = await adService.getAll()
    ads.value = data
  } catch {
    toast.error('Erreur lors du chargement des publicités.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  document.title = 'Gestion des Publicités & Carrousel | Admin NUTRI SOJA Burundi'
  loadAds()

  if (route.query.new === 'true') {
    handleOpenCreate()
    router.replace({ query: {} })
  }
})

const handleOpenCreate = () => {
  editingAd.value = null
  formData.value = {
    title: '',
    subtitle: '',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    linkUrl: '/produits',
    ctaText: 'Découvrir la gamme',
    displayOrder: ads.value.length + 1,
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  }
  modalOpen.value = true
}

const handleOpenEdit = (ad) => {
  editingAd.value = ad
  formData.value = {
    title: ad.title,
    subtitle: ad.subtitle || '',
    image: ad.image,
    linkUrl: ad.linkUrl || '/produits',
    ctaText: ad.ctaText || 'Découvrir',
    displayOrder: ad.displayOrder,
    isActive: ad.isActive,
    startDate: ad.startDate ? ad.startDate.split('T')[0] : '',
    endDate: ad.endDate ? ad.endDate.split('T')[0] : '',
  }
  modalOpen.value = true
}

const handleSubmit = async () => {
  if (!formData.value.title.trim() || !formData.value.image.trim()) {
    toast.error("Le titre et l'image de la bannière sont requis.")
    return
  }

  const payload = {
    title: formData.value.title.trim(),
    subtitle: formData.value.subtitle.trim(),
    image: formData.value.image.trim(),
    linkUrl: formData.value.linkUrl.trim(),
    ctaText: formData.value.ctaText.trim() || 'En savoir plus',
    displayOrder: Number(formData.value.displayOrder) || 1,
    isActive: formData.value.isActive,
    startDate: formData.value.startDate || '',
    endDate: formData.value.endDate || '',
  }

  try {
    if (editingAd.value) {
      await adService.update(editingAd.value.id, payload)
      toast.success('Publicité mise à jour avec succès.')
    } else {
      await adService.create(payload)
      toast.success('Nouvelle bannière publicitaire créée.')
    }
    modalOpen.value = false
    loadAds()
  } catch {
    toast.error("Erreur lors de l'enregistrement.")
  }
}

const handleToggleActive = async (ad) => {
  try {
    await adService.update(ad.id, { isActive: !ad.isActive })
    toast.success(`Bannière ${!ad.isActive ? 'activée' : 'désactivée'}.`)
    loadAds()
  } catch {
    toast.error('Erreur lors du changement de statut.')
  }
}

const confirmDelete = async () => {
  if (!deleteId.value) return
  try {
    await adService.delete(deleteId.value)
    toast.success('Bannière supprimée.')
    deleteId.value = null
    loadAds()
  } catch {
    toast.error('Erreur de suppression.')
  }
}
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
          Bannières & Publicités Carrousel
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Gérez les promotions temporaires et offres spéciales affichées sur la page d'accueil (défilement automatique 5s).
        </p>
      </div>

      <button
        @click="handleOpenCreate"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-semibold shadow-sm transition-all"
      >
        <Plus class="w-4 h-4" />
        <span>Nouvelle bannière</span>
      </button>
    </div>

    <!-- ADS TABLE -->
    <TableSkeleton v-if="loading" :rows="3" />

    <div v-else class="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <th class="p-4">Ordre</th>
              <th class="p-4">Bannière & Visuel</th>
              <th class="p-4">Lien & Bouton CTA</th>
              <th class="p-4">Période de validité</th>
              <th class="p-4">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-if="ads.length === 0">
              <td colspan="6" class="p-8 text-center text-gray-500">
                Aucune bannière publicitaire enregistrée.
              </td>
            </tr>

            <tr
              v-for="ad in ads"
              :key="ad.id"
              class="hover:bg-gray-50/70 transition-colors"
            >
              <td class="p-4">
                <span class="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 font-bold flex items-center justify-center text-xs">
                  {{ ad.displayOrder }}
                </span>
              </td>

              <td class="p-4">
                <div class="flex items-center gap-4">
                  <img
                    :src="ad.image"
                    :alt="ad.title"
                    class="w-24 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                    referrerpolicy="no-referrer"
                  />
                  <div>
                    <p class="font-heading font-bold text-gray-900">{{ ad.title }}</p>
                    <p v-if="ad.subtitle" class="text-xs text-gray-500">{{ ad.subtitle }}</p>
                  </div>
                </div>
              </td>

              <td class="p-4">
                <div class="space-y-0.5">
                  <span class="text-xs font-semibold text-gray-800 block">
                    {{ ad.ctaText }}
                  </span>
                  <span class="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {{ ad.linkUrl || 'Aucun' }}
                  </span>
                </div>
              </td>

              <td class="p-4 text-xs text-gray-500">
                <template v-if="ad.startDate || ad.endDate">
                  <div class="flex items-center gap-1.5">
                    <Calendar class="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {{ ad.startDate ? new Date(ad.startDate).toLocaleDateString('fr-FR') : 'Début' }}
                      →
                      {{ ad.endDate ? new Date(ad.endDate).toLocaleDateString('fr-FR') : 'Indéfini' }}
                    </span>
                  </div>
                </template>
                <span v-else class="text-gray-400">Permanente</span>
              </td>

              <td class="p-4">
                <button
                  @click="handleToggleActive(ad)"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors"
                  :class="ad.isActive
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
                >
                  <template v-if="ad.isActive">
                    <CheckCircle2 class="w-3.5 h-3.5" />
                    <span>Actif</span>
                  </template>
                  <template v-else>
                    <XCircle class="w-3.5 h-3.5" />
                    <span>Inactif</span>
                  </template>
                </button>
              </td>

              <td class="p-4 text-right space-x-1">
                <button
                  @click="handleOpenEdit(ad)"
                  class="p-2 rounded-lg text-gray-600 hover:text-[#2E7D32] hover:bg-gray-100"
                  title="Modifier"
                >
                  <Edit2 class="w-4 h-4" />
                </button>
                <button
                  @click="deleteId = ad.id"
                  class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                  title="Supprimer"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CREATE / EDIT MODAL -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto my-6">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Megaphone class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-heading font-bold text-lg text-gray-900">
                {{ editingAd ? 'Modifier la publicité' : 'Créer une publicité' }}
              </h3>
              <p class="text-xs text-gray-500">Affichez vos promotions sur le carrousel d'accueil</p>
            </div>
          </div>
          <button
            @click="modalOpen = false"
            class="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Titre principal de la campagne *
            </label>
            <input
              type="text"
              required
              v-model="formData.title"
              placeholder="Ex: -15% sur la farine TotoFort ce mois-ci"
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Sous-titre / Détail de l'offre
            </label>
            <input
              type="text"
              v-model="formData.subtitle"
              placeholder="Ex: Disponible dans tous nos points de vente à Bujumbura et Gitega"
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <!-- IMAGE UPLOAD -->
          <div>
            <ImageUpload
              label="Image de fond de la bannière (recommandé 1200x500px)"
              v-model="formData.image"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Lien redirection
              </label>
              <input
                type="text"
                v-model="formData.linkUrl"
                placeholder="/produits ou /contact"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Texte du bouton CTA
              </label>
              <input
                type="text"
                v-model="formData.ctaText"
                placeholder="Découvrir la gamme"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Ordre d'affichage (1, 2, 3...)
              </label>
              <input
                type="number"
                min="1"
                v-model.number="formData.displayOrder"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Date de début (optionnel)
              </label>
              <input
                type="date"
                v-model="formData.startDate"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Date de fin (optionnel)
              </label>
              <input
                type="date"
                v-model="formData.endDate"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>
          </div>

          <div class="pt-2">
            <label class="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                v-model="formData.isActive"
                class="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32]"
              />
              <span>Activer immédiatement dans le carrousel d'accueil</span>
            </label>
          </div>

          <!-- MODAL ACTIONS -->
          <div class="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              @click="modalOpen = false"
              class="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-semibold shadow-md"
            >
              {{ editingAd ? 'Mettre à jour' : 'Créer la bannière' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- CONFIRM DELETE MODAL -->
    <ConfirmModal
      :is-open="!!deleteId"
      title="Supprimer cette publicité ?"
      message="Êtes-vous certain de vouloir supprimer cette bannière du carrousel ?"
      confirm-label="Oui, supprimer"
      @confirm="confirmDelete"
      @cancel="deleteId = null"
    />
  </div>
</template>
