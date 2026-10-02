<script setup>
import { ref } from 'vue'
import { UploadCloud, Image as ImageIcon, Check, Link as LinkIcon, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Image' },
  helperText: { type: String, default: 'Téléchargez un fichier (JPEG, PNG, WebP) ou renseignez une URL directe' },
})

const emit = defineEmits(['update:modelValue'])

const PRESET_SUGGESTIONS = [
  { label: 'Lait de soja bouteille', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80' },
  { label: 'Farine & céréales', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tofu frais en dés', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Plat mijoté tofu', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Champs & producteurs', url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bannière nutrition', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80' },
]

const activeTab = ref('upload')
const urlInput = ref(props.modelValue || '')
const dragActive = ref(false)
const fileInputRef = ref(null)

function updateValue(url) {
  emit('update:modelValue', url)
}

function handleFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Veuillez sélectionner un fichier image valide')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      const result = e.target.result
      updateValue(result)
      urlInput.value = result
    }
  }
  reader.readAsDataURL(file)
}

function handleDrag(e) {
  e.preventDefault()
  e.stopPropagation()
  if (e.type === 'dragenter' || e.type === 'dragover') {
    dragActive.value = true
  } else if (e.type === 'dragleave') {
    dragActive.value = false
  }
}

function handleDrop(e) {
  e.preventDefault()
  e.stopPropagation()
  dragActive.value = false
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    handleFile(e.dataTransfer.files[0])
  }
}

function handleUrlSubmit() {
  if (urlInput.value.trim()) {
    updateValue(urlInput.value.trim())
  }
}

function handleFileChange(e) {
  if (e.target.files?.[0]) {
    handleFile(e.target.files[0])
  }
}

function clearImage() {
  updateValue('')
  urlInput.value = ''
}

function selectPreset(preset) {
  updateValue(preset.url)
  urlInput.value = preset.url
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <label class="block text-sm font-semibold text-gray-700">{{ label }}</label>
      <button
        v-if="modelValue"
        type="button"
        @click="clearImage"
        class="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
      >
        <Trash2 class="w-3.5 h-3.5" />
        Supprimer l'image
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-gray-200 text-xs font-medium">
      <button
        type="button"
        @click="activeTab = 'upload'"
        :class="[
          'pb-2 px-1 border-b-2 transition-colors flex items-center gap-1.5',
          activeTab === 'upload'
            ? 'border-[#2E7D32] text-[#2E7D32] font-semibold'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        ]"
      >
        <UploadCloud class="w-3.5 h-3.5" />
        Fichier local
      </button>
      <button
        type="button"
        @click="activeTab = 'url'"
        :class="[
          'pb-2 px-1 border-b-2 transition-colors flex items-center gap-1.5',
          activeTab === 'url'
            ? 'border-[#2E7D32] text-[#2E7D32] font-semibold'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        ]"
      >
        <LinkIcon class="w-3.5 h-3.5" />
        URL externe
      </button>
      <button
        type="button"
        @click="activeTab = 'presets'"
        :class="[
          'pb-2 px-1 border-b-2 transition-colors flex items-center gap-1.5',
          activeTab === 'presets'
            ? 'border-[#2E7D32] text-[#2E7D32] font-semibold'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        ]"
      >
        <ImageIcon class="w-3.5 h-3.5" />
        Banque d'images soja
      </button>
    </div>

    <!-- Tab 1: Upload via drag & drop / browse -->
    <div
      v-if="activeTab === 'upload'"
      @dragenter="handleDrag"
      @dragleave="handleDrag"
      @dragover="handleDrag"
      @drop="handleDrop"
      @click="fileInputRef?.click()"
      :class="[
        'cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all',
        dragActive
          ? 'border-[#2E7D32] bg-[#2E7D32]/5 scale-[1.01]'
          : 'border-gray-300 hover:border-[#2E7D32]/60 hover:bg-gray-50'
      ]"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />
      <UploadCloud class="w-8 h-8 mx-auto text-gray-400 mb-2" />
      <p class="text-sm font-medium text-gray-700">
        Glissez-déposez votre image ici ou <span class="text-[#2E7D32] underline">parcourez vos fichiers</span>
      </p>
      <p class="text-xs text-gray-500 mt-1">{{ helperText }}</p>
    </div>

    <!-- Tab 2: URL input -->
    <div v-if="activeTab === 'url'" class="flex gap-2">
      <input
        type="url"
        placeholder="https://images.unsplash.com/..."
        v-model="urlInput"
        class="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
      />
      <button
        type="button"
        @click="handleUrlSubmit"
        class="px-4 py-2 bg-[#2E7D32] text-white text-sm font-semibold rounded-xl hover:bg-[#1B5E20] transition-colors"
      >
        Valider
      </button>
    </div>

    <!-- Tab 3: Presets -->
    <div v-if="activeTab === 'presets'" class="grid grid-cols-3 sm:grid-cols-6 gap-2">
      <button
        v-for="(preset, idx) in PRESET_SUGGESTIONS"
        :key="idx"
        type="button"
        @click="selectPreset(preset)"
        :class="[
          'relative rounded-lg overflow-hidden border text-left group',
          modelValue === preset.url ? 'ring-2 ring-[#2E7D32] border-[#2E7D32]' : 'border-gray-200'
        ]"
      >
        <img
          :src="preset.url"
          :alt="preset.label"
          class="w-full h-16 object-cover group-hover:scale-105 transition-transform"
          referrerpolicy="no-referrer"
        />
        <span class="block p-1 text-[10px] text-gray-600 truncate bg-white font-medium">
          {{ preset.label }}
        </span>
        <div
          v-if="modelValue === preset.url"
          class="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#2E7D32] text-white flex items-center justify-center shadow"
        >
          <Check class="w-3 h-3" />
        </div>
      </button>
    </div>

    <!-- Preview -->
    <div v-if="modelValue" class="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-4">
      <img
        :src="modelValue"
        alt="Aperçu"
        class="w-20 h-20 object-cover rounded-lg border border-gray-300 shrink-0"
        referrerpolicy="no-referrer"
      />
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
          <Check class="w-3.5 h-3.5 text-emerald-600" />
          Aperçu prêt avant validation
        </p>
        <p class="text-xs text-gray-500 truncate mt-0.5">{{ modelValue }}</p>
      </div>
    </div>
  </div>
</template>
