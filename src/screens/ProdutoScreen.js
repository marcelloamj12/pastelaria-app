import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ProdutoScreen({ route, navigation }) {

  const { produto } = route.params;

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        {produto.nome}
      </Text>

      <Text style={styles.descricao}>
        {produto.descricao}
      </Text>

      <Text style={styles.preco}>
        R$ {produto.preco.toFixed(2)}
      </Text>

      <Button
        title="Adicionar ao Carrinho"
        onPress={() => {
          alert(`${produto.nome} adicionado ao carrinho!`);
        }}
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