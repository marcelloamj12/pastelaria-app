import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView
} from 'react-native';

export default function CardapioScreen({ navigation }) {

  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Pasteis');

  const produtos = [
    {
      id: 1,
      nome: 'Pastel de Carne',
      descricao: 'Pastel recheado com carne moída.',
      preco: 10.00,
      categoria: 'Pasteis',
    },
    {
      id: 2,
      nome: 'Pastel de Queijo',
      descricao: 'Pastel recheado com queijo.',
      preco: 9.00,
      categoria: 'Pasteis',
    },
    {
      id: 3,
      nome: 'Pastel de Frango',
      descricao: 'Pastel recheado com frango.',
      preco: 10.00,
      categoria: 'Pasteis',
    },
    {
      id: 4,
      nome: 'Pastel de Calabresa',
      descricao: 'Pastel recheado com calabresa e queijo.',
      preco: 12.00,
      categoria: 'Pasteis',
    },
    {
      id: 5,
      nome: 'Coca-Cola',
      descricao: 'Refrigerante Coca-Cola 350ml.',
      preco: 6.00,
      categoria: 'Bebidas',
    },
    {
      id: 6,
      nome: 'Guaraná',
      descricao: 'Refrigerante Guaraná 350ml.',
      preco: 5.00,
      categoria: 'Bebidas',
    },
    {
      id: 7,
      nome: 'Água Mineral',
      descricao: 'Água mineral 500ml.',
      preco: 3.00,
      categoria: 'Bebidas',
    },
    {
      id: 8,
      nome: 'Combo Pastel + Refrigerante',
      descricao: 'Um pastel de carne acompanhado de refrigerante.',
      preco: 15.00,
      categoria: 'Combos',
    },
  ];

  const produtosFiltrados = produtos.filter(
    (produto) => produto.categoria === categoriaSelecionada
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.titulo}>
        Cardápio
      </Text>

      <Text style={styles.subtitulo}>
        Categorias
      </Text>

      <View style={styles.categorias}>

        <Button
          title="Pastéis"
          onPress={() => setCategoriaSelecionada('Pasteis')}
        />

        <Button
          title="Bebidas"
          onPress={() => setCategoriaSelecionada('Bebidas')}
        />

        <Button
          title="Combos"
          onPress={() => setCategoriaSelecionada('Combos')}
        />

      </View>

      <Text style={styles.categoriaAtual}>
        {categoriaSelecionada}
      </Text>

      {produtosFiltrados.map((produto) => (

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
    marginBottom: 20,
  },

  subtitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  categorias: {
    gap: 10,
    marginBottom: 25,
  },

  categoriaAtual: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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