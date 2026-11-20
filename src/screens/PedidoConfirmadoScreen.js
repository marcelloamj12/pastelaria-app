
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';

import {
  STATUS_PEDIDO,
  buscarPedido
} from '../services/pedidoService';

import { cores } from '../theme/theme';

const WHATSAPP_PASTELARIA = '5569992058880';

export default function PedidoConfirmadoScreen({ route, navigation }) {
  const total = route.params?.total;
  const numero = route.params?.numero;
  const status = route.params?.status;
  const pedidoId = route.params?.pedidoId;

  const [enviando, setEnviando] = useState(false);

  function formatarPreco(valor) {
    return Number(valor || 0).toFixed(2).replace('.', ',');
  }

  async function enviarWhatsApp() {
    if (enviando) return;

    if (!pedidoId) {
      Alert.alert(
        'Atenção',
        'Não foi possível identificar o pedido.'
      );
      return;
    }

    try {
      setEnviando(true);

      const pedido = await buscarPedido(pedidoId);

      if (!pedido) {
        throw new Error('Pedido não encontrado.');
      }

      const itens = pedido.itens_pedido || [];

      const listaProdutos = itens.map(item =>
        `• ${item.quantidade}x ${item.nome_produto} - R$ ${formatarPreco(item.subtotal)}`
      ).join('\n');

      const formasPagamento = {
        pix: 'PIX',
        dinheiro: 'Dinheiro',
        cartao_credito: 'Cartão de crédito',
        cartao_debito: 'Cartão de débito'
      };

      const mensagem = [
        '*NOVO PEDIDO - PASTELARIA MILTÃO*',
        '',
        `*Pedido:* #${pedido.numero || numero || '---'}`,
        `*Cliente:* ${pedido.clientes?.nome || 'Não informado'}`,
        `*Telefone:* ${pedido.clientes?.telefone || 'Não informado'}`,
        '',
        '*PRODUTOS:*',
        listaProdutos || 'Nenhum produto encontrado',
        '',
        `*Tipo:* ${pedido.tipo === 'entrega' ? 'Entrega' : 'Retirada'}`,
        ...(pedido.tipo === 'entrega'
          ? [`*Endereço:* ${pedido.endereco_entrega || 'Não informado'}`]
          : []),
        `*Pagamento:* ${formasPagamento[pedido.pagamento] || pedido.pagamento || 'Não informado'}`,
        `*Total:* R$ ${formatarPreco(pedido.total)}`,
        ...(pedido.observacoes
          ? [`*Observações:* ${pedido.observacoes}`]
          : [])
      ].join('\n');

      const url = `https://wa.me/${WHATSAPP_PASTELARIA}?text=${encodeURIComponent(mensagem)}`;

      await Linking.openURL(url);

    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível abrir o WhatsApp: ' + error.message
      );
    } finally {
      setEnviando(false);
    }
  }

  function voltarInicio() {
    navigation.popToTop();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Pedido Confirmado!
      </Text>

      <Text style={styles.mensagem}>
        Seu pedido foi realizado com sucesso.
      </Text>

      {numero != null && (
        <Text style={styles.informacao}>
          Número do pedido: {numero}
        </Text>
      )}

      {status && (
        <Text style={styles.informacao}>
          Status: {STATUS_PEDIDO[status]?.texto ?? status}
        </Text>
      )}

      {total != null && (
        <Text style={styles.total}>
          Total do pedido: R$ {formatarPreco(total)}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.botaoWhatsApp,
          enviando && styles.desabilitado
        ]}
        onPress={enviarWhatsApp}
        disabled={enviando}
      >
        <Text style={styles.textoBotaoWhatsApp}>
          {enviando
            ? 'Preparando mensagem...'
            : 'Enviar pedido pelo WhatsApp'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoInicio}
        onPress={voltarInicio}
      >
        <Text style={styles.textoBotaoInicio}>
          Voltar ao Início
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cores.fundo,
    padding: 20
  },

  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: cores.sucesso,
    marginBottom: 20,
    textAlign: 'center'
  },

  mensagem: {
    fontSize: 16,
    color: cores.textoSecundario,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center'
  },

  informacao: {
    fontSize: 16,
    color: cores.texto,
    marginBottom: 10,
    textAlign: 'center'
  },

  total: {
    fontSize: 24,
    fontWeight: '700',
    color: cores.primaria,
    marginTop: 16,
    marginBottom: 30,
    textAlign: 'center'
  },

  botaoWhatsApp: {
    backgroundColor: '#25D366',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12
  },

  textoBotaoWhatsApp: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },

  botaoInicio: {
    backgroundColor: cores.primaria,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%'
  },

  textoBotaoInicio: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: '700'
  },

  desabilitado: {
    opacity: 0.6
  }
});
