export interface Chamado {
  id: string;
  cliente_nome: string;
  endereco: string;
  descricao: string;
  status: 'aberto' | 'em_andamento' | 'concluido';
  criado_em: string;
  atualizado_em: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  tipo: 'admin' | 'visualizador';
}

export const STATUS_LABELS = {
  aberto: 'Aberto',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído'
} as const;

export const STATUS_COLORS = {
  aberto: 'info',
  em_andamento: 'warning',
  concluido: 'success'
} as const;