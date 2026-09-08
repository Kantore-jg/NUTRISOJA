import React, { useState } from 'react';
import {
  Database,
  Copy,
  Check,
  ShieldCheck,
  Key,
  ExternalLink,
  Server,
  FolderLock,
  Code2,
  CheckCircle2,
} from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '../services/supabaseExport';
import { useToast } from '../context/ToastContext';

export const AdminSupabaseGuide: React.FC = () => {
  const { success } = useToast();
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const envSample = `# Configuration Supabase pour NUTRI SOJA
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    success('Script SQL complet copié dans le presse-papier !');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envSample);
    setCopiedEnv(true);
    success('Variables .env copiées !');
    setTimeout(() => setCopiedEnv(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* HEADER */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] text-xs font-bold uppercase tracking-wider mb-2">
          <Database className="w-3.5 h-3.5 text-[#D4A017]" />
          <span>Guide de Déploiement Production</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
          Connecter votre projet Supabase
        </h1>
        <p className="text-sm text-gray-600 mt-1 max-w-3xl">
          L'application fonctionne actuellement avec une couche de persistance locale ultra-rapide (localStorage + mock haute-fidélité).
          Pour brancher votre instance Cloud Supabase réelle avec authentification, tables PostgreSQL et stockage d'images, 
          suivez ces 3 étapes simples ci-dessous.
        </p>
      </div>

      {/* STEP 1: CREATE PROJECT */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-gray-900">
              Créer votre projet Supabase
            </h2>
            <p className="text-xs text-gray-500">Rendez-vous sur Supabase.com (compte gratuit ou pro)</p>
          </div>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed">
          Créez une nouvelle organisation et un nouveau projet (par exemple nommé <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[#2E7D32] font-semibold">nutri-soja-burundi</code>). 
          Choisissez la région la plus proche de l'Afrique de l'Est (ex: Afrique du Sud <em>af-south-1</em> ou Francfort/Londres pour une excellente latence).
        </p>

        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#2E7D32] hover:underline"
        >
          <span>Ouvrir la console Supabase</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* STEP 2: SQL SCHEMA & RLS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-gray-900">
                Exécuter le script SQL (Tables, Index & Sécurité RLS)
              </h2>
              <p className="text-xs text-gray-500">Allez dans "SQL Editor" dans Supabase et collez le script ci-dessous</p>
            </div>
          </div>

          <button
            onClick={handleCopySql}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-[#D4A017]" />}
            <span>{copiedSql ? 'Copié !' : 'Copier tout le SQL'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600 bg-[#F5F1E8] p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            <span>4 Tables (produits, articles, pubs, messages)</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
            <span>Sécurité RLS (Lecture publique, écriture admin)</span>
          </div>
          <div className="flex items-center gap-2">
            <FolderLock className="w-4 h-4 text-[#2E7D32]" />
            <span>Storage Bucket "nutri-soja-images" préconfiguré</span>
          </div>
        </div>

        <div className="relative rounded-2xl bg-[#1C1C1C] p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-72">
          <pre>{SUPABASE_SQL_SCHEMA}</pre>
        </div>
      </div>

      {/* STEP 3: ENVIRONMENT VARIABLES */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-gray-900">
                Variables d'environnement (.env)
              </h2>
              <p className="text-xs text-gray-500">
                Récupérez vos clés dans <em>Project Settings → API</em>
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyEnv}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
          >
            {copiedEnv ? <Check className="w-3.5 h-3.5 text-[#2E7D32]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copier le modèle .env</span>
          </button>
        </div>

        <div className="rounded-2xl bg-gray-900 p-4 font-mono text-xs text-amber-300">
          <pre>{envSample}</pre>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm space-y-1">
          <p className="font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            Architecture 100% découplée
          </p>
          <p className="text-emerald-800">
            Tous les modules d'accès aux données sont isolés dans <code>/src/services</code>.
            Il vous suffit de remplacer les appels de stockage local par le client <code>@supabase/supabase-js</code> sans toucher aux composants React ni aux routes !
          </p>
        </div>
      </div>
    </div>
  );
};
