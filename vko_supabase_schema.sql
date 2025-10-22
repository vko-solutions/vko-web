-- =====================================================
-- VKO Solution - Supabase Schema & RLS Policies
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CRIAÇÃO DAS TABELAS
-- =====================================================

-- Tabela de empresas parceiras
CREATE TABLE public.companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Tabela de perfil de usuários
CREATE TABLE public.users_profile (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name text,
    email text UNIQUE,
    role text CHECK (role IN ('admin','partner_manager','asset_governance','viewer')) DEFAULT 'viewer',
    company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now()
);

-- Tabela de ativos
CREATE TABLE public.assets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    address text,
    company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
    status text CHECK (status IN ('active','inactive')) DEFAULT 'active',
    created_at timestamptz DEFAULT now()
);

-- Tabela de vínculos usuário-ativo
CREATE TABLE public.user_assets (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    asset_id uuid REFERENCES public.assets(id) ON DELETE CASCADE,
    role text CHECK (role IN ('owner','editor','viewer')) DEFAULT 'viewer',
    PRIMARY KEY (user_id, asset_id)
);

-- =====================================================
-- 2. ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX idx_users_profile_company_id ON public.users_profile(company_id);
CREATE INDEX idx_users_profile_role ON public.users_profile(role);
CREATE INDEX idx_assets_company_id ON public.assets(company_id);
CREATE INDEX idx_assets_status ON public.assets(status);
CREATE INDEX idx_user_assets_user_id ON public.user_assets(user_id);
CREATE INDEX idx_user_assets_asset_id ON public.user_assets(asset_id);

-- =====================================================
-- 3. ATIVAÇÃO DO RLS (Row Level Security)
-- =====================================================

ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. POLÍTICAS RLS
-- =====================================================

-- =====================================================
-- POLÍTICAS PARA users_profile
-- =====================================================

-- Cada usuário vê apenas seu próprio perfil
CREATE POLICY "users_profile_select_own" ON public.users_profile
    FOR SELECT USING (id = auth.uid());

-- Admin vê todos os perfis
CREATE POLICY "users_profile_select_admin" ON public.users_profile
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users_profile 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Usuários podem inserir seu próprio perfil
CREATE POLICY "users_profile_insert_own" ON public.users_profile
    FOR INSERT WITH CHECK (id = auth.uid());

-- Usuários podem atualizar seu próprio perfil (exceto role)
CREATE POLICY "users_profile_update_own" ON public.users_profile
    FOR UPDATE USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Admin pode atualizar qualquer perfil
CREATE POLICY "users_profile_update_admin" ON public.users_profile
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users_profile 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- POLÍTICAS PARA user_assets
-- =====================================================

-- Cada usuário vê apenas seus próprios vínculos
CREATE POLICY "user_assets_select_own" ON public.user_assets
    FOR SELECT USING (user_id = auth.uid());

-- Admin vê todos os vínculos
CREATE POLICY "user_assets_select_admin" ON public.user_assets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users_profile 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Usuários podem inserir vínculos para si mesmos
CREATE POLICY "user_assets_insert_own" ON public.user_assets
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admin pode inserir qualquer vínculo
CREATE POLICY "user_assets_insert_admin" ON public.user_assets
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users_profile 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Usuários podem atualizar seus próprios vínculos
CREATE POLICY "user_assets_update_own" ON public.user_assets
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Admin pode atualizar qualquer vínculo
CREATE POLICY "user_assets_update_admin" ON public.user_assets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users_profile 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- POLÍTICAS PARA assets
-- =====================================================

-- Admin vê todos os ativos
CREATE POLICY "assets_select_admin" ON public.assets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users_profile 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Partner Manager vê ativos da sua empresa
CREATE POLICY "assets_select_partner_manager" ON public.assets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users_profile up
            WHERE up.id = auth.uid() 
            AND up.role = 'partner_manager'
            AND up.company_id = assets.company_id
        )
    );

-- Asset Governance e Viewer vêem apenas ativos vinculados
CREATE POLICY "assets_select_linked" ON public.assets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_assets ua
            WHERE ua.asset_id = assets.id 
            AND ua.user_id = auth.uid()
        )
    );

