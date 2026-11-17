import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import { useCardapio } from '../hooks/useCardapio';
import { formatarPreco } from '../services/cardapioService';
import { cores } from '../theme/theme';

export default function CardapioScreen({ navigation, route }) {
  const {
  categorias,
  produtos,
  categoriaAtiva,
  setCategoriaAtiva,
  carregando,
  erro
} = useCardapio(route.params?.categoriaSlug ?? null);

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
    <TouchableOpacity
      key={categoria.id}
      style={[
  styles.categoriaBotao,
  categoriaAtiva === categoria.slug && styles.categoriaBotaoAtivo
]}
      onPress={() => setCategoriaAtiva(categoria.slug)}
    >
      <Text
  style={[
    styles.categoriaTexto,
    categoriaAtiva === categoria.slug && styles.categoriaTextoAtivo
  ]}
>
        {categoria.nome}
      </Text>
    </TouchableOpacity>
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

          <TouchableOpacity
  style={styles.botaoProduto}
  onPress={() =>
    navigation.navigate('Produto', {
      produto: produto
    })
  }
>
  <Text style={styles.textoBotaoProduto}>
    Ver Produto
  </Text>
</TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
  style={styles.botaoVoltar}
  onPress={() => navigation.goBack()}
>
  <Text style={styles.textoBotaoVoltar}>
    Voltar
  </Text>
</TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

categoriaBotaoAtivo: {
  backgroundColor: cores.primaria,
  borderColor: cores.primaria,
},

categoriaTextoAtivo: {
  color: cores.branco,
},

botaoVoltar: {
  backgroundColor: cores.branco,
  borderWidth: 1,
  borderColor: cores.primaria,
  borderRadius: 10,
  paddingVertical: 14,
  alignItems: 'center',
  marginTop: 10,
  marginBottom: 20,
},

textoBotaoVoltar: {
  color: cores.primaria,
  fontSize: 15,
  fontWeight: '600',
},

botaoProduto: {
  backgroundColor: cores.primaria,
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 8,
},

textoBotaoProduto: {
  color: cores.branco,
  fontSize: 15,
  fontWeight: '600',
},

  container: {
  flexGrow: 1,
  padding: 20,
  backgroundColor: cores.fundo,
},

  titulo: {
  fontSize: 28,
  fontWeight: '700',
  color: cores.texto,
  marginBottom: 20,
},

  subtitulo: {
  fontSize: 20,
  fontWeight: '700',
  color: cores.texto,
  marginBottom: 14,
},

  categorias: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
  marginBottom: 25,
},

categoriaBotao: {
  backgroundColor: cores.branco,
  borderWidth: 1,
  borderColor: cores.borda,
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 14,
  alignItems: 'center',
  justifyContent: 'center',
},

categoriaTexto: {
  fontSize: 14,
  fontWeight: '600',
  color: cores.primaria,
},

  produto: {
  backgroundColor: cores.branco,
  borderWidth: 1,
  borderColor: cores.borda,
  borderRadius: 16,
  padding: 16,
  marginBottom: 16,
},

  nomeProduto: {
  fontSize: 18,
  fontWeight: '700',
  color: cores.texto,
  marginBottom: 6,
},

  preco: {
  fontSize: 18,
  fontWeight: '700',
  color: cores.primaria,
  marginTop: 10,
  marginBottom: 12,
},
});
