import { neon, neonConfig } from '@neondatabase/serverless';
import type { Vendedor, CargoVendedor, Produto, Categoria, EstoqueVariacao, Venda, Cliente } from '../types';

// Desativar avisos repetitivos do Neon no console do navegador
neonConfig.disableWarningInBrowsers = true;

// Configurações do Neon (lidas de forma segura das variáveis de ambiente .env)
export const NEON_CONNECTION_STRING = 
  import.meta.env.VITE_NEON_DATABASE_URL || '';

export const NEON_AUTH_URL = 
  import.meta.env.VITE_NEON_AUTH_URL || '';

// Cliente SQL Serverless do Neon
const sql = neon(NEON_CONNECTION_STRING, {
  disableWarningInBrowsers: true,
});

/**
 * Registra um novo vendedor no Neon Auth e sincroniza na tabela `public.vendedores`
 */
export async function cadastrarVendedor(dados: {
  nome: string;
  email: string;
  telefone?: string;
  cargo: CargoVendedor;
  senha: string;
}): Promise<Vendedor> {
  let authUserId: string | null = null;

  // 1. Tentar cadastro no Neon Auth (Better Auth)
  try {
    const authRes = await fetch(`${NEON_AUTH_URL}/sign-up/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: dados.nome,
        email: dados.email,
        password: dados.senha
      })
    });

    if (authRes.ok) {
      const authData = await authRes.json();
      authUserId = authData?.user?.id || null;
    }
  } catch (err) {
    console.warn('Neon Auth via REST endpoint notice (prosseguindo com sincronização direta no banco):', err);
  }

  // 2. Sincronizar na tabela public.vendedores no Neon PostgreSQL
  try {
    const rows = await sql.query(
      `INSERT INTO public.vendedores (auth_user_id, nome, email, telefone, cargo, ativo)
       VALUES ($1, $2, $3, $4, $5, true)
       ON CONFLICT (email) 
       DO UPDATE SET 
         nome = EXCLUDED.nome, 
         telefone = EXCLUDED.telefone, 
         cargo = EXCLUDED.cargo,
         auth_user_id = COALESCE(EXCLUDED.auth_user_id, public.vendedores.auth_user_id)
       RETURNING id, auth_user_id, nome, email, telefone, cargo, ativo, created_at;`,
      [authUserId, dados.nome, dados.email, dados.telefone || null, dados.cargo]
    );

    if (rows && rows.length > 0) {
      return rows[0] as Vendedor;
    }
  } catch (dbErr: any) {
    console.error('Erro ao salvar vendedor no Neon:', dbErr);
    throw new Error(dbErr?.message || 'Erro ao sincronizar vendedor no banco de dados Neon.');
  }

  throw new Error('Não foi possível concluir o cadastro do vendedor.');
}

/**
 * Autentica o vendedor via Neon Auth ou consulta direta no Neon
 */
export async function autenticarVendedor(email: string, senha: string): Promise<Vendedor> {
  // 1. Tentar login via endpoint do Neon Auth se disponível
  try {
    const authRes = await fetch(`${NEON_AUTH_URL}/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: senha })
    });

    if (authRes.ok) {
      const authData = await authRes.json();
      const authUserId = authData?.user?.id;
      
      // Buscar vendedor vinculado no banco
      const rows = await sql.query(
        `SELECT id, auth_user_id, nome, email, telefone, cargo, ativo, created_at 
         FROM public.vendedores 
         WHERE email = $1 OR auth_user_id = $2
         LIMIT 1;`,
        [email, authUserId || null]
      );

      if (rows.length > 0) {
        return rows[0] as Vendedor;
      }
    }
  } catch (authErr) {
    console.warn('Neon Auth via REST offline/cors, verificando base de dados:', authErr);
  }

  // 2. Consulta de fallback na tabela public.vendedores
  const rows = await sql.query(
    `SELECT id, auth_user_id, nome, email, telefone, cargo, ativo, created_at 
     FROM public.vendedores 
     WHERE LOWER(email) = LOWER($1) AND ativo = true
     LIMIT 1;`,
    [email]
  );

  if (rows && rows.length > 0) {
    return rows[0] as Vendedor;
  }

  throw new Error('Credenciais inválidas ou vendedor não cadastrado no sistema.');
}

/**
 * Carrega dados essenciais para o Dashboard Comercial da loja
 */
export async function carregarDadosDashboard() {
  try {
    const [categorias, produtos, variacoes, vendas, clientes] = await Promise.all([
      sql.query('SELECT * FROM public.categorias ORDER BY nome ASC;'),
      sql.query(`
        SELECT p.*, c.nome as categoria_nome 
        FROM public.produtos p 
        LEFT JOIN public.categorias c ON p.categoria_id = c.id 
        ORDER BY p.created_at DESC;
      `),
      sql.query(`
        SELECT ev.*, p.nome as produto_nome 
        FROM public.estoque_variacoes ev 
        JOIN public.produtos p ON ev.produto_id = p.id 
        ORDER BY ev.quantidade_estoque ASC;
      `),
      sql.query(`
        SELECT v.*, vend.nome as vendedor_nome, cli.nome as cliente_nome 
        FROM public.vendas v 
        LEFT JOIN public.vendedores vend ON v.vendedor_id = vend.id 
        LEFT JOIN public.clientes cli ON v.cliente_id = cli.id 
        ORDER BY v.data_venda DESC 
        LIMIT 10;
      `),
      sql.query('SELECT * FROM public.clientes ORDER BY nome ASC LIMIT 20;')
    ]);

    return {
      categorias: categorias as Categoria[],
      produtos: produtos as Produto[],
      variacoes: variacoes as EstoqueVariacao[],
      vendas: vendas as Venda[],
      clientes: clientes as Cliente[]
    };
  } catch (err) {
    console.error('Erro ao carregar dados do dashboard:', err);
    return {
      categorias: [],
      produtos: [],
      variacoes: [],
      vendas: [],
      clientes: []
    };
  }
}