-- =====================================================
-- POLÍTICAS PARA companies
-- =====================================================

-- Admin vê todas as empresas
CREATE POLICY "companies_select_admin" ON public.companies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users_profile 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Partner Manager vê apenas sua empresa
CREATE POLICY "companies_select_partner_manager" ON public.companies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users_profile 
            WHERE id = auth.uid() 
            AND role = 'partner_manager'
            AND company_id = companies.id
        )
    );

-- Outros usuários não veem empresas diretamente
-- (acesso apenas via assets)

-- =====================================================
-- 5. VIEWS AUXILIARES
-- =====================================================

-- View para ativos visíveis pelo usuário logado
CREATE VIEW public.v_my_assets AS
SELECT DISTINCT a.*
FROM public.assets a
WHERE 
    -- Admin vê todos
    EXISTS (
        SELECT 1 FROM public.users_profile 
        WHERE id = auth.uid() AND role = 'admin'
    )
    OR
    -- Partner Manager vê ativos da sua empresa
    EXISTS (
        SELECT 1 FROM public.users_profile up
        WHERE up.id = auth.uid() 
        AND up.role = 'partner_manager'
        AND up.company_id = a.company_id
    )
    OR
    -- Usuário vinculado ao ativo
    EXISTS (
        SELECT 1 FROM public.user_assets ua
        WHERE ua.asset_id = a.id 
        AND ua.user_id = auth.uid()
    );

-- View para informações do usuário atual com empresa
CREATE VIEW public.v_current_user AS
SELECT 
    up.*,
    c.name as company_name
FROM public.users_profile up
LEFT JOIN public.companies c ON c.id = up.company_id
WHERE up.id = auth.uid();

-- =====================================================
-- 6. FUNÇÕES AUXILIARES
-- =====================================================

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.users_profile 
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

-- Função para obter role do usuário atual
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT role FROM public.users_profile WHERE id = auth.uid();
$$;

-- =====================================================
-- 7. SEEDS DE EXEMPLO
-- =====================================================

-- Inserir empresa de exemplo
INSERT INTO public.companies (id, name) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Construtora ABC Ltda');

-- Inserir ativos de exemplo
INSERT INTO public.assets (id, name, address, company_id) VALUES 
('550e8400-e29b-41d4-a716-446655440002', 'Residencial Jardim das Flores', 'Rua das Flores, 123 - São Paulo/SP', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440003', 'Condomínio Vista Mar', 'Av. Beira Mar, 456 - Santos/SP', '550e8400-e29b-41d4-a716-446655440001');

-- =====================================================
-- 8. COMENTÁRIOS PARA EXPANSÃO FUTURA
-- =====================================================

/*
EXPANSÕES FUTURAS:

1. POLÍTICAS DE INSERT/UPDATE/DELETE:
   - Adicionar políticas para operações de escrita quando necessário
   - Implementar validações de negócio nas políticas
   - Adicionar auditoria de mudanças

2. FUNCIONALIDADES AVANÇADAS:
   - Sistema de permissões granulares por módulo
   - Workflow de aprovação para mudanças críticas
   - Integração com sistemas externos

3. PERFORMANCE:
   - Índices compostos para consultas complexas
   - Materialized views para relatórios
   - Particionamento de tabelas grandes

4. SEGURANÇA:
   - Políticas baseadas em tempo (horário comercial)
   - Logs de acesso detalhados
   - Integração com sistemas de SSO

5. AUDITORIA:
   - Tabelas de histórico de mudanças
   - Triggers para rastreamento
   - Relatórios de compliance
*/

-- =====================================================
-- 9. GRANTS PARA APLICAÇÃO
-- =====================================================

-- Conceder permissões básicas para authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.v_my_assets TO authenticated;
GRANT SELECT ON public.v_current_user TO authenticated;
GRANT SELECT ON public.users_profile TO authenticated;
GRANT SELECT ON public.assets TO authenticated;
GRANT SELECT ON public.user_assets TO authenticated;
GRANT SELECT ON public.companies TO authenticated;

-- Permissões de escrita (ajustar conforme necessário)
GRANT INSERT, UPDATE ON public.users_profile TO authenticated;
GRANT INSERT, UPDATE ON public.user_assets TO authenticated;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
