// =====================================================================
// src/screens/ClientesAdminScreen.js
// Tela de clientes do painel administrativo.
//
// Cartão: Tela de clientes do admin
// Responsável: Adrian Rafa
//
// O que a tela mostra para o dono da pastelaria:
//   - quantos clientes existem e quantos já fizeram pedido
//   - busca por nome ou telefone
//   - para cada cliente: telefone, e-mail, desde quando é cliente,
//     quantos pedidos fez, quanto já gastou e a data do último pedido
//   - botão "Sair" no topo, que encerra a sessão e volta para a loja
//
// De onde vêm os dados: dos serviços do Nicolas (adminService).
//   listarClientesAdmin()  -> tabela clientes
//   listarPedidosAdmin()   -> tabela pedidos (com nome e telefone do cliente)
// Os dois só funcionam para admin: o banco (RLS) e o verificarAdmin()
// bloqueiam qualquer outra pessoa.
//
// Os pedidos são ligados ao cliente pelo telefone (só os números),
// porque é o dado que o listarPedidosAdmin() já devolve.
//
// Erros aparecem dentro da tela (o Alert.alert não funciona na web).
// =====================================================================

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  listarClientesAdmin,
  listarPedidosAdmin,
} from '../services/adminService';
import { fazerLogout } from '../services/authService';
import { cores, bordas } from '../theme/theme';

// ---------------------------------------------------------------------
// Funções de formatação (sem depender de Intl, que varia entre
// Android, iOS e navegador)
// ---------------------------------------------------------------------
function somenteNumeros(texto = '') {
  return String(texto).replace(/\D/g, '');
}

