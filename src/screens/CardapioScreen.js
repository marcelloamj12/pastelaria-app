import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView
} from 'react-native';

import produtos from '../data/produtos';

export default function CardapioScreen({ navigation }) {

  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Pasteis');

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