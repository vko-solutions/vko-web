<template>
  <div class="flex items-center gap-3 rounded-xl p-2 hover:bg-gray-50 transition-colors">
    <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-medium text-gray-900">{{ title }}</p>
      <p v-if="due" class="truncate text-xs text-gray-500">{{ due }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  due?: string
  status?: 'todo' | 'doing' | 'done' | 'blocked'
}>()
</script>
