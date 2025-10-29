<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-blue-800">Relatórios</h1>
        <p class="text-sm text-gray-600 mt-1">Gerencie e visualize todos os relatórios</p>
      </div>
      <router-link
        v-if="auth.profile?.role === 'admin'"
        to="/app/reports/new"
        class="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-200"
      >
        + Novo Relatório
      </router-link>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-blue-800 mb-4">Filtros</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ativo</label>
          <select
            v-model="selectedAssetId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos os ativos</option>
            <option v-for="asset in assets" :key="asset.id" :value="asset.id">
              {{ asset.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Período</label>
          <select
            v-model="selectedPeriod"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos</option>
            <option value="week">Última semana</option>
            <option value="month">Último mês</option>
            <option value="quarter">Último trimestre</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar relatórios..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- Lista de Relatórios -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-800" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Carregando relatórios...
      </div>
    </div>

    <div v-else-if="filteredReports.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📋</div>
      <p class="text-lg text-gray-600">Nenhum relatório encontrado</p>
      <p class="text-sm text-gray-500 mt-2">Tente ajustar os filtros ou criar um novo relatório</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="report in filteredReports"
        :key="report.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 class="text-lg font-semibold text-blue-800 mb-4">{{ report.title }}</h3>
        <p class="text-sm text-gray-600 mb-4">{{ formatDate(report.week_start) }}</p>
        <div class="space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Ativo:</span>
            <span class="font-medium">{{ getAssetName(report.asset_id) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Enviado em:</span>
            <span class="font-medium">{{ formatDate(report.created_at) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Enviado por:</span>
            <span class="font-medium">{{ report.uploaded_by || 'N/A' }}</span>
          </div>
          <div class="pt-3 border-t border-gray-200">
            <!-- Mostrar botão apenas se tem acesso (se veio do SELECT, tem acesso) -->
            <a
              v-if="report.signedUrl"
              :href="report.signedUrl"
              target="_blank"
              download
              class="inline-flex items-center px-4 py-2 bg-[#2B4C7E] text-white rounded-lg hover:bg-[#1e3556] transition-colors duration-200"
            >
              📄 Baixar Relatório
            </a>
            <div
              v-else
              class="space-y-1"
            >
              <!-- Relatório de teste (sem arquivo físico) -->
              <span
                v-if="report.file_path?.startsWith('test/')"
                class="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm"
              >
                🧪 Relatório de teste (sem arquivo)
              </span>
              <!-- Erro de acesso real -->
              <template v-else>
                <span class="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-lg cursor-not-allowed text-sm">
                  ⚠️ Sem acesso ao arquivo
                </span>
                <p class="text-xs text-gray-500">
                  Você pode ver este relatório, mas não tem permissão para baixar o arquivo. 
                  <span v-if="auth.profile?.role !== 'admin'">
                    Contate o administrador para liberar acesso a este ativo.
                  </span>
                  <span v-else>
                    Verifique as políticas do Storage ou se o arquivo existe.
                  </span>
                </p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAuth } from '@/stores/auth'
import { listAssetsVisible } from '@/services/assets'
import { listReportsByAsset, getSignedUrl } from '@/services/reports'

const auth = useAuth()

// Estado
const assets = ref<any[]>([])
const reports = ref<any[]>([])
const loading = ref(false)
const selectedAssetId = ref('')
const selectedPeriod = ref('all')
const searchQuery = ref('')

// Carregar ativos
const loadAssets = async () => {
  try {
    assets.value = await listAssetsVisible()
  } catch (error) {
    console.error('Erro ao carregar ativos:', error)
  }
}

// Carregar relatórios
const loadReports = async () => {
  try {
    loading.value = true
    
    // Se um ativo específico foi selecionado, carregar apenas dele
    if (selectedAssetId.value) {
      const reportsData = await listReportsByAsset(selectedAssetId.value)
      reports.value = await Promise.all(
        reportsData.map(async (report) => {
          try {
            const signedUrl = await getSignedUrl(report.file_path)
            return { ...report, signedUrl }
          } catch (error: any) {
            // Não logar erro para relatórios de teste (esperado)
            const isTestReport = report.file_path?.startsWith('test/')
            if (!isTestReport) {
              console.error(`Erro ao gerar URL assinada para ${report.title} (${report.file_path}):`, error)
            }
            return { 
              ...report, 
              signedUrl: null,
              accessError: error?.message || 'Erro desconhecido ao gerar URL',
              isTestReport: isTestReport
            }
          }
        })
      )
    } else {
      // Carregar todos os relatórios de todos os ativos
      const allReports = []
      for (const asset of assets.value) {
        try {
          const reportsData = await listReportsByAsset(asset.id)
          const reportsWithUrls = await Promise.all(
            reportsData.map(async (report) => {
              try {
                const signedUrl = await getSignedUrl(report.file_path)
                return { ...report, signedUrl }
              } catch (error: any) {
                // Não logar erro para relatórios de teste (esperado)
                const isTestReport = report.file_path?.startsWith('test/')
                if (!isTestReport) {
                  console.error(`Erro ao gerar URL assinada para ${report.title} (${report.file_path}):`, error)
                }
                return { 
                  ...report, 
                  signedUrl: null,
                  accessError: error?.message || 'Erro desconhecido ao gerar URL',
                  isTestReport: isTestReport
                }
              }
            })
          )
          allReports.push(...reportsWithUrls)
        } catch (error) {
          console.error(`Erro ao carregar relatórios do ativo ${asset.id}:`, error)
        }
      }
      reports.value = allReports
    }
  } catch (error) {
    console.error('Erro ao carregar relatórios:', error)
    reports.value = []
  } finally {
    loading.value = false
  }
}

// Filtrar relatórios
const filteredReports = computed(() => {
  let filtered = reports.value

  // Filtro por período
  if (selectedPeriod.value !== 'all') {
    const now = new Date()
    const filterDate = new Date()
    
    switch (selectedPeriod.value) {
      case 'week':
        filterDate.setDate(now.getDate() - 7)
        break
      case 'month':
        filterDate.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        filterDate.setMonth(now.getMonth() - 3)
        break
    }
    
    filtered = filtered.filter(report => new Date(report.created_at) >= filterDate)
  }

  // Filtro por busca
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(report => 
      report.title.toLowerCase().includes(query) ||
      getAssetName(report.asset_id).toLowerCase().includes(query)
    )
  }

  return filtered
})

// Obter nome do ativo
const getAssetName = (assetId: string) => {
  const asset = assets.value.find(a => a.id === assetId)
  return asset?.name || 'Desconhecido'
}

// Formatar data
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

// Watch para recarregar quando o filtro muda
watch(selectedAssetId, () => {
  loadReports()
})

// Inicializar
onMounted(async () => {
  await auth.init()
  await loadAssets()
  await loadReports()
})
</script>
