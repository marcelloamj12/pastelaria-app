import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import CardapioScreen from '../screens/CardapioScreen';
import ProdutoScreen from '../screens/ProdutoScreen';

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

    </Stack.Navigator>
  );
}