
// place holder para testar o armazenamento do pedido local


import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_PEDIDO = '@pastelaria:pedido_acompanhamento';

export async function salvarPedidoAcompanhamento(pedidoId, telefone) {
  const dados = {
    pedidoId,
    telefone: telefone.replace(/\D/g, ''),
  };

  await AsyncStorage.setItem(
    CHAVE_PEDIDO,
    JSON.stringify(dados)
  );
}

export async function buscarPedidoAcompanhamento() {
  const dados = await AsyncStorage.getItem(CHAVE_PEDIDO);

  if (!dados) {
    return null;
  }

  return JSON.parse(dados);
}

