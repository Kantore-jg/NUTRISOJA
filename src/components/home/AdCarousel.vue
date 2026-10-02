<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronLeft, ChevronRight, Sparkles, ExternalLink } from 'lucide-vue-next'
import { adService } from '@/src/services/adService'

const ads = ref([])
const currentIndex = ref(0)
const isHovered = ref(false)
let timerRef = null

onMounted(async () => {
  const activeAds = await adService.getActive()
  ads.value = activeAds
})

function startTimer() {
  stopTimer()
  if (ads.value.length <= 1) return
  timerRef = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % ads.value.length
  }, 5000)
}

function stopTimer() {
  if (timerRef) {
    clearInterval(timerRef)
    timerRef = null
  }
}

watch([() => ads.value.length, isHovered], ([, hovered]) => {
  if (hovered) {
    stopTimer()
  } else {
    startTimer()
  }
}, { immediate: true })

onUnmounted(() => {
  stopTimer()
})

function handlePrev() {
  currentIndex.value = currentIndex.value === 0 ? ads.value.length - 1 : currentIndex.value - 1
}

function handleNext() {
  currentIndex.value = (currentIndex.value + 1) % ads.value.length
}
</script>

<template>
  <section v-if="ads.length > 0" class="py-8 bg-[#F5F1E8]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
        class="relative rounded-3xl overflow-hidden shadow-xl bg-gray-900 border border-black/10 group min-h-[300px] sm:min-h-[360px] flex items-center"
      >
        <!-- BACKGROUND IMAGE WITH OVERLAY -->
        <div class="absolute inset-0 z-0">
          <img
            :src="ads[currentIndex].image"
            :alt="ads[currentIndex].title"
            class="w-full h-full object-cover opacity-45 transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
            referrerpolicy="no-referrer"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
        </div>

        <!-- CONTENT -->
        <div class="relative z-10 p-6 sm:p-10 md:p-14 max-w-2xl text-white space-y-4">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A017]/20 border border-[#D4A017]/40 text-[#D4A017] text-xs font-semibold">
            <Sparkles class="w-3.5 h-3.5" />
            <span>À la une &amp; Actualités</span>
          </div>

          <h3 class="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl leading-tight">
            {{ ads[currentIndex].title }}
          </h3>

          <p class="text-sm sm:text-base text-gray-200 leading-relaxed">
            {{ ads[currentIndex].subtitle }}
          </p>

          <div class="pt-2">
            <RouterLink
              :to="ads[currentIndex].linkUrl || '/produits'"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-semibold shadow-md transition-all"
            >
              <span>{{ ads[currentIndex].ctaText || 'En savoir plus' }}</span>
              <ExternalLink class="w-4 h-4 text-[#D4A017]" />
            </RouterLink>
          </div>
        </div>

        <!-- CONTROLS (ARROWS) -->
        <template v-if="ads.length > 1">
          <button
            @click="handlePrev"
            aria-label="Publicité précédente"
            class="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100"
          >
            <ChevronLeft class="w-6 h-6" />
          </button>
          <button
            @click="handleNext"
            aria-label="Publicité suivante"
            class="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100"
          >
            <ChevronRight class="w-6 h-6" />
          </button>

          <!-- DOT INDICATORS -->
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            <button
              v-for="(ad, index) in ads"
              :key="index"
              @click="currentIndex = index"
              :aria-label="`Aller à la diapositive ${index + 1}`"
              :class="[
                'h-2.5 rounded-full transition-all',
                currentIndex === index ? 'w-8 bg-[#D4A017]' : 'w-2.5 bg-white/50 hover:bg-white/80'
              ]"
            />
          </div>
        </template>

        <!-- PAUSE INDICATOR HINT -->
        <div
          v-if="isHovered && ads.length > 1"
          class="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-md bg-black/50 text-[11px] text-gray-300 backdrop-blur-xs"
        >
          Diaporama en pause
        </div>
      </div>
    </div>
  </section>
</template>
