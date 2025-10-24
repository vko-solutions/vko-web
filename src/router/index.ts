import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuth } from '@/stores/auth'

const routes = [
  { path: '/', component: () => import('@/pages/Landing.vue') },
  { path: '/login', component: () => import('@/pages/Login.vue') },
  { path: '/register', component: () => import('@/pages/Register.vue') },
  { path: '/app', component: () => import('@/pages/AppLayout.vue'),
    children: [
      { path: '', name: 'dashboard', component: () => import('@/pages/Dashboard.vue') },
      { path: 'reports', name: 'reports', component: () => import('@/pages/Reports.vue') },
      { path: 'reports/new', name: 'reportNew', component: () => import('@/pages/ReportNew.vue') },
      { path: 'admin/permissions', name: 'adminPermissions', component: () => import('@/pages/AdminPermissions.vue') },
      { path: 'settings', name: 'settings', component: () => import('@/pages/Settings.vue') },
    ]
  }
]

const router = createRouter({ history: createWebHashHistory(), routes })

router.beforeEach(async (to) => {
  const auth = useAuth()
  if (!auth.session) await auth.init()
  if (to.path.startsWith('/app') && !auth.session) return { path: '/login', query: { r: to.fullPath } }
})

export default router
