// =====================================================================
// src/components/BotaoSairAdmin.js
// Botão "Sair" do canto direito do cabeçalho, em todas as telas do admin.
//
// Cartão: Painel do admin sem as telas da loja
// Responsável: Adrian Rafa
//
// Ao tocar, encerra a sessão. Sem a sessão, o AppNavigator troca as
// telas do painel pelas da loja sozinho, então o botão não navega.
// =====================================================================

import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { fazerLogout } from '../services/authService';
import { cores, bordas } from '../theme/theme';

export default function BotaoSairAdmin() {
  const [saindo, setSaindo] = useState(false);
  const [falhou, setFalhou] = useState(false);

  async function sair() {
    if (saindo) return;
    setFalhou(false);
    setSaindo(true);
    try {
      await fazerLogout();
    } catch (e) {
      // Mostra "Tentar de novo" no próprio botão em vez de um Alert,
      // que não aparece na versão web.
      setFalhou(true);
      setSaindo(false);
    }
  }

  return (
    <Pressable
      onPress={sair}
      disabled={saindo}
      style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
      accessibilityRole="button"
      accessibilityLabel="Sair da conta de administrador e voltar para a loja"
    >
      {saindo ? (
        <ActivityIndicator size="small" color={cores.primaria} />
      ) : (
        <Text style={styles.texto}>{falhou ? 'Tentar de novo' : 'Sair'}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
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
  botaoPressionado: {
    backgroundColor: cores.cinzaClaro,
  },
  texto: {
    fontSize: 14,
    fontWeight: '700',
    color: cores.primaria,
  },
});
