-- =====================================================================
-- PASTELARIA MILTÃO — CARDÁPIO DIGITAL
-- 05_atualiza_cardapio_real.sql — Alinha o banco com o cardápio oficial
--
-- Projeto: Desenvolvimento para Dispositivos Móveis (SI)
-- Responsável: Adrian Rafa — Back-end e Dados
--
-- POR QUE ESTE ARQUIVO EXISTE
-- O 03_seed.sql foi escrito a partir das telas do Figma e de uma foto
-- ruim do cardápio de papel. Vários itens ficaram com o comentário
-- "-- (preço a confirmar)". A pastelaria mandou o cardápio oficial no
-- grupo, então agora dá para fechar: 26 itens em 5 categorias.
--
-- O que este script faz, nesta ordem:
--   1. Renomeia os produtos cujo nome no banco não bate com o cardápio
--   2. Insere/atualiza os 26 itens oficiais (nome, descrição, preço)
--   3. Desativa os 3 itens que o banco tinha mas o cardápio não tem
--   4. Mostra a conferência final
--
-- O script é IDEMPOTENTE: pode rodar quantas vezes quiser.
-- Nada é apagado — itens fora do cardápio são escondidos com
-- disponivel = false, para não quebrar o histórico de pedidos.
--
-- Como usar: Supabase > SQL Editor > New query > cole tudo > Run.
-- Rode depois do 03_seed.sql.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. RENOMEAÇÕES
--
-- Precisa vir ANTES dos inserts. A chave única de produtos é
-- (categoria_id, nome); se o nome antigo continuasse no banco, o passo 2
-- criaria um produto novo em vez de atualizar o que já existe, e a gente
-- acabaria com o item duplicado na tela.
--
-- Os tamanhos ("300ml", "Lata", "400ml") saem porque o cardápio da casa
-- não especifica tamanho nenhum — era chute nosso.
-- ---------------------------------------------------------------------
update produtos p set nome = 'Quadradinho de Queijo e Salsicha'
from categorias c
where c.id = p.categoria_id and c.slug = 'salgados' and p.nome = 'Quadradinho';

update produtos p set nome = 'Enroladinho'
from categorias c
where c.id = p.categoria_id and c.slug = 'salgados' and p.nome = 'Enroladinho de Salsicha';

update produtos p set nome = 'Caldo de Cana'
from categorias c
where c.id = p.categoria_id and c.slug = 'bebidas' and p.nome = 'Caldo de Cana 300ml';

update produtos p set nome = 'Refrigerante'
from categorias c
where c.id = p.categoria_id and c.slug = 'bebidas' and p.nome = 'Refrigerante Lata';

update produtos p set nome = 'Suco Natural'
from categorias c
where c.id = p.categoria_id and c.slug = 'bebidas' and p.nome = 'Suco Natural 400ml';

-- ---------------------------------------------------------------------
-- 2. OS 26 ITENS DO CARDÁPIO OFICIAL
--
-- Mesmo padrão do 03_seed.sql: o select busca a categoria pelo slug,
-- então não precisamos colar uuid na mão. O "on conflict" garante que
-- rodar de novo só atualiza, nunca duplica.
-- ---------------------------------------------------------------------

-- ----- Pastéis (6 itens, todos R$ 7,00) -------------------------------
-- Nenhuma mudança de preço aqui: o Figma já estava certo.
insert into produtos (categoria_id, nome, descricao, preco, ordem, destaque, disponivel)
select c.id, v.nome, v.descricao, v.preco, v.ordem, v.destaque, true
from categorias c
cross join (values
  ('Pastel de Carne',     'Carne moída mega temperada, sequinho e frito na hora.',   7.00, 1, false),
  ('Pastel de Queijo',    'Muito queijo derretido com massa crocante e sequinha.',   7.00, 2, false),
  ('Pastel Misto',        'O clássico presunto e queijo derretido com tempero especial.', 7.00, 3, false),
  ('Carne e Queijo',      'Combinação perfeita de carne moída suculenta e queijo.',  7.00, 4, false),
  ('Frango com Catupiry', 'Frango desfiado cremoso com o legítimo Catupiry.',        7.00, 5, false),
  ('Frango com Queijo',   'Frango desfiado temperado com queijo derretido.',         7.00, 6, false)
) as v(nome, descricao, preco, ordem, destaque)
where c.slug = 'pasteis'
on conflict (categoria_id, nome) do update
set descricao  = excluded.descricao,
    preco      = excluded.preco,
    ordem      = excluded.ordem,
    destaque   = excluded.destaque,
    disponivel = true;

