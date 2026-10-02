<script setup>
import { ref, onMounted } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import { productService } from '@/src/services/productService'
import Hero from '@/src/components/home/Hero.vue'
import AdCarousel from '@/src/components/home/AdCarousel.vue'
import BenefitsSection from '@/src/components/home/BenefitsSection.vue'
import KeyMetrics from '@/src/components/home/KeyMetrics.vue'
import RecentBlogSection from '@/src/components/home/RecentBlogSection.vue'
import PartnersSection from '@/src/components/home/PartnersSection.vue'
import ProductCard from '@/src/components/products/ProductCard.vue'
import ProductCardSkeleton from '@/src/components/common/ProductCardSkeleton.vue'

const featuredProducts = ref([])
const loading = ref(true)

onMounted(async () => {
  document.title = 'NUTRI SOJA Burundi - Agroalimentaire & Transformation du Soja au Burundi'

  try {
    const featured = await productService.getFeatured()
    featuredProducts.value = featured.length > 0
      ? featured
      : (await productService.getAll()).slice(0, 4)
  } catch (err) {
    console.error('Erreur chargement produits vedettes', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-0">
    <!-- 1. HERO SECTION -->
    <Hero />

    <!-- 2. AD CAROUSEL (5s Auto slideshow) -->
    <AdCarousel />

    <!-- 3. FEATURED PRODUCTS PREVIEW -->
    <section class="py-16 md:py-24 bg-[#F5F1E8]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div class="space-y-2">
            <span class="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#2E7D32]">
              Nos Incontournables
            </span>
            <h2 class="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#1C1C1C]">
              Découvrez nos produits sains et nutritifs
            </h2>
            <p class="text-sm text-gray-600 max-w-xl">
              Du petit-déjeuner au dîner, retrouvez l'onctuosité de nos laits végétaux,
              la force de notre farine TotoFort et l'authenticité de notre tofu artisanal.
            </p>
          </div>

          <RouterLink
            to="/produits"
            class="inline-flex items-center gap-2 text-sm font-bold text-[#2E7D32] hover:text-[#1B5E20] group self-start sm:self-end"
          >
            <span>Voir tout le catalogue</span>
            <ArrowRight class="w-4 h-4 text-[#D4A017] group-hover:translate-x-1 transition-transform" />
          </RouterLink>
        </div>

        <div
          v-if="loading"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <ProductCard
            v-for="product in featuredProducts.slice(0, 4)"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </section>

    <!-- 4. POURQUOI LE SOJA ? (4 BENEFIT CARDS) -->
    <BenefitsSection />

    <!-- 5. BANDEAU CHIFFRES CLÉS -->
    <KeyMetrics />

    <!-- 6. APERÇU DES 3 DERNIERS ARTICLES DU BLOG -->
    <RecentBlogSection />

    <!-- 7. SECTION PARTENAIRES B2B & ONG -->
    <PartnersSection />
  </div>
</template>
