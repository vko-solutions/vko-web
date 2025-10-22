// =====================================================
// VKO Solution - Permissions Store (Pinia)
// =====================================================

import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useAuthStore } from './auth'
import type { UserRole } from './auth'

export const usePermissionsStore = defineStore('permissions', () => {
  const authStore = useAuthStore()

  // Getters utilitários para verificação de roles
  const isAdmin = computed(() => authStore.is('admin'))
  
  const isPartnerManager = computed(() => authStore.is('partner_manager'))
  
  const isAssetGovernance = computed(() => authStore.is('asset_governance'))
  
  const isViewer = computed(() => authStore.is('viewer'))

  // Verificar se pode ver um ativo específico
  const canSeeAsset = (assetCompanyId: string | null, _assetId: string) => {
    // Admin pode ver todos os ativos
    if (isAdmin.value) return true

    // Partner Manager pode ver ativos da sua empresa
    if (isPartnerManager.value && assetCompanyId === authStore.userCompanyId) {
      return true
    }

    // Asset Governance e Viewer precisam estar vinculados ao ativo
    // Esta verificação será feita no backend via RLS, mas podemos fazer uma verificação client-side
    // para melhor UX (evitar carregar dados desnecessários)
    if (isAssetGovernance.value || isViewer.value) {
      // Retornamos true aqui pois a verificação real será feita no backend
      // via user_assets table através das políticas RLS
      return true
    }

    return false
  }

  // Verificar se pode gerenciar um ativo (owner ou editor)
  const canManageAsset = (_assetId: string) => {
    // Admin pode gerenciar todos
    if (isAdmin.value) return true

    // Partner Manager pode gerenciar ativos da sua empresa
    if (isPartnerManager.value) return true

    // Asset Governance pode gerenciar ativos vinculados
    if (isAssetGovernance.value) return true

    return false
  }

  // Verificar se pode editar um ativo específico
  const canEditAsset = (assetId: string) => {
    return canManageAsset(assetId)
  }

  // Verificar se pode deletar um ativo
  const canDeleteAsset = (_assetId: string) => {
    // Apenas admin pode deletar ativos
    return isAdmin.value
  }

  // Verificar se pode ver empresas
  const canSeeCompanies = computed(() => {
    return isAdmin.value || isPartnerManager.value
  })

  // Verificar se pode gerenciar usuários
  const canManageUsers = computed(() => {
    return isAdmin.value
  })

  // Verificar se pode ver relatórios
  const canSeeReports = computed(() => {
    return isAdmin.value || isPartnerManager.value
  })

  // Verificar se pode acessar configurações
  const canAccessSettings = computed(() => {
    return isAdmin.value
  })

  // Obter nível de permissão (para ordenação/hierarquia)
  const permissionLevel = computed(() => {
    switch (authStore.userRole) {
      case 'admin': return 4
      case 'partner_manager': return 3
      case 'asset_governance': return 2
      case 'viewer': return 1
      default: return 0
    }
  })

  // Verificar se tem permissão maior ou igual a um role específico
  const hasPermissionLevel = (role: UserRole) => {
    const roleLevels = {
      'admin': 4,
      'partner_manager': 3,
      'asset_governance': 2,
      'viewer': 1
    }
    
    return permissionLevel.value >= roleLevels[role]
  }

  return {
    // Role checks
    isAdmin,
    isPartnerManager,
    isAssetGovernance,
    isViewer,
    
    // Asset permissions
    canSeeAsset,
    canManageAsset,
    canEditAsset,
    canDeleteAsset,
    
    // General permissions
    canSeeCompanies,
    canManageUsers,
    canSeeReports,
    canAccessSettings,
    
    // Utility
    permissionLevel,
    hasPermissionLevel
  }
})
