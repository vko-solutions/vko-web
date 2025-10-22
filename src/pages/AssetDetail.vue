<!--
  =====================================================
  VKO Solution - Asset Detail Page
  =====================================================
  
  Para ajustar cores/estilos, modifique as classes Tailwind abaixo:
  - Fundo: bg-[#FFFFFF] (Branco Puro)
  - Cards: border-[#E8ECEF] (Cinza Névoa)
  - Status ativo: bg-[#7AC29A] (Verde Sálvia)
  - Status inativo: bg-[#F87171] (Coral Suave)
-->

<template>
  <div v-if="loading" class="flex justify-center py-12">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B4C7E]"></div>
  </div>
  
  <div v-else-if="!asset" class="text-center py-12">
    <svg class="mx-auto h-12 w-12 text-[#E8ECEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
    <h3 class="mt-2 text-sm font-medium text-[#6C737F]">Ativo não encontrado</h3>
    <p class="mt-1 text-sm text-[#6C737F]">O ativo solicitado não existe ou você não tem permissão para visualizá-lo.</p>
    <div class="mt-6">
      <UIButton variant="primary" @click="$router.push('/app/assets')">
        Voltar para Ativos
      </UIButton>
    </div>
  </div>
  
  <div v-else class="space-y-6">
    <!-- Header do ativo -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
      <div>
        <h1 class="text-3xl font-bold text-[#2B4C7E]">{{ asset.name }}</h1>
        <div class="mt-2 flex items-center space-x-4">
          <span
            :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
              asset.status === 'active'
                ? 'bg-[#7AC29A]/10 text-[#7AC29A]'
                : 'bg-[#F87171]/10 text-[#F87171]'
            ]"
          >
            {{ asset.status === 'active' ? 'Ativo' : 'Inativo' }}
          </span>
          <span class="text-sm text-[#6C737F]">
            Criado em {{ formatDate(asset.created_at) }}
          </span>
        </div>
      </div>
      
      <div class="flex space-x-3">
        <UIButton
          variant="outline"
          @click="$router.push('/app/assets')"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar
        </UIButton>
        
        <UIButton
          v-if="permissionsStore.canEditAsset(asset.id)"
          variant="secondary"
          @click="showEditModal = true"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </UIButton>
      </div>
    </div>
    
    <!-- Informações principais -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Informações básicas -->
      <div class="lg:col-span-2">
        <UICard>
          <template #header>
            <h2 class="text-xl font-semibold text-[#2B4C7E]">Informações Básicas</h2>
          </template>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-[#6C737F]">Nome do Ativo</label>
              <p class="mt-1 text-sm text-[#2B4C7E]">{{ asset.name }}</p>
            </div>
            
            <div v-if="asset.address">
              <label class="block text-sm font-medium text-[#6C737F]">Endereço</label>
              <p class="mt-1 text-sm text-[#2B4C7E]">{{ asset.address }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-[#6C737F]">Status</label>
              <div class="mt-1">
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
            </div>
            
            <div>
              <label class="block text-sm font-medium text-[#6C737F]">ID do Ativo</label>
              <p class="mt-1 text-sm text-[#6C737F] font-mono">{{ asset.id }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-[#6C737F]">Data de Criação</label>
              <p class="mt-1 text-sm text-[#2B4C7E]">{{ formatDate(asset.created_at) }}</p>
            </div>
          </div>
        </UICard>
      </div>
      
      <!-- Informações da empresa -->
      <div>
        <UICard>
          <template #header>
            <h2 class="text-xl font-semibold text-[#2B4C7E]">Empresa</h2>
          </template>
          
          <div v-if="company" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-[#6C737F]">Nome da Empresa</label>
              <p class="mt-1 text-sm text-[#2B4C7E]">{{ company.name }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-[#6C737F]">ID da Empresa</label>
              <p class="mt-1 text-sm text-[#6C737F] font-mono">{{ company.id }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-[#6C737F]">Data de Criação</label>
              <p class="mt-1 text-sm text-[#2B4C7E]">{{ formatDate(company.created_at) }}</p>
            </div>
          </div>
          
          <div v-else class="text-center py-4">
            <svg class="mx-auto h-8 w-8 text-[#E8ECEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p class="mt-2 text-sm text-[#6C737F]">Nenhuma empresa vinculada</p>
          </div>
        </UICard>
        
        <!-- Ações rápidas -->
        <UICard class="mt-6">
          <template #header>
            <h2 class="text-xl font-semibold text-[#2B4C7E]">Ações</h2>
          </template>
          
          <div class="space-y-3">
            <UIButton
              variant="outline"
              size="sm"
              full-width
              @click="copyAssetId"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar ID
            </UIButton>
            
            <UIButton
              v-if="permissionsStore.canDeleteAsset(asset.id)"
              variant="danger"
              size="sm"
              full-width
              @click="showDeleteModal = true"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Excluir Ativo
            </UIButton>
          </div>
        </UICard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePermissionsStore } from '@/stores/permissions'
import { AssetsService } from '@/services/assets'
import type { Asset, Company } from '@/services/assets'
import UICard from '@/components/UI/Card.vue'
import UIButton from '@/components/UI/Button.vue'

const route = useRoute()
const router = useRouter()
const permissionsStore = usePermissionsStore()

// State
const asset = ref<Asset | null>(null)
const company = ref<Company | null>(null)
const loading = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// Computed
const assetId = computed(() => route.params.id as string)

// Methods
const loadAsset = async () => {
  if (!assetId.value) return
  
  try {
    loading.value = true
    
    // Carregar ativo
    const assetData = await AssetsService.getAssetById(assetId.value)
    
    if (!assetData) {
      asset.value = null
      return
    }
    
    // Verificar permissão client-side (defesa em profundidade)
    if (!permissionsStore.canSeeAsset(assetData.company_id, assetData.id)) {
      router.push('/app/assets')
      return
    }
    
    asset.value = assetData
    
    // Carregar empresa se existir
    if (assetData.company_id) {
      const companyData = await AssetsService.getCompanyById(assetData.company_id)
      company.value = companyData
    }
    
  } catch (error) {
    console.error('Erro ao carregar ativo:', error)
    router.push('/app/assets')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const copyAssetId = async () => {
  if (!asset.value) return
  
  try {
    await navigator.clipboard.writeText(asset.value.id)
    // Aqui você poderia mostrar uma notificação de sucesso
    console.log('ID copiado para a área de transferência')
  } catch (error) {
    console.error('Erro ao copiar ID:', error)
  }
}

// Lifecycle
onMounted(() => {
  loadAsset()
})
</script>


