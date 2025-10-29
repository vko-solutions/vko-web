<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-72 bg-white border-r border-gray-200 flex flex-col shadow-xl">
      <div class="flex h-16 items-center gap-2 border-b px-4 bg-gradient-to-r from-[#2B4C7E] to-[#1e3556]">
        <div class="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <span class="text-white font-bold text-sm">VKO</span>
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-white text-sm">VKO Solution</span>
          <span class="text-xs text-white/80">Gestão Técnica</span>
        </div>
        <span class="ml-auto px-2 py-1 bg-white/20 text-white text-xs rounded backdrop-blur-sm">RBAC</span>
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <router-link
          to="/app"
          active-class="bg-[#2B4C7E]/10 text-[#2B4C7E] font-medium shadow-sm"
          class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all hover:bg-gray-50 group"
        >
          <svg class="w-5 h-5 text-gray-600 group-hover:text-[#2B4C7E] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          <span class="truncate">Dashboard</span>
        </router-link>
        <router-link
          to="/app/reports"
          active-class="bg-[#2B4C7E]/10 text-[#2B4C7E] font-medium shadow-sm"
          class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all hover:bg-gray-50 group"
        >
          <svg class="w-5 h-5 text-gray-600 group-hover:text-[#2B4C7E] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span class="truncate">Relatórios</span>
        </router-link>
        <router-link
          to="/app/admin/permissions"
          active-class="bg-[#2B4C7E]/10 text-[#2B4C7E] font-medium shadow-sm"
          class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all hover:bg-gray-50 group"
        >
          <svg class="w-5 h-5 text-gray-600 group-hover:text-[#2B4C7E] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          <span class="truncate">Permissões</span>
        </router-link>
        <router-link
          to="/app/admin/assets"
          active-class="bg-[#2B4C7E]/10 text-[#2B4C7E] font-medium shadow-sm"
          class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all hover:bg-gray-50 group"
        >
          <svg class="w-5 h-5 text-gray-600 group-hover:text-[#2B4C7E] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <span class="truncate">Ativos</span>
        </router-link>
        <router-link
          to="/app/admin/checks"
          active-class="bg-[#2B4C7E]/10 text-[#2B4C7E] font-medium shadow-sm"
          class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all hover:bg-gray-50 group"
        >
          <svg class="w-5 h-5 text-gray-600 group-hover:text-[#2B4C7E] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          <span class="truncate">Diagnóstico</span>
        </router-link>
        <router-link
          to="/app/settings"
          active-class="bg-[#2B4C7E]/10 text-[#2B4C7E] font-medium shadow-sm"
          class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all hover:bg-gray-50 group"
        >
          <svg class="w-5 h-5 text-gray-600 group-hover:text-[#2B4C7E] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span class="truncate">Configurações</span>
        </router-link>
      </nav>
    </aside>

    <!-- Conteúdo principal -->
    <div class="flex-1 flex flex-col">
      <!-- Topbar -->
      <header class="sticky top-0 z-30 border-b bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center gap-2">
            <div class="relative hidden md:flex w-full max-w-md ml-1 items-center">
              <svg class="pointer-events-none absolute left-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                placeholder="Buscar…"
                class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Campo de busca"
              />
            </div>
            
            <div class="ml-auto flex items-center gap-2">
              <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                🔒 {{ auth.profile?.role || 'asset_governance' }}
              </span>
              <div class="h-8 w-8 bg-blue-800 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-bold">
                  {{ (auth.profile?.email || auth.session?.user?.email || 'VK').slice(0, 2).toUpperCase() }}
                </span>
              </div>
              <button 
                @click="handleSignOut"
                class="p-2 rounded hover:bg-gray-100"
                aria-label="Sair"
              >
                <svg class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Área de conteúdo -->
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuth()
const router = useRouter()

const handleSignOut = async () => {
  try {
    await auth.signOut()
    router.push('/login')
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  }
}
</script>