import { supabase } from '@/lib/supabase'

export async function listAssetsVisible() {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('name')

    if (error) {
      console.error('Erro ao listar ativos:', error)
      throw new Error(`Erro ao carregar ativos: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Erro no serviço listAssetsVisible:', error)
    throw error
  }
}

