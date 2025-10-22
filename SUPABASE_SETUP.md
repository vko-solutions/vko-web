# VKO Solution - Configuração do Supabase

## 📋 Configuração das Variáveis de Ambiente

### 1. Criar arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Obter as Credenciais do Supabase

1. **Acesse o Dashboard do Supabase**: https://supabase.com/dashboard
2. **Selecione seu projeto**
3. **Vá em Settings > API**
4. **Copie os valores:**
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

### 3. Exemplo de Configuração

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.example-signature
```

## 🔧 Instalação das Dependências

```bash
npm install @supabase/supabase-js
```

## 📁 Estrutura de Arquivos

```
src/
├── lib/
│   └── supabase.ts          # Configuração do Supabase
├── components/
│   └── Landing.vue          # Componente principal
└── ...
```

## 🚀 Como Usar

### Importar o cliente Supabase

```typescript
import { supabase, authService, dataService } from '@/lib/supabase'
```

### Exemplos de Uso

```typescript
// Login
await authService.signIn('user@example.com', 'password')

// Obter ativos do usuário
const assets = await dataService.getAssets()

// Verificar se é admin
const isAdmin = await isAdmin()

// Obter perfil do usuário
const profile = await getCurrentUserProfile()
```

## 🔒 Segurança

- ✅ **Nunca commite** o arquivo `.env` com valores reais
- ✅ **Adicione** `.env` ao `.gitignore`
- ✅ **Use variáveis diferentes** para produção
- ✅ **A chave anônima** é segura para uso no frontend

## 📊 Banco de Dados

Execute o arquivo `vko_supabase_schema.sql` no SQL Editor do Supabase para criar:

- ✅ Tabelas com RLS ativado
- ✅ Políticas de segurança
- ✅ Views auxiliares
- ✅ Seeds de exemplo

## 🎯 Roles e Permissões

- **admin**: Acesso total
- **partner_manager**: Vê ativos da sua empresa
- **asset_governance**: Vê apenas ativos vinculados
- **viewer**: Vê apenas ativos vinculados

## 🐛 Debug

Para ativar o modo debug, adicione ao `.env`:

```env
VITE_DEBUG_MODE=true
```

## 📞 Suporte

Em caso de dúvidas, consulte:
- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)

