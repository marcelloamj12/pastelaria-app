-- =====================================================================
--  PASTELARIA MILTÃO — CARDÁPIO DIGITAL
--  02_rls.sql — Row Level Security (segurança das tabelas)
--
--  POR QUE ISSO EXISTE:
--  A chave que fica dentro do app (anon key) é pública — qualquer pessoa
--  que instale o APK consegue lê-la. Quem protege os dados no Supabase
--  não é a chave, é a RLS. Sem RLS ligada, qualquer um com a anon key
--  poderia apagar o cardápio inteiro.
--
--  Rode depois do 01_schema.sql.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. LIGAR RLS EM TODAS AS TABELAS
--    Com RLS ligada e nenhuma policy, o padrão é NEGAR TUDO.
--    Depois liberamos só o necessário.
-- ---------------------------------------------------------------------
alter table categorias   enable row level security;
alter table produtos     enable row level security;
alter table clientes     enable row level security;
alter table pedidos      enable row level security;
alter table itens_pedido enable row level security;

-- A view respeita a RLS de quem consulta, e não a do dono da view.
alter view vw_cardapio set (security_invoker = on);


-- ---------------------------------------------------------------------
-- 2. CATÁLOGO — leitura pública, escrita bloqueada
--    O cardápio é público por natureza (é uma vitrine).
--    Não criamos policy de INSERT/UPDATE/DELETE: cadastrar produto é
--    feito pelo painel do Supabase (service_role), que ignora a RLS.
-- ---------------------------------------------------------------------
drop policy if exists "categorias: leitura publica" on categorias;
create policy "categorias: leitura publica"
  on categorias for select
  to anon, authenticated
  using (ativo);

drop policy if exists "produtos: leitura publica" on produtos;
create policy "produtos: leitura publica"
  on produtos for select
  to anon, authenticated
  using (disponivel);


-- ---------------------------------------------------------------------
-- 3. PEDIDOS — MODO N1 (demonstração, sem login)
--
--    ATENÇÃO, ADRIAN: estas policies são propositalmente permissivas
--    porque na N1 o app ainda não tem autenticação. Elas permitem que
--    um cliente anônimo crie e leia pedidos.
--    Isso é aceitável em ambiente de estudo e é EXATAMENTE o tipo de
--    trade-off que vale explicar na apresentação: "abrimos por não ter
--    login na N1 e já deixamos escrita a versão fechada da N2".
--    NÃO leve isso para um app de verdade.
-- ---------------------------------------------------------------------
drop policy if exists "clientes: N1 demo" on clientes;
create policy "clientes: N1 demo"
  on clientes for all
  to anon, authenticated
  using (true) with check (true);

drop policy if exists "pedidos: N1 demo" on pedidos;
create policy "pedidos: N1 demo"
  on pedidos for all
  to anon, authenticated
  using (true) with check (true);

drop policy if exists "itens: N1 demo" on itens_pedido;
create policy "itens: N1 demo"
  on itens_pedido for all
  to anon, authenticated
  using (true) with check (true);


-- ---------------------------------------------------------------------
-- 4. PEDIDOS — MODO N2 (com Supabase Auth)
--    Quando o login entrar no escopo, APAGUE as policies "N1 demo"
--    acima e descomente o bloco abaixo. Cada cliente passa a enxergar
--    somente os próprios pedidos.
-- ---------------------------------------------------------------------
/*
drop policy if exists "clientes: N1 demo" on clientes;
drop policy if exists "pedidos: N1 demo"  on pedidos;
drop policy if exists "itens: N1 demo"    on itens_pedido;

-- o cliente só enxerga e edita a própria ficha
create policy "clientes: dono le" on clientes for select
  to authenticated using (auth_user_id = auth.uid());
create policy "clientes: dono cria" on clientes for insert
  to authenticated with check (auth_user_id = auth.uid());
create policy "clientes: dono atualiza" on clientes for update
  to authenticated using (auth_user_id = auth.uid());

-- o cliente só enxerga os próprios pedidos
create policy "pedidos: dono le" on pedidos for select
  to authenticated using (
    cliente_id in (select id from clientes where auth_user_id = auth.uid())
  );
create policy "pedidos: dono cria" on pedidos for insert
  to authenticated with check (
    cliente_id in (select id from clientes where auth_user_id = auth.uid())
  );

-- itens seguem o pedido a que pertencem
create policy "itens: dono le" on itens_pedido for select
  to authenticated using (
    pedido_id in (
      select p.id from pedidos p
      join clientes c on c.id = p.cliente_id
      where c.auth_user_id = auth.uid()
    )
  );
create policy "itens: dono cria" on itens_pedido for insert
  to authenticated with check (
    pedido_id in (
      select p.id from pedidos p
      join clientes c on c.id = p.cliente_id
      where c.auth_user_id = auth.uid()
    )
  );
*/


-- =====================================================================
-- FIM DO 02_rls.sql — rode agora o 03_seed.sql
-- =====================================================================
