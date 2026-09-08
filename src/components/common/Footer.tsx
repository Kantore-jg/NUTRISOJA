import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, MapPin, Phone, Mail, Clock, ArrowRight, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1C1C1C] text-[#F5F1E8] pt-16 pb-12 border-t-4 border-[#2E7D32]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* COLONNE 1: ENTREPRISE */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white">
                <Leaf className="w-5 h-5 text-[#D4A017]" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-white">
                NUTRI <span className="text-[#D4A017]">SOJA</span>
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Entreprise agroalimentaire burundaise pionnière dans la transformation et la valorisation du soja cultivé localement. Nous nourrissons le Burundi avec des produits sains, riches en protéines et accessibles à tous.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#2E7D32]/30 text-emerald-300 border border-[#2E7D32]/50">
                100% Fabriqué au Burundi
              </span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Non OGM
              </span>
            </div>
          </div>

          {/* COLONNE 2: PRODUITS */}
          <div>
            <h4 className="font-heading font-semibold text-base text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Nos Gammes
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/produits?cat=boissons" className="text-gray-300 hover:text-[#D4A017] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Laits de soja (Nature & Vanille)
                </Link>
              </li>
              <li>
                <Link to="/produits?cat=farines" className="text-gray-300 hover:text-[#D4A017] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Farines fortifiées TotoFort
                </Link>
              </li>
              <li>
                <Link to="/produits?cat=farines" className="text-gray-300 hover:text-[#D4A017] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Farine pâtissière et boulangère
                </Link>
              </li>
              <li>
                <Link to="/produits?cat=derives" className="text-gray-300 hover:text-[#D4A017] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Tofu artisanal frais & fumé
                </Link>
              </li>
              <li>
                <Link to="/produits?cat=derives" className="text-gray-300 hover:text-[#D4A017] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Huile pure de première pression
                </Link>
              </li>
            </ul>
          </div>

          {/* COLONNE 3: LIENS RAPIDES */}
          <div>
            <h4 className="font-heading font-semibold text-base text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/a-propos" className="text-gray-300 hover:text-[#D4A017] transition-colors">
                  Notre Histoire & Engagements
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-[#D4A017] transition-colors">
                  Conseils Nutrition & Recettes
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-[#D4A017] transition-colors">
                  Partenariats ONG & Écoles
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-[#D4A017] transition-colors">
                  Devenir Revendeur Agréé
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-amber-400/90 hover:text-amber-300 transition-colors flex items-center gap-1.5 pt-1">
                  <Shield className="w-4 h-4" />
                  Espace d'administration
                </Link>
              </li>
            </ul>
          </div>

          {/* COLONNE 4: CONTACT & COORDONNÉES */}
          <div>
            <h4 className="font-heading font-semibold text-base text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Siège & Ateliers
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                <span>Zone Industrielle, Avenue des Usines, Bujumbura, Burundi</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4A017] shrink-0" />
                <span>+257 22 25 78 90 / +257 79 98 00 00</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4A017] shrink-0" />
                <span>contact@nutrisoja.bi</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#D4A017] shrink-0" />
                <span>Lun - Ven : 07h30 - 17h00 | Sam : 08h00 - 13h00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} NUTRI SOJA S.A. Tous droits réservés. Burundi.</p>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-white transition-colors">
              Mentions Légales & Qualité
            </Link>
            <Link to="/admin" className="hover:text-[#D4A017] transition-colors flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Accès Back-office
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
