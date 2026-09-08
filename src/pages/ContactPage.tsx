import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { messageService } from '../services/messageService';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Contact & Devis | NUTRI SOJA Burundi';
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est obligatoire';
    if (!formData.email.trim()) {
      newErrors.email = "L'adresse email est obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d’email invalide';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Le sujet est obligatoire';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await messageService.send({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || '+257 Non renseigné',
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setSubmittedSuccess(true);
      success('Votre message a été envoyé avec succès à notre équipe commerciale !');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      error("Une erreur s'est produite lors de l'envoi du message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-20 bg-[#F5F1E8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#2E7D32]/10 text-[#2E7D32]">
            Écoute & Partenariats
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#1C1C1C]">
            Entrons en contact
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Une question sur nos produits ? Un besoin en gros volumes pour une ONG ou une école ? 
            Ou l'envie de distribuer NUTRI SOJA dans votre magasin ? Écrivez-nous !
          </p>
        </div>

        {/* MAIN CONTACT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: FORM */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1C1C1C] mb-2">
              Envoyez-nous un message
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              Tous les champs marqués d'une astérisque (*) sont requis. Réponse sous 24h ouvrées.
            </p>

            {submittedSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold">Message bien reçu !</p>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Merci d’avoir contacté NUTRI SOJA. Un conseiller prendra contact avec vous dans les plus brefs délais.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* NOM */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Jean-Bosco Nkurunziza"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      errors.name ? 'border-red-400 focus:ring-red-400 bg-red-50/20' : 'border-gray-200 focus:ring-[#2E7D32]'
                    }`}
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.name}</p>}
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Adresse Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ex: jbosco@exemple.bi"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      errors.email ? 'border-red-400 focus:ring-red-400 bg-red-50/20' : 'border-gray-200 focus:ring-[#2E7D32]'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* TÉLÉPHONE */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Téléphone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+257 79 00 00 00"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                {/* SUJET */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Objet de votre demande *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-white ${
                      errors.subject ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-[#2E7D32]'
                    }`}
                  >
                    <option value="">Sélectionnez un sujet...</option>
                    <option value="Commande de produits particuliers">Commande de produits particuliers</option>
                    <option value="Partenariat institutionnel / ONG / Cantine">Partenariat institutionnel / ONG / Cantine</option>
                    <option value="Distribution & Devenir revendeur agréé">Distribution & Devenir revendeur agréé</option>
                    <option value="Coopératives & Approvisionnement en graines">Coopératives & Approvisionnement en graines</option>
                    <option value="Autre demande">Autre demande</option>
                  </select>
                  {errors.subject && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.subject}</p>}
                </div>
              </div>

              {/* MESSAGE */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Votre Message *
                </label>
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Précisez votre demande, les quantités estimées ou votre localisation..."
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.message ? 'border-red-400 focus:ring-red-400 bg-red-50/20' : 'border-gray-200 focus:ring-[#2E7D32]'
                  }`}
                />
                {errors.message && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <span>Envoi en cours...</span>
                ) : (
                  <>
                    <span>Envoyer mon message</span>
                    <Send className="w-4 h-4 text-[#D4A017]" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: DETAILS, HOURS, SOCIALS & MAP */}
          <div className="lg:col-span-5 space-y-6">
            {/* DIRECT COORDONNÉES */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
              <h3 className="font-heading font-bold text-lg text-[#1C1C1C]">
                Nos Coordonnées
              </h3>

              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold block text-gray-900">Siège social & Usine de transformation</span>
                    <span className="text-gray-600">Avenue des Usines, Zone Industrielle, Bujumbura, Burundi</span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold block text-gray-900">Ligne directe & Commercial</span>
                    <span className="text-gray-600">+257 22 25 78 90 / +257 79 98 00 00</span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold block text-gray-900">Courrier électronique</span>
                    <span className="text-gray-600">contact@nutrisoja.bi / direction@nutrisoja.bi</span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold block text-gray-900">Horaires d'ouverture</span>
                    <span className="text-gray-600 block">Lundi au Vendredi : 07h30 - 17h00</span>
                    <span className="text-gray-600 block">Samedi : 08h00 - 13h00 (Fermé Dimanche)</span>
                  </div>
                </li>
              </ul>

              <div className="pt-4 border-t border-gray-100">
                <a
                  href="https://wa.me/25779000000?text=Bonjour%20NUTRI%20SOJA,%20je%20souhaite%20des%20renseignements"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-[#D4A017]" />
                  <span>Discuter instantanément sur WhatsApp</span>
                </a>
              </div>
            </div>

            {/* CARTE DE LOCALISATION (BUJUMBURA) */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2E7D32]" />
                  Localisation à Bujumbura
                </h4>
                <span className="text-[11px] text-gray-500 font-medium">Bujumbura Mairie</span>
              </div>

              {/* STYLIZED ACCESSIBLE MAP VIEW */}
              <div className="aspect-[16/9] rounded-2xl overflow-hidden relative border border-gray-200 bg-[#FAF8F5]">
                {/* SVG MAP BACKGROUND WITH LAKE TANGANYIKA & BUJUMBURA ZONE */}
                <svg viewBox="0 0 400 220" className="w-full h-full object-cover">
                  {/* Lake Tanganyika blue zone */}
                  <path d="M 0,0 L 110,0 L 140,80 L 110,160 L 80,220 L 0,220 Z" fill="#D6EAF8" />
                  <text x="30" y="110" fill="#2980B9" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                    Lac Tanganyika
                  </text>
                  {/* City grids */}
                  <rect x="150" y="20" width="230" height="180" fill="#F2F3F4" rx="8" />
                  <line x1="150" y1="60" x2="380" y2="60" stroke="#E5E7E9" strokeWidth="2" />
                  <line x1="150" y1="120" x2="380" y2="120" stroke="#E5E7E9" strokeWidth="2" />
                  <line x1="220" y1="20" x2="220" y2="200" stroke="#E5E7E9" strokeWidth="2" />
                  <line x1="300" y1="20" x2="300" y2="200" stroke="#E5E7E9" strokeWidth="2" />
                  {/* Main Road RN1 / Boulevard */}
                  <path d="M 120,180 Q 200,100 370,50" stroke="#D4A017" strokeWidth="4" fill="none" />
                  {/* Pin Zone Industrielle */}
                  <circle cx="230" cy="95" r="14" fill="#2E7D32" opacity="0.2" />
                  <circle cx="230" cy="95" r="7" fill="#2E7D32" />
                  <circle cx="230" cy="95" r="3" fill="#FFFFFF" />
                  <rect x="245" y="80" width="130" height="32" rx="6" fill="#1C1C1C" />
                  <text x="252" y="96" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                    NUTRI SOJA Usine
                  </text>
                  <text x="252" y="107" fill="#D4A017" fontSize="8" fontFamily="sans-serif">
                    Zone Industrielle
                  </text>
                </svg>

                <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-xs p-2 rounded-xl text-[11px] text-gray-600 flex items-center justify-between border border-gray-200">
                  <span>Coordonnées GPS : -3.3614° S, 29.3599° E</span>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=-3.3614,29.3599"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2E7D32] font-bold hover:underline"
                  >
                    Ouvrir GPS
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
