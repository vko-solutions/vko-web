<template>
  <div v-if="canAccess">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/stores/auth'

const props = defineProps<{
  anyOf: string[]
}>()

const auth = useAuth()

const canAccess = computed(() => {
  const role = auth.profile?.role
  
  // Mapear permissões por papel
  const rolePermissions: Record<string, string[]> = {
    admin: [
      'project.read',
      'project.write',
      'task.read',
      'task.write',
      'kpi.read',
      'user.manage',
      'governance.read',
      'governance.write',
    ],
    partner_manager: [
      'project.read',
      'task.read',
      'task.write',
      'kpi.read',
    ],
    asset_governance: [
      'project.read',
      'kpi.read',
      'governance.read',
    ],
  }
  
  const userPermissions = rolePermissions[role || 'asset_governance'] || []
  
  return props.anyOf.some(permission => userPermissions.includes(permission))
})
</script>
