// =====================================================================
//  src/services/pedidoService.js
//  Finalização e acompanhamento de pedidos.
//  Responsável: Adrian Rafa (Back-end e Dados)
//  Consumido por: Antonio Neto (telas de Carrinho e Pedidos)
//
//  ANTONIO, LEIA ISTO:
//  Para finalizar o pedido você só precisa chamar criarPedido().
//  Mande o carrinho no formato:
//    [{ produto_id: 'uuid', quantidade: 2, observacao: 'sem cebola' }]
//  NÃO precisa mandar preço nem total — o banco calcula e devolve.
//  Isso é de propósito: preço vindo do celular é falsificável.
// =====================================================================

import { supabase } from '../lib/supabase';

/** Rótulos de status para exibir na tela de Pedidos. */
export const STATUS_PEDIDO = {
  recebido:     { texto: 'Pedido recebido',  cor: '#9CA3AF' },
  em_preparo:   { texto: 'Em preparo',       cor: '#F59E0B' },
  pronto:       { texto: 'Pronto',           cor: '#3B82F6' },
  saiu_entrega: { texto: 'Saiu para entrega',cor: '#8B5CF6' },
  entregue:     { texto: 'Entregue',         cor: '#22C55E' },
  cancelado:    { texto: 'Cancelado',        cor: '#EF4444' },
};

/**
 * Finaliza o pedido. Chama a função criar_pedido do Postgres, que grava
 * cliente + pedido + itens em uma única transação.
 *
 * @param {object} p
 * @param {string} p.nome         nome do cliente
 * @param {string} p.telefone     '(11) 91234-5678'
 * @param {Array}  p.itens        [{ produto_id, quantidade, observacao }]
 * @param {'entrega'|'retirada'} [p.tipo]
 * @param {'dinheiro'|'pix'|'cartao_credito'|'cartao_debito'} [p.pagamento]
 * @param {string} [p.endereco]   obrigatório quando tipo = 'entrega'
 * @param {string} [p.observacoes]
 * @param {number} [p.taxaEntrega]
 * @returns {Promise<{pedido_id, numero, total, status}>}
 */
export async function criarPedido({
  nome,
  telefone,
  itens,
  tipo = 'entrega',
  pagamento = 'pix',
  endereco = null,
  observacoes = null,
  taxaEntrega = 0,
}) {
  // validação no app só para dar mensagem rápida ao usuário.
  // A validação que vale é a do banco (o app é falsificável).
  if (!nome?.trim()) throw new Error('Informe seu nome.');
  if (!telefone?.trim()) throw new Error('Informe seu telefone.');
  if (!itens?.length) throw new Error('Seu carrinho está vazio.');
  if (tipo === 'entrega' && !endereco?.trim()) throw new Error('Informe o endereço de entrega.');

  const { data, error } = await supabase.rpc('criar_pedido', {
    p_nome: nome.trim(),
    p_telefone: telefone.trim(),
    p_itens: itens.map((i) => ({
      produto_id: i.produto_id,
      quantidade: i.quantidade,
      observacao: i.observacao ?? null,
    })),
    p_tipo: tipo,
    p_pagamento: pagamento,
    p_endereco: endereco,
    p_observacoes: observacoes,
    p_taxa: taxaEntrega,
  });

  if (error) throw new Error(error.message);
  // a função retorna uma tabela de 1 linha
  return Array.isArray(data) ? data[0] : data;
}

/**
 * Histórico de pedidos do cliente, buscado pelo telefone
 * (enquanto não existe login).
 */
export async function listarPedidosPorTelefone(telefone) {
  const somenteNumeros = (telefone ?? '').replace(/\D/g, '');
  if (somenteNumeros.length < 10) return [];

  const { data: cliente, error: erroCliente } = await supabase
    .from('clientes')
    .select('id')
    .ilike('telefone', `%${somenteNumeros.slice(-8)}%`)
    .maybeSingle();

  if (erroCliente) throw new Error(erroCliente.message);
  if (!cliente) return [];

  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      id, numero, status, tipo, total, criado_em,
      itens_pedido ( nome_produto, quantidade, preco_unitario, subtotal )
    `)
    .eq('cliente_id', cliente.id)
    .order('criado_em', { ascending: false });

  if (error) throw new Error(`Não foi possível carregar seus pedidos: ${error.message}`);
  return data ?? [];
}

/** Um pedido específico, com todos os itens. */
export async function buscarPedido(pedidoId) {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      id, numero, status, tipo, pagamento, subtotal, taxa_entrega, total,
      endereco_entrega, observacoes, criado_em,
      clientes ( nome, telefone ),
      itens_pedido ( id, nome_produto, quantidade, preco_unitario, subtotal, observacao )
    `)
    .eq('id', pedidoId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Acompanha o status do pedido em tempo real (Supabase Realtime).
 * Quando a pastelaria muda o status no painel, a tela do cliente
 * atualiza sozinha, sem precisar puxar para recarregar.
 *
 * Uso dentro de um useEffect:
 *   const inscricao = acompanharPedido(id, (p) => setPedido(p));
 *   return () => inscricao.unsubscribe();
 *
 * Requisito: ativar Realtime na tabela pedidos
 * (Supabase > Database > Replication > pedidos).
 */
export function acompanharPedido(pedidoId, aoAtualizar) {
  const canal = supabase
    .channel(`pedido:${pedidoId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'pedidos', filter: `id=eq.${pedidoId}` },
      (payload) => aoAtualizar(payload.new)
    )
    .subscribe();

  return { unsubscribe: () => supabase.removeChannel(canal) };
}
