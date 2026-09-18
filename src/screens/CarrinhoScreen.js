import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet
} from 'react-native';

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

            <Button
              title="-"
              onPress={diminuirQuantidade}
            />

            <Text style={styles.quantidade}>
              {quantidade}
            </Text>

            <Button
              title="+"
              onPress={aumentarQuantidade}
            />

          </View>

          <Text style={styles.total}>
            Total: R$ {total.toFixed(2)}
          </Text>

          <Button
            title="Finalizar Pedido"
            onPress={() =>
              navigation.navigate('Finalizacao', {
                produto: produto,
                quantidade: quantidade,
                total: total
              })
            }
          />

        </>
      ) : (
        <Text>Seu carrinho está vazio.</Text>
      )}

      <View style={styles.espaco}>
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
        />
      </View>

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
    marginBottom: 20,
  },

  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  preco: {
    fontSize: 18,
    marginTop: 10,
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  espaco: {
    marginTop: 10,
  },

});