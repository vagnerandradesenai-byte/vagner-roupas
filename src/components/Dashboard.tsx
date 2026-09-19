import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { carregarDadosDashboard } from '../lib/neon';
import type { Produto, Categoria, EstoqueVariacao, Venda, Cliente } from '../types';
import { 
  LogOut, 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles,
  Tag,
  CreditCard,
  Shirt,
  RefreshCw
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'stock' | 'clients'>('overview');
  const [loading, setLoading] = useState<boolean>(true);

  // Dados do banco Neon
  const [, setCategorias] = useState<Categoria[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [variacoes, setVariacoes] = useState<EstoqueVariacao[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await carregarDadosDashboard();
      setCategorias(data.categorias);
      setProdutos(data.produtos);
      setVariacoes(data.variacoes);
      setVendas(data.vendas);
      setClientes(data.clientes);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Métricas calculadas
  const totalFaturado = vendas.reduce((acc, v) => acc + Number(v.valor_total || 0), 0);
  const totalVendas = vendas.length;
  const ticketMedio = totalVendas > 0 ? totalFaturado / totalVendas : 0;
  const itensEstoqueBaixo = variacoes.filter(v => v.quantidade_estoque <= v.estoque_minimo);

  return (
    <div className="min-h-screen bg-slate-950/70 backdrop-blur-[2px] text-slate-100 flex flex-col">
      
      {/* Barra de Navegação Superior */}
      <header className="bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo e Nome da Loja */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-auto rounded-xl bg-[#0b1120] border border-cyan-500/30 p-1 flex items-center shadow-lg shadow-cyan-500/10">
              <img 
                src="/logo.png?v=2" 
                alt="Atleta Fashion" 
                className="h-9 w-auto object-contain rounded"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">Atleta Fashion</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                  Vagner Roupas
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Painel Comercial & Gestão de Vendas</p>
            </div>
          </div>

          {/* Dados do Vendedor Logado & Ações */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-white">{user?.nome}</div>
              <div className="text-xs text-indigo-400 flex items-center justify-end gap-1.5 capitalize">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {user?.cargo || 'Vendedor'}
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-sm font-bold text-indigo-300">
              {user?.nome ? user.nome.charAt(0).toUpperCase() : 'V'}
            </div>

            <button
              onClick={logout}
              title="Encerrar Sessão"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Banner de Boas-Vindas */}
        <div className="bg-gradient-to-r from-indigo-950/50 via-slate-900/60 to-slate-900/40 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                Olá, {user?.nome?.split(' ')[0]}! Boas vendas hoje.
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Acompanhe o faturamento, controle a grade de tamanhos e feche pedidos com rapidez.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-2 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Atualizar Dados
              </button>
            </div>
          </div>
        </div>

        {/* Métricas Principais em Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#0f172a]/70 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Faturamento</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {totalFaturado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Total de transações registradas</p>
          </div>

          <div className="bg-[#0f172a]/70 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Vendas Realizadas</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">{totalVendas}</div>
            <p className="text-[11px] text-slate-500 mt-1">Pedidos concluídos</p>
          </div>

          <div className="bg-[#0f172a]/70 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Ticket Médio</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {ticketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Média por atendimento</p>
          </div>

          <div className="bg-[#0f172a]/70 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Estoque Crítico</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-amber-400">{itensEstoqueBaixo.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Peças no limite de reposição</p>
          </div>

        </div>

        {/* Abas de Navegação */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Visão Geral & Vendas
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Shirt className="w-4 h-4" />
            Catálogo de Roupas ({produtos.length})
          </button>

          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'stock'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            Grade & Estoque ({variacoes.length})
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'clients'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            Clientes & Medidas ({clientes.length})
          </button>
        </div>

        {/* CONTEÚDO DAS ABAS */}

        {/* 1. VISÃO GERAL & ÚLTIMAS VENDAS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-[#0f172a]/70 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Transações Recentes da Loja</h3>
                  <p className="text-xs text-slate-400">Vendas registradas na tabela `public.vendas` do Neon</p>
                </div>
              </div>

              {vendas.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Nenhuma venda registrada até o momento.</p>
                  <p className="text-xs text-slate-600 mt-1">As vendas concluídas aparecerão sincronizadas aqui.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase text-slate-400 bg-slate-900/60 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Data</th>
                        <th className="py-3 px-4">Vendedor</th>
                        <th className="py-3 px-4">Cliente</th>
                        <th className="py-3 px-4">Pagamento</th>
                        <th className="py-3 px-4 text-right">Valor Total</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {vendas.map(v => (
                        <tr key={v.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4 text-slate-300">
                            {new Date(v.data_venda).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-3 px-4 text-white font-medium">{v.vendedor_nome || 'Vendedor Padrão'}</td>
                          <td className="py-3 px-4 text-slate-300">{v.cliente_nome || 'Consumidor Balcão'}</td>
                          <td className="py-3 px-4 text-indigo-300 font-mono text-xs">{v.forma_pagamento}</td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-400">
                            {Number(v.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                              {v.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. CATÁLOGO DE ROUPAS */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Catálogo de Peças de Vestuário</h3>
              <span className="text-xs text-slate-400">{produtos.length} produtos cadastrados</span>
            </div>

            {produtos.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-[#0f172a]/70 rounded-2xl border border-slate-800">
                <Shirt className="w-10 h-10 mx-auto mb-2 opacity-40 text-indigo-400" />
                <p className="text-sm">Nenhum produto cadastrado no momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {produtos.map(prod => (
                  <div key={prod.id} className="bg-[#0f172a]/70 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col">
                    {prod.foto_url && (
                      <div className="h-44 w-full overflow-hidden bg-slate-900 relative">
                        <img 
                          src={prod.foto_url} 
                          alt={prod.nome} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                        />
                        <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-md">
                          {prod.genero || 'Unissex'}
                        </span>
                      </div>
                    )}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-mono text-indigo-400">{prod.codigo_sku}</span>
                        <h4 className="font-bold text-white text-base mt-0.5">{prod.nome}</h4>
                        {prod.tecido_composicao && (
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-slate-500" />
                            {prod.tecido_composicao}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Preço de Venda</span>
                        <span className="text-base font-bold text-emerald-400">
                          {Number(prod.preco_venda).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. GRADE & ESTOQUE */}
        {activeTab === 'stock' && (
          <div className="bg-[#0f172a]/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Grade de Variações (Tamanho / Cor)</h3>
              <p className="text-xs text-slate-400">Controle por unidade física e alertas de estoque mínimo</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-slate-400 bg-slate-900/60 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Peça de Roupa</th>
                    <th className="py-3 px-4">Tamanho</th>
                    <th className="py-3 px-4">Cor</th>
                    <th className="py-3 px-4">Cód. Barras</th>
                    <th className="py-3 px-4 text-center">Qtd. Estoque</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {variacoes.map(v => {
                    const isLow = v.quantidade_estoque <= v.estoque_minimo;
                    return (
                      <tr key={v.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">{v.produto_nome || 'Peça'}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-bold">
                            {v.tamanho}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{v.cor}</td>
                        <td className="py-3 px-4 text-xs font-mono text-slate-400">{v.codigo_barras || '-'}</td>
                        <td className="py-3 px-4 text-center font-bold text-white">{v.quantidade_estoque} un</td>
                        <td className="py-3 px-4 text-center">
                          {isLow ? (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold inline-flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Reposição Urgente
                            </span>
                          ) : (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                              Estoque Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. CLIENTES & MEDIDAS */}
        {activeTab === 'clients' && (
          <div className="bg-[#0f172a]/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Clientes & Perfil de Moda</h3>
              <p className="text-xs text-slate-400">Preferências de tamanho (sup/inf), calçado e estilo para vendas consultivas</p>
            </div>

            {clientes.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-40 text-cyan-400" />
                <p className="text-sm">Nenhum cliente cadastrado ainda.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase text-slate-400 bg-slate-900/60 border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Nome do Cliente</th>
                      <th className="py-3 px-4">WhatsApp / Contato</th>
                      <th className="py-3 px-4">Tam. Superior</th>
                      <th className="py-3 px-4">Tam. Inferior</th>
                      <th className="py-3 px-4">Calçado</th>
                      <th className="py-3 px-4">Estilo Preferido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {clientes.map(cli => (
                      <tr key={cli.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">{cli.nome}</td>
                        <td className="py-3 px-4 text-slate-300 font-mono text-xs">{cli.whatsapp || cli.telefone || '-'}</td>
                        <td className="py-3 px-4 text-indigo-300 font-mono font-bold">{cli.tamanho_superior || '-'}</td>
                        <td className="py-3 px-4 text-indigo-300 font-mono font-bold">{cli.tamanho_inferior || '-'}</td>
                        <td className="py-3 px-4 text-slate-300 font-mono">{cli.tamanho_calcado || '-'}</td>
                        <td className="py-3 px-4 text-slate-400">{cli.estilo_preferencia || 'Casual'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Rodapé do Sistema */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        Vagner Roupas — Sistema de Gestão & PDV • Neon Database (PostgreSQL 18) • PWA Instalável
      </footer>

    </div>
  );
};
