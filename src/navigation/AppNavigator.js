import React from 'react';
import { Text } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import CardapioScreen from '../screens/CardapioScreen';
import MeusPedidosScreen from '../screens/MeusPedidosScreen';
import ProdutoScreen from '../screens/ProdutoScreen';
import CarrinhoScreen from '../screens/CarrinhoScreen';
import FinalizacaoScreen from '../screens/FinalizacaoScreen';
import PedidoConfirmadoScreen from '../screens/PedidoConfirmadoScreen';
import LoginScreen from '../screens/LoginScreen';
import AdminScreen from '../screens/AdminScreen';
import ClientesAdminScreen from '../screens/ClientesAdminScreen';
import PedidosAdminScreen from '../screens/PedidosAdminScreen';
import ItensPedidosAdminScreen from '../screens/ItensPedidosAdminScreen';

import { cores } from '../theme/theme';
import { useCarrinho } from '../context/CarrinhoContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function NavegacaoInferior() {
  const { itens } = useCarrinho();

  const quantidadeCarrinho = itens.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: cores.branco,
          borderTopColor: cores.borda,
          borderTopWidth: 1,
          height: 65,
          paddingTop: 5,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color }) => {
          let icone = '⌂';

          if (route.name === 'Cardapio') {
            icone = '▤';
          }

          if (route.name === 'MeusPedidos') {
            icone = '☷';
          }

          if (route.name === 'Carrinho') {
            icone = '🛒';
          }

          return (
            <Text
              style={{
                fontSize: 24,
                color,
                textAlign: 'center',
              }}
            >
              {icone}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Cardapio"
        component={CardapioScreen}
        options={{
          title: 'Cardápio',
        }}
      />

      <Tab.Screen
        name="MeusPedidos"
        component={MeusPedidosScreen}
        options={{
          title: 'Meus pedidos',
        }}
      />

      <Tab.Screen
  name="Carrinho"
  component={CarrinhoScreen}
  options={{
    title: 'Carrinho',
    tabBarBadge: quantidadeCarrinho > 0
      ? quantidadeCarrinho
      : undefined,
    tabBarBadgeStyle: {
      backgroundColor: cores.primaria,
      color: cores.branco,
      fontSize: 11,
      fontWeight: '700',
    },
  }}
/>
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="MainTabs">

      <Stack.Screen
        name="MainTabs"
        component={NavegacaoInferior}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Produto"
        component={ProdutoScreen}
        options={{ title: 'Produto' }}
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
          headerBackVisible: false,
        }}
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
