<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'px-4 py-2 rounded-lg font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      variantClasses,
      disabled && 'opacity-50 cursor-not-allowed',
      className
    ]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
}>()

defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-[#2B4C7E] text-white hover:bg-[#1e3556] focus:ring-[#2B4C7E]'
    case 'secondary':
      return 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500'
    case 'ghost':
      return 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
    case 'outline':
      return 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
    default:
      return 'bg-[#2B4C7E] text-white hover:bg-[#1e3556] focus:ring-[#2B4C7E]'
  }
})
</script>