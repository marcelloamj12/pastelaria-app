
// este arquivo serve para verificar de forma global se o usuario esta em uma secao
// ativa em todas as telas, se ele foi carregado e erros de perfil



import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  observarMudancasAutenticacao,
  buscarMeuPerfil,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroPerfil, setErroPerfil] = useState(null);

  useEffect(() => {
    const subscription = observarMudancasAutenticacao(
      (novaSessao) => {
        setSessao(novaSessao);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregarPerfil() {
      if (!sessao) {
        setPerfil(null);
        setErroPerfil(null);
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        setErroPerfil(null);

        const dadosPerfil = await buscarMeuPerfil();

        if (ativo) {
          setPerfil(dadosPerfil);
        }
      } catch (error) {
        if (ativo) {
          setPerfil(null);
          setErroPerfil(error.message);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarPerfil();

    return () => {
      ativo = false;
    };
  }, [sessao]);

  return (
    <AuthContext.Provider
      value={{
        sessao,
        perfil,
        carregando,
        erroPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error(
      'useAuth deve ser utilizado dentro de AuthProvider.'
    );
  }

  return contexto;
}
