
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
 
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';


import {
  STATUS_PEDIDO,
  buscarPedido
} from '../services/pedidoService';

import { cores } from '../theme/theme';

const WHATSAPP_PASTELARIA = '5569992058880';


export default function PedidoConfirmadoScreen({
  route,
  navigation,
}) {
  const total = route.params?.total;
  const numero = route.params?.numero;
  const status = route.params?.status;
  const pedidoId = route.params?.pedidoId;
  const telefone = route.params?.telefone;

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

      const pedido = await buscarPedido(pedidoId, telefone);

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
    const statusInfo = status
    ? STATUS_PEDIDO[status]
    : null;

  function formatarPreco(valor) {
    return `R$ ${Number(valor || 0)
      .toFixed(2)
      .replace('.', ',')}`;
  }

  if (route.params?.pedidoId == null) {
  return (
    <View style={styles.container}>
      <View style={styles.avisoContainer}>
        <Text style={styles.avisoTitulo}>
          Pedido não encontrado
        </Text>

        <Text style={styles.avisoMensagem}>
          Não foi possível identificar o pedido.
          Volte ao início para continuar.
        </Text>

        <TouchableOpacity
          style={styles.botaoInicio}
          onPress={voltarInicio}
        >
          <Text style={styles.textoBotaoInicio}>
            Voltar ao Início
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
      {/* Ícone de confirmação */}
      <View style={styles.iconeContainer}>
        <Ionicons
          name="checkmark"
          size={36}
          color={cores.branco}
        />
      </View>

      {/* Mensagem */}
      <Text style={styles.titulo}>
        Pedido Confirmado!
      </Text>

      <Text style={styles.mensagem}>
        Seu pedido foi realizado com sucesso.
      </Text>

      {/* Número do pedido */}
      {numero !== undefined && numero !== null && (
        <View style={styles.numeroContainer}>
          <Text style={styles.numeroLabel}>
            Número do pedido
          </Text>

          <Text style={styles.numeroValor}>
            #{numero}
          </Text>
        </View>
      )}

      {/* Informações do pedido */}
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>
          Resumo do Pedido
        </Text>

        {status && (
          <View style={styles.linha}>
            <Text style={styles.label}>
              Status
            </Text>

            <View
              style={[
                styles.statusContainer,
                {
                  backgroundColor:
                    statusInfo?.cor || '#666666',
                },
              ]}
            >
              <Text style={styles.statusTexto}>
                {statusInfo?.texto ?? status}
              </Text>
            </View>
          </View>
        )}

        {total !== undefined && total !== null && (
          <View style={styles.linhaTotal}>
            <Text style={styles.totalLabel}>
              Total do pedido
            </Text>

            <Text style={styles.totalValor}>
              {formatarPreco(total)}
            </Text>
          </View>
        )}
      </View>

      {/* Mensagem complementar */}
      <Text style={styles.informacao}>
        Guarde o número do seu pedido para facilitar
        o acompanhamento.
      </Text>

      
{/* Botão do WhatsApp */}
<TouchableOpacity
  onPress={enviarWhatsApp}
  activeOpacity={0.8}
  style={{
    backgroundColor: '#25D366',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  }}
>
  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>
    Enviar pedido pelo WhatsApp
  </Text>
</TouchableOpacity>


      {/* Botão de retorno */}
      <TouchableOpacity
        style={styles.botaoInicio}
        onPress={() => navigation.popToTop()}
        activeOpacity={0.8}
      >
        <Text style={styles.textoBotaoInicio}>
          Voltar ao Início
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  conteudo: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  // Confirmação

  iconeContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },

  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: cores.texto,
    textAlign: 'center',
    marginBottom: 10,
  },

  mensagem: {
    fontSize: 14,
    color: cores.textoSecundario,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },

  // Número do pedido

  numeroContainer: {
    backgroundColor: cores.cinzaClaro,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },

  numeroLabel: {
    fontSize: 13,
    color: cores.textoSecundario,
    marginBottom: 6,
  },

  numeroValor: {
    fontSize: 24,
    fontWeight: '700',
    color: cores.texto,
  },

  // Resumo

  card: {
    backgroundColor: cores.cinzaClaro,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },

  cardTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 16,
  },

  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    color: cores.textoSecundario,
  },

  statusContainer: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  statusTexto: {
    color: cores.branco,
    fontSize: 12,
    fontWeight: '700',
  },

  linhaTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    paddingTop: 14,
  },

  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.texto,
  },

  totalValor: {
    fontSize: 20,
    fontWeight: '700',
    color: cores.primaria,
  },

  // Rodapé

  informacao: {
    fontSize: 13,
    lineHeight: 20,
    color: cores.textoSecundario,
    textAlign: 'center',
    marginBottom: 24,
  },

  botaoInicio: {
    backgroundColor: cores.primaria,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },

  textoBotaoInicio: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: '700',
  },

  avisoContainer: {
  flex: 1,
  justifyContent: 'center',
  padding: 24,
  },

  avisoTitulo: {
  fontSize: 22,
  fontWeight: '700',
  color: cores.texto,
  textAlign: 'center',
  marginBottom: 12,
  },

  avisoMensagem: {
  fontSize: 15,
  color: cores.textoSecundario,
  textAlign: 'center',
  lineHeight: 22,
  marginBottom: 24,
  },

});
