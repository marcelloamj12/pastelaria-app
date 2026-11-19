
import React, { useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useCardapio } from '../hooks/useCardapio';
import { formatarPreco } from '../services/cardapioService';
import { cores } from '../theme/theme';
import { imagensProdutos } from '../assets/imageMappings';

export default function CardapioScreen({ navigation, route }) {
  const scrollRef = useRef(null);

  const {
  categorias,
  produtos,
  categoriaAtiva,
  setCategoriaAtiva,
  carregando,
  erro,
  recarregar,
} = useCardapio(route.params?.categoriaSlug ?? null);

  // Atualiza o filtro quando uma categoria é selecionada na Home.
  useEffect(() => {
    setCategoriaAtiva(route.params?.categoriaSlug ?? null);
  }, [route.params?.categoriaSlug, setCategoriaAtiva]);

  // Ao clicar diretamente na aba Cardápio, exibe todos os produtos.
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      setCategoriaAtiva(null);
      navigation.setParams({ categoriaSlug: null });

      scrollRef.current?.scrollTo({
        y: 0,
        animated: false,
      });
    });

    return unsubscribe;
  }, [navigation, setCategoriaAtiva]);

  // Volta ao topo sempre que o Cardápio recebe o foco.
  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: false,
      });
    }, [])
  );

  function selecionarCategoria(slug) {
    navigation.setParams({ categoriaSlug: slug });
    setCategoriaAtiva(slug);

    scrollRef.current?.scrollTo({
      y: 0,
      animated: false,
    });
  }

  if (carregando) {
  return (
    <View style={styles.container}>
      <Text style={styles.mensagemInformativa}>
        Carregando cardápio...
      </Text>
    </View>
  );
}

  if (erro) {
  return (
    <View style={styles.container}>
      <Text style={styles.mensagemErro}>
        Não foi possível carregar o cardápio no momento.
        Verifique sua conexão e tente novamente.
      </Text>

      <TouchableOpacity
        style={styles.botaoTentarNovamente}
        onPress={recarregar}
      >
        <Text style={styles.textoTentarNovamente}>
          Tentar novamente
        </Text>
      </TouchableOpacity>
    </View>
  );
}

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {/* Categorias */}
      <Text style={styles.subtitulo}>
        Categorias
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriasScroll}
        contentContainerStyle={styles.categorias}
      >
        {categorias.map((categoria) => (
          <TouchableOpacity
            key={categoria.id}
            style={[
              styles.categoriaBotao,
              categoriaAtiva === categoria.slug &&
                styles.categoriaBotaoAtivo,
            ]}
            onPress={() =>
              selecionarCategoria(categoria.slug)
            }
          >
            <Text
              style={[
                styles.categoriaTexto,
                categoriaAtiva === categoria.slug &&
                  styles.categoriaTextoAtivo,
              ]}
            >
              {categoria.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de produtos */}
{produtos.length === 0 && (
  <Text style={styles.mensagemInformativa}>
    Nenhum produto disponível nesta categoria no momento.
  </Text>
)}

<View style={styles.listaProdutos}>
        {produtos.map((produto) => (
          <TouchableOpacity
            key={produto.id}
            style={styles.produto}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('Produto', {
                produto: produto,
              })
            }
          >
            {imagensProdutos[produto.nome] ? (
              <Image
                source={imagensProdutos[produto.nome]}
                style={styles.produtoImagem}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.produtoImagemVazia}>
                <Text style={styles.textoImagemVazia}>
                  Sem imagem
                </Text>
              </View>
            )}

            <View style={styles.produtoInformacoes}>
              <Text
                style={styles.nomeProduto}
                numberOfLines={2}
              >
                {produto.nome}
              </Text>

              <Text
                style={styles.descricaoProduto}
                numberOfLines={3}
              >
                {produto.descricao}
              </Text>

              <Text style={styles.preco}>
                {formatarPreco(produto.preco)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Voltar à Home */}
      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.textoBotaoVoltar}>
          Voltar ao Início
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: cores.fundo,
  },

  // Categorias

  subtitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 14,
  },

  categoriasScroll: {
    flexGrow: 0,
    marginBottom: 24,
  },

  categorias: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 8,
  },

  categoriaBotao: {
    backgroundColor: cores.cinzaClaro,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoriaBotaoAtivo: {
    backgroundColor: cores.primaria,
  },

  categoriaTexto: {
    fontSize: 13,
    fontWeight: '500',
    color: cores.texto,
  },

  categoriaTextoAtivo: {
    color: cores.branco,
    fontWeight: '600',
  },

  // Lista de produtos

  listaProdutos: {
    gap: 12,
  },

  produto: {
  flexDirection: 'row',
  backgroundColor: cores.cinzaClaro,
  borderRadius: 14,
  overflow: 'hidden',
  height: 140,
  marginBottom: 12,
},

  produtoImagem: {
  width: '43%',
  height: 140,
  backgroundColor: cores.cinzaClaro,
},

  produtoImagemVazia: {
  width: '43%',
  height: 140,
  backgroundColor: cores.borda,
  alignItems: 'center',
  justifyContent: 'center',
},

  textoImagemVazia: {
    fontSize: 12,
    color: '#888888',
  },

  produtoInformacoes: {
  flex: 1,
  padding: 12,
  justifyContent: 'center',
},

  nomeProduto: {
    fontSize: 14,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 6,
  },

  descricaoProduto: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 17,
    marginBottom: 8,
  },

  preco: {
    fontSize: 14,
    fontWeight: '700',
    color: cores.primaria,
  },

  // Botão voltar

  botaoVoltar: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.primaria,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },

  textoBotaoVoltar: {
    color: cores.primaria,
    fontSize: 15,
    fontWeight: '600',
  },

  mensagemInformativa: {
  color: '#666666',
  fontSize: 15,
  textAlign: 'center',
  marginVertical: 20,
  lineHeight: 22,
  },

  mensagemErro: {
  color: '#B91C1C',
  backgroundColor: '#FEF2F2',
  padding: 14,
  borderRadius: 10,
  fontSize: 14,
  textAlign: 'center',
  lineHeight: 21,
  marginBottom: 16,
  },

  botaoTentarNovamente: {
  backgroundColor: cores.primaria,
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderRadius: 10,
  alignItems: 'center',
  },

  textoTentarNovamente: {
  color: cores.branco,
  fontSize: 15,
  fontWeight: '600',
  },

});
