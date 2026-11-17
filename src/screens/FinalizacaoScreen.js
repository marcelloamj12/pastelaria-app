import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import { criarPedido } from '../services/pedidoService';
import { cores } from '../theme/theme';

export default function FinalizacaoScreen({ route, navigation }) {

  const produto = route.params?.produto;
  const quantidade = route.params?.quantidade;
  const total = route.params?.total;

    const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipo, setTipo] = useState('retirada');
  const [pagamento, setPagamento] = useState('pix');
  const [endereco, setEndereco] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [carregando, setCarregando] = useState(false);


  async function confirmarPedido() {
  try {
    if (carregando) return;

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
    });

  } catch (error) {
    Alert.alert('Erro ao realizar pedido', error.message);
  } finally {
    setCarregando(false);
  }
}

  return (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.conteudo}
    keyboardShouldPersistTaps="handled"
  >

      <Text style={styles.titulo}>
        Finalizar Pedido
      </Text>

      <Text style={styles.subtitulo}>
        Resumo do pedido
      </Text>

      {produto ? (
        <>
          <Text style={styles.nome}>
            {produto.nome}
          </Text>

          <Text>
            Quantidade: {quantidade}
          </Text>

          <Text style={styles.total}>
            Total: R$ {total.toFixed(2)}
          </Text>

        <Text>Nome:</Text>
          <TextInput
	    style={styles.campo}
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={setNome}
          />

        <Text>Telefone:</Text>
          <TextInput
	    style={styles.campo}
            placeholder="Digite seu telefone"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />

          <Text>Tipo de pedido:</Text>

          <View style={styles.opcoesContainer}>
  <TouchableOpacity
    style={[
      styles.botaoOpcao,
      tipo === 'retirada' && styles.botaoOpcaoAtivo
    ]}
    onPress={() => setTipo('retirada')}
  >
    <Text
      style={[
        styles.textoOpcao,
        tipo === 'retirada' && styles.textoOpcaoAtivo
      ]}
    >
      Retirada
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.botaoOpcao,
      tipo === 'entrega' && styles.botaoOpcaoAtivo
    ]}
    onPress={() => setTipo('entrega')}
  >
    <Text
      style={[
        styles.textoOpcao,
        tipo === 'entrega' && styles.textoOpcaoAtivo
      ]}
    >
      Entrega
    </Text>
  </TouchableOpacity>
</View>

          {tipo === 'entrega' && (
        <>
          <Text>Endereço:</Text>
          <TextInput
	  style={styles.campo}
          placeholder="Digite seu endereço"
          value={endereco}
          onChangeText={setEndereco}
          />
        </>
      )}

        <Text>Forma de pagamento:</Text>

          <View style={styles.pagamentosContainer}>
  {[
    { valor: 'pix', nome: 'Pix' },
    { valor: 'dinheiro', nome: 'Dinheiro' },
    { valor: 'cartao_credito', nome: 'Cartão de crédito' },
    { valor: 'cartao_debito', nome: 'Cartão de débito' },
  ].map((opcao) => (
    <TouchableOpacity
      key={opcao.valor}
      style={[
        styles.botaoPagamento,
        pagamento === opcao.valor && styles.botaoOpcaoAtivo,
      ]}
      onPress={() => setPagamento(opcao.valor)}
    >
      <Text
        style={[
          styles.textoOpcao,
          pagamento === opcao.valor && styles.textoOpcaoAtivo,
        ]}
      >
        {opcao.nome}
      </Text>
    </TouchableOpacity>
  ))}
</View>


          <Text>Observações (opcional):</Text>
            <TextInput
	      style={styles.campo}
              placeholder="Alguma observação sobre o pedido?"
              value={observacoes}
              onChangeText={setObservacoes}
              multiline
            />


         <TouchableOpacity
  style={[
    styles.botaoConfirmar,
    carregando && styles.botaoDesabilitado
  ]}
  onPress={confirmarPedido}
  disabled={carregando}
>
  <Text style={styles.textoBotaoConfirmar}>
    {carregando ? 'Enviando...' : 'Confirmar Pedido'}
  </Text>
</TouchableOpacity>

        </>
      ) : (
        <Text>Nenhum produto selecionado.</Text>
      )}

      <View style={styles.espaco}>
  <TouchableOpacity
    style={styles.botaoVoltar}
    onPress={() => navigation.goBack()}
  >
    <Text style={styles.textoBotaoVoltar}>
      Voltar
    </Text>
  </TouchableOpacity>
</View>

        </ScrollView>
  );
}

const styles = StyleSheet.create({

botaoVoltar: {
  backgroundColor: cores.branco,
  borderWidth: 1,
  borderColor: cores.primaria,
  borderRadius: 12,
  paddingVertical: 14,
  alignItems: 'center',
  marginBottom: 20,
},

textoBotaoVoltar: {
  color: cores.primaria,
  fontSize: 15,
  fontWeight: '600',
},

botaoConfirmar: {
  backgroundColor: cores.primaria,
  paddingVertical: 16,
  paddingHorizontal: 20,
  borderRadius: 12,
  alignItems: 'center',
  marginTop: 8,
  marginBottom: 12,
},

textoBotaoConfirmar: {
  color: cores.branco,
  fontSize: 16,
  fontWeight: '700',
},

botaoDesabilitado: {
  opacity: 0.6,
},

pagamentosContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
  marginTop: 8,
  marginBottom: 20,
},

botaoPagamento: {
  width: '48%',
  backgroundColor: cores.branco,
  borderWidth: 1,
  borderColor: cores.borda,
  borderRadius: 12,
  paddingVertical: 14,
  paddingHorizontal: 8,
  alignItems: 'center',
  justifyContent: 'center',
},

opcoesContainer: {
  flexDirection: 'row',
  gap: 12,
  marginTop: 8,
  marginBottom: 20,
},

botaoOpcao: {
  flex: 1,
  backgroundColor: cores.branco,
  borderWidth: 1,
  borderColor: cores.borda,
  borderRadius: 12,
  paddingVertical: 14,
  alignItems: 'center',
  justifyContent: 'center',
},

botaoOpcaoAtivo: {
  backgroundColor: cores.primaria,
  borderColor: cores.primaria,
},

textoOpcao: {
  fontSize: 15,
  fontWeight: '600',
  color: cores.primaria,
},

textoOpcaoAtivo: {
  color: cores.branco,
},

  container: {
  flex: 1,
  backgroundColor: '#FFFDF8',
},

campo: {
  backgroundColor: cores.branco,
  borderWidth: 1,
  borderColor: cores.borda,
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontSize: 16,
  color: cores.texto,
  marginTop: 6,
  marginBottom: 16,
},

conteudo: {
  flexGrow: 1,
  padding: 20,
  paddingBottom: 40,
},

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  subtitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  total: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 20,
  },

  espaco: {
    marginTop: 10,
  },

});