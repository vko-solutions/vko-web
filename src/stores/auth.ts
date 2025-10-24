import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

type Role = 'admin' | 'partner_manager' | 'asset_governance'
type Profile = {
  id: string
  name: string | null
  email: string | null
  role: Role
  company_id: string | null
}

export const useAuth = defineStore('auth', {
  state: () => ({
    session: null as any,
    profile: null as Profile | null
  }),
  actions: {
    async init() {
      const { data } = await supabase.auth.getSession()
      this.session = data.session
      if (this.session?.user) await this.fetchProfile()
      supabase.auth.onAuthStateChange(async (_e, s) => {
        this.session = s
        if (s?.user) await this.fetchProfile()
        else this.profile = null
      })
    },
    async signUp(name: string, email: string, password: string) {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: name
          }
        }
      })
      if (error) throw error
      
      // Criar perfil apenas se o usuário foi criado (não precisa de confirmação de email)
      if (data.user && !data.user.email_confirmed_at) {
        // Usuário criado mas precisa confirmar email
        return { 
          ...data, 
          message: 'Conta criada! Verifique seu email para confirmar.' 
        }
      }
      
      // Se chegou aqui, usuário já confirmado ou confirmação desabilitada
      if (data.user) {
        await supabase.from('users_profile').insert({
          id: data.user.id, 
          name, 
          email, 
          role: 'asset_governance', 
          company_id: null
        })
      }
      
      return data
    },
    async signIn(email: string, password: string) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      await this.fetchProfile()
    },
    async signOut() {
      await supabase.auth.signOut()
      this.session = null
      this.profile = null
    },
    async fetchProfile() {
      if (!this.session?.user?.id) return
      
      try {
        const { data, error } = await supabase
          .from('users_profile')
          .select('*')
          .eq('id', this.session.user.id)
          .single()
          
        if (error) {
          // Se não encontrou perfil, criar um básico
          if (error.code === 'PGRST116') {
            console.log('Perfil não encontrado, criando perfil básico...')
            const { data: userData } = await supabase.auth.getUser()
            if (userData.user) {
              const { error: insertError } = await supabase
                .from('users_profile')
                .insert({
                  id: userData.user.id,
                  name: userData.user.user_metadata?.name || userData.user.email?.split('@')[0],
                  email: userData.user.email,
                  role: 'asset_governance',
                  company_id: null
                })
              
              if (!insertError) {
                // Buscar o perfil recém-criado
                const { data: newProfile } = await supabase
                  .from('users_profile')
                  .select('*')
                  .eq('id', this.session.user.id)
                  .single()
                this.profile = newProfile as Profile
              }
            }
          } else {
            throw error
          }
        } else {
          this.profile = data as Profile
        }
      } catch (err) {
        console.error('Erro ao buscar/criar perfil:', err)
        // Não definir profile como null para evitar loops
      }
    },
    is(role: Role) {
      return this.profile?.role === role
    }
  }
})
