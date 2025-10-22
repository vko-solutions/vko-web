// =====================================================
// VKO Solution - Vue Router Configuration
// =====================================================

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Rotas públicas
    {
      path: '/',
      name: 'Home',
      component: () => import('@/pages/Landing.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/pages/Register.vue'),
      meta: { requiresAuth: false }
    },
    
    // Rotas protegidas
    {
      path: '/app',
      name: 'App',
      component: () => import('@/pages/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/app/assets'
        },
        {
          path: 'assets',
          name: 'AssetsList',
          component: () => import('@/pages/AssetsList.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'assets/:id',
          name: 'AssetDetail',
          component: () => import('@/pages/AssetDetail.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    
    // Rota de fallback
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// Guard global de autenticação
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Se a rota não requer autenticação, permitir acesso
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  // Se não está autenticado, redirecionar para login
  if (!authStore.isAuthenticated) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // Se está autenticado mas não tem perfil carregado, aguardar
  if (!authStore.profile) {
    try {
      await authStore.fetchProfile()
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      next({ name: 'Login' })
      return
    }
  }

  // Verificações específicas de permissão por rota
  if (to.name === 'AssetDetail' && to.params.id) {
    try {
      // Aqui poderíamos fazer uma verificação adicional se necessário
      // Por enquanto, confiamos no RLS do Supabase
      next()
    } catch (error) {
      console.error('Erro ao verificar permissão do ativo:', error)
      next({ name: 'AssetsList' })
      return
    }
  }

  next()
})

// Guard após navegação (para logs e analytics)
router.afterEach((to, from) => {
  // Aqui podemos adicionar analytics, logs, etc.
  console.log(`Navegação: ${String(from.name)} → ${String(to.name)}`)
})

export default router
