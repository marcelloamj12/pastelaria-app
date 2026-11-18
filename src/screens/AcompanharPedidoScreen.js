
// place holder da tela "meus pedidos"


import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';

import { buscarPedido, STATUS_PEDIDO } from '../services/pedidoService';
import { buscarPedidoAcompanhamento } from '../services/acompanhamentoPedidoStorage';
import { cores } from '../theme/theme';

export default function AcompanharPedidoScreen({ navigation }) {
  const [pedido, setPedido] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [semPedido, setSemPedido] = useState(false);
  const [erro, setErro] = useState(null);
  const [atualizadoEm, setAtualizadoEm] = useState(null);

  useEffect(() => {
    let ativo = true;
    let temporizador = null;
    let dadosAcompanhamento = null;
    let acompanhamentoEncerrado = false;
    let semPedidoEncontrado = false;
    

    async function consultarPedido() {
  try {
    setErro(null);

    dadosAcompanhamento = await buscarPedidoAcompanhamento();
    if (!ativo) return;

    if (!dadosAcompanhamento) {
      semPedidoEncontrado = true;
      setSemPedido(true);
      return;
    }

    const { pedidoId, telefone } = dadosAcompanhamento;

    const resultado = await buscarPedido(pedidoId, telefone);
    if (!ativo) return;

    setPedido(resultado);
    setAtualizadoEm(new Date()); // place holder

    if (
      resultado?.status === 'entregue' ||
      resultado?.status === 'cancelado'
    ) {
      acompanhamentoEncerrado = true;
    }

  } catch (erro) {
    console.error('Erro ao consultar pedido:', erro);
    if (ativo) {
    setErro('Não foi possível atualizar o pedido. Tentaremos novamente.');
  } 
} finally {
    if (ativo) {
      setCarregando(false);

      if (!semPedidoEncontrado && !acompanhamentoEncerrado) {
        temporizador = setTimeout(consultarPedido, 10000);
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

  if (carregando) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={styles.textoAuxiliar}>
          Consultando seu pedido...
        </Text>
      </View>
    );
  }

  if (semPedido) {
    return (
      <View style={styles.centralizado}>
        <Text style={styles.titulo}>
          Nenhum pedido encontrado
        </Text>

        <Text style={styles.textoAuxiliar}>
          Você ainda não possui um pedido salvo para acompanhamento neste aparelho.
        </Text>

        <TouchableOpacity
          style={styles.botao}
          onPress={voltarHome}
        >
          <Text style={styles.textoBotao}>
            Voltar ao início
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const informacoesStatus = STATUS_PEDIDO[pedido?.status];

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
            Tentaremos consultar novamente em alguns segundos.
          </Text>
        </View>
      )}

      {pedido && (
        <>
          <View style={styles.card}>
            <Text style={styles.subtitulo}>
              Pedido Nº {pedido.numero}
            </Text>

            <Text style={styles.label}>
              Status atual
            </Text>

            <View
              style={[
                styles.status,
                { backgroundColor: informacoesStatus?.cor || '#9CA3AF' }
              ]}
            >
              <Text style={styles.textoStatus}>
                {informacoesStatus?.texto || pedido.status}
              </Text>
            </View>

            <Text style={styles.textoAuxiliar}>
              Tipo: {pedido.tipo}
            </Text>

            <Text style={styles.textoAuxiliar}>
              Total: R$ {formatarPreco(pedido.total)}
            </Text>

            {pedido.criado_em && (
              <Text style={styles.textoAuxiliar}>
                Criado em: {new Date(pedido.criado_em).toLocaleString('pt-BR')}
              </Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.subtitulo}>
              Itens do pedido
            </Text>

            {(pedido.itens_pedido || []).map((item) => (
              <View
                key={item.id}
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
            ))}
          </View>

          <Text style={styles.atualizacao}>
            {atualizadoEm
              ? `Última consulta: ${atualizadoEm.toLocaleTimeString('pt-BR')}`
              : 'Aguardando atualização...'}
          </Text>

          <Text style={styles.textoAuxiliar}>
            O status é verificado automaticamente a cada 10 segundos.
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
    fontSize: 26,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 20,
  },

  card: {
    backgroundColor: cores.branco,
    padding: 18,
    borderRadius: 12,
    marginBottom: 18,
  },

  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 15,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },

  status: {
    alignSelf: 'flex-start',
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 15,
  },

  textoStatus: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

  textoAuxiliar: {
    color: '#666666',
    fontSize: 14,
    marginTop: 7,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.texto,
  },

  precoItem: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  atualizacao: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 5,
    color: cores.texto,
  },

  avisoErro: {
    backgroundColor: '#FEE2E2',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },

  textoErro: {
    color: '#B91C1C',
    fontWeight: 'bold',
  },

  botao: {
    backgroundColor: cores.primaria,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },

  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  botaoSecundario: {
    borderWidth: 1,
    borderColor: cores.primaria,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },

  textoBotaoSecundario: {
    color: cores.primaria,
    fontWeight: 'bold',
    fontSize: 15,
  },
});
