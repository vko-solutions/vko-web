<!--
  =====================================================
  VKO Solution - Input Component
  =====================================================
  
  Para ajustar cores/estilos, modifique as classes Tailwind abaixo:
  - Foco: border-[#2B4C7E] (Azul Aço)
  - Erro: border-[#F87171] (Coral Suave)
  - Placeholder: text-[#6C737F] (Cinza Urbano)
-->

<template>
  <div class="space-y-1">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-[#2B4C7E]">
      {{ label }}
      <span v-if="required" class="text-[#F87171]">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      
      <div v-if="error" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-[#F87171]" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    
    <p v-if="error" class="text-sm text-[#F87171]">{{ error }}</p>
    <p v-else-if="help" class="text-sm text-[#6C737F]">{{ help }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  label?: string
  placeholder?: string
  help?: string
  error?: string
  disabled?: boolean
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  size: 'md'
})

defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => {
  const baseClasses = 'block w-full rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0'
  
  const stateClasses = props.error 
    ? 'border-[#F87171] focus:border-[#F87171] focus:ring-[#F87171]' 
    : 'border-[#E8ECEF] focus:border-[#2B4C7E] focus:ring-[#2B4C7E]'
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  }
  
  const disabledClasses = props.disabled ? 'bg-[#E8ECEF] cursor-not-allowed' : 'bg-white'
  
  return [
    baseClasses,
    stateClasses,
    sizeClasses[props.size],
    disabledClasses
  ].join(' ')
})
</script>

