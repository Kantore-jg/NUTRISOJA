import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const categoryLabels: Record<string, string> = {
    boissons: 'Boisson végétale',
    farines: 'Farine enrichie',
    derives: 'Dérivé artisanal',
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour NUTRI SOJA, je souhaite commander : ${product.name} (${product.packageSize} - ${product.price.toLocaleString('fr-FR')} BIF). Pouvez-vous me confirmer la disponibilité ?`
  );

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-gray-100 hover:border-[#2E7D32]/30 transition-all duration-300 flex flex-col h-full">
      {/* IMAGE CONTAINER */}
      <Link to={`/produits/${product.slug}`} className="relative aspect-[4/3] overflow-hidden bg-gray-100 block">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#1C1C1C]/80 text-white backdrop-blur-xs">
            {categoryLabels[product.category] || product.category}
          </span>
          {product.isFeatured && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D4A017] text-white shadow-xs">
              Recommandé
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          {product.available ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1 shadow-xs">
              <Check className="w-3 h-3" />
              En stock
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-800 flex items-center gap-1 shadow-xs">
              <AlertCircle className="w-3 h-3" />
              Rupture
            </span>
          )}
        </div>
      </Link>

      {/* BODY */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="text-xs font-semibold text-[#5A5A5A] mb-1">
            Format : {product.packageSize}
          </div>
          <h3 className="font-heading font-bold text-lg text-gray-900 group-hover:text-[#2E7D32] transition-colors line-clamp-1">
            <Link to={`/produits/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* FOOTER / PRICE & ACTIONS */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block leading-none">
              Prix unitaire
            </span>
            <span className="font-heading font-extrabold text-lg sm:text-xl text-[#2E7D32]">
              {product.price.toLocaleString('fr-FR')}{' '}
              <span className="text-xs font-bold text-gray-600">BIF</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={`https://wa.me/25779000000?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
              title="Commander directement via WhatsApp"
              aria-label={`Commander ${product.name} par WhatsApp`}
            >
              <MessageSquare className="w-4 h-4" />
            </a>
            <Link
              to={`/produits/${product.slug}`}
              className="px-3.5 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-semibold hover:bg-[#1B5E20] flex items-center gap-1 transition-all shadow-xs"
            >
              <span>Détails</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4A017]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
