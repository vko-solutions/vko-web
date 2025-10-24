# VKO Solution - Configuração do Supabase Storage

## 📁 Configuração do Bucket de Storage

### 1. Criar o Bucket "reports"

1. **Acesse o Dashboard do Supabase**: https://supabase.com/dashboard
2. **Selecione seu projeto**
3. **Vá em Storage** (no menu lateral)
4. **Clique em "New bucket"**
5. **Configure o bucket:**
   - **Name**: `reports`
   - **Public**: `false` (privado)
   - **File size limit**: `50MB` (ou conforme necessário)
   - **Allowed MIME types**: `application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation`

### 2. Configurar Políticas de Storage

Execute este SQL no **SQL Editor** do Supabase:

```sql
-- =====================================================
-- POLÍTICAS DE STORAGE PARA BUCKET REPORTS
-- =====================================================

-- Política para upload (apenas admin)
CREATE POLICY "reports_upload_policy" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'reports' AND
    EXISTS (
        SELECT 1 FROM public.users_profile 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Política para download (baseada em RLS)
CREATE POLICY "reports_download_policy" ON storage.objects
FOR SELECT USING (
    bucket_id = 'reports' AND
    (
        -- Admin pode baixar todos
        EXISTS (
            SELECT 1 FROM public.users_profile 
            WHERE id = auth.uid() AND role = 'admin'
        )
        OR
        -- Partner Manager pode baixar relatórios dos ativos da sua empresa
        EXISTS (
            SELECT 1 FROM public.users_profile up
            JOIN public.assets a ON a.company_id = up.company_id
            JOIN public.reports r ON r.asset_id = a.id
            WHERE up.id = auth.uid() 
            AND up.role = 'partner_manager' 
            AND r.file_path = storage.objects.name
        )
        OR
        -- Asset Governance pode baixar relatórios dos ativos vinculados
        EXISTS (
            SELECT 1 FROM public.user_assets ua
            JOIN public.reports r ON r.asset_id = ua.asset_id
            WHERE ua.user_id = auth.uid() 
            AND r.file_path = storage.objects.name
        )
    )
);

-- Política para update (apenas admin)
CREATE POLICY "reports_update_policy" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'reports' AND
    EXISTS (
        SELECT 1 FROM public.users_profile 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Política para delete (apenas admin)
CREATE POLICY "reports_delete_policy" ON storage.objects
FOR DELETE USING (
    bucket_id = 'reports' AND
    EXISTS (
        SELECT 1 FROM public.users_profile 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
```

### 3. Verificar Configuração

Após executar o SQL acima, verifique se:

1. ✅ **Bucket `reports` existe** em Storage
2. ✅ **Políticas estão ativas** (aparecem na aba Policies do bucket)
3. ✅ **RLS está habilitado** no bucket
4. ✅ **Tabela `reports` existe** no banco de dados
5. ✅ **Políticas RLS da tabela** estão ativas

### 4. Teste de Funcionamento

Para testar se está funcionando:

1. **Faça login como admin**
2. **Tente fazer upload** de um arquivo PPT
3. **Verifique se o arquivo** aparece no bucket
4. **Teste o download** do arquivo
5. **Verifique se usuários não-admin** não conseguem fazer upload

### 5. Estrutura de Arquivos no Storage

Os arquivos serão organizados assim:
```
reports/
├── {asset_id}/
│   ├── {week_start}/
│   │   └── arquivo.ppt
│   └── {week_start}/
│       └── arquivo.pptx
└── {asset_id}/
    └── {week_start}/
        └── arquivo.ppt
```

### 6. Troubleshooting

**Problema**: Erro 403 ao fazer upload
- ✅ Verifique se o usuário é admin
- ✅ Verifique se as políticas de storage estão corretas
- ✅ Verifique se o RLS está habilitado no bucket

**Problema**: Erro 404 ao fazer download
- ✅ Verifique se o arquivo existe no bucket
- ✅ Verifique se o usuário tem permissão para ver o ativo
- ✅ Verifique se as políticas de download estão corretas

**Problema**: Erro ao inserir na tabela reports
- ✅ Verifique se a tabela reports existe
- ✅ Verifique se as políticas RLS da tabela estão corretas
- ✅ Verifique se o usuário é admin
