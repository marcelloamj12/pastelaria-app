<p align="center">
  <img src="logo.png" alt="Salgados do Miltão" width="320">
</p>

# Pastelaria Miltão Mobile Online 🥟

App mobile de cardápio digital e pedidos online para a pastelaria **Salgados do Miltão**, desenvolvido em React Native + Expo como projeto acadêmico da disciplina de Desenvolvimento Mobile.

O cliente vê o cardápio por categorias, escolhe um produto, monta o pedido e finaliza, sem precisar de cardápio de papel nem de atendimento no balcão.

O projeto está dividido em duas etapas:

- **N1 (MVP):** fluxo navegável do pedido: Home → Cardápio → Produto → Carrinho → Finalização → Pedido confirmado
- **N2:** login e cadastro, acompanhamento do pedido em tempo real, painel da loja e fotos dos produtos

## 🚀 Tecnologias

- **App:** React Native + Expo, React Navigation
- **Banco de dados e API:** Supabase (PostgreSQL)
- **Organização:** GitHub, PraxiLab (Kanban) e Figma (protótipo)

## 🧱 Arquitetura

As telas nunca falam direto com o banco de dados. Elas chamam funções da pasta `services`, e só essa pasta conversa com o Supabase. Assim, se o banco mudar um dia, nenhuma tela precisa ser alterada.

```
Tela  →  Serviço  →  Supabase  →  Banco PostgreSQL
```

O banco tem 5 tabelas (categorias, produtos, clientes, pedidos e itens do pedido), 19 produtos em 5 categorias e segurança (RLS) ativa em todas as tabelas. O total do pedido é calculado pelo banco, e o preço sempre vem do banco, nunca do celular. Foram feitos 8 testes no banco e todos passaram. Detalhes em [`banco-de-dados/README.md`](banco-de-dados/README.md).

## 🎨 Identidade visual

Baseada na comunicação que o Salgados do Miltão já usa, adaptada para uma interface digital simples e moderna.

| Cor | Hex | Uso |
| --- | --- | --- |
| Vermelho | `#D62828` | Cor primária: botões, cabeçalho e preços |
| Amarelo | `#F6C445` | Cor secundária: banners e apoio |
| Creme | `#FFFDF8` | Fundo das telas |
| Cinza claro | `#F5F5F5` | Cards e campos |
| Preto / cinza | `#202020` / `#666666` | Textos |

Tipografia: **Inter**. Protótipo com 7 telas no [Figma](https://www.figma.com/design/zRK5f5dt2VPuaxXGSWmnfj/Sem-t%C3%ADtulo).

## 📁 Estrutura do projeto

```
src/
├── navigation/   # navegação entre as telas
├── screens/      # telas do app (Home, Cardápio, Produto, Carrinho...)
├── services/     # comunicação com o banco (cardapioService, pedidoService)
├── hooks/        # lógica reutilizável (useCardapio)
└── lib/          # configuração do Supabase
banco-de-dados/   # scripts SQL, diagrama ER e documentação do banco
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

4. Copie o arquivo `.env.example` para `.env` e preencha com a URL e a chave pública (anon) do Supabase
5. Inicie o app e escaneie o QR Code com o Expo Go:

```
npx expo start -c
```

> O arquivo `.env` não vai para o GitHub de propósito, porque guarda as credenciais do banco. Sem ele o app mostra o erro "Faltam as variáveis EXPO_PUBLIC_SUPABASE_URL...".

## 👥 Equipe

| Integrante | Responsabilidade |
| ---------- | ---------------- |
| Marcello Vieira da Silva (líder) | Coordenação, Kanban, GitHub, arquitetura, revisão de código e apresentação |
| José Luiz | Figma, identidade visual e telas Home, Cardápio e Produto |
| Adrian Rafael | Supabase, banco de dados, serviços e integração |
| Antonio Neto | Carrinho, pedidos, fluxo de compra e testes de usabilidade |
| Nicolas Rian Oliveira | Banco de dados (com o Adrian): preços reais, testes e segurança |

## 📋 Gerenciamento do projeto

O andamento é acompanhado em um Kanban (PraxiLab) com checklists por tarefa. No Git, cada funcionalidade tem sua branch, depois abre um Pull Request, o líder revisa e só então faz o merge na `main`.

## ⚠️ Limitações atuais

- O carrinho aceita um produto por vez
- O banco tem 19 produtos e preços estimados; o cardápio real da pastelaria tem 26 produtos e a atualização está planejada para a N2
- As categorias do Figma (com "Combos") ainda não batem com as do cardápio real (Pastéis Sabores, Especiais, Doces, Salgados e Bebidas)
- As cores e a fonte do Figma ainda não foram aplicadas nas telas

## 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais.
