<!--
  =====================================================
  VKO Solution - Assets List Page
  =====================================================
  
  Para ajustar cores/estilos, modifique as classes Tailwind abaixo:
  - Fundo: bg-[#FFFFFF] (Branco Puro)
  - Cards: border-[#E8ECEF] (Cinza Névoa)
  - Status ativo: bg-[#7AC29A] (Verde Sálvia)
  - Status inativo: bg-[#F87171] (Coral Suave)
-->

<template>
  <div class="space-y-6">
    <!-- Filtros e ações -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <!-- Filtros -->
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <select
          v-model="filters.status"
          class="px-3 py-2 border border-[#E8ECEF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-[#2B4C7E]"
        >
          <option value="">Todos os status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>
        
        <input
          v-model="filters.search"
          type="text"
          placeholder="Buscar ativos..."
          class="px-3 py-2 border border-[#E8ECEF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-[#2B4C7E]"
        />
      </div>
      
      <!-- Ações -->
      <div class="flex space-x-2">
        <UIButton
          variant="outline"
          size="sm"
          @click="refreshAssets"
          :loading="loading"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Atualizar
        </UIButton>
        
        <UIButton
          v-if="permissionsStore.isAdmin"
          variant="secondary"
          size="sm"
          @click="showCreateModal = true"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Novo Ativo
        </UIButton>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading && assets.length === 0" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B4C7E]"></div>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="filteredAssets.length === 0 && !loading" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-[#E8ECEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-[#6C737F]">Nenhum ativo encontrado</h3>
      <p class="mt-1 text-sm text-[#6C737F]">
        {{ filters.search || filters.status ? 'Tente ajustar os filtros de busca.' : 'Comece criando um novo ativo.' }}
      </p>
    </div>
    
    <!-- Lista de ativos -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UICard
        v-for="asset in filteredAssets"
        :key="asset.id"
        hover
        clickable
        @click="$router.push(`/app/assets/${asset.id}`)"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-[#2B4C7E] truncate">
              {{ asset.name }}
            </h3>
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                asset.status === 'active'
                  ? 'bg-[#7AC29A]/10 text-[#7AC29A]'
                  : 'bg-[#F87171]/10 text-[#F87171]'
              ]"
            >
              {{ asset.status === 'active' ? 'Ativo' : 'Inativo' }}
            </span>
          </div>
        </template>
        
        <div class="space-y-3">
          <div v-if="asset.address" class="flex items-start space-x-2">
            <svg class="w-4 h-4 text-[#6C737F] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p class="text-sm text-[#6C737F]">{{ asset.address }}</p>
          </div>
          
          <div class="flex items-center space-x-2 text-xs text-[#6C737F]">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDate(asset.created_at) }}</span>
          </div>
        </div>
        
        <template #footer>
          <div class="flex justify-between items-center">
            <span class="text-xs text-[#6C737F]">
              ID: {{ asset.id.slice(0, 8) }}...
            </span>
            <div class="flex space-x-2">
              <UIButton
                variant="ghost"
                size="sm"
                @click.stop="$router.push(`/app/assets/${asset.id}`)"
              >
                Ver detalhes
              </UIButton>
            </div>
          </div>
        </template>
      </UICard>
    </div>
    
    <!-- Paginação (se necessário) -->
    <div v-if="totalPages > 1" class="flex justify-center">
      <nav class="flex space-x-2">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
            currentPage === page
              ? 'bg-[#2B4C7E] text-white'
              : 'text-[#6C737F] hover:bg-[#E8ECEF] hover:text-[#2B4C7E]'
          ]"
        >
          {{ page }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePermissionsStore } from '@/stores/permissions'
import { AssetsService } from '@/services/assets'
import type { Asset } from '@/services/assets'
import UICard from '@/components/UI/Card.vue'
import UIButton from '@/components/UI/Button.vue'

const permissionsStore = usePermissionsStore()

// State
const assets = ref<Asset[]>([])
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 12

const filters = ref({
  search: '',
  status: ''
})

const showCreateModal = ref(false)

// Computed
const filteredAssets = computed(() => {
  let filtered = assets.value
  
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(asset =>
      asset.name.toLowerCase().includes(search) ||
      asset.address?.toLowerCase().includes(search)
    )
  }
  
  if (filters.value.status) {
    filtered = filtered.filter(asset => asset.status === filters.value.status)
  }
  
  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredAssets.value.length / itemsPerPage)
})

// Methods
const loadAssets = async () => {
  try {
    loading.value = true
    const data = await AssetsService.listVisibleAssets()
    assets.value = data
  } catch (error) {
    console.error('Erro ao carregar ativos:', error)
  } finally {
    loading.value = false
  }
}

const refreshAssets = () => {
  loadAssets()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

// Lifecycle
onMounted(() => {
  loadAssets()
})
</script>


