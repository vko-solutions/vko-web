<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-blue-800 mb-2">Gerenciamento de Permissões</h1>
        <p class="text-lg text-gray-600">Gerencie usuários, papéis e vínculos de ativos</p>
      </div>

      <!-- Tabela de Usuários -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-blue-800">Usuários do Sistema</h2>
          <p class="text-sm text-gray-600 mt-1">Gerencie papéis, empresas e vínculos de ativos</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Papel
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vínculos
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                <!-- Usuário -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.name || 'Nome não informado' }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ user.email }}
                    </div>
                  </div>
                </td>

                <!-- Papel -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <select
                    v-model="user.role"
                    @change="updateUserRole(user)"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 text-sm"
                  >
                    <option value="admin">Administrador</option>
                    <option value="partner_manager">Parceiro (Prime)</option>
                    <option value="asset_governance">Governança</option>
                  </select>
                </td>

                <!-- Empresa -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <select
                    v-model="user.company_id"
                    @change="updateUserCompany(user)"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 text-sm"
                  >
                    <option :value="null">Sem empresa</option>
                    <option v-for="company in companies" :key="company.id" :value="company.id">
                      {{ company.name }}
                    </option>
                  </select>
                </td>

                <!-- Vínculos -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    @click="openAssetModal(user)"
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#2B4C7E] hover:bg-[#1e3556] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B4C7E] transition-colors duration-200"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Gerenciar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="px-6 py-8 text-center">
          <div class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-800" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Carregando usuários...
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="users.length === 0" class="px-6 py-8 text-center text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
          <p class="mt-1 text-sm text-gray-500">Não há usuários cadastrados no sistema.</p>
        </div>
      </div>

      <!-- Modal de Vínculos de Ativos -->
      <div v-if="showAssetModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
          <!-- Header do Modal -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-[#2B4C7E]">
                Vínculos de Ativos
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                {{ selectedUser?.name || 'Usuário' }} ({{ selectedUser?.email }})
              </p>
            </div>
            <button
              @click="closeAssetModal"
              class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Conteúdo do Modal -->
          <div class="px-6 py-4 flex-1 overflow-y-auto">
            <div class="space-y-3">
              <div
                v-for="asset in assets"
                :key="asset.id"
                class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <input
                  :id="`asset-${asset.id}`"
                  type="checkbox"
                  :checked="selectedAssetIds.has(asset.id)"
                  @change="toggleAsset(asset.id, $event)"
                  class="h-4 w-4 text-[#2B4C7E] focus:ring-[#2B4C7E] border-gray-300 rounded"
                />
                <label :for="`asset-${asset.id}`" class="ml-3 flex-1 cursor-pointer">
                  <div class="text-sm font-medium text-gray-900">{{ asset.name }}</div>
                  <div class="text-sm text-gray-500">
                    Código: {{ asset.code || 'Não informado' }}
                  </div>
                </label>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="assets.length === 0" class="text-center py-8 text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum ativo encontrado</h3>
              <p class="mt-1 text-sm text-gray-500">Não há ativos cadastrados no sistema.</p>
            </div>
          </div>

          <!-- Footer do Modal -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              @click="closeAssetModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              @click="saveAssetLinks"
              :disabled="savingAssets"
              class="px-4 py-2 bg-[#2B4C7E] text-white rounded-md text-sm font-medium hover:bg-[#1e3556] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {{ savingAssets ? 'Salvando...' : 'Salvar Vínculos' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Mensagens de Feedback -->
      <div v-if="error" class="mt-4 rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Erro</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          </div>
        </div>
      </div>

      <div v-if="success" class="mt-4 rounded-md bg-green-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">Sucesso</h3>
            <p class="text-sm text-green-700 mt-1">{{ success }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/stores/auth'
import {
  listProfiles,
  listCompanies,
  listAssets,
  listUserAssets,
  adminSetRole,
  adminSetUserCompany,
  adminAddUserAsset,
  adminRemoveUserAsset
} from '@/services/admin'

const auth = useAuth()

// Tipos
type User = {
  id: string
  name: string | null
  email: string | null
  role: 'admin' | 'partner_manager' | 'asset_governance'
  company_id: string | null
}

type Company = {
  id: string
  name: string
}

type Asset = {
  id: string
  name: string
  code: string | null
}

// Estado
const users = ref<User[]>([])
const companies = ref<Company[]>([])
const assets = ref<Asset[]>([])
const loading = ref(true)
const error = ref('')
const success = ref('')

// Modal de ativos
const showAssetModal = ref(false)
const selectedUser = ref<User | null>(null)
const selectedAssetIds = ref<Set<string>>(new Set())
const savingAssets = ref(false)

// Carregar dados iniciais
const loadData = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const [usersData, companiesData, assetsData] = await Promise.all([
      listProfiles(),
      listCompanies(),
      listAssets()
    ])
    
    users.value = usersData
    companies.value = companiesData
    assets.value = assetsData
  } catch (err: any) {
    error.value = 'Erro ao carregar dados: ' + err.message
    console.error('Erro ao carregar dados:', err)
  } finally {
    loading.value = false
  }
}

