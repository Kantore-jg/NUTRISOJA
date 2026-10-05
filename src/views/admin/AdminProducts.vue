<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Sparkles,
} from 'lucide-vue-next'
import { productService } from '@/src/services/productService'
import { useToastStore } from '@/src/stores/toast'
import ConfirmModal from '@/src/components/common/ConfirmModal.vue'
import ImageUpload from '@/src/components/common/ImageUpload.vue'
import TableSkeleton from '@/src/components/common/TableSkeleton.vue'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const products = ref([])
const loading = ref(true)
const search = ref('')
const filterCategory = ref('all')

const modalOpen = ref(false)
const editingProduct = ref(null)
const deleteId = ref(null)

const formData = ref({
  name: '',
  slug: '',
  category: 'boissons',
  shortDescription: '',
  fullDescription: '',
  price: 2000,
  packageSize: 'Bouteille 500ml',
  images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80'],
  composition: 'Graines de soja burundaises, eau pure',
  calories: 50,
  proteins: 3.5,
  lipids: 2.0,
  carbohydrates: 4.0,
  calcium: 120,
  iron: 1.5,
  usageTips: 'Consommer bien frais.',
  available: true,
  isFeatured: false,
})

const loadProducts = async () => {
  loading.value = true
  try {
    const data = await productService.getAll()
    products.value = data
  } catch {
    toast.error('Erreur de chargement des produits')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  document.title = 'Gestion des Produits | Admin NUTRI SOJA Burundi'
  loadProducts()

  if (route.query.new === 'true') {
    handleOpenCreate()
    router.replace({ query: {} })
  }
})

const handleOpenCreate = () => {
  editingProduct.value = null
  formData.value = {
    name: '',
    slug: '',
    category: 'boissons',
    shortDescription: '',
    fullDescription: '',
    price: 2500,
    packageSize: 'Bouteille 500ml',
    images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80'],
    composition: 'Graines de soja sélectionnées du Burundi, eau filtrée',
    calories: 55,
    proteins: 4.0,
    lipids: 2.2,
    carbohydrates: 4.5,
    calcium: 120,
    iron: 1.4,
    usageTips: 'À conserver au frais.',
    available: true,
    isFeatured: false,
  }
  modalOpen.value = true
}

const handleOpenEdit = (prod) => {
  editingProduct.value = prod
  formData.value = {
    name: prod.name,
    slug: prod.slug,
    category: prod.category,
    shortDescription: prod.shortDescription,
    fullDescription: prod.fullDescription,
    price: prod.price,
    packageSize: prod.packageSize,
    images: prod.images.length > 0 ? prod.images : [''],
    composition: prod.composition.join(', '),
    calories: prod.nutritionalValues.calories || 0,
    proteins: prod.nutritionalValues.proteins || 0,
    lipids: prod.nutritionalValues.lipids || 0,
    carbohydrates: prod.nutritionalValues.carbohydrates || 0,
    calcium: prod.nutritionalValues.calcium || 0,
    iron: prod.nutritionalValues.iron || 0,
    usageTips: prod.usageTips.join(' | '),
    available: prod.available,
    isFeatured: !!prod.isFeatured,
  }
  modalOpen.value = true
}

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const handleNameChange = (val) => {
  formData.value.name = val
  if (!formData.value.slug || !editingProduct.value) {
    formData.value.slug = generateSlug(val)
  }
}

const handleSubmit = async () => {
  if (!formData.value.name.trim()) {
    toast.error('Le nom du produit est obligatoire.')
    return
  }

  const payload = {
    name: formData.value.name.trim(),
    slug: formData.value.slug.trim() || generateSlug(formData.value.name),
    category: formData.value.category,
    shortDescription: formData.value.shortDescription.trim(),
    fullDescription: formData.value.fullDescription.trim() || formData.value.shortDescription.trim(),
    price: Number(formData.value.price) || 0,
    packageSize: formData.value.packageSize.trim(),
    images: formData.value.images.filter((img) => img.trim().length > 0),
    composition: formData.value.composition
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    nutritionalValues: {
      calories: Number(formData.value.calories) || 0,
      proteins: Number(formData.value.proteins) || 0,
      lipids: Number(formData.value.lipids) || 0,
      carbohydrates: Number(formData.value.carbohydrates) || 0,
      calcium: Number(formData.value.calcium) || 0,
      iron: Number(formData.value.iron) || 0,
    },
    usageTips: formData.value.usageTips
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean),
    available: formData.value.available,
    isFeatured: formData.value.isFeatured,
  }

  try {
    if (editingProduct.value) {
      await productService.update(editingProduct.value.id, payload)
      toast.success(`Produit "${payload.name}" mis à jour avec succès.`)
    } else {
      await productService.create(payload)
      toast.success(`Produit "${payload.name}" ajouté avec succès.`)
    }
    modalOpen.value = false
    loadProducts()
  } catch {
    toast.error("Une erreur s'est produite lors de l'enregistrement.")
  }
}

