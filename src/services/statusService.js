
// funçao para buscar o status de um pedido


import { supabase } from '../lib/supabase';


 // Busca somente o status atual de um pedido.
 
export async function buscarStatusPedido(pedidoId) {
  if (!pedidoId) {
    throw new Error('Pedido não informado.');
  }

  const { data, error } = await supabase
    .from('pedidos')
    .select('status')
    .eq('id', pedidoId)
    .maybeSingle();

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

const status = await buscarStatusPedido(pedidoId);
setStatus(status);

*/