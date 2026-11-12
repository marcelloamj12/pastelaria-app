
import { supabase } from '../lib/supabase';

// Cadastro de um novo usuário
export async function cadastrarUsuario({ nome, email, senha }) {
  if (!nome?.trim()) {
    throw new Error('Informe seu nome.');
  }

  if (!email?.trim()) {
    throw new Error('Informe seu e-mail.');
  }

  if (!senha || senha.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres.');
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password: senha,
    options: {
      data: {
        nome: nome.trim(),
      },
    },
  });
  

  if (error) {
  if (
    error.message.includes('already registered') ||
    error.message.includes('User already registered')
  ) {
    throw new Error('Este e-mail já está cadastrado. Tente fazer login.');
  }

  throw new Error(error.message);
}

  return data;
}

// Login de um usuário existente
export async function fazerLogin({ email, senha }) {
  if (!email?.trim() || !senha) {
    throw new Error('Informe seu e-mail e sua senha.');
  }

  // Verifica se já existe uma sessão ativa
  const sessaoAtual = await obterSessao();

  if (sessaoAtual) {
    throw new Error(
      'Você já está conectado a uma conta. Faça logout antes de entrar novamente.'
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: senha,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Encerrar a sessão
export async function fazerLogout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
}

// Recuperar a sessão atual
export async function obterSessao() {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw new Error(error.message);

  return data.session;
}

// Buscar o perfil do usuário autenticado
export async function buscarMeuPerfil() {
  const { data: usuarioData, error: usuarioError } =
    await supabase.auth.getUser();

  if (usuarioError) throw new Error(usuarioError.message);

  if (!usuarioData.user) {
    throw new Error('Nenhum usuário autenticado.');
  }

  const { data, error } = await supabase
    .from('perfis')
    .select('id, user_id, nome, role, criado_em')
    .eq('user_id', usuarioData.user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  if (!data) {
    throw new Error('Perfil do usuário não encontrado.');
  }

  return data;
}
