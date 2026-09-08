import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-gray-100 hover:border-[#2E7D32]/30 transition-all duration-300 flex flex-col h-full">
      {/* COVER IMAGE */}
      <Link to={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-gray-100 block">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#2E7D32] text-white shadow-xs">
            {post.category}
          </span>
        </div>
      </Link>

      {/* BODY */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* META */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#D4A017]" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {post.readTimeMinutes} min de lecture
            </span>
          </div>

          <h3 className="font-heading font-bold text-lg sm:text-xl text-[#1C1C1C] group-hover:text-[#2E7D32] transition-colors leading-snug line-clamp-2">
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>

          <p className="text-xs sm:text-sm text-gray-600 mt-2.5 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* AUTHOR & READ MORE */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src={post.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={post.author.name}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
              referrerPolicy="no-referrer"
            />
            <div className="text-left">
              <p className="text-xs font-semibold text-gray-800 line-clamp-1">{post.author.name}</p>
              <p className="text-[10px] text-gray-500 line-clamp-1">{post.author.role}</p>
            </div>
          </div>

          <Link
            to={`/blog/${post.slug}`}
            className="text-xs font-semibold text-[#2E7D32] hover:text-[#1B5E20] flex items-center gap-1 shrink-0"
            aria-label={`Lire l'article : ${post.title}`}
          >
            <span>Lire</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4A017]" />
          </Link>
        </div>
      </div>
    </article>
  );
};
