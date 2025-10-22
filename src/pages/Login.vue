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
  <div class="min-h-screen bg-[#FFFFFF] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo -->
      <div class="flex justify-center">
        <svg width="200" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="border border-[#2B4C7E]/20 rounded-lg">
          <rect x="0.5" y="0.5" width="199" height="79" stroke="#E5E7EB" fill="white" rx="8"/>
          <text x="100" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#1F2937">VKO</text>
          <text x="100" y="55" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="300" fill="#1F2937">SOLUTION</text>
        </svg>
      </div>
      
      <h2 class="mt-6 text-center text-3xl font-bold text-[#2B4C7E]">
        Entre na sua conta
      </h2>
      <p class="mt-2 text-center text-sm text-[#6C737F]">
        Ou
        <router-link to="/register" class="font-medium text-[#2B4C7E] hover:text-[#1e3556] transition-colors duration-200">
          crie uma nova conta
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-[#E8ECEF]">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email -->
          <UIInput
            v-model="form.email"
            type="email"
            label="Email"
            placeholder="seu@email.com"
            :error="errors.email"
            :disabled="authStore.loading"
            required
          />

          <!-- Senha -->
          <UIInput
            v-model="form.password"
            type="password"
            label="Senha"
            placeholder="••••••••"
            :error="errors.password"
            :disabled="authStore.loading"
            required
          />

          <!-- Lembrar de mim -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-[#2B4C7E] focus:ring-[#2B4C7E] border-[#E8ECEF] rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-[#6C737F]">
                Lembrar de mim
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-[#2B4C7E] hover:text-[#1e3556] transition-colors duration-200">
                Esqueceu a senha?
              </a>
            </div>
          </div>

          <!-- Erro geral -->
          <div v-if="authStore.error" class="rounded-md bg-[#F87171]/10 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-[#F87171]" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-[#F87171]">{{ authStore.error }}</p>
              </div>
            </div>
          </div>

          <!-- Botão de login -->
          <UIButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="authStore.loading"
            loading-text="Entrando..."
            full-width
          >
            Entrar
          </UIButton>
        </form>

        <!-- Links adicionais -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-[#E8ECEF]" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-[#6C737F]">Ou continue com</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              class="w-full inline-flex justify-center py-2 px-4 border border-[#E8ECEF] rounded-md shadow-sm bg-white text-sm font-medium text-[#6C737F] hover:bg-[#E8ECEF] transition-colors duration-200"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="ml-2">Google</span>
            </button>

            <button
              type="button"
              class="w-full inline-flex justify-center py-2 px-4 border border-[#E8ECEF] rounded-md shadow-sm bg-white text-sm font-medium text-[#6C737F] hover:bg-[#E8ECEF] transition-colors duration-200"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span class="ml-2">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UIInput from '@/components/UI/Input.vue'
import UIButton from '@/components/UI/Button.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = ref<Record<string, string>>({})

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
    await authStore.signIn(form.email, form.password)
    
    // Redirecionar para a rota original ou dashboard
    const redirect = router.currentRoute.value.query.redirect as string
    router.push(redirect || '/app')
  } catch (error) {
    // Erro já é tratado no store
    console.error('Erro no login:', error)
  }
}
</script>

