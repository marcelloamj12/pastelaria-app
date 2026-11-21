# Relatório técnico da N2: Pastelaria Miltão Mobile Online

**Disciplina:** Programação para Dispositivos Móveis
**Professor:** Anderson Seixas
**Equipe (Software House Mobile):** Marcello Vieira da Silva (líder), José Luiz, Adrian Rafael Estevarengo de Matos, Antonio Neto e Nicolas Rian Oliveira
**Repositório:** https://github.com/marcelloamj12/pastelaria-app
**Versão web:** https://pastelariamiltaoo.vercel.app

## 1. Objetivo

Criar um aplicativo de cardápio digital e pedidos online para a pastelaria **Salgados do Miltão**. O cliente escolhe os produtos pelo celular ou pelo navegador, faz o pedido e acompanha o status, sem precisar de cardápio de papel nem de atendimento no balcão. O dono da pastelaria tem uma área própria para ver e atualizar os pedidos.

Na N1 foi entregue o fluxo básico (MVP). Na N2 o app foi ligado ao banco de dados real, ganhou carrinho completo, área do dono, acompanhamento do pedido, identidade visual e publicação na web.

## 2. O que foi entregue na N2

| Funcionalidade | Situação |
|---|---|
| Cardápio real com 26 produtos em 5 categorias, vindo do banco | Entregue |
| Identidade visual do Figma aplicada em todas as telas | Entregue |
| Carrinho com vários produtos e quantidades | Entregue |
| Finalização com dados do cliente, retirada/entrega, pagamento e observações | Entregue |
| Pedido gravado no Supabase com preço calculado pelo banco | Entregue |
| Tela de pedido confirmado com número e status | Entregue |
| Envio do resumo pelo WhatsApp | Entregue (mock-up) |
| Forma de pagamento | Entregue (mock-up) |
| Acompanhar pedido (atualiza a cada 10 segundos) | Entregue |
| Meus pedidos (histórico salvo no aparelho) | Entregue |
| Barra de navegação inferior (Início, Cardápio, Meus pedidos, Carrinho) | Entregue |
| Carregando e mensagens de erro nas telas | Entregue |
| Login do dono com e-mail e senha | Entregue |
| Painel do dono: pedidos (mudar status), clientes e itens dos pedidos | Entregue |
| Versão web publicada no Vercel | Entregue |

Pagamento e WhatsApp são simulações (mock-up), como combinado com o professor.

## 3. Tecnologias

| Parte | Tecnologia |
|---|---|
| Aplicativo | React Native + Expo |
| Navegação | React Navigation (pilha de telas + barra inferior) |
| Banco de dados e API | Supabase (PostgreSQL) |
| Login do dono | Supabase Auth |
| Publicação web | Vercel |
| Organização | GitHub (branches e Pull Requests), PraxiLab (Kanban) e Figma |

## 4. Arquitetura

O app foi organizado em camadas. As telas não falam direto com o banco: elas chamam os serviços, e só os serviços usam o Supabase.

```
Telas (screens)  →  Hooks / Context  →  Serviços (services)  →  Supabase  →  PostgreSQL
```

- **screens:** telas do cliente e do dono
- **context:** carrinho e login compartilhados entre as telas
- **services:** cardápio, pedido, status e admin
- **lib/supabase.js:** conexão com o banco, usando variáveis de ambiente (`.env`)

Com isso, uma mudança no banco não obriga a mexer nas telas, e cada integrante conseguiu trabalhar em uma parte sem atrapalhar o outro.

## 5. Banco de dados e segurança

Tabelas principais: categorias, produtos, clientes, pedidos, itens do pedido e perfis (para saber quem é administrador).

Decisões de segurança:

- **RLS ativo em todas as tabelas.** Cada tabela tem regras de quem pode ler e gravar.
- **Pedido gravado por uma função do banco (`criar_pedido`).** O app manda só o produto e a quantidade. O preço e o total são calculados no banco, então ninguém consegue mudar o preço pelo celular.
- **Cliente vê só o próprio pedido (`buscar_meu_pedido`).** Precisa do número do pedido e do telefone usado na compra.
- **Lista de pedidos só para o dono (`meus_pedidos` e regras de admin).** O acesso de visitante foi bloqueado de propósito.
- **Somente a chave pública** do Supabase vai no app. A chave secreta nunca foi usada, e o arquivo `.env` não vai para o GitHub.
- **Nenhum dado pessoal no console** do navegador (logs de teste removidos).

## 6. Organização do trabalho

- **Kanban no PraxiLab:** cada integrante criou e assumiu os próprios cards, com prioridade, data e checklist. Os cards passaram por Backlog, A Fazer, Em Andamento, Revisão e Concluído.
- **Uma branch por integrante ou por funcionalidade.** Ninguém trabalhou direto na `main`.
- **Pull Requests:** cada entrega virou um PR ligado ao card do Kanban. O líder revisou cada PR e fez o merge com "Create a merge commit", para manter o histórico de quem fez cada coisa.
- **Commits com o nome do card**, para ligar o código à tarefa.
- **Publicação automática:** cada merge na `main` atualiza o site no Vercel.

