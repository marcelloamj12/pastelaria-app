import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { STATUS_PEDIDO } from '../services/pedidoService';
import { cores } from '../theme/theme';

export default function PedidoConfirmadoScreen({ route, navigation }) {

  const total = route.params?.total;
  const numero = route.params?.numero;
const status = route.params?.status;

  function voltarInicio() {
  navigation.navigate('MainTabs', {
    screen: 'Home',
  });
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
          Total do pedido: R$ {Number(total).toFixed(2).replace('.', ',')}
        </Text>
      )}

      <TouchableOpacity
  style={styles.botaoInicio}
  onPress={voltarInicio}
>
  <Text style={styles.textoBotaoInicio}>
    Voltar ao Início
  </Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: cores.fundo,
  padding: 20,
},

botaoInicio: {
  backgroundColor: cores.primaria,
  paddingVertical: 16,
  paddingHorizontal: 24,
  borderRadius: 12,
  alignItems: 'center',
  width: '100%',
},

textoBotaoInicio: {
  color: cores.branco,
  fontSize: 16,
  fontWeight: '700',
},

  titulo: {
  fontSize: 28,
  fontWeight: '700',
  color: cores.sucesso,
  marginBottom: 20,
  textAlign: 'center',
},

  mensagem: {
  fontSize: 16,
  color: cores.textoSecundario,
  lineHeight: 24,
  marginBottom: 20,
  textAlign: 'center',
},

  total: {
  fontSize: 24,
  fontWeight: '700',
  color: cores.primaria,
  marginTop: 16,
  marginBottom: 30,
  textAlign: 'center',
},

});