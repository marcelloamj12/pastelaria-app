import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import {
  listarPedidosPorTelefone,
  STATUS_PEDIDO,
} from '../services/pedidoService';

import { cores } from '../theme/theme';

export default function MeusPedidosScreen() {
  const [telefone, setTelefone] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [pesquisou, setPesquisou] = useState(false);
  const [erro, setErro] = useState('');

  function formatarPreco(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function formatarData(data) {
    if (!data) return '';

    return new Date(data).toLocaleString('pt-BR');
  }

  async function consultarPedidos() {
    if (carregando) return;

    const numeros = telefone.replace(/\D/g, '');

    if (numeros.length < 10 || numeros.length > 11) {
      setErro('Informe um telefone válido com DDD.');
      setPedidos([]);
      setPesquisou(false);
      return;
    }

    try {
      setCarregando(true);
      setErro('');
      setPesquisou(false);
      setPedidos([]);

      const resultado = await listarPedidosPorTelefone(numeros);

      setPedidos(resultado);
      setPesquisou(true);
    } catch (error) {
      setErro(
        'Não foi possível consultar os pedidos: ' +
        (error.message || 'Tente novamente.')
      );
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
      <Text style={styles.titulo}>Meus Pedidos</Text>

      <Text style={styles.descricao}>
        Informe o telefone utilizado na compra para consultar
        seus pedidos.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="(69) 99999-9999"
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={(valor) => {
          setTelefone(valor);
          setPedidos([]);
          setPesquisou(false);
          setErro('');
        }}
        maxLength={20}
      />

      <TouchableOpacity
        style={[
          styles.botao,
          carregando && styles.botaoDesabilitado,
        ]}
        onPress={consultarPedidos}
        disabled={carregando}
      >
        <Text style={styles.textoBotao}>
          {carregando ? 'Consultando...' : 'Consultar Pedidos'}
        </Text>
      </TouchableOpacity>

      {carregando && (
        <ActivityIndicator
          size="large"
          color={cores.primaria}
          style={styles.carregamento}
        />
      )}

      {!!erro && (
        <Text style={styles.erro}>{erro}</Text>
      )}

      {!carregando && pesquisou && pedidos.length === 0 && (
        <View style={styles.vazio}>
          <Text style={styles.vazioTitulo}>
            Nenhum pedido encontrado
          </Text>

          <Text style={styles.vazioDescricao}>
            Não encontramos pedidos para o telefone informado.
          </Text>
        </View>
      )}

      {!carregando && pedidos.map((pedido) => {
        const status = STATUS_PEDIDO[pedido.status] || {
          texto: pedido.status || 'Sem status',
          cor: '#777777',
        };

        return (
          <View key={String(pedido.id)} style={styles.card}>
            <View style={styles.cabecalhoCard}>
              <Text style={styles.numero}>
                Pedido #{pedido.numero}
              </Text>

              <Text
                style={[
                  styles.status,
                  { color: status.cor },
                ]}
              >
                {status.texto}
              </Text>
            </View>

            <Text style={styles.data}>
              {formatarData(pedido.criado_em)}
            </Text>

            <Text style={styles.tipo}>
              {pedido.tipo === 'entrega'
                ? 'Entrega'
                : 'Retirada'}
            </Text>

            {(pedido.itens_pedido || []).map((item, index) => (
              <Text
                key={index}
                style={styles.item}
              >
                {item.quantidade}x {item.nome_produto}
              </Text>
            ))}

            <View style={styles.rodapeCard}>
              <Text style={styles.totalLabel}>Total</Text>

              <Text style={styles.total}>
                {formatarPreco(pedido.total)}
              </Text>
            </View>
          </View>
        );
      })}

      {pesquisou && pedidos.length > 0 && (
        <TouchableOpacity
          style={styles.botaoAtualizar}
          onPress={consultarPedidos}
        >
          <Text style={styles.textoAtualizar}>
            Atualizar pedidos
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },

  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 10,
  },

  descricao: {
    fontSize: 14,
    lineHeight: 21,
    color: cores.textoSecundario,
    marginBottom: 20,
  },

  input: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },

  botao: {
    backgroundColor: cores.primaria,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },

  botaoDesabilitado: {
    opacity: 0.6,
  },

  textoBotao: {
    color: cores.branco,
    fontSize: 15,
    fontWeight: '700',
  },

  carregamento: {
    marginTop: 25,
  },

  erro: {
    color: cores.primaria,
    fontSize: 14,
    marginBottom: 16,
  },

  vazio: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 25,
    alignItems: 'center',
    marginTop: 15,
  },

  vazioTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 10,
  },

  vazioDescricao: {
    fontSize: 14,
    color: cores.textoSecundario,
    textAlign: 'center',
    lineHeight: 21,
  },

  card: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: cores.borda,
  },

  cabecalhoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  numero: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.texto,
    flexShrink: 1,
  },

  status: {
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },

  data: {
    fontSize: 12,
    color: cores.textoSecundario,
    marginBottom: 10,
  },

  tipo: {
    fontSize: 13,
    color: cores.texto,
    marginBottom: 12,
  },

  item: {
    fontSize: 13,
    color: cores.textoSecundario,
    marginBottom: 5,
  },

  rodapeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    marginTop: 12,
    paddingTop: 12,
  },

  totalLabel: {
    fontSize: 15,
    color: cores.texto,
    fontWeight: '600',
  },

  total: {
    fontSize: 18,
    color: cores.primaria,
    fontWeight: '700',
  },

  botaoAtualizar: {
    borderWidth: 1,
    borderColor: cores.primaria,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 5,
  },

  textoAtualizar: {
    color: cores.primaria,
    fontSize: 14,
    fontWeight: '600',
  },
});
