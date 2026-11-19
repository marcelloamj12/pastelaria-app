import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { cores } from '../theme/theme';
import { logos } from '../assets/imageMappings';

export default function LojaHeader({ onBack }) {
  return (
    <View style={styles.container}>
      {/* Faixa vermelha com a logo */}
      <View style={styles.faixaLogo}>
        {onBack && (
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={onBack}
            accessibilityLabel="Voltar"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        )}

        <Image
          source={logos.transparente}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Informações do estabelecimento */}
      <View style={styles.informacoes}>
        <Text style={styles.nomeLoja}>
          Salgados do Miltão
        </Text>

        <View style={styles.linha}>
          <Ionicons
            name="storefront-outline"
            size={13}
            color="#666666"
          />

          <Text style={styles.informacaoTexto}>
            Entrega e retirada
          </Text>
        </View>

        <View style={styles.linha}>
          <Ionicons
            name="time-outline"
            size={13}
            color="#666666"
          />

          <Text style={styles.informacaoTexto}>
            Tempo de entrega a consultar
          </Text>

          <Text style={styles.separador}>•</Text>

          <Text style={styles.informacaoTexto}>
            Taxa a consultar
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: cores.fundo,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },

  faixaLogo: {
    backgroundColor: cores.primaria,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 220,
    height: 75,
  },

  botaoVoltar: {
    position: 'absolute',
    left: 16,
    top: 33,
    zIndex: 2,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  informacoes: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: cores.fundo,
  },

  nomeLoja: {
    fontSize: 18,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 5,
  },

  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 3,
  },

  informacaoTexto: {
    fontSize: 11,
    color: '#666666',
  },

  separador: {
    fontSize: 11,
    color: '#666666',
  },
});
