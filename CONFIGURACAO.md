# =====================================================
# VKO Solution - Configuração de Ambiente
# =====================================================

## 🔧 Configuração Necessária

### 1. Criar arquivo .env
Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Obter credenciais do Supabase
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em Settings > API
4. Copie a URL e a chave anônima

### 3. Executar SQL no Supabase
Cole o conteúdo de `vko_supabase_schema.sql` no SQL Editor do Supabase.

### 4. Instalar dependências
```bash
npm install
```

### 5. Executar aplicação
```bash
npm run dev
```

## 🚨 Problemas Comuns

### Erro de importação de componentes
- Verifique se o alias `@` está configurado corretamente
- Execute `npm run build` para verificar erros de TypeScript

### Erro de conexão com Supabase
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o SQL foi executado no Supabase

### Erro de permissões
- Verifique se as políticas RLS estão ativas
- Confirme se o usuário tem o perfil criado em `users_profile`

## 📞 Suporte
Em caso de problemas, verifique:
1. Console do navegador para erros JavaScript
2. Console do terminal para erros de build
3. Logs do Supabase para erros de API


