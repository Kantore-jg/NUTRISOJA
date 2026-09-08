import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, HeartHandshake, CheckCircle2, MessageSquare } from 'lucide-react';

export const PartnersSection: React.FC = () => {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#1C1C1C] via-[#242A24] to-[#1C1C1C] p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2E7D32]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E7D32]/30 border border-[#2E7D32]/50 text-emerald-300 text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5 text-[#D4A017]" />
                <span>B2B, ONG & Programmes Nutritionnels</span>
              </div>

              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight">
                Approvisionnez vos cantines, centres de santé ou rayons avec du soja garanti de première qualité.
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                NUTRI SOJA accompagne les institutions humanitaires, les hôpitaux de district, les écoles et les distributeurs à travers tout le Burundi avec des volumes adaptés et des tarifs institutionnels avantageux.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-sm text-gray-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D4A017] shrink-0" />
                  <span>Conditionnements industriels (25kg & 50kg)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D4A017] shrink-0" />
                  <span>Contrats de livraison régulière à Bujumbura et en province</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D4A017] shrink-0" />
                  <span>Analyses de conformité & bulletins nutritionnels fournis</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D4A017] shrink-0" />
                  <span>Formulation enrichie sur cahier des charges ONG</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white">
                  <HeartHandshake className="w-5 h-5 text-[#D4A017]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-base">Service Institutionnel</h4>
                  <p className="text-xs text-gray-400">Réponse sous 24h ouvrées</p>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                Contactez directement notre direction commerciale pour recevoir nos échantillons et la grille tarifaire pour gros volumes.
              </p>

              <div className="space-y-2.5 pt-2">
                <Link
                  to="/contact"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold text-sm shadow-md transition-all"
                >
                  <span>Demander un devis officiel</span>
                </Link>
                <a
                  href="https://wa.me/25779000000?text=Bonjour%20NUTRI%20SOJA,%20je%20représente%20une%20institution/ONG%20et%20souhaite%20un%20devis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#D4A017]" />
                  <span>Échanger sur WhatsApp Pro</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
