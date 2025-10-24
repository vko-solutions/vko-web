<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-72 bg-white border-r border-gray-200 flex flex-col">
      <div class="flex h-16 items-center gap-2 border-b px-4">
        <div class="h-8 w-8 bg-blue-800 rounded flex items-center justify-center">
          <span class="text-white font-bold text-xs">VKO</span>
        </div>
        <span class="font-semibold text-blue-800">VKO Solution</span>
        <span class="ml-auto px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">RBAC</span>
      </div>
      <nav class="flex-1 p-3 space-y-1">
        <router-link
          to="/app"
          class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition hover:bg-gray-100"
        >
          <span class="text-lg">📊</span>
          <span class="truncate">Dashboard</span>
        </router-link>
        <router-link
          to="/app/reports"
          class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition hover:bg-gray-100"
        >
          <span class="text-lg">📋</span>
          <span class="truncate">Relatórios</span>
        </router-link>
        <router-link
          to="/app/admin/permissions"
          class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition hover:bg-gray-100"
        >
          <span class="text-lg">🔒</span>
          <span class="truncate">Permissões</span>
        </router-link>
        <router-link
          to="/app/settings"
          class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition hover:bg-gray-100"
        >
          <span class="text-lg">⚙️</span>
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