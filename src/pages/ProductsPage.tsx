import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCw, Sparkles } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { productService } from '../services/productService';
import { ProductCard } from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/common/LoadingSkeleton';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const currentCategory = (searchParams.get('cat') as ProductCategory | 'all') || 'all';

  useEffect(() => {
    document.title = 'Nos Produits à Base de Soja | NUTRI SOJA Burundi';
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (err) {
        console.error('Erreur chargement produits', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', category);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filter by category
      if (currentCategory !== 'all' && product.category !== currentCategory) {
        return false;
      }
      // Filter by search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchDesc = product.shortDescription.toLowerCase().includes(q);
        const matchComp = product.composition.some((c) => c.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchComp) return false;
      }
      return true;
    });
  }, [products, currentCategory, searchQuery]);

  const categories = [
    { id: 'all', label: 'Tous les produits', count: products.length },
    { id: 'boissons', label: 'Boissons Végétales', count: products.filter((p) => p.category === 'boissons').length },
    { id: 'farines', label: 'Farines Fortifiées', count: products.filter((p) => p.category === 'farines').length },
    { id: 'derives', label: 'Tofu & Huile Pure', count: products.filter((p) => p.category === 'derives').length },
  ];

  return (
    <div className="py-12 md:py-20 bg-[#F5F1E8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
            <span>Catalogue Officiel NUTRI SOJA</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#1C1C1C]">
            La gamme saine & gourmande du Burundi
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Tous nos produits sont élaborés à partir de graines de soja locales non OGM, 
            garantissant une richesse optimale en protéines complètes, calcium et fer.
          </p>
        </div>

        {/* FILTERS & SEARCH TOOLBAR */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-gray-100 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* CATEGORY TABS */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {categories.map((cat) => {
                const isActive = currentCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#2E7D32] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* SEARCH INPUT */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-gray-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Filter className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-bold text-xl text-gray-900">
              Aucun produit ne correspond à votre recherche
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Essayez de modifier votre mot-clé ou sélectionnez une autre catégorie.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                handleCategoryChange('all');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E7D32] text-white text-sm font-semibold hover:bg-[#1B5E20] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Réinitialiser les filtres</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
