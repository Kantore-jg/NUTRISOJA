import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, MessageCircle, Check, Tag } from 'lucide-react';
import { BlogPost } from '../types';
import { blogService } from '../services/blogService';
import { useToast } from '../context/ToastContext';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { success } = useToast();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const found = await blogService.getBySlug(slug);
        if (found) {
          setPost(found);
          document.title = `${found.title} | Blog NUTRI SOJA`;
          // Fetch related
          const all = await blogService.getAll('published');
          setRelatedPosts(all.filter((p) => p.id !== found.id).slice(0, 2));
        } else {
          setPost(null);
        }
      } catch (err) {
        console.error('Erreur chargement article', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 max-w-4xl mx-auto px-4 animate-pulse space-y-6">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-12 bg-gray-200 rounded w-3/4" />
        <div className="aspect-[16/9] bg-gray-200 rounded-3xl" />
        <div className="space-y-3 pt-6">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto px-4">
        <h2 className="font-heading font-bold text-2xl text-gray-900 mb-3">Article introuvable</h2>
        <p className="text-gray-600 mb-6">L’article que vous cherchez n’existe plus ou a été déplacé.</p>
        <button
          onClick={() => navigate('/blog')}
          className="px-6 py-3 rounded-xl bg-[#2E7D32] text-white font-semibold text-sm hover:bg-[#1B5E20]"
        >
          Retour au blog
        </button>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareTitle = post.title;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    success('Lien copié dans le presse-papier !');
    setTimeout(() => setCopied(false), 3000);
  };

  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className="py-12 md:py-20 bg-[#F5F1E8] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* BACK LINK */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#2E7D32] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à tous les articles</span>
          </Link>
        </div>

        {/* HEADER */}
        <header className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#2E7D32] text-white">
              {post.category}
            </span>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#D4A017]" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {post.readTimeMinutes} min de lecture
              </span>
            </div>
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-5xl text-[#1C1C1C] leading-[1.2]">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium">
            {post.excerpt}
          </p>

          {/* AUTHOR & SOCIAL SHARE BAR */}
          <div className="pt-6 border-t border-b border-[#2E7D32]/15 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="font-heading font-bold text-sm text-gray-900">{post.author.name}</p>
                <p className="text-xs text-gray-500">{post.author.role}</p>
              </div>
            </div>

            {/* SHARE BUTTONS */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 mr-1 flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5" />
                Partager :
              </span>
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors"
                title="Partager sur WhatsApp"
                aria-label="Partager sur WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                title="Copier le lien"
                aria-label="Copier le lien"
              >
                {copied ? <Check className="w-4 h-4 text-[#2E7D32]" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* COVER IMAGE */}
        <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-md mb-10 bg-gray-100 border border-black/5">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* RICH ARTICLE BODY */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-gray-100">
          <div className="prose prose-lg max-w-none text-gray-800 space-y-6 leading-relaxed">
            {post.content.split('\n\n').map((block, idx) => {
              if (block.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-heading font-bold text-xl sm:text-2xl text-gray-900 mt-8 mb-3 text-[#2E7D32]">
                    {block.replace('### ', '')}
                  </h3>
                );
              }
              if (block.startsWith('1. ') || block.startsWith('2. ') || block.startsWith('3. ')) {
                return (
                  <div key={idx} className="pl-4 border-l-2 border-[#D4A017] my-3 text-sm sm:text-base text-gray-700">
                    {block}
                  </div>
                );
              }
              if (block.startsWith('- ')) {
                const items = block.split('\n');
                return (
                  <ul key={idx} className="list-disc list-inside space-y-1 my-3 text-sm sm:text-base text-gray-700">
                    {items.map((item, i) => (
                      <li key={i}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  {block}
                </p>
              );
            })}
          </div>

          {/* TAGS */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 flex items-center gap-1 mr-2">
                <Tag className="w-3.5 h-3.5 text-[#D4A017]" />
                Mots-clés :
              </span>
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-[#F5F1E8] text-[#1C1C1C] text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* RELATED ARTICLES */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-200">
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-gray-900 mb-6">
              Articles recommandés
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((p) => (
                <Link
                  key={p.id}
                  to={`/blog/${p.slug}`}
                  className="group bg-white rounded-2xl p-5 shadow-xs border border-gray-100 hover:border-[#2E7D32]/30 flex items-center gap-4 transition-all"
                >
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[11px] font-bold text-[#2E7D32] uppercase">{p.category}</span>
                    <h4 className="font-heading font-bold text-sm text-gray-900 group-hover:text-[#2E7D32] line-clamp-2 mt-1">
                      {p.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
