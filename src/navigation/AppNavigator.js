import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import CardapioScreen from '../screens/CardapioScreen';
import ProdutoScreen from '../screens/ProdutoScreen';
import CarrinhoScreen from '../screens/CarrinhoScreen';
import FinalizacaoScreen from '../screens/FinalizacaoScreen';
import PedidoConfirmadoScreen from '../screens/PedidoConfirmadoScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {

  return (
    <Stack.Navigator initialRouteName="Home">

      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Início' }}
      />

      <Stack.Screen
        name="Cardapio"
        component={CardapioScreen}
        options={{ title: 'Cardápio' }}
      />

      <Stack.Screen
        name="Produto"
        component={ProdutoScreen}
        options={{ title: 'Produto' }}
      />

      <Stack.Screen
        name="Carrinho"
        component={CarrinhoScreen}
        options={{ title: 'Carrinho' }}
      />

      <Stack.Screen
        name="Finalizacao"
        component={FinalizacaoScreen}
        options={{ title: 'Finalizar Pedido' }}
      />

      <Stack.Screen
        name="PedidoConfirmado"
        component={PedidoConfirmadoScreen}
        options={{
          title: 'Pedido Confirmado',
          headerBackVisible: false
        }}
      />

    </Stack.Navigator>
  );
}