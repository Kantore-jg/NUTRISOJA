<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, ChevronLeft, ChevronRight, BookOpen } from 'lucide-vue-next'
import { blogService } from '@/src/services/blogService'
import BlogCard from '@/src/components/blog/BlogCard.vue'
import BlogCardSkeleton from '@/src/components/common/BlogCardSkeleton.vue'

const POSTS_PER_PAGE = 6

const posts = ref([])
const loading = ref(true)
const selectedCategory = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)

onMounted(async () => {
  document.title = 'Actualités & Conseils Nutrition | NUTRI SOJA Burundi'
  loading.value = true
  try {
    posts.value = await blogService.getAll('published')
  } catch (err) {
    console.error('Erreur chargement articles', err)
  } finally {
    loading.value = false
  }
})

const filteredPosts = computed(() => {
  return posts.value.filter((post) => {
    if (selectedCategory.value !== 'all' && post.category !== selectedCategory.value) {
      return false
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchTitle = post.title.toLowerCase().includes(q)
      const matchExcerpt = post.excerpt.toLowerCase().includes(q)
      const matchTag = post.tags.some((t) => t.toLowerCase().includes(q))
      if (!matchTitle && !matchExcerpt && !matchTag) return false
    }
    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / POSTS_PER_PAGE) || 1)

const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * POSTS_PER_PAGE
  return filteredPosts.value.slice(startIndex, startIndex + POSTS_PER_PAGE)
})

const categories = ['all', 'Nutrition & Santé', 'Recettes & Cuisine', 'Impact Local']

function handleCategorySelect(cat) {
  selectedCategory.value = cat
  currentPage.value = 1
}

function onSearchInput(e) {
  searchQuery.value = e.target.value
  currentPage.value = 1
}
</script>

<template>
  <div class="py-12 md:py-20 bg-[#F5F1E8] min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- HEADER -->
      <div class="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <h1 class="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#1C1C1C]">
          Actualités, Nutrition &amp; Recettes Burundaises
        </h1>
        <p class="text-sm sm:text-base text-gray-600">
          Conseils pratiques de nos nutritionnistes, découvertes culinaires et chroniques
          auprès de nos 350 producteurs partenaires.
        </p>
      </div>

      <!-- SEARCH & FILTERS -->
      <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-gray-100 mb-10 space-y-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Category tabs -->
          <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="handleCategorySelect(cat)"
              :class="[
                'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all',
                selectedCategory === cat
                  ? 'bg-[#2E7D32] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ cat === 'all' ? 'Toutes les actualités' : cat }}
            </button>
          </div>

          <!-- Search -->
          <div class="relative w-full md:w-72">
            <Search class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              :value="searchQuery"
              @input="onSearchInput"
              placeholder="Rechercher un article..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-gray-50/50"
            />
          </div>
        </div>
      </div>

      <!-- POSTS LIST -->
      <div
        v-if="loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <BlogCardSkeleton />
        <BlogCardSkeleton />
        <BlogCardSkeleton />
      </div>

      <template v-else-if="paginatedPosts.length > 0">
        <div class="space-y-12">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogCard
              v-for="post in paginatedPosts"
              :key="post.id"
              :post="post"
            />
          </div>

          <!-- PAGINATION -->
          <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-4">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft class="w-4 h-4" />
              <span>Précédent</span>
            </button>

            <button
              v-for="pageNum in totalPages"
              :key="pageNum"
              @click="currentPage = pageNum"
              :class="[
                'w-10 h-10 rounded-xl text-sm font-bold transition-all',
                currentPage === pageNum
                  ? 'bg-[#2E7D32] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              ]"
            >
              {{ pageNum }}
            </button>

            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span>Suivant</span>
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </template>

      <div
        v-else
        class="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8"
      >
        <h3 class="font-heading font-bold text-lg text-gray-800 mb-2">Aucun article trouvé</h3>
        <p class="text-sm text-gray-500">Essayez un autre mot-clé ou sélectionnez une catégorie différente.</p>
      </div>
    </div>
  </div>
</template>
