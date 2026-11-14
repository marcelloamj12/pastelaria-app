import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import CardapioScreen from '../screens/CardapioScreen';
import ProdutoScreen from '../screens/ProdutoScreen';
import CarrinhoScreen from '../screens/CarrinhoScreen';
import FinalizacaoScreen from '../screens/FinalizacaoScreen';
import PedidoConfirmadoScreen from '../screens/PedidoConfirmadoScreen';
import CadastroScreen from '../screens/CadastroScreen';
import LoginScreen from '../screens/LoginScreen';
import AdminScreen from '../screens/AdminScreen';
import ClientesAdminScreen from '../screens/ClientesAdminScreen';
import PedidosAdminScreen from '../screens/PedidosAdminScreen';
import ItensPedidosAdminScreen from '../screens/ItensPedidosAdminScreen';

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

      <Stack.Screen
        name="Cadastro"
        component={CadastroScreen}
        options={{ title: 'Criar conta' }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Entrar' }}
      />

      <Stack.Screen
        name="Admin"
        component={AdminScreen}
        options={{ title: 'Painel Administrativo' }}
      />

      <Stack.Screen
        name="ClientesAdmin"
        component={ClientesAdminScreen}
        options={{ title: 'Clientes' }}
      />

      <Stack.Screen
        name="PedidosAdmin"
        component={PedidosAdminScreen}
        options={{ title: 'Pedidos' }}
      />

      <Stack.Screen
        name="ItensPedidosAdmin"
        component={ItensPedidosAdminScreen}
        options={{ title: 'Itens dos Pedidos' }}
      />

    </Stack.Navigator>
  );
}
