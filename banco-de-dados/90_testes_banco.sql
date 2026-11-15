-- =====================================================================
-- PASTELARIA MILTÃO — CARDÁPIO DIGITAL
-- 90_testes_banco.sql — Testes automatizados do banco
--
-- Projeto: Desenvolvimento para Dispositivos Móveis (SI)
-- Responsável: Adrian Rafa — Back-end e Dados
-- Cartão: Testes do banco (26 produtos)
--
-- NÃO FAZ PARTE DA MONTAGEM DO BANCO.
-- Os arquivos 01 a 05 montam o banco. Este aqui só CONFERE se o que
-- foi montado está certo. Por isso o número 90: ele roda por último e
-- é opcional. Pode rodar quantas vezes quiser.
--
-- O QUE ELE TESTA, em quatro blocos:
--   A. CATÁLOGO   — os 26 itens, as categorias, os preços
--   B. PEDIDO     — a criar_pedido(), o preço congelado, os cálculos
--   C. SEGURANÇA  — a RLS está mesmo protegendo as tabelas?
--   D. LIMPEZA    — o teste não deixou sujeira no banco?
--
-- O bloco B cria um pedido de teste e o bloco D APAGA esse pedido.
-- Nada de teste fica no banco. O cliente de teste usa o telefone
-- (69) 90000-0000, que é o que a limpeza procura para apagar.
--
-- Como usar: Supabase > SQL Editor > New query > cole tudo > Run.
-- O resultado é uma tabela com uma linha por teste e a coluna STATUS.
-- Se alguma linha vier FALHOU, o banco não está como deveria.
--
-- Última execução: 14/11/2026 — 24 testes, 24 OK.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tabela temporária onde cada teste anota o que esperava e o que obteve.
-- Temporária = existe só nesta conexão e some sozinha no fim.
-- Por isso o relatório precisa sair na MESMA execução.
-- ---------------------------------------------------------------------
drop table if exists _resultado;
create temp table _resultado (
  n        smallint,
  bloco    text,
  teste    text,
  esperado text,
  obtido   text
);

-- =====================================================================
-- BLOCO A — CATÁLOGO
-- =====================================================================

-- A1. O cardápio tem os 26 itens do cardápio de papel.
insert into _resultado
select 1, 'A. Catálogo', 'Total de itens visíveis no cardápio',
       '26', count(*)::text
from vw_cardapio;

-- A2. A distribuição por categoria bate com a foto do cardápio.
insert into _resultado
select 2, 'A. Catálogo', 'Itens por categoria',
       'Pastéis=6 Especiais=5 Salgados=8 Doces=3 Bebidas=4',
       string_agg(nome || '=' || qtd, ' ' order by ord)
from (
  select categoria_nome as nome, categoria_ordem as ord, count(*)::text as qtd
  from vw_cardapio
  group by categoria_nome, categoria_ordem
) t;

-- A3. Dinheiro nunca pode ser zero ou negativo.
insert into _resultado
select 3, 'A. Catálogo', 'Produtos com preço inválido (<= 0)',
       '0', count(*)::text
from vw_cardapio where preco <= 0;

-- A4. A chave única (categoria_id, nome) impede item repetido.
--     Se este teste falhar, a constraint foi removida.
insert into _resultado
select 4, 'A. Catálogo', 'Nomes repetidos dentro da mesma categoria',
       '0', coalesce(count(*)::text, '0')
from (
  select categoria_id, nome
  from produtos
  group by categoria_id, nome
  having count(*) > 1
) t;

-- A5. Os 3 itens que não existem na pastelaria continuam escondidos.
--     Eles NÃO foram apagados de propósito (histórico de pedidos).
insert into _resultado
select 5, 'A. Catálogo', 'Itens escondidos (disponivel = false)',
       '3', count(*)::text
from produtos where not disponivel;

-- A6. Nenhum item escondido pode vazar para a tela.
insert into _resultado
select 6, 'A. Catálogo', 'Item escondido aparecendo na vw_cardapio',
       '0', count(*)::text
from vw_cardapio v
join produtos p on p.id = v.id
where not p.disponivel;

-- A7. O X-Tudão é o item em destaque da Home e custa R$ 12,00.
insert into _resultado
select 7, 'A. Catálogo', 'X-Tudão do Miltão em destaque e com preço certo',
       'destaque=true preco=12.00',
       coalesce('destaque=' || destaque::text || ' preco=' || preco::text, 'nao encontrado')
from produtos where nome = 'X-Tudão do Miltão';

-- =====================================================================
-- BLOCO B — PEDIDO
--
-- Aqui está a regra mais importante do banco: o app manda só o id do
-- produto e a quantidade, e QUEM LÊ O PREÇO É O BANCO. Os testes B2 e
-- B3 são os que provam isso.
-- =====================================================================

