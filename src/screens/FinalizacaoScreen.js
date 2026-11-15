import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Alert
} from 'react-native';

import { criarPedido } from '../services/pedidoService';

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
      telefone: telefone.trim(),
    });

  } catch (error) {
    Alert.alert('Erro ao realizar pedido', error.message);
  } finally {
    setCarregando(false);
  }
}

  return (
    <View style={styles.container}>

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
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={setNome}
          />

        <Text>Telefone:</Text>
          <TextInput
            placeholder="Digite seu telefone"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />

          <Text>Tipo de pedido:</Text>

          <Button
            title={tipo === 'retirada' ? 'Retirada ✓' : 'Retirada'}
            onPress={() => setTipo('retirada')}
          />

          <Button
          title={tipo === 'entrega' ? 'Entrega ✓' : 'Entrega'}
          onPress={() => setTipo('entrega')}
          />

          {tipo === 'entrega' && (
        <>
          <Text>Endereço:</Text>
          <TextInput
          placeholder="Digite seu endereço"
          value={endereco}
          onChangeText={setEndereco}
          />
        </>
      )}

        <Text>Forma de pagamento:</Text>

          <Button
            title={pagamento === 'pix' ? 'Pix ✓' : 'Pix'}
            onPress={() => setPagamento('pix')}
          />

          <Button
            title={pagamento === 'dinheiro' ? 'Dinheiro ✓' : 'Dinheiro'}
            onPress={() => setPagamento('dinheiro')}
          />

          <Button
            title={pagamento === 'cartao_credito' ? 'Cartão de crédito ✓' : 'Cartão de crédito'}
            onPress={() => setPagamento('cartao_credito')}
          />

          <Button
            title={pagamento === 'cartao_debito' ? 'Cartão de débito ✓' : 'Cartão de débito'}
            onPress={() => setPagamento('cartao_debito')}
          />


          <Text>Observações (opcional):</Text>
            <TextInput
              placeholder="Alguma observação sobre o pedido?"
              value={observacoes}
              onChangeText={setObservacoes}
              multiline
            />


          <Button
            title={carregando ? 'Enviando...' : 'Confirmar Pedido'}
            onPress={confirmarPedido}
            disabled={carregando}
          />

        </>
      ) : (
        <Text>Nenhum produto selecionado.</Text>
      )}

      <View style={styles.espaco}>
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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