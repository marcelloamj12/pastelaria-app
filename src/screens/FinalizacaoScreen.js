import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert
} from 'react-native';

export default function FinalizacaoScreen({ route, navigation }) {

  const produto = route.params?.produto;
  const quantidade = route.params?.quantidade;
  const total = route.params?.total;

  function confirmarPedido() {

    Alert.alert(
      'Pedido realizado!',
      'Seu pedido foi realizado com sucesso.'
    );

    navigation.popToTop();
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Finalizar Pedido
      </Text>

      <Text style={styles.subtitulo}>
        Resumo do pedido
      </Text>

      {produto ? (
        <>
          <Text style={styles.nome}>
            {produto.nome}
          </Text>

          <Text>
            Quantidade: {quantidade}
          </Text>

          <Text style={styles.total}>
            Total: R$ {total.toFixed(2)}
          </Text>

          <Button
            title="Confirmar Pedido"
            onPress={confirmarPedido}
          />

        </>
      ) : (
        <Text>Nenhum produto selecionado.</Text>
      )}

      <View style={styles.espaco}>
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  subtitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  total: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 20,
  },

  espaco: {
    marginTop: 10,
  },

});