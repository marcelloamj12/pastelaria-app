
// tela place holder teste para a area de admin


import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
} from 'react-native';

export default function AdminScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Painel Administrativo
      </Text>

      <Text style={styles.subtitulo}>
        Escolha uma área para administrar:
      </Text>

      <View style={styles.botao}>
        <Button
          title="Gerenciar Clientes"
          onPress={() => navigation.navigate('ClientesAdmin')}
        />
      </View>

      <View style={styles.botao}>
        <Button
          title="Gerenciar Pedidos"
          onPress={() => navigation.navigate('PedidosAdmin')}
        />
      </View>

      <View style={styles.botao}>
        <Button
          title="Consultar Itens dos Pedidos"
          onPress={() => navigation.navigate('ItensPedidosAdmin')}
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  subtitulo: {
    fontSize: 18,
    marginBottom: 25,
  },

  botao: {
    marginBottom: 15,
  },
});
