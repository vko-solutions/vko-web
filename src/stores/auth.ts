// =====================================================
// VKO Solution - Auth Store (Pinia)
// =====================================================

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

export type UserRole = 'admin' | 'partner_manager' | 'asset_governance' | 'viewer'

export interface UserProfile {
  id: string
  name: string | null
  email: string | null
  role: UserRole
  company_id: string | null
  created_at: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const session = ref<Session | null>(null)
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!session.value?.user)
  const currentUser = computed(() => session.value?.user || null)
  const userRole = computed(() => profile.value?.role || 'viewer')
  const userCompanyId = computed(() => profile.value?.company_id || null)

  // Actions
  const setSession = (newSession: Session | null) => {
    session.value = newSession
  }

  const setProfile = (newProfile: UserProfile | null) => {
    profile.value = newProfile
  }

  const setError = (newError: string | null) => {
    error.value = newError
  }

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }

  // Sign Up
  const signUp = async (name: string, email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      })

      if (authError) throw authError

      if (data.user) {
        // Criar perfil do usuário
        const { error: profileError } = await supabase
          .from('users_profile')
          .insert({
            id: data.user.id,
            name,
            email,
            role: 'viewer',
            company_id: null
          })

        if (profileError) throw profileError
      }

      return data
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Sign In
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError

      setSession(data.session)
      await fetchProfile()

      return data
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Sign Out
  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error: authError } = await supabase.auth.signOut()

      if (authError) throw authError

      setSession(null)
      setProfile(null)
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer logout')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch Profile
  const fetchProfile = async () => {
    if (!currentUser.value) return

    try {
      const { data, error: profileError } = await supabase
        .from('users_profile')
        .select('*')
        .eq('id', currentUser.value.id)
        .single()

      if (profileError) throw profileError

      setProfile(data)
    } catch (err: any) {
      console.error('Erro ao buscar perfil:', err)
      setError('Erro ao carregar perfil do usuário')
    }
  }

  // Check Role
  const is = (role: UserRole) => {
    return userRole.value === role
  }

  // Initialize Auth
  const initializeAuth = async () => {
    try {
      setLoading(true)

      // Restaurar sessão existente
      const { data: { session: existingSession } } = await supabase.auth.getSession()
      
      if (existingSession) {
        setSession(existingSession)
        await fetchProfile()
      }

      // Escutar mudanças de autenticação
      supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session)
        
        if (session) {
          await fetchProfile()
        } else {
          setProfile(null)
        }
      })
    } catch (err: any) {
      console.error('Erro ao inicializar auth:', err)
      setError('Erro ao inicializar autenticação')
    } finally {
      setLoading(false)
    }
  }

  return {
    // State
    session,
    profile,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    currentUser,
    userRole,
    userCompanyId,
    
    // Actions
    signUp,
    signIn,
    signOut,
    fetchProfile,
    is,
    initializeAuth,
    setError
  }
})
