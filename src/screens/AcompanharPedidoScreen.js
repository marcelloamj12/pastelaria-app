
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  buscarPedido,
  STATUS_PEDIDO,
} from '../services/pedidoService';
import {
  buscarPedidoAcompanhamento,
} from '../services/acompanhamentoPedidoStorage';
import { cores } from '../theme/theme';

const VERMELHO = cores.primaria;
const CINZA = '#BFC1C5';
const TEXTO_SECUNDARIO = '#777777';

export default function AcompanharPedidoScreen({ navigation }) {
  const [pedido, setPedido] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [semPedido, setSemPedido] = useState(false);
  const [erro, setErro] = useState(null);
  const [atualizadoEm, setAtualizadoEm] = useState(null);

  useEffect(() => {
    let ativo = true;
    let temporizador = null;
    let acompanhamentoEncerrado = false;
    let semPedidoEncontrado = false;

    async function consultarPedido() {
      try {
        setErro(null);

        const dadosAcompanhamento =
          await buscarPedidoAcompanhamento();

        if (!ativo) return;

        if (!dadosAcompanhamento) {
          semPedidoEncontrado = true;
          setSemPedido(true);
          return;
        }

        const { pedidoId, telefone } = dadosAcompanhamento;

        const resultado = await buscarPedido(
          pedidoId,
          telefone
        );

        if (!ativo) return;

        setPedido(resultado);
        setAtualizadoEm(new Date());

        if (
          resultado?.status === 'entregue' ||
          resultado?.status === 'cancelado'
        ) {
          acompanhamentoEncerrado = true;
        }
      } catch (error) {
        console.error('Erro ao consultar pedido:', error);

        if (ativo) {
          setErro(
            'Não foi possível atualizar o pedido. ' +
            'Tentaremos novamente.'
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);

          if (
            !semPedidoEncontrado &&
            !acompanhamentoEncerrado
          ) {
            temporizador = setTimeout(
              consultarPedido,
              10000
            );
          }
        }
      }
    }

    consultarPedido();

    return () => {
      ativo = false;

      if (temporizador) {
        clearTimeout(temporizador);
      }
    };
  }, []);

  function formatarPreco(valor) {
    return Number(valor || 0)
      .toFixed(2)
      .replace('.', ',');
  }

  function voltarHome() {
    navigation.navigate('Home');
  }

  function obterEtapas(tipo) {
    const retirada = tipo === 'retirada';

    return [
      {
        id: 'recebido',
        titulo: 'Pedido recebido',
        descricao: 'Seu pedido foi recebido.',
      },
      {
        id: 'em_preparo',
        titulo: 'Em preparo',
        descricao: 'Estamos preparando seu pedido.',
      },
      {
        id: 'pronto',
        titulo: retirada
          ? 'Pronto para retirada'
          : 'Saiu para entrega',
        descricao: retirada
          ? 'Seu pedido está pronto para retirada.'
          : 'Seu pedido está a caminho.',
      },
      {
        id: 'entregue',
        titulo: retirada
          ? 'Pedido retirado'
          : 'Entregue',
        descricao: retirada
          ? 'Seu pedido foi retirado.'
          : 'Pedido entregue.',
      },
    ];
  }

  function obterEtapaAtual(status) {
    const etapasStatus = {
      recebido: 0,
      em_preparo: 1,
      pronto: 2,
      saiu_entrega: 2,
      entregue: 3,
    };

    return etapasStatus[status] ?? -1;
  }

  function renderizarLinhaTempo() {
    if (!pedido) return null;

    const etapas = obterEtapas(pedido.tipo);
    const etapaAtual = obterEtapaAtual(pedido.status);
    const cancelado = pedido.status === 'cancelado';

    return (
      <View style={styles.timelineContainer}>
        <Text style={styles.subtitulo}>
          Status do pedido
        </Text>

        {cancelado && (
          <View style={styles.avisoCancelado}>
            <Ionicons
              name="close-circle"
              size={22}
              color="#B91C1C"
            />

            <View style={styles.avisoCanceladoConteudo}>
              <Text style={styles.avisoCanceladoTitulo}>
                Pedido cancelado
              </Text>

              <Text style={styles.avisoCanceladoTexto}>
                Este pedido foi cancelado.
              </Text>
            </View>
          </View>
        )}

        {!cancelado && (
          <View style={styles.timeline}>
            {etapas.map((etapa, index) => {
              const concluida = index < etapaAtual;
              const atual = index === etapaAtual;
              const pendente = index > etapaAtual;
              const ultima = index === etapas.length - 1;

              return (
                <View
                  key={etapa.id}
                  style={styles.etapa}
                >
                  <View style={styles.indicadorColuna}>
                    <View
                      style={[
                        styles.circulo,
                        (concluida || atual) &&
                          styles.circuloAtivo,
                      ]}
                    >
                      {concluida ? (
                        <Ionicons
                          name="checkmark"
                          size={14}
                          color="#FFFFFF"
                        />
                      ) : atual ? (
                        <View
                          style={styles.circuloInterno}
                        />
                      ) : null}
                    </View>

                    {!ultima && (
                      <View
                        style={[
                          styles.linha,
                          concluida &&
                            styles.linhaConcluida,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.etapaConteudo}>
                    <Text
                      style={[
                        styles.etapaTitulo,
                        atual && styles.etapaTituloAtual,
                        pendente &&
                          styles.etapaTituloPendente,
                      ]}
                    >
                      {etapa.titulo}
                    </Text>

                    <Text style={styles.etapaDescricao}>
                      {etapa.descricao}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  }

  if (carregando) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator
          size="large"
          color={VERMELHO}
        />

        <Text style={styles.textoAuxiliar}>
          Consultando seu pedido...
        </Text>
      </View>
    );
  }

  if (semPedido) {
    return (
      <View style={styles.centralizado}>
        <Ionicons
          name="receipt-outline"
          size={48}
          color={CINZA}
        />

        <Text style={styles.tituloVazio}>
          Nenhum pedido encontrado
        </Text>

        <Text style={styles.textoVazio}>
          Você ainda não possui um pedido salvo
          para acompanhamento neste aparelho.
        </Text>

        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={voltarHome}
        >
          <Text style={styles.textoBotaoSecundario}>
            Voltar ao início
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const informacoesStatus =
    STATUS_PEDIDO[pedido?.status];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
      <Text style={styles.titulo}>
        Acompanhar Pedido
      </Text>

      {erro && (
        <View style={styles.avisoErro}>
          <Text style={styles.textoErro}>
            {erro}
          </Text>

          <Text style={styles.textoAuxiliar}>
            Tentaremos consultar novamente
            em alguns segundos.
          </Text>
        </View>
      )}

      {pedido && (
        <>
          <Text style={styles.numeroPedido}>
            Pedido #{pedido.numero}
          </Text>

          <View style={styles.resumoContainer}>
            <View style={styles.resumoLinha}>
              <Text style={styles.resumoLabel}>
                Tipo de pedido
              </Text>

              <Text style={styles.resumoValor}>
                {pedido.tipo === 'retirada'
                  ? 'Retirada'
                  : 'Entrega'}
              </Text>
            </View>

            <View style={styles.resumoLinha}>
              <Text style={styles.resumoLabel}>
                Total
              </Text>

              <Text style={styles.resumoValor}>
                R$ {formatarPreco(pedido.total)}
              </Text>
            </View>

            {pedido.criado_em && (
              <Text style={styles.dataPedido}>
                Realizado em:{' '}
                {new Date(
                  pedido.criado_em
                ).toLocaleString('pt-BR')}
              </Text>
            )}
          </View>

          {renderizarLinhaTempo()}

          <View style={styles.card}>
            <Text style={styles.subtitulo}>
              Itens do pedido
            </Text>

            {(pedido.itens_pedido || []).map(
              (item, index) => (
                <View
                  key={String(item.id ?? index)}
                  style={styles.item}
                >
                  <View style={styles.itemInfo}>
                    <Text style={styles.nomeItem}>
                      {item.nome_produto}
                    </Text>

                    <Text style={styles.textoAuxiliar}>
                      Quantidade: {item.quantidade}
                    </Text>
                  </View>

                  <Text style={styles.precoItem}>
                    R$ {formatarPreco(item.subtotal)}
                  </Text>
                </View>
              )
            )}
          </View>

          <View style={styles.atualizacaoContainer}>
            <Ionicons
              name="refresh-outline"
              size={15}
              color={TEXTO_SECUNDARIO}
            />

            <Text style={styles.atualizacao}>
              {atualizadoEm
                ? `Última consulta: ${atualizadoEm.toLocaleTimeString('pt-BR')}`
                : 'Aguardando atualização...'}
            </Text>
          </View>

          <Text style={styles.textoAtualizacao}>
            {pedido.status === 'entregue' ||
            pedido.status === 'cancelado'
              ? 'Acompanhamento encerrado.'
              : 'O status é verificado automaticamente a cada 10 segundos.'}
          </Text>
        </>
      )}

      <TouchableOpacity
        style={styles.botaoSecundario}
        onPress={voltarHome}
      >
        <Text style={styles.textoBotaoSecundario}>
          Voltar ao início
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
    padding: 20,
    paddingBottom: 40,
  },

  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: cores.fundo,
  },

  titulo: {
    fontSize: 23,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 22,
  },

  tituloVazio: {
    fontSize: 22,
    fontWeight: '700',
    color: cores.texto,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 12,
  },

  textoVazio: {
    fontSize: 14,
    color: TEXTO_SECUNDARIO,
    textAlign: 'center',
    lineHeight: 22,
  },

  numeroPedido: {
    fontSize: 20,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 18,
  },

  resumoContainer: {
    backgroundColor: cores.cinzaClaro,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },

  resumoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  resumoLabel: {
    fontSize: 14,
    color: TEXTO_SECUNDARIO,
  },

  resumoValor: {
    fontSize: 15,
    fontWeight: '700',
    color: cores.texto,
  },

  dataPedido: {
    fontSize: 12,
    color: TEXTO_SECUNDARIO,
    marginTop: 5,
  },

  timelineContainer: {
    marginBottom: 24,
  },

  subtitulo: {
    fontSize: 19,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 18,
  },

  timeline: {
    paddingTop: 2,
  },

  etapa: {
    flexDirection: 'row',
    minHeight: 78,
  },

  indicadorColuna: {
    width: 30,
    alignItems: 'center',
  },

  circulo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: CINZA,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  circuloAtivo: {
    backgroundColor: VERMELHO,
    borderColor: VERMELHO,
  },

  circuloInterno: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },

  linha: {
    width: 3,
    flex: 1,
    backgroundColor: CINZA,
  },

  linhaConcluida: {
    backgroundColor: VERMELHO,
  },

  etapaConteudo: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 24,
  },

  etapaTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 7,
  },

  etapaTituloAtual: {
    color: VERMELHO,
    fontWeight: '700',
  },

  etapaTituloPendente: {
    color: '#777777',
  },

  etapaDescricao: {
    fontSize: 13,
    color: TEXTO_SECUNDARIO,
    lineHeight: 19,
  },

  avisoCancelado: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FEF2F2',
    padding: 15,
    borderRadius: 12,
  },

  avisoCanceladoConteudo: {
    flex: 1,
  },

  avisoCanceladoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B91C1C',
    marginBottom: 5,
  },

  avisoCanceladoTexto: {
    fontSize: 13,
    color: '#7F1D1D',
  },

  card: {
    backgroundColor: cores.branco,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  itemInfo: {
    flex: 1,
  },

  nomeItem: {
    fontSize: 15,
    fontWeight: '700',
    color: cores.texto,
  },

  textoAuxiliar: {
    color: TEXTO_SECUNDARIO,
    fontSize: 13,
    marginTop: 6,
  },

  precoItem: {
    fontSize: 14,
    fontWeight: '700',
    color: cores.texto,
    marginLeft: 10,
  },

  atualizacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },

  atualizacao: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXTO_SECUNDARIO,
  },

  textoAtualizacao: {
    fontSize: 12,
    color: TEXTO_SECUNDARIO,
    marginBottom: 22,
  },

  avisoErro: {
    backgroundColor: '#FEE2E2',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },

  textoErro: {
    color: '#B91C1C',
    fontWeight: '600',
  },

  botaoSecundario: {
    borderWidth: 1,
    borderColor: VERMELHO,
    backgroundColor: cores.branco,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },

  textoBotaoSecundario: {
    color: VERMELHO,
    fontWeight: '700',
    fontSize: 15,
  },
});
