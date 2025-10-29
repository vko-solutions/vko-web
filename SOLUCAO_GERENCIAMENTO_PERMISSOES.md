# 🎯 Solução: Gerenciamento de Permissões Escalável

## 🚨 **Problemas Identificados**

1. **Usuários não aparecem no painel de permissões**
   - Usuários criados diretamente no Supabase Auth não têm perfil em `users_profile`
   
2. **Falta de sincronização automática**
   - Cadastros via frontend devem criar perfil automaticamente
   
3. **Gerenciamento não é escalável**
   - Precisa de sistema para gerenciar permissões por categoria de forma eficiente

---

## ✅ **Solução Implementada**

### **1. Função RPC para Criar Perfis Faltantes**

Execute este SQL no Supabase SQL Editor:

```sql
-- =====================================================
-- FUNÇÃO: Criar perfil para usuários do Auth sem perfil
-- =====================================================

CREATE OR REPLACE FUNCTION admin_sync_missing_profiles()
RETURNS TABLE(
  user_id uuid,
  email text,
  name text,
  profile_created boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users_profile 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Apenas administradores podem sincronizar perfis';
  END IF;
  
  -- Retornar todos os usuários do Auth que não têm perfil
  RETURN QUERY
  SELECT 
    au.id as user_id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)) as name,
    false as profile_created
  FROM auth.users au
  LEFT JOIN public.users_profile up ON up.id = au.id
  WHERE up.id IS NULL
    AND au.email_confirmed_at IS NOT NULL  -- Apenas usuários confirmados
  ORDER BY au.created_at DESC;
END;
$$;

-- =====================================================
-- FUNÇÃO: Criar perfil para um usuário específico
-- =====================================================

CREATE OR REPLACE FUNCTION admin_create_profile_for_auth_user(
  p_user_id uuid,
  p_role text DEFAULT 'asset_governance'
)
RETURNS public.users_profile
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_email text;
  v_name text;
  v_result public.users_profile;
BEGIN
  -- Verificar se é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users_profile 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Apenas administradores podem criar perfis';
  END IF;
  
  -- Validar role
  IF p_role NOT IN ('admin', 'partner_manager', 'asset_governance', 'viewer') THEN
    RAISE EXCEPTION 'Role inválida: %', p_role;
  END IF;
  
  -- Buscar dados do usuário no Auth
  SELECT email, COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1))
  INTO v_email, v_name
  FROM auth.users
  WHERE id = p_user_id;
  
  IF v_email IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado no Auth';
  END IF;
  
  -- Inserir perfil
  INSERT INTO public.users_profile (id, email, name, role, company_id)
  VALUES (p_user_id, v_email, v_name, p_role, NULL)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(NULLIF(EXCLUDED.name, ''), users_profile.name),
    role = EXCLUDED.role
  RETURNING * INTO v_result;
  
  RETURN v_result;
END;
$$;

-- Grants
GRANT EXECUTE ON FUNCTION admin_sync_missing_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION admin_create_profile_for_auth_user(uuid, text) TO authenticated;
```

---

### **2. Melhorar Criação Automática no Frontend**

Modificar `src/stores/auth.ts` para garantir criação de perfil:

```typescript
async signUp(name: string, email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: {
        name: name
      }
    }
  })
  if (error) throw error
  
  // SEMPRE tentar criar perfil (mesmo se precisa confirmar email)
  if (data.user) {
    try {
      const { error: profileError } = await supabase.from('users_profile').insert({
        id: data.user.id, 
        name, 
        email, 
        role: 'asset_governance',  // Default: governança
        company_id: null
      })
      
      // Se deu erro de duplicado, tudo bem (já existe)
      if (profileError && profileError.code !== '23505') {
        console.error('Erro ao criar perfil:', profileError)
        // Não falhar o signup por causa disso
      }
    } catch (e) {
      console.error('Erro ao criar perfil:', e)
      // Não falhar o signup por causa disso
    }
  }
  
  return data
}
```

---

### **3. Adicionar Botão "Sincronizar Usuários" no Painel de Permissões**

Modificar `src/pages/AdminPermissions.vue` para adicionar:

```vue
<button
  @click="syncMissingProfiles"
  :disabled="loading"
  class="inline-flex items-center px-3 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 disabled:opacity-50"
>
  🔄 Sincronizar Usuários
</button>
```

E adicionar função:

