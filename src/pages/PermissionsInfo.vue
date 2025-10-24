<template>
  <div class="min-h-screen bg-[#F7F9FB] py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-[#2B4C7E] mb-4">Sistema de Permissões VKO</h1>
        <p class="text-lg text-[#6C737F]">Entenda como funcionam os controles de acesso</p>
      </div>

      <!-- Status do usuário atual -->
      <div v-if="auth.profile" class="bg-white rounded-lg shadow-sm border border-[#E8ECEF] p-6 mb-8">
        <h2 class="text-xl font-semibold text-[#2B4C7E] mb-4">Seu Status Atual</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-4 bg-[#F7F9FB] rounded-lg">
            <div class="text-2xl mb-2">👤</div>
            <div class="font-medium text-[#2B4C7E]">{{ auth.profile.name || 'Usuário' }}</div>
            <div class="text-sm text-[#6C737F]">{{ auth.profile.email }}</div>
          </div>
          <div class="text-center p-4 bg-[#F7F9FB] rounded-lg">
            <div class="text-2xl mb-2">{{ getRoleIcon(auth.profile.role) }}</div>
            <div class="font-medium text-[#2B4C7E]">{{ getRoleName(auth.profile.role) }}</div>
            <div class="text-sm text-[#6C737F]">{{ getRoleDescription(auth.profile.role) }}</div>
          </div>
          <div class="text-center p-4 bg-[#F7F9FB] rounded-lg">
            <div class="text-2xl mb-2">🏢</div>
            <div class="font-medium text-[#2B4C7E]">{{ companyName || 'Sem empresa' }}</div>
            <div class="text-sm text-[#6C737F]">Empresa vinculada</div>
          </div>
        </div>
      </div>

      <!-- Explicação dos roles -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Admin -->
        <div class="bg-white rounded-lg shadow-sm border border-[#E8ECEF] p-6">
          <div class="text-center mb-4">
            <div class="text-4xl mb-2">👑</div>
            <h3 class="text-lg font-semibold text-[#2B4C7E]">Administrador</h3>
          </div>
          <ul class="text-sm text-[#6C737F] space-y-2">
            <li>✅ Acesso total ao sistema</li>
            <li>✅ Pode ver todos os ativos</li>
            <li>✅ Pode fazer upload de relatórios</li>
            <li>✅ Pode gerenciar usuários</li>
            <li>✅ Pode alterar permissões</li>
          </ul>
        </div>

        <!-- Partner Manager -->
        <div class="bg-white rounded-lg shadow-sm border border-[#E8ECEF] p-6">
          <div class="text-center mb-4">
            <div class="text-4xl mb-2">🏢</div>
            <h3 class="text-lg font-semibold text-[#2B4C7E]">Gerente Parceiro</h3>
          </div>
          <ul class="text-sm text-[#6C737F] space-y-2">
            <li>✅ Vê ativos da sua empresa</li>
            <li>✅ Pode ver relatórios da empresa</li>
            <li>✅ Pode baixar arquivos</li>
            <li>❌ Não pode fazer upload</li>
            <li>❌ Não pode gerenciar usuários</li>
          </ul>
        </div>

        <!-- Asset Governance -->
        <div class="bg-white rounded-lg shadow-sm border border-[#E8ECEF] p-6">
          <div class="text-center mb-4">
            <div class="text-4xl mb-2">📋</div>
            <h3 class="text-lg font-semibold text-[#2B4C7E]">Governança de Ativos</h3>
          </div>
          <ul class="text-sm text-[#6C737F] space-y-2">
            <li>✅ Vê apenas ativos vinculados</li>
            <li>✅ Pode ver relatórios dos ativos</li>
            <li>✅ Pode baixar arquivos</li>
            <li>❌ Não pode fazer upload</li>
            <li>❌ Acesso limitado</li>
          </ul>
        </div>
      </div>

      <!-- Como solicitar mudanças -->
      <div class="bg-white rounded-lg shadow-sm border border-[#E8ECEF] p-6 mb-8">
        <h2 class="text-xl font-semibold text-[#2B4C7E] mb-4">Como Solicitar Mudanças</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-medium text-[#2B4C7E] mb-2">📧 Contato Administrativo</h3>
            <p class="text-sm text-[#6C737F] mb-2">Para solicitar mudanças de permissão:</p>
            <ul class="text-sm text-[#6C737F] space-y-1">
              <li>• Envie um email para: admin@vko.com</li>
              <li>• Informe seu nome e email</li>
              <li>• Explique qual acesso precisa</li>
              <li>• Aguarde aprovação</li>
            </ul>
          </div>
          <div>
            <h3 class="font-medium text-[#2B4C7E] mb-2">🔗 Vinculação a Ativos</h3>
            <p class="text-sm text-[#6C737F] mb-2">Para ser vinculado a ativos específicos:</p>
            <ul class="text-sm text-[#6C737F] space-y-1">
              <li>• Solicite ao seu gerente</li>
              <li>• Informe quais ativos precisa acessar</li>
              <li>• Justifique a necessidade</li>
              <li>• Aguarde configuração</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <div class="bg-white rounded-lg shadow-sm border border-[#E8ECEF] p-6">
        <h2 class="text-xl font-semibold text-[#2B4C7E] mb-4">Perguntas Frequentes</h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-medium text-[#2B4C7E] mb-1">Por que não consigo ver todos os ativos?</h3>
            <p class="text-sm text-[#6C737F]">O sistema usa controle de acesso baseado em roles. Você só vê os ativos que tem permissão para acessar.</p>
          </div>
          <div>
            <h3 class="font-medium text-[#2B4C7E] mb-1">Como faço upload de relatórios?</h3>
            <p class="text-sm text-[#6C737F]">Apenas administradores podem fazer upload. Solicite acesso administrativo se necessário.</p>
          </div>
          <div>
            <h3 class="font-medium text-[#2B4C7E] mb-1">Posso alterar minhas próprias permissões?</h3>
            <p class="text-sm text-[#6C737F]">Não. Apenas administradores podem alterar permissões por questões de segurança.</p>
          </div>
        </div>
      </div>

      <!-- Botões de ação -->
      <div class="text-center mt-8">
        <router-link 
          to="/app" 
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#2B4C7E] hover:bg-[#1e3556] transition-colors duration-200"
        >
          ← Voltar ao Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const auth = useAuth()
const companyName = ref<string | null>(null)

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin': return '👑'
    case 'partner_manager': return '🏢'
    case 'asset_governance': return '📋'
    default: return '👤'
  }
}

const getRoleName = (role: string) => {
  switch (role) {
    case 'admin': return 'Administrador'
    case 'partner_manager': return 'Gerente Parceiro'
    case 'asset_governance': return 'Governança de Ativos'
    default: return 'Usuário'
  }
}

const getRoleDescription = (role: string) => {
  switch (role) {
    case 'admin': return 'Acesso total'
    case 'partner_manager': return 'Gerencia empresa'
    case 'asset_governance': return 'Acesso limitado'
    default: return 'Permissões básicas'
  }
}

onMounted(async () => {
  await auth.init()
  
  // Buscar nome da empresa se o usuário tem company_id
  if (auth.profile?.company_id) {
    try {
      const { data } = await supabase
        .from('companies')
        .select('name')
        .eq('id', auth.profile.company_id)
        .single()
      
      if (data) {
        companyName.value = data.name
      }
    } catch (error) {
      console.error('Erro ao buscar empresa:', error)
    }
  }
})
</script>
