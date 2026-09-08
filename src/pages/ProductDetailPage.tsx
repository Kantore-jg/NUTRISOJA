import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Check, ShieldCheck, Sparkles, ChefHat, Heart, Share2 } from 'lucide-react';
import { Product } from '../types';
import { productService } from '../services/productService';
import { ProductCard } from '../components/products/ProductCard';
import { useToast } from '../context/ToastContext';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { success } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const found = await productService.getBySlug(slug);
        if (found) {
          setProduct(found);
          document.title = `${found.name} | NUTRI SOJA Burundi`;
          // Fetch related
          const all = await productService.getAll();
          const related = all
            .filter((p) => p.category === found.category && p.id !== found.id)
            .slice(0, 3);
          setRelatedProducts(related);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Erreur chargement détail produit', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6 aspect-square bg-gray-200 rounded-3xl" />
          <div className="lg:col-span-6 space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-24 bg-gray-200 rounded w-full" />
            <div className="h-12 bg-gray-200 rounded-xl w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto px-4">
        <h2 className="font-heading font-bold text-2xl text-gray-900 mb-3">Produit non trouvé</h2>
        <p className="text-gray-600 mb-6">Le produit que vous recherchez n’existe pas ou a été retiré de la vente.</p>
        <button
          onClick={() => navigate('/produits')}
          className="px-6 py-3 rounded-xl bg-[#2E7D32] text-white font-semibold text-sm hover:bg-[#1B5E20]"
        >
          Retour au catalogue des produits
        </button>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Bonjour NUTRI SOJA Burundi, je souhaite passer commande pour :
- Produit : ${product.name}
- Format : ${product.packageSize}
- Prix indicatif : ${product.price.toLocaleString('fr-FR')} BIF
Merci de me confirmer la livraison à mon adresse.`
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    success('Lien du produit copié dans le presse-papier !');
  };

  return (
    <div className="py-10 md:py-16 bg-[#F5F1E8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* BREADCRUMB / BACK */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/produits"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#2E7D32] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux produits</span>
          </Link>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Partager ce produit</span>
          </button>
        </div>

        {/* MAIN PRODUCT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
          {/* LEFT: GALLERY */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 relative group">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {product.isFeatured && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-extrabold bg-[#D4A017] text-white shadow-md">
                  Recommandé par nos nutritionnistes
                </div>
              )}
            </div>

            {/* THUMBNAILS */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-[#2E7D32] ring-2 ring-[#2E7D32]/20' : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Vignette ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS & ACTIONS */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2E7D32]/10 text-[#2E7D32]">
                  {product.category === 'boissons' ? 'Boisson Végétale' : product.category === 'farines' ? 'Farine Fortifiée' : 'Dérivé Artisanal'}
                </span>
                {product.available ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    Disponible en stock
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                    Rupture momentanée
                  </span>
                )}
              </div>

              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-gray-900 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3">
                <span className="font-heading font-black text-3xl text-[#2E7D32]">
                  {product.price.toLocaleString('fr-FR')}{' '}
                  <span className="text-base font-bold text-gray-700">Francs Burundais (BIF)</span>
                </span>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                  {product.packageSize}
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed text-sm sm:text-base border-t border-b border-gray-100 py-4">
                {product.fullDescription || product.shortDescription}
              </p>

              {/* HIGHLIGHTS */}
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-700 pt-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                  <span>Soja 100% cultivé au Burundi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4A017]" />
                  <span>Sans conservateurs artificiels</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2E7D32]" />
                  <span>Zéro lactose & zéro cholestérol</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Riche en protéines complètes</span>
                </div>
              </div>
            </div>

            {/* ORDER VIA WHATSAPP CTA */}
            <div className="pt-6 border-t border-gray-100 space-y-3">
              <a
                href={`https://wa.me/25779000000?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-base shadow-lg shadow-[#2E7D32]/25 hover:shadow-xl transition-all"
              >
                <MessageSquare className="w-5 h-5 text-[#D4A017]" />
                <span>Commander via WhatsApp</span>
              </a>

              <p className="text-center text-xs text-gray-500">
                Commande directe avec notre service client à Bujumbura. Livraison rapide à domicile ou en point relais.
              </p>
            </div>
          </div>
        </div>

        {/* TABS / SECTIONS: COMPOSITION, VALEURS NUTRITIONNELLES, CONSEILS D'UTILISATION */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* COMPOSITION */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100">
            <div className="flex items-center gap-3 mb-4 text-[#2E7D32]">
              <Sparkles className="w-5 h-5 text-[#D4A017]" />
              <h3 className="font-heading font-bold text-lg text-gray-900">Composition & Ingrédients</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700 divide-y divide-gray-100">
              {product.composition.map((item, idx) => (
                <li key={idx} className="pt-2 first:pt-0 flex items-start gap-2">
                  <span className="text-[#2E7D32] font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* VALEURS NUTRITIONNELLES */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100">
            <div className="flex items-center gap-3 mb-4 text-[#2E7D32]">
              <Heart className="w-5 h-5 text-rose-500" />
              <h3 className="font-heading font-bold text-lg text-gray-900">Valeurs Nutritionnelles</h3>
            </div>
            <div className="text-xs text-gray-500 mb-3">Pour 100g / 100ml de produit</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">Valeur énergétique</span>
                <span className="font-bold text-gray-900">{product.nutritionalValues.calories} kcal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">Protéines végétales</span>
                <span className="font-bold text-[#2E7D32]">{product.nutritionalValues.proteins} g</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">Lipides (bons acides gras)</span>
                <span className="font-medium text-gray-900">{product.nutritionalValues.lipids} g</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">Glucides</span>
                <span className="font-medium text-gray-900">{product.nutritionalValues.carbohydrates} g</span>
              </div>
              {product.nutritionalValues.calcium && (
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Calcium</span>
                  <span className="font-medium text-gray-900">{product.nutritionalValues.calcium} mg</span>
                </div>
              )}
              {product.nutritionalValues.iron && (
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Fer végétal</span>
                  <span className="font-medium text-gray-900">{product.nutritionalValues.iron} mg</span>
                </div>
              )}
            </div>
          </div>

          {/* CONSEILS D'UTILISATION */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100">
            <div className="flex items-center gap-3 mb-4 text-[#2E7D32]">
              <ChefHat className="w-5 h-5 text-[#D4A017]" />
              <h3 className="font-heading font-bold text-lg text-gray-900">Conseils d'utilisation</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              {product.usageTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="leading-snug">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-gray-900 mb-8">
              Produits similaires recommandés
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
