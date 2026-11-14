
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
        itens.map((item) => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.nome}>
              {item.nome_produto}
            </Text>

            <Text>Pedido: {item.pedido_id}</Text>
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
