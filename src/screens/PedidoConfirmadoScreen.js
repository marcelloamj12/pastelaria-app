import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet
} from 'react-native';
import { STATUS_PEDIDO } from '../services/pedidoService';

export default function PedidoConfirmadoScreen({ route, navigation }) {

  const total = route.params?.total;
  const numero = route.params?.numero;
const status = route.params?.status;

  function voltarInicio() {
    navigation.popToTop();
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Pedido Confirmado!
      </Text>

      <Text style={styles.mensagem}>
        Seu pedido foi realizado com sucesso.
      </Text>

      {numero && (
  <Text>Número do pedido: {numero}</Text>
    )}

    {status && (
      <Text>
        Status: {STATUS_PEDIDO[status]?.texto ?? status}
      </Text>
    )}

      {total !== undefined && (
        <Text style={styles.total}>
          Total do pedido: R$ {total.toFixed(2)}
        </Text>
      )}

      <Button
        title="Voltar ao Início"
        onPress={voltarInicio}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  mensagem: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },

  total: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },

});