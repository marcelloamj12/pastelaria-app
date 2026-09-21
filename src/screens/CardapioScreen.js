import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView
} from 'react-native';

import { useCardapio } from '../hooks/useCardapio';
import { formatarPreco } from '../services/cardapioService';

export default function CardapioScreen({ navigation }) {
  const {
    categorias,
    produtos,
    setCategoriaAtiva,
    carregando,
    erro
  } = useCardapio();

  if (carregando) {
    return (
      <View style={styles.container}>
        <Text>Carregando cardápio...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.container}>
        <Text>Erro ao carregar o cardápio: {erro}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>
        Cardápio
      </Text>

      <Text style={styles.subtitulo}>
        Categorias
      </Text>

      <View style={styles.categorias}>
        {categorias.map((categoria) => (
          <Button
            key={categoria.id}
            title={categoria.nome}
            onPress={() => setCategoriaAtiva(categoria.slug)}
          />
        ))}
      </View>

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
            {formatarPreco(produto.preco)}
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
