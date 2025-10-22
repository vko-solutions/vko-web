<!--
  =====================================================
  VKO Solution - Card Component
  =====================================================
  
  Para ajustar cores/estilos, modifique as classes Tailwind abaixo:
  - Fundo: bg-white (Branco Puro)
  - Borda: border-[#E8ECEF] (Cinza Névoa)
  - Sombra: shadow-sm (sombra leve)
-->

<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="px-6 py-4 border-b border-[#E8ECEF]">
      <slot name="header" />
    </div>
    
    <div :class="bodyClasses">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-[#E8ECEF] bg-[#E8ECEF]/20">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  shadow: 'sm',
  hover: false,
  clickable: false
})

const cardClasses = computed(() => {
  const baseClasses = 'bg-white rounded-lg border border-[#E8ECEF] overflow-hidden'
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }
  
  const hoverClasses = props.hover ? 'hover:shadow-md transition-shadow duration-200' : ''
  const clickableClasses = props.clickable ? 'cursor-pointer hover:scale-[1.02] transition-transform duration-200' : ''
  
  return [
    baseClasses,
    shadowClasses[props.shadow],
    hoverClasses,
    clickableClasses
  ].join(' ')
})

const bodyClasses = computed(() => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return paddingClasses[props.padding]
})
</script>

