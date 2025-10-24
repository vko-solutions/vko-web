<template>
  <div class="space-y-6">
    <!-- Header com título e botão de inserir -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-blue-800">Relatórios</h1>
      <router-link
        v-if="auth.profile?.role === 'admin'"
        to="/app/reports/new"
        class="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-200"
      >
        Inserir relatório
      </router-link>
    </div>

    <!-- Lista de ativos -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-blue-800 mb-4">Ativos</h2>
      
      <div v-if="loadingAssets" class="text-center py-8 text-gray-500">
        Carregando ativos...
      </div>
      
      <div v-else-if="assets.length === 0" class="text-center py-8 text-gray-500">
        Nenhum ativo encontrado
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <button
          v-for="asset in assets"
          :key="asset.id"
          @click="selectAsset(asset)"
          :class="[
            'text-left p-4 rounded-lg border transition-colors duration-200',
            selectedAsset?.id === asset.id
              ? 'bg-blue-800 text-white border-blue-800'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
          ]"
        >
          <div class="font-medium">{{ asset.name }}</div>
          <div class="text-sm opacity-75">{{ asset.code || 'Sem código' }}</div>
        </button>
      </div>
    </div>

    <!-- Conteúdo dos relatórios -->
    <div v-if="!selectedAsset" class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
      <div class="text-6xl mb-4">📋</div>
      <p class="text-lg">Selecione um ativo para ver os relatórios</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Último relatório -->
      <div v-if="latestReport" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-blue-800 mb-4">Último relatório</h3>
        <div class="space-y-3">
          <div>
            <span class="font-medium text-gray-700">Título:</span>
            <span class="ml-2">{{ latestReport.title }}</span>
          </div>
          <div>
            <span class="font-medium text-gray-700">Semana:</span>
            <span class="ml-2">{{ formatDate(latestReport.week_start) }}</span>
          </div>
          <div>
            <span class="font-medium text-gray-700">Enviado em:</span>
            <span class="ml-2">{{ formatDate(latestReport.created_at) }}</span>
          </div>
        </div>
        <div class="mt-4">
          <a
            :href="latestReport.signedUrl"
            target="_blank"
            class="inline-flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors duration-200"
          >
            📄 Abrir relatório (PPT)
          </a>
        </div>
      </div>

      <!-- Histórico -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-blue-800 mb-4">Histórico</h3>
        
        <div v-if="loadingReports" class="text-center py-8 text-gray-500">
          Carregando relatórios...
        </div>
        
        <div v-else-if="reports.length === 0" class="text-center py-8 text-gray-500">
          Nenhum relatório encontrado para este ativo
        </div>
        
        <div v-else class="space-y-3">
          <div
            v-for="report in reports"
            :key="report.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div class="flex-1">
              <div class="font-medium text-gray-900">{{ report.title }}</div>
              <div class="text-sm text-gray-500">
                Semana de {{ formatDate(report.week_start) }} • 
                Enviado em {{ formatDate(report.created_at) }}
              </div>
            </div>
            <a
              :href="report.signedUrl"
              target="_blank"
              class="ml-4 px-3 py-1 bg-blue-800 text-white text-sm rounded hover:bg-blue-900 transition-colors duration-200"
            >
              Abrir
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useAuth } from '@/stores/auth'
import { listAssetsVisible } from '@/services/assets'
import { listReportsByAsset, getSignedUrl } from '@/services/reports'

const auth = useAuth()

// Estado dos ativos
const assets = ref<any[]>([])
const selectedAsset = ref<any>(null)
const loadingAssets = ref(false)

// Estado dos relatórios
const reports = ref<any[]>([])
const latestReport = ref<any>(null)
const loadingReports = ref(false)

// Carregar ativos
const loadAssets = async () => {
  try {
    loadingAssets.value = true
    assets.value = await listAssetsVisible()
  } catch (error) {
    console.error('Erro ao carregar ativos:', error)
  } finally {
    loadingAssets.value = false
  }
}

// Selecionar ativo
const selectAsset = (asset: any) => {
  selectedAsset.value = asset
}

// Carregar relatórios do ativo selecionado
const loadReports = async (assetId: string) => {
  try {
    loadingReports.value = true
    const reportsData = await listReportsByAsset(assetId)
    
    // Gerar URLs assinadas para todos os relatórios
    const reportsWithUrls = await Promise.all(
      reportsData.map(async (report) => {
        try {
          const signedUrl = await getSignedUrl(report.file_path)
          return { ...report, signedUrl }
        } catch (error) {
          console.error('Erro ao gerar URL assinada:', error)
          return { ...report, signedUrl: null }
        }
      })
    )
    
    reports.value = reportsWithUrls
    
    // Definir o último relatório (primeiro da lista ordenada por data)
    latestReport.value = reportsWithUrls.length > 0 ? reportsWithUrls[0] : null
    
  } catch (error) {
    console.error('Erro ao carregar relatórios:', error)
    reports.value = []
    latestReport.value = null
  } finally {
    loadingReports.value = false
  }
}

// Watch para carregar relatórios quando ativo muda
watch(selectedAsset, (newAsset) => {
  if (newAsset) {
    loadReports(newAsset.id)
  } else {
    reports.value = []
    latestReport.value = null
  }
})

// Formatar data
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

// Inicializar
onMounted(async () => {
  await auth.init()
  await loadAssets()
})
</script>