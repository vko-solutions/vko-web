<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'

/**
 * AdminAssets.vue — Tela de administração de Ativos (CRUD + Permissões)
 *
 * Objetivos:
 * - Admin cria e exclui ativos
 * - Admin libera/revoga visualização para "governance" e "partner" (ACL)
 * - Listagem responsiva com busca/paginação simples
 * - Tudo integrado às policies/RPCs já criadas
 */

type Asset = { 
  id: string
  name: string
  code?: string
  company_id?: string | null
}

type AclRow = {
  asset_id: string
  subject_type: 'user' | 'role'
  subject_id: string // 'governance' | 'partner_manager' | <uuid>
  can_read: boolean
}

const loading = ref(false)
const creating = ref(false)
const deleting = ref<string | null>(null)
const search = ref('')
const page = ref(1)
const pageSize = ref(10)
const successMessage = ref('')

const assets = ref<Asset[]>([])
const total = ref(0)
const aclByAsset = ref<Record<string, AclRow[]>>({})

// Formulário de criação
const name = ref('')
const companyId = ref('')
const code = ref('')

const filteredAssets = computed(() => {
  const q = search.value.trim().toLowerCase()
  const list = q
    ? assets.value.filter(a => a.name?.toLowerCase().includes(q) || a.id.includes(q))
    : assets.value
  return list
})

const pageCount = computed(() => Math.max(1, Math.ceil(filteredAssets.value.length / pageSize.value)))
const pagedAssets = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredAssets.value.slice(start, start + pageSize.value)
})

async function fetchAssets() {
  loading.value = true
  try {
    console.log('fetchAssets: Carregando ativos...')
    // Admin vê todos; Partner também (por RLS); Governance só o que tiver ACL
    const { data, error, count } = await supabase
      .from('assets')
      .select('id, name, code, company_id', { count: 'exact' })
      .order('name', { ascending: true })
      
    if (error) {
      console.error('Erro na query:', error)
      throw error
    }
    
    console.log('fetchAssets: Ativos carregados:', data?.length || 0)
    assets.value = data as Asset[] || []
    total.value = count ?? data?.length ?? 0
    
    // Carregar ACL dos primeiros itens
    const itemsToLoad = assets.value.slice(0, pageSize.value)
    for (const a of itemsToLoad) {
      await refreshAcl(a.id)
    }
  } catch (e: any) {
    console.error('Erro ao carregar assets:', e?.message || e)
    alert(`Erro ao carregar ativos: ${e?.message}`)
  } finally {
    loading.value = false
  }
}

async function fetchAclFor(assetId: string) {
  // Somente admin enxerga asset_acl por policy — esta tela é para admin.
  try {
    const { data, error } = await supabase
      .from('asset_acl')
      .select('asset_id, subject_type, subject_id, can_read')
      .eq('asset_id', assetId)
    
    if (error) {
      // Se a tabela não existir ou não tiver permissão, retorna vazio
      console.warn('Não foi possível ler ACL:', error.message)
      return [] as AclRow[]
    }
    return data as AclRow[]
  } catch (e) {
    return [] as AclRow[]
  }
}

async function refreshAcl(assetId: string) {
  const rows = await fetchAclFor(assetId)
  aclByAsset.value = { ...aclByAsset.value, [assetId]: rows }
}

function isRoleAllowed(assetId: string, role: 'governance' | 'partner_manager') {
  const rows = aclByAsset.value[assetId] || []
  // Partner lê todos por policy; ainda assim permitimos ACL explícita
  return (
    role === 'partner_manager' ||
    rows.some(r => r.subject_type === 'role' && r.subject_id === role && r.can_read)
  )
}

async function toggleRole(assetId: string, role: 'governance' | 'partner_manager', canRead: boolean) {
  try {
    // Otimistic update - mudar UI imediatamente
    const currentAcl = aclByAsset.value[assetId] || []
    const updatedAcl = canRead 
      ? [...currentAcl, { asset_id: assetId, subject_type: 'role' as const, subject_id: role, can_read: true }]
      : currentAcl.filter(r => !(r.subject_type === 'role' && r.subject_id === role))
    
    aclByAsset.value = { ...aclByAsset.value, [assetId]: updatedAcl }
    
    const { error } = await supabase.rpc('set_asset_access', {
      p_asset_id: assetId,
      p_subject_type: 'role',
      p_subject_id: role,
      p_can_read: canRead,
    })
    
    if (error) {
      // Rollback se falhar
      await refreshAcl(assetId)
      alert(`Erro ao atualizar permissão: ${error.message}`)
    } else {
      // Atualizar com dados reais do servidor
      await refreshAcl(assetId)
    }
  } catch (e: any) {
    // Rollback em caso de erro
    await refreshAcl(assetId)
    alert(`Erro: ${e?.message || 'Falha ao atualizar permissão'}`)
  }
}

