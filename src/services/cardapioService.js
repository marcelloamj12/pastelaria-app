// =====================================================================
//  src/services/cardapioService.js
//  Tudo que o app precisa para MOSTRAR o cardápio.
//  Responsável: Adrian Rafa (Back-end e Dados)
//
//  REGRA DO PROJETO (combinada com o time):
//  Nenhuma tela chama o supabase direto. As telas chamam estas funções.
//  Assim, se um dia trocarmos o Supabase por outra coisa, muda só este
//  arquivo — nenhuma tela do José Luiz ou do Antonio precisa mudar.
// =====================================================================

import { supabase } from '../lib/supabase';

/**
 * Lista as categorias ativas, na ordem das abas do Cardápio.
 * Uso: as abas "Pastéis / Especiais / Doces / Salgados / Bebidas".
 *
 * @returns {Promise<Array<{id, nome, slug, ordem}>>}
 */
export async function listarCategorias() {
  const { data, error } = await supabase
    .from('categorias')
    .select('id, nome, slug, ordem')
    .eq('ativo', true)
    .order('ordem', { ascending: true });

  if (error) throw new Error(`Não foi possível carregar as categorias: ${error.message}`);
  return data ?? [];
}

/**
 * Lista os produtos disponíveis. Se passar um slug, filtra pela categoria.
 * Usa a view vw_cardapio, que já vem com o nome da categoria junto
 * (um request só em vez de dois).
 *
 * @param {string} [categoriaSlug] ex.: 'pasteis'
 */
export async function listarProdutos(categoriaSlug) {
  let query = supabase
    .from('vw_cardapio')
    .select('id, nome, descricao, preco, imagem_url, destaque, categoria_id, categoria_nome, categoria_slug');

  if (categoriaSlug) query = query.eq('categoria_slug', categoriaSlug);

  const { data, error } = await query
    .order('categoria_ordem', { ascending: true })
    .order('ordem', { ascending: true });

  if (error) throw new Error(`Não foi possível carregar o cardápio: ${error.message}`);
  return data ?? [];
}

/**
 * Traz o cardápio já agrupado por categoria — formato pronto para uma
 * SectionList do React Native.
 *
 * @returns {Promise<Array<{ title, slug, data: Array }>>}
 */
export async function listarCardapioAgrupado() {
  const produtos = await listarProdutos();
  const grupos = new Map();

  for (const p of produtos) {
    if (!grupos.has(p.categoria_slug)) {
      grupos.set(p.categoria_slug, { title: p.categoria_nome, slug: p.categoria_slug, data: [] });
    }
    grupos.get(p.categoria_slug).data.push(p);
  }
  return Array.from(grupos.values());
}

/**
 * Produtos em destaque — para o banner/carrossel da Home.
 */
export async function listarDestaques() {
  const { data, error } = await supabase
    .from('vw_cardapio')
    .select('id, nome, descricao, preco, imagem_url')
    .eq('destaque', true)
    .order('ordem', { ascending: true });

  if (error) throw new Error(`Não foi possível carregar os destaques: ${error.message}`);
  return data ?? [];
}

/**
 * Um produto específico — para a tela de Detalhe do item.
 */
export async function buscarProduto(id) {
  const { data, error } = await supabase
    .from('vw_cardapio')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(`Não foi possível carregar o produto: ${error.message}`);
  if (!data) throw new Error('Produto não encontrado ou indisponível.');
  return data;
}

/**
 * Busca por nome ou descrição — para a lupa da tela de Cardápio.
 * ilike = busca sem diferenciar maiúsculas/minúsculas.
 */
export async function buscarPorTexto(termo) {
  const t = (termo ?? '').trim();
  if (t.length < 2) return [];

  const { data, error } = await supabase
    .from('vw_cardapio')
    .select('id, nome, descricao, preco, imagem_url, categoria_nome')
    .or(`nome.ilike.%${t}%,descricao.ilike.%${t}%`)
    .limit(20);

  if (error) throw new Error(`Erro na busca: ${error.message}`);
  return data ?? [];
}

/**
 * Formata preço para exibir na tela: 7 -> "R$ 7,00"
 * (fica aqui porque o preço vem do banco como number)
 */
export function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
