declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Vue Router Types - estender RouteMeta
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requireAdmin?: boolean
  }
}