const handleToggleAvailability = async (prod) => {
  try {
    await productService.update(prod.id, { available: !prod.available })
    toast.success(`Disponibilité modifiée : ${!prod.available ? 'En stock' : 'Rupture'}`)
    loadProducts()
  } catch {
    toast.error('Impossible de modifier le statut.')
  }
}

const confirmDelete = async () => {
  if (!deleteId.value) return
  try {
    await productService.delete(deleteId.value)
    toast.success('Produit supprimé avec succès.')
    deleteId.value = null
    loadProducts()
  } catch {
    toast.error('Erreur lors de la suppression.')
  }
}

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    if (filterCategory.value !== 'all' && p.category !== filterCategory.value) return false
    if (search.value.trim()) {
      const q = search.value.toLowerCase()
      return p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)
    }
    return true
  })
})

const onImageChange = (url) => {
  formData.value.images = [url]
}
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
          Gestion des Produits
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Ajoutez, modifiez les prix et gérez la disponibilité de la gamme de soja.
        </p>
      </div>

      <button
        @click="handleOpenCreate"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-semibold shadow-sm transition-all"
      >
        <Plus class="w-4 h-4" />
        <span>Nouveau produit</span>
      </button>
    </div>

    <!-- FILTER BAR -->
    <div class="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <button
          v-for="cat in ['all', 'boissons', 'farines', 'derives']"
          :key="cat"
          @click="filterCategory = cat"
          class="px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all"
          :class="filterCategory === cat
            ? 'bg-[#2E7D32] text-white shadow-xs'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          {{ cat === 'all' ? 'Tous les produits' : cat }}
        </button>
      </div>

      <div class="relative w-full sm:w-64">
        <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          v-model="search"
          placeholder="Rechercher par nom..."
          class="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
        />
      </div>
    </div>

    <!-- PRODUCTS TABLE -->
    <TableSkeleton v-if="loading" :rows="5" />

    <div v-else class="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <th class="p-4">Produit</th>
              <th class="p-4">Catégorie</th>
              <th class="p-4">Conditionnement</th>
              <th class="p-4">Prix (BIF)</th>
              <th class="p-4">Statut Stock</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-if="filteredProducts.length === 0">
              <td colspan="6" class="p-8 text-center text-gray-500 text-sm">
                Aucun produit trouvé.
              </td>
            </tr>

            <tr
              v-for="prod in filteredProducts"
              :key="prod.id"
              class="hover:bg-gray-50/70 transition-colors"
            >
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="prod.images[0] || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=150&q=80'"
                    :alt="prod.name"
                    class="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                    referrerpolicy="no-referrer"
                  />
                  <div>
                    <div class="font-heading font-bold text-gray-900 flex items-center gap-1.5">
                      <span>{{ prod.name }}</span>
                      <span v-if="prod.isFeatured" class="p-0.5 rounded text-amber-500" title="Mis en avant">
                        <Sparkles class="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 line-clamp-1 max-w-xs">{{ prod.shortDescription }}</p>
                  </div>
                </div>
              </td>

              <td class="p-4">
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold capitalize bg-gray-100 text-gray-700">
                  {{ prod.category }}
                </span>
              </td>

              <td class="p-4 text-xs font-medium text-gray-600">
                {{ prod.packageSize }}
              </td>

              <td class="p-4">
                <span class="font-heading font-bold text-[#2E7D32]">
                  {{ prod.price.toLocaleString('fr-FR') }} BIF
                </span>
              </td>

              <td class="p-4">
                <button
                  @click="handleToggleAvailability(prod)"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors"
                  :class="prod.available
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'"
                  title="Cliquer pour basculer la disponibilité"
                >
                  <template v-if="prod.available">
                    <CheckCircle2 class="w-3.5 h-3.5" />
                    <span>En stock</span>
                  </template>
                  <template v-else>
                    <XCircle class="w-3.5 h-3.5" />
                    <span>Rupture</span>
                  </template>
                </button>
              </td>

              <td class="p-4 text-right space-x-1">
                <button
                  @click="handleOpenEdit(prod)"
                  class="p-2 rounded-lg text-gray-600 hover:text-[#2E7D32] hover:bg-gray-100"
                  title="Modifier"
                >
                  <Edit2 class="w-4 h-4" />
                </button>
                <button
                  @click="deleteId = prod.id"
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

    <!-- CREATE / EDIT PRODUCT MODAL -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div class="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto my-6">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center">
              <Package class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-heading font-bold text-lg text-gray-900">
                {{ editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit' }}
              </h3>
              <p class="text-xs text-gray-500">Remplissez les informations techniques et nutritionnelles</p>
            </div>
          </div>
          <button
            @click="modalOpen = false"
            class="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <form class="space-y-5" @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Nom du produit *
              </label>
              <input
                type="text"
                required
                :value="formData.name"
                @input="handleNameChange($event.target.value)"
                placeholder="Ex: Lait de Soja Frais"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Catégorie *
              </label>
              <select
                v-model="formData.category"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32] bg-white"
              >
                <option value="boissons">Boissons Végétales</option>
                <option value="farines">Farines Fortifiées</option>
                <option value="derives">Dérivés (Tofu & Huile)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Prix de vente en BIF
              </label>
              <input
                type="number"
                required
                min="100"
                step="100"
                v-model.number="formData.price"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Conditionnement / Format *
              </label>
              <input
                type="text"
                required
                v-model="formData.packageSize"
                placeholder="Ex: Bouteille 500 ml, Sachet 1 kg"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>
          </div>

          <!-- IMAGE UPLOAD WITH PREVIEW -->
          <div>
            <ImageUpload
              label="Photo principale du produit"
              :model-value="formData.images[0] || ''"
              @update:model-value="onImageChange"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Description courte (pour carte produit) *
            </label>
            <input
              type="text"
              required
              v-model="formData.shortDescription"
              placeholder="Ex: Boisson végétale onctueuse 100% naturelle..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Description complète & conseils
            </label>
            <textarea
              rows="3"
              v-model="formData.fullDescription"
              placeholder="Détails du procédé de transformation, origine des graines..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Ingrédients (séparés par des virgules)
              </label>
              <input
                type="text"
                v-model="formData.composition"
                placeholder="Graines de soja non OGM, eau, sel..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Conseils culinaires (séparés par le symbole | )
              </label>
              <input
                type="text"
                v-model="formData.usageTips"
                placeholder="Servir frais | Idéal en smoothies | Agiter avant emploi"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>
          </div>

          <!-- NUTRITION NUMBERS -->
          <div class="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <h4 class="font-heading font-bold text-xs uppercase tracking-wider text-gray-700">
              Valeurs nutritionnelles pour 100g / 100ml
            </h4>
            <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
              <div>
                <label class="block text-[11px] text-gray-500">Énergie (kcal)</label>
                <input
                  type="number"
                  v-model.number="formData.calories"
                  class="w-full p-2 rounded-lg border border-gray-300 text-xs text-center"
                />
              </div>
              <div>
                <label class="block text-[11px] text-gray-500">Protéines (g)</label>
                <input
                  type="number"
                  step="0.1"
                  v-model.number="formData.proteins"
                  class="w-full p-2 rounded-lg border border-gray-300 text-xs text-center"
                />
              </div>
              <div>
                <label class="block text-[11px] text-gray-500">Lipides (g)</label>
                <input
                  type="number"
                  step="0.1"
                  v-model.number="formData.lipids"
                  class="w-full p-2 rounded-lg border border-gray-300 text-xs text-center"
                />
              </div>
              <div>
                <label class="block text-[11px] text-gray-500">Glucides (g)</label>
                <input
                  type="number"
                  step="0.1"
                  v-model.number="formData.carbohydrates"
                  class="w-full p-2 rounded-lg border border-gray-300 text-xs text-center"
                />
              </div>
              <div>
                <label class="block text-[11px] text-gray-500">Calcium (mg)</label>
                <input
                  type="number"
                  v-model.number="formData.calcium"
                  class="w-full p-2 rounded-lg border border-gray-300 text-xs text-center"
                />
              </div>
              <div>
                <label class="block text-[11px] text-gray-500">Fer (mg)</label>
                <input
                  type="number"
                  step="0.1"
                  v-model.number="formData.iron"
                  class="w-full p-2 rounded-lg border border-gray-300 text-xs text-center"
                />
              </div>
            </div>
          </div>

          <!-- TOGGLES -->
          <div class="flex flex-wrap items-center gap-6 pt-2">
            <label class="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                v-model="formData.available"
                class="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32]"
              />
              <span>En stock (disponible à la commande)</span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                v-model="formData.isFeatured"
                class="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32]"
              />
              <span>Mettre en avant sur la page d'accueil</span>
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
              {{ editingProduct ? 'Mettre à jour le produit' : 'Enregistrer le produit' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- CONFIRM DELETE MODAL -->
    <ConfirmModal
      :is-open="!!deleteId"
      title="Supprimer ce produit ?"
      message="Êtes-vous certain de vouloir supprimer ce produit du catalogue ? Cette action est irréversible."
      confirm-label="Oui, supprimer définitivement"
      @confirm="confirmDelete"
      @cancel="deleteId = null"
    />
  </div>
</template>
