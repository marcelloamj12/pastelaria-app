-- =====================================================================
--  PASTELARIA MILTÃO — CARDÁPIO DIGITAL
--  04_rpc_criar_pedido.sql — Função para finalizar o pedido
--
--  POR QUE UMA FUNÇÃO EM VEZ DE VÁRIOS INSERTS PELO APP:
--
--  1) ATOMICIDADE. Criar um pedido são 3 operações (cliente, pedido,
--     itens). Se o celular perder o sinal no meio, o app deixaria um
--     pedido pela metade no banco. Dentro de uma função, ou tudo é
--     gravado, ou nada é.
--
--  2) SEGURANÇA DE PREÇO. O app manda só o id do produto e a
--     quantidade. O PREÇO É LIDO DO BANCO, nunca do celular. Assim
--     ninguém consegue mandar um X-Tudão por R$ 0,01 mexendo no app.
--
--  Rode depois do 03_seed.sql.
-- =====================================================================

create or replace function criar_pedido(
  p_nome        text,
  p_telefone    text,
  p_itens       jsonb,                       -- [{"produto_id":"...","quantidade":2,"observacao":"sem cebola"}]
  p_tipo        tipo_entrega    default 'entrega',
  p_pagamento   forma_pagamento default 'pix',
  p_endereco    text            default null,
  p_observacoes text            default null,
  p_taxa        numeric         default 0
)
returns table (
  pedido_id uuid,
  numero    bigint,
  total     numeric,
  status    status_pedido
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cliente_id uuid;
  v_pedido_id  uuid;
begin
  -- --- validações de entrada -----------------------------------------
  if p_itens is null or jsonb_array_length(p_itens) = 0 then
    raise exception 'O carrinho está vazio.' using errcode = 'P0001';
  end if;

  if p_tipo = 'entrega' and (p_endereco is null or length(trim(p_endereco)) = 0) then
    raise exception 'Endereço é obrigatório para pedidos com entrega.' using errcode = 'P0001';
  end if;

  -- --- 1. cliente: reaproveita pelo telefone, ou cria ----------------
  select id into v_cliente_id
    from clientes
   where regexp_replace(telefone, '\D', '', 'g') = regexp_replace(p_telefone, '\D', '', 'g')
   limit 1;

  if v_cliente_id is null then
    insert into clientes (nome, telefone)
    values (p_nome, p_telefone)
    returning id into v_cliente_id;
  else
    update clientes set nome = p_nome where id = v_cliente_id;
  end if;

  -- --- 2. cabeçalho do pedido ---------------------------------------
  insert into pedidos (cliente_id, tipo, pagamento, endereco_entrega, observacoes, taxa_entrega)
  values (v_cliente_id, p_tipo, p_pagamento, p_endereco, p_observacoes, coalesce(p_taxa, 0))
  returning id into v_pedido_id;

  -- --- 3. itens: preço e nome vêm da tabela produtos -----------------
  insert into itens_pedido (pedido_id, produto_id, quantidade, preco_unitario, nome_produto, observacao)
  select
    v_pedido_id,
    pr.id,
    (item->>'quantidade')::smallint,
    pr.preco,          -- <<< preço lido do banco, não do celular
    pr.nome,
    nullif(item->>'observacao', '')
  from jsonb_array_elements(p_itens) as item
  join produtos pr on pr.id = (item->>'produto_id')::uuid
  where pr.disponivel;

  -- se algum produto do carrinho não existe ou está indisponível, aborta
  if (select count(*) from itens_pedido i where i.pedido_id = v_pedido_id) <> jsonb_array_length(p_itens) then
    raise exception 'Um ou mais itens do carrinho estão indisponíveis.' using errcode = 'P0001';
  end if;

  -- --- 4. devolve o resumo para o app mostrar na tela ----------------
  return query
    select p.id, p.numero, p.total, p.status
      from pedidos p
     where p.id = v_pedido_id;
end;
$$;

comment on function criar_pedido is
  'Cria cliente + pedido + itens em uma única transação. O preço é sempre lido da tabela produtos.';

-- quem pode chamar a função
grant execute on function criar_pedido to anon, authenticated;


-- ---------------------------------------------------------------------
-- TESTE RÁPIDO (roda no SQL Editor para ver funcionando)
-- ---------------------------------------------------------------------
-- select * from criar_pedido(
--   'Adrian Rafa',
--   '(11) 91234-5678',
--   (select jsonb_agg(jsonb_build_object('produto_id', id, 'quantidade', 2))
--      from (select id from produtos limit 2) t),
--   'entrega', 'pix', 'Rua das Flores, 123', 'Sem cebola', 5.00
-- );
--
-- select numero, status, subtotal, taxa_entrega, total from pedidos order by criado_em desc limit 1;


-- =====================================================================
-- FIM — banco montado. Vá para a integração no React Native.
-- =====================================================================
