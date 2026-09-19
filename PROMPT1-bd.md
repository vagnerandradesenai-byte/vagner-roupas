# Prompt 1 — Base do projeto + Neon completo (Loja de Roupas)

Você vai criar o banco de dados para um sistema completo de gestão e vendas de uma **Loja de Roupas**. Você tem acesso ao Neon via MCP e o projeto já foi configurado/criado com o nome de "vagner_roupas". Crie toda a estrutura de tabelas, relacionamentos, chaves estrangeiras, índices e políticas de segurança diretamente via MCP, sem necessidade de copiar SQL manualmente.

---

## Estrutura de Tabelas e Modelagem de Dados

Crie as seguintes tabelas com tipos de dados PostgreSQL adequados (`uuid`, `text`, `numeric(10,2)`, `integer`, `boolean`, `date`, `timestamptz`):

### 1. Tabela `vendedores`
Representa a equipe de vendas e operadores do sistema:
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `nome` (text, not null)
- `email` (text, not null, unique)
- `telefone` (text)
- `cargo` (text, default 'vendedor') — ex: 'vendedor', 'gerente', 'administrador'
- `ativo` (boolean, default true)
- `created_at` (timestamptz, default `now()`)

### 2. Tabela `categorias`
Classificação dos produtos e peças de vestuário:
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `nome` (text, not null, unique) — ex: Camisetas, Calças, Vestidos, Bermudas, Acessórios, Moda Praia
- `descricao` (text)
- `created_at` (timestamptz, default `now()`)

### 3. Tabela `produtos`
Catálogo das peças de roupa:
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `categoria_id` (uuid, foreign key → `categorias.id`, on delete set null)
- `nome` (text, not null) — ex: "Camisa Linho Manga Longa"
- `codigo_sku` (text, unique) — código de referência / etiqueta
- `descricao` (text)
- `marca` (text)
- `genero` (text) — ex: 'Masculino', 'Feminino', 'Unissex', 'Infantil'
- `tecido_composicao` (text) — ex: "100% Algodão", "Linho com Algodão", "Jeans com Elastano"
- `preco_custo` (numeric(10,2))
- `preco_venda` (numeric(10,2), not null)
- `foto_url` (text)
- `ativo` (boolean, default true)
- `created_at` (timestamptz, default `now()`)

### 4. Tabela `estoque_variacoes`
Grade de produtos com tamanho, cor e controle de estoque:
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `produto_id` (uuid, foreign key → `produtos.id`, on delete cascade, not null)
- `tamanho` (text, not null) — ex: PP, P, M, G, GG, 36, 38, 40, 42, 44
- `cor` (text, not null) — ex: Preto, Branco, Azul Marinho, Terracota
- `codigo_barras` (text)
- `quantidade_estoque` (integer, not null, default 0)
- `estoque_minimo` (integer, default 2)
- `created_at` (timestamptz, default `now()`)

### 5. Tabela `clientes`
Cadastro dos clientes com perfil de medidas e preferências de moda:
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `vendedor_id` (uuid, foreign key → `vendedores.id`, on delete set null) — vendedor responsável / que cadastrou
- `nome` (text, not null)
- `cpf` (text)
- `email` (text)
- `telefone` (text)
- `whatsapp` (text)
- `data_nascimento` (date) — importante para aniversariantes do mês e promoções
- `genero` (text)
- `tamanho_superior` (text) — ex: P, M, G, GG
- `tamanho_inferior` (text) — ex: 38, 40, 42
- `tamanho_calcado` (text) — ex: 37, 40
- `estilo_preferencia` (text) — ex: Casual, Social, Esportivo, Urbano
- `cep` (text)
- `endereco` (text)
- `numero` (text)
- `complemento` (text)
- `bairro` (text)
- `cidade` (text)
- `estado` (text)
- `observacoes` (text)
- `created_at` (timestamptz, default `now()`)

### 6. Tabela `vendas`
Registro das transações e pedidos realizados na loja:
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `vendedor_id` (uuid, foreign key → `vendedores.id`, not null)
- `cliente_id` (uuid, foreign key → `clientes.id`, on delete set null) — opcional para vendas de balcão avulsas
- `data_venda` (timestamptz, default `now()`, not null)
- `valor_subtotal` (numeric(10,2), not null)
- `desconto` (numeric(10,2), default 0.00)
- `valor_total` (numeric(10,2), not null)
- `forma_pagamento` (text, not null) — ex: 'PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Crediário'
- `quantidade_parcelas` (integer, default 1)
- `status` (text, default 'concluida') — ex: 'concluida', 'pendente', 'cancelada'
- `observacoes` (text)
- `created_at` (timestamptz, default `now()`)

### 7. Tabela `itens_venda`
Itens vinculados a cada venda, com detalhe do produto, tamanho, cor e valor:
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `venda_id` (uuid, foreign key → `vendas.id`, on delete cascade, not null)
- `produto_id` (uuid, foreign key → `produtos.id`, not null)
- `variacao_id` (uuid, foreign key → `estoque_variacoes.id`, on delete set null)
- `tamanho` (text, not null)
- `cor` (text, not null)
- `quantidade` (integer, not null)
- `preco_unitario` (numeric(10,2), not null)
- `desconto_item` (numeric(10,2), default 0.00)
- `subtotal` (numeric(10,2), not null)
- `created_at` (timestamptz, default `now()`)

---

## Requisitos Adicionais e Boas Práticas

1. **Índices de Performance:**
   - Criar índices nas chaves estrangeiras: `itens_venda(venda_id)`, `itens_venda(produto_id)`, `estoque_variacoes(produto_id)`, `vendas(cliente_id)`, `vendas(vendedor_id)`, `produtos(categoria_id)`.
   - Criar índice para busca rápida por data: `vendas(data_venda DESC)`.
   - Criar índice para busca de produtos por SKU: `produtos(codigo_sku)`.

2. **Segurança e RLS (Row Level Security):**
   - Ative o Row Level Security (RLS) nas tabelas conforme as necessidades de isolamento.
   - Configure as policies adequadas considerando a autenticação via Neon Auth (`auth.user_id` / JWT).

3. **Validação Final:**
   - Liste todas as tabelas criadas e suas colunas para confirmar a execução correta da estrutura no banco de dados.