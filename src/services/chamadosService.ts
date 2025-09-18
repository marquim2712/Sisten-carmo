import { Chamado } from '../types';
import { supabase } from '@/integrations/supabase/client';

class ChamadosService {
  async getChamados(): Promise<Chamado[]> {
    const { data, error } = await supabase
      .from('chamados')
      .select('*')
      .order('criado_em', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar chamados:', error);
      return [];
    }
    
    return data || [];
  }

  async getChamadoById(id: string): Promise<Chamado | null> {
    const { data, error } = await supabase
      .from('chamados')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar chamado:', error);
      return null;
    }
    
    return data;
  }

  async createChamado(chamadoData: Omit<Chamado, 'id' | 'criado_em' | 'atualizado_em'>): Promise<Chamado | null> {
    const { data, error } = await supabase
      .from('chamados')
      .insert({
        cliente_nome: chamadoData.cliente_nome,
        endereco: chamadoData.endereco,
        descricao: chamadoData.descricao,
        status: chamadoData.status || 'aberto'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar chamado:', error);
      return null;
    }
    
    return data;
  }

  async updateChamado(id: string, updates: Partial<Omit<Chamado, 'id' | 'criado_em'>>): Promise<Chamado | null> {
    const { data, error } = await supabase
      .from('chamados')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar chamado:', error);
      return null;
    }
    
    return data;
  }

  async deleteChamado(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('chamados')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar chamado:', error);
      return false;
    }
    
    return true;
  }

  async updateStatus(id: string, status: Chamado['status']): Promise<Chamado | null> {
    return this.updateChamado(id, { status });
  }
}

export const chamadosService = new ChamadosService();