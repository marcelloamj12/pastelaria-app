# Roteiro da apresentação e demonstração (N2)

**Responsável:** Marcello Vieira da Silva (card "Preparar demonstração e ensaio"), com toda a equipe

**Tempo total sugerido:** cerca de 15 minutos

O roteiro segue os itens que o professor pediu para a N2: evolução do MVP, funcionalidades, integração com APIs, persistência, autenticação, carregamento e erros, histórico de branches e PRs, testes e correções, refatorações, documentação e demonstração do app.

## Ordem da apresentação

| # | Parte | Quem apresenta | Tempo | O que mostrar |
|---|---|---|---|---|
| 1 | Abertura e evolução do MVP | Marcello | 1 min | Problema da pastelaria, o que era a N1 e o que virou na N2 |
| 2 | Identidade visual e telas do cliente | José Luiz | 2 min | Figma aplicado, categorias reais, barra inferior, carregando e erros |
| 3 | Carrinho, finalização e pedido confirmado | Antonio Neto | 2 min | Carrinho com vários itens, dados do cliente, pagamento e WhatsApp (mock-up) |
| 4 | Banco de dados, API e segurança | Nicolas Rian Oliveira | 2 min | Supabase, RLS, `criar_pedido` (preço vem do banco), consulta segura do pedido |
| 5 | Área do dono | Adrian Rafael | 2 min | Login com e-mail e senha, pedidos, mudança de status e clientes |
| 6 | Demonstração ao vivo | Marcello conduz, cada um explica a sua parte | 4 min | Fluxo completo do cliente e do dono (ver abaixo) |
| 7 | Organização, testes e documentação | Marcello | 2 min | Kanban, branches e PRs, plano de testes, bugs corrigidos, Vercel e documentos |

## Demonstração ao vivo (passo a passo)

Usar o site https://pastelariamiltaoo.vercel.app em uma aba e a área do dono em outra.

1. **Início:** mostrar logo, categorias e "Mais pedidos". Mostrar o nome e a logo na aba do navegador.
2. **Cardápio:** trocar de categoria e mostrar que os 26 produtos vêm do banco.
3. **Produto e carrinho:** adicionar dois produtos diferentes e mudar a quantidade de um deles.
4. **Finalização:** preencher nome e telefone, escolher retirada e Pix, escrever uma observação.
5. **Pedido confirmado:** mostrar o número do pedido, o status "Pedido recebido" e o botão do WhatsApp.
6. **Meus pedidos:** abrir a aba e mostrar o pedido salvo no aparelho.
7. **Área do dono (outra aba):** entrar com e-mail e senha, abrir Pedidos e mudar o status para "Em preparo".
8. **Volta para o cliente:** em até 10 segundos o status muda em "Acompanhar pedido".
9. **Clientes:** mostrar o cliente que acabou de pedir na lista do dono.

## Parte 7: o que mostrar sobre a organização

- **Kanban no PraxiLab:** cards por integrante, com prioridade, datas e colunas até Concluído
- **GitHub:** lista de Pull Requests fechados, um PR aberto mostrando a revisão e o merge com "Create a merge commit"
- **Commits:** `git shortlog` mostrando a contribuição de cada um
- **Testes:** `docs/plano-de-testes.md`, com 18 testes funcionais, 5 de segurança e 9 bugs corrigidos
- **Exemplo de bug real:** tela branca depois do pedido (`voltarInicio`), achado no teste e corrigido no PR #21
- **Refatoração:** remoção de logs que mostravam dados do cliente, arquivos antigos e títulos das telas
- **Documentação:** README, guia de deploy, plano de testes e relatório técnico na pasta `docs`

## Perguntas que o professor pode fazer

| Pergunta | Quem responde | Resposta curta |
|---|---|---|
| Por que o cliente não faz login? | Marcello | Para o pedido ser rápido, como num balcão. Só o dono precisa de login |
| Como o cliente vê o próprio pedido sem login? | Nicolas | O app guarda o número do pedido no aparelho e o banco só mostra o pedido com o número e o telefone certos |
| O cliente pode mudar o preço? | Nicolas | Não. O banco calcula o total com o preço cadastrado |
| Como o status atualiza? | José Luiz | A tela consulta o banco a cada 10 segundos |
| Como funciona o carrinho? | Antonio | Um contexto compartilhado guarda os itens entre as telas |
| Como o dono muda o status? | Adrian | Na tela de pedidos do painel, que só abre depois do login |
| Como o código chega ao site? | Marcello | Cada merge na `main` faz o Vercel publicar a versão nova sozinho |
| O que faltou? | Marcello | Pagamento e WhatsApp reais, histórico do cliente em outro aparelho e atualização em tempo real |

## Antes de apresentar

1. Entrar no Supabase e conferir se o projeto não está pausado (se estiver, clicar em **Resume project**).
2. Abrir o site e conferir se o cardápio carrega.
3. Deixar o e-mail e a senha do dono anotados.
4. Deixar abertas as abas: site, área do dono, Kanban, lista de PRs no GitHub e pasta `docs`.
5. Fazer um ensaio completo com a equipe, cronometrando o tempo.

## Plano B

- **Internet ou site fora do ar:** rodar no computador com `npx expo start -c` e apertar **w**.
- **Banco pausado e sem tempo para reativar:** mostrar prints do fluxo e explicar o funcionamento.
- **Alguém faltar:** o líder apresenta a parte dessa pessoa, usando este roteiro.