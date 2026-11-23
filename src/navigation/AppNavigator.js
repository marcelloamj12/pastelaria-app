
import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import CardapioScreen from '../screens/CardapioScreen';
import MeusPedidosScreen from '../screens/MeusPedidosScreen';
import ProdutoScreen from '../screens/ProdutoScreen';
import CarrinhoScreen from '../screens/CarrinhoScreen';
import FinalizacaoScreen from '../screens/FinalizacaoScreen';
import PedidoConfirmadoScreen from '../screens/PedidoConfirmadoScreen';
import AcompanharPedidoScreen from '../screens/AcompanharPedidoScreen';

import LoginScreen from '../screens/LoginScreen';
import AdminScreen from '../screens/AdminScreen';
import ClientesAdminScreen from '../screens/ClientesAdminScreen';
import PedidosAdminScreen from '../screens/PedidosAdminScreen';
import ItensPedidosAdminScreen from '../screens/ItensPedidosAdminScreen';

import { cores } from '../theme/theme';
import { useCarrinho } from '../context/CarrinhoContext';
import { useAuth } from '../context/AuthContext';
import LojaHeader from '../components/LojaHeader';
import BotaoSairAdmin from '../components/BotaoSairAdmin';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function NavegacaoInferior() {
  const { itens } = useCarrinho();

  const quantidadeCarrinho = itens.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  const icones = {
    Home: ['home', 'home-outline'],
    Cardapio: ['restaurant', 'restaurant-outline'],
    MeusPedidos: ['receipt', 'receipt-outline'],
    Carrinho: ['cart', 'cart-outline'],
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
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
        tabBarIcon: ({ color, focused, size }) => {
          const nomes = icones[route.name] || [
            'ellipse',
            'ellipse-outline',
          ];

          return (
            <Ionicons
              name={focused ? nomes[0] : nomes[1]}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
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
          tabBarBadge:
            quantidadeCarrinho > 0
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

// ---------------------------------------------------------------------
// Duas pilhas de telas, conforme quem está usando o app:
//   - admin logado: só o Painel Administrativo e as telas dele
//     (sem Início, Cardápio, Meus pedidos e Carrinho, que são da loja)
//   - qualquer outra pessoa: a loja normal, com a navegação inferior
// A troca é automática: quando o perfil de admin carrega depois do
// login, o app passa para o painel; quando o admin sai da conta, o
// perfil some e o app volta para a loja.
// Cartão: Painel do admin sem as telas da loja (Adrian Rafa)
// ---------------------------------------------------------------------
export default function AppNavigator() {
  const { perfil } = useAuth();
  const ehAdmin = perfil?.role === 'admin';

  if (ehAdmin) {
    return (
      <Stack.Navigator
        initialRouteName="Admin"
        screenOptions={{
          // "Sair" no canto direito de todas as telas do admin
          headerRight: () => <BotaoSairAdmin />,
        }}
      >
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={{
            title: 'Painel Administrativo',
          }}
        />

        <Stack.Screen
          name="ClientesAdmin"
          component={ClientesAdminScreen}
          options={{
            title: 'Clientes',
          }}
        />

        <Stack.Screen
          name="PedidosAdmin"
          component={PedidosAdminScreen}
          options={{
            title: 'Pedidos',
          }}
        />

        <Stack.Screen
          name="ItensPedidosAdmin"
          component={ItensPedidosAdminScreen}
          options={{
            title: 'Itens dos Pedidos',
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator initialRouteName="MainTabs">
      <Stack.Screen
        name="MainTabs"
        component={NavegacaoInferior}
        options={{
          header: () => <LojaHeader />,
        }}
      />

      <Stack.Screen
        name="Produto"
        component={ProdutoScreen}
        options={({ navigation }) => ({
          title: 'Produto',
          header: () => (
            <LojaHeader
              onBack={() => navigation.goBack()}
            />
          ),
        })}
      />

      <Stack.Screen
        name="Finalizacao"
        component={FinalizacaoScreen}
        options={({ navigation }) => ({
          title: 'Finalização',
          header: () => (
            <LojaHeader
              onBack={() => navigation.goBack()}
            />
          ),
        })}
      />

      <Stack.Screen
        name="PedidoConfirmado"
        component={PedidoConfirmadoScreen}
        options={{
          title: 'Pedido confirmado',
          header: () => <LojaHeader />,
        }}
      />

      <Stack.Screen
        name="AcompanharPedido"
        component={AcompanharPedidoScreen}
        options={({ navigation }) => ({
          title: 'Acompanhar pedido',
          header: () => (
            <LojaHeader
              onBack={() => navigation.goBack()}
            />
          ),
        })}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Entrar',
        }}
      />

    </Stack.Navigator>
  );
}
