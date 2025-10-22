<!--
  =====================================================
  VKO Solution - Button Component
  =====================================================
  
  Para ajustar cores/estilos, modifique as classes Tailwind abaixo:
  - Primária: bg-[#2B4C7E] (Azul Aço)
  - Secundária: bg-[#7AC29A] (Verde Sálvia)
  - Erro: bg-[#F87171] (Coral Suave)
  - Neutros: bg-[#6C737F] (Cinza Urbano)
-->

<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <div v-if="loading" class="flex items-center justify-center">
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {{ loadingText }}
    </div>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  loadingText: 'Carregando...',
  fullWidth: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-[#2B4C7E] text-white hover:bg-[#1e3556] focus:ring-[#2B4C7E] shadow-sm hover:shadow-md',
    secondary: 'bg-[#7AC29A] text-white hover:bg-[#6ba889] focus:ring-[#7AC29A] shadow-sm hover:shadow-md',
    danger: 'bg-[#F87171] text-white hover:bg-[#f56565] focus:ring-[#F87171] shadow-sm hover:shadow-md',
    outline: 'border-2 border-[#2B4C7E] text-[#2B4C7E] hover:bg-[#2B4C7E] hover:text-white focus:ring-[#2B4C7E]',
    ghost: 'text-[#6C737F] hover:bg-[#E8ECEF] hover:text-[#2B4C7E] focus:ring-[#2B4C7E]'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const widthClasses = props.fullWidth ? 'w-full' : ''
  
  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    widthClasses
  ].join(' ')
})
</script>

