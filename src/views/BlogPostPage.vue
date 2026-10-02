<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Calendar, Clock, Share2, MessageCircle, Check, Tag } from 'lucide-vue-next'
import { blogService } from '@/src/services/blogService'
import { useToastStore } from '@/src/stores/toast'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const post = ref(null)
const relatedPosts = ref([])
const loading = ref(true)
const copied = ref(false)

async function fetchPost(slug) {
  if (!slug) return
  loading.value = true
  try {
    const found = await blogService.getBySlug(slug)
    if (found) {
      post.value = found
      document.title = `${found.title} | Blog NUTRI SOJA Burundi`
      const all = await blogService.getAll('published')
      relatedPosts.value = all.filter((p) => p.id !== found.id).slice(0, 2)
    } else {
      post.value = null
    }
  } catch (err) {
    console.error('Erreur chargement article', err)
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.slug,
  (slug) => {
    fetchPost(slug)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  { immediate: true }
)

const shareUrl = computed(() => window.location.href)
const shareTitle = computed(() => post.value?.title || '')

function handleCopyLink() {
  navigator.clipboard.writeText(shareUrl.value)
  copied.value = true
  toast.success('Lien copié dans le presse-papier !')
  setTimeout(() => { copied.value = false }, 3000)
}

const formattedDate = computed(() => {
  if (!post.value) return ''
  return new Date(post.value.publishedAt || post.value.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

function renderBlock(block) {
  if (block.startsWith('### ')) {
    return { type: 'h3', content: block.replace('### ', '') }
  }
  if (block.startsWith('1. ') || block.startsWith('2. ') || block.startsWith('3. ')) {
    return { type: 'ordered', content: block }
  }
  if (block.startsWith('- ')) {
    return { type: 'list', items: block.split('\n').map((item) => item.replace('- ', '')) }
  }
  return { type: 'p', content: block }
}
</script>

<template>
  <!-- LOADING STATE -->
  <div v-if="loading" class="py-20 max-w-4xl mx-auto px-4 animate-pulse space-y-6">
    <div class="h-6 bg-gray-200 rounded w-1/4" />
    <div class="h-12 bg-gray-200 rounded w-3/4" />
    <div class="aspect-[16/9] bg-gray-200 rounded-3xl" />
    <div class="space-y-3 pt-6">
      <div class="h-4 bg-gray-200 rounded w-full" />
      <div class="h-4 bg-gray-200 rounded w-5/6" />
      <div class="h-4 bg-gray-200 rounded w-4/6" />
    </div>
  </div>

  <!-- NOT FOUND STATE -->
  <div v-else-if="!post" class="py-24 text-center max-w-lg mx-auto px-4">
    <h2 class="font-heading font-bold text-2xl text-gray-900 mb-3">Article introuvable</h2>
    <p class="text-gray-600 mb-6">L'article que vous cherchez n'existe plus ou a été déplacé.</p>
    <button
      @click="router.push('/blog')"
      class="px-6 py-3 rounded-xl bg-[#2E7D32] text-white font-semibold text-sm hover:bg-[#1B5E20]"
    >
      Retour au blog
    </button>
  </div>

  <!-- ARTICLE DETAIL -->
  <article v-else class="py-12 md:py-20 bg-[#F5F1E8] min-h-screen">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- BACK LINK -->
      <div class="mb-8">
        <RouterLink
          to="/blog"
          class="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#2E7D32] transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Retour à tous les articles</span>
        </RouterLink>
      </div>

      <!-- HEADER -->
      <header class="space-y-4 mb-8">
        <div class="flex flex-wrap items-center gap-3">
          <span class="px-3.5 py-1 rounded-full text-xs font-bold bg-[#2E7D32] text-white">
            {{ post.category }}
          </span>
          <div class="flex items-center gap-4 text-xs text-gray-500">
            <span class="flex items-center gap-1">
              <Calendar class="w-3.5 h-3.5 text-[#D4A017]" />
              {{ formattedDate }}
            </span>
            <span class="flex items-center gap-1">
              <Clock class="w-3.5 h-3.5 text-gray-400" />
              {{ post.readTimeMinutes }} min de lecture
            </span>
          </div>
        </div>

        <h1 class="font-heading font-extrabold text-2xl sm:text-3xl md:text-5xl text-[#1C1C1C] leading-[1.2]">
          {{ post.title }}
        </h1>

        <p class="text-base sm:text-lg text-gray-700 leading-relaxed font-medium">
          {{ post.excerpt }}
        </p>

        <!-- AUTHOR & SOCIAL SHARE BAR -->
        <div class="pt-6 border-t border-b border-[#2E7D32]/15 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <img
              :src="post.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'"
              :alt="post.author.name"
              class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
              referrerpolicy="no-referrer"
            />
            <div>
              <p class="font-heading font-bold text-sm text-gray-900">{{ post.author.name }}</p>
              <p class="text-xs text-gray-500">{{ post.author.role }}</p>
            </div>
          </div>

          <!-- SHARE BUTTONS -->
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-gray-500 mr-1 flex items-center gap-1">
              <Share2 class="w-3.5 h-3.5" />
              Partager :
            </span>
            <!-- WhatsApp -->
            <a
              :href="`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors"
              title="Partager sur WhatsApp"
              aria-label="Partager sur WhatsApp"
            >
              <MessageCircle class="w-4 h-4" />
            </a>
            <!-- Copy Link -->
            <button
              @click="handleCopyLink"
              class="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              title="Copier le lien"
              aria-label="Copier le lien"
            >
              <Check v-if="copied" class="w-4 h-4 text-[#2E7D32]" />
              <Share2 v-else class="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <!-- COVER IMAGE -->
      <div class="aspect-[16/9] rounded-3xl overflow-hidden shadow-md mb-10 bg-gray-100 border border-black/5">
        <img
          :src="post.coverImage"
          :alt="post.title"
          class="w-full h-full object-cover"
          referrerpolicy="no-referrer"
        />
      </div>

      <!-- RICH ARTICLE BODY -->
      <div class="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-gray-100">
        <div class="prose prose-lg max-w-none text-gray-800 space-y-6 leading-relaxed">
          <template v-for="(block, idx) in post.content.split('\n\n')" :key="idx">
            <h3
              v-if="renderBlock(block).type === 'h3'"
              class="font-heading font-bold text-xl sm:text-2xl text-gray-900 mt-8 mb-3 text-[#2E7D32]"
            >
              {{ renderBlock(block).content }}
            </h3>
            <div
              v-else-if="renderBlock(block).type === 'ordered'"
              class="pl-4 border-l-2 border-[#D4A017] my-3 text-sm sm:text-base text-gray-700"
            >
              {{ renderBlock(block).content }}
            </div>
            <ul
              v-else-if="renderBlock(block).type === 'list'"
              class="list-disc list-inside space-y-1 my-3 text-sm sm:text-base text-gray-700"
            >
              <li v-for="(item, i) in renderBlock(block).items" :key="i">{{ item }}</li>
            </ul>
            <p
              v-else
              class="text-base sm:text-lg text-gray-700 leading-relaxed"
            >
              {{ block }}
            </p>
          </template>
        </div>

        <!-- TAGS -->
        <div
          v-if="post.tags && post.tags.length > 0"
          class="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2"
        >
          <span class="text-xs font-semibold text-gray-500 flex items-center gap-1 mr-2">
            <Tag class="w-3.5 h-3.5 text-[#D4A017]" />
            Mots-clés :
          </span>
          <span
            v-for="(tag, idx) in post.tags"
            :key="idx"
            class="px-3 py-1 rounded-lg bg-[#F5F1E8] text-[#1C1C1C] text-xs font-medium"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- RELATED ARTICLES -->
      <div v-if="relatedPosts.length > 0" class="mt-16 pt-10 border-t border-gray-200">
        <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-gray-900 mb-6">
          Articles recommandés
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <RouterLink
            v-for="p in relatedPosts"
            :key="p.id"
            :to="`/blog/${p.slug}`"
            class="group bg-white rounded-2xl p-5 shadow-xs border border-gray-100 hover:border-[#2E7D32]/30 flex items-center gap-4 transition-all"
          >
            <img
              :src="p.coverImage"
              :alt="p.title"
              class="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
              referrerpolicy="no-referrer"
            />
            <div>
              <span class="text-[11px] font-bold text-[#2E7D32] uppercase">{{ p.category }}</span>
              <h4 class="font-heading font-bold text-sm text-gray-900 group-hover:text-[#2E7D32] line-clamp-2 mt-1">
                {{ p.title }}
              </h4>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </article>
</template>
