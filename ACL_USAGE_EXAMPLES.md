# 🎯 Como Usar ACL no Frontend

Este guia mostra como usar as funções RPC para gerenciar acesso a reports e assets.

## 📦 Setup

### 1. Executar SQL no Supabase

Execute o arquivo `rpc_acl_functions.sql` no SQL Editor do Supabase para criar as funções RPC.

## 🚀 Uso no Frontend

### Importar o serviço

```typescript
import { 
  liberateReportForGovernance,
  liberateAssetForGovernance,
  setReportAccess,
  setAssetAccess
} from '@/services/acl'
```

## 📝 Exemplos de Uso

### Exemplo 1: Liberar report para toda governança

```typescript
import { liberateReportForGovernance } from '@/services/acl'

// No componente ou função
async function handleLiberateReport(reportId: string) {
  try {
    await liberateReportForGovernance(reportId)
    console.log('Acesso liberado com sucesso!')
  } catch (error) {
    console.error('Erro ao liberar acesso:', error)
  }
}

// Usar
await liberateReportForGovernance('report-uuid-here')
```

### Exemplo 2: Liberar asset para usuário específico

```typescript
import { liberateAssetForUser } from '@/services/acl'

async function handleLiberateAsset(assetId: string, userId: string) {
  try {
    await liberateAssetForUser(assetId, userId)
    console.log('Acesso liberado para o usuário!')
  } catch (error) {
    console.error('Erro ao liberar acesso:', error)
  }
}

// Usar
await liberateAssetForUser('asset-uuid-here', 'user-uuid-here')
```

### Exemplo 3: Liberar com permissões customizadas

```typescript
import { setReportAccess, setAssetAccess } from '@/services/acl'

// Liberar report para role 'governance' com read e write
await setReportAccess({
  p_report_id: 'report-uuid',
  p_subject_type: 'role',
  p_subject_id: 'asset_governance',
  p_can_read: true,
  p_can_write: true  // Permite edição
})

// Liberar asset para empresa específica
await setAssetAccess({
  p_asset_id: 'asset-uuid',
  p_subject_type: 'company',
  p_subject_id: 'company-uuid',
  p_can_read: true,
  p_can_write: false
})
```

## 🎨 Exemplo Prático no Componente Vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { liberateReportForGovernance, liberateAssetForGovernance } from '@/services/acl'

const loading = ref(false)
const error = ref('')
const success = ref(false)

async function liberarReportParaGovernanca(reportId: string) {
  loading.value = true
  error.value = ''
  success.value = false
  
  try {
    await liberateReportForGovernance(reportId)
    success.value = true
    console.log('Report liberado com sucesso!')
  } catch (err: any) {
    error.value = err.message
    console.error('Erro:', err)
  } finally {
    loading.value = false
  }
}

async function liberarAssetParaGovernanca(assetId: string) {
  loading.value = true
  error.value = ''
  success.value = false
  
  try {
    await liberateAssetForGovernance(assetId)
    success.value = true
    console.log('Asset liberado com sucesso!')
  } catch (err: any) {
    error.value = err.message
    console.error('Erro:', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <button @click="liberarReportParaGovernanca('report-id')" :disabled="loading">
      Liberar Report
    </button>
    
    <button @click="liberarAssetParaGovernanca('asset-id')" :disabled="loading">
      Liberar Asset
    </button>
    
    <p v-if="success" class="text-green-600">Liberado com sucesso!</p>
    <p v-if="error" class="text-red-600">{{ error }}</p>
  </div>
</template>
```

## 🔐 Permissões Requeridas

⚠️ **Importante:** Apenas usuários com role `admin` podem usar essas funções.

```typescript
import { useAuth } from '@/stores/auth'

const auth = useAuth()

// Verificar se é admin antes de executar
if (!auth.is('admin')) {
  throw new Error('Apenas administradores podem gerenciar acesso')
}

await liberateReportForGovernance('report-id')
```

## 🧪 Subject Types Disponíveis

- `user` - Liberar para um usuário específico
- `role` - Liberar para todos os usuários de uma role
- `company` - Liberar para todos os usuários de uma empresa

## 📋 Subject IDs Comuns

- Roles: `'admin'`, `'partner_manager'`, `'asset_governance'`
- Usuários: UUID do usuário
- Empresas: UUID da empresa

## ✅ Resultado Esperado

Após executar, os usuários com as permissões liberadas poderão:

- Ver os reports/assets liberados
- Acessar os dados via queries
- Fazer operações permitidas (baseado em RLS)

## 🔍 Verificar Acessos Liberados

```typescript
// Ver quais reports estão liberados para governance
const { data } = await supabase
  .from('report_acl')
  .select('*')
  .eq('subject_type', 'role')
  .eq('subject_id', 'asset_governance')
  .eq('can_read', true)

console.log('Reports liberados:', data)
```

## ❌ Remover Acesso

```typescript
import { removeReportAccess, removeAssetAccess } from '@/services/acl'

// Remover acesso de um report
await removeReportAccess('report-id', 'role', 'asset_governance')

// Remover acesso de um asset
await removeAssetAccess('asset-id', 'user', 'user-uuid')
```

---

**✅ Agora você pode gerenciar acesso de forma simples e segura!** 🎉


