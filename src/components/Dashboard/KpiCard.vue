<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="pb-2">
      <div class="text-xs uppercase tracking-wide text-gray-500">{{ title }}</div>
      <div class="text-2xl md:text-3xl font-bold text-[#2B4C7E]">{{ value }}</div>
    </div>
    <div v-if="description || typeof progress === 'number'" class="pt-0">
      <p v-if="description" class="text-sm text-gray-600">{{ description }}</p>
      <div v-if="typeof progress === 'number'" class="mt-3">
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full bg-[#2B4C7E] transition-all duration-500"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  description?: string
  progress?: number
}>()
</script>
