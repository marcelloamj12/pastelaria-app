import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import { buscarProduto, formatarPreco } from '../services/cardapioService';

export default function ProdutoScreen({ route, navigation }) {
  const { produto: produtoInicial } = route.params;

  const [produto, setProduto] = useState(produtoInicial);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarProduto() {
      try {
        setCarregando(true);
        setErro(null);

        const dados = await buscarProduto(produtoInicial.id);
        setProduto(dados);
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarProduto();
  }, [produtoInicial.id]);

  if (carregando) {
    return (
      <View style={styles.container}>
        <Text>Carregando produto...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.container}>
        <Text>Erro ao carregar o produto: {erro}</Text>

        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {produto.nome}
      </Text>

      <Text style={styles.descricao}>
        {produto.descricao}
      </Text>

      <Text style={styles.preco}>
        {formatarPreco(produto.preco)}
      </Text>

      <Button
        title="Adicionar ao Carrinho"
        onPress={() =>
          navigation.navigate('Carrinho', {
            produto: produto
          })
        }
      />

      <Button
        title="Voltar"
        onPress={() => navigation.goBack()}
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
    fontWeight: 'bold',
    marginBottom: 10,
  },

  descricao: {
    fontSize: 18,
    marginBottom: 10,
  },

  preco: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
