import React from 'react';
import { HeartPulse, Baby, Sprout, Dumbbell } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
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
        'Naturellement dépourvu de lactose et riche en acides gras insaturés (Oméga 3 et 6), il prévient l’hypertension artérielle et soulage durablement les personnes intolérantes aux produits laitiers animaux.',
      tag: 'Santé Cardiaque',
    },
    {
      icon: Baby,
      title: 'Croissance Optimale des Enfants',
      subtitle: 'Lutte contre la malnutrition',
      description:
        'Grâce à notre farine enrichie TotoFort (fer, zinc, vitamines A & B), le soja comble les carences nutritionnelles infantiles dès le sevrage à 6 mois et renforce l’immunité des tout-petits.',
      tag: 'Pédiatrie & Sevrage',
    },
    {
      icon: Sprout,
      title: 'Filière Écologique & Locale',
      subtitle: 'Cultivé sur les collines burundaises',
      description:
        'La plante de soja capte l’azote de l’air et fertilise naturellement nos sols. En choisissant NUTRI SOJA, vous valorisez le travail de 350 petits agriculteurs de Kirundo, Gitega et Ngozi.',
      tag: 'Impact Communautaire',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#2E7D32] bg-[#2E7D32]/10 px-3 py-1 rounded-full">
            Nutrition & Terroir
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#1C1C1C]">
            Pourquoi faire du <span className="text-[#2E7D32]">soja</span> votre allié au quotidien ?
          </h2>
          <p className="text-base text-gray-600">
            Une graine exceptionnelle cultivée au Burundi, transformée selon les plus hauts standards 
            pour nourrir sainement toutes les générations.
          </p>
        </div>

        {/* 4 BENEFIT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group p-7 rounded-2xl bg-[#F5F1E8]/50 hover:bg-[#F5F1E8] border border-transparent hover:border-[#2E7D32]/30 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="w-13 h-13 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#2E7D32] group-hover:bg-[#2E7D32] group-hover:text-white transition-all mb-6">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4A017]">
                    {item.tag}
                  </span>

                  <h3 className="font-heading font-bold text-lg text-[#1C1C1C] mt-1 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#2E7D32]/10 text-xs font-medium text-gray-500">
                  {item.subtitle}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
