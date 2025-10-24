<template>
  <header class="sticky top-0 z-30 border-b bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center gap-2">
        <button
          @click="$emit('toggleSidebar')"
          class="md:hidden p-2 rounded hover:bg-gray-100"
          aria-label="Abrir menu"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        
        <div class="relative hidden md:flex w-full max-w-md ml-1 items-center">
          <svg class="pointer-events-none absolute left-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            placeholder="Buscar…"
            class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-[#2B4C7E]"
            aria-label="Campo de busca"
          />
        </div>
        
        <div class="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="rounded-xl">
            <span class="mr-1">🔒</span> {{ role }}
          </Badge>
          <button class="p-2 rounded hover:bg-gray-100" aria-label="Notificações">
            <svg class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6V1H4v4zM15 5h6V1h-6v4z"></path>
            </svg>
          </button>
          <div class="h-8 w-8 bg-[#2B4C7E] rounded-full flex items-center justify-center">
            <span class="text-white text-xs font-bold">
              {{ userEmail?.slice(0, 2).toUpperCase() || 'VK' }}
            </span>
          </div>
          <button 
            @click="$emit('signOut')"
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
</template>

<script setup lang="ts">
import Badge from '@/components/UI/Badge.vue'

defineProps<{
  userEmail?: string
  role?: string
}>()

defineEmits<{
  toggleSidebar: []
  signOut: []
}>()
</script>
