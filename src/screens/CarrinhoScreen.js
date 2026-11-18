
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { cores } from '../theme/theme';
import { useCarrinho } from '../context/CarrinhoContext';

export default function CarrinhoScreen({ navigation }) {
  const {
    itens,
    alterarQuantidade,
    removerProduto,
    total
  } = useCarrinho();

  function formatarPreco(valor) {
    return Number(valor || 0).toFixed(2).replace('.', ',');
  }

  function renderizarProduto({ item }) {
    return (
      <View style={styles.produto}>
        <Text style={styles.nome}>{item.nome}</Text>

        <Text style={styles.descricao}>
          {item.descricao}
        </Text>

        <Text style={styles.preco}>
          R$ {formatarPreco(item.preco)}
        </Text>

        <View style={styles.quantidadeContainer}>
          <TouchableOpacity
            style={styles.botaoQuantidade}
            onPress={() => alterarQuantidade(item.id, -1)}
          >
            <Text style={styles.textoBotao}>−</Text>
          </TouchableOpacity>

          <Text style={styles.quantidade}>
            {item.quantidade}
          </Text>

          <TouchableOpacity
            style={styles.botaoQuantidade}
            onPress={() => alterarQuantidade(item.id, 1)}
          >
            <Text style={styles.textoBotao}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtotal}>
          Subtotal: R$ {formatarPreco(item.preco * item.quantidade)}
        </Text>

        <TouchableOpacity
          onPress={() => removerProduto(item.id)}
        >
          <Text style={styles.remover}>Remover produto</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meu Carrinho</Text>

      <FlatList
        data={itens}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderizarProduto}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            Seu carrinho está vazio.
          </Text>
        }
      />

      <View style={styles.rodape}>
        <Text style={styles.total}>
          Total: R$ {formatarPreco(total)}
        </Text>

        {itens.length > 0 && (
          <TouchableOpacity
            style={styles.botaoFinalizar}
            onPress={() => navigation.navigate('Finalizacao')}
          >
            <Text style={styles.textoBotaoFinalizar}>
              Finalizar Pedido
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.navigate('Cardapio')}
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
    padding: 20
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 20
  },
  lista: {
    paddingBottom: 20,
    flexGrow: 1
  },
  produto: {
    backgroundColor: cores.branco,
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2
  },
  nome: {
    fontSize: 20,
    fontWeight: '700',
    color: cores.texto
  },
  descricao: {
    fontSize: 14,
    color: '#666',
    marginVertical: 6
  },
  preco: {
    fontSize: 18,
    color: cores.primaria,
    fontWeight: '600',
    marginTop: 8
  },
  quantidadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15
  },
  botaoQuantidade: {
    backgroundColor: cores.primaria,
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textoBotao: {
    color: cores.branco,
    fontSize: 22,
    fontWeight: '700'
  },
  quantidade: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 20,
    color: cores.texto
  },
  subtotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.texto
  },
  remover: {
    color: '#d32f2f',
    marginTop: 12,
    fontWeight: '600'
  },
  vazio: {
    textAlign: 'center',
    fontSize: 18,
    color: '#777',
    marginTop: 50
  },
  rodape: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 15
  },
  total: {
    fontSize: 24,
    fontWeight: '700',
    color: cores.primaria,
    marginBottom: 20
  },
  botaoFinalizar: {
    backgroundColor: cores.primaria,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12
  },
  textoBotaoFinalizar: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: '700'
  },
  botaoVoltar: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.primaria,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center'
  },
  textoBotaoVoltar: {
    color: cores.primaria,
    fontSize: 15,
    fontWeight: '600'
  }
});
