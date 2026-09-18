import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function CarrinhoScreen({ route, navigation }) {

  const produto = route.params?.produto;

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
            R$ {produto.preco.toFixed(2)}
          </Text>

          <Text style={styles.quantidade}>
            Quantidade: 1
          </Text>
        </>
      ) : (
        <Text>Seu carrinho está vazio.</Text>
      )}

      <Button
        title="Finalizar Pedido"
        onPress={() => alert('Em breve vamos finalizar o pedido!')}
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
    marginBottom: 20,
  },

  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  preco: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },

  quantidade: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
  },
});