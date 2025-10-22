<!--
  =====================================================
  VKO Solution - App Layout
  =====================================================
  
  Para ajustar cores/estilos, modifique as classes Tailwind abaixo:
  - Fundo: bg-[#FFFFFF] (Branco Puro)
  - Container: max-w-7xl (largura máxima)
  - Espaçamento: px-4 sm:px-6 lg:px-8 (padding responsivo)
-->

<template>
  <div class="min-h-screen bg-[#FFFFFF]">
    <!-- Header -->
    <Header />
    
    <!-- Conteúdo principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb (opcional) -->
      <nav v-if="showBreadcrumb" class="flex mb-6" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-4">
          <li>
            <router-link to="/app" class="text-[#6C737F] hover:text-[#2B4C7E] transition-colors duration-200">
              <svg class="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span class="sr-only">Home</span>
            </router-link>
          </li>
          <li v-for="item in breadcrumbItems" :key="item.name">
            <div class="flex items-center">
              <svg class="flex-shrink-0 h-5 w-5 text-[#E8ECEF]" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <router-link
                v-if="item.href"
                :to="item.href"
                class="ml-4 text-sm font-medium text-[#6C737F] hover:text-[#2B4C7E] transition-colors duration-200"
              >
                {{ item.name }}
              </router-link>
              <span v-else class="ml-4 text-sm font-medium text-[#2B4C7E]">
                {{ item.name }}
              </span>
            </div>
          </li>
        </ol>
      </nav>
      
      <!-- Título da página -->
      <div v-if="pageTitle" class="mb-8">
        <h1 class="text-3xl font-bold text-[#2B4C7E]">{{ pageTitle }}</h1>
        <p v-if="pageDescription" class="mt-2 text-[#6C737F]">{{ pageDescription }}</p>
      </div>
      
      <!-- Conteúdo da página -->
      <div class="space-y-6">
        <router-view />
      </div>
    </main>
    
    <!-- Footer (opcional) -->
    <footer class="bg-[#E8ECEF]/20 border-t border-[#E8ECEF] mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-sm text-[#6C737F]">
          <p>&copy; {{ currentYear }} VKO Solution. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'

const route = useRoute()

const currentYear = computed(() => new Date().getFullYear())

// Configuração do breadcrumb baseada na rota atual
const showBreadcrumb = computed(() => {
  return route.path !== '/app'
})

const breadcrumbItems = computed(() => {
  const items = []
  
  if (route.path.startsWith('/app/assets')) {
    items.push({
      name: 'Ativos',
      href: '/app/assets'
    })
    
    if (route.params.id) {
      items.push({
        name: `Ativo ${route.params.id}`,
        href: null
      })
    }
  }
  
  return items
})

// Título da página baseado na rota
const pageTitle = computed(() => {
  switch (route.name) {
    case 'AssetsList':
      return 'Ativos'
    case 'AssetDetail':
      return 'Detalhes do Ativo'
    default:
      return null
  }
})

const pageDescription = computed(() => {
  switch (route.name) {
    case 'AssetsList':
      return 'Gerencie e visualize todos os ativos disponíveis'
    case 'AssetDetail':
      return 'Visualize informações detalhadas sobre este ativo'
    default:
      return null
  }
})
</script>


