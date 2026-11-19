
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './src/navigation/AppNavigator';

import { AuthProvider } from './src/context/AuthContext';
import { CarrinhoProvider } from './src/context/CarrinhoContext';

import {
  configuracaoSupabaseValida,
} from './src/lib/supabase';

function TelaErroConfiguracao() {
  return (
    <View style={styles.container}>
      <Text style={styles.icone}>⚠️</Text>

      <Text style={styles.titulo}>
        Configuração necessária
      </Text>

      <Text style={styles.mensagem}>
        Não foi possível iniciar o aplicativo porque
        a conexão com o banco de dados não está configurada.
      </Text>

      <Text style={styles.orientacao}>
        Verifique se o arquivo .env contém as variáveis
        EXPO_PUBLIC_SUPABASE_URL e
        EXPO_PUBLIC_SUPABASE_ANON_KEY.
      </Text>

      <Text style={styles.dica}>
        Depois de configurar, reinicie o aplicativo
        utilizando npx expo start -c.
      </Text>
    </View>
  );
}

export default function App() {
  if (!configuracaoSupabaseValida) {
    return <TelaErroConfiguracao />;
  }

  return (
    <AuthProvider>
      <CarrinhoProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </CarrinhoProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  icone: {
    fontSize: 42,
    marginBottom: 18,
  },

  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 16,
  },

  mensagem: {
    fontSize: 16,
    color: '#444444',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 18,
  },

  orientacao: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 14,
  },

  dica: {
    fontSize: 13,
    color: '#D62828',
    textAlign: 'center',
    lineHeight: 20,
  },
});
