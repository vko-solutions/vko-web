-- =====================================================
-- VKO Solution - Funções RPC para Administração
-- =====================================================
-- Execute este SQL no Supabase SQL Editor APÓS executar os schemas anteriores

-- =====================================================
-- 1. FUNÇÃO PARA ALTERAR ROLE DO USUÁRIO
-- =====================================================

CREATE OR REPLACE FUNCTION admin_set_role(
  p_user_id uuid,
  p_role text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users_profile 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Apenas administradores podem alterar roles';
  END IF;
  
  -- Verificar se o role é válido
  IF p_role NOT IN ('admin', 'partner_manager', 'asset_governance') THEN
    RAISE EXCEPTION 'Role inválido: %', p_role;
  END IF;
  
  -- Atualizar o role
  UPDATE public.users_profile 
  SET role = p_role::text
  WHERE id = p_user_id;
  
  -- Verificar se a atualização foi bem-sucedida
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuário não encontrado: %', p_user_id;
  END IF;
END;
$$;

-- =====================================================
-- 2. FUNÇÃO PARA VINCULAR USUÁRIO A EMPRESA
-- =====================================================

CREATE OR REPLACE FUNCTION admin_set_user_company(
  p_user_id uuid,
  p_company_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users_profile 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Apenas administradores podem vincular empresas';
  END IF;
  
  -- Verificar se a empresa existe (se não for null)
  IF p_company_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.companies WHERE id = p_company_id
  ) THEN
    RAISE EXCEPTION 'Empresa não encontrada: %', p_company_id;
  END IF;
  
  -- Atualizar a empresa do usuário
  UPDATE public.users_profile 
  SET company_id = p_company_id
  WHERE id = p_user_id;
  
  -- Verificar se a atualização foi bem-sucedida
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuário não encontrado: %', p_user_id;
  END IF;
END;
$$;

-- =====================================================
-- 3. FUNÇÃO PARA ADICIONAR ATIVO AO USUÁRIO
-- =====================================================

CREATE OR REPLACE FUNCTION admin_add_user_asset(
  p_user_id uuid,
  p_asset_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users_profile 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Apenas administradores podem vincular ativos';
  END IF;
  
  -- Verificar se o usuário existe
  IF NOT EXISTS (
    SELECT 1 FROM public.users_profile WHERE id = p_user_id
  ) THEN
    RAISE EXCEPTION 'Usuário não encontrado: %', p_user_id;
  END IF;
  
  -- Verificar se o ativo existe
  IF NOT EXISTS (
    SELECT 1 FROM public.assets WHERE id = p_asset_id
  ) THEN
    RAISE EXCEPTION 'Ativo não encontrado: %', p_asset_id;
  END IF;
  
  -- Inserir a vinculação (ignorar se já existir)
  INSERT INTO public.user_assets (user_id, asset_id)
  VALUES (p_user_id, p_asset_id)
  ON CONFLICT (user_id, asset_id) DO NOTHING;
END;
$$;

-- =====================================================
-- 4. FUNÇÃO PARA REMOVER ATIVO DO USUÁRIO
-- =====================================================

CREATE OR REPLACE FUNCTION admin_remove_user_asset(
  p_user_id uuid,
  p_asset_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users_profile 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Apenas administradores podem desvincular ativos';
  END IF;
  
  -- Remover a vinculação
  DELETE FROM public.user_assets 
  WHERE user_id = p_user_id AND asset_id = p_asset_id;
  
  -- Verificar se a remoção foi bem-sucedida
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Vinculação não encontrada para usuário % e ativo %', p_user_id, p_asset_id;
  END IF;
END;
$$;

-- =====================================================
-- 5. GRANTS PARA AS FUNÇÕES RPC
-- =====================================================

GRANT EXECUTE ON FUNCTION admin_set_role(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_set_user_company(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_add_user_asset(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_remove_user_asset(uuid, uuid) TO authenticated;

-- =====================================================
-- 6. POLÍTICAS RLS PARA ADMINISTRAÇÃO
-- =====================================================

-- Permitir que admins vejam todos os perfis
CREATE POLICY "admin_view_all_profiles" ON public.users_profile
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users_profile 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Permitir que admins vejam todas as empresas
CREATE POLICY "admin_view_all_companies" ON public.companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users_profile 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Permitir que admins vejam todos os ativos
CREATE POLICY "admin_view_all_assets" ON public.assets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users_profile 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Permitir que admins vejam todas as vinculações de usuários e ativos
CREATE POLICY "admin_view_all_user_assets" ON public.user_assets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users_profile 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
