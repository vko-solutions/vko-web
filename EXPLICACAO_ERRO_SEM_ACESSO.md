# ⚠️ Explicação: Erro "Sem acesso ao arquivo"

## 📋 **O que significa "⚠️ Sem acesso ao arquivo"?**

Quando você vê esta mensagem em um relatório, significa que:

1. ✅ **Você CONSEGUE ver** o relatório na lista (metadados na tabela `reports`)
2. ❌ **Você NÃO CONSEGUE baixar** o arquivo físico (no Storage)

---

## 🔍 **Por que isso acontece?**

Isso ocorre quando há uma diferença entre:

### **1. Permissão na Tabela `reports` (RLS)**
- Você tem acesso para **VER** o registro na tabela
- Suas políticas RLS permitem `SELECT` na tabela `reports`

### **2. Permissão no Storage `reports`**
- Você **NÃO tem permissão** para acessar o arquivo físico no bucket
- As políticas do Storage estão bloqueando o acesso

---

## 🛠️ **Causas Comuns**

### **Causa 1: Políticas do Storage não configuradas**
As políticas do Storage não estão aplicando as mesmas regras que as políticas RLS da tabela.

**Solução:** Execute o SQL do arquivo `STORAGE_SETUP.md` no Supabase SQL Editor.

### **Causa 2: Arquivo removido manualmente**
O arquivo foi deletado do Storage mas o registro permanece na tabela.

**Solução:** Admin deve verificar se o arquivo existe no bucket e recriar se necessário.

### **Causa 3: ACL não sincronizada**
Você tem ACL para ver o relatório, mas o Storage não tem política correspondente.

**Solução:** Verificar se as políticas do Storage consideram ACL (`report_acl`).

---

## ✅ **Como Resolver**

### **Para Administradores:**

1. **Verificar políticas do Storage:**
   ```sql
   SELECT * FROM pg_policies 
   WHERE tablename = 'objects' 
   AND schemaname = 'storage';
   ```

2. **Verificar se o arquivo existe:**
   - Acesse Supabase Dashboard → Storage → bucket `reports`
   - Procure pelo caminho do arquivo (campo `file_path` do relatório)

3. **Recriar políticas se necessário:**
   - Execute o SQL de `STORAGE_SETUP.md`
   - Garanta que as políticas consideram ACL

### **Para Usuários não-admin:**

- **Contate o administrador** para:
  - Liberar acesso ao ativo via ACL
  - Verificar se as políticas do Storage estão corretas
  - Recriar o arquivo se foi removido

---

## 📝 **Mensagem Melhorada na Interface**

Agora a mensagem de erro inclui:

```
⚠️ Sem acesso ao arquivo

Você pode ver este relatório, mas não tem permissão para baixar o arquivo.
[Se não for admin] Contate o administrador para liberar acesso a este ativo.
[Se for admin] Verifique as políticas do Storage ou se o arquivo existe.
```

---

## 🔗 **Arquivos Relacionados**

- `STORAGE_SETUP.md` - Configuração completa do Storage
- `src/services/reports.ts` - Função `getSignedUrl()` com tratamento de erros
- `src/pages/Reports.vue` - Interface com mensagem explicativa
- `reports_schema.sql` - Políticas RLS da tabela `reports`

---

**Status:** ✅ Mensagem de erro melhorada implementada!