do $$
declare
  v_itens          jsonb;
  v_pedido         record;
  v_soma_itens     numeric;
  v_subtotal       numeric;
  v_taxa           numeric;
  v_total          numeric;
  v_status         text;
  v_precos_batem   boolean;
  v_nomes_batem    boolean;
  v_qtd_itens      int;
  v_msg            text;
begin
  -- Monta um carrinho com 2 produtos reais, 2 unidades de cada.
  select jsonb_agg(jsonb_build_object('produto_id', id, 'quantidade', 2))
    into v_itens
    from (select id from produtos where disponivel order by nome limit 2) t;

  -- ----- B1. O pedido é criado e volta com número, total e status ----
  select * into v_pedido
    from criar_pedido(
      'TESTE AUTOMATIZADO',
      '(69) 90000-0000',
      v_itens,
      'entrega', 'pix',
      'Rua de Teste, 100',
      'pedido gerado pelo 90_testes_banco.sql',
      5.00
    );

  insert into _resultado values (
    8, 'B. Pedido', 'criar_pedido() devolve um pedido com número',
    'pedido criado',
    case when v_pedido.pedido_id is not null and v_pedido.numero is not null
         then 'pedido criado' else 'falhou' end
  );

  -- ----- B2. O preço gravado veio da tabela, não do app --------------
  select bool_and(i.preco_unitario = p.preco), count(*)
    into v_precos_batem, v_qtd_itens
    from itens_pedido i
    join produtos p on p.id = i.produto_id
   where i.pedido_id = v_pedido.pedido_id;

  insert into _resultado values (
    9, 'B. Pedido', 'Preço do item = preço da tabela produtos',
    'true', coalesce(v_precos_batem::text, 'sem itens')
  );

  -- ----- B3. O nome do produto também fica congelado ----------------
  select bool_and(i.nome_produto = p.nome)
    into v_nomes_batem
    from itens_pedido i
    join produtos p on p.id = i.produto_id
   where i.pedido_id = v_pedido.pedido_id;

  insert into _resultado values (
    10, 'B. Pedido', 'Nome do produto congelado no item',
    'true', coalesce(v_nomes_batem::text, 'sem itens')
  );

  -- ----- B4. Todos os itens do carrinho entraram --------------------
  insert into _resultado values (
    11, 'B. Pedido', 'Quantidade de itens gravados',
    jsonb_array_length(v_itens)::text, v_qtd_itens::text
  );

  -- ----- B5. O trigger recalculou o subtotal do pedido --------------
  select sum(i.subtotal) into v_soma_itens
    from itens_pedido i where i.pedido_id = v_pedido.pedido_id;

  select p.subtotal, p.taxa_entrega, p.total, p.status::text
    into v_subtotal, v_taxa, v_total, v_status
    from pedidos p where p.id = v_pedido.pedido_id;

  insert into _resultado values (
    12, 'B. Pedido', 'Trigger: subtotal do pedido = soma dos itens',
    v_soma_itens::text, v_subtotal::text
  );

  -- ----- B6. A coluna gerada total = subtotal + taxa ----------------
  insert into _resultado values (
    13, 'B. Pedido', 'Coluna gerada: total = subtotal + taxa de entrega',
    (v_subtotal + v_taxa)::text, v_total::text
  );

  -- ----- B7. Pedido novo nasce como "recebido" ----------------------
  insert into _resultado values (
    14, 'B. Pedido', 'Status inicial do pedido',
    'recebido', v_status
  );

  -- ----- B8. Carrinho vazio tem que ser recusado --------------------
  begin
    perform criar_pedido('TESTE AUTOMATIZADO', '(69) 90000-0000',
                         '[]'::jsonb, 'retirada', 'pix');
    v_msg := 'aceitou (ERRADO)';
  exception when others then
    v_msg := 'recusado';
  end;
  insert into _resultado values (
    15, 'B. Pedido', 'Carrinho vazio é recusado', 'recusado', v_msg
  );

  -- ----- B9. Entrega sem endereço tem que ser recusada --------------
  begin
    perform criar_pedido('TESTE AUTOMATIZADO', '(69) 90000-0000',
                         v_itens, 'entrega', 'pix', null);
    v_msg := 'aceitou (ERRADO)';
  exception when others then
    v_msg := 'recusado';
  end;
  insert into _resultado values (
    16, 'B. Pedido', 'Entrega sem endereço é recusada', 'recusado', v_msg
  );

  -- ----- B10. Produto que não existe tem que ser recusado -----------
  begin
    perform criar_pedido('TESTE AUTOMATIZADO', '(69) 90000-0000',
      jsonb_build_array(jsonb_build_object(
        'produto_id', '00000000-0000-0000-0000-000000000000', 'quantidade', 1)),
      'retirada', 'pix');
    v_msg := 'aceitou (ERRADO)';
  exception when others then
    v_msg := 'recusado';
  end;
  insert into _resultado values (
    17, 'B. Pedido', 'Produto inexistente é recusado', 'recusado', v_msg
  );

  -- ----- B11. Quantidade zero tem que bater no CHECK ----------------
  begin
    perform criar_pedido('TESTE AUTOMATIZADO', '(69) 90000-0000',
      jsonb_build_array(jsonb_build_object(
        'produto_id', (select id from produtos where disponivel limit 1),
        'quantidade', 0)),
      'retirada', 'pix');
    v_msg := 'aceitou (ERRADO)';
  exception when others then
    v_msg := 'recusado';
  end;
  insert into _resultado values (
    18, 'B. Pedido', 'Quantidade zero é recusada', 'recusado', v_msg
  );
