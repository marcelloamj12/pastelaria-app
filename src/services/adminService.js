
// Servicos de Admin, onde o Admin pode ver os clientes, pedidos, 
// items do pedido e mudar os status dele



import { supabase } from '../lib/supabase';

// Verifica se o usuário autenticado é administrador
export async function verificarAdmin() {
  const { data: usuarioData, error: usuarioError } =
    await supabase.auth.getUser();

  if (usuarioError) {
    throw new Error(usuarioError.message);
  }

  if (!usuarioData.user) {
    throw new Error('Usuário não autenticado.');
  }

  const { data, error } = await supabase
    .from('perfis')
    .select('id, nome, role')
    .eq('user_id', usuarioData.user.id)
    .eq('role', 'admin')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('Acesso permitido somente para administradores.');
  }

  return data;
}

// Lista todos os clientes
export async function listarClientesAdmin() {
  await verificarAdmin();

  const { data, error } = await supabase
    .from('clientes')
    .select('id, nome, telefone, email, criado_em')
    .order('criado_em', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

// Lista todos os pedidos
export async function listarPedidosAdmin() {
  await verificarAdmin();

  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      id,
      numero,
      status,
      tipo,
      pagamento,
      subtotal,
      taxa_entrega,
      total,
      endereco_entrega,
      observacoes,
      criado_em,
      clientes (
        nome,
        telefone
      )
    `)
    .order('criado_em', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

// Lista todos os itens dos pedidos
export async function listarItensPedidosAdmin() {
  await verificarAdmin();

  const { data, error } = await supabase
    .from('itens_pedido')
    .select(`
      id,
      pedido_id,
      produto_id,
      nome_produto,
      quantidade,
      preco_unitario,
      subtotal,
      observacao,
      criado_em
    `)
    .order('criado_em', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}


// Atualiza o status de um pedido, somente para admins

export async function atualizarStatusPedido({ pedidoId, novoStatus }) {
  await verificarAdmin();

  if (!pedidoId) {
    throw new Error('Pedido não informado.');
  }

  const { data: pedido, error: erroPedido } = await supabase
    .from('pedidos')
    .select('id, tipo')
    .eq('id', pedidoId)
    .maybeSingle();

  if (erroPedido) {
    throw new Error(erroPedido.message);
  }

  if (!pedido) {
    throw new Error('Pedido não encontrado.');
  }

  // verifica se os status correspondem ao tipo
  const statusPermitidos = pedido.tipo === 'retirada'
    ? ['recebido', 'em_preparo', 'pronto', 'entregue', 'cancelado']
    : ['recebido', 'em_preparo', 'saiu_entrega', 'entregue', 'cancelado'];

  if (!statusPermitidos.includes(novoStatus)) {
    throw new Error('Status inválido para este tipo de pedido.');
  }

  const { data, error } = await supabase
    .from('pedidos')
    .update({ status: novoStatus })
    .eq('id', pedidoId)
    .select('id, numero, status, tipo')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

