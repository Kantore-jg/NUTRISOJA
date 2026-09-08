import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Calendar,
} from 'lucide-react';
import { AdBanner } from '../types';
import { adService } from '../services/adService';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { ImageUpload } from '../components/common/ImageUpload';
import { TableSkeleton } from '../components/common/LoadingSkeleton';

export const AdminAds: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { success, error } = useToast();

  const [ads, setAds] = useState<AdBanner[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdBanner | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    linkUrl: '/produits',
    ctaText: 'Découvrir la gamme',
    displayOrder: 1,
    isActive: true,
    startDate: '',
    endDate: '',
  });

  const loadAds = async () => {
    setLoading(true);
    try {
      const data = await adService.getAll();
      setAds(data);
    } catch {
      error('Erreur lors du chargement des publicités.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Gestion des Publicités & Carrousel | Admin NUTRI SOJA';
    loadAds();

    if (searchParams.get('new') === 'true') {
      handleOpenCreate();
      searchParams.delete('new');
      setSearchParams(searchParams);
    }
  }, []);

  const handleOpenCreate = () => {
    setEditingAd(null);
    setFormData({
      title: '',
      subtitle: '',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
      linkUrl: '/produits',
      ctaText: 'Découvrir la gamme',
      displayOrder: ads.length + 1,
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (ad: AdBanner) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      subtitle: ad.subtitle || '',
      image: ad.image,
      linkUrl: ad.linkUrl || '/produits',
      ctaText: ad.ctaText || 'Découvrir',
      displayOrder: ad.displayOrder,
      isActive: ad.isActive,
      startDate: ad.startDate ? ad.startDate.split('T')[0] : '',
      endDate: ad.endDate ? ad.endDate.split('T')[0] : '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image.trim()) {
      error('Le titre et l’image de la bannière sont requis.');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      image: formData.image.trim(),
      linkUrl: formData.linkUrl.trim(),
      ctaText: formData.ctaText.trim() || 'En savoir plus',
      displayOrder: Number(formData.displayOrder) || 1,
      isActive: formData.isActive,
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
    };

    try {
      if (editingAd) {
        await adService.update(editingAd.id, payload);
        success('Publicité mise à jour avec succès.');
      } else {
        await adService.create(payload);
        success('Nouvelle bannière publicitaire créée.');
      }
      setModalOpen(false);
      loadAds();
    } catch {
      error("Erreur lors de l'enregistrement.");
    }
  };

  const handleToggleActive = async (ad: AdBanner) => {
    try {
      await adService.update(ad.id, { isActive: !ad.isActive });
      success(`Bannière ${!ad.isActive ? 'activée' : 'désactivée'}.`);
      loadAds();
    } catch {
      error('Erreur lors du changement de statut.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await adService.delete(deleteId);
      success('Bannière supprimée.');
      setDeleteId(null);
      loadAds();
    } catch {
      error('Erreur de suppression.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
            Bannières & Publicités Carrousel
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gérez les promotions temporaires et offres spéciales affichées sur la page d'accueil (défilement automatique 5s).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle bannière</span>
        </button>
      </div>

      {/* ADS TABLE */}
      {loading ? (
        <TableSkeleton rows={3} />
      ) : (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="p-4">Ordre</th>
                  <th className="p-4">Bannière & Visuel</th>
                  <th className="p-4">Lien & Bouton CTA</th>
                  <th className="p-4">Période de validité</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {ads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      Aucune bannière publicitaire enregistrée.
                    </td>
                  </tr>
                ) : (
                  ads.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-4">
                        <span className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 font-bold flex items-center justify-center text-xs">
                          {ad.displayOrder}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={ad.image}
                            alt={ad.title}
                            className="w-24 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-heading font-bold text-gray-900">{ad.title}</p>
                            {ad.subtitle && <p className="text-xs text-gray-500">{ad.subtitle}</p>}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold text-gray-800 block">
                            {ad.ctaText}
                          </span>
                          <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {ad.linkUrl || 'Aucun'}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-xs text-gray-500">
                        {ad.startDate || ad.endDate ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>
                              {ad.startDate ? new Date(ad.startDate).toLocaleDateString('fr-FR') : 'Début'}
                              {' → '}
                              {ad.endDate ? new Date(ad.endDate).toLocaleDateString('fr-FR') : 'Indéfini'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Permanente</span>
                        )}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleActive(ad)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                            ad.isActive
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {ad.isActive ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Actif</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Inactif</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEdit(ad)}
                          className="p-2 rounded-lg text-gray-600 hover:text-[#2E7D32] hover:bg-gray-100"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(ad.id)}
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

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto my-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-gray-900">
                    {editingAd ? 'Modifier la publicité' : 'Créer une publicité'}
                  </h3>
                  <p className="text-xs text-gray-500">Affichez vos promotions sur le carrousel d'accueil</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Titre principal de la campagne *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: -15% sur la farine TotoFort ce mois-ci"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Sous-titre / Détail de l'offre
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Ex: Disponible dans tous nos points de vente à Bujumbura et Gitega"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              {/* IMAGE UPLOAD */}
              <div>
                <ImageUpload
                  label="Image de fond de la bannière (recommandé 1200x500px)"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Lien redirection
                  </label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="/produits ou /contact"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Texte du bouton CTA
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="Découvrir la gamme"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Ordre d'affichage (1, 2, 3...)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Date de début (optionnel)
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Date de fin (optionnel)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32]"
                  />
                  <span>Activer immédiatement dans le carrousel d'accueil</span>
                </label>
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
                  {editingAd ? 'Mettre à jour' : 'Créer la bannière'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Supprimer cette publicité ?"
        message="Êtes-vous certain de vouloir supprimer cette bannière du carrousel ?"
        confirmLabel="Oui, supprimer"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
