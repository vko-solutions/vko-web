# ✅ Verificação de Conexão - Ativos com Supabase

## 🔗 **SIM, os ativos estão conectados ao Supabase!**

### **Como funciona a conexão:**

1. **Conexão inicial:** `src/lib/supabase.ts`
   - Usa `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` do `.env`
   - Cria cliente Supabase que se conecta ao banco

2. **Operações CRUD nos Ativos:**

   **✅ CREATE (Criar):**
   ```typescript
   // src/pages/AdminAssets.vue linha 195-199
   await supabase
     .from('assets')
     .insert({ id: assetId, name, code, company_id })
     .select('id, name, code, company_id')
     .single()
   ```

   **✅ READ (Ler/Listar):**
   ```typescript
   // src/pages/AdminAssets.vue linha 65-68
   await supabase
     .from('assets')
     .select('id, name, code, company_id')
     .order('name', { ascending: true })
   ```

   **✅ UPDATE (Atualizar ACL):**
   ```typescript
   // src/pages/AdminAssets.vue linha 136-141
   await supabase.rpc('set_asset_access', {
     p_asset_id: assetId,
     p_subject_type: 'role',
     p_subject_id: role,
     p_can_read: canRead,
   })
   ```

   **✅ DELETE (Deletar):**
   ```typescript
   // src/services/assets.ts linha 55-59
   await supabase
     .from('assets')
     .delete()
     .eq('id', assetId)
   ```

---

## 🔍 **Como Verificar se está Funcionando:**

### **1. Verificar Console do Navegador (F12)**

Ao criar um ativo, você deve ver:
```
fetchAssets: Carregando ativos...
fetchAssets: Ativos carregados: X
Ativo criado com sucesso: { id: "...", name: "...", ... }
```

Se houver erro, aparecerá algo como:
```
Erro ao criar ativo: [mensagem do Supabase]
Erro na query: [detalhes do erro]
```

### **2. Verificar Variáveis de Ambiente**

Arquivo `.env` na raiz do projeto deve conter:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

### **3. Verificar se a Tabela Existe no Supabase**

No Supabase Dashboard:
- Vá em **Table Editor**
- Deve existir a tabela `assets` com colunas:
  - `id` (UUID, Primary Key)
  - `name` (text)
  - `code` (text, nullable)
  - `company_id` (UUID, nullable)

### **4. Verificar RLS (Row Level Security)**

No Supabase Dashboard:
- Vá em **Authentication** > **Policies**
- A tabela `assets` deve ter políticas RLS ativadas
- Admin deve conseguir ver/criar/deletar todos
- Partner deve ver apenas os da sua empresa
- Governance deve ver apenas os com ACL

---

## 🚨 **Possíveis Problemas e Soluções:**

### **Problema 1: "Could not find the 'assets' table"**
**Causa:** Tabela não existe no Supabase  
**Solução:** Criar tabela usando o SQL schema (`vko_supabase_schema.sql`)

### **Problema 2: "new row violates row-level security policy"**
**Causa:** RLS bloqueando a operação  
**Solução:** Verificar políticas RLS e garantir que admin tem permissão

### **Problema 3: "Invalid API key"**
**Causa:** `VITE_SUPABASE_ANON_KEY` incorreta  
**Solução:** Verificar `.env` e recarregar servidor (`npm run dev`)

### **Problema 4: Ativos não aparecem após criar**
**Causa:** Filtro RLS ou ACL bloqueando  
**Solução:** 
- Verificar se está logado como admin
- Verificar políticas RLS
- Verificar console para erros

---

## 🧪 **Teste Rápido de Conexão:**

Abra o console do navegador (F12) e execute:

```javascript
// Testar conexão básica
const { data, error } = await supabase
  .from('assets')
  .select('count')
  
console.log('Conexão:', error ? '❌ ERRO' : '✅ OK', error || data)

// Testar criação (admin apenas)
const { data: newAsset, error: createError } = await supabase
  .from('assets')
  .insert({ 
    id: crypto.randomUUID(), 
    name: 'Teste Conexão' 
  })
  .select()
  .single()

console.log('Criação:', createError ? '❌ ERRO' : '✅ OK', createError || newAsset)
```

---

## 📊 **Fluxo Completo:**

```
Usuário cria ativo
    ↓
AdminAssets.vue → createAsset()
    ↓
supabase.from('assets').insert(...)
    ↓
Supabase Database (tabela assets)
    ↓
RLS verifica permissões
    ↓
INSERT é aceito/rejeitado
    ↓
Retorna sucesso/erro
    ↓
fetchAssets() recarrega lista
    ↓
Ativos aparecem na UI
```

---

## ✅ **Status Atual:**

Com base no código analisado:
- ✅ Conexão configurada (`src/lib/supabase.ts`)
- ✅ CREATE funcionando (`AdminAssets.vue`)
- ✅ READ funcionando (`fetchAssets()`)
- ✅ DELETE funcionando (`deleteAsset()`)
- ✅ UPDATE ACL funcionando (`toggleRole()`)
- ✅ RLS integrado (filtra por permissões)

**Se você criar um ativo e ele aparecer na lista, a conexão está funcionando perfeitamente!** 🎉


