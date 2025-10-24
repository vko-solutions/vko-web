<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-blue-800">Configurações</h1>
      <p class="text-sm text-gray-600 mt-1">Gerencie suas preferências e informações da conta</p>
    </div>

    <!-- Perfil -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-blue-800 mb-2">Perfil</h2>
      <p class="text-sm text-gray-600 mb-4">Suas informações pessoais</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nome</label>
          <input
            v-model="profile.name"
            type="text"
            placeholder="Seu nome"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="profile.email"
            type="email"
            placeholder="seu@email.com"
            disabled
            class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Função</label>
          <input
            v-model="profile.role"
            type="text"
            disabled
            class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
          <input
            v-model="profile.company"
            type="text"
            disabled
            class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
          />
        </div>
      </div>
      <div class="mt-6 flex justify-end">
        <button
          @click="saveProfile"
          class="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-200"
        >
          Salvar Alterações
        </button>
      </div>
    </div>

    <!-- Segurança -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-blue-800 mb-2">Segurança</h2>
      <p class="text-sm text-gray-600 mb-4">Gerenciar senha e autenticação</p>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
          <input
            v-model="password.new"
            type="password"
            placeholder="••••••••"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Confirmar Nova Senha</label>
          <input
            v-model="password.confirm"
            type="password"
            placeholder="••••••••"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div v-if="passwordError" class="text-sm text-red-600">
          {{ passwordError }}
        </div>
        <div class="flex justify-end">
          <button
            @click="changePassword"
            class="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-200"
          >
            Alterar Senha
          </button>
        </div>
      </div>
    </div>

    <!-- Preferências -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-blue-800 mb-2">Preferências</h2>
      <p class="text-sm text-gray-600 mb-4">Personalize sua experiência</p>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-900">Notificações por Email</h3>
            <p class="text-sm text-gray-500">Receba notificações sobre novos relatórios e atualizações</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="preferences.emailNotifications"
              type="checkbox"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-800"></div>
          </label>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-900">Modo Escuro</h3>
            <p class="text-sm text-gray-500">Ative o tema escuro para uma experiência mais confortável</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="preferences.darkMode"
              type="checkbox"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-800"></div>
          </label>
        </div>
      </div>
      <div class="mt-6 flex justify-end">
          <button
            @click="savePreferences"
            class="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-200"
          >
            Salvar Preferências
          </button>
      </div>
    </div>

    <!-- Mensagens de Feedback -->
    <div v-if="success" class="rounded-md bg-green-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-green-800">Sucesso</h3>
          <p class="text-sm text-green-700 mt-1">{{ success }}</p>
        </div>
      </div>
    </div>

    <div v-if="error" class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Erro</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuth } from '@/stores/auth'

const auth = useAuth()

// Estado
const profile = reactive({
  name: '',
  email: '',
  role: '',
  company: ''
})

const password = reactive({
  new: '',
  confirm: ''
})

const preferences = reactive({
  emailNotifications: true,
  darkMode: false
})

const passwordError = ref('')
const success = ref('')
const error = ref('')

// Carregar dados do perfil
const loadProfile = () => {
  if (auth.profile) {
    profile.name = auth.profile.name || ''
    profile.email = auth.profile.email || ''
    profile.role = auth.profile.role || ''
    profile.company = auth.profile.company_id || ''
  }
}

// Salvar perfil
const saveProfile = async () => {
  try {
    // Aqui você implementaria a lógica de atualização do perfil
    success.value = 'Perfil atualizado com sucesso!'
    setTimeout(() => { success.value = '' }, 3000)
  } catch (err: any) {
    error.value = 'Erro ao atualizar perfil: ' + err.message
    setTimeout(() => { error.value = '' }, 3000)
  }
}

// Alterar senha
const changePassword = async () => {
  passwordError.value = ''
  
  if (!password.new || !password.confirm) {
    passwordError.value = 'Preencha todos os campos'
    return
  }
  
  if (password.new !== password.confirm) {
    passwordError.value = 'As senhas não coincidem'
    return
  }
  
  if (password.new.length < 6) {
    passwordError.value = 'A senha deve ter pelo menos 6 caracteres'
    return
  }
  
  try {
    // Aqui você implementaria a lógica de alteração de senha
    success.value = 'Senha alterada com sucesso!'
    password.new = ''
    password.confirm = ''
    setTimeout(() => { success.value = '' }, 3000)
  } catch (err: any) {
    error.value = 'Erro ao alterar senha: ' + err.message
    setTimeout(() => { error.value = '' }, 3000)
  }
}

// Salvar preferências
const savePreferences = async () => {
  try {
    // Aqui você implementaria a lógica de salvamento de preferências
    localStorage.setItem('preferences', JSON.stringify(preferences))
    success.value = 'Preferências salvas com sucesso!'
    setTimeout(() => { success.value = '' }, 3000)
  } catch (err: any) {
    error.value = 'Erro ao salvar preferências: ' + err.message
    setTimeout(() => { error.value = '' }, 3000)
  }
}

// Inicializar
onMounted(async () => {
  await auth.init()
  loadProfile()
  
  // Carregar preferências salvas
  const savedPreferences = localStorage.getItem('preferences')
  if (savedPreferences) {
    Object.assign(preferences, JSON.parse(savedPreferences))
  }
})
</script>
