
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

import { fazerLogout } from '../services/authService';
import {
  listarCategorias,
  listarDestaques,
  formatarPreco,
} from '../services/cardapioService';
import { useAuth } from '../context/AuthContext';
import { cores } from '../theme/theme';
import {
  bannerHome,
  imagensCategorias,
  imagensProdutos,
} from '../assets/imageMappings';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const scrollRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: false,
      });
    }, [])
  );

  const [destaques, setDestaques] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [categorias, setCategorias] = useState([]);

  const {
    sessao,
    perfil,
    carregando: carregandoAuth,
    erroPerfil,
  } = useAuth();

  useEffect(() => {
    async function carregarDestaques() {
      try {
        setCarregando(true);
        setErro(null);

        const dados = await listarDestaques();
        setDestaques(dados);
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarDestaques();

    async function carregarCategorias() {
      try {
        const dados = await listarCategorias();
        setCategorias(dados);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error.message);
      }
    }

    carregarCategorias();
  }, []);

  async function sairDaConta() {
    try {
      await fazerLogout();

      Alert.alert(
        'Logout realizado',
        'Você saiu da sua conta com sucesso.'
      );
    } catch (error) {
      Alert.alert('Erro ao sair da conta', error.message);
    }
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
      {/* Mensagens relacionadas à autenticação */}
      {erroPerfil && (
        <Text>
          Não foi possível carregar seu perfil: {erroPerfil}
        </Text>
      )}

      {!carregandoAuth &&
        sessao &&
        perfil?.role === 'admin' && (
          <Text style={styles.identificacaoAdmin}>
            ADMINISTRADOR
          </Text>
        )}

      {/* Banner principal */}
      <View style={styles.banner}>
        <View style={styles.bannerConteudo}>
          <Text style={styles.bannerTitulo}>
            Pastéis fritos na hora
          </Text>

          <Text style={styles.bannerDescricao}>
            Sabor e qualidade em cada pedido
          </Text>
        </View>

        <Image
          source={bannerHome}
          style={styles.bannerImagem}
          resizeMode="contain"
        />
      </View>

      {perfil?.role !== 'admin' && (
        <>
          {/* Categorias */}
          <Text style={styles.categoriasTitulo}>
            Categorias
          </Text>

          <View style={styles.categoriasContainer}>
            {categorias.map((categoria) => (
              <TouchableOpacity
                key={categoria.id}
                style={styles.categoriaCard}
                onPress={() =>
                  navigation.navigate('Cardapio', {
                    categoriaSlug: categoria.slug,
                  })
                }
              >
                <Image
                  source={imagensCategorias[categoria.slug]}
                  style={styles.categoriaImagem}
                  resizeMode="cover"
                />

                <Text style={styles.categoriaTexto}>
                  {categoria.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Mais pedidos */}
          <Text style={styles.subtitulo}>
            Mais pedidos
          </Text>

          {carregando && (
            <Text>Carregando destaques...</Text>
          )}

          {erro && (
            <Text>
              Erro ao carregar os destaques: {erro}
            </Text>
          )}

          <View style={styles.produtosContainer}>
            {!carregando &&
              !erro &&
              destaques.map((produto) => (
                <TouchableOpacity
                  key={produto.id}
                  style={styles.produto}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('Produto', {
                      produto: produto,
                    })
                  }
                >
                  {imagensProdutos[produto.nome] ? (
                    <Image
                      source={imagensProdutos[produto.nome]}
                      style={styles.produtoImagem}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.produtoImagemVazia}>
                      <Text style={styles.textoImagemVazia}>
                        Sem imagem
                      </Text>
                    </View>
                  )}

                  <View style={styles.produtoInformacoes}>
                    <Text
                      style={styles.nomeProduto}
                      numberOfLines={2}
                    >
                      {produto.nome}
                    </Text>

                    <Text style={styles.preco}>
                      {formatarPreco(produto.preco)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        </>
      )}

      {/* Acesso ao cardápio completo */}
      <TouchableOpacity
        style={styles.botaoCardapio}
        onPress={() =>
          navigation.navigate('Cardapio', {
            categoriaSlug: null,
          })
        }
      >
        <Text style={styles.textoBotaoCardapio}>
          Ver Cardápio Completo
        </Text>
      </TouchableOpacity>

      <View style={styles.espaco} />

      {/* Painel administrativo */}
      {!carregandoAuth &&
        sessao &&
        perfil?.role === 'admin' && (
          <View>
            <View style={styles.espaco} />

            <TouchableOpacity
              style={styles.botaoAdmin}
              onPress={() => navigation.navigate('Admin')}
            >
              <Text style={styles.textoBotaoAdmin}>
                Painel Administrativo
              </Text>
            </TouchableOpacity>

            <View style={styles.espaco} />
          </View>
        )}

      <View style={styles.espaco} />

      {/* Login e logout */}
      {sessao ? (
        <Button
          title="Sair da conta"
          onPress={sairDaConta}
          color="red"
        />
      ) : (
        <TouchableOpacity
          style={styles.acessoAdminContainer}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.acessoAdminTexto}>
            Área do Dono
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    padding: 20,
  },

  conteudo: {
    flexGrow: 1,
  },

  subtitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  identificacaoAdmin: {
    color: '#15803D',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  // Banner

  banner: {
    backgroundColor: cores.secundaria,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 120,
  },

  bannerConteudo: {
    flex: 1,
    paddingRight: 12,
  },

  bannerTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 8,
  },

  bannerDescricao: {
    fontSize: 13,
    color: cores.texto,
    lineHeight: 19,
  },

  bannerImagem: {
    width: 130,
    height: 100,
  },

  // Categorias

  categoriasTitulo: {
    fontSize: 22,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 14,
  },

  categoriasContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },

  categoriaCard: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  categoriaImagem: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 6,
  },

  categoriaTexto: {
    fontSize: 11,
    fontWeight: '500',
    color: cores.texto,
    textAlign: 'center',
  },

  // Mais pedidos - cards compactos em duas colunas

  produtosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },

  produto: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.cinzaClaro,
    borderRadius: 12,
    padding: 8,
    minHeight: 80,
    overflow: 'hidden',
  },

  produtoImagem: {
    width: 62,
    height: 62,
    borderRadius: 10,
  },

  produtoImagemVazia: {
    width: 62,
    height: 62,
    borderRadius: 10,
    backgroundColor: cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoImagemVazia: {
    fontSize: 10,
    color: '#888888',
    textAlign: 'center',
  },

  produtoInformacoes: {
    flex: 1,
    minWidth: 0,
    paddingLeft: 8,
    justifyContent: 'center',
  },

  nomeProduto: {
    fontSize: 12,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 4,
  },

  preco: {
    fontSize: 13,
    fontWeight: '700',
    color: cores.primaria,
  },

  // Botão do cardápio completo

  botaoCardapio: {
    backgroundColor: cores.primaria,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  textoBotaoCardapio: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: '700',
  },

  // Administração

  botaoAdmin: {
    backgroundColor: '#2563EB',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },

  textoBotaoAdmin: {
    color: '#f5f3f3',
    fontSize: 16,
    fontWeight: 'bold',
  },

  acessoAdminContainer: {
    marginTop: 100,
    alignItems: 'center',
  },

  acessoAdminTexto: {
    fontSize: 8,
    color: '#888',
    textDecorationLine: 'underline',
  },

  espaco: {
    height: 15,
  },
});
