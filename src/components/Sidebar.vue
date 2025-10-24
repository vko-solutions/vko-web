<template>
  <aside class="w-72 border-r bg-white p-3">
    <h2 class="font-semibold mb-3">VKO Solution</h2>
    <div v-if="mode !== 'gov'">
      <h3 class="text-sm text-gray-500 mb-2">Ativos</h3>
      <ul>
        <li v-for="a in assets" :key="a.id">
          <button class="w-full text-left py-2 hover:bg-gray-100 rounded"
                  @click="$emit('select', a.id)">
            {{ a.name }}
          </button>
        </li>
      </ul>
      <div v-if="mode==='admin'" class="mt-4">
        <RouterLink class="inline-block bg-[#2B4C7E] text-white px-3 py-2 rounded" to="/app/reports/new">
          Inserir novo relatório
        </RouterLink>
      </div>
    </div>
    <div v-else>
      <h3 class="text-sm text-gray-500 mb-2">Informações</h3>
      <ul class="space-y-1">
        <li><RouterLink to="/app/assets">Dados</RouterLink></li>
        <li><RouterLink to="/app/assets">Contrato</RouterLink></li>
        <li><RouterLink to="/app/assets">Histórico de relatórios</RouterLink></li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{ mode: 'admin'|'prime'|'gov', assets: any[], activeAssetId: string | null }>()
defineEmits<{ (e:'select', id: string): void }>()
</script>
