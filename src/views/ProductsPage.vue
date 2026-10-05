<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, Filter, RefreshCw, Sparkles } from 'lucide-vue-next'
import { productService } from '@/src/services/productService'
import ProductCard from '@/src/components/products/ProductCard.vue'
import ProductCardSkeleton from '@/src/components/common/ProductCardSkeleton.vue'

const route = useRoute()
const router = useRouter()

const products = ref([])
const loading = ref(true)
const searchQuery = ref('')

const currentCategory = computed(() => route.query.cat || 'all')

onMounted(async () => {
  document.title = 'Nos Produits à Base de Soja | NUTRI SOJA Burundi'
  loading.value = true
  try {
    products.value = await productService.getAll()
  } catch (err) {
    console.error('Erreur chargement produits', err)
  } finally {
    loading.value = false
  }
})

function handleCategoryChange(category) {
  const query = { ...route.query }
  if (category === 'all') {
    delete query.cat
  } else {
    query.cat = category
  }
  router.push({ query })
}

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    if (currentCategory.value !== 'all' && product.category !== currentCategory.value) {
      return false
    }
    if (searchQuery.value.trim() !== '') {
      const q = searchQuery.value.toLowerCase()
      const matchName = product.name.toLowerCase().includes(q)
      const matchDesc = product.shortDescription.toLowerCase().includes(q)
      const matchComp = product.composition.some((c) => c.toLowerCase().includes(q))
      if (!matchName && !matchDesc && !matchComp) return false
    }
    return true
  })
})

const categories = computed(() => [
  { id: 'all', label: 'Tous les produits', count: products.value.length },
  { id: 'boissons', label: 'Boissons Végétales', count: products.value.filter((p) => p.category === 'boissons').length },
  { id: 'farines', label: 'Farines Fortifiées', count: products.value.filter((p) => p.category === 'farines').length },
  { id: 'derives', label: 'Tofu & Huile Pure', count: products.value.filter((p) => p.category === 'derives').length },
])

function resetFilters() {
  searchQuery.value = ''
  handleCategoryChange('all')
}
</script>

<template>
  <div class="py-12 md:py-20 bg-[#F5F1E8] min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- HEADER -->
      <div class="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <h3 class="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#1C1C1C]">
          La gamme saine &amp; gourmande du Burundi
        </h3>
       
      </div>

      <!-- FILTERS & SEARCH TOOLBAR -->
      <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-gray-100 mb-10 space-y-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- CATEGORY TABS -->
          <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              v-for="cat in categories"
              :key="cat.id"
              @click="handleCategoryChange(cat.id)"
              :class="[
                'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2',
                currentCategory === cat.id
                  ? 'bg-[#2E7D32] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              <span>{{ cat.label }}</span>
              <span
                :class="[
                  'px-1.5 py-0.5 rounded-md text-[10px]',
                  currentCategory === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                ]"
              >
                {{ cat.count }}
              </span>
            </button>
          </div>

          <!-- SEARCH INPUT -->
          <div class="relative w-full md:w-72">
            <Search class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Rechercher un produit..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-gray-50/50"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              Effacer
            </button>
          </div>
        </div>
      </div>

      <!-- PRODUCTS GRID -->
      <div
        v-if="loading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>

      <div
        v-else-if="filteredProducts.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <div
        v-else
        class="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-4"
      >
        <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Filter class="w-7 h-7" />
        </div>
        <h3 class="font-heading font-bold text-xl text-gray-900">
          Aucun produit ne correspond à votre recherche
        </h3>
        <p class="text-sm text-gray-500 max-w-md mx-auto">
          Essayez de modifier votre mot-clé ou sélectionnez une autre catégorie.
        </p>
        <button
          @click="resetFilters"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E7D32] text-white text-sm font-semibold hover:bg-[#1B5E20] transition-colors"
        >
          <RefreshCw class="w-4 h-4" />
          <span>Réinitialiser les filtres</span>
        </button>
      </div>
    </div>
  </div>
</template>
