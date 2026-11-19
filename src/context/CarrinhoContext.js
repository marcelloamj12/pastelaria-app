
import React, {
  createContext,
  useContext,
  useState,
} from 'react';

const CarrinhoContext = createContext(null);

// Identifica cada combinação de produto e observação.
function gerarChave(produtoId, observacao = '') {
  return JSON.stringify([
    String(produtoId),
    observacao.trim(),
  ]);
}

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);

  function adicionarProduto(
    produto,
    quantidade = 1,
    observacao = ''
  ) {
    const quantidadeAdicionar = Math.floor(
      Number(quantidade)
    );

    if (
      !produto ||
      !Number.isFinite(quantidadeAdicionar) ||
      quantidadeAdicionar < 1
    ) {
      return;
    }

    const observacaoLimpa = String(
      observacao ?? ''
    ).trim();

    const chave = gerarChave(
      produto.id,
      observacaoLimpa
    );

    setItens((anteriores) => {
      const existente = anteriores.find((item) => {
        const chaveItem =
          item.chave ??
          gerarChave(item.id, item.observacao ?? '');

        return chaveItem === chave;
      });

      if (existente) {
        return anteriores.map((item) => {
          const chaveItem =
            item.chave ??
            gerarChave(item.id, item.observacao ?? '');

          if (chaveItem === chave) {
            return {
              ...item,
              chave,
              quantidade:
                item.quantidade + quantidadeAdicionar,
            };
          }

          return item;
        });
      }

      return [
        ...anteriores,
        {
          ...produto,
          chave,
          observacao: observacaoLimpa,
          quantidade: quantidadeAdicionar,
        },
      ];
    });
  }

  function alterarQuantidade(chave, diferenca) {
    setItens((anteriores) =>
      anteriores
        .map((item) => {
          const chaveItem =
            item.chave ??
            gerarChave(item.id, item.observacao ?? '');

          // Aceita também o ID antigo para compatibilidade.
          const corresponde =
            chaveItem === chave ||
            (!item.chave && item.id === chave);

          if (!corresponde) {
            return item;
          }

          return {
            ...item,
            quantidade: item.quantidade + diferenca,
          };
        })
        .filter((item) => item.quantidade > 0)
    );
  }

  function removerProduto(chave) {
    setItens((anteriores) =>
      anteriores.filter((item) => {
        const chaveItem =
          item.chave ??
          gerarChave(item.id, item.observacao ?? '');

        return (
          chaveItem !== chave &&
          !(!item.chave && item.id === chave)
        );
      })
    );
  }

  function limparCarrinho() {
    setItens([]);
  }

  const total = itens.reduce(
    (soma, item) =>
      soma + Number(item.preco) * item.quantidade,
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
        total,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const contexto = useContext(CarrinhoContext);

  if (!contexto) {
    throw new Error(
      'useCarrinho precisa do CarrinhoProvider'
    );
  }

  return contexto;
}
