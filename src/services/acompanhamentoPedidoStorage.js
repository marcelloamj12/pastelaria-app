
// serviço para o armazenamento do pedido local


import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_PEDIDO = '@pastelaria:pedido_acompanhamento';
const CHAVE_HISTORICO = '@pastelaria:historico_pedidos';

export async function salvarPedidoAcompanhamento(pedidoId, telefone) {
  const dados = {
    pedidoId,
    telefone: telefone.replace(/\D/g, ''),
  };

  // Mantém o último pedido para a tela de acompanhamento.
  await AsyncStorage.setItem(
    CHAVE_PEDIDO,
    JSON.stringify(dados)
  );

  // Recupera o histórico existente.
  const historicoSalvo = await AsyncStorage.getItem(
    CHAVE_HISTORICO
  );

  const historico = historicoSalvo
    ? JSON.parse(historicoSalvo)
    : [];

  // Recupera o último pedido antigo, caso ainda não esteja no histórico.
  const ultimoPedido = await AsyncStorage.getItem(CHAVE_PEDIDO);

  const pedidos = Array.isArray(historico) ? historico : [];

  const jaExiste = pedidos.some(
    (pedido) => pedido.pedidoId === dados.pedidoId
  );

  if (!jaExiste) {
    pedidos.push(dados);
  }

  await AsyncStorage.setItem(
    CHAVE_HISTORICO,
    JSON.stringify(pedidos)
  );
}

export async function buscarPedidoAcompanhamento() {
  const dados = await AsyncStorage.getItem(CHAVE_PEDIDO);

  if (!dados) return null;

  return JSON.parse(dados);
}

export async function buscarHistoricoAcompanhamento() {
  const dados = await AsyncStorage.getItem(CHAVE_HISTORICO);

  if (!dados) return [];

  const historico = JSON.parse(dados);

  return Array.isArray(historico) ? historico : [];
}