-- ----- Especiais (5 itens) --------------------------------------------
-- Eram 2 no banco. O cardápio tem 5, e os dois que já existiam subiram
-- de preço: X-Tudão 11,00 -> 12,00 e Carne/Queijo/Ovo/Banana 9,00 -> 10,00.
insert into produtos (categoria_id, nome, descricao, preco, ordem, destaque, disponivel)
select c.id, v.nome, v.descricao, v.preco, v.ordem, v.destaque, true
from categorias c
cross join (values
  ('X-Tudão do Miltão',             'Carne, queijo, ovo, presunto, frango e catupiry. O maior da casa.', 12.00, 1, true),
  ('Carne, Queijo, Ovo e Banana',   'Mistura tradicional e surpreendente de sabores.',                   10.00, 2, false),
  ('Carne, Queijo e Ovo',           'O trio que não tem erro: carne, queijo e ovo.',                      9.00, 3, false),
  ('Carne, Queijo e Ovo de Codorna','Carne e queijo com ovos de codorna inteiros.',                      10.00, 4, false),
  ('Carne, Queijo e Banana',        'Carne e queijo com banana, o doce com salgado da casa.',            10.00, 5, false)
) as v(nome, descricao, preco, ordem, destaque)
where c.slug = 'especiais'
on conflict (categoria_id, nome) do update
set descricao  = excluded.descricao,
    preco      = excluded.preco,
    ordem      = excluded.ordem,
    destaque   = excluded.destaque,
    disponivel = true;

-- ----- Doces (3 itens, todos R$ 9,00) ---------------------------------
-- Os dois que já existiam foram de 8,00 para 9,00. Entra o Brigadeiro.
insert into produtos (categoria_id, nome, descricao, preco, ordem, disponivel)
select c.id, v.nome, v.descricao, v.preco, v.ordem, true
from categorias c
cross join (values
  ('Pastel de Queijo com Banana e Leite', 'Queijo, banana e leite condensado. Servido quentinho.', 9.00, 1),
  ('Pastel de Queijo com Goiabada',       'A clássica Romeu e Julieta em versão pastel.',          9.00, 2),
  ('Pastel de Brigadeiro',                'Brigadeiro cremoso dentro da massa crocante.',          9.00, 3)
) as v(nome, descricao, preco, ordem)
where c.slug = 'doces'
on conflict (categoria_id, nome) do update
set descricao  = excluded.descricao,
    preco      = excluded.preco,
    ordem      = excluded.ordem,
    disponivel = true;

-- ----- Salgados (8 itens, todos R$ 7,00) ------------------------------
-- Eram 4 no banco, a 6,00. O cardápio tem 8, todos a 7,00.
insert into produtos (categoria_id, nome, descricao, preco, ordem, disponivel)
select c.id, v.nome, v.descricao, v.preco, v.ordem, true
from categorias c
cross join (values
  ('Saltenha',                         'Salteña assada, recheio suculento e massa macia.',     7.00, 1),
  ('Croquete',                         'Croquete de carne temperada, frito na hora.',          7.00, 2),
  ('Coxinha',                          'Coxinha de frango com massa leve, frita na hora.',     7.00, 3),
  ('Quadradinho de Queijo e Salsicha', 'Salgado quadrado de queijo com salsicha, bem crocante.', 7.00, 4),
  ('Risoli de Carne e Queijo',         'Risoles empanado recheado de carne com queijo.',       7.00, 5),
  ('Risoli Misto',                     'Risoles empanado de presunto com queijo.',             7.00, 6),
  ('Enroladinho',                      'Salsicha enrolada na massa, frita na hora.',           7.00, 7),
  ('Kibe',                             'Kibe de carne com trigo e temperos, frito na hora.',   7.00, 8)
) as v(nome, descricao, preco, ordem)
where c.slug = 'salgados'
on conflict (categoria_id, nome) do update
set descricao  = excluded.descricao,
    preco      = excluded.preco,
    ordem      = excluded.ordem,
    disponivel = true;

