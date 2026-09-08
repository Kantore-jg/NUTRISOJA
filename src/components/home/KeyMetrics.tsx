import React from 'react';
import { Award, Users, Store, Tractor } from 'lucide-react';

export const KeyMetrics: React.FC = () => {
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
  ];

  return (
    <section className="bg-[#2E7D32] text-white py-14 relative overflow-hidden">
      {/* Decorative subtle texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {metrics.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#D4A017] mb-1">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
                  {item.value}
                </div>
                <div className="font-heading font-bold text-sm sm:text-base text-amber-200">
                  {item.label}
                </div>
                <p className="text-xs text-emerald-100 max-w-[200px] leading-snug">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
