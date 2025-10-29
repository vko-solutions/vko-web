-- =====================================================
-- VKO Solution - Funções RPC para ACL (Access Control List)
-- =====================================================
-- Execute este SQL no Supabase SQL Editor

-- =====================================================
-- 1. FUNÇÃO PARA LIBERAR/BLOQUEAR ACESSO A REPORTS
-- =====================================================

CREATE OR REPLACE FUNCTION set_report_access(
  p_report_id uuid,
  p_subject_type text,
  p_subject_id text,
  p_can_read boolean DEFAULT false,
  p_can_write boolean DEFAULT false
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
    RAISE EXCEPTION 'Apenas administradores podem gerenciar acesso';
  END IF;
  
  -- Verificar se o report existe
  IF NOT EXISTS (SELECT 1 FROM public.reports WHERE id = p_report_id) THEN
    RAISE EXCEPTION 'Report não encontrado: %', p_report_id;
  END IF;
  
  -- Verificar subject_type válido
  IF p_subject_type NOT IN ('user', 'role', 'company') THEN
    RAISE EXCEPTION 'Subject type inválido: %. Use: user, role, company', p_subject_type;
  END IF;
  
  -- Inserir ou atualizar ACL
  INSERT INTO public.report_acl (
    report_id, 
    subject_type, 
    subject_id, 
    can_read, 
    can_write
  )
  VALUES (
    p_report_id, 
    p_subject_type, 
    p_subject_id, 
    p_can_read, 
    p_can_write
  )
  ON CONFLICT (report_id, subject_type, subject_id) 
  DO UPDATE SET 
    can_read = EXCLUDED.can_read,
    can_write = EXCLUDED.can_write,
    created_at = now();
    
  RAISE NOTICE 'Acesso ao report % liberado para % %', p_report_id, p_subject_type, p_subject_id;
END;
$$;

-- =====================================================
-- 2. FUNÇÃO PARA LIBERAR/BLOQUEAR ACESSO A ASSETS
-- =====================================================

CREATE OR REPLACE FUNCTION set_asset_access(
  p_asset_id uuid,
  p_subject_type text,
  p_subject_id text,
  p_can_read boolean DEFAULT false,
  p_can_write boolean DEFAULT false
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
    RAISE EXCEPTION 'Apenas administradores podem gerenciar acesso';
  END IF;
  
  -- Verificar se o asset existe
  IF NOT EXISTS (SELECT 1 FROM public.assets WHERE id = p_asset_id) THEN
    RAISE EXCEPTION 'Asset não encontrado: %', p_asset_id;
  END IF;
  
  -- Verificar subject_type válido
  IF p_subject_type NOT IN ('user', 'role', 'company') THEN
    RAISE EXCEPTION 'Subject type inválido: %. Use: user, role, company', p_subject_type;
  END IF;
  
  -- Inserir ou atualizar ACL
  INSERT INTO public.asset_acl (
    asset_id, 
    subject_type, 
    subject_id, 
    can_read, 
    can_write
  )
  VALUES (
    p_asset_id, 
    p_subject_type, 
    p_subject_id, 
    p_can_read, 
    p_can_write
  )
  ON CONFLICT (asset_id, subject_type, subject_id) 
  DO UPDATE SET 
    can_read = EXCLUDED.can_read,
    can_write = EXCLUDED.can_write,
    created_at = now();
    
  RAISE NOTICE 'Acesso ao asset % liberado para % %', p_asset_id, p_subject_type, p_subject_id;
END;
$$;

-- =====================================================
-- 3. FUNÇÃO PARA REMOVER ACESSO A REPORTS
-- =====================================================

CREATE OR REPLACE FUNCTION remove_report_access(
  p_report_id uuid,
  p_subject_type text,
  p_subject_id text
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
    RAISE EXCEPTION 'Apenas administradores podem remover acesso';
  END IF;
  
  -- Remover ACL
  DELETE FROM public.report_acl 
  WHERE report_id = p_report_id 
    AND subject_type = p_subject_type
    AND subject_id = p_subject_id;
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'ACL não encontrada para o report % e subject %/%', p_report_id, p_subject_type, p_subject_id;
  END IF;
  
  RAISE NOTICE 'Acesso removido do report % para % %', p_report_id, p_subject_type, p_subject_id;
END;
$$;

-- =====================================================
-- 4. FUNÇÃO PARA REMOVER ACESSO A ASSETS
-- =====================================================

CREATE OR REPLACE FUNCTION remove_asset_access(
  p_asset_id uuid,
  p_subject_type text,
  p_subject_id text
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
    RAISE EXCEPTION 'Apenas administradores podem remover acesso';
  END IF;
  
  -- Remover ACL
  DELETE FROM public.asset_acl 
  WHERE asset_id = p_asset_id 
    AND subject_type = p_subject_type
    AND subject_id = p_subject_id;
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'ACL não encontrada para o asset % e subject %/%', p_asset_id, p_subject_type, p_subject_id;
  END IF;
  
  RAISE NOTICE 'Acesso removido do asset % para % %', p_asset_id, p_subject_type, p_subject_id;
END;
$$;

-- =====================================================
-- 5. GRANTS PARA AS FUNÇÕES RPC
-- =====================================================

GRANT EXECUTE ON FUNCTION set_report_access(uuid, text, text, boolean, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION set_asset_access(uuid, text, text, boolean, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_report_access(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_asset_access(uuid, text, text) TO authenticated;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================


