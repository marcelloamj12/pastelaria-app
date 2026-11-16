
import React, { createContext, useContext, useState } from 'react';

const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);

  function adicionarProduto(produto) {
    setItens(anteriores => {
      const existente = anteriores.find(
        item => item.id === produto.id
      );

      if (existente) {
        return anteriores.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...anteriores, { ...produto, quantidade: 1 }];
    });
  }

  function alterarQuantidade(id, diferenca) {
    setItens(anteriores =>
      anteriores
        .map(item =>
          item.id === id
            ? {
                ...item,
                quantidade: item.quantidade + diferenca
              }
            : item
        )
        .filter(item => item.quantidade > 0)
    );
  }

  function removerProduto(id) {
    setItens(anteriores =>
      anteriores.filter(item => item.id !== id)
    );
  }

  function limparCarrinho() {
    setItens([]);
  }

  const total = itens.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  );

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionarProduto,
        alterarQuantidade,
        removerProduto,
        limparCarrinho,
        total
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const contexto = useContext(CarrinhoContext);

  if (!contexto) {
    throw new Error('useCarrinho precisa do CarrinhoProvider');
  }

  return contexto;
}
