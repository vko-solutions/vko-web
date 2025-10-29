# 🔍 Verificação: Conta Admin Desapareceu

## 🚨 **Problema**

Conta que antes era Admin no Supabase não está mais aparecendo com role admin.

## 🔍 **Diagnóstico Rápido**

### **1. Verificar se o usuário ainda está no Auth**

Execute este SQL no Supabase SQL Editor:

```sql
-- Ver TODOS os usuários no Auth
SELECT 
  id,
  email,
  raw_user_meta_data->>'name' as name,
  email_confirmed_at,
  created_at,
  updated_at
FROM auth.users
ORDER BY created_at DESC;
```

**Você deve ver seu email na lista!**

---

### **2. Verificar se o perfil existe em users_profile**

```sql
-- Ver TODOS os perfis
SELECT 
  id,
  email,
  name,
  role,
  company_id,
  created_at
FROM public.users_profile
ORDER BY created_at DESC;
```

**Se você NÃO aparecer aqui, o problema é que seu perfil foi deletado ou nunca foi criado!**

---

### **3. Verificar role específica**

```sql
-- Verificar SEU perfil especificamente
SELECT 
  id,
  email,
  name,
  role,
  company_id
FROM public.users_profile
WHERE email = 'SEU_EMAIL_AQUI@dominio.com';  -- Substitua pelo seu email
```

**Se não aparecer nada, seu perfil não existe!**

---

## ✅ **Soluções**

### **Solução A: Perfil foi deletado acidentalmente**

Se seu email existe no Auth mas NÃO em users_profile, recrie o perfil:

```sql
-- IMPORTANTE: Substitua os valores abaixo pelos seus dados reais
-- 1. Pegue seu USER_ID do resultado da query do passo 1
-- 2. Substitua 'SEU_EMAIL_AQUI' pelo seu email
-- 3. Substitua 'SEU_NOME_AQUI' pelo seu nome

INSERT INTO public.users_profile (id, email, name, role, company_id)
VALUES (
  'SEU_USER_ID_AQUI',  -- Copie o ID da query do passo 1
  'SEU_EMAIL_AQUI@dominio.com',
  'SEU_NOME_AQUI',
  'admin',  -- Definir como admin
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  email = EXCLUDED.email;
```

---

### **Solução B: Role foi alterada acidentalmente**

Se seu perfil existe mas a role mudou:

```sql
-- Alterar sua role de volta para admin
UPDATE public.users_profile
SET role = 'admin'
WHERE email = 'SEU_EMAIL_AQUI@dominio.com';  -- Substitua pelo seu email
```

---

### **Solução C: Usuário foi deletado do Auth**

Se você NÃO aparece no passo 1 (query do auth.users):

1. **Crie uma nova conta** com email diferente
2. **Ou recupere a conta** se tem acesso ao Supabase Dashboard
3. **Depois crie o perfil** usando o SQL da Solução A

---

## 🧪 **Testar Conexão**

### **1. Login no Frontend**

Acesse `/login` e tente fazer login com seu email e senha.

### **2. Ver Console do Navegador (F12)**

Procure por mensagens como:
```
auth.init: Iniciando...
fetchProfile: Iniciando para user_id: ...
fetchProfile: Perfil encontrado: { role: '...' }
```

### **3. Usar o Diagnóstico**

Acesse `/app/admin/permissions` e clique no botão "🔍 Diagnóstico". Veja o que aparece.

---

## 🔧 **Verificar RLS (Row Level Security)**

Execute este SQL para ver as políticas ativas:

```sql
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

**Devem existir políticas:**
- `users_profile_select_own` - usuário vê seu próprio perfil
- `users_profile_select_admin` - admin vê todos os perfis

---

## 🎯 **Action Items**

1. ✅ Execute a query do passo 1 (ver auth.users)
2. ✅ Execute a query do passo 2 (ver users_profile)
3. ✅ Compare os resultados
4. ✅ Se não está em users_profile: Use Solução A
5. ✅ Se está mas role errada: Use Solução B
6. ✅ Faça logout e login novamente
7. ✅ Teste o acesso admin

---

## 📝 **SQL Completo de Recuperação (Substitua os valores)**

```sql
-- PASSO 1: Verificar se você está no Auth
SELECT id, email FROM auth.users WHERE email = 'SEU_EMAIL_AQUI';

-- PASSO 2: Pegar o USER_ID do resultado acima e inserir/atualizar perfil
INSERT INTO public.users_profile (id, email, name, role, company_id)
VALUES (
  'COLE_O_USER_ID_AQUI',  -- Do resultado do PASSO 1
  'SEU_EMAIL_AQUI',
  'SEU_NOME_AQUI',
  'admin',
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  email = EXCLUDED.email,
  name = COALESCE(EXCLUDED.name, users_profile.name);

-- PASSO 3: Verificar se funcionou
SELECT * FROM public.users_profile WHERE email = 'SEU_EMAIL_AQUI';
-- Deve mostrar: role = 'admin'
```

---

**Execute os passos e me diga o resultado!**

