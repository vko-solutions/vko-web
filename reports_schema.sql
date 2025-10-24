-- =====================================================
-- VKO Solution - SQL Adicional para Reports
-- =====================================================
-- Execute este SQL no Supabase SQL Editor APÓS executar o vko_supabase_schema.sql

-- =====================================================
-- 1. TABELA REPORTS
-- =====================================================

CREATE TABLE public.reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id uuid NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
    title text NOT NULL,
    file_path text NOT NULL, -- caminho no bucket do Storage
    week_start date NOT NULL,
    uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_reports_asset_id ON public.reports(asset_id);
CREATE INDEX idx_reports_week_start ON public.reports(week_start);
CREATE INDEX idx_reports_uploaded_by ON public.reports(uploaded_by);

-- =====================================================
-- 2. ATIVAR RLS PARA REPORTS
-- =====================================================

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. POLÍTICAS RLS PARA REPORTS
-- =====================================================

-- Admin pode ver todos os relatórios
CREATE POLICY "reports_select_admin" ON public.reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users_profile 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Partner Manager pode ver relatórios dos ativos da sua empresa
CREATE POLICY "reports_select_partner_manager" ON public.reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users_profile up
            JOIN public.assets a ON a.company_id = up.company_id
            WHERE up.id = auth.uid() 
            AND up.role = 'partner_manager' 
            AND a.id = reports.asset_id
        )
    );

-- Asset Governance pode ver relatórios dos ativos vinculados
CREATE POLICY "reports_select_asset_governance" ON public.reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_assets ua
            WHERE ua.user_id = auth.uid() 
            AND ua.asset_id = reports.asset_id
        )
    );

-- Apenas admin pode inserir relatórios
CREATE POLICY "reports_insert_admin" ON public.reports
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users_profile 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Apenas admin pode atualizar relatórios
CREATE POLICY "reports_update_admin" ON public.reports
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users_profile 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Apenas admin pode deletar relatórios
CREATE POLICY "reports_delete_admin" ON public.reports
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users_profile 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- 4. GRANTS PARA REPORTS
-- =====================================================

GRANT SELECT ON public.reports TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.reports TO authenticated;

-- =====================================================
-- 5. VIEW PARA RELATÓRIOS VISÍVEIS
-- =====================================================

CREATE VIEW public.v_my_reports AS
SELECT DISTINCT r.*
FROM public.reports r
WHERE 
    -- Admin vê todos
    EXISTS (
        SELECT 1 FROM public.users_profile 
        WHERE id = auth.uid() AND role = 'admin'
    )
    OR
    -- Partner Manager vê relatórios dos ativos da sua empresa
    EXISTS (
        SELECT 1 FROM public.users_profile up
        JOIN public.assets a ON a.company_id = up.company_id
        WHERE up.id = auth.uid() 
        AND up.role = 'partner_manager' 
        AND a.id = r.asset_id
    )
    OR
    -- Usuário vinculado ao ativo
    EXISTS (
        SELECT 1 FROM public.user_assets ua
        WHERE ua.user_id = auth.uid() 
        AND ua.asset_id = r.asset_id
    );

GRANT SELECT ON public.v_my_reports TO authenticated;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
