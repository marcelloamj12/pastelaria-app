
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform
} from 'react-native';

import { useCarrinho } from '../context/CarrinhoContext';
import { criarPedido } from '../services/pedidoService';
import { cores } from '../theme/theme';

export default function FinalizacaoScreen({ navigation }) {
  const { itens, total, limparCarrinho } = useCarrinho();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipo, setTipo] = useState('retirada');
  const [endereco, setEndereco] = useState('');
  const [pagamento, setPagamento] = useState('pix');
  const [observacoes, setObservacoes] = useState('');
  const [carregando, setCarregando] = useState(false);

  function formatarPreco(valor) {
    return Number(valor || 0).toFixed(2).replace('.', ',');
  }

  function mostrarAviso(mensagem) {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.alert(mensagem);
    } else {
      Alert.alert('Atenção', mensagem);
    }
  }

  async function confirmarPedido() {
    if (carregando) return;

    /*
    setCarregando(true);

    const pedido = await criarPedido({
      nome,
      telefone,
      itens: [
        {
          produto_id: produto.id,
          quantidade: quantidade,
        }
      ],
      tipo,
      pagamento,
      endereco: tipo === 'entrega' ? endereco : null,
      observacoes: observacoes.trim() || null,
      taxaEntrega: 0,
    });

    navigation.navigate('PedidoConfirmado', {
      pedidoId: pedido.pedido_id,
      numero: pedido.numero,
      total: pedido.total,
      status: pedido.status,
      telefone: telefone.trim(),
    });

  } catch (error) {
    Alert.alert('Erro ao realizar pedido', error.message);
  } finally {
    setCarregando(false);
    */ 
    if (!nome.trim()) {
      mostrarAviso('Informe o nome do cliente.');
      return;
    }

    const telefoneNumeros = telefone.replace(/\D/g, '');

    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
      mostrarAviso('Informe um telefone válido com DDD.');
      return;
    }

    if (tipo === 'entrega' && !endereco.trim()) {
      mostrarAviso('Informe o endereço de entrega.');
      return;
    }

    if (itens.length === 0) {
      mostrarAviso('Seu carrinho está vazio.');
      return;
    }

    try {
      setCarregando(true);

      const pedido = await criarPedido({
        nome: nome.trim(),
        telefone: telefone.trim(),
        itens: itens.map(item => ({
          produto_id: item.id,
          quantidade: item.quantidade,
          observacao: null
        })),
        tipo,
        pagamento,
        endereco: tipo === 'entrega' ? endereco.trim() : null,
        observacoes: observacoes.trim() || null,
        taxaEntrega: 0
      });

      if (!pedido?.pedido_id) {
        throw new Error('O banco não retornou o identificador do pedido.');
      }

      limparCarrinho();

      navigation.navigate('PedidoConfirmado', {
        pedidoId: pedido.pedido_id,
        numero: pedido.numero,
        total: pedido.total,
        status: pedido.status
      });

    } catch (error) {
      mostrarAviso(
        'Erro ao realizar pedido: ' + (error.message || 'Tente novamente.')
      );
    } finally {
      setCarregando(false);
    }
    // fim do conflito
  }

  function opcao(titulo, valor, selecionado, alterar) {
    return (
      <TouchableOpacity
        key={valor}
        style={[
          styles.opcao,
          selecionado === valor && styles.opcaoSelecionada
        ]}
        onPress={() => alterar(valor)}
      >
        <Text style={[
          styles.textoOpcao,
          selecionado === valor && styles.textoSelecionado
        ]}>
          {titulo}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.titulo}>Finalizar Pedido</Text>

      <View style={styles.card}>
        <Text style={styles.subtitulo}>Dados do Cliente</Text>

        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="(69) 99999-9999"
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />

        <Text style={styles.label}>Tipo de pedido</Text>

        <View style={styles.opcoes}>
          {opcao('Retirada', 'retirada', tipo, setTipo)}
          {opcao('Entrega', 'entrega', tipo, setTipo)}
        </View>

        {tipo === 'entrega' && (
          <>
            <Text style={styles.label}>Endereço de entrega</Text>
            <TextInput
              style={[styles.input, styles.endereco]}
              placeholder="Rua, número, bairro e complemento"
              value={endereco}
              onChangeText={setEndereco}
              multiline
            />
          </>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.subtitulo}>Forma de Pagamento</Text>

        <View style={styles.opcoes}>
          {opcao('PIX', 'pix', pagamento, setPagamento)}
          {opcao('Dinheiro', 'dinheiro', pagamento, setPagamento)}
        </View>

        <View style={styles.opcoes}>
          {opcao('Crédito', 'cartao_credito', pagamento, setPagamento)}
          {opcao('Débito', 'cartao_debito', pagamento, setPagamento)}
        </View>

        <Text style={styles.label}>Observações (opcional)</Text>
        <TextInput
          style={[styles.input, styles.endereco]}
          placeholder="Alguma observação sobre o pedido?"
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.subtitulo}>Resumo do Pedido</Text>

        {itens.length === 0 ? (
          <Text>Seu carrinho está vazio.</Text>
        ) : (
          itens.map(item => (
            <View key={String(item.id)} style={styles.produto}>
              <View style={styles.produtoInfo}>
                <Text style={styles.nomeProduto}>{item.nome}</Text>
                <Text>Quantidade: {item.quantidade}</Text>
                <Text>Unitário: R$ {formatarPreco(item.preco)}</Text>
              </View>

              <Text style={styles.subtotal}>
                R$ {formatarPreco(item.preco * item.quantidade)}
              </Text>
            </View>
          ))
        )}

        <View style={styles.linhaTotal}>
          <Text style={styles.totalLabel}>Total estimado</Text>
          <Text style={styles.totalValor}>
            R$ {formatarPreco(total)}
          </Text>
        </View>

        <Text style={styles.aviso}>
          O valor definitivo será calculado pelo banco de dados.
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.botaoConfirmar,
          (carregando || itens.length === 0) && styles.desabilitado
        ]}
        onPress={confirmarPedido}
        disabled={carregando || itens.length === 0}
      >
        <Text style={styles.textoBotao}>
          {carregando ? 'Enviando pedido...' : 'Confirmar Pedido'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textoVoltar}>Voltar ao Carrinho</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo
  },
  conteudo: {
    padding: 20,
    paddingBottom: 40
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222'
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2
  },
  subtitulo: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#333'
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 7,
    color: '#444'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fafafa'
  },
  endereco: {
    minHeight: 75,
    textAlignVertical: 'top'
  },
  opcoes: {
    flexDirection: 'row',
    marginBottom: 15
  },
  opcao: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 6
  },
  opcaoSelecionada: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria
  },
  textoOpcao: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  textoSelecionado: {
    color: '#fff'
  },
  produto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12
  },
  produtoInfo: {
    flex: 1
  },
  nomeProduto: {
    fontSize: 17,
    fontWeight: 'bold'
  },
  subtotal: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  linhaTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#eee'
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  totalValor: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.primaria
  },
  aviso: {
    fontSize: 12,
    color: '#777',
    marginTop: 8
  },
  botaoConfirmar: {
    backgroundColor: cores.primaria,
    padding: 17,
    borderRadius: 10,
    alignItems: 'center'
  },
  desabilitado: {
    backgroundColor: '#aaa'
  },
  textoBotao: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold'
  },
  botaoVoltar: {
    marginTop: 15,
    padding: 15,
    alignItems: 'center'
  },
  textoVoltar: {
    color: '#444',
    fontSize: 16
  }
});
