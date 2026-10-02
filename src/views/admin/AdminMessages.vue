<script setup>
import { ref, onMounted, computed } from 'vue'
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
} from 'lucide-vue-next'
import { messageService } from '@/src/services/messageService'
import { useToastStore } from '@/src/stores/toast'
import ConfirmModal from '@/src/components/common/ConfirmModal.vue'
import TableSkeleton from '@/src/components/common/TableSkeleton.vue'

const toast = useToastStore()

const messages = ref([])
const loading = ref(true)
const search = ref('')
const filterRead = ref('all')

const activeMessage = ref(null)
const deleteId = ref(null)

const loadMessages = async () => {
  loading.value = true
  try {
    const data = await messageService.getAll()
    messages.value = data
  } catch {
    toast.error('Erreur lors du chargement des messages.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  document.title = 'Boîte de Réception des Messages | Admin NUTRI SOJA Burundi'
  loadMessages()
})

const handleOpenDetail = async (msg) => {
  activeMessage.value = msg
  if (!msg.isRead) {
    try {
      await messageService.markAsRead(msg.id, true)
      loadMessages()
    } catch {
      // silent
    }
  }
}

const handleToggleRead = async (msg) => {
  try {
    await messageService.markAsRead(msg.id, !msg.isRead)
    toast.success(`Message marqué comme ${!msg.isRead ? 'lu' : 'non lu'}.`)
    loadMessages()
    if (activeMessage.value && activeMessage.value.id === msg.id) {
      activeMessage.value = { ...activeMessage.value, isRead: !msg.isRead }
    }
  } catch {
    toast.error('Erreur lors du changement de statut.')
  }
}

const confirmDelete = async () => {
  if (!deleteId.value) return
  try {
    await messageService.delete(deleteId.value)
    toast.success('Message supprimé de la boîte de réception.')
    if (activeMessage.value && activeMessage.value.id === deleteId.value) {
      activeMessage.value = null
    }
    deleteId.value = null
    loadMessages()
  } catch {
    toast.error('Erreur lors de la suppression.')
  }
}

const filteredMessages = computed(() => {
  return messages.value.filter((m) => {
    if (filterRead.value === 'unread' && m.isRead) return false
    if (filterRead.value === 'read' && !m.isRead) return false
    if (search.value.trim()) {
      const q = search.value.toLowerCase()
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      )
    }
    return true
  })
})

const unreadCount = computed(() => messages.value.filter((m) => !m.isRead).length)

const getMailtoHref = (msg) => {
  return `mailto:${msg.email}?subject=RE: ${encodeURIComponent(msg.subject)}&body=Bonjour ${encodeURIComponent(msg.name)},\n\nMerci pour votre message adressé à NUTRI SOJA Burundi.\n\nCordialement,\nService Commercial NUTRI SOJA Burundi`
}

