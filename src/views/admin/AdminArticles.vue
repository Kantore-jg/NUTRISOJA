<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  X,
  Eye,
  Calendar,
} from 'lucide-vue-next'
import { blogService } from '@/src/services/blogService'
import { useToastStore } from '@/src/stores/toast'
import ConfirmModal from '@/src/components/common/ConfirmModal.vue'
import ImageUpload from '@/src/components/common/ImageUpload.vue'
import TableSkeleton from '@/src/components/common/TableSkeleton.vue'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const articles = ref([])
const loading = ref(true)
const search = ref('')
const filterStatus = ref('all')

const modalOpen = ref(false)
const editingArticle = ref(null)
const deleteId = ref(null)

const formData = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
  category: 'Nutrition & Santé',
  tags: 'nutrition, soja, santé',
  status: 'published',
  readTimeMinutes: 4,
  authorName: 'Dr. Chantal Nibizi',
  authorRole: 'Nutritionniste en chef',
})

const loadArticles = async () => {
  loading.value = true
  try {
    const data = await blogService.getAll('all')
    articles.value = data
  } catch {
    toast.error('Erreur lors du chargement des articles.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  document.title = 'Gestion des Articles | Admin NUTRI SOJA Burundi'
  loadArticles()

  if (route.query.new === 'true') {
    handleOpenCreate()
    router.replace({ query: {} })
  }
})

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const handleOpenCreate = () => {
  editingArticle.value = null
  formData.value = {
    title: '',
    slug: '',
    excerpt: '',
    content: '### Introduction\n\nLe soja burundais présente des atouts exceptionnels...\n\n### Les Bienfaits\n\n- Richesse en fer et calcium\n- Digestibilité supérieure\n\n### En Pratique\n\nIntégrez-le dans votre alimentation quotidienne.',
    coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    category: 'Nutrition & Santé',
    tags: 'soja, santé, burundi',
    status: 'published',
    readTimeMinutes: 4,
    authorName: 'Dr. Chantal Nibizi',
    authorRole: 'Directrice Nutrition',
  }
  modalOpen.value = true
}

const handleOpenEdit = (post) => {
  editingArticle.value = post
  formData.value = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    category: post.category,
    tags: post.tags.join(', '),
    status: post.status,
    readTimeMinutes: post.readTimeMinutes,
    authorName: post.author.name,
    authorRole: post.author.role,
  }
  modalOpen.value = true
}

const handleTitleChange = (val) => {
  formData.value.title = val
  if (!formData.value.slug || !editingArticle.value) {
    formData.value.slug = generateSlug(val)
  }
}

const handleSubmit = async () => {
  if (!formData.value.title.trim() || !formData.value.content.trim()) {
    toast.error('Le titre et le contenu sont obligatoires.')
    return
  }

  const payload = {
    title: formData.value.title.trim(),
    slug: formData.value.slug.trim() || generateSlug(formData.value.title),
    excerpt: formData.value.excerpt.trim() || formData.value.content.slice(0, 150) + '...',
    content: formData.value.content,
    coverImage: formData.value.coverImage,
    category: formData.value.category,
    tags: formData.value.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    status: formData.value.status,
    readTimeMinutes: Number(formData.value.readTimeMinutes) || 4,
    publishedAt: editingArticle.value?.publishedAt || new Date().toISOString(),
    author: {
      name: formData.value.authorName.trim(),
      role: formData.value.authorRole.trim(),
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    },
  }

  try {
    if (editingArticle.value) {
      await blogService.update(editingArticle.value.id, payload)
      toast.success(`Article "${payload.title}" mis à jour.`)
    } else {
      await blogService.create(payload)
      toast.success('Nouvel article publié avec succès.')
    }
    modalOpen.value = false
    loadArticles()
  } catch {
    toast.error("Erreur lors de l'enregistrement de l'article.")
  }
}

const handleToggleStatus = async (post) => {
  const nextStatus = post.status === 'published' ? 'draft' : 'published'
  try {
    await blogService.update(post.id, { status: nextStatus })
    toast.success(`Statut modifié : ${nextStatus === 'published' ? 'En ligne' : 'Brouillon'}`)
    loadArticles()
  } catch {
    toast.error('Impossible de mettre à jour le statut.')
  }
}

const confirmDelete = async () => {
  if (!deleteId.value) return
  try {
    await blogService.delete(deleteId.value)
    toast.success('Article supprimé avec succès.')
    deleteId.value = null
    loadArticles()
  } catch {
    toast.error('Erreur de suppression.')
  }
}

