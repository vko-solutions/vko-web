<template>
  <div class="p-6 max-w-5xl mx-auto space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#2B4C7E]">Diagnóstico de Permissões</h1>
        <p class="text-sm text-gray-600">Valide RLS, ACL e regras por papel (sessão atual)</p>
      </div>
      <div class="text-right">
        <div class="text-sm text-gray-500">Role atual:</div>
        <div class="font-semibold text-[#2B4C7E]">{{ role ?? '—' }}</div>
      </div>
    </header>

    <section class="grid md:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-sm">
        <h2 class="font-semibold text-gray-800">Itens de teste (opcional)</h2>
        <div class="text-sm text-gray-600">Use estes campos para aplicar ACL em itens específicos.</div>
        <div class="space-y-3">
          <div>
            <label class="text-xs text-gray-500 font-medium">REPORT_ID</label>
            <input 
              v-model="inputReportId" 
              placeholder="UUID do relatório" 
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent" 
            />
            <p v-if="testReportId" class="text-xs mt-1 text-[#5B8CBE]">
              Criado (teste): <span class="font-mono bg-gray-100 px-2 py-1 rounded">{{ testReportId }}</span>
            </p>
          </div>
          <div>
            <label class="text-xs text-gray-500 font-medium">ASSET_ID</label>
            <input 
              v-model="inputAssetId" 
              placeholder="UUID do asset" 
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent" 
            />
            <p v-if="testAssetId" class="text-xs mt-1 text-[#5B8CBE]">
              Criado (teste): <span class="font-mono bg-gray-100 px-2 py-1 rounded">{{ testAssetId }}</span>
            </p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2 pt-2">
          <button 
            @click="grantReportGovernance" 
            :disabled="!inputReportId && !testReportId"
            class="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Liberar REPORT
          </button>
          <button 
            @click="revokeReportGovernance" 
            :disabled="!inputReportId && !testReportId"
            class="px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Revogar REPORT
          </button>
          <button 
            @click="grantAssetGovernance" 
            :disabled="!inputAssetId && !testAssetId"
            class="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Liberar ASSET
          </button>
          <button 
            @click="revokeAssetGovernance" 
            :disabled="!inputAssetId && !testAssetId"
            class="px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Revogar ASSET
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-sm">
        <h2 class="font-semibold text-gray-800">Execução</h2>
        <div class="text-sm text-gray-600">
          Os testes usam sua sessão atual. Para validar outra role, faça logout/login e rode novamente.
        </div>
        <button 
          :disabled="running" 
          @click="run" 
          class="w-full px-4 py-2 rounded-lg bg-[#2B4C7E] text-white hover:bg-[#1e3556] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {{ running ? 'Rodando…' : 'Rodar testes' }}
        </button>
      </div>
    </section>

    <section class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h2 class="font-semibold text-gray-800 mb-3">Resultados</h2>
      <div v-if="results.length === 0" class="text-sm text-gray-500 py-8 text-center">
        Nenhum teste rodado ainda.
      </div>
      <ul class="space-y-2">
        <li 
          v-for="(r, idx) in results" 
          :key="idx" 
          class="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span
            class="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-medium flex-shrink-0"
            :class="{
              'bg-gray-400': r.status === 'pending',
              'bg-emerald-600': r.status === 'pass',
              'bg-rose-600': r.status === 'fail',
              'bg-amber-500': r.status === 'skip',
            }"
          >
            {{ r.status === 'pass' ? '✓' : r.status === 'fail' ? '✕' : r.status === 'skip' ? '!' : '…' }}
          </span>
          <div class="flex-1 min-w-0">
            <div class="font-medium text-gray-800">{{ r.name }}</div>
            <div v-if="r.detail" class="text-xs text-gray-600 break-all mt-1">{{ r.detail }}</div>
          </div>
        </li>
      </ul>
    </section>

    <footer class="text-xs text-gray-500 bg-gray-50 p-4 rounded-lg">
      💡 Dica: para validar outra role, faça logout/login com o usuário desejado e rode novamente. 
      Admin pode usar os botões de ACL acima para liberar/revogar acesso rapidamente.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/stores/auth'

/**
 * AdminChecks.vue — Página de diagnóstico para validar RLS/ACL/roles
 * 
 * O que faz:
 * - Descobre a role do usuário atual (via auth store)
 * - Executa uma bateria de testes compatíveis com a role atual
 * - Para ADMIN: cria itens de teste, valida CRUD, aplica ACL via RPC
 * - Para PARTNER: valida leitura de assets
 * - Para GOVERNANCE: valida leitura condicionada à ACL
 */

type TestResult = {
  name: string
  status: 'pending' | 'pass' | 'fail' | 'skip'
  detail?: string
}

const auth = useAuth()

const running = ref(false)
const role = ref<string | null>(null)
const userId = ref<string | null>(null)
const results = ref<TestResult[]>([])

// IDs criados durante os testes (ADMIN)
const testReportId = ref<string | null>(null)
const testAssetId = ref<string | null>(null)

