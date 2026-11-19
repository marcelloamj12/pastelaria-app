
------------------------------------------------------
-- vou deixar aqui as minhas policies que pretendo usar (preciso da confirmaçao do Andrian
-- a respeito das RLS N2 que estao no arquivo 02_rls.sql, se sera usado ele ou um novo.)
-----------------------------------------------------

-- Verifica se o usuário autenticado é administrador
-- 
-- RETURNS boolean: retorna true ou false.
-- STABLE: informa que a função não altera dados e mantém o resultado estável durante a consulta.
-- SET search_path = '': evita que objetos de outros schemas sejam usados indevidamente.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.perfis p
        WHERE p.user_id = auth.uid()
          AND p.role = 'admin'
    );
$$;

-- Restringir a execução aos usuários autenticados
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;


-- Remover as políticas abertas de demonstração (nao executado ainda)
DROP POLICY IF EXISTS "clientes: N1 demo" ON public.clientes;
DROP POLICY IF EXISTS "pedidos: N1 demo" ON public.pedidos;
DROP POLICY IF EXISTS "itens: N1 demo" ON public.itens_pedido;

-- CLIENTES: administrador pode consultar

DROP POLICY IF EXISTS "clientes: admin consulta"
ON public.clientes;


CREATE POLICY "clientes: admin consulta"
ON public.clientes
FOR SELECT
TO authenticated
USING (
    public.is_admin()
);

-- PEDIDOS: administrador pode atualizar o status
DROP POLICY IF EXISTS "pedidos: admin atualiza status"
ON public.pedidos;

CREATE POLICY "pedidos: admin atualiza status"
ON public.pedidos
FOR UPDATE
TO authenticated
USING (
    public.is_admin()
)
WITH CHECK (
    public.is_admin()
);

-- PEDIDOS: administrador pode consultar

DROP POLICY IF EXISTS "pedidos: admin consulta"
ON public.pedidos;

CREATE POLICY "pedidos: admin consulta"
ON public.pedidos
FOR SELECT
TO authenticated
USING (
    public.is_admin()
);

-- caso a policie de excluir ainda existir
DROP POLICY IF EXISTS "pedidos: admin exclui"
ON public.pedidos;

-- ITENS: administrador pode consultar

DROP POLICY IF EXISTS "itens: admin consulta"
ON public.itens_pedido;

CREATE POLICY "itens: admin consulta"
ON public.itens_pedido
FOR SELECT
TO authenticated
USING (
    public.is_admin()
);

-- garantir a possibilidade de atualizar o status

REVOKE UPDATE ON TABLE public.pedidos FROM authenticated;

GRANT UPDATE (status)
ON TABLE public.pedidos
TO authenticated;

--------------------------------------------
-- fim do arquivo (mudanças podem ocorrer!)
----------------------------------------------