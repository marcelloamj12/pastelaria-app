import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

import { buscarProduto, formatarPreco } from '../services/cardapioService';
import { cores } from '../theme/theme';

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

      <TouchableOpacity
  style={styles.botaoCarrinho}
  onPress={() =>
    navigation.navigate('Carrinho', {
      produto: produto
    })
  }
>
  <Text style={styles.textoBotaoCarrinho}>
    Adicionar ao Carrinho
  </Text>
</TouchableOpacity>

      <TouchableOpacity
  style={styles.botaoVoltar}
  onPress={() => navigation.goBack()}
>
  <Text style={styles.textoBotaoVoltar}>
    Voltar
  </Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
  flex: 1,
  justifyContent: 'flex-start',
  backgroundColor: cores.fundo,
  padding: 20,
},

botaoCarrinho: {
  backgroundColor: cores.primaria,
  paddingVertical: 16,
  paddingHorizontal: 20,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 12,
},

textoBotaoCarrinho: {
  color: cores.branco,
  fontSize: 16,
  fontWeight: '700',
},

botaoVoltar: {
  backgroundColor: cores.branco,
  borderWidth: 1,
  borderColor: cores.primaria,
  borderRadius: 12,
  paddingVertical: 14,
  alignItems: 'center',
},

textoBotaoVoltar: {
  color: cores.primaria,
  fontSize: 15,
  fontWeight: '600',
},

  titulo: {
  fontSize: 26,
  fontWeight: '700',
  color: cores.texto,
  marginBottom: 12,
},

  descricao: {
  fontSize: 16,
  color: cores.textoSecundario,
  lineHeight: 24,
  marginBottom: 20,
},

  preco: {
  fontSize: 26,
  fontWeight: '700',
  color: cores.primaria,
  marginBottom: 24,
},
});
