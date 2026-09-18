// =====================================================================
//  src/lib/supabase.js
//  Cliente único do Supabase para o app inteiro.
//  Responsável: Adrian Rafa (Back-end e Dados)
//
//  INSTALAÇÃO (rodar na raiz do projeto Expo):
//    npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
//
//  CONFIGURAÇÃO:
//    Crie um arquivo .env na raiz (copie de .env.example) com:
//      EXPO_PUBLIC_SUPABASE_URL=...
//      EXPO_PUBLIC_SUPABASE_ANON_KEY=...
//    O prefixo EXPO_PUBLIC_ é obrigatório para o Expo expor a variável ao app.
//
//  QUAL CHAVE USAR: no painel novo do Supabase ela se chama
//  "Publishable key" (sb_publishable_...), que é a sucessora da anon key.
//  NUNCA use a "Secret key" (sb_secret_...) no app: ela ignora a RLS.
//
//  IMPORTANTE PARA O GRUPO: nunca commitem o .env no GitHub.
//  A publishable key é pública por natureza (ela vai dentro do APK), mas
//  mesmo assim fica fora do repositório. Quem protege os dados é a RLS
//  do banco, não o segredo da chave.
// =====================================================================

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltam as variáveis EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Copie o .env.example para .env, preencha e rode "npx expo start -c".'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // AsyncStorage guarda a sessão no celular. Já deixamos pronto
    // para quando o login entrar no escopo (N2).
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // No React Native não existe URL de callback do navegador.
    detectSessionInUrl: false,
  },
});
