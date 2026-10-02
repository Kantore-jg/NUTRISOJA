<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
import { Leaf, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/src/stores/auth'
import { useToastStore } from '@/src/stores/toast'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()
const route = useRoute()

const email = ref('admin@nutrisoja.bi')
const password = ref('NutriSoja2026!')
const loading = ref(false)
const formError = ref('')

const from = route.query.redirect || '/admin'

watch(() => auth.isAuthenticated, (val) => {
  if (val) router.replace('/admin')
}, { immediate: true })

const handleSubmit = async () => {
  formError.value = ''
  loading.value = true

  try {
    await auth.login(email.value, password.value)
    toast.success('Connexion réussie ! Bienvenue sur le back-office NUTRI SOJA Burundi.')
    router.replace(from)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Identifiants incorrects'
    formError.value = msg
    toast.error(msg)
  } finally {
    loading.value = false
  }
}

const handleDemoFill = () => {
  email.value = 'admin@nutrisoja.bi'
  password.value = 'NutriSoja2026!'
  formError.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-[#F5F1E8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <RouterLink to="/" class="inline-flex items-center gap-3 group mb-4">
        <div class="w-12 h-12 rounded-2xl bg-[#2E7D32] flex items-center justify-center shadow-lg text-white">
          <Leaf class="w-7 h-7 text-[#D4A017]" />
        </div>
        <div class="text-left">
          <span class="font-heading font-extrabold text-2xl tracking-tight text-[#1C1C1C]">
            NUTRI <span class="text-[#2E7D32]">SOJA</span>
          </span>
          <span class="block text-xs uppercase tracking-wider text-gray-500 font-medium">
            Administration Sécurisée
          </span>
        </div>
      </RouterLink>
      <h2 class="font-heading font-bold text-2xl text-gray-900">
        Connexion au Back-Office
      </h2>
      <p class="mt-1 text-sm text-gray-600">
        Gérez le catalogue produits, les articles du blog, les bannières et messages.
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-gray-100">
        <div
          v-if="formError"
          class="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5"
        >
          <AlertCircle class="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{{ formError }}</span>
        </div>

        <form class="space-y-5" @submit.prevent="handleSubmit">
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Adresse Email Administrateur
            </label>
            <div class="relative">
              <Mail class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                v-model="email"
                placeholder="admin@nutrisoja.bi"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Mot de Passe
            </label>
            <div class="relative">
              <Lock class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                v-model="password"
                placeholder="••••••••••••"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-semibold shadow-md transition-all disabled:opacity-50"
          >
            <span v-if="loading">Vérification...</span>
            <template v-else>
              <span>Accéder au panneau d'administration</span>
              <ArrowRight class="w-4 h-4 text-[#D4A017]" />
            </template>
          </button>
        </form>

        <div class="mt-6 pt-6 border-t border-gray-100">
          <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 space-y-2">
            <div class="flex items-center gap-1.5 font-bold text-amber-950">
              <ShieldCheck class="w-4 h-4 text-amber-700" />
              <span>Identifiants Démo Pré-remplis</span>
            </div>
            <p class="text-gray-600 leading-relaxed">
              Email : <strong class="text-gray-900">admin@nutrisoja.bi</strong><br />
              Mot de passe : <strong class="text-gray-900">NutriSoja2026!</strong>
            </p>
            <button
              type="button"
              @click="handleDemoFill"
              class="w-full mt-2 py-1.5 px-3 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold text-[11px] transition-colors shadow-2xs"
            >
              Remplir automatiquement les accès de test
            </button>
          </div>

          <div class="mt-6 text-center">
            <RouterLink
              to="/"
              class="text-xs font-semibold text-gray-500 hover:text-[#2E7D32] transition-colors"
            >
              ← Retourner au site vitrine public
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
