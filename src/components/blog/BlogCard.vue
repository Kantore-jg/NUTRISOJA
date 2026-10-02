<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Calendar, Clock, ArrowRight } from 'lucide-vue-next'

const props = defineProps({
  post: { type: Object, required: true },
})

const formattedDate = computed(() => {
  return new Date(props.post.publishedAt || props.post.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})
</script>

<template>
  <article class="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-gray-100 hover:border-[#2E7D32]/30 transition-all duration-300 flex flex-col h-full">
    <!-- COVER IMAGE -->
    <RouterLink :to="`/blog/${post.slug}`" class="relative aspect-[16/10] overflow-hidden bg-gray-100 block">
      <img
        :src="post.coverImage"
        :alt="post.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        referrerpolicy="no-referrer"
        loading="lazy"
      />
      <div class="absolute top-3 left-3">
        <span class="px-3 py-1 rounded-full text-xs font-bold bg-[#2E7D32] text-white shadow-xs">
          {{ post.category }}
        </span>
      </div>
    </RouterLink>

    <!-- BODY -->
    <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
      <div>
        <!-- META -->
        <div class="flex items-center gap-4 text-xs text-gray-500 mb-2">
          <span class="flex items-center gap-1">
            <Calendar class="w-3.5 h-3.5 text-[#D4A017]" />
            {{ formattedDate }}
          </span>
          <span class="flex items-center gap-1">
            <Clock class="w-3.5 h-3.5 text-gray-400" />
            {{ post.readTimeMinutes }} min de lecture
          </span>
        </div>

        <h3 class="font-heading font-bold text-lg sm:text-xl text-[#1C1C1C] group-hover:text-[#2E7D32] transition-colors leading-snug line-clamp-2">
          <RouterLink :to="`/blog/${post.slug}`">{{ post.title }}</RouterLink>
        </h3>

        <p class="text-xs sm:text-sm text-gray-600 mt-2.5 line-clamp-3 leading-relaxed">
          {{ post.excerpt }}
        </p>
      </div>

      <!-- AUTHOR & READ MORE -->
      <div class="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <img
            :src="post.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'"
            :alt="post.author.name"
            class="w-8 h-8 rounded-full object-cover border border-gray-200"
            referrerpolicy="no-referrer"
          />
          <div class="text-left">
            <p class="text-xs font-semibold text-gray-800 line-clamp-1">{{ post.author.name }}</p>
            <p class="text-[10px] text-gray-500 line-clamp-1">{{ post.author.role }}</p>
          </div>
        </div>

        <RouterLink
          :to="`/blog/${post.slug}`"
          class="text-xs font-semibold text-[#2E7D32] hover:text-[#1B5E20] flex items-center gap-1 shrink-0"
          :aria-label="`Lire l'article : ${post.title}`"
        >
          <span>Lire</span>
          <ArrowRight class="w-3.5 h-3.5 text-[#D4A017]" />
        </RouterLink>
      </div>
    </div>
  </article>
</template>