async function createAsset() {
  if (!name.value.trim()) {
    alert('Informe o nome do ativo')
    return
  }
  
  // Validar se não está criando duplicado (check básico)
  const trimmedName = name.value.trim()
  const existingAsset = assets.value.find(a => 
    a.name?.toLowerCase() === trimmedName.toLowerCase()
  )
  
  if (existingAsset) {
    const confirm = window.confirm(
      `Já existe um ativo com o nome "${trimmedName}". Deseja criar mesmo assim?`
    )
    if (!confirm) {
      return
    }
  }
  
  creating.value = true
  try {
    const assetId = crypto.randomUUID()
    const payload: Partial<Asset> = { 
      name: trimmedName
    }
    
    if (code.value.trim()) payload.code = code.value.trim()
    if (companyId.value.trim()) {
      // Validar UUID se fornecido
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(companyId.value.trim())) {
        throw new Error('Company ID deve ser um UUID válido')
      }
      payload.company_id = companyId.value.trim()
    }

    const { data, error } = await supabase
      .from('assets')
      .insert({ id: assetId, ...payload })
      .select('id, name, code, company_id')
      .single()
      
    if (error) {
      console.error('Erro ao criar ativo:', error)
      
      // Mensagens mais descritivas
      let message = `Erro ao criar ativo: ${error.message}`
      if (error.code === '23505') {
        message = `Já existe um ativo com este nome ou código. Por favor, escolha outro nome.`
      } else if (error.code === '23503') {
        message = `Company ID não encontrado. Verifique se a empresa existe.`
      } else if (error.code === '42501') {
        message = `Você não tem permissão para criar ativos.`
      }
      
      throw new Error(message)
    }

    console.log('Ativo criado com sucesso:', data)
    
    // Limpar formulário
    name.value = ''
    code.value = ''
    companyId.value = ''
    
    // Recarregar a lista completa de ativos
    await fetchAssets()
    
    // Recarregar ACL do novo ativo
    await refreshAcl(assetId)
    
    // Mensagem de sucesso
    successMessage.value = `Ativo "${payload.name}" criado com sucesso!`
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (e: any) {
    console.error('Erro ao criar ativo:', e)
    alert(e?.message || 'Falha ao criar ativo')
  } finally {
    creating.value = false
  }
}

async function deleteAssetRow(assetId: string) {
  if (!confirm('Tem certeza que deseja excluir este ativo?')) return
  
  deleting.value = assetId
  try {
    const { error } = await supabase.from('assets').delete().eq('id', assetId)
    if (error) throw error
    
    // Remover da lista
    assets.value = assets.value.filter(a => a.id !== assetId)
    
    // Remover ACL do cache
    const map = { ...aclByAsset.value }
    delete map[assetId]
    aclByAsset.value = map
  } catch (e: any) {
    alert(e?.message || 'Falha ao excluir ativo')
  } finally {
    deleting.value = null
  }
}

