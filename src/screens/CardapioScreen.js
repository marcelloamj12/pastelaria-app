import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function CardapioScreen({ navigation }) {

  const produto = {
    id: 1,
    nome: 'Pastel de Carne',
    descricao: 'Pastel recheado com carne moída.',
    preco: 10.00,
  };

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Cardápio
      </Text>

      <Text style={styles.nomeProduto}>
        {produto.nome}
      </Text>

      <Text>
        R$ {produto.preco.toFixed(2)}
      </Text>

      <Button
        title="Ver Produto"
        onPress={() =>
          navigation.navigate('Produto', {
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
    marginBottom: 20,
  },

  nomeProduto: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});