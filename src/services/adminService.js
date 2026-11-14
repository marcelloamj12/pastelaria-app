
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
