import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Check, Link as LinkIcon, Trash2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

const PRESET_SUGGESTIONS = [
  { label: 'Lait de soja bouteille', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80' },
  { label: 'Farine & céréales', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tofu frais en dés', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Plat mijoté tofu', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Champs & producteurs', url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bannière nutrition', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80' },
];

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Image',
  helperText = 'Téléchargez un fichier (JPEG, PNG, WebP) ou renseignez une URL directe',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const result = e.target.result as string;
        onChange(result);
        setUrlInput(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setUrlInput('');
            }}
            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Supprimer l'image
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`pb-2 px-1 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'upload'
              ? 'border-[#2E7D32] text-[#2E7D32] font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          Fichier local
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`pb-2 px-1 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'url'
              ? 'border-[#2E7D32] text-[#2E7D32] font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          URL externe
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`pb-2 px-1 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'presets'
              ? 'border-[#2E7D32] text-[#2E7D32] font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Banque d'images soja
        </button>
      </div>

      {/* Tab 1: Upload via drag & drop / browse */}
      {activeTab === 'upload' && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            dragActive
              ? 'border-[#2E7D32] bg-[#2E7D32]/5 scale-[1.01]'
              : 'border-gray-300 hover:border-[#2E7D32]/60 hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <UploadCloud className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-700">
            Glissez-déposez votre image ici ou <span className="text-[#2E7D32] underline">parcourez vos fichiers</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">{helperText}</p>
        </div>
      )}

      {/* Tab 2: URL input */}
      {activeTab === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-4 py-2 bg-[#2E7D32] text-white text-sm font-semibold rounded-xl hover:bg-[#1B5E20] transition-colors"
          >
            Valider
          </button>
        </div>
      )}

      {/* Tab 3: Presets */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {PRESET_SUGGESTIONS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange(preset.url);
                setUrlInput(preset.url);
              }}
              className={`relative rounded-lg overflow-hidden border text-left group ${
                value === preset.url ? 'ring-2 ring-[#2E7D32] border-[#2E7D32]' : 'border-gray-200'
              }`}
            >
              <img
                src={preset.url}
                alt={preset.label}
                className="w-full h-16 object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <span className="block p-1 text-[10px] text-gray-600 truncate bg-white font-medium">
                {preset.label}
              </span>
              {value === preset.url && (
                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#2E7D32] text-white flex items-center justify-center shadow">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-4">
          <img
            src={value}
            alt="Aperçu"
            className="w-20 h-20 object-cover rounded-lg border border-gray-300 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Aperçu prêt avant validation
            </p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{value}</p>
          </div>
        </div>
      )}
    </div>
  );
};
