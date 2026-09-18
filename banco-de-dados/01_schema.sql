-- =====================================================================
--  PASTELARIA MILTÃO — CARDÁPIO DIGITAL
--  01_schema.sql — Estrutura do banco (DDL)
--
--  Projeto: Desenvolvimento para Dispositivos Móveis (SI)
--  Responsável: Adrian Rafa — Back-end e Dados
--  Banco: PostgreSQL 15 (Supabase)
--
--  Como usar: Supabase > SQL Editor > New query > cole tudo > Run.
--  Rode os arquivos NESTA ORDEM: 01_schema > 02_rls > 03_seed > 04_rpc
-- =====================================================================


-- ---------------------------------------------------------------------
-- 0. EXTENSÕES
-- ---------------------------------------------------------------------
-- gen_random_uuid() vem da pgcrypto. No Supabase já vem habilitada,
-- mas deixamos explícito para o script rodar em qualquer Postgres.
create extension if not exists pgcrypto;


-- ---------------------------------------------------------------------
-- 1. TIPOS ENUMERADOS
--    Usamos ENUM em vez de texto livre para o banco garantir que um
--    pedido nunca receba um status inválido (ex.: 'em preparoo').
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'status_pedido') then
    create type status_pedido as enum (
      'recebido',      -- pedido criado pelo app, aguardando a pastelaria aceitar
      'em_preparo',    -- na chapa
      'pronto',        -- pronto para retirada / aguardando entregador
      'saiu_entrega',  -- a caminho do cliente
      'entregue',      -- finalizado com sucesso
      'cancelado'      -- cancelado pelo cliente ou pela loja
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'tipo_entrega') then
    create type tipo_entrega as enum ('entrega', 'retirada');
  end if;

  if not exists (select 1 from pg_type where typname = 'forma_pagamento') then
    create type forma_pagamento as enum ('dinheiro', 'pix', 'cartao_credito', 'cartao_debito');
  end if;
end $$;


-- ---------------------------------------------------------------------
-- 2. FUNÇÃO DE APOIO: atualiza automaticamente a coluna atualizado_em
-- ---------------------------------------------------------------------
create or replace function set_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;


-- ---------------------------------------------------------------------
-- 3. TABELA: categorias
--    Abas do cardápio: Pastéis, Especiais, Doces, Salgados, Bebidas.
-- ---------------------------------------------------------------------
create table if not exists categorias (
  id           uuid primary key default gen_random_uuid(),
  nome         text        not null,
  slug         text        not null unique,   -- identificador estável usado no app
  ordem        smallint    not null default 0, -- controla a ordem das abas na tela
  ativo        boolean     not null default true,
  criado_em    timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  constraint categorias_nome_nao_vazio check (length(trim(nome)) > 0)
);

comment on table  categorias        is 'Categorias do cardápio (abas da tela Cardápio).';
comment on column categorias.slug   is 'Identificador textual estável (ex.: pasteis). O app filtra por ele.';
comment on column categorias.ordem  is 'Ordem de exibição das abas. Menor aparece primeiro.';
comment on column categorias.ativo  is 'Soft delete: categoria escondida do app sem apagar o histórico.';

create trigger trg_categorias_atualizado_em
  before update on categorias
  for each row execute function set_atualizado_em();


-- ---------------------------------------------------------------------
-- 4. TABELA: produtos
--    Cada item do cardápio. Relacionamento 1:N com categorias.
-- ---------------------------------------------------------------------
create table if not exists produtos (
  id           uuid primary key default gen_random_uuid(),
  categoria_id uuid        not null references categorias(id) on delete restrict,
  nome         text        not null,
  descricao    text,
  preco        numeric(10,2) not null,
  imagem_url   text,
  disponivel   boolean     not null default true,  -- "acabou o frango hoje"
  destaque     boolean     not null default false, -- aparece na Home
  ordem        smallint    not null default 0,
  criado_em    timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  constraint produtos_preco_positivo  check (preco >= 0),
  constraint produtos_nome_nao_vazio  check (length(trim(nome)) > 0),
  constraint produtos_nome_unico_por_categoria unique (categoria_id, nome)
);

