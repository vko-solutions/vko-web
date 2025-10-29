# 📊 Logs de Diagnóstico - Entendendo os Erros

## ✅ **Os logs estão nos ajudando!**

Os logs que você está vendo são **normais e esperados** em alguns casos. Vamos entender cada um:

---

## 1. ⚠️ **Relatório de Teste sem Arquivo**

### **Log:**
```
Erro ao gerar URL assinada para QA Report (editado) (test/test-report.ppt): 
Error: Arquivo não encontrado no storage. O arquivo pode ter sido removido.
```

### **O que significa:**
- ✅ **Esperado e Normal**: Este relatório foi criado pela página de **Diagnóstico** (`AdminChecks.vue`)
- ✅ **Funciona assim**: O teste cria apenas os **metadados** na tabela `reports` para validar RLS/ACL
- ❌ **Não cria arquivo**: O arquivo físico **não é enviado** ao Storage (por design)

### **Por que acontece:**
- A página de diagnóstico cria relatórios de teste com `file_path: 'test/test-report.ppt'`
- Isso permite testar permissões sem precisar fazer upload real
- O arquivo nunca existiu no Storage, então o erro é esperado

### **Solução:**
- ✅ **Já implementado**: Agora relatórios de teste mostram "🧪 Relatório de teste (sem arquivo)" em vez de erro
- ✅ **Logs filtrados**: Erros de relatórios de teste não aparecem mais no console (só os reais)

---

## 2. ⏱️ **Timeout no fetchProfile**

### **Log:**
```
fetchProfile: Erro ao buscar/criar perfil: Error: Timeout ao buscar perfil
fetchProfile: Usando fallback JWT após erro crítico
```

### **O que significa:**
- ✅ **Fallback funcionando**: O sistema detectou timeout e usou a role do JWT
- ✅ **Seguro**: Você continua com acesso (role = 'admin' do JWT)
- ⚠️ **Sintoma**: O banco pode estar lento OU há problema de rede

### **Por que acontece:**
- Query na tabela `users_profile` demorou mais de 5 segundos
- Pode ser: rede lenta, banco sobrecarregado, ou política RLS complexa

### **Solução:**
- ✅ **Já implementado**: Fallback JWT garante que a app continue funcionando
- ✅ **Perfil criado**: O sistema tenta criar o perfil em background
- 💡 **Melhorias futuras**: Reduzir timeout para 3s ou cachear perfil

---

## 3. ✅ **Auth State - Tudo OK**

### **Log:**
```
auth.init: Auth state changed: SIGNED_IN sessão existe
```

### **O que significa:**
- ✅ **Tudo funcionando**: Você está autenticado corretamente
- ✅ **Sessão ativa**: O Supabase confirmou sua sessão

---

## 📋 **Resumo dos Logs**

| Log | Status | Ação Necessária |
|-----|--------|-----------------|
| `QA Report (editado) - Arquivo não encontrado` | ✅ Normal (teste) | Nenhuma - já filtrado |
| `Timeout ao buscar perfil` | ⚠️ Atenção | Verificar performance do banco |
| `Usando fallback JWT` | ✅ Funcionando | Nenhuma - fallback funcionou |
| `SIGNED_IN sessão existe` | ✅ OK | Nenhuma |

---

## 🔍 **Como Analisar os Logs**

### **Logs que DEVEM aparecer:**
- ✅ Informações de carregamento (`Carregando...`, `Dados carregados...`)
- ✅ Erros de relatórios de teste (filtrados agora)
- ✅ Fallbacks sendo aplicados

### **Logs que DEVEM te preocupar:**
- ❌ Erros 403/401 repetidos (sem permissão)
- ❌ Timeout constante (banco lento)
- ❌ Erros 500 do servidor
- ❌ Erros de arquivos reais (não de teste)

### **Logs que são informativos:**
- ℹ️ `fetchProfile: Iniciando...` - Operação iniciada
- ℹ️ `listProfiles: Perfis encontrados: X` - Operação concluída
- ℹ️ `Usando fallback JWT` - Sistema adaptando-se

---

## 🛠️ **Melhorias Implementadas**

1. ✅ **Detecção de relatórios de teste**
   - Relatórios com `file_path` começando com `test/` não geram erro vermelho
   - Mostram badge azul "🧪 Relatório de teste"

2. ✅ **Logs filtrados**
   - Erros esperados de relatórios de teste não aparecem mais no console
   - Apenas erros reais são logados

3. ✅ **Mensagens mais claras**
   - Interface diferencia entre erro real e teste
   - Mensagens específicas por tipo de erro

---

## 📝 **Próximos Passos**

### **Se ver muitos timeouts:**
```sql
-- Verificar índices na tabela users_profile
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'users_profile';
```

### **Se ver muitos erros 403:**
- Verificar políticas RLS da tabela `reports`
- Verificar políticas do Storage bucket `reports`
- Verificar se ACL está configurada corretamente

### **Para limpar relatórios de teste:**
```sql
-- Cuidado: apenas admin deve executar
DELETE FROM public.reports 
WHERE file_path LIKE 'test/%';
```

---

**Status:** ✅ Logs estão ajudando! Sistema de diagnóstico funcionando.


