<template>
  <span
    :class="[
      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
      variantClasses
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'default' | 'outline' | 'success' | 'error'
}>()

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'outline':
      return 'bg-white border border-gray-300 text-gray-700'
    case 'success':
      return 'bg-green-100 text-green-700'
    case 'error':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-[#2B4C7E] text-white'
  }
})
</script>
