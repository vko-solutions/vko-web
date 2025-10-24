# VKO Solution - Checklist de Configuração Completa

## ✅ **CHECKLIST PARA APLICAÇÃO FUNCIONAL**

### 📊 **1. Banco de Dados Supabase**
- [ ] Executar `vko_supabase_schema.sql` no SQL Editor
- [ ] Executar `reports_schema.sql` no SQL Editor  
- [ ] Verificar se todas as tabelas foram criadas:
  - [ ] `companies`
  - [ ] `users_profile`
  - [ ] `assets`
  - [ ] `user_assets`
  - [ ] `reports`
- [ ] Verificar se todas as views foram criadas:
  - [ ] `v_my_assets`
  - [ ] `v_current_user`
  - [ ] `v_my_reports`
- [ ] Verificar se RLS está habilitado em todas as tabelas
- [ ] Verificar se todas as políticas RLS estão ativas

### 🗄️ **2. Storage Supabase**
- [ ] Criar bucket `reports` no Storage
- [ ] Configurar bucket como privado
- [ ] Executar políticas de storage do `STORAGE_SETUP.md`
- [ ] Verificar se RLS está habilitado no bucket
- [ ] Testar upload de arquivo PPT

### 🔐 **3. Autenticação**
- [ ] Configurar arquivo `.env` com credenciais corretas
- [ ] Verificar se `VITE_SUPABASE_URL` está correto
- [ ] Verificar se `VITE_SUPABASE_ANON_KEY` está correto
- [ ] Testar registro de usuário
- [ ] Testar login de usuário
- [ ] Verificar criação automática de perfil

### 👥 **4. Usuários e Permissões**
- [ ] Criar usuário admin manualmente no Supabase Auth
- [ ] Atualizar role para 'admin' na tabela `users_profile`
- [ ] Criar usuário partner_manager de teste
- [ ] Criar usuário asset_governance de teste
- [ ] Testar diferentes níveis de acesso

### 🏢 **5. Dados de Teste**
- [ ] Inserir empresa de exemplo na tabela `companies`
- [ ] Inserir ativos de exemplo na tabela `assets`
- [ ] Vincular usuários aos ativos na tabela `user_assets`
- [ ] Testar visualização de ativos por role

### 📱 **6. Aplicação Frontend**
- [ ] Instalar dependências: `npm install`
- [ ] Executar aplicação: `npm run dev`
- [ ] Testar navegação entre rotas
- [ ] Testar login/logout
- [ ] Testar upload de relatórios (admin)
- [ ] Testar visualização de relatórios
- [ ] Testar download de arquivos

### 🧪 **7. Testes de Funcionalidade**

#### **Como Admin:**
- [ ] Conseguir ver todos os ativos
- [ ] Conseguir fazer upload de relatórios
- [ ] Conseguir ver todos os relatórios
- [ ] Conseguir baixar arquivos

#### **Como Partner Manager:**
- [ ] Conseguir ver apenas ativos da sua empresa
- [ ] Conseguir ver relatórios dos ativos da sua empresa
- [ ] NÃO conseguir fazer upload de relatórios
- [ ] Conseguir baixar arquivos dos ativos da sua empresa

#### **Como Asset Governance:**
- [ ] Conseguir ver apenas ativos vinculados
- [ ] Conseguir ver relatórios dos ativos vinculados
- [ ] NÃO conseguir fazer upload de relatórios
- [ ] Conseguir baixar arquivos dos ativos vinculados

### 🚨 **8. Verificação de Erros**
- [ ] Verificar console do navegador (sem erros)
- [ ] Verificar logs do Supabase (sem erros críticos)
- [ ] Testar cenários de erro (arquivo inválido, sem permissão)
- [ ] Verificar tratamento de erros na interface

### 📋 **9. Documentação**
- [ ] Ler `SUPABASE_SETUP.md`
- [ ] Ler `STORAGE_SETUP.md`
- [ ] Ler `README.md`
- [ ] Entender estrutura RBAC

## 🔧 **COMANDOS ÚTEIS**

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🆘 **TROUBLESHOOTING**

### **Erro 403 (Forbidden)**
- Verificar se usuário tem permissão adequada
- Verificar políticas RLS
- Verificar se usuário está autenticado

### **Erro 404 (Not Found)**
- Verificar se tabela/bucket existe
- Verificar se arquivo existe no storage
- Verificar se rota está correta

### **Erro de Upload**
- Verificar tamanho do arquivo (máx 50MB)
- Verificar tipo do arquivo (PPT/PPTX)
- Verificar se usuário é admin
- Verificar políticas de storage

### **Erro de Autenticação**
- Verificar credenciais no `.env`
- Verificar se usuário existe no Supabase Auth
- Verificar se perfil foi criado na tabela `users_profile`

## ✅ **APLICAÇÃO PRONTA QUANDO:**
- [ ] Todos os itens do checklist estão marcados
- [ ] Não há erros no console
- [ ] Upload/download de arquivos funciona
- [ ] Diferentes roles têm acesso adequado
- [ ] Interface responde corretamente
