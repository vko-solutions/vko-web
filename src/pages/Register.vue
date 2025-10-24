<!--
  =====================================================
  VKO Solution - Register Page
  =====================================================
  
  Para ajustar cores/estilos, modifique as classes Tailwind abaixo:
  - Fundo: bg-[#FFFFFF] (Branco Puro)
  - Primária: bg-[#2B4C7E] (Azul Aço)
  - Secundária: bg-[#7AC29A] (Verde Sálvia)
  - Erro: text-red-600 (Coral Suave)
  - Neutros: text-gray-600 (Cinza Urbano), border-gray-300 (Cinza Névoa)
-->

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo -->
      <div class="flex justify-center">
        <svg width="200" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="border border-[#2B4C7E]/20 rounded-lg">
          <rect x="0.5" y="0.5" width="199" height="79" stroke="#E5E7EB" fill="white" rx="8"/>
          <text x="100" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#1F2937">VKO</text>
          <text x="100" y="55" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="300" fill="#1F2937">SOLUTION</text>
        </svg>
      </div>
      
      <h2 class="mt-6 text-center text-3xl font-bold text-blue-800">
        Crie sua conta
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Ou
        <router-link to="/login" class="font-medium text-blue-800 hover:text-blue-900 transition-colors duration-200">
          faça login na sua conta existente
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-gray-200">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nome -->
          <div>
            <label for="name" class="block text-sm font-medium text-blue-800 mb-2">
              Nome completo
            </label>
            <input
              v-model="form.name"
              type="text"
              id="name"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
              placeholder="Seu nome completo"
              :error="errors.name"
              :disabled="loading"
              required
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-blue-800 mb-2">
              Email
            </label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
              placeholder="seu@email.com"
              :error="errors.email"
              :disabled="loading"
              required
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Senha -->
          <div>
            <label for="password" class="block text-sm font-medium text-blue-800 mb-2">
              Senha
            </label>
            <input
              v-model="form.password"
              type="password"
              id="password"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
              placeholder="••••••••"
              help="Mínimo de 6 caracteres"
              :error="errors.password"
              :disabled="loading"
              required
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- Confirmar Senha -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-blue-800 mb-2">
              Confirmar senha
            </label>
            <input
              v-model="form.confirmPassword"
              type="password"
              id="confirmPassword"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
              placeholder="••••••••"
              :error="errors.confirmPassword"
              :disabled="loading"
              required
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
          </div>

          <!-- Termos de uso -->
          <div class="flex items-center">
            <input
              v-model="form.acceptTerms"
              type="checkbox"
              id="accept-terms"
              class="h-4 w-4 text-blue-800 focus:ring-[#2B4C7E] border-gray-300 rounded"
              :disabled="loading"
              required
            />
            <label for="accept-terms" class="ml-2 block text-sm text-gray-600">
              Eu aceito os
              <a href="#" class="font-medium text-blue-800 hover:text-[#1e3556] transition-colors duration-200">
                termos de uso
              </a>
              e
              <a href="#" class="font-medium text-blue-800 hover:text-[#1e3556] transition-colors duration-200">
                política de privacidade
              </a>
            </label>
          </div>
          <p v-if="errors.terms" class="text-sm text-red-600">{{ errors.terms }}</p>

          <!-- Erro geral -->
          <div v-if="error" class="rounded-md bg-[#F87171]/10 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-600">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Sucesso -->
          <div v-if="successMessage" class="rounded-md bg-[#7AC29A]/10 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-[#7AC29A]" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-[#7AC29A]">{{ successMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Botão de cadastro -->
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#2B4C7E] hover:bg-[#1e3556] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B4C7E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Criando conta...' : 'Criar conta' }}
          </button>
        </form>

        <!-- Informações adicionais -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-600">Informações importantes</span>
            </div>
          </div>

          <div class="mt-6 text-center">
            <div class="text-sm text-gray-600 space-y-2">
              <p>📧 Você receberá um email de confirmação</p>
              <p>🔐 Sua conta será criada com permissões básicas</p>
              <p>👤 Um administrador pode ajustar suas permissões</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

const router = useRouter()
const auth = useAuth()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const errors = ref<Record<string, string>>({})
const successMessage = ref('')
const loading = ref(false)
const error = ref('')

const validateForm = () => {
  errors.value = {}
  
  if (!form.name.trim()) {
    errors.value.name = 'Nome é obrigatório'
  }
  
  if (!form.email) {
    errors.value.email = 'Email é obrigatório'
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.value.email = 'Email inválido'
  }
  
  if (!form.password) {
    errors.value.password = 'Senha é obrigatória'
  } else if (form.password.length < 6) {
    errors.value.password = 'Senha deve ter pelo menos 6 caracteres'
  }
  
  if (!form.confirmPassword) {
    errors.value.confirmPassword = 'Confirmação de senha é obrigatória'
  } else if (form.password !== form.confirmPassword) {
    errors.value.confirmPassword = 'Senhas não coincidem'
  }
  
  if (!form.acceptTerms) {
    errors.value.terms = 'Você deve aceitar os termos de uso'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    error.value = ''
    successMessage.value = ''
    
    await auth.signUp(form.name.trim(), form.email, form.password)
    
    successMessage.value = 'Conta criada com sucesso! Verifique seu email para confirmar.'
    
    // Limpar formulário
    Object.assign(form, {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    })
    errors.value = {}
    
    // Redirecionar após um delay
    setTimeout(() => {
      router.push('/login')
    }, 3000)
    
  } catch (err: any) {
    error.value = err.message || 'Erro ao criar conta'
    successMessage.value = ''
  } finally {
    loading.value = false
  }
}
</script>