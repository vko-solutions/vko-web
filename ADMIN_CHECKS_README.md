# 🧪 Admin Checks - Página de Diagnóstico

## 📍 O que foi criado

### Arquivos
1. **`src/pages/AdminChecks.vue`** - Página de diagnóstico completa
2. **Rota adicionada**: `/app/admin/checks`
3. **Link no sidebar**: 🧪 Diagnóstico

## 🎯 Funcionalidades

### Para ADMIN
- ✅ Criar report de teste
- ✅ Editar report
- ✅ Ler todos os reports
- ✅ Ler todos os assets
- ✅ Aplicar ACL via RPC para reports/assets
- ✅ Testar CRUD completo

### Para PARTNER MANAGER
- ✅ Ler assets (deve ver todos)
- ✅ Tentar criar report (deve ser bloqueado)

### Para ASSET GOVERNANCE
- ✅ Ler reports (apenas os liberados via ACL)
- ✅ Ler assets (apenas os liberados via ACL)
- ✅ Tentar criar report (deve ser bloqueado)

## 🚀 Como usar

### 1. Acessar a página
- Faça login na aplicação
- No sidebar, clique em **🧪 Diagnóstico**
- Ou acesse diretamente: `/app/admin/checks`

### 2. Executar testes
- Clique em **"Rodar testes"**
- Os testes serão executados automaticamente
- Resultados aparecerão em tempo real

### 3. Gerenciar ACL (apenas ADMIN)
- Preencha o **REPORT_ID** ou **ASSET_ID** manualmente
- Ou use os IDs criados automaticamente nos testes
- Clique nos botões para liberar/revogar acesso
- ✅ Verde = Liberar
- ❌ Vermelho = Revogar

## 📊 Tipos de Testes

### Testes Automáticos
```
✓ Contexto de sessão - verifica role e user_id
✓ Admin: criar report - cria report de teste
✓ Admin: editar report - atualiza título
✓ Admin: ler reports - lista reports
✓ Admin: ACL → liberar report - aplica permissão
✓ Admin: ler assets - lista assets
✓ Admin: ACL → liberar asset - aplica permissão
```

### Testes por Role
- **ADMIN**: Testes completos + CRUD
- **PARTNER**: Validação de leitura/bloqueio
- **GOVERNANCE**: Validação de ACL

## 🔧 Configuração Necessária

### SQL do Supabase
Execute o arquivo `rpc_acl_functions.sql` no SQL Editor do Supabase para habilitar as funções RPC:

```sql
-- Executar no Supabase SQL Editor
-- Arquivo: rpc_acl_functions.sql
```

### Tabelas de ACL
Certifique-se que as tabelas existem:
- `report_acl`
- `asset_acl`

## 🎨 Interface

### Layout
- **Cabeçalho**: Mostra role atual
- **Painel esquerdo**: IDs de teste + botões de ACL
- **Painel direito**: Botão de execução
- **Resultados**: Lista de testes com status visual

### Cores de Status
- 🔴 **Fail** - vermelho
- ✅ **Pass** - verde
- ⚠️ **Skip** - amarelo
- ⏳ **Pending** - cinza

## 💡 Dicas

### Testar diferentes roles
1. Clique em "Sair" (logout)
2. Faça login com outro usuário
3. Execute os testes novamente
4. Os resultados mudarão baseado na role

### Debugging
- Abra o console do navegador (F12)
- Veja logs detalhados de cada operação
- IDs criados são mostrados na interface

### Erros Comuns

#### "Função RPC não encontrada"
```sql
-- Execute no Supabase SQL Editor
-- Arquivo: rpc_acl_functions.sql
```

#### "Permissão negada"
- Verifique se é admin
- Verifique se RLS está configurado corretamente

#### "Tabela não encontrada"
- Execute os schemas: `reports_schema.sql` e tabelas de ACL

## 📝 Exemplo de Uso

### 1. Como Admin
```
1. Acesse /app/admin/checks
2. Clique em "Rodar testes"
3. Veja os resultados
4. Use os botões para testar ACL
```

### 2. Como Governance
```
1. Admin libera um asset via ACL
2. Governance acessa a página
3. Clique em "Rodar testes"
4. Deve ver apenas o asset liberado
```

## ✅ Checklist de Validação

- [ ] Página acessível em `/app/admin/checks`
- [ ] Link no sidebar funcionando
- [ ] Testes rodam sem erros
- [ ] ACL aplicável via botões
- [ ] Resultados mostram status correto
- [ ] Diferentes roles veem resultados diferentes
- [ ] RLS bloqueia operações não permitidas

---

**🎉 Página de Diagnóstico criada com sucesso!**


