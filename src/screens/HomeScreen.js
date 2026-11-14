import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, } from 'react-native';

import { fazerLogout, } from '../services/authService';

import { listarDestaques, formatarPreco } from '../services/cardapioService';

import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const [destaques, setDestaques] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

const {
  sessao,
  perfil,
  carregando: carregandoAuth,
  erroPerfil,
} = useAuth();


  useEffect(() => {
    async function carregarDestaques() {
      try {
        setCarregando(true);
        setErro(null);

        const dados = await listarDestaques();
        setDestaques(dados);
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarDestaques();
  }, []);


async function sairDaConta() {
  try {
    await fazerLogout();

    Alert.alert(
      'Logout realizado',
      'Você saiu da sua conta com sucesso.'
    );
  } catch (error) {
    Alert.alert('Erro ao sair da conta', error.message);
  }
}


  return (
    <View style={styles.container}>

    {carregandoAuth ? (
  <Text>Carregando sua conta...</Text>
   ) : sessao ? (
  <Text style={styles.subtitulo}>
    Bem-vindo, {perfil?.nome || 'usuário'}!
  </Text>
   ) : (
  <Text style={styles.subtitulo}>
    Bem-vindo!
  </Text>
   )}

    {erroPerfil && (
  <Text>
    Não foi possível carregar seu perfil: {erroPerfil}
  </Text>
   )}

   {!carregandoAuth && sessao && perfil?.role === 'admin' && (
  <Text style={styles.identificacaoAdmin}>
    ADMINISTRADOR
  </Text>
)}


      <Text style={styles.titulo}>Menu Digital</Text>

      <Text style={styles.subtitulo}>Mais pedidos</Text>

      {carregando && (
        <Text>Carregando destaques...</Text>
      )}

      {erro && (
        <Text>Erro ao carregar os destaques: {erro}</Text>
      )}

      {!carregando && !erro && destaques.map((produto) => (
        <View
          key={produto.id}
          style={styles.produto}
        >
          <Text style={styles.nomeProduto}>
            {produto.nome}
          </Text>

          <Text>
            {produto.descricao}
          </Text>

          <Text style={styles.preco}>
            {formatarPreco(produto.preco)}
          </Text>

          <Button
            title="Ver Produto"
            onPress={() =>
              navigation.navigate('Produto', {
                produto: produto
              })
            }
          />
        </View>
      ))}

      <Button
        title="Ver Cardápio"
        onPress={() => navigation.navigate('Cardapio')}
      />

      {!carregandoAuth && sessao && perfil?.role === 'admin' && (
  <View style={styles.espaco}>
    <Button
      title="Painel Administrativo"
      onPress={() => navigation.navigate('Admin')}
    />
  </View>
)}

      <View style={styles.espaco} />

      {sessao ? (
  <Button
    title="Sair da conta"
    onPress={sairDaConta}
    color="red"
  />
) : (
  <>
    <Button
      title="Entrar na conta"
      onPress={() => navigation.navigate('Login')}
    />

    <View style={styles.espaco} />

    <Button
      title="Criar uma conta"
      onPress={() => navigation.navigate('Cadastro')}
    />
  </>
     )}  
   </View>  
  );
}

const styles = StyleSheet.create({

  espaco: {
  height: 15,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  titulo: {
    fontSize: 30,
    marginBottom: 20,
  },

  subtitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  produto: {
    marginBottom: 20,
  },

  nomeProduto: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  preco: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
  },

  identificacaoAdmin: {
  color: '#15803D',
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 15,
},

});
