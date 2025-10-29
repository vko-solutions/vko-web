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
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-blue-800">Usuários do Sistema</h2>
            <p class="text-sm text-gray-600 mt-1">Gerencie papéis, empresas e vínculos de ativos</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="syncMissingProfiles"
              :disabled="loading"
              class="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              title="Sincronizar usuários do Auth sem perfil"
            >
              🔄 Sincronizar Usuários
            </button>
            <button
              @click="showDiagnostic"
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              title="Diagnóstico de usuários"
            >
              🔍 Diagnóstico
            </button>
            <button
              @click="refreshData"
              :disabled="loading"
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              {{ loading ? 'Atualizando...' : 'Atualizar' }}
            </button>
          </div>
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
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex items-center gap-2">
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
                    <span v-if="user.role === 'asset_governance' || user.role === 'partner_manager'" 
                          class="text-xs text-gray-500" 
                          title="Este usuário pode ter permissões via ACL por role">
                      🔐
                    </span>
                  </div>
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

      <!-- Modal de Gerenciamento de Permissões de Ativos -->
      <div v-if="showAssetModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          <!-- Header do Modal -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-[#2B4C7E]">
                Gerenciamento de Permissões de Ativos
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                <span class="font-medium">{{ selectedUser?.name || 'Usuário' }}</span> 
                ({{ selectedUser?.email }}) — 
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  :class="{
                    'bg-purple-100 text-purple-800': selectedUser?.role === 'admin',
                    'bg-blue-100 text-blue-800': selectedUser?.role === 'partner_manager',
                    'bg-green-100 text-green-800': selectedUser?.role === 'asset_governance'
                  }">
                  {{ selectedUser?.role === 'admin' ? 'Administrador' : 
                     selectedUser?.role === 'partner_manager' ? 'Parceiro' : 
                     'Governança' }}
                </span>
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
            <!-- Tabs: Vínculos Individuais vs ACL por Role -->
            <div class="mb-4 border-b border-gray-200">
              <nav class="-mb-px flex space-x-8">
                <button
                  @click="activeTab = 'individual'"
                  :class="[
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === 'individual'
                      ? 'border-[#2B4C7E] text-[#2B4C7E]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  Vínculos Individuais (user_assets)
                </button>
                <button
                  v-if="selectedUser?.role === 'asset_governance' || selectedUser?.role === 'partner_manager'"
                  @click="activeTab = 'acl'"
                  :class="[
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === 'acl'
                      ? 'border-[#2B4C7E] text-[#2B4C7E]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  ACL por Role ({{ selectedUser?.role === 'asset_governance' ? 'Governança' : 'Parceiros' }})
                </button>
              </nav>
            </div>

            <!-- Tab: Vínculos Individuais -->
            <div v-if="activeTab === 'individual'" class="space-y-4">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex">
                  <svg class="h-5 w-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                  </svg>
                  <div class="text-sm text-blue-800">
                    <strong>Vínculos Individuais:</strong> Ativos específicos vinculados a este usuário. 
                    <span v-if="selectedUser?.role === 'asset_governance' || selectedUser?.role === 'partner_manager'">
                      Use a aba "ACL por Role" para gerenciar permissões por função.
                    </span>
                  </div>
                </div>
              </div>

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

            <!-- Tab: ACL por Role -->
            <div v-if="activeTab === 'acl' && (selectedUser?.role === 'asset_governance' || selectedUser?.role === 'partner_manager')" class="space-y-4">
              <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div class="flex">
                  <svg class="h-5 w-5 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  <div class="text-sm text-amber-800">
                    <strong>ACL por Role:</strong> Permissões aplicadas a TODOS os usuários com a role 
                    <strong>{{ selectedUser?.role === 'asset_governance' ? 'Governança' : 'Parceiros' }}</strong>. 
                    Ao ativar um ativo aqui, TODOS os usuários dessa role terão acesso.
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <div
                  v-for="asset in assets"
                  :key="asset.id"
                  class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div class="flex items-center flex-1">
                    <div class="flex-1">
                      <div class="text-sm font-medium text-gray-900">{{ asset.name }}</div>
                      <div class="text-sm text-gray-500">
                        Código: {{ asset.code || 'Não informado' }}
                      </div>
                    </div>
                  </div>
                  <div class="ml-4">
                    <button
                      @click="toggleAclAccess(asset.id)"
                      :class="[
                        'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                        aclByAsset[asset.id] && Array.isArray(aclByAsset[asset.id]) && aclByAsset[asset.id].length > 0
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      ]"
                    >
                      {{ (aclByAsset[asset.id] && Array.isArray(aclByAsset[asset.id]) && aclByAsset[asset.id].length > 0) ? '✓ Liberado' : 'Bloqueado' }}
                    </button>
                  </div>
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
          </div>

          <!-- Footer do Modal -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              @click="closeAssetModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Fechar
            </button>
            <button
              v-if="activeTab === 'individual'"
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
import { supabase } from '@/lib/supabase'
import {
  listProfiles,
  listCompanies,
  listAssets,
  listUserAssets,
  adminSetRole,
  adminSetUserCompany,
  adminAddUserAsset,
  adminRemoveUserAsset,
  createMissingProfile
} from '@/services/admin'
import { setAssetAccess, removeAssetAccess } from '@/services/acl'

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
const activeTab = ref<'individual' | 'acl'>('individual')

