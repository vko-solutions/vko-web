import { supabase } from '@/lib/supabase'

/**
 * Criar um novo ativo
 * @param payload - Dados do ativo (name, company_id?)
 */
export async function createAsset(payload: { name: string; company_id?: string }) {
  try {
    const { data, error } = await supabase
      .from('assets')
      .insert({ 
        id: crypto.randomUUID(), 
        name: payload.name,
        company_id: payload.company_id || null
      })
      .select('*')
      .single()
      
    if (error) {
      console.error('Erro ao criar ativo:', error)
      throw new Error(`Erro ao criar ativo: ${error.message}`)
    }
    
    return data
  } catch (error) {
    console.error('Erro no serviço createAsset:', error)
    throw error
  }
}

/**
 * Deletar um ativo
 * @param assetId - ID do ativo a ser deletado
 */
export async function deleteAsset(assetId: string) {
  try {
    if (!assetId || typeof assetId !== 'string' || assetId.trim() === '') {
      throw new Error('ID do ativo é obrigatório e deve ser válido')
    }
    
    // Verificar se há reports vinculados (check de dependências antes de deletar)
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select('id')
      .eq('asset_id', assetId)
      .limit(1)
    
    if (reportsError) {
      console.warn('deleteAsset: Erro ao verificar reports vinculados:', reportsError)
      // Continuar mesmo assim, o banco vai bloquear se houver FK
    } else if (reports && reports.length > 0) {
      throw new Error('Não é possível excluir este ativo. Ele possui relatórios vinculados. Remova os relatórios primeiro.')
    }
    
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', assetId)
      
    if (error) {
      console.error('Erro ao deletar ativo:', error)
      
      // Mensagens mais descritivas baseadas no tipo de erro
      let message = `Erro ao deletar ativo: ${error.message}`
      if (error.code === '23503') {
        message = 'Não é possível excluir este ativo. Ele possui dependências no sistema (relatórios, permissões ou usuários vinculados).'
      } else if (error.code === '42501') {
        message = 'Você não tem permissão para excluir este ativo.'
      }
      
      throw new Error(message)
    }
  } catch (error: any) {
    console.error('Erro no serviço deleteAsset:', error)
    // Re-throw com mensagem melhorada
    if (error.message && error.message.includes('Não é possível')) {
      throw error
    }
    throw new Error(`Falha ao excluir ativo: ${error.message || 'Erro desconhecido'}`)
  }
}

/**
 * Listar ativos visíveis (filtrados por RLS/ACL conforme papel do usuário)
 */
export async function listAssetsVisible() {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('id, name, code, company_id')
      .order('name', { ascending: true })

    if (error) {
      console.error('Erro ao listar ativos:', error)
      throw new Error(`Erro ao carregar ativos: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Erro no serviço listAssetsVisible:', error)
    throw error
  }
}

