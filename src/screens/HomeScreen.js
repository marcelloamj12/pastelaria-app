import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import { listarDestaques, formatarPreco } from '../services/cardapioService';

export default function HomeScreen({ navigation }) {
  const [destaques, setDestaques] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarDestaques() {
      try {
        setCarregando(true);
        setErro(null);

        const dados = await listarDestaques();
        setDestaques(dados);
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarDestaques();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Menu Digital</Text>

      <Text style={styles.subtitulo}>Mais pedidos</Text>

      {carregando && (
        <Text>Carregando destaques...</Text>
      )}

      {erro && (
        <Text>Erro ao carregar os destaques: {erro}</Text>
      )}

      {!carregando && !erro && destaques.map((produto) => (
        <View
          key={produto.id}
          style={styles.produto}
        >
          <Text style={styles.nomeProduto}>
            {produto.nome}
          </Text>

          <Text>
            {produto.descricao}
          </Text>

          <Text style={styles.preco}>
            {formatarPreco(produto.preco)}
          </Text>

          <Button
            title="Ver Produto"
            onPress={() =>
              navigation.navigate('Produto', {
                produto: produto
              })
            }
          />
        </View>
      ))}

      <Button
        title="Ver Cardápio"
        onPress={() => navigation.navigate('Cardapio')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  titulo: {
    fontSize: 30,
    marginBottom: 20,
  },

  subtitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  produto: {
    marginBottom: 20,
  },

  nomeProduto: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  preco: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
  },
});
