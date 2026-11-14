
------------------------------------------------------
-- vou deixar aqui as minhas policies que pretendo usar (preciso da confirmaçao do Andrian
-- a respeito das RLS N2 que estao no arquivo 02_rls.sql, se sera usado ele ou um novo.)
-----------------------------------------------------


-- Remover as políticas abertas de demonstração (nao executado ainda)
DROP POLICY IF EXISTS "clientes: N1 demo" ON public.clientes;
DROP POLICY IF EXISTS "pedidos: N1 demo" ON public.pedidos;
DROP POLICY IF EXISTS "itens: N1 demo" ON public.itens_pedido;

-- CLIENTES: administrador pode consultar e excluir
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

CREATE POLICY "clientes: admin exclui"
ON public.clientes
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.perfis p
        WHERE p.user_id = auth.uid()
          AND p.role = 'admin'
    )
);

-- PEDIDOS: administrador pode consultar e excluir
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

CREATE POLICY "pedidos: admin exclui"
ON public.pedidos
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.perfis p
        WHERE p.user_id = auth.uid()
          AND p.role = 'admin'
    )
);

-- ITENS: administrador pode consultar
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


--------------------------------------------
-- fim de 09_rlsTEST (mudanças podem ocorrer!)
----------------------------------------------