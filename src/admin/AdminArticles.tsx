import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  X,
  Eye,
  Calendar,
} from 'lucide-react';
import { BlogPost } from '../types';
import { blogService } from '../services/blogService';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { ImageUpload } from '../components/common/ImageUpload';
import { TableSkeleton } from '../components/common/LoadingSkeleton';

export const AdminArticles: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { success, error } = useToast();

  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogPost | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    category: 'Nutrition & Santé',
    tags: 'nutrition, soja, santé',
    status: 'published' as 'draft' | 'published',
    readTimeMinutes: 4,
    authorName: 'Dr. Chantal Nibizi',
    authorRole: 'Nutritionniste en chef',
  });

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await blogService.getAll('all');
      setArticles(data);
    } catch {
      error('Erreur lors du chargement des articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Gestion des Articles | Admin NUTRI SOJA';
    loadArticles();

    if (searchParams.get('new') === 'true') {
      handleOpenCreate();
      searchParams.delete('new');
      setSearchParams(searchParams);
    }
  }, []);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '### Introduction\n\nLe soja burundais présente des atouts exceptionnels...\n\n### Les Bienfaits\n\n- Richesse en fer et calcium\n- Digestibilité supérieure\n\n### En Pratique\n\nIntégrez-le dans votre alimentation quotidienne.',
      coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
      category: 'Nutrition & Santé',
      tags: 'soja, santé, burundi',
      status: 'published',
      readTimeMinutes: 4,
      authorName: 'Dr. Chantal Nibizi',
      authorRole: 'Directrice Nutrition',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingArticle(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      category: post.category,
      tags: post.tags.join(', '),
      status: post.status,
      readTimeMinutes: post.readTimeMinutes,
      authorName: post.author.name,
      authorRole: post.author.role,
    });
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug && editingArticle ? prev.slug : generateSlug(val),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      error('Le titre et le contenu sont obligatoires.');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || generateSlug(formData.title),
      excerpt: formData.excerpt.trim() || formData.content.slice(0, 150) + '...',
      content: formData.content,
      coverImage: formData.coverImage,
      category: formData.category,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      status: formData.status,
      readTimeMinutes: Number(formData.readTimeMinutes) || 4,
      publishedAt: editingArticle?.publishedAt || new Date().toISOString(),
      author: {
        name: formData.authorName.trim(),
        role: formData.authorRole.trim(),
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      },
    };

    try {
      if (editingArticle) {
        await blogService.update(editingArticle.id, payload);
        success(`Article "${payload.title}" mis à jour.`);
      } else {
        await blogService.create(payload);
        success(`Nouvel article publié avec succès.`);
      }
      setModalOpen(false);
      loadArticles();
    } catch {
      error("Erreur lors de l'enregistrement de l'article.");
    }
  };

  const handleToggleStatus = async (post: BlogPost) => {
    const nextStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      await blogService.update(post.id, { status: nextStatus });
      success(`Statut modifié : ${nextStatus === 'published' ? 'En ligne' : 'Brouillon'}`);
      loadArticles();
    } catch {
      error('Impossible de mettre à jour le statut.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await blogService.delete(deleteId);
      success('Article supprimé avec succès.');
      setDeleteId(null);
      loadArticles();
    } catch {
      error('Erreur de suppression.');
    }
  };

  const filteredArticles = articles.filter((a) => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
            Gestion des Articles de Blog
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Publiez des conseils nutritionnels, recettes et nouvelles locales pour vos lecteurs.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Rédiger un article</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {(['all', 'published', 'draft'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterStatus === st
                  ? 'bg-[#2E7D32] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st === 'all' ? 'Tous les articles' : st === 'published' ? 'Publiés' : 'Brouillons'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
          />
        </div>
      </div>

      {/* ARTICLES TABLE */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="p-4">Article</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4">Auteur</th>
                  <th className="p-4">Date de parution</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      Aucun article trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-14 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-heading font-bold text-gray-900 line-clamp-1 max-w-sm">
                              {post.title}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-1 max-w-sm">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          {post.category}
                        </span>
                      </td>

                      <td className="p-4 text-xs text-gray-600 font-medium">
                        {post.author.name}
                      </td>

                      <td className="p-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(post)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                            post.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                          title="Cliquer pour changer le statut"
                        >
                          {post.status === 'published' ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>En ligne</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              <span>Brouillon</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="p-4 text-right space-x-1">
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block p-2 rounded-lg text-gray-500 hover:text-[#2E7D32] hover:bg-gray-100"
                          title="Aperçu public"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="p-2 rounded-lg text-gray-600 hover:text-[#2E7D32] hover:bg-gray-100"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(post.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT ARTICLE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto my-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-gray-900">
                    {editingArticle ? "Modifier l'article" : 'Rédiger un nouvel article'}
                  </h3>
                  <p className="text-xs text-gray-500">Mettez en valeur les qualités du soja et l'expertise locale</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Titre de l'article *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ex: Le Lait de Soja Face au Lait de Vache : Analyse Nutritionnelle"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32] bg-white"
                  >
                    <option value="Nutrition & Santé">Nutrition & Santé</option>
                    <option value="Recettes & Cuisine">Recettes & Cuisine</option>
                    <option value="Impact Local">Impact Local</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Statut de publication *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32] bg-white"
                  >
                    <option value="published">Publié (En ligne)</option>
                    <option value="draft">Brouillon (Non visible)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Temps de lecture (minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.readTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, readTimeMinutes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
              </div>

              {/* COVER IMAGE UPLOAD */}
              <div>
                <ImageUpload
                  label="Image de couverture de l'article"
                  value={formData.coverImage}
                  onChange={(url) => setFormData({ ...formData, coverImage: url })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Extrait / Chapô d'introduction *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Bref résumé accrocheur affiché sur les cartes et aperçus..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Contenu détaillé de l'article (supporte les titres ### et listes - ) *
                </label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Auteur
                  </label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Mots-clés (séparés par virgule)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="soja, santé, recette"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              {/* MODAL ACTIONS */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-semibold shadow-md"
                >
                  {editingArticle ? "Mettre à jour l'article" : "Publier l'article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Supprimer cet article ?"
        message="Êtes-vous sûr de vouloir supprimer cet article du blog ? Cette action est irréversible."
        confirmLabel="Oui, supprimer"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