// Inputs manuais (usar para testar ACL em itens existentes)
const inputReportId = ref('')
const inputAssetId = ref('')

function resetResults() {
  results.value = []
}

function push(name: string, status: TestResult['status'], detail?: string) {
  results.value.push({ name, status, detail })
}

async function getContext() {
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    role.value = sessionData.session?.user?.app_metadata?.role ?? auth.profile?.role ?? null
    userId.value = sessionData.session?.user?.id ?? null
  } catch (error) {
    console.error('Erro ao obter contexto:', error)
  }
}

async function ensureSomeDataForRead(): Promise<string | null> {
  // Garante que exista pelo menos 1 asset para testes de leitura
  // Retorna o ID do asset disponível (existente ou criado)
  if (role.value !== 'admin') return null
  
  try {
    // Tentar buscar um asset existente primeiro
    const { data: existing, error: errSel } = await supabase
      .from('assets')
      .select('id')
      .limit(1)
      
    if (errSel) throw errSel
    
    // Se encontrou um asset existente, usar ele
    if (existing && existing.length > 0) {
      testAssetId.value = existing[0].id
      return existing[0].id
    }
    
    // Se não encontrou, criar um asset básico
    const { data, error } = await supabase
      .from('assets')
      .insert({ name: 'QA Asset (auto)' })
      .select('id')
      .single()
      
    if (!error && data) {
      testAssetId.value = data.id
      return data.id
    }
    
    return null
  } catch (error) {
    console.error('Erro ao garantir dados para leitura:', error)
    return null
  }
}

async function run() {
  resetResults()
  running.value = true
  
  try {
    await getContext()
    push(
      'Contexto de sessão', 
      role.value ? 'pass' : 'fail', 
      `role=${role.value ?? 'null'} user=${userId.value ?? 'null'}`
    )

    // Admin: CRUD reports, criação de itens de teste e ACL
    if (role.value === 'admin') {
      // Garantir que existe um asset antes de criar report
      const availableAssetId = await ensureSomeDataForRead()
      
      if (!availableAssetId) {
        push('Admin: criar report', 'skip', 'Nenhum asset disponível para criar report de teste')
      } else {
        // CREATE REPORT
        {
          const reportData = {
            title: 'QA Report (auto)',
            asset_id: availableAssetId, // Usar o asset garantido acima
            week_start: new Date().toISOString().split('T')[0],
            file_path: 'test/test-report.ppt',
            uploaded_by: userId.value
          }
          
          const { data, error } = await supabase
            .from('reports')
            .insert(reportData)
            .select('id, title')
            .single()
            
          if (error) {
            push('Admin: criar report', 'fail', error.message)
          } else {
            testReportId.value = data.id
            push('Admin: criar report', 'pass', `id=${data.id} asset=${availableAssetId.substring(0, 8)}...`)
          }
        }
      }

      // UPDATE REPORT
      if (testReportId.value) {
        const { error } = await supabase
          .from('reports')
          .update({ title: 'QA Report (editado)' })
          .eq('id', testReportId.value)
        push('Admin: editar report', error ? 'fail' : 'pass', error?.message)
      } else {
        push('Admin: editar report', 'skip', 'sem reportId')
      }

      // READ REPORTS (admin vê todos)
      {
        const { data, error } = await supabase.from('reports').select('id').limit(5)
        push('Admin: ler reports', error ? 'fail' : 'pass', error ? error.message : `qtde=${data?.length ?? 0}`)
      }

      // ACL: liberar report para governance via RPC (se houver reportId)
      if (testReportId.value) {
        try {
          const { error } = await supabase.rpc('set_report_access', {
            p_report_id: testReportId.value,
            p_subject_type: 'role',
            p_subject_id: 'asset_governance',
            p_can_read: true,
          })
          push('Admin: ACL → liberar report p/ governance', error ? 'fail' : 'pass', error?.message)
        } catch (err: any) {
          push('Admin: ACL → liberar report p/ governance', 'fail', err.message)
        }
      } else {
        push('Admin: ACL → liberar report p/ governance', 'skip', 'sem reportId')
      }

      // ASSETS: leitura (admin deve ver todos)
      {
        const { data, error } = await supabase.from('assets').select('id').limit(5)
        push('Admin: ler assets', error ? 'fail' : 'pass', error ? error.message : `qtde=${data?.length ?? 0}`)
      }

      // ACL assets: se houver assetId manual, testa liberação p/ governance
      const assetIdToTest = inputAssetId.value || testAssetId.value
      if (assetIdToTest) {
        try {
          const { error } = await supabase.rpc('set_asset_access', {
            p_asset_id: assetIdToTest,
            p_subject_type: 'role',
            p_subject_id: 'asset_governance',
            p_can_read: true,
          })
          push('Admin: ACL → liberar asset p/ governance', error ? 'fail' : 'pass', error?.message)
        } catch (err: any) {
          push('Admin: ACL → liberar asset p/ governance', 'fail', err.message)
        }
      } else {
        push('Admin: ACL → liberar asset p/ governance', 'skip', 'preencha Asset ID (opcional)')
      }
    }

    // Partner Manager: deve conseguir ler TODOS os assets; não consegue criar report
    if (role.value === 'partner_manager') {
      {
        const { data, error } = await supabase.from('assets').select('id').limit(5)
        push('Partner: ler assets (todos)', error ? 'fail' : 'pass', error ? error.message : `qtde=${data?.length ?? 0}`)
      }
      {
        // Buscar um asset_id válido para o teste (mesmo que falhe por RLS)
        const { data: assets } = await supabase.from('assets').select('id').limit(1)
        const testAssetIdForInsert = assets && assets.length > 0 ? assets[0].id : null
        
        if (!testAssetIdForInsert) {
          push('Partner: criar report (bloqueado)', 'skip', 'Sem asset disponível para teste')
        } else {
          const { error } = await supabase
            .from('reports')
            .insert({ 
              title: 'NAO DEVIA CRIAR', 
              asset_id: testAssetIdForInsert,
              week_start: new Date().toISOString().split('T')[0], 
              file_path: 'test.ppt' 
            })
          push('Partner: criar report (bloqueado)', error ? 'pass' : 'fail', error ? 'bloqueado ✅' : 'não deveria permitir')
        }
      }
    }

    // Asset Governance: deve ver reports/assets apenas se ACL existir
    if (role.value === 'asset_governance') {
      {
        const { data, error } = await supabase.from('reports').select('id, title').limit(5)
        push('Governance: ler reports (via ACL)', error ? 'fail' : 'pass', error ? error.message : `qtde=${data?.length ?? 0}`)
      }
      {
        const { data, error } = await supabase.from('assets').select('id, name').limit(5)
        push('Governance: ler assets (via ACL)', error ? 'fail' : 'pass', error ? error.message : `qtde=${data?.length ?? 0}`)
      }
      {
        // Buscar um asset_id válido para o teste (mesmo que falhe por RLS)
        const { data: assets } = await supabase.from('assets').select('id').limit(1)
        const testAssetIdForInsert = assets && assets.length > 0 ? assets[0].id : null
        
        if (!testAssetIdForInsert) {
          push('Governance: criar report (bloqueado)', 'skip', 'Sem asset disponível para teste')
        } else {
          const { error } = await supabase
            .from('reports')
            .insert({ 
              title: 'NAO DEVIA CRIAR', 
              asset_id: testAssetIdForInsert,
              week_start: new Date().toISOString().split('T')[0], 
              file_path: 'test.ppt' 
            })
          push('Governance: criar report (bloqueado)', error ? 'pass' : 'fail', error ? 'bloqueado ✅' : 'não deveria permitir')
        }
      }
    }

  } catch (e: any) {
    push('Falha geral', 'fail', e?.message ?? String(e))
  } finally {
    running.value = false
  }
}