## 7. Contribuições de cada integrante

### Marcello Vieira da Silva (líder)

- Coordenação da equipe, divisão das tarefas, cronograma e acompanhamento do Kanban
- Revisão de todos os Pull Requests, orientação dos ajustes (base errada, conflitos, segurança) e merge na `main`
- Testes do app a cada merge e caça aos bugs (ver plano de testes)
- Publicação da versão web no Vercel (configuração, variáveis e domínio)
- Código: título das abas com o nome da loja, títulos com acento nas telas, logo no ícone do site e do app, remoção de logs que mostravam dados do cliente e remoção de arquivos antigos
- Documentação: README, guia de deploy, plano de testes, relatório técnico e roteiro da apresentação

### José Luiz

- Identidade visual do Figma aplicada nas telas
- Categorias do app conforme o cardápio real
- Barra de navegação inferior e tela Meus pedidos
- Tela Acompanhar pedido e unificação do fluxo Meus pedidos / Acompanhar
- Carregando e mensagens de erro nas telas
- Correção da tela de pedido confirmado (PR #21)

### Adrian Rafael Estevarengo de Matos

- Cardápio real com 26 produtos no banco e testes do banco
- Tela de login do dono
- Telas do painel do dono: pedidos e clientes

### Antonio Neto

- Carrinho com vários produtos
- Finalização com dados do cliente e resumo
- Tela de pedido confirmado
- Forma de pagamento e botão de WhatsApp (mock-up)
- Instalação da dependência `expo-navigation-bar`

### Nicolas Rian Oliveira

- Estrutura do banco, regras de segurança (RLS) e perfis de administrador
- Função de gravar o pedido com preço calculado no banco
- Login do dono e serviços do painel
- Funções de consulta segura do pedido e histórico salvo no aparelho

### Commits na N2 (a partir de 10/11/2026)

Contagem feita em 21/11/2026 com `git shortlog -sn --all --no-merges --since="2026-11-10"`, sem contar os merges. O Adrian aparece com dois nomes no Git (AdrianEstevarengo e Adrian Rafael Estevarengo de Matos), e os dois foram somados:

| Integrante | Commits |
|---|---|
| Nicolas Rian Oliveira | 44 |
| José Luiz | 23 |
| Marcello Vieira da Silva | 10 |
| Adrian Rafael Estevarengo de Matos | 4 |
| Antonio Neto | 3 |

Há ainda 3 commits registrados como "unknown" (feitos em um computador sem o nome configurado no Git). Os números podem mudar até a entrega.

## 8. Testes

Os testes foram feitos a cada merge, rodando o app no computador e no site publicado. Foram 18 testes funcionais e 5 de segurança, todos aprovados, e 9 bugs encontrados e corrigidos. Detalhes em [`plano-de-testes.md`](plano-de-testes.md).

Principais bugs corrigidos:

- Tela branca depois de finalizar o pedido (função apagada ao resolver conflito)
- Erro 401 em "Meus pedidos" (a tela usava uma função liberada só para o dono)
- Biblioteca usada no código, mas não instalada
- Dados do cliente aparecendo no console do navegador

## 9. Publicação

A versão web está em https://pastelariamiltaoo.vercel.app. O Vercel gera o site com `npx expo export --platform web` e atualiza sozinho a cada merge na `main`. Detalhes em [`deploy-vercel.md`](deploy-vercel.md).

## 10. Dificuldades e soluções

| Dificuldade | Solução |
|---|---|
| Conflitos de merge quando duas pessoas mexiam no mesmo arquivo | O autor do PR atualiza a branch com a `main`, resolve o conflito e testa antes de pedir o merge |
| PRs abertos para a branch errada | Conferência da base (`main`) na revisão de cada PR |
| Cliente sem login precisava ver o próprio pedido sem ver o dos outros | Função no banco que exige número do pedido e telefone, e histórico salvo no aparelho |
| Garantir que o preço não fosse alterado pelo celular | Cálculo do total feito pela função do banco |
| Supabase gratuito pausa o projeto sem uso | Conferir e clicar em "Resume project" antes de usar |

## 11. Limitações e próximos passos

- Pagamento e WhatsApp são simulações. Um próximo passo seria integrar um meio de pagamento real (ex.: Pix) e a API oficial do WhatsApp.
- "Meus pedidos" fica salvo no aparelho. Se o cliente trocar de celular, o histórico some (o pedido continua no banco). Um login opcional para o cliente resolveria isso.
- O status atualiza a cada 10 segundos. Poderia usar atualização em tempo real (Supabase Realtime).
- Publicação nas lojas (Play Store e App Store).

## 12. Conclusão

A equipe entregou um aplicativo funcional, ligado a um banco de dados real e seguro, com fluxo completo de pedido para o cliente e uma área de gestão para o dono, além de uma versão web publicada. O trabalho foi organizado com Kanban, branches, Pull Requests revisados e documentação, o que permitiu que cinco pessoas trabalhassem no mesmo projeto com controle do que cada uma fez.