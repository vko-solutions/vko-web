<template>
  <div class="flex items-start gap-3 rounded-xl p-2 hover:bg-gray-50 transition-colors">
    <div class="mt-0.5">
      <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
    </div>
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-medium text-gray-900">{{ title }}</p>
      <p class="truncate text-xs text-gray-500">{{ meta }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: any
  title: string
  meta: string
}>()
</script>
