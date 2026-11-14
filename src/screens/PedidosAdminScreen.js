
// tela teste de admin sobre os pedidos


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { listarPedidosAdmin, atualizarStatusPedido, } from '../services/adminService';

const STATUS_ENTREGA = [
  { valor: 'recebido', texto: 'Recebido' },
  { valor: 'em_preparo', texto: 'Em preparo' },
  { valor: 'saiu_entrega', texto: 'Saiu para entrega' },
  { valor: 'entregue', texto: 'Entregue' },
];

const STATUS_RETIRADA = [
  { valor: 'recebido', texto: 'Recebido' },
  { valor: 'em_preparo', texto: 'Em preparo' },
  { valor: 'pronto', texto: 'Pronto p/ retirada' },
  { valor: 'entregue', texto: 'Entregue' },
];

function obterProximoStatus(pedido) {
  const fluxo = pedido.tipo === 'retirada'
    ? STATUS_RETIRADA
    : STATUS_ENTREGA;

  const indiceAtual = fluxo.findIndex(
    (item) => item.valor === pedido.status
  );

  if (indiceAtual === -1 || indiceAtual === fluxo.length - 1) {
    return null;
  }

  return fluxo[indiceAtual + 1];
}


export default function PedidosAdminScreen() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [pedidoAtualizando, setPedidoAtualizando] = useState(null);

  async function alterarStatus(pedidoId, novoStatus) {
  try {
    setPedidoAtualizando(pedidoId);

    const pedidoAtualizado = await atualizarStatusPedido({
      pedidoId,
      novoStatus,
    });

    setPedidos((pedidosAtuais) =>
      pedidosAtuais.map((pedido) =>
        pedido.id === pedidoId
          ? { ...pedido, status: pedidoAtualizado.status }
          : pedido
      )
    );

    Alert.alert('Sucesso', 'Status do pedido atualizado.');
  } catch (error) {
    Alert.alert('Erro', error.message);
  } finally {
    setPedidoAtualizando(null);
  }
}

  useEffect(() => {
    async function carregarPedidos() {
      try {
        const dados = await listarPedidosAdmin();
        setPedidos(dados);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarPedidos();
  }, []);

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Carregando pedidos...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.container}>
        <Text style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>
        Pedidos ({pedidos.length})
      </Text>

      {pedidos.length === 0 ? (
        <Text>Nenhum pedido cadastrado.</Text>
      ) : (
        pedidos.map((pedido) => {
  const proximoStatus = obterProximoStatus(pedido);

  return (
          <View key={pedido.id} style={styles.item}>
            <Text style={styles.nome}>
              Pedido #{pedido.numero}
            </Text>

            <Text>
              Cliente: {pedido.clientes?.nome || 'Não identificado'}
            </Text>

            <Text>
              Telefone: {pedido.clientes?.telefone || 'Não informado'}
            </Text>

            <Text>
               Status: {
                pedido.status === 'pronto' && pedido.tipo === 'retirada'
                  ? 'Pronto p/ retirada'
                    : pedido.status === 'em_preparo'
                      ? 'Em preparo'
                        : pedido.status === 'saiu_entrega'
                          ? 'Saiu para entrega'
                          : pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)
                        }
            </Text>

            <Text>Tipo: {pedido.tipo}</Text>
            <Text>Pagamento: {pedido.pagamento}</Text>

            <Text>
              Total: R$ {Number(pedido.total).toFixed(2)}
            </Text>

           {proximoStatus && (
  <TouchableOpacity
    style={styles.botaoStatus}
    disabled={pedidoAtualizando === pedido.id}
    onPress={() => alterarStatus(pedido.id, proximoStatus.valor)}
  >
    <Text style={styles.textoBotaoStatus}>
      {pedidoAtualizando === pedido.id
        ? 'Atualizando...'
        : `Avançar para: ${proximoStatus.texto}`}
    </Text>
  </TouchableOpacity>
)}
          </View>
          );
})
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },

  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  item: {
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },

  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  botaoStatus: {
  backgroundColor: '#15803D',
  padding: 12,
  borderRadius: 8,
  marginTop: 12,
  alignItems: 'center',
},

textoBotaoStatus: {
  color: '#FFFFFF',
  fontWeight: 'bold',
},

  erro: {
    color: 'red',
  },
});
