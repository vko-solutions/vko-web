import { supabase } from '@/lib/supabase'

export async function listReportsByAsset(assetId: string) {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('asset_id', assetId)
      .order('week_start', { ascending: false })

    if (error) {
      console.error('Erro ao listar relatórios:', error)
      throw new Error(`Erro ao carregar relatórios: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Erro no serviço listReportsByAsset:', error)
    throw error
  }
}

export async function uploadReportPPT(file: File, assetId: string, title: string, weekStart: string, userId: string) {
  try {
    // Validar parâmetros
    if (!file || !assetId || !title || !weekStart || !userId) {
      throw new Error('Todos os parâmetros são obrigatórios')
    }

    // Validar tipo de arquivo
    const allowedTypes = [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Apenas arquivos PPT/PPTX são permitidos')
    }

    // Validar tamanho do arquivo (50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. Máximo 50MB')
    }

    const path = `${assetId}/${weekStart}/${file.name}`
    
    // Upload do arquivo
    const { error: upErr } = await supabase.storage.from('reports').upload(path, file, { upsert: true })
    if (upErr) {
      console.error('Erro no upload:', upErr)
      throw new Error(`Erro ao fazer upload: ${upErr.message}`)
    }

    // Inserir metadados na tabela
    const { error: insErr } = await supabase.from('reports').insert({
      asset_id: assetId, 
      title, 
      file_path: path, 
      week_start: weekStart, 
      uploaded_by: userId
    })
    
    if (insErr) {
      console.error('Erro ao inserir metadados:', insErr)
      // Tentar remover o arquivo se falhou ao inserir metadados
      await supabase.storage.from('reports').remove([path])
      throw new Error(`Erro ao salvar metadados: ${insErr.message}`)
    }

    return { path }
  } catch (error) {
    console.error('Erro no serviço uploadReportPPT:', error)
    throw error
  }
}

export async function getSignedUrl(path: string) {
  try {
    if (!path) {
      throw new Error('Caminho do arquivo é obrigatório')
    }

    const { data, error } = await supabase.storage.from('reports').createSignedUrl(path, 3600)
    
    if (error) {
      console.error('Erro ao gerar URL assinada:', error)
      throw new Error(`Erro ao gerar link de download: ${error.message}`)
    }

    if (!data?.signedUrl) {
      throw new Error('URL assinada não foi gerada')
    }

    return data.signedUrl
  } catch (error) {
    console.error('Erro no serviço getSignedUrl:', error)
    throw error
  }
}
