import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

type Role = 'admin' | 'partner_manager' | 'asset_governance' | 'partner' | 'governance'
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
    profile: null as Profile | null,
    initializing: false,
    initialized: false
  }),
  actions: {
    async init() {
      // Prevenir múltiplas inicializações simultâneas
      if (this.initializing) {
        console.log('auth.init: Já está inicializando, aguardando...')
        while (this.initializing) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        return
      }
      
      if (this.initialized) {
        console.log('auth.init: Já inicializado, pulando...')
        return
      }

      console.log('auth.init: Iniciando...')
      this.initializing = true
      
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('auth.init: Erro ao obter sessão:', error)
          throw error
        }
        
        console.log('auth.init: Sessão obtida:', data.session ? 'existe' : 'não existe')
        this.session = data.session
        
        if (this.session?.user) {
          console.log('auth.init: Usuário encontrado, buscando perfil...')
          await this.fetchProfile()
        } else {
          console.log('auth.init: Nenhum usuário na sessão')
        }
        
        // Escutar mudanças de auth (só registrar uma vez)
        supabase.auth.onAuthStateChange(async (event, s) => {
          console.log('auth.init: Auth state changed:', event, s ? 'sessão existe' : 'sem sessão')
          this.session = s
          if (s?.user) {
            await this.fetchProfile()
          } else {
            console.log('auth.init: Removendo perfil')
            this.profile = null
          }
        })
        
        this.initialized = true
      } catch (error) {
        console.error('auth.init: Erro ao inicializar:', error)
      } finally {
        this.initializing = false
      }
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
      console.log('auth.signIn: Iniciando login para:', email)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        console.error('auth.signIn: Erro no login:', error.message)
        throw error
      }
      console.log('auth.signIn: Login bem-sucedido, buscando perfil...')
      await this.fetchProfile()
      console.log('auth.signIn: Perfil carregado:', this.profile)
    },
    async signOut() {
      await supabase.auth.signOut()
      this.session = null
      this.profile = null
    },
    async fetchProfile() {
      if (!this.session?.user?.id) {
        console.log('fetchProfile: Não há sessão ou user.id')
        return
      }
      
      console.log('fetchProfile: Iniciando para user_id:', this.session.user.id)
      
      try {
        // Tentar pegar o JWT role como fallback PRIMEIRO
        const jwtRole = this.session.user.app_metadata?.role as Role | undefined
        console.log('fetchProfile: JWT role (fallback):', jwtRole)
        
        // Timeout de 5 segundos para evitar travamento
        const profilePromise = supabase
          .from('users_profile')
          .select('*')
          .eq('id', this.session.user.id)
          .single()
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout ao buscar perfil')), 5000)
        })
        
        const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any
          
        if (error) {
          console.log('fetchProfile: Erro ao buscar perfil:', error.code, error.message)
          
          // SEMPRE usar JWT como fallback se disponível (mais confiável)
          if (jwtRole) {
            console.log('fetchProfile: Usando fallback do JWT...')
            this.profile = {
              id: this.session.user.id,
              name: this.session.user.user_metadata?.name || this.session.user.email?.split('@')[0] || null,
              email: this.session.user.email || null,
              role: jwtRole,
              company_id: null
            }
            console.log('fetchProfile: Perfil criado com fallback JWT:', this.profile)
            // Criar perfil no banco em background (não bloqueia)
            this.createProfileInBackground()
            return
          }
          
          // Se não tem JWT, tentar criar perfil básico (só se erro for "não encontrado")
          if (error.code === 'PGRST116') {
            console.log('fetchProfile: Perfil não encontrado e sem JWT role, criando perfil básico...')
            try {
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
                
                if (insertError) {
                  console.error('fetchProfile: Erro ao criar perfil:', insertError)
                  // Criar profile temporário para não bloquear UI
                  this.profile = {
                    id: this.session.user.id,
                    name: this.session.user.user_metadata?.name || this.session.user.email?.split('@')[0] || null,
                    email: this.session.user.email || null,
                    role: 'asset_governance',
                    company_id: null
                  }
                  console.log('fetchProfile: Perfil temporário criado devido a erro de inserção')
                } else {
                  console.log('fetchProfile: Perfil criado com sucesso')
                  // Buscar o perfil recém-criado
                  const { data: newProfile } = await supabase
                    .from('users_profile')
                    .select('*')
                    .eq('id', this.session.user.id)
                    .single()
                  if (newProfile) {
                    this.profile = newProfile as Profile
                  }
                }
              }
            } catch (createErr: any) {
              console.error('fetchProfile: Erro ao criar perfil:', createErr)
              // Criar profile temporário para não bloquear UI
              this.profile = {
                id: this.session.user.id,
                name: this.session.user.email?.split('@')[0] || null,
                email: this.session.user.email || null,
                role: 'asset_governance',
                company_id: null
              }
            }
          } else {
            // Outro erro - usar JWT se disponível, senão erro crítico
            console.error('fetchProfile: Erro inesperado ao buscar perfil:', error)
            if (jwtRole) {
              this.profile = {
                id: this.session.user.id,
                name: this.session.user.user_metadata?.name || this.session.user.email?.split('@')[0] || null,
                email: this.session.user.email || null,
                role: jwtRole,
                company_id: null
              }
              console.log('fetchProfile: Usando fallback JWT devido ao erro:', this.profile)
            } else {
              // Sem JWT e sem perfil - situação crítica, mas não bloquear UI
              console.error('fetchProfile: Situação crítica - sem perfil e sem JWT')
              this.profile = {
                id: this.session.user.id,
                name: this.session.user.email?.split('@')[0] || null,
                email: this.session.user.email || null,
                role: 'asset_governance', // Default seguro
                company_id: null
              }
            }
          }
        } else {
          // Sucesso - validar dados antes de usar
          if (data && data.id && data.role) {
            this.profile = data as Profile
            console.log('fetchProfile: Perfil encontrado:', this.profile)
          } else {
            console.error('fetchProfile: Dados do perfil inválidos:', data)
            // Usar JWT como fallback se dados inválidos
            if (jwtRole) {
              this.profile = {
                id: this.session.user.id,
                name: data?.name || this.session.user.user_metadata?.name || this.session.user.email?.split('@')[0] || null,
                email: data?.email || this.session.user.email || null,
                role: jwtRole,
                company_id: data?.company_id || null
              }
            }
          }
        }
      } catch (err: any) {
        console.error('fetchProfile: Erro ao buscar/criar perfil:', err)
        
        // Se for timeout ou outro erro, usar JWT como último recurso
        const jwtRole = this.session?.user?.app_metadata?.role as Role | undefined
        if (jwtRole) {
          this.profile = {
            id: this.session.user.id,
            name: this.session.user.user_metadata?.name || this.session.user.email?.split('@')[0] || null,
            email: this.session.user.email || null,
            role: jwtRole,
            company_id: null
          }
          console.log('fetchProfile: Usando fallback JWT após erro crítico')
        } else {
          // Último recurso: profile básico para não travar UI
          this.profile = {
            id: this.session.user.id,
            name: this.session.user.email?.split('@')[0] || null,
            email: this.session.user.email || null,
            role: 'asset_governance',
            company_id: null
          }
          console.log('fetchProfile: Profile básico criado como último recurso')
        }
      }
    },
    async createProfileInBackground() {
      // Criar perfil no background sem bloquear o app
      try {
        const { error: insertError } = await supabase
          .from('users_profile')
          .insert({
            id: this.session!.user.id,
            name: this.session!.user.user_metadata?.name || this.session!.user.email?.split('@')[0],
            email: this.session!.user.email,
            role: this.profile!.role,
            company_id: null
          })
        
        if (!insertError) {
          console.log('createProfileInBackground: Perfil criado no banco com sucesso')
          // Buscar o perfil atualizado
          const { data: newProfile } = await supabase
            .from('users_profile')
            .select('*')
            .eq('id', this.session.user.id)
            .single()
          if (newProfile) {
            this.profile = newProfile as Profile
          }
        } else {
          console.log('createProfileInBackground: Perfil já existe ou erro:', insertError.message)
        }
      } catch (err) {
        console.error('createProfileInBackground: Erro ao criar perfil:', err)
      }
    },
    is(role: Role) {
      return this.profile?.role === role
    }
  }
})

