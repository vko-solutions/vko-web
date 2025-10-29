<!--
  =====================================================
  VKO Solution - Landing Page
  =====================================================
  
  Para ajustar cores/estilos, modifique as classes Tailwind abaixo:
  - Fundo: bg-[#FFFFFF] (Branco Puro)
  - Primária: bg-[#2B4C7E] (Azul Aço)
  - Secundária: bg-[#7AC29A] (Verde Sálvia)
  - Neutros: text-[#6C737F] (Cinza Urbano), border-[#E8ECEF] (Cinza Névoa)
-->

<template>
  <div class="min-h-screen bg-[#FFFFFF] relative overflow-hidden">
    <!-- Header Fixo -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-sm border-b border-[#E8ECEF]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo VKO -->
          <div class="flex items-center">
            <div class="flex items-center">
              <!-- Logo Oficial VKO -->
              <svg width="100" height="35" viewBox="0 0 100 35" fill="none" xmlns="http://www.w3.org/2000/svg" class="border border-[#2B4C7E]/20 rounded-lg">
                <rect x="0.5" y="0.5" width="99" height="34" stroke="#E5E7EB" fill="white" rx="4"/>
                <text x="50" y="18" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#1F2937">VKO</text>
                <text x="50" y="28" text-anchor="middle" font-family="Arial, sans-serif" font-size="7" font-weight="300" fill="#1F2937">SOLUTION</text>
              </svg>
            </div>
          </div>
          
          <!-- Botões Login e Cadastro -->
          <div class="flex items-center space-x-3">
            <button 
              @click="handleLogin"
              class="px-4 py-2 text-sm font-medium text-[#2B4C7E] bg-transparent border border-[#2B4C7E] rounded-lg hover:bg-[#2B4C7E] hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Login
            </button>
            <button 
              @click="handleCadastro"
              class="px-4 py-2 text-sm font-medium text-white bg-[#2B4C7E] rounded-lg hover:bg-[#1e3556] transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Cadastro
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Conteúdo Principal -->
    <main class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      <div class="max-w-6xl mx-auto text-center">
        <!-- Container Principal -->
        <div class="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-16 animate-fade-in">
          
          <!-- Logo Grande -->
          <div class="flex-shrink-0 animate-slide-up">
            <div class="relative">
              <!-- Logo Oficial VKO Grande -->
              <div class="bg-white rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-500 p-10 border-2 border-[#2B4C7E]/20">
                <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="299" height="299" stroke="#E5E7EB" fill="white" rx="16"/>
                  <text x="150" y="130" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#1F2937">VKO</text>
                  <text x="150" y="180" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="300" fill="#1F2937">SOLUTION</text>
                </svg>
              </div>
              
              <!-- Elementos Decorativos -->
              <div class="absolute -top-4 -right-4 w-8 h-8 bg-[#5B8CBE] rounded-full opacity-80 animate-pulse"></div>
              <div class="absolute -bottom-4 -left-4 w-6 h-6 bg-[#A7C7E7] rounded-full opacity-60 animate-pulse" style="animation-delay: 1s;"></div>
            </div>
          </div>

          <!-- Apresentação de Impacto -->
          <div class="flex-1 max-w-3xl animate-slide-up" style="animation-delay: 0.3s;">
            <div class="space-y-8">
              <!-- Título Principal -->
              <div class="text-center">
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2B4C7E] leading-tight mb-4">
                  Da engenharia à
                  <br class="hidden sm:block">
                  <span class="text-[#5B8CBE]">inovação habitacional</span>
                </h1>
                
                <!-- Linha decorativa -->
                <div class="w-24 h-1 bg-gradient-to-r from-[#2B4C7E] to-[#A7C7E7] mx-auto rounded-full"></div>
              </div>
              
              <!-- Texto de Apresentação -->
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#2B4C7E]/10">
                <div class="text-center space-y-6">
                  <!-- Primeira linha de impacto -->
                  <p class="text-xl sm:text-2xl font-semibold text-[#2B4C7E] leading-relaxed">
                    Somos o elo entre a engenharia e a inteligência.
                  </p>
                  
                  <!-- Texto principal -->
                  <div class="text-base sm:text-lg text-[#6C737F] leading-relaxed space-y-4">
                    <p>
                      Desenvolvemos soluções que ampliam a eficiência, otimizam a gestão de ativos, e constroem o caminho para um futuro habitacional mais conectado e inteligente.
                    </p>
                  </div>
                  
                  <!-- Elementos visuais -->
                  <div class="flex justify-center items-center space-x-8 pt-4">
                    <div class="flex items-center space-x-2">
                      <div class="w-3 h-3 bg-[#2B4C7E] rounded-full"></div>
                      <span class="text-sm font-medium text-[#2B4C7E]">Eficiência</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-3 h-3 bg-[#5B8CBE] rounded-full"></div>
                      <span class="text-sm font-medium text-[#5B8CBE]">Otimização</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-3 h-3 bg-[#A7C7E7] rounded-full"></div>
                      <span class="text-sm font-medium text-[#A7C7E7]">Inovação</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Elementos Decorativos de Fundo -->
        <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <!-- Círculos Flutuantes -->
          <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-[#A7C7E7]/10 rounded-full blur-xl animate-pulse"></div>
          <div class="absolute top-3/4 right-1/4 w-24 h-24 bg-[#5B8CBE]/10 rounded-full blur-xl animate-pulse" style="animation-delay: 2s;"></div>
          <div class="absolute bottom-1/4 left-1/3 w-20 h-20 bg-[#2B4C7E]/5 rounded-full blur-xl animate-pulse" style="animation-delay: 4s;"></div>
          
          <!-- Linhas Decorativas -->
          <div class="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E8ECEF] to-transparent"></div>
          <div class="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#E8ECEF] to-transparent"></div>
          
          <!-- Elementos Geométricos -->
          <div class="absolute top-1/3 right-1/3 w-16 h-16 border border-[#2B4C7E]/20 rotate-45 animate-spin" style="animation-duration: 20s;"></div>
          <div class="absolute bottom-1/3 left-1/4 w-12 h-12 border border-[#5B8CBE]/20 rotate-12 animate-pulse"></div>
        </div>
        
        <!-- Call to Action -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in" style="animation-delay: 1s;">
          <div class="flex flex-col items-center space-y-4">
            <div class="text-sm text-[#6C737F]/60 font-medium">
              Descubra nossas soluções
            </div>
            <div class="w-8 h-8 border-2 border-[#2B4C7E]/30 rounded-full flex items-center justify-center animate-bounce">
              <svg class="w-4 h-4 text-[#2B4C7E]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// Funções dos botões
const handleLogin = () => {
  router.push('/login')
}

const handleCadastro = () => {
  router.push('/register')
}
</script>

<style scoped>
/* Animações personalizadas */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Animações Tailwind personalizadas */
.animate-fade-in {
  animation: fadeInUp 0.8s ease-out;
}

.animate-slide-up {
  animation: slideInLeft 0.8s ease-out;
}

/* Responsividade adicional */
@media (max-width: 640px) {
  .typing-text {
    font-size: 1.125rem;
  }
}

@media (min-width: 1024px) {
  .typing-text {
    font-size: 1.25rem;
  }
}
</style>