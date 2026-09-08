import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  CheckCircle2,
  Trash2,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  X,
  Send,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { ContactMessage } from '../types';
import { messageService } from '../services/messageService';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { TableSkeleton } from '../components/common/LoadingSkeleton';

export const AdminMessages: React.FC = () => {
  const { success, error } = useToast();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');

  // Detail modal
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage[] | null>(null);
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await messageService.getAll();
      setMessages(data);
    } catch {
      error('Erreur lors du chargement des messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Boîte de Réception des Messages | Admin NUTRI SOJA';
    loadMessages();
  }, []);

  const handleOpenDetail = async (msg: ContactMessage) => {
    setActiveMessage(msg);
    if (!msg.isRead) {
      try {
        await messageService.markAsRead(msg.id, true);
        loadMessages();
      } catch {
        // silent
      }
    }
  };

  const handleToggleRead = async (msg: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await messageService.markAsRead(msg.id, !msg.isRead);
      success(`Message marqué comme ${!msg.isRead ? 'lu' : 'non lu'}.`);
      loadMessages();
      if (activeMessage && activeMessage.id === msg.id) {
        setActiveMessage({ ...activeMessage, isRead: !msg.isRead });
      }
    } catch {
      error('Erreur lors du changement de statut.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await messageService.delete(deleteId);
      success('Message supprimé de la boîte de réception.');
      setDeleteId(null);
      if (activeMessage && activeMessage.id === deleteId) {
        setActiveMessage(null);
      }
      loadMessages();
    } catch {
      error('Erreur lors de la suppression.');
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filterRead === 'unread' && m.isRead) return false;
    if (filterRead === 'read' && !m.isRead) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
              Messages de Contact
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white">
                {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Répondez aux demandes de devis, commandes institutionnelles ou sollicitations de partenariat.
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {(['all', 'unread', 'read'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterRead(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterRead === st
                  ? 'bg-[#2E7D32] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st === 'all'
                ? `Tous (${messages.length})`
                : st === 'unread'
                ? `Non lus (${unreadCount})`
                : `Lus (${messages.length - unreadCount})`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par expéditeur, sujet..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
          />
        </div>
      </div>

      {/* MESSAGES LIST */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
          {filteredMessages.length === 0 ? (
            <div className="p-12 text-center text-gray-500 space-y-2">
              <Inbox className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="font-heading font-bold text-gray-700">Aucun message dans cette vue</p>
              <p className="text-xs text-gray-400">Votre boîte de réception est à jour.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleOpenDetail(msg)}
                  className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-colors ${
                    !msg.isRead ? 'bg-amber-50/50 hover:bg-amber-50/80 font-medium' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          !msg.isRead ? 'bg-[#2E7D32] ring-4 ring-[#2E7D32]/20' : 'bg-transparent'
                        }`}
                      />
                      <span className="font-heading font-bold text-sm text-gray-900">{msg.name}</span>
                      <span className="text-xs text-gray-500">‹{msg.email}›</span>
                      {msg.phone && (
                        <span className="text-xs text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded">
                          {msg.phone}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-gray-800 pl-5">{msg.subject}</p>
                    <p className="text-xs text-gray-600 line-clamp-1 pl-5">{msg.message}</p>

                    <div className="flex items-center gap-2 text-[11px] text-gray-400 pl-5 pt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleToggleRead(msg, e)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        msg.isRead
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-[#2E7D32] text-white hover:bg-[#1B5E20]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{msg.isRead ? 'Marquer non lu' : 'Marquer lu'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenDetail(msg)}
                      className="p-2 rounded-xl text-gray-600 hover:text-[#2E7D32] hover:bg-gray-100"
                      title="Lire le message"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteId(msg.id)}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MESSAGE DETAIL MODAL */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-gray-900">
                    Détail du message
                  </h3>
                  <p className="text-xs text-gray-500">
                    Reçu le {new Date(activeMessage.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveMessage(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Expéditeur :</span>
                  <span className="font-bold text-gray-900">{activeMessage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Email :</span>
                  <a href={`mailto:${activeMessage.email}`} className="font-medium text-[#2E7D32] hover:underline">
                    {activeMessage.email}
                  </a>
                </div>
                {activeMessage.phone && (
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Téléphone / WhatsApp :</span>
                    <span className="font-mono text-gray-800">{activeMessage.phone}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-gray-200">
                  <span className="text-xs text-gray-500">Objet :</span>
                  <span className="font-bold text-gray-900">{activeMessage.subject}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Corps du message :
                </label>
                <div className="p-5 rounded-2xl bg-white border border-gray-200 text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {activeMessage.message}
                </div>
              </div>

              {/* REPLY BUTTONS */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${activeMessage.email}?subject=RE: ${encodeURIComponent(activeMessage.subject)}&body=Bonjour ${encodeURIComponent(activeMessage.name)},\n\nMerci pour votre message adressé à NUTRI SOJA Burundi.\n\nCordialement,\nService Commercial NUTRI SOJA`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <Mail className="w-4 h-4 text-[#D4A017]" />
                    <span>Répondre par Email</span>
                  </a>

                  {activeMessage.phone && (
                    <a
                      href={`https://wa.me/${activeMessage.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${activeMessage.name}, suite à votre message concernant "${activeMessage.subject}" chez NUTRI SOJA :`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                    >
                      <MessageSquare className="w-4 h-4 text-white" />
                      <span>Ouvrir sur WhatsApp</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setDeleteId(activeMessage.id)}
                  className="px-3.5 py-2.5 rounded-xl border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Supprimer ce message ?"
        message="Êtes-vous sûr de vouloir supprimer définitivement ce message de la boîte de réception ?"
        confirmLabel="Oui, supprimer"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