// ACL por Role (governance/partner)
type AclRow = {
  asset_id: string
  subject_type: 'user' | 'role'
  subject_id: string
  can_read: boolean
}
const aclByAsset = ref<Record<string, AclRow[]>>({})

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
    
    console.log('AdminPermissions: Dados carregados -', {
      usuarios: usersData.length,
      empresas: companiesData.length,
      ativos: assetsData.length
    })
    
    // Log detalhado dos usuários encontrados
    console.log('AdminPermissions: Lista de usuários:', usersData.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      company_id: u.company_id
    })))
    
    // Log para debug - mostrar total de usuários encontrados
    if (usersData.length === 0) {
      console.warn('AdminPermissions: Nenhum usuário encontrado! Verifique:')
      console.warn('1. Se você está logado como admin')
      console.warn('2. Se as políticas RLS estão corretas')
      console.warn('3. Se os perfis foram criados na tabela users_profile')
    }
  } catch (err: any) {
    error.value = 'Erro ao carregar dados: ' + err.message
    console.error('Erro ao carregar dados:', err)
  } finally {
    loading.value = false
  }
}

// Refresh automático dos dados
const refreshData = async () => {
  await loadData()
  success.value = 'Dados atualizados com sucesso!'
  setTimeout(() => { success.value = '' }, 2000)
}