-- ----- Bebidas (4 itens, todos R$ 7,00) -------------------------------
-- O cardápio cobra 7,00 em tudo: refrigerante subiu (6,00 -> 7,00) e o
-- suco natural desceu (8,00 -> 7,00).
insert into produtos (categoria_id, nome, descricao, preco, ordem, disponivel)
select c.id, v.nome, v.descricao, v.preco, v.ordem, true
from categorias c
cross join (values
  ('Refrigerante',  'Coca-Cola, Guaraná ou Fanta, bem gelado.',        7.00, 1),
  ('Suco Natural',  'Laranja, limão, maracujá ou abacaxi.',            7.00, 2),
  ('Caldo de Cana', 'Caldo de cana gelado, feito na hora.',            7.00, 3),
  ('Parecis',       'Refrigerante Parecis, o guaraná da região.',      7.00, 4)
) as v(nome, descricao, preco, ordem)
where c.slug = 'bebidas'
on conflict (categoria_id, nome) do update
set descricao  = excluded.descricao,
    preco      = excluded.preco,
    ordem      = excluded.ordem,
    disponivel = true;

-- ---------------------------------------------------------------------
-- 3. ITENS QUE SAEM DO CARDÁPIO
--
-- Estes três estavam no 03_seed.sql mas não existem no cardápio oficial.
-- NÃO usamos delete: se alguém já tivesse pedido um deles, o delete
-- quebraria (itens_pedido tem on delete restrict no produto) e o
-- histórico ficaria sem o item. disponivel = false some com ele da
-- vw_cardapio e, portanto, da tela, sem mexer em nada do passado.
-- ---------------------------------------------------------------------
update produtos p set disponivel = false
from categorias c
where c.id = p.categoria_id
  and (
    (c.slug = 'salgados' and p.nome = 'Pastel de Queijo e Salsicha') -- virou "Quadradinho de Queijo e Salsicha"
    or (c.slug = 'doces'    and p.nome = 'Pastel de Chocolate')      -- não existe; o doce da casa é o Brigadeiro
    or (c.slug = 'bebidas'  and p.nome = 'Água Mineral 500ml')       -- não consta no cardápio
  );

commit;

-- ---------------------------------------------------------------------
-- 4. CONFERÊNCIA — rode e compare com o cardápio de papel
--
-- Esperado:
--   Pastéis    6 itens   7,00 a  7,00
--   Especiais  5 itens   9,00 a 12,00
--   Salgados   8 itens   7,00 a  7,00
--   Doces      3 itens   9,00 a  9,00
--   Bebidas    4 itens   7,00 a  7,00
--   TOTAL     26 itens
-- ---------------------------------------------------------------------
select categoria_nome, count(*) as itens, min(preco) as menor, max(preco) as maior
from vw_cardapio
group by categoria_nome, categoria_ordem
order by categoria_ordem;

select count(*) as total_itens_no_cardapio from vw_cardapio;

-- Lista completa, do jeito que vai aparecer no app:
select categoria_nome, ordem, nome, preco
from vw_cardapio
order by categoria_ordem, ordem;

-- =====================================================================
-- FIM DO 05_atualiza_cardapio_real.sql
-- =====================================================================
