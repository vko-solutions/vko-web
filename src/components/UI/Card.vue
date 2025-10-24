<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div v-if="title || description" class="pb-4">
      <h3 v-if="title" class="text-lg font-semibold text-[#2B4C7E]">{{ title }}</h3>
      <p v-if="description" class="text-sm text-gray-600 mt-1">{{ description }}</p>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>