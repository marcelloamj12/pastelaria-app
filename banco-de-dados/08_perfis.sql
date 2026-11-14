
------------------------------------------------------
-- 1. TABELA DE PERFIS
-- esta tabela tem como finalidade registrar usuarios por meio do login
-- aqui e onde sera determinado qeum e ADMIN e quem e Usuario comun.
--
--  O que cada campo representa:
--   id: identificador único do perfil.
--   user_id: vincula o perfil ao usuário do Supabase Auth.
--   nome: nome informado durante o cadastro.
--   role: define o tipo de usuário (admin ou user).
--   criado_em: registra a data de criação do perfil.
------------------------------------------------------


CREATE TABLE IF NOT EXISTS public.perfis (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE
        REFERENCES auth.users(id)
        ON DELETE CASCADE,
    nome text,
    role text NOT NULL DEFAULT 'user'
        CHECK (role IN ('admin', 'user')),
    criado_em timestamptz DEFAULT now()
);


----------------------------------------------------
--  2. RLS e policies
--  Nesta parte inicial, ainda em teste, o RLS ainda e o mesmo.
--  a regra aqui é que todo usuario só consegue ver seu proprio perfil
----------------------------------------------------

ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "perfis: usuario le proprio perfil"
ON public.perfis;

CREATE POLICY "perfis: usuario le proprio perfil"
ON public.perfis
FOR SELECT
TO authenticated
USING (user_id = auth.uid());


----------------------------------------------------
-- 3. funcao e trigger de cricao automatica de perfil
--  toda vez que um novo usuário é inserido em 'auth.users',
--  um perfil é criado como 'user'. isso significa que ninguem pode
--  inicialmente se cadastrar como ADMIN.
----------------------------------------------------

CREATE OR REPLACE FUNCTION public.criar_perfil_usuario()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.perfis (user_id, nome)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'nome'
    )
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$;


DROP TRIGGER IF EXISTS trigger_criar_perfil_usuario
ON auth.users;

CREATE TRIGGER trigger_criar_perfil_usuario
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.criar_perfil_usuario();


-----------------------------------------------
-- 4. comando para checar o cargo de um perfil
----------------------------------------------
SELECT
    u.email,
    p.nome,
    p.role
FROM auth.users u
JOIN public.perfis p
    ON p.user_id = u.id
WHERE u.email = 'SEU_EMAIL_AQUI';


---------------------------------------------
-- fim do arquivo (este arquivo pode receber modificacoes futuras)
---------------------------------------------