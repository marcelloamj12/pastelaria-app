
// serviço para o armazenamento do pedido local



import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_PEDIDO = '@pastelaria:pedido_acompanhamento';
const CHAVE_HISTORICO = '@pastelaria:historico_pedidos';

export async function salvarPedidoAcompanhamento(pedidoId, telefone) {
  const dados = {
    pedidoId,
    telefone: telefone.replace(/\D/g, ''),
  };

  // Recupera o último pedido antes de substituí-lo.
  const ultimoPedidoSalvo = await AsyncStorage.getItem(CHAVE_PEDIDO);

  // Recupera o histórico existente.
  const historicoSalvo = await AsyncStorage.getItem(CHAVE_HISTORICO);

  const historico = historicoSalvo
    ? JSON.parse(historicoSalvo)
    : [];

  const pedidos = Array.isArray(historico) ? historico : [];

  // Preserva o último pedido antigo, caso ainda não esteja no histórico.
  if (ultimoPedidoSalvo) {
    const pedidoAntigo = JSON.parse(ultimoPedidoSalvo);

    const jaExiste = pedidos.some(
      (pedido) => pedido.pedidoId === pedidoAntigo.pedidoId
    );

    if (!jaExiste) {
      pedidos.push(pedidoAntigo);
    }
  }

  // Adiciona o novo pedido ao histórico.
  const jaExiste = pedidos.some(
    (pedido) => pedido.pedidoId === dados.pedidoId
  );

  if (!jaExiste) {
    pedidos.push(dados);
  }

  // Atualiza o último pedido para a tela de acompanhamento.
  await AsyncStorage.setItem(
    CHAVE_PEDIDO,
    JSON.stringify(dados)
  );

  // Salva o histórico atualizado.
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
  const historicoSalvo = await AsyncStorage.getItem(CHAVE_HISTORICO);
  const ultimoPedidoSalvo = await AsyncStorage.getItem(CHAVE_PEDIDO);

  const historico = historicoSalvo
    ? JSON.parse(historicoSalvo)
    : [];

  const pedidos = Array.isArray(historico) ? historico : [];

  // Recupera o último pedido caso ainda não esteja no histórico.
  if (ultimoPedidoSalvo) {
    const ultimoPedido = JSON.parse(ultimoPedidoSalvo);

    const jaExiste = pedidos.some(
      (pedido) => pedido.pedidoId === ultimoPedido.pedidoId
    );

    if (!jaExiste) {
      pedidos.push(ultimoPedido);
    }
  }

  // Persiste a recuperação do histórico antigo.
  await AsyncStorage.setItem(
    CHAVE_HISTORICO,
    JSON.stringify(pedidos)
  );

  return pedidos;
}
