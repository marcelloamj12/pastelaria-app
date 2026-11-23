// =====================================================================
// src/screens/AdminScreen.js
// Painel Administrativo: a primeira tela do dono depois do login.
//
// Cartão: Painel do admin sem as telas da loja
// Responsável: Adrian Rafa
//
// O admin não vê as telas da loja (Início, Cardápio, Meus pedidos e
// Carrinho), porque não faz sentido o dono comprar pelo painel. Aqui ele
// só escolhe o que quer administrar. O botão "Sair da conta" encerra a
// sessão, e o AppNavigator volta sozinho para a loja, como cliente.
// =====================================================================

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { fazerLogout } from '../services/authService';
import { cores, bordas } from '../theme/theme';

const AREAS = [
  {
    rota: 'ClientesAdmin',
    titulo: 'Gerenciar clientes',
    descricao: 'Quem já comprou, quantos pedidos fez e quanto gastou',
  },
  {
    rota: 'PedidosAdmin',
    titulo: 'Gerenciar pedidos',
    descricao: 'Ver os pedidos e mudar o status',
  },
  {
    rota: 'ItensPedidosAdmin',
    titulo: 'Consultar itens dos pedidos',
    descricao: 'O que foi pedido em cada pedido',
  },
];

export default function AdminScreen({ navigation }) {
  const [saindo, setSaindo] = useState(false);
  const [erro, setErro] = useState('');

  async function sair() {
    if (saindo) return;
    setErro('');
    setSaindo(true);
    try {
      // Sem a sessão, o perfil de admin some e o AppNavigator
      // troca o painel pela loja. Não precisa navegar daqui.
      await fazerLogout();
    } catch (e) {
      setErro('Não foi possível sair agora. Tente de novo.');
      setSaindo(false);
    }
  }

  return (
    <View style={styles.tela}>
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Painel Administrativo</Text>
        <Text style={styles.subtitulo}>Escolha uma área para administrar:</Text>

        {AREAS.map((area) => (
          <Pressable
            key={area.rota}
            onPress={() => navigation.navigate(area.rota)}
            style={({ pressed }) => [styles.area, pressed && styles.areaPressionada]}
            accessibilityRole="button"
          >
            <Text style={styles.areaTitulo}>{area.titulo}</Text>
            <Text style={styles.areaDescricao}>{area.descricao}</Text>
          </Pressable>
        ))}

        {erro ? (
          <View style={styles.caixaErro}>
            <Text style={styles.textoErro}>{erro}</Text>
          </View>
        ) : null}

        <Pressable
          onPress={sair}
          disabled={saindo}
          style={({ pressed }) => [styles.botaoSair, pressed && styles.botaoSairPressionado]}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta de administrador e voltar para a loja"
        >
          {saindo ? (
            <ActivityIndicator color={cores.primaria} />
          ) : (
            <Text style={styles.textoSair}>Sair da conta</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: cores.fundo,
  },
  conteudo: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: cores.texto,
  },
  subtitulo: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 15,
    color: cores.textoSecundario,
  },
  area: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderLeftWidth: 4,
    borderLeftColor: cores.primaria,
    borderRadius: bordas.media,
  },
  areaPressionada: {
    backgroundColor: cores.cinzaClaro,
  },
  areaTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: cores.texto,
  },
  areaDescricao: {
    marginTop: 4,
    fontSize: 13,
    color: cores.textoSecundario,
  },
  caixaErro: {
    marginTop: 4,
    marginBottom: 8,
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
  botaoSair: {
    minHeight: 48,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: cores.primaria,
    borderRadius: bordas.media,
  },
  botaoSairPressionado: {
    backgroundColor: cores.cinzaClaro,
  },
  textoSair: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.primaria,
  },
});
