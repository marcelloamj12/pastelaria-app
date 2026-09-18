import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

export default function CardapioScreen({ navigation }) {

  const produtos = [
    {
      id: 1,
      nome: 'Pastel de Carne',
      descricao: 'Pastel recheado com carne moída.',
      preco: 10.00,
    },
    {
      id: 2,
      nome: 'Pastel de Queijo',
      descricao: 'Pastel recheado com queijo.',
      preco: 9.00,
    },
    {
      id: 3,
      nome: 'Pastel de Frango',
      descricao: 'Pastel recheado com frango.',
      preco: 10.00,
    },
    {
      id: 4,
      nome: 'Pastel de Calabresa',
      descricao: 'Pastel recheado com calabresa e queijo.',
      preco: 12.00,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.titulo}>
        Cardápio
      </Text>

      {produtos.map((produto) => (

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

        </View>

      ))}

      <Button
        title="Voltar"
        onPress={() => navigation.goBack()}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    padding: 20,
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  produto: {
    marginBottom: 30,
  },

  nomeProduto: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  preco: {
    fontSize: 18,
    marginTop: 5,
    marginBottom: 10,
  },

});