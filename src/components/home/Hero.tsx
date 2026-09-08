import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-gradient-to-b from-[#F5F1E8] via-[#FAF8F5] to-[#F5F1E8]">
      {/* Subtle organic background shapes */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#2E7D32]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* TEXT CONTENT */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2E7D32]/10 border border-[#2E7D32]/20 text-[#2E7D32] text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-[#D4A017]" />
              <span>Agroalimentaire responsable & solidaire au Burundi</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1C1C1C] leading-[1.15] tracking-tight">
              La force nutritionnelle du <span className="text-[#2E7D32]">soja</span> cultivé avec fierté au Burundi.
            </h1>

            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Des laits végétaux onctueux, des farines enrichies pour nourrissons et du tofu artisanal frais. 
              Une source naturelle de protéines complètes, abordable et saine pour les familles, les écoles et les partenaires nutritionnels.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/produits"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#2E7D32] text-white font-semibold text-base hover:bg-[#1B5E20] shadow-md hover:shadow-lg transition-all"
              >
                <span>Découvrir nos produits</span>
                <ArrowRight className="w-5 h-5 text-[#D4A017]" />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#1C1C1C] font-semibold text-base border border-gray-300 hover:border-[#2E7D32] hover:bg-[#2E7D32]/5 shadow-xs transition-all"
              >
                <span>Nous contacter & Devis ONG</span>
              </Link>
            </div>

            {/* TRUST BADGES */}
            <div className="pt-6 border-t border-[#2E7D32]/15 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#2E7D32]" />
                <span className="font-medium">100% Graines locales</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                <span className="font-medium">Normes de salubrité certifiées</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#2E7D32]" />
                <span className="font-medium">Sans lactose & Sans cholestérol</span>
              </div>
            </div>
          </div>

          {/* PRODUCT VISUAL SHOWCASE */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80"
                  alt="Gamme de produits NUTRI SOJA Burundi"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Overlaid Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">
                        Produit Phare
                      </span>
                      <h4 className="font-heading font-bold text-gray-900 text-sm sm:text-base">
                        Lait de Soja NutriSoy & TotoFort
                      </h4>
                      <p className="text-xs text-gray-500">Disponible dans plus de 150 points de vente</p>
                    </div>
                    <span className="text-sm font-extrabold text-[#D4A017] bg-[#1C1C1C] px-3 py-1.5 rounded-xl">
                      Dès 1 800 BIF
                    </span>
                  </div>
                </div>
              </div>

              {/* FLOATING BENEFIT PILL */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4A017]/20 flex items-center justify-center text-[#D4A017] font-bold text-lg">
                  38%
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Riche en Protéines</p>
                  <p className="text-[11px] text-gray-500">8 acides aminés essentiels</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
