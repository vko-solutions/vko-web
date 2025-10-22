// =====================================================
// VKO Solution - Assets Service
// =====================================================

import { supabase } from '@/lib/supabase'

export type AssetStatus = 'active' | 'inactive'

export interface Asset {
  id: string
  name: string
  address: string | null
  company_id: string | null
  status: AssetStatus
  created_at: string
}

export interface Company {
  id: string
  name: string
  created_at: string
}

export interface UserAsset {
  user_id: string
  asset_id: string
  role: 'owner' | 'editor' | 'viewer'
}

export class AssetsService {
  // Listar ativos visíveis para o usuário atual
  static async listVisibleAssets(): Promise<Asset[]> {
    try {
      const { data, error } = await supabase
        .from('v_my_assets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao listar ativos:', error)
      throw new Error('Erro ao carregar ativos')
    }
  }

  // Obter ativo por ID (com verificação de permissão via RLS)
  static async getAssetById(id: string): Promise<Asset | null> {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Asset não encontrado ou sem permissão
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar ativo:', error)
      throw new Error('Erro ao carregar ativo')
    }
  }

  // Obter empresa por ID
  static async getCompanyById(id: string): Promise<Company | null> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar empresa:', error)
      throw new Error('Erro ao carregar empresa')
    }
  }

  // Listar empresas (apenas para admin e partner_manager)
  static async listCompanies(): Promise<Company[]> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao listar empresas:', error)
      throw new Error('Erro ao carregar empresas')
    }
  }

  // Obter vínculos do usuário com ativos
  static async getUserAssets(userId?: string): Promise<UserAsset[]> {
    try {
      const { data, error } = await supabase
        .from('user_assets')
        .select('*')
        .eq('user_id', userId || (await supabase.auth.getUser()).data.user?.id)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar vínculos do usuário:', error)
      throw new Error('Erro ao carregar vínculos')
    }
  }

  // Criar novo ativo (apenas admin)
  static async createAsset(asset: Omit<Asset, 'id' | 'created_at'>): Promise<Asset> {
    try {
      const { data, error } = await supabase
        .from('assets')
        .insert(asset)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar ativo:', error)
      throw new Error('Erro ao criar ativo')
    }
  }

  // Atualizar ativo
  static async updateAsset(id: string, updates: Partial<Asset>): Promise<Asset> {
    try {
      const { data, error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao atualizar ativo:', error)
      throw new Error('Erro ao atualizar ativo')
    }
  }

  // Deletar ativo (apenas admin)
  static async deleteAsset(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao deletar ativo:', error)
      throw new Error('Erro ao deletar ativo')
    }
  }

  // Vincular usuário a ativo
  static async linkUserToAsset(userId: string, assetId: string, role: 'owner' | 'editor' | 'viewer' = 'viewer'): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_assets')
        .insert({
          user_id: userId,
          asset_id: assetId,
          role
        })

      if (error) throw error
    } catch (error) {
      console.error('Erro ao vincular usuário ao ativo:', error)
      throw new Error('Erro ao vincular usuário')
    }
  }

  // Desvincular usuário de ativo
  static async unlinkUserFromAsset(userId: string, assetId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_assets')
        .delete()
        .eq('user_id', userId)
        .eq('asset_id', assetId)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao desvincular usuário do ativo:', error)
      throw new Error('Erro ao desvincular usuário')
    }
  }
}

