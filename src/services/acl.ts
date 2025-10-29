import { supabase } from '@/lib/supabase'

// Tipos para ACL
export type SubjectType = 'user' | 'role' | 'company'

interface SetReportAccessParams {
  p_report_id: string
  p_subject_type: SubjectType
  p_subject_id: string
  p_can_read?: boolean
  p_can_write?: boolean
}

interface SetAssetAccessParams {
  p_asset_id: string
  p_subject_type: SubjectType
  p_subject_id: string
  p_can_read?: boolean
  p_can_write?: boolean
}

/**
 * Liberar acesso a um report
 * @example
 * await setReportAccess('report-uuid', 'role', 'governance', true)
 */
// Validador de UUID simples
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

export async function setReportAccess(params: SetReportAccessParams) {
  const { p_report_id, p_subject_type, p_subject_id, p_can_read = false, p_can_write = false } = params
  
  // Validações antes de chamar RPC
  if (!p_report_id || !isValidUUID(p_report_id)) {
    throw new Error('ID do relatório é inválido ou não fornecido')
  }
  
  if (!p_subject_type || !['user', 'role', 'company'].includes(p_subject_type)) {
    throw new Error(`Tipo de sujeito inválido: ${p_subject_type}. Deve ser 'user', 'role' ou 'company'`)
  }
  
  if (!p_subject_id || p_subject_id.trim() === '') {
    throw new Error('ID do sujeito é obrigatório')
  }
  
  try {
    const { error, data } = await supabase.rpc('set_report_access', {
      p_report_id,
      p_subject_type,
      p_subject_id,
      p_can_read,
      p_can_write
    })
    
    if (error) {
      console.error('Erro ao liberar acesso ao report:', error)
      // Mensagem mais descritiva baseada no código de erro
      let message = `Erro ao atualizar permissão: ${error.message}`
      if (error.code === '42883') {
        message = 'Função RPC não encontrada. Verifique se o banco de dados está atualizado.'
      } else if (error.code === '23503') {
        message = 'Relatório ou sujeito não encontrado no sistema.'
      }
      throw new Error(message)
    }
    
    return { success: true, data }
  } catch (error: any) {
    console.error('Erro no serviço setReportAccess:', error)
    // Re-throw apenas se for nosso erro customizado, senão criar mensagem mais clara
    if (error.message && !error.message.includes('Erro ao')) {
      throw error
    }
    throw new Error(`Falha ao atualizar permissão: ${error.message || 'Erro desconhecido'}`)
  }
}

/**
 * Liberar acesso a um asset
 * @example
 * await setAssetAccess('asset-uuid', 'user', 'user-uuid', true)
 */
export async function setAssetAccess(params: SetAssetAccessParams) {
  const { p_asset_id, p_subject_type, p_subject_id, p_can_read = false, p_can_write = false } = params
  
  // Validações antes de chamar RPC
  if (!p_asset_id || !isValidUUID(p_asset_id)) {
    throw new Error('ID do ativo é inválido ou não fornecido')
  }
  
  if (!p_subject_type || !['user', 'role', 'company'].includes(p_subject_type)) {
    throw new Error(`Tipo de sujeito inválido: ${p_subject_type}. Deve ser 'user', 'role' ou 'company'`)
  }
  
  if (!p_subject_id || p_subject_id.trim() === '') {
    throw new Error('ID do sujeito é obrigatório')
  }
  
  try {
    const { error, data } = await supabase.rpc('set_asset_access', {
      p_asset_id,
      p_subject_type,
      p_subject_id,
      p_can_read,
      p_can_write
    })
    
    if (error) {
      console.error('Erro ao liberar acesso ao asset:', error)
      let message = `Erro ao atualizar permissão: ${error.message}`
      if (error.code === '42883') {
        message = 'Função RPC não encontrada. Verifique se o banco de dados está atualizado.'
      } else if (error.code === '23503') {
        message = 'Ativo ou sujeito não encontrado no sistema.'
      }
      throw new Error(message)
    }
    
    return { success: true, data }
  } catch (error: any) {
    console.error('Erro no serviço setAssetAccess:', error)
    if (error.message && !error.message.includes('Erro ao')) {
      throw error
    }
    throw new Error(`Falha ao atualizar permissão: ${error.message || 'Erro desconhecido'}`)
  }
}

/**
 * Remover acesso a um report
 */
export async function removeReportAccess(
  reportId: string,
  subjectType: SubjectType,
  subjectId: string
) {
  try {
    const { error } = await supabase.rpc('remove_report_access', {
      p_report_id: reportId,
      p_subject_type: subjectType,
      p_subject_id: subjectId
    })
    
    if (error) {
      console.error('Erro ao remover acesso ao report:', error)
      throw new Error(`Erro ao remover acesso: ${error.message}`)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Erro no serviço removeReportAccess:', error)
    throw error
  }
}

/**
 * Remover acesso a um asset
 */
export async function removeAssetAccess(
  assetId: string,
  subjectType: SubjectType,
  subjectId: string
) {
  try {
    const { error } = await supabase.rpc('remove_asset_access', {
      p_asset_id: assetId,
      p_subject_type: subjectType,
      p_subject_id: subjectId
    })
    
    if (error) {
      console.error('Erro ao remover acesso ao asset:', error)
      throw new Error(`Erro ao remover acesso: ${error.message}`)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Erro no serviço removeAssetAccess:', error)
    throw error
  }
}

/**
 * Liberar 1 report para toda a governança
 * @example
 * await liberateReportForGovernance('report-uuid')
 */
export async function liberateReportForGovernance(reportId: string) {
  return setReportAccess({
    p_report_id: reportId,
    p_subject_type: 'role',
    p_subject_id: 'asset_governance',
    p_can_read: true,
    p_can_write: false
  })
}

/**
 * Liberar 1 asset para toda a governança
 * @example
 * await liberateAssetForGovernance('asset-uuid')
 */
export async function liberateAssetForGovernance(assetId: string) {
  return setAssetAccess({
    p_asset_id: assetId,
    p_subject_type: 'role',
    p_subject_id: 'asset_governance',
    p_can_read: true,
    p_can_write: false
  })
}

/**
 * Liberar 1 report para um usuário específico
 * @example
 * await liberateReportForUser('report-uuid', 'user-uuid')
 */
export async function liberateReportForUser(reportId: string, userId: string) {
  return setReportAccess({
    p_report_id: reportId,
    p_subject_type: 'user',
    p_subject_id: userId,
    p_can_read: true,
    p_can_write: false
  })
}

/**
 * Liberar 1 asset para um usuário específico
 * @example
 * await liberateAssetForUser('asset-uuid', 'user-uuid')
 */
export async function liberateAssetForUser(assetId: string, userId: string) {
  return setAssetAccess({
    p_asset_id: assetId,
    p_subject_type: 'user',
    p_subject_id: userId,
    p_can_read: true,
    p_can_write: false
  })
}

