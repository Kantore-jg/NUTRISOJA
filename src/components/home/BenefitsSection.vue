<script setup>
import { HeartPulse, Baby, Sprout, Dumbbell } from 'lucide-vue-next'

const benefits = [
  {
    icon: Dumbbell,
    title: 'Protéines Complètes de Haute Qualité',
    subtitle: 'Comparable aux protéines animales',
    description:
      'Le soja est la seule légumineuse réunissant les 8 acides aminés essentiels. Avec près de 38% de protéines, il soutient le développement musculaire et la vitalité sans alourdir la digestion.',
    tag: 'Force & Énergie',
  },
  {
    icon: HeartPulse,
    title: 'Sans Lactose & Zéro Cholestérol',
    subtitle: 'Protection cardiovasculaire prouvée',
    description:
      'Naturellement dépourvu de lactose et riche en acides gras insaturés (Oméga 3 et 6), il prévient l\u2019hypertension artérielle et soulage durablement les personnes intolérantes aux produits laitiers animaux.',
    tag: 'Santé Cardiaque',
  },
  {
    icon: Baby,
    title: 'Croissance Optimale des Enfants',
    subtitle: 'Lutte contre la malnutrition',
    description:
      'Grâce à notre farine enrichie TotoFort (fer, zinc, vitamines A & B), le soja comble les carences nutritionnelles infantiles dès le sevrage à 6 mois et renforce l\u2019immunité des tout-petits.',
    tag: 'Pédiatrie & Sevrage',
  },
  {
    icon: Sprout,
    title: 'Filière Écologique & Locale',
    subtitle: 'Cultivé sur les collines burundaises',
    description:
      'La plante de soja capte l\u2019azote de l\u2019air et fertilise naturellement nos sols. En choisissant NUTRI SOJA Burundi, vous valorisez le travail de 350 petits agriculteurs de Kirundo, Gitega et Ngozi.',
    tag: 'Impact Communautaire',
  },
]
</script>

<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- SECTION HEADER -->
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span class="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#2E7D32] bg-[#2E7D32]/10 px-3 py-1 rounded-full">
          Nutrition &amp; Terroir
        </span>
        <h2 class="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#1C1C1C]">
          Pourquoi faire du <span class="text-[#2E7D32]">soja</span> votre allié au quotidien ?
        </h2>
        <p class="text-base text-gray-600">
          Une graine exceptionnelle cultivée au Burundi, transformée selon les plus hauts standards
          pour nourrir sainement toutes les générations.
        </p>
      </div>

      <!-- 4 BENEFIT CARDS -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="(item, index) in benefits"
          :key="index"
          class="group p-7 rounded-2xl bg-[#F5F1E8]/50 hover:bg-[#F5F1E8] border border-transparent hover:border-[#2E7D32]/30 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-md"
        >
          <div>
            <div class="w-13 h-13 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#2E7D32] group-hover:bg-[#2E7D32] group-hover:text-white transition-all mb-6">
              <component :is="item.icon" class="w-6 h-6" />
            </div>

            <span class="text-[11px] font-bold uppercase tracking-wider text-[#D4A017]">
              {{ item.tag }}
            </span>

            <h3 class="font-heading font-bold text-lg text-[#1C1C1C] mt-1 mb-2">
              {{ item.title }}
            </h3>

            <p class="text-sm text-gray-600 leading-relaxed">
              {{ item.description }}
            </p>
          </div>

          <div class="pt-6 mt-6 border-t border-[#2E7D32]/10 text-xs font-medium text-gray-500">
            {{ item.subtitle }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
