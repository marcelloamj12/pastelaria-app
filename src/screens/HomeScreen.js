import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, Image, ScrollView } from 'react-native';

import { fazerLogout } from '../services/authService';
import { listarCategorias, listarDestaques, formatarPreco } from '../services/cardapioService';
import { useAuth } from '../context/AuthContext';
import { cores } from '../theme/theme';
import { bannerHome, imagensCategorias, imagensProdutos, logos } from '../assets/imageMappings';

export default function HomeScreen({ navigation }) {
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
    style={styles.container}
    contentContainerStyle={styles.conteudo}
  >
    <View style={styles.cabecalho}>
      <Image
  source={logos.transparente}
  style={styles.logo}
  resizeMode="contain"
/>
    </View>
    {carregandoAuth ? (
  <Text>Carregando sua conta...</Text>
   ) : sessao ? (
  <Text style={styles.subtitulo}>
    Bem-vindo, {perfil?.nome || 'usuário'}!
  </Text>
   ) : (
  <Text style={styles.subtitulo}>
    Bem-vindo!
  </Text>
   )}

    {erroPerfil && (
  <Text>
    Não foi possível carregar seu perfil: {erroPerfil}
  </Text>
   )}

   {!carregandoAuth && sessao && perfil?.role === 'admin' && (
  <Text style={styles.identificacaoAdmin}>
    ADMINISTRADOR
  </Text>
)}


      <Text style={styles.titulo}>Menu Digital</Text>


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

<Text style={styles.categoriasTitulo}>Categorias</Text>

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

      <Text style={styles.subtitulo}>Mais pedidos</Text>

      {carregando && (
        <Text>Carregando destaques...</Text>
      )}

      {erro && (
        <Text>Erro ao carregar os destaques: {erro}</Text>
      )}

      {!carregando && !erro && destaques.map((produto) => (
  <View
    key={produto.id}
    style={styles.produto}
  >
    {imagensProdutos[produto.nome] && (
      <Image
        source={imagensProdutos[produto.nome]}
        style={styles.produtoImagem}
        resizeMode="cover"
      />
    )}

    <Text style={styles.nomeProduto}>
      {produto.nome}
    </Text>

    <Text>
      {produto.descricao}
    </Text>

    <Text style={styles.preco}>
      {formatarPreco(produto.preco)}
    </Text>

    <TouchableOpacity
      style={styles.botaoProduto}
      onPress={() =>
        navigation.navigate('Produto', {
          produto: produto
        })
      }
    >
      <Text style={styles.textoBotaoProduto}>
        Ver Produto
      </Text>
        </TouchableOpacity>
  </View>
))}
      </>
)}


      <TouchableOpacity
  style={styles.botaoCardapio}
  onPress={() => navigation.navigate('Cardapio')}
>
  <Text style={styles.textoBotaoCardapio}>
    Ver Cardápio Completo
  </Text>
</TouchableOpacity>

      <View style={styles.espaco}/>

      {!carregandoAuth && sessao && perfil?.role === 'admin' && (

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
      Area do Dono
    </Text>
  </TouchableOpacity>
)}  
     </ScrollView>
  );
}

const styles = StyleSheet.create({

bannerImagem: {
  width: 160,
  height: 100,
},

categoriaCard: {
  backgroundColor: cores.branco,
  borderWidth: 1,
  borderColor: cores.borda,
  borderRadius: 12,
  padding: 10,
  alignItems: 'center',
  justifyContent: 'center',
  width: 100,
},

categoriaImagem: {
  width: 70,
  height: 70,
  borderRadius: 10,
  marginBottom: 8,
},

produtoImagem: {
  width: '100%',
  height: 160,
  borderRadius: 12,
  marginBottom: 12,
  backgroundColor: cores.cinzaClaro,
},

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

botaoProduto: {
  backgroundColor: cores.primaria,
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 12,
},

textoBotaoProduto: {
  color: cores.branco,
  fontSize: 15,
  fontWeight: '600',
},

  categoriasTitulo: {
    fontSize: 22,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 14,
  },

  categoriasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 26,
  },

  categoriaTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.primaria,
  },

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

  cabecalho: {
    backgroundColor: cores.primaria,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -20,
    marginTop: -20,
    marginBottom: 20,
  },

conteudo: {
  flexGrow: 1,
},

  logo: {
    width: 250,
    height: 100,
  },

  espaco: {
  height: 15,
  },

  container: {
  flex: 1,
  backgroundColor: cores.fundo,
  padding: 20,
},

  titulo: {
    fontSize: 30,
    marginBottom: 20,
  },

  subtitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  produto: {
  backgroundColor: cores.branco,
  borderWidth: 1,
  borderColor: cores.borda,
  borderRadius: 16,
  padding: 16,
  marginBottom: 16,
},

  nomeProduto: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  preco: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
  },

  identificacaoAdmin: {
  color: '#15803D',
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 15,
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

 botaoAdmin: {
  backgroundColor: '#2563EB',
  padding: 10,
  borderRadius: 4 ,
  alignItems: 'center',
}, 

textoBotaoAdmin: {
  color: '#f5f3f3',
  fontSize: 16,
  fontWeight: 'bold',
},

});
