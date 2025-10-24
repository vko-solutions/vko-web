<template>
  <aside
    :class="[
      'w-72 bg-white border-r border-gray-200 flex flex-col',
      show ? 'fixed inset-y-0 left-0 z-40 md:static' : 'hidden md:flex'
    ]"
  >
    <div class="flex h-16 items-center gap-2 border-b px-4">
      <div class="h-8 w-8 bg-[#2B4C7E] rounded flex items-center justify-center">
        <span class="text-white font-bold text-xs">VKO</span>
      </div>
      <span class="font-semibold text-[#2B4C7E]">VKO Solution</span>
      <Badge variant="outline" className="ml-auto">RBAC</Badge>
      <button
        v-if="show"
        @click="$emit('close')"
        class="md:hidden ml-auto p-1 rounded hover:bg-gray-100"
        aria-label="Fechar menu"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <nav class="flex-1 p-3 space-y-1">
      <router-link
        v-for="item in navItems"
        :key="item.key"
        :to="item.to"
        class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition hover:bg-gray-100"
        :class="{ 'bg-gray-100': item.key === activeKey }"
      >
        <span class="text-lg">{{ item.icon }}</span>
        <span class="truncate">{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Badge from '@/components/UI/Badge.vue'

defineProps<{
  show: boolean
  activeKey?: string
}>()

defineEmits<{
  close: []
}>()

const navItems = computed(() => {
  return [
    { icon: '📊', label: 'Dashboard', key: 'dashboard', to: '/app' },
    { icon: '📋', label: 'Relatórios', key: 'projects', to: '/app/reports' },
    { icon: '🔒', label: 'Permissões', key: 'permissions', to: '/app/admin/permissions' },
    { icon: '⚙️', label: 'Configurações', key: 'settings', to: '/app/settings' },
  ]
})
</script>
