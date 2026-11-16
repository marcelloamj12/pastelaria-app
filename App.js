
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './src/navigation/AppNavigator';

import { AuthProvider } from './src/context/AuthContext';
import { CarrinhoProvider } from './src/context/CarrinhoContext';

export default function App() {
  return (
    <AuthProvider>
      <CarrinhoProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </CarrinhoProvider>
    </AuthProvider>
  );
}