const getWhatsappHref = (msg) => {
  return `https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${msg.name}, suite à votre message concernant "${msg.subject}" chez NUTRI SOJA Burundi :`)}`
}
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <h1 class="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
            Messages de Contact
          </h1>
          <span
            v-if="unreadCount > 0"
            class="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white"
          >
            {{ unreadCount }} non lu{{ unreadCount > 1 ? 's' : '' }}
          </span>
        </div>
        <p class="text-sm text-gray-500 mt-0.5">
          Répondez aux demandes de devis, commandes institutionnelles ou sollicitations de partenariat.
        </p>
      </div>
    </div>

    <!-- FILTER & SEARCH -->
    <div class="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <button
          v-for="st in ['all', 'unread', 'read']"
          :key="st"
          @click="filterRead = st"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all"
          :class="filterRead === st
            ? 'bg-[#2E7D32] text-white shadow-xs'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          <template v-if="st === 'all'">Tous ({{ messages.length }})</template>
          <template v-else-if="st === 'unread'">Non lus ({{ unreadCount }})</template>
          <template v-else>Lus ({{ messages.length - unreadCount }})</template>
        </button>
      </div>

      <div class="relative w-full sm:w-72">
        <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          v-model="search"
          placeholder="Rechercher par expéditeur, sujet..."
          class="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
        />
      </div>
    </div>

    <!-- MESSAGES LIST -->
    <TableSkeleton v-if="loading" :rows="4" />

    <div v-else class="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <div v-if="filteredMessages.length === 0" class="p-12 text-center text-gray-500 space-y-2">
        <Inbox class="w-8 h-8 text-gray-300 mx-auto" />
        <p class="font-heading font-bold text-gray-700">Aucun message dans cette vue</p>
        <p class="text-xs text-gray-400">Votre boîte de réception est à jour.</p>
      </div>

      <div v-else class="divide-y divide-gray-100">
        <div
          v-for="msg in filteredMessages"
          :key="msg.id"
          @click="handleOpenDetail(msg)"
          class="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-colors"
          :class="!msg.isRead ? 'bg-amber-50/50 hover:bg-amber-50/80 font-medium' : 'hover:bg-gray-50'"
        >
          <div class="space-y-1 max-w-3xl">
            <div class="flex items-center gap-3">
              <div
                class="w-2.5 h-2.5 rounded-full"
                :class="!msg.isRead ? 'bg-[#2E7D32] ring-4 ring-[#2E7D32]/20' : 'bg-transparent'"
              />
              <span class="font-heading font-bold text-sm text-gray-900">{{ msg.name }}</span>
              <span class="text-xs text-gray-500">‹{{ msg.email }}›</span>
              <span
                v-if="msg.phone"
                class="text-xs text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded"
              >
                {{ msg.phone }}
              </span>
            </div>

            <p class="text-xs font-semibold text-gray-800 pl-5">{{ msg.subject }}</p>
            <p class="text-xs text-gray-600 line-clamp-1 pl-5">{{ msg.message }}</p>

            <div class="flex items-center gap-2 text-[11px] text-gray-400 pl-5 pt-0.5">
              <Clock class="w-3 h-3" />
              <span>
                {{ new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }) }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0 self-end md:self-center" @click.stop>
            <button
              @click="handleToggleRead(msg)"
              class="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              :class="msg.isRead
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-[#2E7D32] text-white hover:bg-[#1B5E20]'"
            >
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>{{ msg.isRead ? 'Marquer non lu' : 'Marquer lu' }}</span>
            </button>

            <button
              @click="handleOpenDetail(msg)"
              class="p-2 rounded-xl text-gray-600 hover:text-[#2E7D32] hover:bg-gray-100"
              title="Lire le message"
            >
              <Eye class="w-4 h-4" />
            </button>

            <button
              @click="deleteId = msg.id"
              class="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50"
              title="Supprimer"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MESSAGE DETAIL MODAL -->
    <div v-if="activeMessage" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center">
              <Mail class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-heading font-bold text-lg text-gray-900">
                Détail du message
              </h3>
              <p class="text-xs text-gray-500">
                Reçu le {{ new Date(activeMessage.createdAt).toLocaleString('fr-FR') }}
              </p>
            </div>
          </div>
          <button
            @click="activeMessage = null"
            class="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="space-y-4 text-sm">
          <div class="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
            <div class="flex justify-between">
              <span class="text-xs text-gray-500">Expéditeur :</span>
              <span class="font-bold text-gray-900">{{ activeMessage.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-gray-500">Email :</span>
              <a :href="`mailto:${activeMessage.email}`" class="font-medium text-[#2E7D32] hover:underline">
                {{ activeMessage.email }}
              </a>
            </div>
            <div v-if="activeMessage.phone" class="flex justify-between">
              <span class="text-xs text-gray-500">Téléphone / WhatsApp :</span>
              <span class="font-mono text-gray-800">{{ activeMessage.phone }}</span>
            </div>
            <div class="flex justify-between pt-1 border-t border-gray-200">
              <span class="text-xs text-gray-500">Objet :</span>
              <span class="font-bold text-gray-900">{{ activeMessage.subject }}</span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Corps du message :
            </label>
            <div class="p-5 rounded-2xl bg-white border border-gray-200 text-gray-800 leading-relaxed whitespace-pre-wrap">
              {{ activeMessage.message }}
            </div>
          </div>

          <!-- REPLY BUTTONS -->
          <div class="pt-4 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <a
                :href="getMailtoHref(activeMessage)"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-all shadow-xs"
              >
                <Mail class="w-4 h-4 text-[#D4A017]" />
                <span>Répondre par Email</span>
              </a>

              <a
                v-if="activeMessage.phone"
                :href="getWhatsappHref(activeMessage)"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
              >
                <MessageSquare class="w-4 h-4 text-white" />
                <span>Ouvrir sur WhatsApp</span>
              </a>
            </div>

            <button
              @click="deleteId = activeMessage.id"
              class="px-3.5 py-2.5 rounded-xl border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- CONFIRM DELETE MODAL -->
    <ConfirmModal
      :is-open="!!deleteId"
      title="Supprimer ce message ?"
      message="Êtes-vous sûr de vouloir supprimer définitivement ce message de la boîte de réception ?"
      confirm-label="Oui, supprimer"
      @confirm="confirmDelete"
      @cancel="deleteId = null"
    />
  </div>
</template>