// Atualizar papel do usuário
const updateUserRole = async (user: User) => {
  try {
    await adminSetRole(user.id, user.role)
    success.value = `Papel de ${user.name || user.email} atualizado para ${user.role}`
    setTimeout(() => { success.value = '' }, 3000)
  } catch (err: any) {
    error.value = 'Erro ao atualizar papel: ' + err.message
    console.error('Erro ao atualizar papel:', err)
  }
}

// Atualizar empresa do usuário
const updateUserCompany = async (user: User) => {
  try {
    await adminSetUserCompany(user.id, user.company_id)
    const companyName = user.company_id 
      ? companies.value.find(c => c.id === user.company_id)?.name || 'Empresa'
      : 'Sem empresa'
    success.value = `Empresa de ${user.name || user.email} atualizada para ${companyName}`
    setTimeout(() => { success.value = '' }, 3000)
  } catch (err: any) {
    error.value = 'Erro ao atualizar empresa: ' + err.message
    console.error('Erro ao atualizar empresa:', err)
  }
}

// Abrir modal de ativos
const openAssetModal = async (user: User) => {
  try {
    selectedUser.value = user
    const userAssetIds = await listUserAssets(user.id)
    selectedAssetIds.value = new Set(userAssetIds)
    showAssetModal.value = true
  } catch (err: any) {
    error.value = 'Erro ao carregar vínculos: ' + err.message
    console.error('Erro ao carregar vínculos:', err)
  }
}

// Fechar modal de ativos
const closeAssetModal = () => {
  showAssetModal.value = false
  selectedUser.value = null
  selectedAssetIds.value = new Set()
}

// Toggle de ativo
const toggleAsset = (assetId: string, event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  if (checked) {
    selectedAssetIds.value.add(assetId)
  } else {
    selectedAssetIds.value.delete(assetId)
  }
}

// Salvar vínculos de ativos
const saveAssetLinks = async () => {
  if (!selectedUser.value) return
  
  try {
    savingAssets.value = true
    error.value = ''
    
    // Buscar vínculos atuais
    const currentAssetIds = await listUserAssets(selectedUser.value.id)
    const currentSet = new Set(currentAssetIds)
    
    // Adicionar novos vínculos
    for (const assetId of selectedAssetIds.value) {
      if (!currentSet.has(assetId)) {
        await adminAddUserAsset(selectedUser.value.id, assetId)
      }
    }
    
    // Remover vínculos desmarcados
    for (const assetId of currentSet) {
      if (!selectedAssetIds.value.has(assetId)) {
        await adminRemoveUserAsset(selectedUser.value.id, assetId)
      }
    }
    
    success.value = `Vínculos de ativos atualizados para ${selectedUser.value.name || selectedUser.value.email}`
    setTimeout(() => { success.value = '' }, 3000)
    
    closeAssetModal()
  } catch (err: any) {
    error.value = 'Erro ao salvar vínculos: ' + err.message
    console.error('Erro ao salvar vínculos:', err)
  } finally {
    savingAssets.value = false
  }
}

// Inicializar
onMounted(async () => {
  await auth.init()
  
  // Verificar se é admin
  if (!auth.profile || auth.profile.role !== 'admin') {
    error.value = 'Acesso negado. Apenas administradores podem gerenciar permissões.'
    return
  }
  
  await loadData()
})
</script>