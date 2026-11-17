import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { cores } from '../theme/theme';

export default function CarrinhoScreen({ route, navigation }) {

  const produto = route.params?.produto;

  const [quantidade, setQuantidade] = useState(1);

  function aumentarQuantidade() {
    setQuantidade(quantidade + 1);
  }

  function diminuirQuantidade() {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  }

  const total = produto
    ? produto.preco * quantidade
    : 0;

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Carrinho
      </Text>

      {produto ? (
        <>
          <Text style={styles.nome}>
            {produto.nome}
          </Text>

          <Text>
            {produto.descricao}
          </Text>

          <Text style={styles.preco}>
            Preço: R$ {produto.preco.toFixed(2)}
          </Text>

          <Text style={styles.subtitulo}>
            Quantidade
          </Text>

          <View style={styles.quantidadeContainer}>

            <TouchableOpacity
  style={styles.botaoQuantidade}
  onPress={diminuirQuantidade}
>
  <Text style={styles.textoBotaoQuantidade}>−</Text>
</TouchableOpacity>

<Text style={styles.quantidade}>
  {quantidade}
</Text>

<TouchableOpacity
  style={styles.botaoQuantidade}
  onPress={aumentarQuantidade}
>
  <Text style={styles.textoBotaoQuantidade}>+</Text>
</TouchableOpacity>

          </View>

          <Text style={styles.total}>
            Total: R$ {total.toFixed(2)}
          </Text>

          <TouchableOpacity
  style={styles.botaoFinalizar}
  onPress={() =>
    navigation.navigate('Finalizacao', {
      produto: produto,
      quantidade: quantidade,
      total: total
    })
  }
>
  <Text style={styles.textoBotaoFinalizar}>
    Finalizar Pedido
  </Text>
</TouchableOpacity>

        </>
      ) : (
        <Text>Seu carrinho está vazio.</Text>
      )}

      <View style={styles.espaco}>
  <TouchableOpacity
    style={styles.botaoVoltar}
    onPress={() => navigation.goBack()}
  >
    <Text style={styles.textoBotaoVoltar}>
      Voltar
    </Text>
  </TouchableOpacity>
</View>

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

botaoQuantidade: {
  backgroundColor: cores.primaria,
  width: 40,
  height: 40,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
},

textoBotaoQuantidade: {
  color: cores.branco,
  fontSize: 22,
  fontWeight: '700',
},

botaoFinalizar: {
  backgroundColor: cores.primaria,
  paddingVertical: 16,
  paddingHorizontal: 20,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 12,
},

textoBotaoFinalizar: {
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
  fontSize: 28,
  fontWeight: '700',
  color: cores.texto,
  marginBottom: 24,
},

  nome: {
  fontSize: 20,
  fontWeight: '700',
  color: cores.texto,
  marginBottom: 8,
},

  preco: {
  fontSize: 18,
  color: cores.primaria,
  fontWeight: '600',
  marginTop: 12,
},

  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },

  quantidadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  quantidade: {
    fontSize: 22,
    marginHorizontal: 20,
  },

  total: {
  fontSize: 24,
  fontWeight: '700',
  color: cores.primaria,
  marginBottom: 24,
},

  espaco: {
    marginTop: 10,
  },

});