async function grantReportGovernance() {
  const reportId = inputReportId.value || testReportId.value
  if (!reportId) {
    alert('Informe um REPORT_ID')
    return
  }
  
  try {
    const { error } = await supabase.rpc('set_report_access', {
      p_report_id: reportId,
      p_subject_type: 'role',
      p_subject_id: 'asset_governance',
      p_can_read: true,
    })
    alert(error ? `Erro: ${error.message}` : '✅ Report liberado para governance')
  } catch (err: any) {
    alert(`Erro: ${err.message}`)
  }
}

async function revokeReportGovernance() {
  const reportId = inputReportId.value || testReportId.value
  if (!reportId) {
    alert('Informe um REPORT_ID')
    return
  }
  
  try {
    const { error } = await supabase.rpc('set_report_access', {
      p_report_id: reportId,
      p_subject_type: 'role',
      p_subject_id: 'asset_governance',
      p_can_read: false,
    })
    alert(error ? `Erro: ${error.message}` : '🚫 Report revogado de governance')
  } catch (err: any) {
    alert(`Erro: ${err.message}`)
  }
}

async function grantAssetGovernance() {
  const assetId = inputAssetId.value || testAssetId.value
  if (!assetId) {
    alert('Informe um ASSET_ID')
    return
  }
  
  try {
    const { error } = await supabase.rpc('set_asset_access', {
      p_asset_id: assetId,
      p_subject_type: 'role',
      p_subject_id: 'asset_governance',
      p_can_read: true,
    })
    alert(error ? `Erro: ${error.message}` : '✅ Asset liberado para governance')
  } catch (err: any) {
    alert(`Erro: ${err.message}`)
  }
}

async function revokeAssetGovernance() {
  const assetId = inputAssetId.value || testAssetId.value
  if (!assetId) {
    alert('Informe um ASSET_ID')
    return
  }
  
  try {
    const { error } = await supabase.rpc('set_asset_access', {
      p_asset_id: assetId,
      p_subject_type: 'role',
      p_subject_id: 'asset_governance',
      p_can_read: false,
    })
    alert(error ? `Erro: ${error.message}` : '🚫 Asset revogado de governance')
  } catch (err: any) {
    alert(`Erro: ${err.message}`)
  }
}
</script>

