
// tela teste de admin sobre os pedidos


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { listarPedidosAdmin } from '../services/adminService';

export default function PedidosAdminScreen() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

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
        pedidos.map((pedido) => (
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

            <Text>Status: {pedido.status}</Text>
            <Text>Tipo: {pedido.tipo}</Text>
            <Text>Pagamento: {pedido.pagamento}</Text>

            <Text>
              Total: R$ {Number(pedido.total).toFixed(2)}
            </Text>
          </View>
        ))
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

  erro: {
    color: 'red',
  },
});
