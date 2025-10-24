<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-6 text-[#2B4C7E]">Permissões</h1>

    <!-- USUÁRIOS -->
    <section class="bg-white rounded-lg shadow p-4 mb-6">
      <h2 class="font-semibold mb-3">Usuários</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-gray-500 border-b">
              <th class="py-2">Nome</th>
              <th class="py-2">Email</th>
              <th class="py-2">Papel</th>
              <th class="py-2">Empresa</th>
              <th class="py-2">Vínculos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.id" class="border-b">
              <td class="py-2">{{ u.name ?? '—' }}</td>
              <td class="py-2">{{ u.email }}</td>
              <td class="py-2">
                <select v-model="u.role" @change="onSetRole(u)" class="border rounded px-2 py-1">
                  <option value="admin">Administrativo</option>
                  <option value="partner_manager">Parceiros (Prime)</option>
                  <option value="asset_governance">Governança</option>
                </select>
              </td>
              <td class="py-2">
                <select v-model="u.company_id" @change="onSetCompany(u)" class="border rounded px-2 py-1">
                  <option :value="null">—</option>
                  <option v-for="c in companies" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </td>
              <td class="py-2">
                <button class="text-[#2B4C7E] underline text-sm" @click="openAssets(u)">gerenciar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- MODAL VÍNCULOS DE ATIVOS -->
    <section v-if="showAssets" class="fixed inset-0 bg-black/30 grid place-items-center">
      <div class="bg-white rounded-lg p-4 w-[520px]">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold">Vínculos de ativos — {{ currentUser?.email }}</h3>
          <button @click="closeAssets">✕</button>
        </div>
        <div class="space-y-2 max-h-[50vh] overflow-auto">
          <label v-for="a in assets" :key="a.id" class="flex items-center gap-2">
            <input type="checkbox" :checked="selectedAssetIds.has(a.id)" @change="toggleAsset(a.id, $event)" />
            <span>{{ a.name }} <small class="text-gray-500">({{ a.code ?? 's/ código' }})</small></span>
          </label>
        </div>
        <div class="mt-4 text-right">
          <button class="px-3 py-2 rounded border mr-2" @click="closeAssets">Cancelar</button>
          <button class="px-3 py-2 rounded bg-[#2B4C7E] text-white" @click="saveAssets">Salvar</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  listProfiles, listCompanies, listAssets, listUserAssets,
  adminSetRole, adminSetUserCompany, adminAddUserAsset, adminRemoveUserAsset
} from '@/services/admin'

type User = { id:string; name:string|null; email:string|null; role:'admin'|'partner_manager'|'asset_governance'; company_id:string|null }

const users = ref<User[]>([])
const companies = ref<{id:string; name:string}[]>([])
const assets = ref<{id:string; name:string; code:string|null}[]>([])
const showAssets = ref(false)
const currentUser = ref<User|null>(null)
const selectedAssetIds = ref<Set<string>>(new Set())

onMounted(async () => {
  users.value = await listProfiles()
  companies.value = await listCompanies()
  assets.value = await listAssets()
})

async function onSetRole(u: User) {
  try { await adminSetRole(u.id, u.role) } catch(e:any){ alert(e.message) }
}
async function onSetCompany(u: User) {
  try { await adminSetUserCompany(u.id, u.company_id) } catch(e:any){ alert(e.message) }
}

async function openAssets(u: User) {
  currentUser.value = u
  const ids = await listUserAssets(u.id)
  selectedAssetIds.value = new Set(ids)
  showAssets.value = true
}
function closeAssets(){ showAssets.value = false; currentUser.value = null }
function toggleAsset(assetId: string, ev: Event) {
  const checked = (ev.target as HTMLInputElement).checked
  if (checked) selectedAssetIds.value.add(assetId)
  else selectedAssetIds.value.delete(assetId)
}
async function saveAssets() {
  if (!currentUser.value) return
  try {
    const existing = new Set(await listUserAssets(currentUser.value.id))
    // add novos
    for (const id of selectedAssetIds.value) {
      if (!existing.has(id)) await adminAddUserAsset(currentUser.value.id, id)
    }
    // remover desmarcados
    for (const id of existing) {
      if (!selectedAssetIds.value.has(id)) await adminRemoveUserAsset(currentUser.value.id, id)
    }
    alert('Vínculos salvos')
    closeAssets()
  } catch(e:any){ alert(e.message) }
}
</script>
