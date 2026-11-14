
// tela teste do admin sobre os clientes


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { listarClientesAdmin } from '../services/adminService';

export default function ClientesAdminScreen() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarClientes() {
      try {
        const dados = await listarClientesAdmin();
        setClientes(dados);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarClientes();
  }, []);

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Carregando clientes...</Text>
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
        Clientes ({clientes.length})
      </Text>

      {clientes.length === 0 ? (
        <Text>Nenhum cliente cadastrado.</Text>
      ) : (
        clientes.map((cliente) => (
          <View key={cliente.id} style={styles.item}>
            <Text style={styles.nome}>{cliente.nome}</Text>
            <Text>Telefone: {cliente.telefone}</Text>
            <Text>Email: {cliente.email || 'Não informado'}</Text>
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
