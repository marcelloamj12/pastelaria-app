
-------------------------------------------------
-- acesso dos clientes ao seus pedidos depois da remoçao das policies "N1 demo"
--------------------------------------------------


CREATE OR REPLACE FUNCTION public.meus_pedidos(p_telefone text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_telefone text;
    v_pedidos jsonb;
BEGIN
    -- Normaliza o telefone recebido
    v_telefone := regexp_replace(
        coalesce(p_telefone, ''),
        '[^0-9]',
        '',
        'g'
    );

    -- Valida o telefone
    IF length(v_telefone) NOT BETWEEN 10 AND 11 THEN
        RAISE EXCEPTION 'Telefone inválido.';
    END IF;

    -- Busca os pedidos e seus respectivos itens
    SELECT coalesce(
        jsonb_agg(
            jsonb_build_object(
                'id', p.id,
                'numero', p.numero,
                'status', p.status,
                'tipo', p.tipo,
                'total', p.total,
                'criado_em', p.criado_em,
                'itens_pedido', (
                    SELECT coalesce(
                        jsonb_agg(
                            jsonb_build_object(
                                'nome_produto', i.nome_produto,
                                'quantidade', i.quantidade,
                                'preco_unitario', i.preco_unitario,
                                'subtotal', i.subtotal
                            )
                        ),
                        '[]'::jsonb
                    )
                    FROM public.itens_pedido i
                    WHERE i.pedido_id = p.id
                )
            )
            ORDER BY p.criado_em DESC
        ),
        '[]'::jsonb
    )
    INTO v_pedidos
    FROM public.pedidos p
    INNER JOIN public.clientes c
        ON c.id = p.cliente_id
    WHERE regexp_replace(
        c.telefone,
        '[^0-9]',
        '',
        'g'
    ) = v_telefone;

    RETURN v_pedidos;
END;
$$;

-- Remove a permissão padrão de execução pública
REVOKE ALL ON FUNCTION public.meus_pedidos(text) FROM PUBLIC;

-- Permite que o aplicativo chame a função
GRANT EXECUTE ON FUNCTION public.meus_pedidos(text)
TO anon, authenticated;
