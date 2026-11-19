
// Função para buscar o status de um pedido.

import { supabase } from '../lib/supabase';

/**
 * Busca somente o status atual de um pedido.
 *
 * Utiliza a função buscar_meu_pedido do banco de dados,
 * que verifica se o telefone informado pertence ao pedido.
 *
 * @param {string} pedidoId - ID do pedido.
 * @param {string} telefone - Telefone utilizado na realização do pedido.
 * @returns {Promise<string>} Status atual do pedido.
 */
export async function buscarStatusPedido(pedidoId, telefone) {
  if (!pedidoId) {
    throw new Error('Pedido não informado.');
  }

  const somenteNumeros = (telefone ?? '').replace(/\D/g, '');

  if (somenteNumeros.length < 10 || somenteNumeros.length > 11) {
    throw new Error('Telefone inválido.');
  }

  const { data, error } = await supabase.rpc('buscar_meu_pedido', {
    p_pedido_id: pedidoId,
    p_telefone: somenteNumeros,
  });

  if (error) {
    throw new Error(`Não foi possível consultar o status: ${error.message}`);
  }

  if (!data) {
    throw new Error('Pedido não encontrado.');
  }

  return data.status;
}


/*
  Na tela que precisar consultar o status, importe a função:

  import { buscarStatusPedido } from '../services/statusService';

  E chame:

  const status = await buscarStatusPedido(pedidoId, telefone);
  setStatus(status);

  O telefone deve ser o mesmo informado na realização do pedido.
*/
