<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import { blogService } from '@/src/services/blogService'
import BlogCard from '@/src/components/blog/BlogCard.vue'
import BlogCardSkeleton from '@/src/components/common/BlogCardSkeleton.vue'

const posts = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await blogService.getRecent(3)
    posts.value = data
  } catch (err) {
    console.error('Erreur chargement articles récents', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="py-16 md:py-24 bg-[#F5F1E8]/70">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div class="space-y-2">
          <span class="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#2E7D32]">
            Actualités &amp; Recettes
          </span>
          <h2 class="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#1C1C1C]">
            Conseils nutrition et vie de notre filière
          </h2>
          <p class="text-sm text-gray-600 max-w-xl">
            Informez-vous sur les bonnes pratiques de sevrage, découvrez des idées de plats savoureux
            et suivez l'impact de NUTRI SOJA Burundi auprès des communautés burundaises.
          </p>
        </div>

        <RouterLink
          to="/blog"
          class="inline-flex items-center gap-2 text-sm font-bold text-[#2E7D32] hover:text-[#1B5E20] group self-start md:self-end"
        >
          <span>Voir tous les articles</span>
          <ArrowRight class="w-4 h-4 text-[#D4A017] group-hover:translate-x-1 transition-transform" />
        </RouterLink>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <BlogCardSkeleton />
        <BlogCardSkeleton />
        <BlogCardSkeleton />
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <BlogCard v-for="post in posts" :key="post.id" :post="post" />
      </div>
    </div>
  </section>
</template>
