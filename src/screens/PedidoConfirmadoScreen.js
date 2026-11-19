
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { STATUS_PEDIDO } from '../services/pedidoService';
import { cores } from '../theme/theme';

export default function PedidoConfirmadoScreen({
  route,
  navigation,
}) {
  const total = route.params?.total;
  const numero = route.params?.numero;
  const status = route.params?.status;

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

      {/* Botão de retorno */}
      <TouchableOpacity
        style={styles.botaoInicio}
        onPress={voltarInicio}
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
