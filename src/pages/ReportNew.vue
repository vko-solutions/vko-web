<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[#2B4C7E] mb-2">Novo Dashboard</h1>
        <p class="text-lg text-gray-600">Faça upload de um dashboard técnico PPT/PPTX</p>
      </div>

      <!-- Formulário -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Select de Ativo -->
          <div>
            <label for="asset" class="block text-sm font-medium text-blue-800 mb-2">
              Ativo *
            </label>
            <select
              v-model="form.assetId"
              id="asset"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
              required
            >
              <option value="">Selecione um ativo</option>
              <option v-for="asset in assets" :key="asset.id" :value="asset.id">
                {{ asset.name }} ({{ asset.code || 'Sem código' }})
              </option>
            </select>
          </div>

          <!-- Input Título -->
          <div>
            <label for="title" class="block text-sm font-medium text-blue-800 mb-2">
              Título *
            </label>
            <input
              v-model="form.title"
              type="text"
              id="title"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
              placeholder="Ex: Relatório Semanal - Ativo ABC"
              required
            />
          </div>

          <!-- Input Semana -->
          <div>
            <label for="weekStart" class="block text-sm font-medium text-blue-800 mb-2">
              Semana de Início *
            </label>
            <input
              v-model="form.weekStart"
              type="date"
              id="weekStart"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
              required
            />
          </div>

          <!-- Input Arquivo com Drag & Drop -->
          <div>
            <label for="file" class="block text-sm font-medium text-blue-800 mb-2">
              Arquivo PPT/PPTX *
            </label>
            
            <!-- Área de Drop -->
            <div
              @drop.prevent="handleDrop"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              class="relative border-2 border-dashed rounded-lg p-8 text-center transition-colors"
              :class="isDragging ? 'border-[#2B4C7E] bg-blue-50' : 'border-gray-300'"
            >
              <input
                ref="fileInput"
                @change="handleFileChange"
                type="file"
                id="file"
                accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                class="hidden"
                required
              />
              
              <div v-if="!selectedFile">
                <div class="flex flex-col items-center">
                  <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p class="text-sm text-gray-600 mb-3">
                    Arraste o arquivo aqui ou clique no botão abaixo
                  </p>
                  <label
                    for="file"
                    class="inline-flex items-center px-4 py-2 bg-[#2B4C7E] text-white rounded-lg hover:bg-[#1e3556] cursor-pointer font-medium transition-colors duration-200"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    Selecionar arquivo
                  </label>
                  <p class="text-xs text-gray-500 mt-3">
                    Apenas arquivos PowerPoint (.ppt, .pptx). Máximo 50MB.
                  </p>
                </div>
              </div>
              
              <div v-else class="flex items-center justify-between bg-green-50 rounded-lg p-4">
                <div class="flex items-center">
                  <svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <div>
                    <div class="font-medium text-gray-900">{{ selectedFile.name }}</div>
                    <div class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</div>
                  </div>
                </div>
                <button
                  @click="removeFile"
                  type="button"
                  class="ml-4 text-red-600 hover:text-red-700"
                  title="Remover arquivo"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Mensagens de Erro -->
          <div v-if="error" class="rounded-md bg-red-50 p-4">
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

          <!-- Mensagem de Sucesso -->
          <div v-if="success" class="rounded-md bg-green-50 p-4">
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

          <!-- Botões -->
          <div class="flex justify-end space-x-3 pt-6">
            <router-link
              to="/app"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancelar
            </router-link>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-[#2B4C7E] text-white rounded-md text-sm font-medium hover:bg-[#1e3556] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {{ loading ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Informações adicionais -->
      <div class="mt-8 bg-[#2B4C7E]/5 border border-[#2B4C7E]/20 rounded-lg p-4">
        <h3 class="text-sm font-medium text-[#2B4C7E] mb-2 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Informações importantes
        </h3>
        <ul class="text-sm text-gray-700 space-y-1">
          <li>• Apenas administradores podem fazer upload de dashboards técnicos</li>
          <li>• O arquivo será armazenado de forma segura no sistema</li>
          <li>• O dashboard ficará disponível para usuários com acesso ao ativo</li>
          <li>• Certifique-se de que o arquivo está correto antes de enviar</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { listAssetsVisible } from '@/services/assets'
import { uploadReportPPT } from '@/services/reports'

const router = useRouter()
const auth = useAuth()

// Estado do formulário
const form = reactive({
  assetId: '',
  title: '',
  weekStart: ''
})

// Estado da interface
const assets = ref<any[]>([])
const selectedFile = ref<File | null>(null)
const loading = ref(false)
const error = ref('')
const success = ref('')
const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)

// Carregar ativos
const loadAssets = async () => {
  try {
    assets.value = await listAssetsVisible()
  } catch (err: any) {
    error.value = 'Erro ao carregar ativos: ' + err.message
  }
}

// Validar e processar arquivo
const validateAndSetFile = (file: File) => {
  // Validar tipo de arquivo
  const allowedTypes = [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
  
  // Também verificar extensão
  const allowedExtensions = ['.ppt', '.pptx']
  const fileName = file.name.toLowerCase()
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext))
  
  if (!allowedTypes.includes(file.type) && !hasValidExtension) {
    error.value = 'Apenas arquivos PPT/PPTX são permitidos'
    return false
  }
  
  // Validar tamanho (50MB)
  const maxSize = 50 * 1024 * 1024
  if (file.size > maxSize) {
    error.value = 'Arquivo muito grande. Máximo 50MB'
    return false
  }
  
  selectedFile.value = file
  error.value = ''
  return true
}

// Manipular seleção de arquivo
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    if (!validateAndSetFile(file)) {
      target.value = ''
      selectedFile.value = null
    }
  }
}

// Manipular drag & drop
const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    if (!validateAndSetFile(file)) {
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
  }
}

// Remover arquivo selecionado
const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  error.value = ''
}

// Formatar tamanho do arquivo
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Submeter formulário
const handleSubmit = async () => {
  // Prevenir múltiplos cliques
  if (loading.value) {
    return
  }
  
  if (!selectedFile.value) {
    error.value = 'Selecione um arquivo'
    return
  }
  
  if (!form.assetId || !form.title || !form.weekStart) {
    error.value = 'Preencha todos os campos obrigatórios'
    return
  }
  
  // Validar profile antes de usar
  if (!auth.profile || !auth.profile.id) {
    error.value = 'Erro: Perfil do usuário não encontrado. Por favor, faça login novamente.'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    return
  }
  
  try {
    loading.value = true
    error.value = ''
    success.value = ''
    
    await uploadReportPPT(
      selectedFile.value,
      form.assetId,
      form.title,
      form.weekStart,
      auth.profile.id
    )
    
    success.value = 'Relatório enviado com sucesso!'
    
    // Limpar formulário
    form.assetId = ''
    form.title = ''
    form.weekStart = ''
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    
    // Redirecionar após 2 segundos
    setTimeout(() => {
      router.push('/app')
    }, 2000)
    
  } catch (err: any) {
    error.value = 'Erro ao enviar relatório: ' + err.message
  } finally {
    loading.value = false
  }
}

// Inicializar
onMounted(async () => {
  await auth.init()
  
  // Verificar se é admin
  if (!auth.profile || auth.profile.role !== 'admin') {
    error.value = 'Acesso negado. Apenas administradores podem fazer upload de relatórios.'
    return
  }
  
  await loadAssets()
})
</script>