comment on table  produtos            is 'Itens do cardápio da pastelaria.';
comment on column produtos.preco      is 'numeric(10,2): dinheiro NUNCA em float, para não haver erro de arredondamento.';
comment on column produtos.disponivel is 'Falso esconde o item do app sem apagar o produto nem quebrar pedidos antigos.';
comment on column produtos.destaque   is 'Marca o item que aparece em destaque na Home (ex.: X-Tudão do Miltão).';

-- on delete restrict: impede apagar uma categoria que ainda tem produtos.
-- É proposital: evita produto órfão.

create index if not exists idx_produtos_categoria      on produtos (categoria_id);
create index if not exists idx_produtos_listagem       on produtos (categoria_id, ordem) where disponivel;
create index if not exists idx_produtos_destaque       on produtos (destaque) where destaque;

create trigger trg_produtos_atualizado_em
  before update on produtos
  for each row execute function set_atualizado_em();


-- ---------------------------------------------------------------------
-- 5. TABELA: clientes
--    Na N1 o app cria o cliente na finalização do pedido (sem login).
--    A coluna auth_user_id já deixa o caminho pronto para o Supabase Auth
--    entrar depois sem precisar refazer a modelagem.
-- ---------------------------------------------------------------------
create table if not exists clientes (
  id           uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  nome         text        not null,
  telefone     text        not null,
  email        text,
  criado_em    timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  constraint clientes_nome_nao_vazio check (length(trim(nome)) > 0),
  constraint clientes_telefone_valido check (length(regexp_replace(telefone, '\D', '', 'g')) between 10 and 11)
);

comment on table  clientes              is 'Quem faz o pedido. Sem login na N1; pronto para Supabase Auth depois.';
comment on column clientes.auth_user_id is 'Ligação futura com auth.users. Nulo enquanto não houver login.';

create index if not exists idx_clientes_telefone on clientes (telefone);

create trigger trg_clientes_atualizado_em
  before update on clientes
  for each row execute function set_atualizado_em();


-- ---------------------------------------------------------------------
-- 6. TABELA: pedidos
--    Cabeçalho do pedido. Os valores são gravados como snapshot:
--    se o preço do pastel mudar amanhã, o pedido de hoje continua correto.
-- ---------------------------------------------------------------------
create table if not exists pedidos (
  id               uuid primary key default gen_random_uuid(),
  numero           bigint generated always as identity, -- número curto para o cliente ("Pedido #1042")
  cliente_id       uuid not null references clientes(id) on delete restrict,
  status           status_pedido   not null default 'recebido',
  tipo             tipo_entrega    not null default 'entrega',
  pagamento        forma_pagamento not null default 'pix',

  subtotal         numeric(10,2) not null default 0,
  taxa_entrega     numeric(10,2) not null default 0,
  total            numeric(10,2) generated always as (subtotal + taxa_entrega) stored,

  endereco_entrega text,          -- snapshot do endereço no momento do pedido
  observacoes      text,          -- "interfone quebrado", "sem cebola no geral"
  criado_em        timestamptz not null default now(),
  atualizado_em    timestamptz not null default now(),

  constraint pedidos_subtotal_positivo check (subtotal >= 0),
  constraint pedidos_taxa_positiva     check (taxa_entrega >= 0),
  -- se for entrega, o endereço é obrigatório; se for retirada, não
  constraint pedidos_endereco_obrigatorio_na_entrega check (
    tipo = 'retirada' or (endereco_entrega is not null and length(trim(endereco_entrega)) > 0)
  )
);

comment on table  pedidos                  is 'Cabeçalho do pedido (a "capa" da comanda).';
comment on column pedidos.numero           is 'Sequência curta e legível para o cliente. O id continua sendo o uuid.';
comment on column pedidos.total            is 'Coluna gerada: subtotal + taxa. O banco calcula, o app não erra a conta.';
comment on column pedidos.endereco_entrega is 'Texto congelado no momento do pedido, não uma FK: se o cliente mudar de casa, o pedido antigo continua verdadeiro.';

