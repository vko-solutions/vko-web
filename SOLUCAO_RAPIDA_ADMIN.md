# ⚡ Solução Rápida: Recuperar Acesso Admin

## 🚨 **Sintoma**

Mensagem: "Acesso negado. Apenas administradores podem gerenciar permissões"

## ✅ **Solução em 3 Passos**

### **PASSO 1: Verificar seu usuário no Auth**

Execute no **Supabase SQL Editor**:

```sql
SELECT id, email FROM auth.users WHERE email = 'SEU_EMAIL_AQUI';
-- Anote o ID que aparecer
```

### **PASSO 2: Criar/Atualizar seu perfil como Admin**

Substitua `SEU_USER_ID` pelo ID do PASSO 1:

```sql
INSERT INTO public.users_profile (id, email, name, role, company_id)
VALUES (
  'SEU_USER_ID',  -- Cole aqui o ID do passo 1
  'SEU_EMAIL_AQUI',
  'SEU_NOME_AQUI',
  'admin',  -- IMPORTANTE: role = admin
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin';  -- Força a role para admin
```

### **PASSO 3: Recarregar a aplicação**

1. Faça **logout** da aplicação
2. Feche e reabra o navegador
3. Faça **login** novamente
4. Acesse `/app/admin/permissions`

---

## 🔍 **Diagnóstico no Console**

Abra o console do navegador (F12) e procure por:

```
router.beforeEach: Verificando admin - profile: {...}
router.beforeEach: Role atual: admin
```

Se aparecer `Role atual: null` ou `Role atual: asset_governance`, execute o SQL acima.

---

## 🧪 **Teste Rápido**

Após executar o SQL, teste:

```sql
-- Verificar se funcionou
SELECT id, email, role FROM public.users_profile 
WHERE email = 'SEU_EMAIL_AQUI';
-- Deve mostrar: role = 'admin'
```

---

**Execute os 3 passos e me diga o resultado!**