```typescript
const syncMissingProfiles = async () => {
  try {
    loading.value = true
    
    // Buscar usuários sem perfil
    const { data: missingUsers, error } = await supabase.rpc('admin_sync_missing_profiles')
    
    if (error) throw error
    
    if (!missingUsers || missingUsers.length === 0) {
      success.value = 'Todos os usuários já possuem perfil!'
      setTimeout(() => success.value = '', 3000)
      return
    }
    
    // Criar perfis para cada usuário
    let created = 0
    for (const user of missingUsers) {
      try {
        await createMissingProfile(
          user.user_id,
          user.email,
          user.name,
          'asset_governance' // Default
        )
        created++
      } catch (e) {
        console.error(`Erro ao criar perfil para ${user.email}:`, e)
      }
    }
    
    success.value = `${created} perfil(is) criado(s) com sucesso!`
    
    // Recarregar lista
    await loadData()
    
  } catch (err: any) {
    error.value = 'Erro ao sincronizar: ' + err.message
  } finally {
    loading.value = false
  }
}
```

---

## 🎯 **Sistema de Gerenciamento Escalável**

### **Fluxo Completo:**

1. **Cadastro via Frontend** (`/register`)
   - ✅ Cria usuário no Auth
   - ✅ Cria perfil automaticamente com role `asset_governance` (default)
   - ✅ Aparece automaticamente no painel de permissões

2. **Cadastro Manual no Supabase** (Dashboard Auth)
   - ⚠️ Cria apenas usuário no Auth
   - ❌ **NÃO cria perfil em `users_profile`**
   - 💡 Admin clica "🔄 Sincronizar Usuários" para criar perfis faltantes

3. **Gerenciamento de Permissões** (`/app/admin/permissions`)
   - Admin vê todos os usuários
   - Admin pode:
     - ✅ Mudar role (admin, partner_manager, asset_governance)
     - ✅ Vincular a empresa (company_id)
     - ✅ Vincular ativos individuais (user_assets)
     - ✅ Gerenciar ACL por role (asset_acl)

---

## 📊 **Hierarquia de Permissões**

### **Admin** (`role = 'admin'`)
- ✅ Vê todos os ativos e relatórios
- ✅ Pode criar/deletar ativos
- ✅ Pode gerenciar todos os usuários
- ✅ Pode definir ACL para roles
- ✅ Pode fazer upload de relatórios

### **Partner Manager** (`role = 'partner_manager'`)
- ✅ Vê ativos da sua empresa
- ✅ Vê ativos liberados via ACL para role "partner_manager"
- ✅ Vê ativos vinculados individualmente (user_assets)
- ❌ NÃO pode criar/deletar ativos
- ❌ NÃO pode fazer upload

### **Asset Governance** (`role = 'asset_governance'`)
- ✅ Vê apenas ativos liberados via ACL para role "governance"
- ✅ Vê ativos vinculados individualmente (user_assets)
- ❌ NÃO pode criar/deletar ativos
- ❌ NÃO pode fazer upload

---

## 🔧 **Como Resolver o Problema Atual**

### **Passo 1: Execute o SQL no Supabase**

Copie e execute o SQL das funções RPC acima no Supabase SQL Editor.

### **Passo 2: Sincronize Usuários Faltantes**

1. Acesse `/app/admin/permissions` (como admin)
2. Clique no botão "🔄 Sincronizar Usuários"
3. Aguarde a sincronização
4. Os usuários faltantes aparecerão na lista

### **Passo 3: Ajuste Permissões**

Para cada usuário sincronizado:
1. Mude a role se necessário (governança, parceiro, admin)
2. Vincule ativos individuais se necessário
3. Ou gerencie ACL por role (mais escalável)

---

## 📈 **Melhorias Futuras Sugeridas**

### **1. Auto-sync em Background**
- Criar trigger no Supabase para criar perfil automaticamente quando usuário é criado no Auth

### **2. Importação em Lote**
- Botão para importar múltiplos usuários via CSV

### **3. Template de Permissões**
- Criar "perfis padrão" de permissões para aplicar rapidamente

### **4. Auditoria**
- Log de mudanças de permissões
- Histórico de quem modificou o quê

---

## ✅ **Checklist de Implementação**

- [ ] Executar SQL das funções RPC
- [ ] Adicionar botão "Sincronizar" no painel
- [ ] Implementar função `syncMissingProfiles()`
- [ ] Testar sincronização de usuários faltantes
- [ ] Verificar se todos os usuários aparecem
- [ ] Testar mudança de roles
- [ ] Testar gerenciamento de ACL
- [ ] Testar vinculação de ativos individuais

---

**Status:** 🔧 Implementação necessária. Após seguir os passos, todos os usuários aparecerão e serão gerenciáveis.

