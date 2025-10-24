<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-blue-800 mb-2">Novo Relatório</h1>
        <p class="text-lg text-gray-600">Faça upload de um relatório PPT/PPTX</p>
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

          <!-- Input Arquivo -->
          <div>
            <label for="file" class="block text-sm font-medium text-blue-800 mb-2">
              Arquivo PPT/PPTX *
            </label>
            <input
              ref="fileInput"
              @change="handleFileChange"
              type="file"
              id="file"
              accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
              required
            />
            <p class="mt-1 text-sm text-gray-500">
              Apenas arquivos PowerPoint (.ppt, .pptx). Máximo 50MB.
            </p>
            <div v-if="selectedFile" class="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
              📄 {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
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
      <div class="mt-8 bg-blue-50 rounded-lg p-4">
        <h3 class="text-sm font-medium text-blue-800 mb-2">ℹ️ Informações importantes</h3>
        <ul class="text-sm text-blue-700 space-y-1">
          <li>• Apenas administradores podem fazer upload de relatórios</li>
          <li>• O arquivo será armazenado de forma segura no sistema</li>
          <li>• O relatório ficará disponível para usuários com acesso ao ativo</li>
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

// Carregar ativos
const loadAssets = async () => {
  try {
    assets.value = await listAssetsVisible()
  } catch (err: any) {
    error.value = 'Erro ao carregar ativos: ' + err.message
  }
}

// Manipular seleção de arquivo
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Validar tipo de arquivo
    const allowedTypes = [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      error.value = 'Apenas arquivos PPT/PPTX são permitidos'
      target.value = ''
      selectedFile.value = null
      return
    }
    
    // Validar tamanho (50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      error.value = 'Arquivo muito grande. Máximo 50MB'
      target.value = ''
      selectedFile.value = null
      return
    }
    
    selectedFile.value = file
    error.value = ''
  }
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
  if (!selectedFile.value) {
    error.value = 'Selecione um arquivo'
    return
  }
  
  if (!form.assetId || !form.title || !form.weekStart) {
    error.value = 'Preencha todos os campos obrigatórios'
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
      auth.profile!.id
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