import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';

import {
  buscarProduto,
  formatarPreco,
} from '../services/cardapioService';

import { cores } from '../theme/theme';
import { useCarrinho } from '../context/CarrinhoContext';
import { imagensProdutos } from '../assets/imageMappings';

export default function ProdutoScreen({ route, navigation }) {
  const { produto: produtoInicial } = route.params;

  const [produto, setProduto] = useState(produtoInicial);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [tentativa, setTentativa] = useState(0);

  // Quantidade selecionada pelo cliente
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState('');

  const { adicionarProduto } = useCarrinho();

  useEffect(() => {
  let ativo = true;

  async function carregarProduto() {
    try {
      setCarregando(true);
      setErro(null);

      const dados = await buscarProduto(produtoInicial.id);

      if (ativo) {
        setProduto(dados);
      }
    } catch (e) {
      console.error('Erro ao carregar produto:', e);

      if (ativo) {
        setErro(
          'Não foi possível carregar o produto no momento. ' +
          'Verifique sua conexão e tente novamente.'
        );
      }
    } finally {
      if (ativo) {
        setCarregando(false);
      }
    }
  }

  carregarProduto();

  return () => {
    ativo = false;
  };
}, [produtoInicial.id, tentativa]);

  function diminuirQuantidade() {
    setQuantidade((anterior) =>
      Math.max(1, anterior - 1)
    );
  }

  function aumentarQuantidade() {
    setQuantidade((anterior) =>
      Math.min(99, anterior + 1)
    );
  }

  function adicionarAoCarrinho() {
    if (!produto) {
      return;
    }

    // O CarrinhoContext atual adiciona
    // uma unidade por chamada.
    adicionarProduto(produto, quantidade, observacao);

    navigation.navigate('MainTabs', {
      screen: 'Carrinho',
    });
  }

  if (carregando) {
    return (
      <View style={styles.container}>
        <Text style={styles.mensagem}>
          Carregando produto...
        </Text>
      </View>
    );
  }

  if (erro) {
  return (
    <View style={styles.container}>
      <Text style={styles.mensagemErro}>
        {erro}
      </Text>

      <TouchableOpacity
        style={styles.botaoTentarNovamente}
        onPress={() => setTentativa((valor) => valor + 1)}
      >
        <Text style={styles.textoTentarNovamente}>
          Tentar novamente
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
  style={styles.botaoVoltar}
  onPress={() => navigation.goBack()}
>
  <Text style={styles.textoBotaoVoltar}>
    Voltar
  </Text>
</TouchableOpacity>
    </View>
  );
}

  if (!produto) {
  return (
    <View style={styles.container}>
      <Text style={styles.mensagem}>
        Produto não encontrado.
      </Text>

      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textoBotaoVoltar}>
          Voltar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

  const total = Number(produto.preco) * quantidade;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
      {/* Fotografia do produto */}
      {imagensProdutos[produto.nome] && (
        <Image
          source={imagensProdutos[produto.nome]}
          style={styles.produtoImagem}
          resizeMode="cover"
        />
      )}

      {/* Informações */}
      <Text style={styles.titulo}>
        {produto.nome}
      </Text>

      <Text style={styles.descricao}>
        {produto.descricao}
      </Text>

      <Text style={styles.preco}>
        {formatarPreco(produto.preco)}
      </Text>

      {/* Seletor de quantidade */}
      <View style={styles.quantidadeContainer}>
        <Text style={styles.quantidadeTitulo}>
          Quantidade
        </Text>

        <View style={styles.quantidadeControles}>
          <TouchableOpacity
            style={styles.quantidadeBotao}
            onPress={diminuirQuantidade}
            disabled={quantidade === 1}
          >
            <Text
              style={[
                styles.quantidadeSimbolo,
                quantidade === 1 &&
                  styles.quantidadeDesabilitada,
              ]}
            >
              −
            </Text>
          </TouchableOpacity>

          <Text style={styles.quantidadeNumero}>
            {quantidade}
          </Text>

          <TouchableOpacity
            style={styles.quantidadeBotao}
            onPress={aumentarQuantidade}
            disabled={quantidade === 99}
          >
            <Text style={styles.quantidadeSimbolo}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
{/* Observações do produto */}
<View style={styles.observacoesContainer}>
  <Text style={styles.observacoesTitulo}>
    Observações (opcional)
  </Text>

  <TextInput
    style={styles.observacoesInput}
    placeholder="Ex.: Sem cebola, bem passado..."
    placeholderTextColor="#888888"
    value={observacao}
    onChangeText={setObservacao}
    multiline
    maxLength={250}
    textAlignVertical="top"
  />
</View>
      {/* Total */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalTexto}>
          Total
        </Text>

        <Text style={styles.totalValor}>
          {formatarPreco(total)}
        </Text>
      </View>

      {/* Adicionar ao Carrinho */}
      <TouchableOpacity
        style={styles.botaoCarrinho}
        onPress={adicionarAoCarrinho}
      >
        <Text style={styles.textoBotaoCarrinho}>
          Adicionar {quantidade} ao Carrinho
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

observacoesContainer: {
  marginBottom: 20,
},

observacoesTitulo: {
  fontSize: 16,
  fontWeight: '600',
  color: cores.texto,
  marginBottom: 10,
},

observacoesInput: {
  backgroundColor: cores.cinzaClaro,
  borderRadius: 10,
  padding: 12,
  minHeight: 90,
  fontSize: 14,
  color: cores.texto,
  borderWidth: 1,
  borderColor: cores.borda,
},

  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },

  mensagem: {
    margin: 20,
    fontSize: 15,
    color: cores.texto,
  },

  produtoImagem: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: cores.cinzaClaro,
  },

  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 12,
  },

  descricao: {
    fontSize: 16,
    color: cores.textoSecundario,
    lineHeight: 24,
    marginBottom: 20,
  },

  preco: {
    fontSize: 24,
    fontWeight: '700',
    color: cores.primaria,
    marginBottom: 22,
  },

  // Quantidade

  quantidadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  quantidadeTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.texto,
  },

  quantidadeControles: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.cinzaClaro,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  quantidadeBotao: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantidadeSimbolo: {
    fontSize: 23,
    fontWeight: '600',
    color: cores.texto,
  },

  quantidadeDesabilitada: {
    color: '#AAAAAA',
  },

  quantidadeNumero: {
    fontSize: 17,
    fontWeight: '700',
    color: cores.texto,
    minWidth: 35,
    textAlign: 'center',
  },

  // Total

  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },

  totalTexto: {
    fontSize: 17,
    fontWeight: '600',
    color: cores.texto,
  },

  totalValor: {
    fontSize: 22,
    fontWeight: '700',
    color: cores.primaria,
  },

  // Botão principal

  botaoCarrinho: {
    backgroundColor: cores.primaria,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },

  textoBotaoCarrinho: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: '700',
  },

  mensagemErro: {
  color: '#B91C1C',
  backgroundColor: '#FEF2F2',
  padding: 14,
  margin: 20,
  borderRadius: 10,
  fontSize: 14,
  lineHeight: 21,
  textAlign: 'center',
  },

  botaoTentarNovamente: {
  backgroundColor: cores.primaria,
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderRadius: 10,
  alignItems: 'center',
  marginHorizontal: 20,
  marginBottom: 12,
  },

  textoTentarNovamente: {
  color: cores.branco,
  fontSize: 15,
  fontWeight: '600',
  },

botaoVoltar: {
  backgroundColor: cores.branco,
  borderWidth: 1,
  borderColor: cores.primaria,
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderRadius: 10,
  alignItems: 'center',
  marginHorizontal: 20,
},

textoBotaoVoltar: {
  color: cores.primaria,
  fontSize: 15,
  fontWeight: '600',
},

});
