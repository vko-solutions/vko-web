// =====================================================
// VKO Solution - Supabase Configuration
// =====================================================

import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validação das variáveis de ambiente
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL não está definida nas variáveis de ambiente')
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY não está definida nas variáveis de ambiente')
}

// Cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// =====================================================
// TIPOS TYPESCRIPT
// =====================================================

export type UserRole = 'admin' | 'partner_manager' | 'asset_governance' | 'viewer'
export type AssetStatus = 'active' | 'inactive'
export type AssetUserRole = 'owner' | 'editor' | 'viewer'

export interface UserProfile {
  id: string
  name: string | null
  email: string | null
  role: UserRole
  company_id: string | null
  created_at: string
}

export interface Company {
  id: string
  name: string
  created_at: string
}

export interface Asset {
  id: string
  name: string
  address: string | null
  company_id: string | null
  status: AssetStatus
  created_at: string
}

export interface UserAsset {
  user_id: string
  asset_id: string
  role: AssetUserRole
}

// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

// Obter usuário atual
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Obter perfil do usuário atual
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('users_profile')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

// Verificar se usuário é admin
export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentUserProfile()
  return profile?.role === 'admin'
}

// Obter ativos visíveis para o usuário atual
export async function getMyAssets(): Promise<Asset[]> {
  const { data, error } = await supabase
    .from('v_my_assets')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// =====================================================
// SERVIÇOS DE AUTENTICAÇÃO
// =====================================================

export const authService = {
  // Login com email e senha
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Registrar novo usuário
  async signUp(email: string, password: string, metadata?: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    if (error) throw error
    return data
  },

  // Reset de senha
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }
}

// =====================================================
// SERVIÇOS DE DADOS
// =====================================================

export const dataService = {
  // Ativos
  async getAssets() {
    return getMyAssets()
  },

  // Perfil do usuário
  async getUserProfile(userId?: string) {
    const targetUserId = userId || (await getCurrentUser())?.id
    if (!targetUserId) throw new Error('Usuário não encontrado')

    const { data, error } = await supabase
      .from('users_profile')
      .select('*')
      .eq('id', targetUserId)
      .single()

    if (error) throw error
    return data
  },

  // Empresas (apenas para admin e partner_manager)
  async getCompanies() {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  }
}

// =====================================================
// EXPORT DEFAULT
// =====================================================

export default supabase

