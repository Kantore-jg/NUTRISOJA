<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, MessageSquare, Check, ShieldCheck, Sparkles, ChefHat, Heart, Share2 } from 'lucide-vue-next'
import { productService } from '@/src/services/productService'
import ProductCard from '@/src/components/products/ProductCard.vue'
import { useToastStore } from '@/src/stores/toast'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const product = ref(null)
const activeImageIndex = ref(0)
const relatedProducts = ref([])
const loading = ref(true)

async function fetchDetail(slug) {
  if (!slug) return
  loading.value = true
  try {
    const found = await productService.getBySlug(slug)
    if (found) {
      product.value = found
      document.title = `${found.name} | NUTRI SOJA Burundi`
      const all = await productService.getAll()
      relatedProducts.value = all
        .filter((p) => p.category === found.category && p.id !== found.id)
        .slice(0, 3)
    } else {
      product.value = null
    }
  } catch (err) {
    console.error('Erreur chargement détail produit', err)
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.slug,
  (slug) => {
    activeImageIndex.value = 0
    fetchDetail(slug)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  { immediate: true }
)

const categoryLabel = computed(() => {
  if (!product.value) return ''
  if (product.value.category === 'boissons') return 'Boisson Végétale'
  if (product.value.category === 'farines') return 'Farine Fortifiée'
  return 'Dérivé Artisanal'
})

const whatsappMessage = computed(() => {
  if (!product.value) return ''
  return encodeURIComponent(
    `Bonjour NUTRI SOJA Burundi, je souhaite passer commande pour :\n- Produit : ${product.value.name}\n- Format : ${product.value.packageSize}\n- Prix indicatif : ${product.value.price.toLocaleString('fr-FR')} BIF\nMerci de me confirmer la livraison à mon adresse.`
  )
})

function handleCopyLink() {
  navigator.clipboard.writeText(window.location.href)
  toast.success('Lien du produit copié dans le presse-papier !')
}
</script>

<template>
  <!-- LOADING STATE -->
  <div v-if="loading" class="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div class="lg:col-span-6 aspect-square bg-gray-200 rounded-3xl" />
      <div class="lg:col-span-6 space-y-6">
        <div class="h-8 bg-gray-200 rounded w-1/3" />
        <div class="h-10 bg-gray-200 rounded w-3/4" />
        <div class="h-24 bg-gray-200 rounded w-full" />
        <div class="h-12 bg-gray-200 rounded-xl w-1/2" />
      </div>
    </div>
  </div>

  <!-- NOT FOUND STATE -->
  <div v-else-if="!product" class="py-24 text-center max-w-lg mx-auto px-4">
    <h2 class="font-heading font-bold text-2xl text-gray-900 mb-3">Produit non trouvé</h2>
    <p class="text-gray-600 mb-6">Le produit que vous recherchez n'existe pas ou a été retiré de la vente.</p>
    <button
      @click="router.push('/produits')"
      class="px-6 py-3 rounded-xl bg-[#2E7D32] text-white font-semibold text-sm hover:bg-[#1B5E20]"
    >
      Retour au catalogue des produits
    </button>
  </div>

  <!-- PRODUCT DETAIL -->
  <div v-else class="py-10 md:py-16 bg-[#F5F1E8] min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- BREADCRUMB / BACK -->
      <div class="mb-6 flex items-center justify-between">
        <RouterLink
          to="/produits"
          class="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#2E7D32] transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Retour aux produits</span>
        </RouterLink>
      </div>

      <!-- MAIN PRODUCT GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
        <!-- LEFT: GALLERY -->
        <div class="lg:col-span-6 space-y-4">
          <div class="aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 relative group">
            <img
              :src="product.images[activeImageIndex] || product.images[0]"
              :alt="product.name"
              class="w-full h-full object-cover"
              referrerpolicy="no-referrer"
            />
            
          </div>

          <!-- THUMBNAILS -->
          <div v-if="product.images.length > 1" class="flex items-center gap-3 overflow-x-auto pb-2">
            <button
              v-for="(img, idx) in product.images"
              :key="idx"
              @click="activeImageIndex = idx"
              :class="[
                'w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all',
                activeImageIndex === idx
                  ? 'border-[#2E7D32] ring-2 ring-[#2E7D32]/20'
                  : 'border-gray-200 opacity-70 hover:opacity-100'
              ]"
            >
              <img :src="img" :alt="`Vignette ${idx + 1}`" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
            </button>
          </div>
        </div>

        <!-- RIGHT: DETAILS & ACTIONS -->
        <div class="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between gap-4">
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2E7D32]/10 text-[#2E7D32]">
                {{ categoryLabel }}
              </span>
              <span
                v-if="product.available"
                class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1.5"
              >
                <Check class="w-3.5 h-3.5" />
                Disponible en stock
              </span>
              <span
                v-else
                class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800"
              >
                Rupture momentanée
              </span>
            </div>

            <h1 class="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-gray-900 leading-tight">
              {{ product.name }}
            </h1>

            <div class="flex items-baseline gap-3">
              <span class="font-heading font-black text-3xl text-[#2E7D32]">
                {{ product.price.toLocaleString('fr-FR') }}
                <span class="text-base font-bold text-gray-700">(BIF)</span>
              </span>
              <span class="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                {{ product.packageSize }}
              </span>
            </div>

            <p class="text-gray-700 leading-relaxed text-sm sm:text-base border-t border-b border-gray-100 py-4">
              {{ product.fullDescription || product.shortDescription }}
            </p>

            <!-- HIGHLIGHTS -->
            <div class="grid grid-cols-2 gap-3 text-xs text-gray-700 pt-1">
              <div class="flex items-center gap-2">
                <ShieldCheck class="w-4 h-4 text-[#2E7D32]" />
                <span>Soja 100% cultivé au Burundi</span>
              </div>
              <div class="flex items-center gap-2">
                <Sparkles class="w-4 h-4 text-[#D4A017]" />
                <span>Sans conservateurs artificiels</span>
              </div>
              <div class="flex items-center gap-2">
                <Check class="w-4 h-4 text-[#2E7D32]" />
                <span>Zéro lactose &amp; zéro cholestérol</span>
              </div>
              <div class="flex items-center gap-2">
                <Heart class="w-4 h-4 text-rose-500" />
                <span>Riche en protéines complètes</span>
              </div>
            </div>
          </div>

          <!-- ORDER VIA WHATSAPP CTA -->
          <div class="pt-6 border-t border-gray-100 space-y-3">
            <a
              :href="`https://wa.me/25779000000?text=${whatsappMessage}`"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-base shadow-lg shadow-[#2E7D32]/25 hover:shadow-xl transition-all"
            >
              <MessageSquare class="w-5 h-5 text-[#D4A017]" />
              <span>Commander via WhatsApp</span>
            </a>

            <p class="text-center text-xs text-gray-500">
              Commande directe avec notre service client à Bujumbura. Livraison rapide à domicile ou en point relais.
            </p>
          </div>
        </div>
      </div>

      <!-- TABS / SECTIONS: COMPOSITION, VALEURS NUTRITIONNELLES, CONSEILS D'UTILISATION -->
      <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- COMPOSITION -->
        <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100">
          <div class="flex items-center gap-3 mb-4 text-[#2E7D32]">
            <Sparkles class="w-5 h-5 text-[#D4A017]" />
            <h3 class="font-heading font-bold text-lg text-gray-900">Composition &amp; Ingrédients</h3>
          </div>
          <ul class="space-y-2 text-sm text-gray-700 divide-y divide-gray-100">
            <li
              v-for="(item, idx) in product.composition"
              :key="idx"
              class="pt-2 first:pt-0 flex items-start gap-2"
            >
              <span class="text-[#2E7D32] font-bold">•</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>

        <!-- VALEURS NUTRITIONNELLES -->
        <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100">
          <div class="flex items-center gap-3 mb-4 text-[#2E7D32]">
            <Heart class="w-5 h-5 text-rose-500" />
            <h3 class="font-heading font-bold text-lg text-gray-900">Valeurs Nutritionnelles</h3>
          </div>
          <div class="text-xs text-gray-500 mb-3">Pour 100g / 100ml de produit</div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between py-1 border-b border-gray-100">
              <span class="text-gray-600">Valeur énergétique</span>
              <span class="font-bold text-gray-900">{{ product.nutritionalValues.calories }} kcal</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-100">
              <span class="text-gray-600">Protéines végétales</span>
              <span class="font-bold text-[#2E7D32]">{{ product.nutritionalValues.proteins }} g</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-100">
              <span class="text-gray-600">Lipides (bons acides gras)</span>
              <span class="font-medium text-gray-900">{{ product.nutritionalValues.lipids }} g</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-100">
              <span class="text-gray-600">Glucides</span>
              <span class="font-medium text-gray-900">{{ product.nutritionalValues.carbohydrates }} g</span>
            </div>
            <div v-if="product.nutritionalValues.calcium" class="flex justify-between py-1 border-b border-gray-100">
              <span class="text-gray-600">Calcium</span>
              <span class="font-medium text-gray-900">{{ product.nutritionalValues.calcium }} mg</span>
            </div>
            <div v-if="product.nutritionalValues.iron" class="flex justify-between py-1">
              <span class="text-gray-600">Fer végétal</span>
              <span class="font-medium text-gray-900">{{ product.nutritionalValues.iron }} mg</span>
            </div>
          </div>
        </div>

        <!-- CONSEILS D'UTILISATION -->
        <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100">
          <div class="flex items-center gap-3 mb-4 text-[#2E7D32]">
            <ChefHat class="w-5 h-5 text-[#D4A017]" />
            <h3 class="font-heading font-bold text-lg text-gray-900">Conseils d'utilisation</h3>
          </div>
          <ul class="space-y-3 text-sm text-gray-700">
            <li
              v-for="(tip, idx) in product.usageTips"
              :key="idx"
              class="flex items-start gap-2.5"
            >
              <div class="w-5 h-5 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {{ idx + 1 }}
              </div>
              <span class="leading-snug">{{ tip }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- RELATED PRODUCTS -->
      <div v-if="relatedProducts.length > 0" class="mt-16 pt-12 border-t border-gray-200">
        <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-gray-900 mb-8">
          Produits similaires recommandés
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            v-for="p in relatedProducts"
            :key="p.id"
            :product="p"
          />
        </div>
      </div>
    </div>
  </div>
</template>
