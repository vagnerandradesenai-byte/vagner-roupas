# Prompt 2 — Autenticação (Loja de Roupas)

Agora vamos criar a autenticação do sistema de gestão da **Loja de Roupas**. O sistema deve permitir que vendedores, gerentes e administradores criem uma conta e façam login. Use o **Neon Auth** que já está configurado no projeto `"vagner_roupas"`.

---

## Tela de Login
- Logo / Cabeçalho da marca: **"Vagner Roupas"**
- Campo de Email
- Campo de Senha (com opção de mostrar/ocultar senha)
- Botão **"Entrar no Sistema"**
- Link *"Não tem conta? Cadastre-se"*

---

## Tela de Cadastro (Novo Vendedor / Colaborador)
- Logo / Cabeçalho da marca: **"Vagner Roupas"**
- Campo de Nome Completo
- Campo de Email
- Campo de Telefone / WhatsApp
- Campo de Cargo / Função (opções: *Vendedor*, *Gerente*, *Caixa*)
- Campo de Senha (mínimo de 6 caracteres)
- Campo de Confirmar Senha
- Botão **"Criar Conta"**
- Link *"Já tem conta? Faça login"*

---
## Stack 
- Vite + React
- Tailwind CSS
- TypeScript
- INTERFACE RESPONSIVE
- PWA


## Regras Importantes e Integração
1. **Sincronização com o Banco (`vendedores`)**:
   - Ao realizar o cadastro via Neon Auth, vincular e salvar automaticamente o registro na tabela `vendedores` do schema `public`:
     - `auth_user_id` (UUID do usuário autenticado no `neon_auth.user`)
     - `nome`
     - `email`
     - `telefone`
     - `cargo` (default: `'vendedor'`)
     - `ativo` (default: `true`)
2. **Redirecionamento**:
   - Após o login bem-sucedido, redirecionar automaticamente para o **Dashboard Comercial** da loja (visão de vendas, catálogo de roupas e estoque).
   - Se o usuário já estiver com sessão ativa e tentar acessar `/login` ou `/cadastro`, redirecionar direto para o dashboard.
3. **Validação & Mensagens Amigáveis**:
   - A senha deve conter no mínimo 6 caracteres.
   - Validar se as senhas coincidem no cadastro.
   - Se o login ou cadastro falhar (ex: credenciais incorretas, email já existente), exibir alerta claro, amigável e visualmente integrado à interface.
4. **Persistência de Sessão**:
   - Manter a sessão ativa utilizando os cookies/tokens do Neon Auth, evitando a necessidade de login repetitivo a cada atualização da página.

---

## Design & Identidade Visual
- **Conceito**: Elegante, moderno e refinado, remetendo a uma marca de moda / boutique contemporânea (estilo *fashion store dashboard*).
- **Paleta de Cores**:
  - Tema escuro sofisticado (*dark mode* refinado) com tons grafite/ardósia escuro (`#0f172a`, `#1e293b`).
  - Destaques sutis em índigo/azul elétrico ou toques dourados/champagne, transmitindo estilo e profissionalismo.
- **Tipografia**: Moderna e limpa (Google Fonts como *Plus Jakarta Sans* ou *Inter*).
- **Componentes**: Cards com efeito de vidro suave (*glassmorphism* leve), cantos arredondados e transições suaves nos inputs e botões de ação.