create index if not exists idx_pedidos_cliente on pedidos (cliente_id);
create index if not exists idx_pedidos_status  on pedidos (status, criado_em desc);
create index if not exists idx_pedidos_data    on pedidos (criado_em desc);

create trigger trg_pedidos_atualizado_em
  before update on pedidos
  for each row execute function set_atualizado_em();


-- ---------------------------------------------------------------------
-- 7. TABELA: itens_pedido
--    Tabela associativa que resolve o N:N entre pedidos e produtos,
--    guardando também os dados próprios da relação (quantidade, preço,
--    observação do item).
-- ---------------------------------------------------------------------
create table if not exists itens_pedido (
  id             uuid primary key default gen_random_uuid(),
  pedido_id      uuid     not null references pedidos(id)  on delete cascade,
  produto_id     uuid     not null references produtos(id) on delete restrict,
  quantidade     smallint not null default 1,
  preco_unitario numeric(10,2) not null,  -- SNAPSHOT do preço no momento do pedido
  nome_produto   text          not null,  -- SNAPSHOT do nome no momento do pedido
  observacao     text,                    -- "sem cebola", "bem passado"
  subtotal       numeric(10,2) generated always as (quantidade * preco_unitario) stored,
  criado_em      timestamptz not null default now(),

  constraint itens_quantidade_valida check (quantidade > 0 and quantidade <= 99),
  constraint itens_preco_positivo    check (preco_unitario >= 0)
);

comment on table  itens_pedido                is 'Linhas do pedido. Resolve o N:N entre pedidos e produtos.';
comment on column itens_pedido.preco_unitario is 'Preço congelado. Se o pastel subir para R$ 8,00 amanhã, o pedido de hoje continua R$ 7,00.';
comment on column itens_pedido.nome_produto   is 'Nome congelado, para o histórico continuar legível se o produto for renomeado.';
comment on column itens_pedido.subtotal       is 'Coluna gerada: quantidade * preco_unitario.';

-- on delete cascade: apagar um pedido apaga seus itens (não fazem sentido sozinhos).
-- on delete restrict no produto: não deixa apagar um produto que já foi vendido.

create index if not exists idx_itens_pedido  on itens_pedido (pedido_id);
create index if not exists idx_itens_produto on itens_pedido (produto_id);


-- ---------------------------------------------------------------------
-- 8. TRIGGER: recalcula o subtotal do pedido sempre que um item muda
--    Assim o app nunca precisa somar nada: o banco é a fonte da verdade.
-- ---------------------------------------------------------------------
create or replace function recalcular_subtotal_pedido()
returns trigger
language plpgsql
as $$
declare
  v_pedido_id uuid := coalesce(new.pedido_id, old.pedido_id);
begin
  update pedidos
     set subtotal = coalesce((
           select sum(subtotal) from itens_pedido where pedido_id = v_pedido_id
         ), 0)
   where id = v_pedido_id;
  return null;
end;
$$;

drop trigger if exists trg_itens_recalcula_subtotal on itens_pedido;
create trigger trg_itens_recalcula_subtotal
  after insert or update or delete on itens_pedido
  for each row execute function recalcular_subtotal_pedido();


-- ---------------------------------------------------------------------
-- 9. VIEW: vw_cardapio
--    Entrega o cardápio já pronto para a tela, com o nome da categoria
--    junto. O front consome uma coisa só em vez de fazer o join na mão.
-- ---------------------------------------------------------------------
create or replace view vw_cardapio as
select
  p.id,
  p.nome,
  p.descricao,
  p.preco,
  p.imagem_url,
  p.destaque,
  p.ordem,
  c.id   as categoria_id,
  c.nome as categoria_nome,
  c.slug as categoria_slug,
  c.ordem as categoria_ordem
from produtos p
join categorias c on c.id = p.categoria_id
where p.disponivel and c.ativo
order by c.ordem, p.ordem, p.nome;

comment on view vw_cardapio is 'Cardápio pronto para a tela: só itens disponíveis, já com a categoria e na ordem certa.';


-- =====================================================================
-- FIM DO 01_schema.sql — rode agora o 02_rls.sql
-- =====================================================================
