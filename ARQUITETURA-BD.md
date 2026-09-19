# Arquitetura e Modelo de Entidade-Relacionamento (ER) — Loja de Roupas

Este documento descreve a modelagem arquitetural e os relacionamentos do banco de dados PostgreSQL hospedado no Neon (`vagner_roupas`).

---

## 1. Diagrama Visual de Relacionamento de Entidades (ERD)

```mermaid
erDiagram
    neon_auth_user ||--o| vendedores : "autentica (auth_user_id)"
    vendedores ||--o{ clientes : "cadastra / atende (vendedor_id)"
    vendedores ||--o{ vendas : "realiza (vendedor_id)"
    clientes ||--o{ vendas : "compra (cliente_id)"
    categorias ||--o{ produtos : "organiza (categoria_id)"
    produtos ||--o{ estoque_variacoes : "possui grade (produto_id)"
    vendas ||--|{ itens_venda : "contem itens (venda_id)"
    produtos ||--o{ itens_venda : "produto vendido (produto_id)"
    estoque_variacoes ||--o{ itens_venda : "baixa de grade (variacao_id)"

    vendedores {
        uuid id PK
        uuid auth_user_id FK "neon_auth.user"
        text nome
        text email "UNIQUE"
        text telefone
        text cargo
        boolean ativo
        timestamptz created_at
    }

    categorias {
        uuid id PK
        text nome "UNIQUE"
        text descricao
        timestamptz created_at
    }

    produtos {
        uuid id PK
        uuid categoria_id FK
        text nome
        text codigo_sku "UNIQUE"
        text descricao
        text marca
        text genero
        text tecido_composicao
        numeric preco_custo
        numeric preco_venda
        text foto_url
        boolean ativo
        timestamptz created_at
    }

    estoque_variacoes {
        uuid id PK
        uuid produto_id FK
        text tamanho "P, M, G, 40..."
        text cor "Preto, Branco..."
        text codigo_barras
        integer quantidade_estoque
        integer estoque_minimo
        timestamptz created_at
    }

    clientes {
        uuid id PK
        uuid vendedor_id FK
        text nome
        text cpf
        text email
        text telefone
        text whatsapp
        date data_nascimento "aniversario"
        text genero
        text tamanho_superior
        text tamanho_inferior
        text tamanho_calcado
        text estilo_preferencia
        text cep
        text endereco
        text cidade
        text estado
        timestamptz created_at
    }

    vendas {
        uuid id PK
        uuid vendedor_id FK
        uuid cliente_id FK
        timestamptz data_venda
        numeric valor_subtotal
        numeric desconto
        numeric valor_total
        text forma_pagamento "PIX, Cartao, Dinheiro"
        integer quantidade_parcelas
        text status "concluida, pendente"
        text observacoes
        timestamptz created_at
    }

    itens_venda {
        uuid id PK
        uuid venda_id FK
        uuid produto_id FK
        uuid variacao_id FK
        text tamanho
        text cor
        integer quantidade
        numeric preco_unitario
        numeric desconto_item
        numeric subtotal
        timestamptz created_at
    }
```

---

## 2. Mapa dos Módulos do Sistema

### 🛍️ Módulo Catálogo & Estoque
* **`categorias`**: Separação das peças por departamento (ex: *Camisetas, Calças Jeans, Vestidos, Acessórios*).
* **`produtos`**: Informações mestres da peça de vestuário (nome, SKU, marca, tecido, preço sugerido).
* **`estoque_variacoes`**: Grade real de moda. Uma camisa pode ter variações de tamanho (*P, M, G*) e cores (*Azul, Branco*), cada qual com sua quantidade independente em estoque e alerta de estoque mínimo.

### 👥 Módulo Comercial & CRM de Clientes
* **`vendedores`**: Operadores da loja vinculados à autenticação do Neon Auth (`neon_auth.user`).
* **`clientes`**: Perfil 360º do cliente com informações de contato, endereço e **preferências de medidas** (tamanhos de roupas e calçados, data de aniversário para ações de marketing via WhatsApp).

### 💳 Módulo de Vendas & Caixa
* **`vendas`**: Cabeçalho do pedido com identificação do vendedor, cliente (ou venda de balcão anônima), forma de pagamento (*PIX, Cartão, Dinheiro*), descontos e valor final.
* **`itens_venda`**: Linhas do pedido detalhando exatamente qual produto, tamanho e cor saíram, valor unitário e total.

---

## 3. Fluxo de Operações e Chaves Estrangeiras

```mermaid
flowchart TD
    subgraph Acesso["Autenticação & Usuários"]
        AUTH[neon_auth.user] -->|1:1 auth_user_id| VEND[vendedores]
    end

    subgraph Clientes["Clientes & CRM"]
        VEND -->|1:N vendedor_id| CLI[clientes]
    end

    subgraph Catalogo["Catálogo de Vestuário"]
        CAT[categorias] -->|1:N categoria_id| PROD[produtos]
        PROD -->|1:N produto_id| EST[estoque_variacoes]
    end

    subgraph Comercial["Vendas & Itens"]
        VEND -->|1:N vendedor_id| VEN[vendas]
        CLI -->|0..1:N cliente_id| VEN
        VEN -->|1:N venda_id| ITM[itens_venda]
        PROD -->|1:N produto_id| ITM
        EST -.->|baixa de estoque| ITM
    end

    style Acesso fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff
    style Clientes fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#fff
    style Catalogo fill:#451a03,stroke:#fbbf24,stroke-width:2px,color:#fff
    style Comercial fill:#3b0764,stroke:#c084fc,stroke-width:2px,color:#fff
```

---

## 4. Políticas de Integridade e Exclusão (Foreign Keys)
* `ON DELETE CASCADE` em `estoque_variacoes` (ao remover um produto, suas grades são removidas).
* `ON DELETE CASCADE` em `itens_venda` (ao remover uma venda, seus itens são removidos).
* `ON DELETE SET NULL` em `produtos.categoria_id` (se a categoria for apagada, o produto não é perdido).
* `ON DELETE SET NULL` em `vendas.cliente_id` (permite manter o histórico financeiro da venda mesmo se um cliente for removido).
