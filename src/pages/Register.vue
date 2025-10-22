<!--
  =====================================================
  VKO Solution - Register Page
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
        Crie sua conta
      </h2>
      <p class="mt-2 text-center text-sm text-[#6C737F]">
        Ou
        <router-link to="/login" class="font-medium text-[#2B4C7E] hover:text-[#1e3556] transition-colors duration-200">
          faça login na sua conta existente
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-[#E8ECEF]">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nome -->
          <UIInput
            v-model="form.name"
            type="text"
            label="Nome completo"
            placeholder="Seu nome completo"
            :error="errors.name"
            :disabled="authStore.loading"
            required
          />

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
            help="Mínimo de 6 caracteres"
            :error="errors.password"
            :disabled="authStore.loading"
            required
          />

          <!-- Confirmar senha -->
          <UIInput
            v-model="form.confirmPassword"
            type="password"
            label="Confirmar senha"
            placeholder="••••••••"
            :error="errors.confirmPassword"
            :disabled="authStore.loading"
            required
          />

          <!-- Termos e condições -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="terms"
                v-model="form.acceptTerms"
                type="checkbox"
                class="h-4 w-4 text-[#2B4C7E] focus:ring-[#2B4C7E] border-[#E8ECEF] rounded"
                required
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="terms" class="text-[#6C737F]">
                Eu aceito os
                <a href="#" class="font-medium text-[#2B4C7E] hover:text-[#1e3556] transition-colors duration-200">
                  termos de uso
                </a>
                e a
                <a href="#" class="font-medium text-[#2B4C7E] hover:text-[#1e3556] transition-colors duration-200">
                  política de privacidade
                </a>
              </label>
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
          <UIButton
            type="submit"
            variant="secondary"
            size="lg"
            :loading="authStore.loading"
            loading-text="Criando conta..."
            full-width
          >
            Criar conta
          </UIButton>
        </form>

        <!-- Informações adicionais -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-[#E8ECEF]" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-[#6C737F]">Informações importantes</span>
            </div>
          </div>

          <div class="mt-6 text-sm text-[#6C737F] space-y-2">
            <p>• Sua conta será criada com permissões de visualização</p>
            <p>• Um administrador pode alterar suas permissões posteriormente</p>
            <p>• Você receberá um email de confirmação</p>
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
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const errors = ref<Record<string, string>>({})
const successMessage = ref('')

const validateForm = () => {
  errors.value = {}
  
  if (!form.name.trim()) {
    errors.value.name = 'Nome é obrigatório'
  } else if (form.name.trim().length < 2) {
    errors.value.name = 'Nome deve ter pelo menos 2 caracteres'
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
    await authStore.signUp(form.name.trim(), form.email, form.password)
    
    successMessage.value = 'Conta criada com sucesso! Verifique seu email para confirmar.'
    
    // Limpar formulário
    Object.assign(form, {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    })
    
    // Redirecionar após um delay
    setTimeout(() => {
      router.push('/login')
    }, 3000)
    
  } catch (error) {
    // Erro já é tratado no store
    console.error('Erro no cadastro:', error)
  }
}
</script>

