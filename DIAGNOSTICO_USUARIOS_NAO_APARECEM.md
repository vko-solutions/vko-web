# 🔍 Diagnóstico: Usuário não aparece no Painel de Permissões

## 🚨 **Problema Comum**

Usuários criados diretamente no Supabase Auth (sem passar pelo fluxo de cadastro da aplicação) podem não ter perfil criado na tabela `users_profile`, e por isso não aparecem no painel.

---

## ✅ **Soluções Implementadas**

### **1. Botão "🔍 Diagnóstico" no Painel**

Adicionado botão de diagnóstico que verifica:
- ✅ Se o usuário atual está logado corretamente
- ✅ Se o perfil do usuário atual existe em `users_profile`
- ✅ Quantos perfis foram encontrados na query
- ✅ Se há erros de RLS ou permissão
- ✅ Lista todos os usuários encontrados

**Como usar:**
1. Acesse `/app/admin/permissions`
2. Clique no botão "🔍 Diagnóstico"
3. Uma janela mostrará todas as informações
4. Veja o console (F12) para detalhes completos

---

### **2. Logs Detalhados**

Todos os métodos agora têm logs completos:

```javascript
// No console você verá:
listProfiles: Iniciando busca de perfis...
listProfiles: Usuário atual: [seu-id] [seu-email]
listProfiles: Perfis encontrados: X
listProfiles: IDs dos perfis: [...]
AdminPermissions: Dados carregados - { usuarios: X, empresas: Y, ativos: Z }
AdminPermissions: Lista de usuários: [...]
```

---

### **3. Tratamento de Erros Específicos**

- **Erro 42501 (Permissão Negada):** Mensagem clara explicando problema de RLS
- **Erro PGRST116 (Não encontrado):** Indica que perfil não existe
- **Outros erros:** Mensagem descritiva com código do erro

---

## 🔧 **Como Resolver o Problema**

### **Cenário 1: Usuário foi criado diretamente no Supabase**

**Sintoma:** Usuário existe no Auth mas não aparece na lista

**Solução:**

#### **Opção A: Via SQL no Supabase (Recomendado)**

1. Acesse Supabase Dashboard → SQL Editor
2. Execute:

```sql
-- Verificar usuários sem perfil
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'name' as name,
  up.id as profile_id
FROM auth.users au
LEFT JOIN public.users_profile up ON up.id = au.id
WHERE up.id IS NULL;

-- Criar perfil para um usuário específico
-- Substitua '<USER_ID>' e '<EMAIL>' pelos valores corretos
INSERT INTO public.users_profile (id, email, name, role, company_id)
VALUES (
  '<USER_ID>',
  '<EMAIL>',
  COALESCE((SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = '<USER_ID>'), '<EMAIL>'),
  'asset_governance', -- ou 'partner_manager', 'admin'
  NULL
);
```

#### **Opção B: Via Painel (se tiver função RPC)**

Criar função RPC no Supabase:

```sql
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
  -- Verificar se usuário atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users_profile 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Apenas administradores podem criar perfis';
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
    name = COALESCE(EXCLUDED.name, users_profile.name),
    role = EXCLUDED.role
  RETURNING * INTO v_result;
  
  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION admin_create_profile_for_auth_user TO authenticated;
```

---

### **Cenário 2: Problema de RLS**

**Sintoma:** Admin não vê nenhum usuário ou apenas alguns

**Verificação:**

1. Verifique se a política RLS está ativa:

```sql
-- Ver políticas ativas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'users_profile';
```

2. Verifique se o admin está com role correto:

```sql
SELECT id, email, role 
FROM public.users_profile 
WHERE email = 'seu-email-admin@exemplo.com';
```

3. Se necessário, recrie a política:

```sql
-- Remover política antiga (se houver duplicada)
DROP POLICY IF EXISTS "admin_view_all_profiles" ON public.users_profile;

-- Criar política correta
CREATE POLICY "users_profile_select_admin" ON public.users_profile
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users_profile 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

### **Cenário 3: Perfil não foi criado durante signUp**

**Sintoma:** Usuário se cadastrou mas perfil não foi criado

**Causa:** Erro no `signUp` ou RLS bloqueando INSERT

**Solução:** Usar a função `createMissingProfile()` ou SQL acima

---

## 🧪 **Teste Rápido**

### **No Console do Navegador (F12):**

```javascript
// 1. Verificar qual usuário está logado
const { data: current } = await supabase.auth.getUser()
console.log('Usuário atual:', current.user?.email, current.user?.id)

// 2. Verificar se o perfil existe
const { data: profile } = await supabase
  .from('users_profile')
  .select('*')
  .eq('id', current.user?.id)
  .single()
console.log('Perfil encontrado:', profile)

// 3. Tentar buscar todos os perfis (admin deveria ver todos)
const { data: all, error } = await supabase
  .from('users_profile')
  .select('*')
  .order('email')
console.log('Todos os perfis:', all)
console.log('Erro (se houver):', error)
```

---

## ✅ **Checklist de Verificação**

Execute este checklist quando um usuário não aparecer:

- [ ] Usuário existe no Supabase Auth? (Dashboard → Authentication → Users)
- [ ] Perfil existe em `users_profile`? (Dashboard → Table Editor → users_profile)
- [ ] Admin está logado corretamente? (Verificar console)
- [ ] Admin tem role = 'admin' no perfil? (Verificar tabela)
- [ ] Política RLS está ativa? (Verificar SQL Editor)
- [ ] Não há erros no console? (F12)
- [ ] Botão "Atualizar" foi clicado? (Recarregar lista)

---

## 📝 **Próximos Passos**

1. **Clique no botão "🔍 Diagnóstico"** no painel
2. **Veja o console (F12)** para logs detalhados
3. **Compare os IDs** entre Auth e users_profile
4. **Se perfil não existir**, crie usando SQL ou função RPC
5. **Se RLS estiver bloqueando**, ajuste as políticas

---

## 🔗 **Arquivos Relevantes**

- `src/services/admin.ts` - Função `listProfiles()` com logs
- `src/pages/AdminPermissions.vue` - Função `showDiagnostic()` e `createMissingProfile()`
- `vko_supabase_schema.sql` - Políticas RLS originais
- `admin_rpc_functions.sql` - Funções RPC de admin

---

**Status:** ✅ Diagnóstico implementado. Use o botão "🔍 Diagnóstico" para identificar o problema exato!


