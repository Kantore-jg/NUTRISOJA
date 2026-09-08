import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { productService } from '../services/productService';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { ImageUpload } from '../components/common/ImageUpload';
import { TableSkeleton } from '../components/common/LoadingSkeleton';

export const AdminProducts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { success, error } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'boissons' as ProductCategory,
    shortDescription: '',
    fullDescription: '',
    price: 2000,
    packageSize: 'Bouteille 500ml',
    images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80'],
    composition: 'Graines de soja burundaises, eau pure',
    calories: 50,
    proteins: 3.5,
    lipids: 2.0,
    carbohydrates: 4.0,
    calcium: 120,
    iron: 1.5,
    usageTips: 'Consommer bien frais.',
    available: true,
    isFeatured: false,
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch {
      error('Erreur de chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Gestion des Produits | Admin NUTRI SOJA';
    loadProducts();

    if (searchParams.get('new') === 'true') {
      handleOpenCreate();
      searchParams.delete('new');
      setSearchParams(searchParams);
    }
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      category: 'boissons',
      shortDescription: '',
      fullDescription: '',
      price: 2500,
      packageSize: 'Bouteille 500ml',
      images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80'],
      composition: 'Graines de soja sélectionnées du Burundi, eau filtrée',
      calories: 55,
      proteins: 4.0,
      lipids: 2.2,
      carbohydrates: 4.5,
      calcium: 120,
      iron: 1.4,
      usageTips: 'À conserver au frais.',
      available: true,
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      slug: prod.slug,
      category: prod.category,
      shortDescription: prod.shortDescription,
      fullDescription: prod.fullDescription,
      price: prod.price,
      packageSize: prod.packageSize,
      images: prod.images.length > 0 ? prod.images : [''],
      composition: prod.composition.join(', '),
      calories: prod.nutritionalValues.calories || 0,
      proteins: prod.nutritionalValues.proteins || 0,
      lipids: prod.nutritionalValues.lipids || 0,
      carbohydrates: prod.nutritionalValues.carbohydrates || 0,
      calcium: prod.nutritionalValues.calcium || 0,
      iron: prod.nutritionalValues.iron || 0,
      usageTips: prod.usageTips.join(' | '),
      available: prod.available,
      isFeatured: !!prod.isFeatured,
    });
    setModalOpen(true);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug && editingProduct ? prev.slug : generateSlug(val),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      error('Le nom du produit est obligatoire.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim() || generateSlug(formData.name),
      category: formData.category,
      shortDescription: formData.shortDescription.trim(),
      fullDescription: formData.fullDescription.trim() || formData.shortDescription.trim(),
      price: Number(formData.price) || 0,
      packageSize: formData.packageSize.trim(),
      images: formData.images.filter((img) => img.trim().length > 0),
      composition: formData.composition
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      nutritionalValues: {
        calories: Number(formData.calories) || 0,
        proteins: Number(formData.proteins) || 0,
        lipids: Number(formData.lipids) || 0,
        carbohydrates: Number(formData.carbohydrates) || 0,
        calcium: Number(formData.calcium) || 0,
        iron: Number(formData.iron) || 0,
      },
      usageTips: formData.usageTips
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean),
      available: formData.available,
      isFeatured: formData.isFeatured,
    };

    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, payload);
        success(`Produit "${payload.name}" mis à jour avec succès.`);
      } else {
        await productService.create(payload);
        success(`Produit "${payload.name}" ajouté avec succès.`);
      }
      setModalOpen(false);
      loadProducts();
    } catch {
      error("Une erreur s'est produite lors de l'enregistrement.");
    }
  };

  const handleToggleAvailability = async (prod: Product) => {
    try {
      await productService.update(prod.id, { available: !prod.available });
      success(`Disponibilité modifiée : ${!prod.available ? 'En stock' : 'Rupture'}`);
      loadProducts();
    } catch {
      error('Impossible de modifier le statut.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await productService.delete(deleteId);
      success('Produit supprimé avec succès.');
      setDeleteId(null);
      loadProducts();
    } catch {
      error('Erreur lors de la suppression.');
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
            Gestion des Produits
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Ajoutez, modifiez les prix et gérez la disponibilité de la gamme de soja.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau produit</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {['all', 'boissons', 'farines', 'derives'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterCategory === cat
                  ? 'bg-[#2E7D32] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'Tous les produits' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
          />
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="p-4">Produit</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4">Conditionnement</th>
                  <th className="p-4">Prix (BIF)</th>
                  <th className="p-4">Statut Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 text-sm">
                      Aucun produit trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images[0] || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=150&q=80'}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-heading font-bold text-gray-900 flex items-center gap-1.5">
                              <span>{prod.name}</span>
                              {prod.isFeatured && (
                                <span className="p-0.5 rounded text-amber-500" title="Mis en avant">
                                  <Sparkles className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">{prod.shortDescription}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize bg-gray-100 text-gray-700">
                          {prod.category}
                        </span>
                      </td>

                      <td className="p-4 text-xs font-medium text-gray-600">
                        {prod.packageSize}
                      </td>

                      <td className="p-4">
                        <span className="font-heading font-bold text-[#2E7D32]">
                          {prod.price.toLocaleString('fr-FR')} BIF
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleAvailability(prod)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                            prod.available
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                          title="Cliquer pour basculer la disponibilité"
                        >
                          {prod.available ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>En stock</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Rupture</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-2 rounded-lg text-gray-600 hover:text-[#2E7D32] hover:bg-gray-100"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(prod.id)}
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

      {/* CREATE / EDIT PRODUCT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto my-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-gray-900">
                    {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
                  </h3>
                  <p className="text-xs text-gray-500">Remplissez les informations techniques et nutritionnelles</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: Lait de Soja Frais"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32] bg-white"
                  >
                    <option value="boissons">Boissons Végétales</option>
                    <option value="farines">Farines Fortifiées</option>
                    <option value="derives">Dérivés (Tofu & Huile)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Prix de vente (en Francs Burundais - BIF) *
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    step={100}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Conditionnement / Format *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.packageSize}
                    onChange={(e) => setFormData({ ...formData, packageSize: e.target.value })}
                    placeholder="Ex: Bouteille 500 ml, Sachet 1 kg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD WITH PREVIEW */}
              <div>
                <ImageUpload
                  label="Photo principale du produit"
                  value={formData.images[0] || ''}
                  onChange={(url) => setFormData({ ...formData, images: [url] })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Description courte (pour carte produit) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Ex: Boisson végétale onctueuse 100% naturelle..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Description complète & conseils
                </label>
                <textarea
                  rows={3}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Détails du procédé de transformation, origine des graines..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Ingrédients (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={formData.composition}
                    onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                    placeholder="Graines de soja non OGM, eau, sel..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Conseils culinaires (séparés par le symbole | )
                  </label>
                  <input
                    type="text"
                    value={formData.usageTips}
                    onChange={(e) => setFormData({ ...formData, usageTips: e.target.value })}
                    placeholder="Servir frais | Idéal en smoothies | Agiter avant emploi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
              </div>

              {/* NUTRITION NUMBERS */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-700">
                  Valeurs nutritionnelles pour 100g / 100ml
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-500">Énergie (kcal)</label>
                    <input
                      type="number"
                      value={formData.calories}
                      onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-gray-300 text-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500">Protéines (g)</label>
                    <input
                      type="number"
                      step={0.1}
                      value={formData.proteins}
                      onChange={(e) => setFormData({ ...formData, proteins: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-gray-300 text-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500">Lipides (g)</label>
                    <input
                      type="number"
                      step={0.1}
                      value={formData.lipids}
                      onChange={(e) => setFormData({ ...formData, lipids: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-gray-300 text-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500">Glucides (g)</label>
                    <input
                      type="number"
                      step={0.1}
                      value={formData.carbohydrates}
                      onChange={(e) => setFormData({ ...formData, carbohydrates: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-gray-300 text-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500">Calcium (mg)</label>
                    <input
                      type="number"
                      value={formData.calcium}
                      onChange={(e) => setFormData({ ...formData, calcium: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-gray-300 text-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500">Fer (mg)</label>
                    <input
                      type="number"
                      step={0.1}
                      value={formData.iron}
                      onChange={(e) => setFormData({ ...formData, iron: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-gray-300 text-xs text-center"
                    />
                  </div>
                </div>
              </div>

              {/* TOGGLES */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32]"
                  />
                  <span>En stock (disponible à la commande)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32]"
                  />
                  <span>Mettre en avant sur la page d'accueil</span>
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
                  {editingProduct ? 'Mettre à jour le produit' : 'Enregistrer le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Supprimer ce produit ?"
        message="Êtes-vous certain de vouloir supprimer ce produit du catalogue ? Cette action est irréversible."
        confirmLabel="Oui, supprimer définitivement"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
