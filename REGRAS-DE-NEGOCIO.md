# Documento de Regras de Negócio — Loja de Roupas (Vagner Roupas)

Este documento define todas as **Regras de Negócio (RN)** que regem o comportamento do sistema de gestão, frente de caixa (PDV), controle de estoque e CRM da **Vagner Roupas**.

---

## 1. Perfis de Usuário e Permissões (RN-01)

| Perfil | Acesso Permitido | Restrições |
| :--- | :--- | :--- |
| **Administrador / Dono** | Acesso total a configurações, relatórios financeiros, custos de peças, margem de lucro e gestão de usuários. | Nenhuma. |
| **Gerente** | Autorização de descontos acima do limite, estorno de vendas, ajuste manual de estoque e relatórios comerciais. | Não pode excluir outros gerentes ou ver dados confidenciais do dono. |
| **Vendedor** | Cadastro de clientes, consulta de catálogo e estoque, abertura de pedidos/vendas e visualização de suas próprias comissões. | Não pode dar descontos acima do teto estipulado nem estornar vendas fechadas sem autorização. |
| **Caixa** | Recebimento de pagamentos, emissão de comprovantes, fechamento de caixa e registro de sangria/suprimento. | Não altera preços de produtos cadastrados. |

---

## 2. Gestão de Catálogo, Grade e Estoque (RN-02)

* **RN-02.1 (Identificação Única por SKU e Etiqueta)**: Cada produto mestre deve possuir um `codigo_sku` único. As variações de tamanho e cor herdam o prefixo do SKU (ex: `CAM-LIN-AZ-M`).
* **RN-02.2 (Grade de Tamanhos e Cores)**: Toda roupa comercializada deve obrigatoriamente pertencer a uma variação de **Tamanho** (*PP, P, M, G, GG, 36 a 48*) e **Cor** (*Preto, Branco, etc.*).
* **RN-02.3 (Bloqueio de Estoque Negativo)**: Uma venda não pode ser concluída se a quantidade do item na variação for superior ao `quantidade_estoque` disponível, salvo autorização explícita do Gerente (ex: venda sob encomenda).
* **RN-02.4 (Baixa em Tempo Real)**: No momento em que uma venda for marcada como `concluida`, o sistema deve decrementar automaticamente o saldo correspondente na tabela `estoque_variacoes`.
* **RN-02.5 (Alerta de Estoque Mínimo)**: Quando `quantidade_estoque <= estoque_minimo`, o sistema deve destacar a peça no painel com sinalizador amarelo/vermelho para alertar sobre necessidade de reposição.
* **RN-02.6 (Preço de Venda e Margem)**: O preço de venda deve ser sempre maior ou igual ao preço de custo. O sistema deve calcular automaticamente a margem de contribuição (Markup).

---

## 3. Clientes e CRM de Moda (RN-03)

* **RN-03.1 (Venda Avulsa vs. Cliente Cadastrado)**:
  * Toda venda pode ser realizada no modo **"Consumidor Avulso / Balcão"** (onde `cliente_id` fica nulo).
  * Para vendas com crediário, entrega em domicílio ou aplicação de fidelidade, a identificação do cliente é obrigatória.
* **RN-03.2 (Perfil de Medidas do Cliente)**: O cadastro do cliente permite registrar tamanhos habituais (`tamanho_superior`, `tamanho_inferior`, `tamanho_calcado`) e estilo preferido para sugestões inteligentes de venda.
* **RN-03.3 (Campanhas de Aniversário)**: Clientes que fazem aniversário no mês corrente devem ser listados no dashboard para que a equipe envie mensagens promocionais ou cupons via WhatsApp.
* **RN-03.4 (Unicidade)**: Não é permitido cadastrar dois clientes com o mesmo CPF (quando informado) ou mesmo telefone/WhatsApp.

---

## 4. Vendas, Descontos e Caixa (PDV) (RN-04)

* **RN-04.1 (Política de Descontos)**:
  * **Vendedor**: Pode aplicar até **5% de desconto** por conta própria.
  * **Gerente / Admin**: Descontos superiores a 5% até o teto máximo (ex: 20%) exigem senha/autorização de gerente.
* **RN-04.2 (Comissão de Vendas)**:
  * Cada venda concluída calcula comissão para o vendedor vinculado (`vendedor_id`).
  * Sugestão padrão: **3% sobre o valor líquido da venda** (após descontos).
  * Em caso de venda cancelada ou devolvida com reembolso monetário, a comissão correspondente é estornada.
* **RN-04.3 (Formas de Pagamento)**:
  * **PIX**: Venda à vista com confirmação instantânea.
  * **Cartão de Débito**: À vista.
  * **Cartão de Crédito**: À vista ou parcelado (ex: até 6x sem juros, com parcela mínima de R$ 50,00).
  * **Dinheiro**: O sistema deve calcular o troco automaticamente a partir do valor recebido.
  * **Pagamento Misto**: Uma venda pode ser dividida em duas formas de pagamento (ex: 50% PIX + 50% Cartão).

---

## 5. Trocas e Devoluções de Roupas (RN-05)

* **RN-05.1 (Prazo Legal e Política de Troca)**:
  * Roupas sem defeito (troca por tamanho, cor ou modelo): até **30 dias corridos** após a compra.
  * Roupas com defeito de fabricação: até **90 dias**.
* **RN-05.2 (Condições da Peça)**:
  * A peça deve obrigatoriamente estar com a etiqueta original fixada e sem indícios de uso/lavagem.
* **RN-05.3 (Crédito / Vale-Troca)**:
  * A peça devolvida retorna ao estoque na sua respectiva variação.
  * É gerado um crédito no valor pago original para o cliente abater em uma nova compra.
  * Se a nova peça for de maior valor, o cliente paga a diferença; se for de menor valor, o saldo residual fica disponível em crédito na loja.

---

## 6. Auditoria e Cancelamentos (RN-06)

* **RN-06.1 (Cancelamento de Venda)**:
  * Apenas usuários com perfil `gerente` ou `administrador` podem cancelar vendas já registradas.
  * O cancelamento exige a justificativa obrigatória (ex: desistência, erro de digitação, produto devolvido).
  * Todas as peças da venda cancelada retornam automaticamente ao saldo de estoque.
* **RN-06.2 (Imutabilidade de Preço Histórico)**: O preço registrado em `itens_venda` (`preco_unitario`) nunca deve ser recalculado retroativamente quando o preço do produto no catálogo for reajustado.

---

## 7. Indicadores e Metas Comerciais (RN-07)

O sistema deve disponibilizar métricas consolidadas em tempo real:
1. **Faturamento Bruto e Líquido** (Dia, Mês, Ano).
2. **Ticket Médio** (Valor total faturado ÷ Número de vendas).
3. **Peças por Atendimento (PA)** (Total de peças vendidas ÷ Número de atendimentos).
4. **Ranking de Vendedores** (Valor vendido e quantidade de itens).
5. **Top 10 Produtos Mais Vendidos** (por categoria, tamanho e cor).
6. **Curva ABC de Estoque** (peças de alto giro vs. peças encalhadas para queima de estoque).