function formatarTelefone(telefone = '') {
  const n = somenteNumeros(telefone);
  if (n.length === 11) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
  if (n.length === 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
  return telefone || '-';
}

function formatarData(dataIso) {
  if (!dataIso) return '-';
  const d = new Date(dataIso);
  if (Number.isNaN(d.getTime())) return '-';
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${d.getFullYear()}`;
}

function formatarDinheiro(valor) {
  const numero = Number(valor) || 0;
  const [inteiro, centavos] = numero.toFixed(2).split('.');
  const comPontos = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${comPontos},${centavos}`;
}

// Tira acentos e deixa minúsculo para a busca achar "José" digitando "jose"
function normalizar(texto = '') {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// ---------------------------------------------------------------------
// Junta os pedidos em cada cliente: quantidade, total gasto e último pedido.
// Pedido cancelado conta na quantidade, mas não soma no total gasto.
// ---------------------------------------------------------------------
function montarResumoPorTelefone(pedidos) {
  const resumo = {};

  pedidos.forEach((pedido) => {
    const telefone = somenteNumeros(pedido.clientes?.telefone);
    if (!telefone) return;

    if (!resumo[telefone]) {
      resumo[telefone] = { quantidade: 0, totalGasto: 0, ultimoPedido: null };
    }

    const item = resumo[telefone];
    item.quantidade += 1;

    if (pedido.status !== 'cancelado') {
      item.totalGasto += Number(pedido.total) || 0;
    }

    if (!item.ultimoPedido || new Date(pedido.criado_em) > new Date(item.ultimoPedido)) {
      item.ultimoPedido = pedido.criado_em;
    }
  });

  return resumo;
}

// ---------------------------------------------------------------------
// Cartão de um cliente
// ---------------------------------------------------------------------
function CartaoCliente({ cliente, pedidosDisponiveis }) {
  const { resumo } = cliente;

  return (
    <View style={styles.cartao}>
      <View style={styles.cartaoTopo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>
            {(cliente.nome || '?').trim().charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.cartaoIdentificacao}>
          <Text style={styles.nome} numberOfLines={1}>
            {cliente.nome}
          </Text>
          <Text style={styles.telefone}>{formatarTelefone(cliente.telefone)}</Text>
        </View>
      </View>

      <Text style={styles.linhaInfo}>
        E-mail: <Text style={styles.valorInfo}>{cliente.email || 'Não informado'}</Text>
      </Text>
      <Text style={styles.linhaInfo}>
        Cliente desde: <Text style={styles.valorInfo}>{formatarData(cliente.criado_em)}</Text>
      </Text>

      {pedidosDisponiveis ? (
        <View style={styles.metricas}>
          <View style={styles.metrica}>
            <Text style={styles.metricaValor}>{resumo.quantidade}</Text>
            <Text style={styles.metricaRotulo}>
              {resumo.quantidade === 1 ? 'pedido' : 'pedidos'}
            </Text>
          </View>

          <View style={styles.metrica}>
            <Text style={styles.metricaValor}>{formatarDinheiro(resumo.totalGasto)}</Text>
            <Text style={styles.metricaRotulo}>total gasto</Text>
          </View>

          <View style={styles.metrica}>
            <Text style={styles.metricaValor}>{formatarData(resumo.ultimoPedido)}</Text>
            <Text style={styles.metricaRotulo}>último pedido</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------
// Tela
// ---------------------------------------------------------------------
export default function ClientesAdminScreen({ navigation }) {
  const [clientes, setClientes] = useState([]);
  const [resumoPedidos, setResumoPedidos] = useState({});
  const [pedidosDisponiveis, setPedidosDisponiveis] = useState(true);
  const [busca, setBusca] = useState('');

  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');
  const [semPermissao, setSemPermissao] = useState(false);
  const [saindo, setSaindo] = useState(false);

  // Encerra a sessão do admin. Sem a sessão, o AppNavigator troca
  // sozinho as telas do painel pelas da loja, então não precisa navegar.
  const sair = useCallback(async () => {
    if (saindo) return;
    setSaindo(true);
    try {
      await fazerLogout();
    } catch (e) {
      setErro('Não foi possível sair agora. Tente de novo.');
      setSaindo(false);
    }
  }, [navigation, saindo]);

  // Botão "Sair" no canto direito do cabeçalho
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={sair}
          disabled={saindo}
          style={({ pressed }) => [styles.botaoSair, pressed && styles.botaoSairPressionado]}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta de administrador"
        >
          {saindo ? (
            <ActivityIndicator size="small" color={cores.primaria} />
          ) : (
            <Text style={styles.textoSair}>Sair</Text>
          )}
        </Pressable>
      ),
    });
  }, [navigation, sair, saindo]);

  const carregar = useCallback(async () => {
    setErro('');
    setSemPermissao(false);

    // Clientes são obrigatórios; pedidos são um extra.
    // Se só os pedidos falharem, a lista de clientes ainda aparece.
    const [resClientes, resPedidos] = await Promise.allSettled([
      listarClientesAdmin(),
      listarPedidosAdmin(),
    ]);

    if (resClientes.status === 'rejected') {
      const mensagem = resClientes.reason?.message || '';
      const m = normalizar(mensagem);

      if (m.includes('administrador') || m.includes('nao autenticado')) {
        setSemPermissao(true);
        setErro('Sua sessão expirou ou esta conta não é de administrador. Entre de novo.');
      } else if (m.includes('network') || m.includes('failed to fetch')) {
        setErro('Sem conexão com o servidor. Verifique sua internet e tente de novo.');
      } else {
        setErro('Não foi possível carregar os clientes. Tente de novo.');
      }
      return;
    }

    setClientes(resClientes.value);

    if (resPedidos.status === 'fulfilled') {
      setResumoPedidos(montarResumoPorTelefone(resPedidos.value));
      setPedidosDisponiveis(true);
    } else {
      setResumoPedidos({});
      setPedidosDisponiveis(false);
    }
  }, []);

  useEffect(() => {
    carregar().finally(() => setCarregando(false));
  }, [carregar]);

  async function atualizar() {
    setAtualizando(true);
    await carregar();
    setAtualizando(false);
  }

  // Junta cada cliente com o resumo dos pedidos dele e aplica a busca
  const clientesFiltrados = useMemo(() => {
    const termo = normalizar(busca);
    const termoNumeros = somenteNumeros(busca);

    return clientes
      .map((cliente) => ({
        ...cliente,
        resumo: resumoPedidos[somenteNumeros(cliente.telefone)] || {
          quantidade: 0,
          totalGasto: 0,
          ultimoPedido: null,
        },
      }))
      .filter((cliente) => {
        if (!termo) return true;
        const achouNome = normalizar(cliente.nome).includes(termo);
        const achouTelefone =
          termoNumeros.length > 0 && somenteNumeros(cliente.telefone).includes(termoNumeros);
        return achouNome || achouTelefone;
      });
  }, [clientes, resumoPedidos, busca]);

  const comPedido = useMemo(
    () => clientes.filter((c) => resumoPedidos[somenteNumeros(c.telefone)]).length,
    [clientes, resumoPedidos]
  );

  // ----- Carregando pela primeira vez -----
  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={styles.textoCentro}>Carregando clientes...</Text>
      </View>
    );
  }

  // ----- Erro ao carregar (sem nada para mostrar) -----
  if (erro && clientes.length === 0) {
    return (
      <View style={styles.centro}>
        <View style={styles.caixaErro}>
          <Text style={styles.textoErro}>{erro}</Text>
        </View>

        {semPermissao ? (
          <Pressable
            style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
            onPress={sair}
            accessibilityRole="button"
          >
            <Text style={styles.textoBotao}>Sair e entrar de novo</Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
            onPress={async () => {
              setCarregando(true);
              await carregar();
              setCarregando(false);
            }}
            accessibilityRole="button"
          >
            <Text style={styles.textoBotao}>Tentar de novo</Text>
          </Pressable>
        )}
      </View>
    );
  }

  // ----- Cabeçalho da lista: resumo, busca e avisos -----
  const cabecalho = (
    <View>
      <View style={styles.resumo}>
        <View style={styles.resumoBloco}>
          <Text style={styles.resumoNumero}>{clientes.length}</Text>
          <Text style={styles.resumoRotulo}>
            {clientes.length === 1 ? 'cliente' : 'clientes'}
          </Text>
        </View>

        {pedidosDisponiveis ? (
          <View style={styles.resumoBloco}>
            <Text style={styles.resumoNumero}>{comPedido}</Text>
            <Text style={styles.resumoRotulo}>já fizeram pedido</Text>
          </View>
        ) : null}

        <Pressable
          style={({ pressed }) => [styles.botaoAtualizar, pressed && styles.botaoAtualizarPressionado]}
          onPress={atualizar}
          disabled={atualizando}
          accessibilityRole="button"
          accessibilityLabel="Atualizar lista de clientes"
        >
          {atualizando ? (
            <ActivityIndicator size="small" color={cores.primaria} />
          ) : (
            <Text style={styles.textoAtualizar}>Atualizar</Text>
          )}
        </Pressable>
      </View>

      <TextInput
        style={styles.busca}
        placeholder="Buscar por nome ou telefone"
        placeholderTextColor={cores.textoSecundario}
        value={busca}
        onChangeText={setBusca}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      {erro ? (
        <View style={styles.caixaErro}>
          <Text style={styles.textoErro}>{erro}</Text>
        </View>
      ) : null}

      {!pedidosDisponiveis ? (
        <View style={styles.caixaAviso}>
          <Text style={styles.textoAviso}>
            Não foi possível carregar os pedidos agora. Os totais por cliente vão aparecer
            quando você tocar em Atualizar.
          </Text>
        </View>
      ) : null}

      {busca ? (
        <Text style={styles.contagemBusca}>
          {clientesFiltrados.length}{' '}
          {clientesFiltrados.length === 1 ? 'resultado' : 'resultados'} para "{busca}"
        </Text>
      ) : null}
    </View>
  );

  return (
    <FlatList
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
      data={clientesFiltrados}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <CartaoCliente cliente={item} pedidosDisponiveis={pedidosDisponiveis} />
      )}
      ListHeaderComponent={cabecalho}
      ListEmptyComponent={
        <View style={styles.vazio}>
          <Text style={styles.vazioTitulo}>
            {busca ? 'Nenhum cliente encontrado' : 'Nenhum cliente ainda'}
          </Text>
          <Text style={styles.vazioTexto}>
            {busca
              ? 'Confira o nome ou o telefone digitado.'
              : 'Os clientes aparecem aqui depois do primeiro pedido feito pelo app.'}
          </Text>
        </View>
      }
      refreshControl={
        <RefreshControl
          refreshing={atualizando}
          onRefresh={atualizar}
          colors={[cores.primaria]}
          tintColor={cores.primaria}
        />
      }
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: 16,
    paddingBottom: 32,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: cores.fundo,
  },
  textoCentro: {
    marginTop: 12,
    fontSize: 15,
    color: cores.textoSecundario,
  },

  // Resumo do topo
  resumo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 16,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: bordas.grande,
  },
  resumoBloco: {
    marginRight: 24,
  },
  resumoNumero: {
    fontSize: 26,
    fontWeight: '800',
    color: cores.primaria,
  },
  resumoRotulo: {
    fontSize: 13,
    color: cores.textoSecundario,
  },
  botaoAtualizar: {
    marginLeft: 'auto',
    minWidth: 96,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: cores.primaria,
    borderRadius: bordas.media,
  },
  botaoAtualizarPressionado: {
    backgroundColor: cores.cinzaClaro,
  },
  textoAtualizar: {
    fontSize: 14,
    fontWeight: '700',
    color: cores.primaria,
  },

  // Busca
  busca: {
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: cores.texto,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: bordas.media,
  },
  contagemBusca: {
    marginBottom: 8,
    fontSize: 13,
    color: cores.textoSecundario,
  },

  // Cartão do cliente
  cartao: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: bordas.grande,
  },
  cartaoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: cores.secundaria,
    borderRadius: 22,
  },
  avatarTexto: {
    fontSize: 18,
    fontWeight: '800',
    color: cores.texto,
  },
  cartaoIdentificacao: {
    flex: 1,
  },
  nome: {
    fontSize: 17,
    fontWeight: '700',
    color: cores.texto,
  },
  telefone: {
    marginTop: 2,
    fontSize: 14,
    color: cores.textoSecundario,
  },
  linhaInfo: {
    marginTop: 2,
    fontSize: 14,
    color: cores.textoSecundario,
  },
  valorInfo: {
    color: cores.texto,
  },
  metricas: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  metrica: {
    flex: 1,
  },
  metricaValor: {
    fontSize: 15,
    fontWeight: '700',
    color: cores.texto,
  },
  metricaRotulo: {
    marginTop: 2,
    fontSize: 12,
    color: cores.textoSecundario,
  },

  // Lista vazia
  vazio: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  vazioTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: cores.texto,
  },
  vazioTexto: {
    marginTop: 6,
    fontSize: 14,
    textAlign: 'center',
    color: cores.textoSecundario,
  },

  // Mensagens
  caixaErro: {
    width: '100%',
    maxWidth: 420,
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#FDECEC',
    borderLeftWidth: 4,
    borderLeftColor: cores.erro,
    borderRadius: bordas.pequena,
  },
  textoErro: {
    fontSize: 14,
    color: cores.erro,
  },
  caixaAviso: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#FFF6DB',
    borderLeftWidth: 4,
    borderLeftColor: cores.secundaria,
    borderRadius: bordas.pequena,
  },
  textoAviso: {
    fontSize: 14,
    color: cores.texto,
  },

  // Botão Sair do cabeçalho
  botaoSair: {
    minWidth: 64,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: cores.primaria,
    borderRadius: bordas.pequena,
  },
  botaoSairPressionado: {
    backgroundColor: cores.cinzaClaro,
  },
  textoSair: {
    fontSize: 14,
    fontWeight: '700',
    color: cores.primaria,
  },

  // Botão principal
  botao: {
    minWidth: 200,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: cores.primaria,
    borderRadius: bordas.media,
  },
  botaoPressionado: {
    backgroundColor: cores.primariaEscura,
  },
  textoBotao: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.branco,
  },
});
