<script setup>
import { Award, Users, Store, Tractor } from 'lucide-vue-next'

const metrics = [
  {
    icon: Award,
    value: '8+',
    label: "Années d'expertise",
    description: 'Pionnier de la transformation du soja au Burundi',
  },
  {
    icon: Tractor,
    value: '350+',
    label: 'Producteurs partenaires',
    description: 'Coopératives agricoles à Kirundo, Ngozi et Gitega',
  },
  {
    icon: Users,
    value: '25 000+',
    label: 'Familles nourries par mois',
    description: 'Particuliers, cantines scolaires et centres de santé',
  },
  {
    icon: Store,
    value: '150+',
    label: 'Points de distribution',
    description: 'Boutiques, supermarchés et kiosques agréés',
  },
]
</script>

<template>
  <section class="bg-[#2E7D32] text-white py-14 relative overflow-hidden">
    <!-- Decorative subtle texture -->
    <div class="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:16px_16px]" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <div v-for="(item, index) in metrics" :key="index" class="flex flex-col items-center text-center space-y-2">
          <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#D4A017] mb-1">
            <component :is="item.icon" class="w-6 h-6" />
          </div>
          <div class="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            {{ item.value }}
          </div>
          <div class="font-heading font-bold text-sm sm:text-base text-amber-200">
            {{ item.label }}
          </div>
          <p class="text-xs text-emerald-100 max-w-[200px] leading-snug">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
