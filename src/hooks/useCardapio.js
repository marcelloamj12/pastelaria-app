// =====================================================================
//  src/hooks/useCardapio.js
//  Hook que entrega o cardápio pronto para a tela, com loading e erro.
//  Responsável: Adrian Rafa (Back-end e Dados)
//
//  JOSÉ LUIZ: é só isso que sua tela precisa saber. Exemplo no fim do arquivo.
// =====================================================================

import { useCallback, useEffect, useState } from 'react';
import { listarCategorias, listarProdutos } from '../services/cardapioService';

export function useCardapio(categoriaSlugInicial = null) {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState(categoriaSlugInicial);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const [cats, prods] = await Promise.all([
        listarCategorias(),
        listarProdutos(categoriaAtiva),
      ]);
      setCategorias(cats);
      setProdutos(prods);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [categoriaAtiva]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return {
    categorias,
    produtos,
    categoriaAtiva,
    setCategoriaAtiva,
    carregando,
    erro,
    recarregar: carregar,
  };
}

/* ---------------------------------------------------------------------
EXEMPLO DE USO NA TELA DE CARDÁPIO

import { FlatList, Text, View, ActivityIndicator, Pressable } from 'react-native';
import { useCardapio } from '../hooks/useCardapio';
import { formatarPreco } from '../services/cardapioService';

export default function CardapioScreen() {
  const { categorias, produtos, categoriaAtiva, setCategoriaAtiva, carregando, erro } = useCardapio();

  if (carregando) return <ActivityIndicator />;
  if (erro) return <Text>{erro}</Text>;

  return (
    <View>
      <FlatList
        horizontal
        data={categorias}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => setCategoriaAtiva(item.slug)}>
            <Text style={{ fontWeight: categoriaAtiva === item.slug ? 'bold' : 'normal' }}>
              {item.nome}
            </Text>
          </Pressable>
        )}
      />

      <FlatList
        data={produtos}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.nome}</Text>
            <Text>{item.descricao}</Text>
            <Text>{formatarPreco(item.preco)}</Text>
          </View>
        )}
      />
    </View>
  );
}
--------------------------------------------------------------------- */
