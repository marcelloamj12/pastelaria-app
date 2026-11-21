# Plano de testes e bugs encontrados (N2)

**Responsável:** Marcello Vieira da Silva, com apoio de toda a equipe (card "Plano de testes e caça aos bugs")

**Onde foi testado:**

- Computador, rodando o app com `npx expo start -c` e abrindo no navegador (tecla **w**)
- Versão web publicada: https://pastelariamiltaoo.vercel.app
- Banco de dados real no Supabase (cardápio com 26 produtos)

## Como os testes foram feitos

1. A cada Pull Request aceito na `main`, o líder baixava a versão nova (`git pull origin main`) e rodava o app.
2. Fazia o caminho completo de um cliente, do cardápio até o pedido confirmado.
3. Quando algo dava errado, tirava print do erro, descobria qual tela ou PR tinha causado e avisava o integrante responsável.
4. Depois da correção, o teste era repetido para confirmar.

## Testes funcionais

Legenda: ✅ passou

| # | O que foi testado | Como testar | Resultado esperado | Status |
|---|---|---|---|---|
| T1 | Abrir o app | Abrir o site ou o Expo | Tela Início com logo, categorias e "Mais pedidos" | ✅ |
| T2 | Cardápio | Clicar em "Ver Cardápio Completo" e trocar de categoria | Produtos de cada categoria com foto e preço | ✅ |
| T3 | Produto | Clicar em um produto | Detalhes do produto e botão de adicionar | ✅ |
| T4 | Carrinho com vários produtos | Adicionar produtos diferentes e mudar quantidades | Total muda certo e o número aparece no ícone do carrinho | ✅ |
| T5 | Finalização | Preencher nome, telefone, tipo, pagamento e observação | Resumo com os itens e o total estimado | ✅ |
| T6 | Gravar o pedido | Clicar em "Confirmar Pedido" | Pedido salvo no banco com número (testes: #68 e #69) | ✅ |
| T7 | Pedido confirmado | Ver a tela depois de confirmar | Número, status "Pedido recebido" e total | ✅ |
| T8 | Voltar ao início | Clicar em "Voltar ao Início" | Volta para a tela Início sem tela branca | ✅ |
| T9 | WhatsApp (mock-up) | Clicar em "Enviar pedido pelo WhatsApp" | Abre o WhatsApp com o resumo do pedido | ✅ |
| T10 | Meus pedidos | Abrir a aba "Meus pedidos" depois de fazer pedidos | Lista os pedidos feitos neste aparelho | ✅ |
| T11 | Acompanhar pedido | Abrir um pedido da lista | Mostra o status e atualiza a cada 10 segundos | ✅ |
| T12 | Login do admin | Clicar em "Área do dono" e entrar com e-mail e senha | Abre o painel administrativo | ✅ |
| T13 | Pedidos do admin | No painel, abrir pedidos e mudar o status | O status muda e o cliente vê a mudança no acompanhamento | ✅ |
| T14 | Clientes do admin | No painel, abrir clientes | Lista os clientes que fizeram pedidos | ✅ |
| T15 | Título da aba | Navegar entre as telas no navegador | Aba mostra "Nome da tela \| Salgados do Miltão" com acento | ✅ |
| T16 | Ícone da aba | Abrir o site | Aparece a logo do mascote | ✅ |
| T17 | Erros no navegador | Apertar F12, aba Console, e recarregar | Nenhum erro vermelho | ✅ |
| T18 | Site no Vercel | Abrir https://pastelariamiltaoo.vercel.app | Mesmo comportamento da versão local | ✅ |

## Testes de segurança

| # | O que foi testado | Resultado esperado | Status |
|---|---|---|---|
| S1 | Cliente sem login tentar listar pedidos de outras pessoas | Bloqueado pelo banco (erro 401 / permission denied) | ✅ |
| S2 | Cliente consultar o próprio pedido | Só funciona com o número do pedido e o telefone certo | ✅ |
| S3 | Preço alterado no celular | O banco ignora e usa o preço cadastrado | ✅ |
| S4 | Dados do cliente aparecendo no console do navegador | Nenhum dado pessoal no console | ✅ (corrigido, ver B7) |
| S5 | Chave secreta do Supabase no código | Só a chave pública é usada, e o `.env` não vai para o GitHub | ✅ |

## Bugs encontrados e corrigidos

| # | Bug | Como foi encontrado | Causa | Correção | Status |
|---|---|---|---|---|---|
| B1 | Tela branca depois de finalizar o pedido (`voltarInicio is not defined`) | Pedido completo rodando o app no computador | A função foi apagada sem querer ao resolver um conflito de merge | PR #21 (José Luiz) | ✅ |
| B2 | "Meus pedidos" com erro 401 | Abrindo a aba depois de fazer um pedido | A tela usava uma função do banco liberada só para o admin | PR #22 (José Luiz), usando o histórico salvo no aparelho (Nicolas) | ✅ |
| B3 | Erro "Unable to resolve expo-navigation-bar" | Rodando o app depois de um `git pull` | Biblioteca usada no código, mas não instalada no `package.json` | Instalação da biblioteca (Antonio) | ✅ |
| B4 | Pull Requests apontando para a branch errada | Revisão dos PRs #15, #16 e #19 | A base do PR não era a `main` | Cada autor trocou a base para a `main` | ✅ |
| B5 | Conflitos de merge | Revisão dos PRs #8 e #23 | Duas pessoas mexeram no mesmo arquivo | Os autores atualizaram a branch e resolveram (Nicolas e Antonio) | ✅ |
| B6 | Variáveis do Vercel cadastradas trocadas | Configurando o deploy | O endereço foi colado no campo do nome | Nomes digitados em "Key" e valores em "Value" (Marcello) | ✅ |
| B7 | Dados do pedido (nome e telefone) aparecendo no console do navegador | Teste com F12 na tela de pedido confirmado | `console.log` de teste esquecido no código | Linhas removidas (Marcello) | ✅ |
| B8 | Aba do navegador mostrando "Finalizacao" e "PedidoConfirmado" | Navegando pelo site | As telas não tinham título configurado | Títulos com acento no `AppNavigator.js` (Marcello) | ✅ |
| B9 | Cópias antigas de telas soltas no projeto | Revisão dos arquivos da raiz | Arquivos `.txt` de backup esquecidos | Arquivos removidos (Marcello) | ✅ |

