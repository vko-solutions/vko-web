<!--
  =====================================================
  VKO Solution - Main App Component
  =====================================================
  
  Para ajustar cores/estilos, modifique as classes Tailwind abaixo:
  - Fundo: bg-[#FFFFFF] (Branco Puro)
  - Fonte: font-sans (fonte padrão)
-->

<template>
  <div id="app" class="min-h-screen bg-white font-sans">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// App component - sem lógica adicional necessária
</script>

<style>
/* Estilos globais */
html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #2B4C7E;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #1e3556;
}

/* Animações de entrada */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transições de página */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>

