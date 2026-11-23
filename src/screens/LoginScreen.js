// =====================================================================
// src/screens/LoginScreen.js
// Tela de login do painel administrativo.
//
// Cartão: Tela de login do admin
// Responsável: Adrian Rafa
//
// QUEM DECIDE SE PODE ENTRAR NÃO É ESTA TELA.
// A regra fica no fazerLogin() do authService (Nicolas): ele confere o
// perfil no banco e desloga quem não é admin. Esta tela só cuida de:
//   1. mostrar os erros em português, dentro da própria tela
//   2. mostrar que está carregando
//   3. mostrar o carregando enquanto o perfil de admin é conferido
//
// Quem leva o admin para o Painel Administrativo é o AppNavigator:
// assim que o perfil de admin carrega, ele troca as telas da loja
// pelas telas do painel. Por isso esta tela não navega sozinha.
//
// Por que o erro aparece na tela e não num Alert: o Alert.alert do
// React Native não faz nada na versão web, e o app vai para a Vercel.
// Lá o usuário erraria a senha e não veria mensagem nenhuma.
// =====================================================================

import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { fazerLogin, fazerLogout } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { cores, bordas } from '../theme/theme';

// ---------------------------------------------------------------------
// O Supabase responde em inglês. Aqui cada mensagem conhecida vira uma
// frase que o dono da pastelaria entende. As mensagens que o authService
// já escreve em português passam direto.
// ---------------------------------------------------------------------
function traduzirErro(mensagem = '') {
  const m = mensagem.toLowerCase();

  if (m.includes('invalid login credentials')) {
    return 'E-mail ou senha incorretos.';
  }
  if (m.includes('email not confirmed')) {
    return 'Este e-mail ainda não foi confirmado.';
  }
  if (m.includes('rate limit') || m.includes('too many')) {
    return 'Muitas tentativas seguidas. Aguarde um minuto e tente de novo.';
  }
  if (m.includes('network') || m.includes('failed to fetch')) {
    return 'Sem conexão com o servidor. Verifique sua internet.';
  }
  if (m.includes('nao foi possivel realizar o login')) {
    return 'Já existe uma sessão aberta neste aparelho. Tente novamente.';
  }

  return mensagem || 'Não foi possível entrar. Tente novamente.';
}

export default function LoginScreen() {
  const { sessao, perfil, carregando: carregandoSessao } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [entrando, setEntrando] = useState(false);
  const [erro, setErro] = useState('');

  const campoSenha = useRef(null);

  async function entrar() {
    if (entrando) return;

    setErro('');

    if (!email.trim() || !senha) {
      setErro('Informe seu e-mail e sua senha.');
      return;
    }

    setEntrando(true);

    try {
      // Quem se cadastrou como cliente fica com a sessão aberta, e o
      // fazerLogin() recusa qualquer login quando já existe sessão.
      // Fechando a sessão antes, essa pessoa não fica presa aqui.
      if (sessao && perfil?.role !== 'admin') {
        await fazerLogout();
      }

      await fazerLogin({ email: email.trim(), senha });

      // Deu certo: o AppNavigator percebe o perfil de admin e abre o painel.
      setSenha('');
    } catch (e) {
      setErro(traduzirErro(e?.message));
    } finally {
      setEntrando(false);
    }
  }

  // Enquanto o app descobre se já existe sessão, não mostra o formulário
  // para não piscar a tela de login antes de redirecionar.
  if (carregandoSessao) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.cartao}>
        <Text style={styles.titulo}>Painel da pastelaria</Text>
        <Text style={styles.subtitulo}>
          Acesso restrito aos administradores
        </Text>

        <Text style={styles.rotulo}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          placeholderTextColor={cores.textoSecundario}
          value={email}
          onChangeText={(texto) => {
            setEmail(texto);
            if (erro) setErro('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          returnKeyType="next"
          onSubmitEditing={() => campoSenha.current?.focus()}
          editable={!entrando}
        />

        <Text style={styles.rotulo}>Senha</Text>
        <View style={styles.linhaSenha}>
          <TextInput
            ref={campoSenha}
            style={[styles.input, styles.inputSenha]}
            placeholder="Sua senha"
            placeholderTextColor={cores.textoSecundario}
            value={senha}
            onChangeText={(texto) => {
              setSenha(texto);
              if (erro) setErro('');
            }}
            secureTextEntry={!mostrarSenha}
            autoCapitalize="none"
            autoComplete="password"
            returnKeyType="go"
            onSubmitEditing={entrar}
            editable={!entrando}
          />
          <Pressable
            onPress={() => setMostrarSenha((v) => !v)}
            style={styles.botaoMostrar}
            accessibilityRole="button"
            accessibilityLabel={mostrarSenha ? 'Esconder senha' : 'Mostrar senha'}
          >
            <Text style={styles.textoMostrar}>
              {mostrarSenha ? 'Esconder' : 'Mostrar'}
            </Text>
          </Pressable>
        </View>

        {erro ? (
          <View style={styles.caixaErro} accessibilityLiveRegion="polite">
            <Text style={styles.textoErro}>{erro}</Text>
          </View>
        ) : null}

        <Pressable
          onPress={entrar}
          disabled={entrando}
          style={({ pressed }) => [
            styles.botao,
            pressed && styles.botaoPressionado,
            entrando && styles.botaoDesativado,
          ]}
          accessibilityRole="button"
        >
          {entrando ? (
            <ActivityIndicator color={cores.branco} />
          ) : (
            <Text style={styles.textoBotao}>Entrar</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: cores.fundo,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.fundo,
  },
  cartao: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    padding: 24,
    backgroundColor: cores.branco,
    borderRadius: bordas.grande,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: cores.texto,
    textAlign: 'center',
  },
  subtitulo: {
    marginTop: 4,
    marginBottom: 24,
    fontSize: 14,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
  rotulo: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
    color: cores.texto,
  },
  input: {
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: cores.texto,
    backgroundColor: cores.cinzaClaro,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: bordas.pequena,
  },
  linhaSenha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  inputSenha: {
    flex: 1,
  },
  botaoMostrar: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  textoMostrar: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.primaria,
  },
  caixaErro: {
    marginBottom: 16,
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
  botao: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    backgroundColor: cores.primaria,
    borderRadius: bordas.media,
  },
  botaoPressionado: {
    backgroundColor: cores.primariaEscura,
  },
  botaoDesativado: {
    opacity: 0.7,
  },
  textoBotao: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.branco,
  },
});
