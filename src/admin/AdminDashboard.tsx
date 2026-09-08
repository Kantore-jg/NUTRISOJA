import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FileText,
  Megaphone,
  Inbox,
  Plus,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { DashboardStats, ContactMessage } from '../types';
import { productService } from '../services/productService';
import { blogService } from '../services/blogService';
import { adService } from '../services/adService';
import { messageService } from '../services/messageService';
import { storageService } from '../services/storageService';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const AdminDashboard: React.FC = () => {
  const { success, error } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    productsCount: 0,
    availableProductsCount: 0,
    articlesCount: 0,
    publishedArticlesCount: 0,
    adsCount: 0,
    activeAdsCount: 0,
    unreadMessagesCount: 0,
    totalMessagesCount: 0,
  });

  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [products, articles, ads, messages] = await Promise.all([
        productService.getAll(),
        blogService.getAll('all'),
        adService.getAll(),
        messageService.getAll(),
      ]);

      setStats({
        productsCount: products.length,
        availableProductsCount: products.filter((p) => p.available).length,
        articlesCount: articles.length,
        publishedArticlesCount: articles.filter((a) => a.status === 'published').length,
        adsCount: ads.length,
        activeAdsCount: ads.filter((a) => a.isActive).length,
        unreadMessagesCount: messages.filter((m) => !m.isRead).length,
        totalMessagesCount: messages.length,
      });

      setRecentMessages(messages.slice(0, 5));
    } catch (err) {
      console.error(err);
      error('Impossible de charger les statistiques.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Tableau de bord | Admin NUTRI SOJA';
    fetchDashboardData();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await messageService.markAsRead(id, true);
      success('Message marqué comme lu.');
      fetchDashboardData();
    } catch {
      error('Erreur de mise à jour.');
    }
  };

  const handleResetDemoData = async () => {
    try {
      await storageService.resetAllToDefaults();
      success('Données de démonstration réinitialisées avec succès !');
      setResetModalOpen(false);
      fetchDashboardData();
    } catch {
      error('Erreur lors de la réinitialisation.');
    }
  };

  const statCards = [
    {
      title: 'Produits au Catalogue',
      value: stats.productsCount,
      sub: `${stats.availableProductsCount} en stock disponible`,
      icon: Package,
      color: 'bg-emerald-500',
      link: '/admin/produits',
      cta: 'Gérer les produits',
    },
    {
      title: 'Articles du Blog',
      value: stats.articlesCount,
      sub: `${stats.publishedArticlesCount} articles publiés en ligne`,
      icon: FileText,
      color: 'bg-blue-500',
      link: '/admin/articles',
      cta: 'Gérer les articles',
    },
    {
      title: 'Campagnes & Publicités',
      value: stats.adsCount,
      sub: `${stats.activeAdsCount} actives sur le carrousel`,
      icon: Megaphone,
      color: 'bg-amber-500',
      link: '/admin/publicites',
      cta: 'Gérer le carrousel',
    },
    {
      title: 'Messages de Contact',
      value: stats.unreadMessagesCount,
      sub: `${stats.totalMessagesCount} messages au total`,
      icon: Inbox,
      color: stats.unreadMessagesCount > 0 ? 'bg-red-500' : 'bg-gray-500',
      link: '/admin/messages',
      cta: 'Ouvrir la boîte',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
            Tableau de Bord
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Supervisez le contenu du site vitrine et le traitement des commandes de NUTRI SOJA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setResetModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
            title="Réinitialiser les données aux valeurs initiales"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Réinitialiser la Démo</span>
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex flex-col justify-between hover:border-gray-200 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {card.title}
                  </span>
                  <div className={`w-9 h-9 rounded-xl ${card.color} text-white flex items-center justify-center shadow-xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="font-heading font-black text-3xl text-gray-900 mb-1">
                  {loading ? '...' : card.value}
                </div>

                <p className="text-xs text-gray-500">{card.sub}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <Link
                  to={card.link}
                  className="text-xs font-bold text-[#2E7D32] hover:text-[#1B5E20] flex items-center justify-between"
                >
                  <span>{card.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 space-y-4">
        <h2 className="font-heading font-bold text-base text-gray-900">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/admin/produits?new=true"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-[#2E7D32]/5 hover:bg-[#2E7D32]/10 border border-[#2E7D32]/20 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2E7D32] text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 group-hover:text-[#2E7D32]">Ajouter un produit</p>
              <p className="text-[11px] text-gray-500">Boisson, farine ou dérivé</p>
            </div>
          </Link>

          <Link
            to="/admin/articles?new=true"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50/50 hover:bg-blue-50 border border-blue-200/60 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 group-hover:text-blue-600">Rédiger un article</p>
              <p className="text-[11px] text-gray-500">Nutrition, recettes, communauté</p>
            </div>
          </Link>

          <Link
            to="/admin/publicites?new=true"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50/50 hover:bg-amber-50 border border-amber-200/60 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#D4A017] text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 group-hover:text-[#D4A017]">Créer une publicité</p>
              <p className="text-[11px] text-gray-500">Bannière pour carrousel d'accueil</p>
            </div>
          </Link>
        </div>
      </div>

      {/* RECENT MESSAGES TABLE */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#2E7D32]" />
              Derniers messages du formulaire de contact
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Demandes de devis ONG, commandes ou demandes de distribution au Burundi
            </p>
          </div>
          <Link
            to="/admin/messages"
            className="text-xs font-bold text-[#2E7D32] hover:text-[#1B5E20] flex items-center gap-1"
          >
            <span>Voir tous les messages ({stats.totalMessagesCount})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Aucun message reçu pour le moment.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  !msg.isRead ? 'bg-amber-50/40' : 'hover:bg-gray-50'
                }`}
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">{msg.name}</span>
                    <span className="text-xs text-gray-500">({msg.email})</span>
                    {!msg.isRead && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-800">{msg.subject}</p>
                  <p className="text-xs text-gray-600 line-clamp-1">{msg.message}</p>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {msg.phone && <span>• Tél : {msg.phone}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!msg.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(msg.id)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>Marquer lu</span>
                    </button>
                  )}
                  <Link
                    to="/admin/messages"
                    className="px-3 py-1.5 rounded-lg bg-[#2E7D32] text-white text-xs font-semibold hover:bg-[#1B5E20]"
                  >
                    Répondre
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONFIRM RESET MODAL */}
      <ConfirmModal
        isOpen={resetModalOpen}
        title="Réinitialiser les données de démonstration ?"
        message="Cette action va réinitialiser tous les produits, articles, publicités et messages aux données d'origine pré-enregistrées. Êtes-vous sûr de vouloir continuer ?"
        confirmLabel="Oui, réinitialiser"
        cancelLabel="Annuler"
        isDestructive={false}
        onConfirm={handleResetDemoData}
        onCancel={() => setResetModalOpen(false)}
      />
    </div>
  );
};