onMounted(async () => {
  await fetchAssets()
  // O fetchAssets já carrega ACL automaticamente
})
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto space-y-6">
    <header class="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-[#2B4C7E]">Ativos — Administração</h1>
        <p class="text-sm text-gray-500">Crie, exclua e gerencie permissões de visualização (ACL)</p>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <span v-if="loading">Carregando…</span>
        <span v-else>Itens: <b>{{ total }}</b></span>
      </div>
    </header>

    <!-- Mensagem de sucesso -->
    <div v-if="successMessage" class="rounded-lg bg-green-50 border border-green-200 p-4">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
      </div>
    </div>

    <!-- Form de criação -->
    <section class="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm">
      <h2 class="font-semibold text-gray-800 mb-3">Novo ativo</h2>
      <div class="grid md:grid-cols-4 gap-3">
        <div>
          <label class="text-xs text-gray-500 font-medium">Nome do ativo *</label>
          <input 
            v-model="name" 
            placeholder="Ex.: Contrato Padrão"
            class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent" 
          />
        </div>
        <div>
          <label class="text-xs text-gray-500 font-medium">Código (opcional)</label>
          <input 
            v-model="code" 
            placeholder="Ex.: ABC-001"
            class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent" 
          />
        </div>
        <div>
          <label class="text-xs text-gray-500 font-medium">Company ID (opcional)</label>
          <input 
            v-model="companyId" 
            placeholder="UUID da empresa"
            class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent" 
          />
        </div>
        <div class="flex items-end">
          <button 
            @click="createAsset" 
            :disabled="creating"
            class="w-full px-4 py-2 rounded-lg bg-[#2B4C7E] text-white hover:bg-[#1e3556] disabled:opacity-60 transition-colors font-medium"
          >
            {{ creating ? 'Criando…' : 'Criar ativo' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Filtros -->
    <section class="flex flex-col md:flex-row items-stretch md:items-center gap-3">
      <div class="flex-1">
        <input 
          v-model="search" 
          placeholder="Buscar por nome ou ID…"
          class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent" 
        />
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="fetchAssets" 
          :disabled="loading"
          class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Atualizar
        </button>
        <select 
          v-model.number="pageSize" 
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
        >
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </div>
    </section>

    <!-- Lista -->
    <section class="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
      <div class="hidden md:grid grid-cols-12 gap-2 px-4 py-3 text-xs text-gray-500 bg-gray-50 font-medium">
        <div class="col-span-3">Ativo</div>
        <div class="col-span-2">Código</div>
        <div class="col-span-2">Company</div>
        <div class="col-span-3">Permissões (ACL)</div>
        <div class="col-span-2 text-right">Ações</div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-flex items-center">
          <svg class="animate-spin h-5 w-5 mr-3 text-[#2B4C7E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Carregando ativos...
        </div>
      </div>

      <div v-else-if="pagedAssets.length === 0" class="p-6 text-center text-sm text-gray-500">
        Nenhum ativo encontrado.
      </div>

      <div v-else v-for="a in pagedAssets" :key="a.id" class="grid grid-cols-12 gap-2 px-4 py-3 border-t border-gray-200 md:items-center hover:bg-gray-50 transition-colors">
        <div class="col-span-12 md:col-span-3">
          <div class="font-medium text-gray-900">{{ a.name }}</div>
          <div class="text-xs text-gray-500 break-all font-mono">ID: {{ a.id }}</div>
        </div>
        <div class="col-span-12 md:col-span-2 text-sm text-gray-700">{{ a.code || '—' }}</div>
        <div class="col-span-12 md:col-span-2 text-sm text-gray-700 break-all">{{ a.company_id || '—' }}</div>
        <div class="col-span-12 md:col-span-3">
          <div class="flex flex-wrap gap-2">
            <!-- Governance toggle -->
            <button
              @click="toggleRole(a.id, 'governance', !isRoleAllowed(a.id, 'governance'))"
              class="px-3 py-1.5 rounded-lg text-white text-sm hover:opacity-90 transition-opacity"
              :class="isRoleAllowed(a.id, 'governance') ? 'bg-emerald-600' : 'bg-gray-400'"
              title="Libera/Revoga leitura para Governança"
            >
              Governança {{ isRoleAllowed(a.id, 'governance') ? '✓' : '✕' }}
            </button>

            <!-- Partner toggle -->
            <button
              @click="toggleRole(a.id, 'partner_manager', !isRoleAllowed(a.id, 'partner_manager'))"
              class="px-3 py-1.5 rounded-lg text-white text-sm hover:opacity-90 transition-opacity"
              :class="isRoleAllowed(a.id, 'partner_manager') ? 'bg-blue-600' : 'bg-gray-400'"
              title="(Opcional) Marcar visibilidade para Partner"
            >
              Parceiros {{ isRoleAllowed(a.id, 'partner_manager') ? '✓' : '✕' }}
            </button>
          </div>
          <div class="text-[11px] text-gray-400 mt-1">* Parceiros já têm leitura por padrão. Este indicador é informativo/ACL extra.</div>
        </div>
        <div class="col-span-12 md:col-span-2 flex md:justify-end gap-2">
          <button
            @click="refreshAcl(a.id)"
            class="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
            title="Recarregar ACL"
          >
            ACL ↻
          </button>
          <button
            @click="deleteAssetRow(a.id)"
            :disabled="deleting === a.id"
            class="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-sm hover:bg-rose-700 disabled:opacity-60 transition-colors"
          >
            {{ deleting === a.id ? 'Excluindo…' : 'Excluir' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Paginação -->
    <section v-if="!loading && pageCount > 1" class="flex items-center justify-between">
      <div class="text-sm text-gray-500">Página {{ page }} de {{ pageCount }}</div>
      <div class="flex gap-2">
        <button 
          @click="page = Math.max(1, page - 1)" 
          :disabled="page === 1"
          class="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Anterior
        </button>
        <button 
          @click="page = Math.min(pageCount, page + 1)" 
          :disabled="page === pageCount"
          class="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Próxima
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Estilização mínima. O restante fica por conta do Tailwind. */
</style>

