export type CargoVendedor = 'vendedor' | 'gerente' | 'caixa';

export interface Vendedor {
  id: string;
  auth_user_id?: string | null;
  nome: string;
  email: string;
  telefone?: string | null;
  cargo: CargoVendedor;
  ativo: boolean;
  created_at?: string;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao?: string | null;
}

export interface Produto {
  id: string;
  categoria_id?: string | null;
  categoria_nome?: string;
  nome: string;
  codigo_sku: string;
  descricao?: string | null;
  marca?: string | null;
  genero?: string | null;
  tecido_composicao?: string | null;
  preco_custo?: number;
  preco_venda: number;
  foto_url?: string | null;
  ativo: boolean;
}

export interface EstoqueVariacao {
  id: string;
  produto_id: string;
  produto_nome?: string;
  tamanho: string;
  cor: string;
  codigo_barras?: string | null;
  quantidade_estoque: number;
  estoque_minimo: number;
}

export interface Cliente {
  id: string;
  vendedor_id?: string | null;
  nome: string;
  cpf?: string | null;
  email?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  data_nascimento?: string | null;
  genero?: string | null;
  tamanho_superior?: string | null;
  tamanho_inferior?: string | null;
  tamanho_calcado?: string | null;
  estilo_preferencia?: string | null;
  cidade?: string | null;
  estado?: string | null;
}

export interface Venda {
  id: string;
  vendedor_id: string;
  vendedor_nome?: string;
  cliente_id?: string | null;
  cliente_nome?: string | null;
  data_venda: string;
  valor_subtotal: number;
  desconto: number;
  valor_total: number;
  forma_pagamento: string;
  quantidade_parcelas: number;
  status: string;
  observacoes?: string | null;
}
