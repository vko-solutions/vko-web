<!--
  =====================================================
  VKO Solution - Login Page
  =====================================================
  
  Para ajustar cores/estilos, modifique as classes Tailwind abaixo:
  - Fundo: bg-[#FFFFFF] (Branco Puro)
  - Primária: bg-[#2B4C7E] (Azul Aço)
  - Secundária: bg-[#7AC29A] (Verde Sálvia)
  - Erro: text-[#F87171] (Coral Suave)
  - Neutros: text-[#6C737F] (Cinza Urbano), border-[#E8ECEF] (Cinza Névoa)
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
        Entre na sua conta
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Ou
        <router-link to="/register" class="font-medium text-blue-800 hover:text-blue-900 transition-colors duration-200">
          crie uma nova conta
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-gray-200">
        <form @submit.prevent="handleSubmit" class="space-y-6">
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
              :error="errors.password"
              :disabled="loading"
              required
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- Lembrar de mim -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                v-model="form.rememberMe"
                type="checkbox"
                id="remember-me"
                class="h-4 w-4 text-blue-800 focus:ring-blue-800 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-600">
                Lembrar de mim
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-blue-800 hover:text-blue-900 transition-colors duration-200">
                Esqueceu sua senha?
              </a>
            </div>
          </div>

          <!-- Erro geral -->
          <div v-if="error" class="rounded-md bg-red-50 p-4">
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
          <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-600">{{ successMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Botão de login -->
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
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <!-- Links adicionais -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-600">Ou continue com</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <button class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-200">
              <svg class="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="ml-2">Google</span>
            </button>

            <button class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-200">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
              <span class="ml-2">Twitter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

const router = useRouter()
const auth = useAuth()

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)
const error = ref('')
const successMessage = ref('')

const validateForm = () => {
  errors.value = {}
  
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
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    error.value = ''
    successMessage.value = ''
    
    await auth.signIn(form.email, form.password)
    
    // Redirecionar para a rota original ou dashboard
    const redirect = router.currentRoute.value.query.redirect as string
    router.push(redirect || '/app')
  } catch (err: any) {
    error.value = err.message || 'Erro ao fazer login'
    console.error('Erro no login:', err)
  } finally {
    loading.value = false
  }
}

// Verificar se há mensagem de sucesso na URL (após confirmação de email)
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('confirmed') === 'true') {
    successMessage.value = 'Email confirmado com sucesso! Faça login para continuar.'
  }
})
</script>