end $$;

-- =====================================================================
-- BLOCO C — SEGURANÇA (RLS)
--
-- ATENÇÃO: no SQL Editor você está logado como dono do banco, e o dono
-- PASSA POR CIMA da RLS. Testar segurança rodando como dono não prova
-- nada. Por isso o bloco abaixo troca para o papel "anon" — que é
-- exatamente o papel que a chave pública do app usa — e só depois
-- tenta ler e escrever.
-- =====================================================================

do $$
declare
  v_leitura  int;
  v_escrita  text;
begin
  execute 'set role anon';

  -- C1. Como anônimo, consigo LER o cardápio? (tem que conseguir)
  select count(*) into v_leitura from produtos;

  -- C2. Como anônimo, consigo ESCREVER no cardápio? (não pode)
  begin
    insert into produtos (categoria_id, nome, preco)
    values ((select id from categorias limit 1), 'PRODUTO DE TESTE RLS', 1.00);
    v_escrita := 'permitiu (FALHA DE SEGURANÇA)';
  exception when others then
    v_escrita := 'bloqueado';
  end;

  execute 'reset role';

  insert into _resultado values (
    19, 'C. Segurança', 'Anônimo consegue ler o cardápio',
    '26', v_leitura::text
  );
  insert into _resultado values (
    20, 'C. Segurança', 'Anônimo é bloqueado ao tentar criar produto',
    'bloqueado', v_escrita
  );

exception when others then
  execute 'reset role';
  raise;
end $$;

-- C3. RLS continua ligada nas cinco tabelas.
insert into _resultado
select 21, 'C. Segurança', 'Tabelas com RLS ligada',
       '5', count(*)::text
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('categorias','produtos','clientes','pedidos','itens_pedido')
  and c.relrowsecurity;

-- C4. A view respeita a RLS de quem consulta, não a do dono dela.
--     Sem security_invoker, a view seria um buraco na segurança.
insert into _resultado
select 22, 'C. Segurança', 'vw_cardapio com security_invoker ligado',
       'true',
       coalesce((
         select 'true' from pg_class c
         join pg_namespace n on n.oid = c.relnamespace
         where n.nspname = 'public' and c.relname = 'vw_cardapio'
           and array_to_string(c.reloptions, ',') like '%security_invoker=on%'
       ), 'false');

-- =====================================================================
-- BLOCO D — LIMPEZA
--
-- Tira do banco tudo que os testes criaram.
-- A ordem importa: itens primeiro, depois o pedido, depois o cliente.
-- É a mesma ordem que as chaves estrangeiras exigem.
-- =====================================================================
delete from itens_pedido
 where pedido_id in (
   select p.id from pedidos p
   join clientes c on c.id = p.cliente_id
   where regexp_replace(c.telefone, '\D', '', 'g') = '69900000000'
 );

delete from pedidos
 where cliente_id in (
   select id from clientes
   where regexp_replace(telefone, '\D', '', 'g') = '69900000000'
 );

delete from clientes
 where regexp_replace(telefone, '\D', '', 'g') = '69900000000';

-- Se o teste de segurança falhar e o anônimo conseguir inserir, some com isso.
delete from produtos where nome = 'PRODUTO DE TESTE RLS';

-- Confere que a limpeza funcionou mesmo.
insert into _resultado
select 23, 'D. Limpeza', 'Sobrou dado de teste no banco',
       '0', count(*)::text
from clientes
where regexp_replace(telefone, '\D', '', 'g') = '69900000000';

insert into _resultado
select 24, 'D. Limpeza', 'Cardápio voltou aos 26 itens',
       '26', count(*)::text
from vw_cardapio;

-- =====================================================================
-- RELATÓRIO
-- =====================================================================
select
  n as "#",
  bloco,
  teste,
  esperado,
  obtido,
  case when esperado = obtido then 'OK' else 'FALHOU' end as status
from _resultado
order by n;

-- =====================================================================
-- FIM DO 90_testes_banco.sql
-- =====================================================================
