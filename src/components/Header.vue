<!--
  =====================================================
  VKO Solution - Header Component
  =====================================================
  
  Para ajustar cores/estilos, modifique as classes Tailwind abaixo:
  - Fundo: bg-white (Branco Puro)
  - Sombra: shadow-sm (sombra leve)
  - Logo: border-[#2B4C7E]/20 (Azul Aço com transparência)
-->

<template>
  <header class="bg-white shadow-sm border-b border-[#E8ECEF] sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo VKO -->
        <div class="flex items-center">
          <router-link to="/app" class="flex items-center">
            <svg width="100" height="35" viewBox="0 0 100 35" fill="none" xmlns="http://www.w3.org/2000/svg" class="border border-[#2B4C7E]/20 rounded-lg">
              <rect x="0.5" y="0.5" width="99" height="34" stroke="#E5E7EB" fill="white" rx="4"/>
              <text x="50" y="18" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#1F2937">VKO</text>
              <text x="50" y="28" text-anchor="middle" font-family="Arial, sans-serif" font-size="7" font-weight="300" fill="#1F2937">SOLUTION</text>
            </svg>
          </router-link>
        </div>
        
        <!-- Menu do usuário -->
        <div class="flex items-center space-x-4">
          <!-- Informações do usuário -->
          <div class="hidden sm:flex items-center space-x-3">
            <div class="text-right">
              <p class="text-sm font-medium text-[#2B4C7E]">{{ authStore.profile?.name || 'Usuário' }}</p>
              <p class="text-xs text-[#6C737F] capitalize">{{ authStore.userRole }}</p>
            </div>
            <div class="w-8 h-8 bg-[#A7C7E7] rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-[#2B4C7E]">
                {{ (authStore.profile?.name || 'U').charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>
          
          <!-- Menu dropdown -->
          <div class="relative" ref="dropdownRef">
            <button
              @click="toggleDropdown"
              class="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#E8ECEF] transition-colors duration-200"
            >
              <svg class="w-5 h-5 text-[#6C737F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            <!-- Dropdown menu -->
            <div
              v-if="showDropdown"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E8ECEF] py-1 z-50"
            >
              <router-link
                to="/app"
                class="block px-4 py-2 text-sm text-[#6C737F] hover:bg-[#E8ECEF] hover:text-[#2B4C7E] transition-colors duration-200"
                @click="closeDropdown"
              >
                Dashboard
              </router-link>
              
              <router-link
                to="/app/assets"
                class="block px-4 py-2 text-sm text-[#6C737F] hover:bg-[#E8ECEF] hover:text-[#2B4C7E] transition-colors duration-200"
                @click="closeDropdown"
              >
                Ativos
              </router-link>
              
              <div class="border-t border-[#E8ECEF] my-1"></div>
              
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-[#F87171] hover:bg-[#E8ECEF] transition-colors duration-200"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement>()

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

const handleLogout = async () => {
  try {
    await authStore.signOut()
    router.push('/login')
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  }
}

// Fechar dropdown ao clicar fora
const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

