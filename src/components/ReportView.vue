<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-semibold">Relatórios semanais</h3>
      <RouterLink v-if="isAdmin" to="/app/reports/new" class="bg-[#2B4C7E] text-white px-3 py-2 rounded">
        Inserir novo
      </RouterLink>
    </div>

    <div v-if="latest">
      <h4 class="font-medium">Último: {{ latest.title }} ({{ latest.week_start }})</h4>
      <div class="mt-2">
        <a v-if="latestSignedUrl" :href="latestSignedUrl" target="_blank" class="text-blue-800 underline">Abrir relatório (PPT)</a>
      </div>
    </div>

    <div class="mt-6">
      <h4 class="font-medium mb-2">Histórico</h4>
      <ul class="space-y-1">
        <li v-for="r in list" :key="r.id">
          <a :href="signedUrls[r.id]" target="_blank" class="text-[#2B4C7E] underline">
            {{ r.title }} — {{ r.week_start }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { getSignedUrl, listReportsByAsset } from '@/services/reports'

const props = defineProps<{ assetId: string, isAdmin?: boolean }>()
const latest = ref<any | null>(null)
const latestSignedUrl = ref<string | null>(null)
const list = ref<any[]>([])
const signedUrls = ref<Record<string, string>>({})

async function load() {
  // carrega lista e último
  const items = await listReportsByAsset(props.assetId)
  list.value = items
  latest.value = items?.[0] ?? null

  if (latest.value) {
    const url = await getSignedUrl(latest.value.file_path)
    latestSignedUrl.value = url
  }

  const urls: Record<string,string> = {}
  for (const r of list.value) {
    const url = await getSignedUrl(r.file_path)
    urls[r.id] = url
  }
  signedUrls.value = urls
}

onMounted(load)
watch(() => props.assetId, load)
</script>
