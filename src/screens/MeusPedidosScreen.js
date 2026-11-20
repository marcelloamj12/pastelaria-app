
import React, { useState, useCallback } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import {
  buscarHistoricoPedidos,
  STATUS_PEDIDO,
} from '../services/pedidoService';
import {
  buscarHistoricoAcompanhamento,
} from '../services/acompanhamentoPedidoStorage';
import { cores } from '../theme/theme';

export default function MeusPedidosScreen({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [registrosLocais, setRegistrosLocais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [tentativa, setTentativa] = useState(0);

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

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarHistorico() {
        try {
          setCarregando(true);
          setErro('');
          setAviso('');

          const registros =
            await buscarHistoricoAcompanhamento();

          if (!ativo) return;

          setRegistrosLocais(registros);

          if (registros.length === 0) {
            setPedidos([]);
            return;
          }

          const resultado = await buscarHistoricoPedidos();

          if (!ativo) return;

          setPedidos(resultado);

          if (resultado.length === 0) {
            setErro(
              'Não foi possível carregar os pedidos salvos. ' +
              'Verifique sua conexão e tente novamente.'
            );
          } else if (resultado.length < registros.length) {
            setAviso(
              'Alguns pedidos não puderam ser atualizados. ' +
              'Você pode tentar novamente.'
            );
          }
        } catch (error) {
          console.error('Erro ao carregar histórico:', error);

          if (ativo) {
            setPedidos([]);
            setErro(
              'Não foi possível carregar seu histórico de pedidos.'
            );
          }
        } finally {
          if (ativo) {
            setCarregando(false);
          }
        }
      }

      carregarHistorico();

      return () => {
        ativo = false;
      };
    }, [tentativa])
  );

  function atualizarHistorico() {
    setTentativa((valor) => valor + 1);
  }

  function acompanharPedido(pedido) {
    const registro = registrosLocais.find(
      (item) => String(item.pedidoId) === String(pedido.id)
    );

    if (!registro) {
      setErro(
        'Não foi possível identificar os dados locais deste pedido.'
      );
      return;
    }

    navigation.getParent()?.navigate('AcompanharPedido', {
      pedidoId: registro.pedidoId,
      telefone: registro.telefone,
    });
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
      <Text style={styles.titulo}>Meus Pedidos</Text>

      <Text style={styles.descricao}>
        Acompanhe os pedidos realizados neste dispositivo.
      </Text>

      {carregando && (
        <View style={styles.centralizado}>
          <ActivityIndicator
            size="large"
            color={cores.primaria}
          />

          <Text style={styles.textoAuxiliar}>
            Carregando seu histórico de pedidos...
          </Text>
        </View>
      )}

      {!carregando && !!erro && (
        <View style={styles.avisoErro}>
          <Text style={styles.textoErro}>
            {erro}
          </Text>

          <TouchableOpacity
            style={styles.botaoAtualizar}
            onPress={atualizarHistorico}
          >
            <Text style={styles.textoAtualizar}>
              Tentar novamente
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!carregando && !!aviso && (
        <View style={styles.avisoContainer}>
          <Text style={styles.textoAuxiliar}>
            {aviso}
          </Text>
        </View>
      )}

      {!carregando &&
        !erro &&
        registrosLocais.length === 0 && (
          <View style={styles.vazio}>
            <Text style={styles.vazioTitulo}>
              Nenhum pedido encontrado
            </Text>

            <Text style={styles.vazioDescricao}>
              Os pedidos feitos neste dispositivo
              aparecerão aqui automaticamente.
            </Text>
          </View>
        )}

      {!carregando && pedidos.map((pedido) => {
        const status = STATUS_PEDIDO[pedido.status] || {
          texto: pedido.status || 'Sem status',
          cor: '#777777',
        };

        return (
          <View
            key={String(pedido.id)}
            style={styles.card}
          >
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

            {(pedido.itens_pedido || []).map(
              (item, index) => (
                <Text
                  key={String(item.id ?? index)}
                  style={styles.item}
                >
                  {item.quantidade}x {item.nome_produto}
                </Text>
              )
            )}

            <View style={styles.rodapeCard}>
              <Text style={styles.totalLabel}>
                Total
              </Text>

              <Text style={styles.total}>
                {formatarPreco(pedido.total)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.botaoAcompanhar}
              onPress={() => acompanharPedido(pedido)}
            >
              <Text style={styles.textoBotaoAcompanhar}>
                Acompanhar pedido
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      {!carregando &&
        registrosLocais.length > 0 &&
        pedidos.length > 0 && (
          <TouchableOpacity
            style={styles.botaoAtualizar}
            onPress={atualizarHistorico}
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

  centralizado: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },

  textoAuxiliar: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginTop: 10,
    lineHeight: 20,
  },

  vazio: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 25,
    alignItems: 'center',
    marginTop: 15,
  },

  vazioTitulo: {
    fontSize: 18,
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
    fontSize: 17,
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

  botaoAcompanhar: {
    backgroundColor: cores.primaria,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 14,
  },

  textoBotaoAcompanhar: {
    color: cores.branco,
    fontSize: 14,
    fontWeight: '700',
  },

  botaoAtualizar: {
    borderWidth: 1,
    borderColor: cores.primaria,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },

  textoAtualizar: {
    color: cores.primaria,
    fontSize: 14,
    fontWeight: '600',
  },

  avisoErro: {
    backgroundColor: '#FEE2E2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 18,
  },

  textoErro: {
    color: '#B91C1C',
    fontSize: 14,
  },

  avisoContainer: {
    backgroundColor: '#FFF7ED',
    padding: 14,
    borderRadius: 10,
    marginBottom: 18,
  },
});
