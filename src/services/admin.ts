import { supabase } from '@/lib/supabase'

export async function listProfiles() {
  try {
    console.log('listProfiles: Iniciando busca de perfis...')
    
    // Primeiro, verificar se o usuário atual é admin (para debug)
    const { data: currentUser } = await supabase.auth.getUser()
    console.log('listProfiles: Usuário atual:', currentUser.user?.id, currentUser.user?.email)
    
    const { data, error } = await supabase.from('users_profile')
      .select('id, name, email, role, company_id')
      .order('email')
    
    if (error) {
      console.error('listProfiles: Erro ao listar perfis:', error.code, error.message, error.details)
      
      // Se for erro 42501 (permissão negada), é problema de RLS
      if (error.code === '42501') {
        throw new Error(`Permissão negada. Verifique se você está logado como administrador. Erro: ${error.message}`)
      }
      
      throw new Error(`Erro ao carregar usuários: ${error.message}`)
    }
    
    console.log('listProfiles: Perfis encontrados:', data?.length || 0)
    console.log('listProfiles: IDs dos perfis:', data?.map(u => ({ id: u.id, email: u.email, role: u.role })) || [])
    
    return data || []
  } catch (error: any) {
    console.error('Erro no serviço listProfiles:', error)
    throw error
  }
}

export async function listCompanies() {
  try {
    const { data, error } = await supabase.from('companies')
      .select('id, name')
      .order('name')
    
    if (error) {
      console.error('Erro ao listar empresas:', error)
      throw new Error(`Erro ao carregar empresas: ${error.message}`)
    }
    
    return data || []
  } catch (error) {
    console.error('Erro no serviço listCompanies:', error)
    throw error
  }
}

export async function listAssets() {
  try {
    const { data, error } = await supabase.from('assets')
      .select('id, name, code')
      .order('name')
    
    if (error) {
      console.error('Erro ao listar ativos:', error)
      throw new Error(`Erro ao carregar ativos: ${error.message}`)
    }
    
    return data || []
  } catch (error) {
    console.error('Erro no serviço listAssets:', error)
    throw error
  }
}

export async function listUserAssets(userId: string) {
  try {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório')
    }
    
    const { data, error } = await supabase.from('user_assets')
      .select('asset_id')
      .eq('user_id', userId)
    
    if (error) {
      console.error('Erro ao listar ativos do usuário:', error)
      throw new Error(`Erro ao carregar ativos do usuário: ${error.message}`)
    }
    
    return (data ?? []).map(r => r.asset_id)
  } catch (error) {
    console.error('Erro no serviço listUserAssets:', error)
    throw error
  }
}

export async function adminSetRole(userId: string, role: 'admin'|'partner_manager'|'asset_governance') {
  try {
    if (!userId || !role) {
      throw new Error('ID do usuário e role são obrigatórios')
    }
    
    const { error } = await supabase.rpc('admin_set_role', { 
      p_user_id: userId, 
      p_role: role 
    })
    
    if (error) {
      console.error('Erro ao alterar role:', error)
      throw new Error(`Erro ao alterar permissão: ${error.message}`)
    }
  } catch (error) {
    console.error('Erro no serviço adminSetRole:', error)
    throw error
  }
}

export async function adminSetUserCompany(userId: string, companyId: string|null) {
  try {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório')
    }
    
    const { error } = await supabase.rpc('admin_set_user_company', { 
      p_user_id: userId, 
      p_company_id: companyId 
    })
    
    if (error) {
      console.error('Erro ao alterar empresa do usuário:', error)
      throw new Error(`Erro ao vincular empresa: ${error.message}`)
    }
  } catch (error) {
    console.error('Erro no serviço adminSetUserCompany:', error)
    throw error
  }
}

export async function adminAddUserAsset(userId: string, assetId: string) {
  try {
    if (!userId || !assetId) {
      throw new Error('ID do usuário e ID do ativo são obrigatórios')
    }
    
    const { error } = await supabase.rpc('admin_add_user_asset', { 
      p_user_id: userId, 
      p_asset_id: assetId 
    })
    
    if (error) {
      console.error('Erro ao adicionar ativo ao usuário:', error)
      throw new Error(`Erro ao vincular ativo: ${error.message}`)
    }
  } catch (error) {
    console.error('Erro no serviço adminAddUserAsset:', error)
    throw error
  }
}

export async function adminRemoveUserAsset(userId: string, assetId: string) {
  try {
    if (!userId || !assetId) {
      throw new Error('ID do usuário e ID do ativo são obrigatórios')
    }
    
    const { error } = await supabase.rpc('admin_remove_user_asset', { 
      p_user_id: userId, 
      p_asset_id: assetId 
    })
    
    if (error) {
      console.error('Erro ao remover ativo do usuário:', error)
      throw new Error(`Erro ao desvincular ativo: ${error.message}`)
    }
  } catch (error) {
    console.error('Erro no serviço adminRemoveUserAsset:', error)
    throw error
  }
}

/**
 * Criar perfil para um usuário que existe no Auth mas não tem perfil
 * Útil quando usuário foi criado diretamente no Supabase Auth
 */
export async function createMissingProfile(userId: string, email: string, name?: string, role: 'admin'|'partner_manager'|'asset_governance' = 'asset_governance') {
  try {
    if (!userId || !email) {
      throw new Error('ID do usuário e email são obrigatórios')
    }
    
    // Verificar se perfil já existe
    const { data: existing } = await supabase
      .from('users_profile')
      .select('id')
      .eq('id', userId)
      .single()
    
    if (existing) {
      return { alreadyExists: true, profile: existing }
    }
    
    // Criar perfil
    const { data, error } = await supabase
      .from('users_profile')
      .insert({
        id: userId,
        email: email,
        name: name || email.split('@')[0],
        role: role,
        company_id: null
      })
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar perfil:', error)
      throw new Error(`Erro ao criar perfil: ${error.message}`)
    }
    
    return { alreadyExists: false, profile: data }
  } catch (error: any) {
    console.error('Erro no serviço createMissingProfile:', error)
    throw error
  }
}
