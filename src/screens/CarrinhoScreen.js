
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import { cores } from '../theme/theme';
import { useCarrinho } from '../context/CarrinhoContext';
import { imagensProdutos } from '../assets/imageMappings';

export default function CarrinhoScreen({ navigation }) {
  const {
    itens,
    alterarQuantidade,
    removerProduto,
    total,
  } = useCarrinho();

  function formatarPreco(valor) {
    return `R$ ${Number(valor || 0)
      .toFixed(2)
      .replace('.', ',')}`;
  }

  function renderizarProduto({ item }) {
    const chave = item.chave ?? item.id;

    return (
      <View style={styles.produto}>
        <View style={styles.produtoLinha}>
          {imagensProdutos[item.nome] ? (
            <Image
              source={imagensProdutos[item.nome]}
              style={styles.produtoImagem}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagemVazia}>
              <Text style={styles.imagemVaziaTexto}>
                Sem imagem
              </Text>
            </View>
          )}

          <View style={styles.produtoInformacoes}>
            <Text
              style={styles.nome}
              numberOfLines={2}
            >
              {item.nome}
            </Text>

            <Text style={styles.preco}>
              {formatarPreco(item.preco)}
            </Text>

            <View style={styles.quantidadeContainer}>
              <TouchableOpacity
                style={styles.botaoQuantidade}
                onPress={() =>
                  alterarQuantidade(chave, -1)
                }
              >
                <Text style={styles.textoBotao}>
                  −
                </Text>
              </TouchableOpacity>

              <Text style={styles.quantidade}>
                {item.quantidade}
              </Text>

              <TouchableOpacity
                style={styles.botaoQuantidade}
                onPress={() =>
                  alterarQuantidade(chave, 1)
                }
              >
                <Text style={styles.textoBotao}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {Boolean(item.observacao) && (
          <View style={styles.observacaoContainer}>
            <Text style={styles.observacaoTitulo}>
              Observações:
            </Text>

            <Text style={styles.observacaoTexto}>
              {item.observacao}
            </Text>
          </View>
        )}

        <View style={styles.produtoRodape}>
          <Text style={styles.subtotal}>
            Subtotal: {formatarPreco(
              item.preco * item.quantidade
            )}
          </Text>

          <TouchableOpacity
            onPress={() => removerProduto(chave)}
          >
            <Text style={styles.remover}>
              Remover
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Meu Carrinho
      </Text>

      <FlatList
        data={itens}
        keyExtractor={(item) =>
          String(item.chave ?? item.id)
        }
        renderItem={renderizarProduto}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            Seu carrinho está vazio.
          </Text>
        }
      />

      <View style={styles.rodape}>
        <View style={styles.totalLinha}>
          <Text style={styles.totalLabel}>
            Total
          </Text>

          <Text style={styles.totalValor}>
            {formatarPreco(total)}
          </Text>
        </View>

        {itens.length > 0 && (
          <TouchableOpacity
            style={styles.botaoFinalizar}
            onPress={() =>
              navigation.navigate('Finalizacao')
            }
          >
            <Text style={styles.textoBotaoFinalizar}>
              Finalizar Pedido
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() =>
            navigation.navigate('Cardapio')
          }
        >
          <Text style={styles.textoBotaoVoltar}>
            Continuar Comprando
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    padding: 20,
  },

  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 18,
  },

  lista: {
    paddingBottom: 20,
    flexGrow: 1,
  },

  // Card do produto

  produto: {
    backgroundColor: cores.cinzaClaro,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },

  produtoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  produtoImagem: {
    width: 86,
    height: 86,
    borderRadius: 10,
  },

  imagemVazia: {
    width: 86,
    height: 86,
    borderRadius: 10,
    backgroundColor: cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imagemVaziaTexto: {
    fontSize: 11,
    color: '#888888',
  },

  produtoInformacoes: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },

  nome: {
    fontSize: 15,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 5,
  },

  preco: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.primaria,
  },

  // Quantidade

  quantidadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  botaoQuantidade: {
    width: 29,
    height: 29,
    borderRadius: 7,
    backgroundColor: cores.branco,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoBotao: {
    color: cores.texto,
    fontSize: 19,
    fontWeight: '700',
  },

  quantidade: {
    fontSize: 15,
    fontWeight: '600',
    color: cores.texto,
    marginHorizontal: 13,
  },

  // Observações

  observacaoContainer: {
    marginTop: 10,
    padding: 9,
    backgroundColor: cores.branco,
    borderRadius: 8,
  },

  observacaoTitulo: {
    fontSize: 12,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 3,
  },

  observacaoTexto: {
    fontSize: 12,
    color: cores.textoSecundario,
  },

  // Subtotal e remoção

  produtoRodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },

  subtotal: {
    fontSize: 13,
    fontWeight: '700',
    color: cores.texto,
  },

  remover: {
    fontSize: 12,
    color: cores.primaria,
    textDecorationLine: 'underline',
  },

  vazio: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777777',
    marginTop: 50,
  },

  // Rodapé do Carrinho

  rodape: {
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    paddingTop: 15,
  },

  totalLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: cores.texto,
  },

  totalValor: {
    fontSize: 22,
    fontWeight: '700',
    color: cores.primaria,
  },

  botaoFinalizar: {
    backgroundColor: cores.primaria,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },

  textoBotaoFinalizar: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: '700',
  },

  botaoVoltar: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.primaria,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },

  textoBotaoVoltar: {
    color: cores.primaria,
    fontSize: 15,
    fontWeight: '600',
  },
});
