
// tela teste de admin sobre os items dos pedidos


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { listarItensPedidosAdmin } from '../services/adminService';

export default function ItensPedidosAdminScreen() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // agrupa os itens de cada pedido 
  const pedidosAgrupados = itens.reduce((grupos, item) => {
  const pedidoId = item.pedido_id;

  if (!grupos[pedidoId]) {
    grupos[pedidoId] = {
      numero: item.pedidos?.numero,
      itens: [],
    };
  }

  grupos[pedidoId].itens.push(item);

  return grupos;
}, {});

  useEffect(() => {
    async function carregarItens() {
      try {
        const dados = await listarItensPedidosAdmin();
        setItens(dados);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarItens();
  }, []);

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Carregando itens...</Text>
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
        Itens dos pedidos ({itens.length})
      </Text>

      {itens.length === 0 ? (
        <Text>Nenhum item cadastrado.</Text>
      ) : (
        Object.entries(pedidosAgrupados).map(([pedidoId, grupo]) => (
    <View key={pedidoId} style={styles.pedido}>
      <Text style={styles.tituloPedido}>
        Pedido #{grupo.numero || pedidoId}
      </Text>

      {grupo.itens.map((item) => (
        <View key={item.id} style={styles.item}>
          <Text style={styles.nome}>
            {item.nome_produto}
          </Text>

          <Text>Quantidade: {item.quantidade}</Text>

          <Text>
            Preço unitário: R$ {Number(item.preco_unitario).toFixed(2)}
          </Text>

          <Text>
            Subtotal: R$ {Number(item.subtotal).toFixed(2)}
          </Text>

          <Text>
            Observação: {item.observacao || 'Nenhuma'}
          </Text>
        </View>
      ))}
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

  pedido: {
  padding: 15,
  marginBottom: 20,
  borderWidth: 2,
  borderColor: '#2563EB',
  borderRadius: 10,
},

tituloPedido: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 12,
},

  erro: {
    color: 'red',
  },
});
