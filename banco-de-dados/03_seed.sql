-- =====================================================================
--  PASTELARIA MILTÃO — CARDÁPIO DIGITAL
--  03_seed.sql — Dados iniciais do cardápio
--
--  Os PASTÉIS e ESPECIAIS abaixo saíram das telas do Figma do José Luiz,
--  com nome, descrição e preço iguais aos do protótipo.
--  Os itens de SALGADOS, DOCES e BEBIDAS vieram do cardápio de papel da
--  pastelaria; os preços deles estão marcados com  -- (preço a confirmar)
--  porque não dava para ler na foto. Ajuste antes da apresentação.
--
--  O script é idempotente: pode rodar de novo sem duplicar nada.
--  Rode depois do 02_rls.sql.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. CATEGORIAS (as abas da tela Cardápio)
-- ---------------------------------------------------------------------
insert into categorias (nome, slug, ordem) values
  ('Pastéis',   'pasteis',   1),
  ('Especiais', 'especiais', 2),
  ('Salgados',  'salgados',  3),
  ('Doces',     'doces',     4),
  ('Bebidas',   'bebidas',   5)
on conflict (slug) do update
  set nome = excluded.nome,
      ordem = excluded.ordem;


-- ---------------------------------------------------------------------
-- 2. PRODUTOS
--    O select dentro do insert busca a categoria pelo slug, então não
--    precisamos colar uuid nenhum na mão.
-- ---------------------------------------------------------------------

-- ----- Pastéis ------------------------------------------------------
insert into produtos (categoria_id, nome, descricao, preco, ordem, destaque)
select c.id, v.nome, v.descricao, v.preco, v.ordem, v.destaque
from categorias c
cross join (values
  ('Pastel de Carne',  'Carne moída mega temperada, sequinho e frito na hora.',        7.00, 1, false),
  ('Pastel de Queijo', 'Muito queijo derretido com massa crocante e sequinha.',        7.00, 2, false),
  ('Pastel Misto',     'O clássico presunto e queijo derretido com tempero especial.', 7.00, 3, false),
  ('Carne e Queijo',   'Combinação perfeita de carne moída suculenta e queijo.',       7.00, 4, false),
  ('Frango com Catupiry','Frango desfiado cremoso com o legítimo Catupiry.',           7.00, 5, false),
  ('Frango com Queijo','Frango desfiado temperado com queijo derretido.',              7.00, 6, false)
) as v(nome, descricao, preco, ordem, destaque)
where c.slug = 'pasteis'
on conflict (categoria_id, nome) do update
  set descricao = excluded.descricao,
      preco     = excluded.preco,
      ordem     = excluded.ordem,
      destaque  = excluded.destaque;

-- ----- Especiais ----------------------------------------------------
insert into produtos (categoria_id, nome, descricao, preco, ordem, destaque)
select c.id, v.nome, v.descricao, v.preco, v.ordem, v.destaque
from categorias c
cross join (values
  ('X-Tudão do Miltão',          'Carne, queijo, ovo, presunto, frango e catupiry. O maior da casa.', 11.00, 1, true),
  ('Carne, Queijo, Ovo e Banana','Mistura tradicional e surpreendente de sabores.',                    9.00, 2, false)
) as v(nome, descricao, preco, ordem, destaque)
where c.slug = 'especiais'
on conflict (categoria_id, nome) do update
  set descricao = excluded.descricao,
      preco     = excluded.preco,
      ordem     = excluded.ordem,
      destaque  = excluded.destaque;

-- ----- Salgados fritos ----------------------------------------------
insert into produtos (categoria_id, nome, descricao, preco, ordem)
select c.id, v.nome, v.descricao, v.preco, v.ordem
from categorias c
cross join (values
  ('Coxinha',                'Coxinha de frango com massa leve, frita na hora.',   6.00, 1),  -- (preço a confirmar)
  ('Quadradinho',            'Salgado quadrado recheado, crocante por fora.',      6.00, 2),  -- (preço a confirmar)
  ('Enroladinho de Salsicha','Salsicha enrolada na massa, frita na hora.',         6.00, 3),  -- (preço a confirmar)
  ('Pastel de Queijo e Salsicha','Queijo derretido com salsicha em cubos.',        7.00, 4)   -- (preço a confirmar)
) as v(nome, descricao, preco, ordem)
where c.slug = 'salgados'
on conflict (categoria_id, nome) do update
  set descricao = excluded.descricao, preco = excluded.preco, ordem = excluded.ordem;

-- ----- Doces --------------------------------------------------------
insert into produtos (categoria_id, nome, descricao, preco, ordem)
select c.id, v.nome, v.descricao, v.preco, v.ordem
from categorias c
cross join (values
  ('Pastel de Queijo com Banana e Leite', 'Queijo, banana e leite condensado. Servido quentinho.', 8.00, 1),  -- (preço a confirmar)
  ('Pastel de Queijo com Goiabada',       'A clássica Romeu e Julieta em versão pastel.',          8.00, 2),  -- (preço a confirmar)
  ('Pastel de Chocolate',                 'Chocolate derretido na massa crocante.',                8.00, 3)   -- (preço a confirmar)
) as v(nome, descricao, preco, ordem)
where c.slug = 'doces'
on conflict (categoria_id, nome) do update
  set descricao = excluded.descricao, preco = excluded.preco, ordem = excluded.ordem;

-- ----- Bebidas ------------------------------------------------------
insert into produtos (categoria_id, nome, descricao, preco, ordem)
select c.id, v.nome, v.descricao, v.preco, v.ordem
from categorias c
cross join (values
  ('Caldo de Cana 300ml',  'Caldo de cana gelado, feito na hora.',        7.00, 1),  -- (preço a confirmar)
  ('Refrigerante Lata',    'Coca-Cola, Guaraná ou Fanta, 350ml.',         6.00, 2),  -- (preço a confirmar)
  ('Suco Natural 400ml',   'Laranja, limão, maracujá ou abacaxi.',        8.00, 3),  -- (preço a confirmar)
  ('Água Mineral 500ml',   'Com ou sem gás.',                             4.00, 4)   -- (preço a confirmar)
) as v(nome, descricao, preco, ordem)
where c.slug = 'bebidas'
on conflict (categoria_id, nome) do update
  set descricao = excluded.descricao, preco = excluded.preco, ordem = excluded.ordem;


-- ---------------------------------------------------------------------
-- 3. CONFERÊNCIA — rode isso para ver se deu tudo certo
-- ---------------------------------------------------------------------
select categoria_nome, count(*) as itens, min(preco) as menor, max(preco) as maior
from vw_cardapio
group by categoria_nome, categoria_ordem
order by categoria_ordem;


-- =====================================================================
-- FIM DO 03_seed.sql — rode agora o 04_rpc_criar_pedido.sql
-- =====================================================================
