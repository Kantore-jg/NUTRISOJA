<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { MessageSquare, ArrowRight, Check, AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  product: { type: Object, required: true },
})

const categoryLabels = {
  boissons: 'Boisson végétale',
  farines: 'Farine enrichie',
  derives: 'Dérivé artisanal',
}

const categoryLabel = computed(() => categoryLabels[props.product.category] || props.product.category)

const formattedPrice = computed(() => props.product.price.toLocaleString('fr-FR'))

const whatsappMessage = computed(() =>
  encodeURIComponent(
    `Bonjour NUTRI SOJA Burundi, je souhaite commander : ${props.product.name} (${props.product.packageSize} - ${props.product.price.toLocaleString('fr-FR')} BIF). Pouvez-vous me confirmer la disponibilité ?`
  )
)
</script>

<template>
  <div class="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-gray-100 hover:border-[#2E7D32]/30 transition-all duration-300 flex flex-col h-full">
    <!-- IMAGE CONTAINER -->
    <RouterLink :to="`/produits/${product.slug}`" class="relative aspect-[4/3] overflow-hidden bg-gray-100 block">
      <img
        :src="product.images[0]"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        referrerpolicy="no-referrer"
        loading="lazy"
      />
      <div class="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
        <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#1C1C1C]/80 text-white backdrop-blur-xs">
          {{ categoryLabel }}
        </span>
        <span
          v-if="product.isFeatured"
          class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D4A017] text-white shadow-xs"
        >
          Recommandé
        </span>
      </div>

      <div class="absolute top-3 right-3">
        <span
          v-if="product.available"
          class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1 shadow-xs"
        >
          <Check class="w-3 h-3" />
          En stock
        </span>
        <span
          v-else
          class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-800 flex items-center gap-1 shadow-xs"
        >
          <AlertCircle class="w-3 h-3" />
          Rupture
        </span>
      </div>
    </RouterLink>

    <!-- BODY -->
    <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
      <div>
        <div class="text-xs font-semibold text-[#5A5A5A] mb-1">
          Format : {{ product.packageSize }}
        </div>
        <h3 class="font-heading font-bold text-lg text-gray-900 group-hover:text-[#2E7D32] transition-colors line-clamp-1">
          <RouterLink :to="`/produits/${product.slug}`">{{ product.name }}</RouterLink>
        </h3>
        <p class="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
          {{ product.shortDescription }}
        </p>
      </div>

      <!-- FOOTER / PRICE & ACTIONS -->
      <div class="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
        <div>
          <span class="text-[10px] uppercase font-bold text-gray-400 block leading-none">
            Prix unitaire
          </span>
          <span class="font-heading font-extrabold text-lg sm:text-xl text-[#2E7D32]">
            {{ formattedPrice }}
            <span class="text-xs font-bold text-gray-600">BIF</span>
          </span>
        </div>

        <div class="flex items-center gap-1.5">
          <a
            :href="`https://wa.me/25779000000?text=${whatsappMessage}`"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
            title="Commander directement via WhatsApp"
            :aria-label="`Commander ${product.name} par WhatsApp`"
          >
            <MessageSquare class="w-4 h-4" />
          </a>
          <RouterLink
            :to="`/produits/${product.slug}`"
            class="px-3.5 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-semibold hover:bg-[#1B5E20] flex items-center gap-1 transition-all shadow-xs"
          >
            <span>Détails</span>
            <ArrowRight class="w-3.5 h-3.5 text-[#D4A017]" />
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