// Diagnóstico de usuários
const showDiagnostic = async () => {
  try {
    console.log('=== DIAGNÓSTICO DE USUÁRIOS ===')
    
    // 1. Verificar usuário atual
    const { data: currentUserData } = await supabase.auth.getUser()
    console.log('1. Usuário atual logado:', {
      id: currentUserData.user?.id,
      email: currentUserData.user?.email,
      role_metadata: currentUserData.user?.app_metadata?.role
    })
    
    // 2. Verificar perfil do usuário atual
    let currentProfile: any = null
    if (currentUserData.user) {
      const { data: profileData } = await supabase
        .from('users_profile')
        .select('*')
        .eq('id', currentUserData.user.id)
        .single()
      
      currentProfile = profileData
      console.log('2. Perfil do usuário atual:', currentProfile)
      
      if (!currentProfile) {
        console.warn('⚠️ ATENÇÃO: Seu próprio perfil não está na tabela users_profile!')
      }
    }
    
    // 3. Tentar buscar todos os perfis (o que o admin deveria ver)
    const { data: allProfiles, error: profilesError } = await supabase
      .from('users_profile')
      .select('id, email, name, role')
      .order('email')
    
    console.log('3. Perfis encontrados na query:', {
      total: allProfiles?.length || 0,
      perfis: allProfiles?.map(p => ({ id: p.id, email: p.email, role: p.role })) || []
    })
    
    if (profilesError) {
      console.error('3. ERRO ao buscar perfis:', profilesError.code, profilesError.message)
      
      if (profilesError.code === '42501') {
        alert('❌ ERRO DE PERMISSÃO (RLS): Você não tem permissão para ver os perfis. Verifique:\n\n1. Se você está logado como admin\n2. Se a política RLS "users_profile_select_admin" está ativa\n3. Se seu perfil tem role = "admin"')
        return
      } else {
        alert(`❌ ERRO: ${profilesError.message}\nCódigo: ${profilesError.code}`)
        return
      }
    }
    
    // 4. Resumo
    let summary = `
📊 DIAGNÓSTICO DE USUÁRIOS:

✅ Usuário atual: ${currentUserData.user?.email || 'N/A'}
✅ Role do perfil: ${currentProfile?.role || 'N/A'}
✅ Total de perfis encontrados: ${allProfiles?.length || 0}

${allProfiles && allProfiles.length > 0 
  ? `\nUsuários encontrados:\n${allProfiles.map((p, i) => `${i + 1}. ${p.email || p.id} (${p.role})`).join('\n')}`
  : '\n⚠️ Nenhum usuário encontrado!'
}

${profilesError 
  ? `\n❌ ERRO: ${profilesError.message}\nCódigo: ${profilesError.code}`
  : ''
}
    `
    
    // Se não encontrou perfil do próprio usuário, oferecer criar
    if (!currentProfile && currentUserData.user) {
      const shouldCreate = confirm(summary + '\n\n⚠️ Seu próprio perfil não está na tabela users_profile!\n\nDeseja criar agora?')
      if (shouldCreate) {
        try {
          const result = await createMissingProfile(
            currentUserData.user.id,
            currentUserData.user.email || '',
            currentUserData.user.user_metadata?.name,
            'admin' // Assumir admin já que está no painel de admin
          )
          alert(`✅ Perfil criado com sucesso! Recarregando lista...`)
          await refreshData()
          return
        } catch (err: any) {
          alert(`❌ Erro ao criar perfil: ${err.message}`)
        }
      }
    } else {
      summary += '\n💡 Dica: Verifique o console (F12) para mais detalhes.'
      alert(summary)
    }
    console.log('=== FIM DO DIAGNÓSTICO ===')
  } catch (err: any) {
    console.error('Erro no diagnóstico:', err)
    alert('Erro ao executar diagnóstico: ' + err.message)
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
    activeTab.value = 'individual'
    
    // Carregar vínculos individuais
    const userAssetIds = await listUserAssets(user.id)
    selectedAssetIds.value = new Set(userAssetIds)
    
    // Se for governance ou partner, carregar ACL por role
    if (user.role === 'asset_governance' || user.role === 'partner_manager') {
      await loadAclForRole(user.role)
    }
    
    showAssetModal.value = true
  } catch (err: any) {
    error.value = 'Erro ao carregar vínculos: ' + err.message
    console.error('Erro ao carregar vínculos:', err)
  }
}

// Carregar ACL para uma role específica
async function loadAclForRole(role: 'asset_governance' | 'partner_manager') {
  try {
    // Carregar ACL de todos os ativos para esta role
    for (const asset of assets.value) {
      const { data, error: aclError } = await supabase
        .from('asset_acl')
        .select('asset_id, subject_type, subject_id, can_read')
        .eq('asset_id', asset.id)
        .eq('subject_type', 'role')
        .eq('subject_id', role === 'asset_governance' ? 'governance' : 'partner_manager')
        .eq('can_read', true)
      
      if (!aclError && data && data.length > 0) {
        aclByAsset.value[asset.id] = data as AclRow[]
      } else {
        aclByAsset.value[asset.id] = []
      }
    }
  } catch (err) {
    console.error('Erro ao carregar ACL:', err)
  }
}

