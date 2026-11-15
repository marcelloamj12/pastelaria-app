
------------------------------------------------------
-- vou deixar aqui as minhas policies que pretendo usar (preciso da confirmaçao do Andrian
-- a respeito das RLS N2 que estao no arquivo 02_rls.sql, se sera usado ele ou um novo.)
-----------------------------------------------------


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
    EXISTS (
        SELECT 1
        FROM public.perfis p
        WHERE p.user_id = auth.uid()
          AND p.role = 'admin'
    )
);

-- PEDIDOS: administrador pode atualizar o status
DROP POLICY IF EXISTS "pedidos: admin atualiza status"
ON public.pedidos;

CREATE POLICY "pedidos: admin atualiza status"
ON public.pedidos
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.perfis p
        WHERE p.user_id = auth.uid()
          AND p.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.perfis p
        WHERE p.user_id = auth.uid()
          AND p.role = 'admin'
    )
);

-- PEDIDOS: administrador pode consultar

DROP POLICY IF EXISTS "pedidos: admin consulta"
ON public.pedidos;

CREATE POLICY "pedidos: admin consulta"
ON public.pedidos
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.perfis p
        WHERE p.user_id = auth.uid()
          AND p.role = 'admin'
    )
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
    EXISTS (
        SELECT 1
        FROM public.perfis p
        WHERE p.user_id = auth.uid()
          AND p.role = 'admin'
    )
);

-- garantir a possibilidade de atualizar o status

REVOKE UPDATE ON TABLE public.pedidos FROM authenticated;

GRANT UPDATE (status)
ON TABLE public.pedidos
TO authenticated;

--------------------------------------------
-- fim do arquivo (mudanças podem ocorrer!)
----------------------------------------------