<p align="center">
    <img src="logo%20pastelaria%20miltao.png" alt="Salgados do Miltão" width="320">
</p>

# Pastelaria Miltão Mobile Online 🥟

App de cardápio digital e pedidos online para a pastelaria **Salgados do Miltão**, desenvolvido em React Native + Expo como projeto acadêmico da disciplina de Programação para Dispositivos Móveis.

O cliente vê o cardápio por categorias, monta o carrinho, finaliza o pedido e acompanha o status, sem precisar de cardápio de papel nem de atendimento no balcão. O dono da pastelaria entra numa área própria para ver e atualizar os pedidos.

🌐 **Acesse a versão web:** https://pastelariamiltaoo.vercel.app

## ✅ O que o app faz

**Cliente (sem login):**

- Vê o cardápio real com 26 produtos em 5 categorias (Pastéis, Especiais, Salgados, Doces e Bebidas)
- Abre os detalhes do produto e adiciona ao carrinho
- Monta um carrinho com vários produtos e muda as quantidades
- Finaliza o pedido com nome, telefone, retirada ou entrega, forma de pagamento e observações
- Recebe o número do pedido e pode enviar o resumo pelo WhatsApp
- Acompanha o status do pedido (atualiza a cada 10 segundos)
- Vê o histórico em "Meus pedidos" (os pedidos ficam salvos no próprio aparelho)

**Dono da pastelaria (com login):**

- Entra pela "Área do dono" com e-mail e senha
- Vê os pedidos e muda o status (recebido, em preparo, pronto, entregue)
- Vê os clientes e os itens de cada pedido

O pagamento e o WhatsApp são **mock-up** (simulação), como combinado com o professor: o app registra a forma de pagamento escolhida, mas não faz cobrança real.

## 🚀 Tecnologias

- **App:** React Native + Expo, React Navigation (barra de navegação inferior)
- **Banco de dados e API:** Supabase (PostgreSQL), com autenticação e RLS
- **Publicação web:** Vercel (atualiza sozinho a cada merge na `main`)
- **Organização:** GitHub, PraxiLab (Kanban) e Figma (protótipo)

## 🧱 Arquitetura

As telas nunca falam direto com o banco de dados. Elas chamam funções da pasta `services`, e só essa pasta conversa com o Supabase. Assim, se o banco mudar um dia, nenhuma tela precisa ser alterada.

```
Tela  →  Serviço  →  Supabase  →  Banco PostgreSQL
```

**Segurança no banco:**

- RLS (regras de segurança) ativa em todas as tabelas
- O pedido é gravado por uma função do banco (`criar_pedido`), que busca o preço no próprio banco. O preço nunca vem do celular
- O cliente só consegue ver o próprio pedido, informando o número do pedido e o telefone (`buscar_meu_pedido`)
- Só quem tem perfil de administrador vê a lista de pedidos e clientes

Detalhes em [`banco-de-dados/README.md`](banco-de-dados/README.md).

## 🎨 Identidade visual

Baseada na comunicação que o Salgados do Miltão já usa, adaptada para uma interface digital simples e moderna.

| Cor | Hex | Uso |
| --- | --- | --- |
| Vermelho | `#D62828` | Cor primária: botões, cabeçalho e preços |
| Amarelo | `#F6C445` | Cor secundária: banners e apoio |
| Creme | `#FFFDF8` | Fundo das telas |
| Cinza claro | `#F5F5F5` | Cards e campos |
| Preto / cinza | `#202020` / `#666666` | Textos |

Protótipo no [Figma](https://www.figma.com/design/zRK5f5dt2VPuaxXGSWmnfj/Sem-t%C3%ADtulo).

## 📁 Estrutura do projeto

```
src/
├── navigation/   # navegação entre as telas (barra inferior + telas do pedido e do admin)
├── screens/      # telas do app (cliente e admin)
├── components/   # partes reaproveitadas (ex.: cabeçalho da loja)
├── context/      # carrinho e login compartilhados entre as telas
├── services/     # comunicação com o banco (cardápio, pedido, status, admin)
├── hooks/        # lógica reutilizável
├── theme/        # cores e estilos
└── lib/          # configuração do Supabase
assets/           # logo, ícone e imagens
banco-de-dados/   # scripts SQL, diagrama e documentação do banco
docs/             # documentação do projeto
```

## ⚙️ Como rodar o projeto

1. Tenha o Node.js instalado e o app **Expo Go** no celular
2. Clone o repositório:

```
git clone https://github.com/marcelloamj12/pastelaria-app.git
cd pastelaria-app
```

3. Instale as dependências:

```
npm install
```

4. Copie o arquivo `.env.example` para `.env` e preencha com a URL e a chave pública (anon/publishable) do Supabase
5. Inicie o app:

```
npx expo start -c
```

6. Escaneie o QR Code com o Expo Go, ou aperte **w** para abrir no navegador

> O arquivo `.env` não vai para o GitHub de propósito, porque guarda as credenciais do banco. Sem ele o app mostra a tela "Configuração necessária".

> O Supabase gratuito pausa o projeto depois de alguns dias sem uso. Se o cardápio aparecer vazio, entre no Supabase e clique em **Resume project**.

## 👥 Equipe

| Integrante | Responsabilidade na N2 |
| ---------- | ---------------- |
| Marcello Vieira da Silva (líder) | Coordenação, Kanban, revisão e merge dos PRs, deploy no Vercel, testes, limpeza do código e documentação |
| José Luiz | Identidade visual do Figma, categorias, telas do cliente, carregamento e mensagens de erro, Acompanhar pedido e Meus pedidos |
| Adrian Rafael Estevarengo de Matos | Testes do banco com o cardápio real, revisão da RLS e conferência no banco, telas de login e de clientes do admin |
| Antonio Neto | Carrinho com vários produtos, finalização, pedido confirmado, pagamento e WhatsApp (mock-up) |
| Nicolas Rian Oliveira | Banco de dados, segurança (RLS), login do admin, serviços do painel, tela de pedidos do admin e histórico de pedidos |

## 📋 Gerenciamento do projeto

O andamento é acompanhado em um Kanban no PraxiLab. Cada integrante cria os próprios cards e trabalha na própria branch. Cada funcionalidade vira um Pull Request ligado ao card, o líder revisa e faz o merge na `main` com "Create a merge commit".

## 📚 Documentação

- [Guia de deploy no Vercel](docs/deploy-vercel.md)
- [Plano de testes e bugs encontrados](docs/plano-de-testes.md)
- [Relatório técnico da N2](docs/relatorio-tecnico-n2.md)
- [Documentação final em PDF](docs/Documentacao_Pastelaria_Miltao.pdf)

## ⚠️ Limitações conhecidas

- Pagamento e WhatsApp são simulações (mock-up), sem cobrança real
- "Meus pedidos" fica salvo no aparelho: se o cliente trocar de celular ou limpar os dados do app, o histórico some (o pedido continua no banco)
- O status do pedido é atualizado a cada 10 segundos, e não instantaneamente
- O plano gratuito do Supabase pausa o banco quando fica sem uso

## 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais.