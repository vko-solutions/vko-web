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
  let uploadedPath: string | null = null
  
  try {
    // Validar parâmetros
    if (!file || !assetId || !title || !weekStart || !userId) {
      throw new Error('Todos os parâmetros são obrigatórios')
    }

    // Validação dupla: MIME type E extensão do arquivo
    const allowedTypes = [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
    const allowedExtensions = ['.ppt', '.pptx']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo inválido. Apenas arquivos PPT/PPTX são permitidos')
    }
    
    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error('Extensão de arquivo inválida. Apenas arquivos .ppt ou .pptx são permitidos')
    }

    // Validar tamanho do arquivo (50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. Máximo permitido: 50MB')
    }
    
    if (file.size === 0) {
      throw new Error('Arquivo vazio não é permitido')
    }

    // Validar UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(assetId)) {
      throw new Error('ID do ativo inválido')
    }
    if (!uuidRegex.test(userId)) {
      throw new Error('ID do usuário inválido')
    }

    const path = `${assetId}/${weekStart}/${file.name}`
    uploadedPath = path // Marcar path para rollback se necessário
    
    // Upload do arquivo com timeout
    const uploadPromise = supabase.storage.from('reports').upload(path, file, { 
      upsert: true,
      cacheControl: '3600',
      contentType: file.type
    })
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout: Upload demorou mais que 60 segundos')), 60000)
    })
    
    const { error: upErr } = await Promise.race([uploadPromise, timeoutPromise]) as any
    
    if (upErr) {
      console.error('Erro no upload:', upErr)
      let message = `Erro ao fazer upload: ${upErr.message}`
      if (upErr.message?.includes('size')) {
        message = 'Arquivo muito grande ou inválido. Verifique o tamanho e tente novamente.'
      } else if (upErr.message?.includes('permission') || upErr.statusCode === 403) {
        message = 'Você não tem permissão para fazer upload de arquivos. Contate o administrador.'
      }
      throw new Error(message)
    }

    // Inserir metadados na tabela
    const { error: insErr, data: insertedData } = await supabase
      .from('reports')
      .insert({
        asset_id: assetId, 
        title: title.trim(), 
        file_path: path, 
        week_start: weekStart, 
        uploaded_by: userId
      })
      .select('id')
      .single()
    
    if (insErr) {
      console.error('Erro ao inserir metadados:', insErr)
      
      // Rollback: tentar remover o arquivo (múltiplas tentativas)
      let rollbackSuccess = false
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const { error: removeErr } = await supabase.storage.from('reports').remove([path])
          if (!removeErr) {
            rollbackSuccess = true
            console.log(`Rollback: Arquivo removido com sucesso (tentativa ${attempt + 1})`)
            break
          }
        } catch (rollbackErr) {
          console.error(`Rollback: Erro na tentativa ${attempt + 1}:`, rollbackErr)
        }
      }
      
      if (!rollbackSuccess) {
        console.error('ATENÇÃO: Falha ao fazer rollback do arquivo. Arquivo pode ter ficado órfão:', path)
      }
      
      // Mensagem mais descritiva
      let message = `Erro ao salvar informações do relatório: ${insErr.message}`
      if (insErr.code === '23505') {
        message = 'Já existe um relatório com estes dados. Tente novamente com informações diferentes.'
      } else if (insErr.code === '23503') {
        message = 'Ativo ou usuário não encontrado no sistema.'
      } else if (insErr.code === '42501') {
        message = 'Você não tem permissão para criar relatórios.'
      }
      
      throw new Error(message)
    }

    return { path, reportId: insertedData?.id }
  } catch (error: any) {
    console.error('Erro no serviço uploadReportPPT:', error)
    
    // Última tentativa de rollback se ainda não foi feito
    if (uploadedPath && error.message && !error.message.includes('Rollback')) {
      try {
        await supabase.storage.from('reports').remove([uploadedPath])
        console.log('Rollback: Arquivo removido em tratamento de erro final')
      } catch (finalRollbackErr) {
        console.error('Rollback final falhou:', finalRollbackErr)
      }
    }
    
    // Re-throw com mensagem melhorada
    if (error.message) {
      throw error
    }
    throw new Error(`Falha ao fazer upload do relatório: ${error.message || 'Erro desconhecido'}`)
  }
}

export async function getSignedUrl(path: string) {
  try {
    if (!path) {
      throw new Error('Caminho do arquivo é obrigatório')
    }

    // Tentar criar URL assinada
    const { data, error } = await supabase.storage.from('reports').createSignedUrl(path, 3600)
    
    if (error) {
      console.error('Erro ao gerar URL assinada:', error)
      
      // Mensagens mais descritivas baseadas no erro
      if (error.message?.includes('404') || error.message?.includes('not found') || error.statusCode === 404) {
        throw new Error('Arquivo não encontrado no storage. O arquivo pode ter sido removido.')
      } else if (error.message?.includes('403') || error.message?.includes('permission') || error.statusCode === 403) {
        throw new Error('Sem permissão para acessar este arquivo. Verifique se você tem permissão para este ativo no Storage.')
      } else if (error.message?.includes('401') || error.statusCode === 401) {
        throw new Error('Sessão expirada. Faça login novamente.')
      }
      
      throw new Error(`Erro ao gerar link de download: ${error.message || 'Erro desconhecido'}`)
    }

    if (!data?.signedUrl) {
      throw new Error('URL assinada não foi gerada pelo servidor')
    }

    return data.signedUrl
  } catch (error: any) {
    console.error('Erro no serviço getSignedUrl:', error)
    throw error
  }
}
