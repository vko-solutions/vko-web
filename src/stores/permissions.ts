import { computed } from 'vue'
import { useAuth } from './auth'

export function usePermissions() {
  const auth = useAuth()
  const isAdmin = computed(() => auth.profile?.role === 'admin')
  const isPrime = computed(() => auth.profile?.role === 'partner_manager')
  const isGov  = computed(() => auth.profile?.role === 'asset_governance')
  return { isAdmin, isPrime, isGov }
}
