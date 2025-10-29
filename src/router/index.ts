import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuth } from '@/stores/auth'

const routes = [
  { path: '/', component: () => import('@/pages/Landing.vue') },
  { path: '/login', component: () => import('@/pages/Login.vue') },
  { path: '/register', component: () => import('@/pages/Register.vue') },
  { 
    path: '/app/test', 
    name: 'test', 
    component: () => import('@/pages/Test.vue'),
    meta: { requiresAuth: true, requireAdmin: true }
  },
  { path: '/app', component: () => import('@/pages/AppLayout.vue'),
    children: [
      { path: '', name: 'dashboard', component: () => import('@/pages/Dashboard.vue') },
      { path: 'reports', name: 'reports', component: () => import('@/pages/Reports.vue') },
      { path: 'reports/new', name: 'reportNew', component: () => import('@/pages/ReportNew.vue') },
      { 
        path: 'admin/permissions', 
        name: 'adminPermissions', 
        component: () => import('@/pages/AdminPermissions.vue'),
        meta: { requiresAuth: true, requireAdmin: true }
      },
      { 
        path: 'admin/assets', 
        name: 'adminAssets', 
        component: () => import('@/pages/AdminAssets.vue'),
        meta: { requiresAuth: true, requireAdmin: true }
      },
      { 
        path: 'admin/checks', 
        name: 'adminChecks', 
        component: () => import('@/pages/AdminChecks.vue'),
        meta: { requiresAuth: true, requireAdmin: true }
      },
      { path: 'settings', name: 'settings', component: () => import('@/pages/Settings.vue') },
    ]
  }
]

const router = createRouter({ history: createWebHashHistory(), routes })

// Prevenir loops de redirecionamento
let redirectCount = 0
const MAX_REDIRECTS = 3

router.beforeEach(async (to, from) => {
  console.log('router.beforeEach: Navegando para:', to.path, 'de:', from.path)
  const auth = useAuth()
  
  // Resetar contador se não for redirect
  if (!to.query.r && !from.query.r) {
    redirectCount = 0
  }
  
  // Detectar loop de redirecionamento
  if (redirectCount >= MAX_REDIRECTS) {
    console.error('router.beforeEach: Máximo de redirecionamentos atingido, parando loop')
    redirectCount = 0
    return false // Parar navegação
  }
  
  // Inicializar auth se necessário (uma vez só)
  if (!auth.initialized && !auth.initializing) {
    console.log('router.beforeEach: Sem sessão, inicializando auth...')
    await auth.init()
  }
  
  // Aguardar um pouco se estiver inicializando
  if (auth.initializing) {
    let attempts = 0
    while (auth.initializing && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }
  }
  
  console.log('router.beforeEach: Sessão:', auth.session ? 'existe' : 'não existe')
  console.log('router.beforeEach: Perfil:', auth.profile)
  
  // Verificar se a rota requer autenticação OU admin (evitar verificação duplicada)
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requireAdmin)
  
  // Se rota requer auth OU é rota /app, verificar sessão
  if ((requiresAuth || to.path.startsWith('/app')) && !auth.session) {
    // Evitar redirect loop verificando se já estamos indo para login
    if (to.path !== '/login' && from.path !== '/login') {
      console.log('router.beforeEach: Rota requer auth, redirecionando para login...')
      redirectCount++
      return { path: '/login', query: { r: to.fullPath } }
    }
  }
  
  // Verificar se a rota requer admin
  if (requiresAdmin) {
    // Aguardar profile carregar (até 2 segundos)
    if (!auth.profile) {
      let profileWaitAttempts = 0
      while (!auth.profile && profileWaitAttempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 100))
        profileWaitAttempts++
      }
    }
    
    console.log('router.beforeEach: Verificando admin - profile:', auth.profile)
    console.log('router.beforeEach: Role atual:', auth.profile?.role)
    
    if (!auth.profile || auth.profile.role !== 'admin') {
      // Evitar redirect loop
      if (to.path !== '/app' && from.path !== '/app') {
        console.log('router.beforeEach: Rota requer admin, mas role é:', auth.profile?.role)
        redirectCount++
        return { path: '/app' }
      }
    }
  }
  
  redirectCount = 0 // Reset se chegou até aqui
  console.log('router.beforeEach: Navegação permitida')
})

export default router