const filteredArticles = computed(() => {
  return articles.value.filter((a) => {
    if (filterStatus.value !== 'all' && a.status !== filterStatus.value) return false
    if (search.value.trim()) {
      const q = search.value.toLowerCase()
      return a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
    }
    return true
  })
})
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
          Gestion des Articles de Blog
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Publiez des conseils nutritionnels, recettes et nouvelles locales pour vos lecteurs.
        </p>
      </div>

      <button
        @click="handleOpenCreate"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-semibold shadow-sm transition-all"
      >
        <Plus class="w-4 h-4" />
        <span>Rédiger un article</span>
      </button>
    </div>

    <!-- FILTER BAR -->
    <div class="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <button
          v-for="st in ['all', 'published', 'draft']"
          :key="st"
          @click="filterStatus = st"
          class="px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all"
          :class="filterStatus === st
            ? 'bg-[#2E7D32] text-white shadow-xs'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          {{ st === 'all' ? 'Tous les articles' : st === 'published' ? 'Publiés' : 'Brouillons' }}
        </button>
      </div>

      <div class="relative w-full sm:w-64">
        <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          v-model="search"
          placeholder="Rechercher par titre..."
          class="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
        />
      </div>
    </div>

    <!-- ARTICLES TABLE -->
    <TableSkeleton v-if="loading" :rows="4" />

    <div v-else class="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <th class="p-4">Article</th>
              <th class="p-4">Catégorie</th>
              <th class="p-4">Auteur</th>
              <th class="p-4">Date de parution</th>
              <th class="p-4">Statut</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-if="filteredArticles.length === 0">
              <td colspan="6" class="p-8 text-center text-gray-500">
                Aucun article trouvé.
              </td>
            </tr>

            <tr
              v-for="post in filteredArticles"
              :key="post.id"
              class="hover:bg-gray-50/70 transition-colors"
            >
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="post.coverImage"
                    :alt="post.title"
                    class="w-14 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                    referrerpolicy="no-referrer"
                  />
                  <div>
                    <p class="font-heading font-bold text-gray-900 line-clamp-1 max-w-sm">
                      {{ post.title }}
                    </p>
                    <p class="text-xs text-gray-500 line-clamp-1 max-w-sm">
                      {{ post.excerpt }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="p-4">
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                  {{ post.category }}
                </span>
              </td>

              <td class="p-4 text-xs text-gray-600 font-medium">
                {{ post.author.name }}
              </td>

              <td class="p-4 text-xs text-gray-500">
                <div class="flex items-center gap-1.5">
                  <Calendar class="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {{ new Date(post.publishedAt || post.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }) }}
                  </span>
                </div>
              </td>

              <td class="p-4">
                <button
                  @click="handleToggleStatus(post)"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors"
                  :class="post.status === 'published'
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'"
                  title="Cliquer pour changer le statut"
                >
                  <template v-if="post.status === 'published'">
                    <CheckCircle2 class="w-3.5 h-3.5" />
                    <span>En ligne</span>
                  </template>
                  <template v-else>
                    <Clock class="w-3.5 h-3.5" />
                    <span>Brouillon</span>
                  </template>
                </button>
              </td>

              <td class="p-4 text-right space-x-1">
                <a
                  :href="`/blog/${post.slug}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-block p-2 rounded-lg text-gray-500 hover:text-[#2E7D32] hover:bg-gray-100"
                  title="Aperçu public"
                >
                  <Eye class="w-4 h-4" />
                </a>
                <button
                  @click="handleOpenEdit(post)"
                  class="p-2 rounded-lg text-gray-600 hover:text-[#2E7D32] hover:bg-gray-100"
                  title="Modifier"
                >
                  <Edit2 class="w-4 h-4" />
                </button>
                <button
                  @click="deleteId = post.id"
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

    <!-- CREATE / EDIT ARTICLE MODAL -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div class="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto my-6">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-heading font-bold text-lg text-gray-900">
                {{ editingArticle ? "Modifier l'article" : 'Rédiger un nouvel article' }}
              </h3>
              <p class="text-xs text-gray-500">Mettez en valeur les qualités du soja et l'expertise locale</p>
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
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Titre de l'article *
            </label>
            <input
              type="text"
              required
              :value="formData.title"
              @input="handleTitleChange($event.target.value)"
              placeholder="Ex: Le Lait de Soja Face au Lait de Vache : Analyse Nutritionnelle"
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Catégorie *
              </label>
              <select
                v-model="formData.category"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32] bg-white"
              >
                <option value="Nutrition & Santé">Nutrition & Santé</option>
                <option value="Recettes & Cuisine">Recettes & Cuisine</option>
                <option value="Impact Local">Impact Local</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Statut de publication *
              </label>
              <select
                v-model="formData.status"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32] bg-white"
              >
                <option value="published">Publié (En ligne)</option>
                <option value="draft">Brouillon (Non visible)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Temps de lecture (minutes)
              </label>
              <input
                type="number"
                min="1"
                v-model.number="formData.readTimeMinutes"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>
          </div>

          <!-- COVER IMAGE UPLOAD -->
          <div>
            <ImageUpload
              label="Image de couverture de l'article"
              v-model="formData.coverImage"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Extrait / Chapô d'introduction *
            </label>
            <textarea
              rows="2"
              required
              v-model="formData.excerpt"
              placeholder="Bref résumé accrocheur affiché sur les cartes et aperçus..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Contenu détaillé de l'article (supporte les titres ### et listes - ) *
            </label>
            <textarea
              rows="8"
              required
              v-model="formData.content"
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Auteur
              </label>
              <input
                type="text"
                v-model="formData.authorName"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Mots-clés (séparés par virgule)
              </label>
              <input
                type="text"
                v-model="formData.tags"
                placeholder="soja, santé, recette"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>
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
              {{ editingArticle ? "Mettre à jour l'article" : "Publier l'article" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- CONFIRM DELETE MODAL -->
    <ConfirmModal
      :is-open="!!deleteId"
      title="Supprimer cet article ?"
      message="Êtes-vous sûr de vouloir supprimer cet article du blog ? Cette action est irréversible."
      confirm-label="Oui, supprimer"
      @confirm="confirmDelete"
      @cancel="deleteId = null"
    />
  </div>
</template>
