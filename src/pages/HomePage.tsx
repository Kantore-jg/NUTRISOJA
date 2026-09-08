import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { productService } from '../services/productService';
import { Hero } from '../components/home/Hero';
import { AdCarousel } from '../components/home/AdCarousel';
import { BenefitsSection } from '../components/home/BenefitsSection';
import { KeyMetrics } from '../components/home/KeyMetrics';
import { RecentBlogSection } from '../components/home/RecentBlogSection';
import { PartnersSection } from '../components/home/PartnersSection';
import { ProductCard } from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/common/LoadingSkeleton';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'NUTRI SOJA - Agroalimentaire & Transformation du Soja au Burundi';

    const loadData = async () => {
      try {
        const featured = await productService.getFeatured();
        setFeaturedProducts(featured.length > 0 ? featured : (await productService.getAll()).slice(0, 4));
      } catch (err) {
        console.error('Erreur chargement produits vedettes', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. AD CAROUSEL (5s Auto slideshow) */}
      <AdCarousel />

      {/* 3. FEATURED PRODUCTS PREVIEW */}
      <section className="py-16 md:py-24 bg-[#F5F1E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#2E7D32]">
                Nos Incontournables
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#1C1C1C]">
                Découvrez nos produits sains et nutritifs
              </h2>
              <p className="text-sm text-gray-600 max-w-xl">
                Du petit-déjeuner au dîner, retrouvez l’onctuosité de nos laits végétaux, 
                la force de notre farine TotoFort et l'authenticité de notre tofu artisanal.
              </p>
            </div>

            <Link
              to="/produits"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#2E7D32] hover:text-[#1B5E20] group self-start sm:self-end"
            >
              <span>Voir tout le catalogue</span>
              <ArrowRight className="w-4 h-4 text-[#D4A017] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. POURQUOI LE SOJA ? (4 BENEFIT CARDS) */}
      <BenefitsSection />

      {/* 5. BANDEAU CHIFFRES CLÉS */}
      <KeyMetrics />

      {/* 6. APERÇU DES 3 DERNIERS ARTICLES DU BLOG */}
      <RecentBlogSection />

      {/* 7. SECTION PARTENAIRES B2B & ONG */}
      <PartnersSection />
    </div>
  );
};
