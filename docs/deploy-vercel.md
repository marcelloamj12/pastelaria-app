# Deploy no Vercel (versão web)

Este guia explica como a versão web do aplicativo **Salgados do Miltão** foi colocada no ar.

**Link do site:** https://pastelariamiltaoo.vercel.app

**Responsável:** Marcello Vieira da Silva (card "Colocar o app no ar na Vercel")

## Como funciona

O Expo transforma o aplicativo React Native em um site com o comando `npx expo export --platform web`. Esse comando gera a pasta `dist`, e o Vercel publica essa pasta na internet.

O Vercel está ligado ao repositório do GitHub. **Toda vez que um PR é aceito na branch `main`, o site é atualizado sozinho.**

## Configuração usada no Vercel

| Campo | Valor |
|---|---|
| Repositório | `marcelloamj12/pastelaria-app` |
| Branch | `main` |
| Application Preset | Other |
| Root Directory | `./` |
| Build Command | `npx expo export --platform web` |
| Output Directory | `dist` |
| Install Command | padrão (desligado) |

## Variáveis de ambiente

O aplicativo precisa de duas variáveis para falar com o banco de dados (Supabase). Elas são cadastradas no Vercel em **Settings > Environment Variables**, e não ficam no código.

| Nome | O que é |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Endereço do projeto no Supabase |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Chave pública (publishable/anon) do Supabase |

Cuidados:
- Usar somente a chave **pública**. Nunca usar a chave secreta (secret/service_role).
- O arquivo `.env` com essas chaves **não vai para o GitHub** (está no `.gitignore`).
- A segurança dos dados é feita pelas regras de RLS no banco, e não por esconder a chave pública.

## Domínio

- O endereço padrão gerado pelo Vercel foi trocado para `pastelariamiltaoo.vercel.app`, em **Settings > Domains > Edit**.
- O endereço antigo foi removido.

## Como fazer um novo deploy

1. Fazer o merge de um PR na `main`. O Vercel faz o deploy sozinho em cerca de 1 minuto.
2. Para refazer manualmente: abrir o projeto no Vercel, ir em **Deployments**, clicar nos três pontinhos do último deploy e escolher **Redeploy**.

## Problemas encontrados

| Problema | Causa | Solução |
| Variáveis cadastradas trocadas | Endereço colado no campo do nome | Digitar o nome em **Key** e o valor em **Value** |
| Erro `Unable to resolve "expo-navigation-bar"` | Biblioteca usada no código, mas não instalada | Instalada com `npx expo install expo-navigation-bar` |
| Cardápio vazio no site | Projeto do Supabase pausado (plano gratuito) | Entrar no Supabase e clicar em **Resume project** |

## Antes da apresentação

- [ ] Abrir o Supabase e conferir se o projeto não está pausado.
- [ ] Abrir o site e conferir se o cardápio carrega.
- [ ] Fazer um pedido de teste e conferir em "Meus pedidos".