// Toggle ACL access para role
async function toggleAclAccess(assetId: string) {
  if (!selectedUser.value) return
  
  const role = selectedUser.value.role
  if (role !== 'asset_governance' && role !== 'partner_manager') return
  
  const roleId = role === 'asset_governance' ? 'governance' : 'partner_manager'
  const hasAccess = aclByAsset.value[assetId] && Array.isArray(aclByAsset.value[assetId]) && aclByAsset.value[assetId].length > 0
  
  try {
    if (hasAccess) {
      // Remover acesso
      await removeAssetAccess(assetId, 'role', roleId)
      aclByAsset.value[assetId] = []
      success.value = `Acesso ao ativo removido para todos os usuários ${role === 'asset_governance' ? 'de governança' : 'parceiros'}`
    } else {
      // Adicionar acesso
      await setAssetAccess({
        p_asset_id: assetId,
        p_subject_type: 'role',
        p_subject_id: roleId,
        p_can_read: true,
        p_can_write: false
      })
      aclByAsset.value[assetId] = [{
        asset_id: assetId,
        subject_type: 'role',
        subject_id: roleId,
        can_read: true
      }]
      success.value = `Acesso ao ativo liberado para todos os usuários ${role === 'asset_governance' ? 'de governança' : 'parceiros'}`
    }
    
    setTimeout(() => { success.value = '' }, 3000)
  } catch (err: any) {
    error.value = 'Erro ao atualizar ACL: ' + err.message
    console.error('Erro ao atualizar ACL:', err)
    setTimeout(() => { error.value = '' }, 5000)
  }
}

// Fechar modal de ativos
const closeAssetModal = () => {
  showAssetModal.value = false
  selectedUser.value = null
  selectedAssetIds.value = new Set()
  activeTab.value = 'individual'
  aclByAsset.value = {}
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

// Sincronizar usuários faltantes
const syncMissingProfiles = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''
    
    console.log('syncMissingProfiles: Iniciando sincronização...')
    
    // Buscar usuários sem perfil usando a função RPC
    const { data: missingUsers, error: rpcError } = await supabase.rpc('admin_sync_missing_profiles')
    
    if (rpcError) {
      console.error('Erro ao buscar usuários sem perfil:', rpcError)
      
      // Se a função não existe, mostrar mensagem amigável
      if (rpcError.code === '42883') {
        error.value = 'Função RPC não encontrada. Execute o SQL fornecido em SOLUCAO_GERENCIAMENTO_PERMISSOES.md no Supabase SQL Editor.'
      } else {
        error.value = 'Erro ao sincronizar: ' + rpcError.message
      }
      return
    }
    
    if (!missingUsers || missingUsers.length === 0) {
      success.value = '✅ Todos os usuários já possuem perfil!'
      setTimeout(() => success.value = '', 3000)
      return
    }
    
    console.log(`${missingUsers.length} usuário(s) sem perfil encontrado(s):`, missingUsers)
    
    // Criar perfis para cada usuário
    let created = 0
    let failed = 0
    const errors: string[] = []
    
    for (const user of missingUsers) {
      try {
        const result = await createMissingProfile(
          user.user_id,
          user.email,
          user.name,
          'asset_governance' // Default role
        )
        
        if (!result.alreadyExists) {
          created++
          console.log(`Perfil criado para ${user.email}`)
        }
      } catch (e: any) {
        console.error(`Erro ao criar perfil para ${user.email}:`, e)
        failed++
        errors.push(`${user.email}: ${e.message}`)
      }
    }
    
    if (created > 0) {
      success.value = `✅ ${created} perfil(is) criado(s) com sucesso!${failed > 0 ? ` ${failed} falhou(ram).` : ''}`
      
      // Recarregar lista
      await loadData()
    } else {
      error.value = `Nenhum perfil foi criado. ${failed > 0 ? errors.join('; ') : ''}`
    }
    
    setTimeout(() => { success.value = '' }, 5000)
    
  } catch (err: any) {
    error.value = 'Erro ao sincronizar: ' + err.message
    console.error('Erro ao sincronizar usuários:', err)
    setTimeout(() => { error.value = '' }, 5000)
  } finally {
    loading.value = false
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