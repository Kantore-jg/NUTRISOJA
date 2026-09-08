import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types';
import { blogService } from '../../services/blogService';
import { BlogCard } from '../blog/BlogCard';
import { BlogCardSkeleton } from '../common/LoadingSkeleton';

export const RecentBlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await blogService.getRecent(3);
        setPosts(data);
      } catch (err) {
        console.error('Erreur chargement articles récents', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-[#F5F1E8]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#2E7D32]">
              Actualités & Recettes
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#1C1C1C]">
              Conseils nutrition et vie de notre filière
            </h2>
            <p className="text-sm text-gray-600 max-w-xl">
              Informez-vous sur les bonnes pratiques de sevrage, découvrez des idées de plats savoureux 
              et suivez l'impact de NUTRI SOJA auprès des communautés burundaises.
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#2E7D32] hover:text-[#1B5E20] group self-start md:self-end"
          >
            <span>Voir tous les articles</span>
            <ArrowRight className="w-4 h-4 text-[#D4A017] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
