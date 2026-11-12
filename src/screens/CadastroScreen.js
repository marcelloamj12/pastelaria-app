

// tela place holder de login para teste, a tela original sera feita posteriormente

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert
} from 'react-native';

import { cadastrarUsuario } from '../services/authService';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro() {
    try {
      setCarregando(true);

      const data = await cadastrarUsuario({
        nome,
        email,
        senha
      });

      if (data.user && !data.session) {
        Alert.alert(
          'Cadastro realizado',
          'Verifique seu e-mail para confirmar sua conta.'
        );
      } else {
        Alert.alert(
          'Sucesso',
          'Sua conta foi criada com sucesso!'
        );
      }

      setNome('');
      setEmail('');
      setSenha('');

    } catch (error) {
  Alert.alert(
    'Não foi possível realizar o cadastro',
    'Verifique os dados informados ou tente fazer login.'
  );
}    finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Criar conta
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Button
        title={carregando ? 'Cadastrando...' : 'Cadastrar'}
        onPress={handleCadastro}
        disabled={carregando}
      />

      <View style={styles.espaco} />

      <Button
        title="Já tenho uma conta"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },

  espaco: {
    height: 15,
  },
});
