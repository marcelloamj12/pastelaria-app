
----------------------------------------------------
-- como criar e atribuir a role 'admin' a uma conta.
----------------------------------------------------

/*
-- Criar a conta no Supabase Authentication:
1. Acesse o banco no Supabase.
2. Entre em Authentication → Users.
3. Clique em Add user.
4. Informe o e-mail e a senha do administrador.
5. Confirme a criação e verifique a tabela perfis.
6. um perfil de nome NULL deve aparecer nela. (pode alterar o nome clicando no NULL)

nota: uma trigger de criaçao automatica em '06_perfis.sql' cria a conta com a role 'user' inicialmente
*/

-- Atribuir a role 'admin' pelo e-mail:
-- 1. Abra o SQL Editor e digite o codigo

    UPDATE public.perfis
SET role = 'admin'
WHERE user_id = (
    SELECT id
    FROM auth.users
    WHERE email = 'SEU_EMAIL_AQUI'
);

/* nota: pode substituir o WHERE acima por "WHERE LOWER(email) = LOWER('SEU_EMAIL_AQUI')" 
pois ele nao depende de maisculas e minusculas.

2. Rode e verifique a tabela 'perfis', o role tem que ser 'admin'.

obs: lembrando que para essa alteraçao acontecer o perfil da conta precisa existir na tabela 'perfis',
Se o trigger não tiver criado o registro automaticamente, devera criar um manualmente.
*/

-- Criar o perfil caso ele não tenha sido criado:
-- 1. no SQL Editor, execute o codigo:

INSERT INTO public.perfis (user_id, nome, role)
SELECT
    u.id,
    'Nome do Administrador',
    'admin'
FROM auth.users AS u
WHERE LOWER(u.email) = LOWER('admin@exemplo.com')
AND NOT EXISTS (
    SELECT 1
    FROM public.perfis AS p
    WHERE p.user_id = u.id
);

-- nota: Esse comando só cria o perfil se ele ainda não existir. NÂO execute ele se o perfil ja existir. 