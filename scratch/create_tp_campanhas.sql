-- Criação da tabela tp_campanhas para isolar as campanhas de marketing do Timespage
-- Execute este script no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS public.tp_campanhas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    org_id uuid NOT NULL,
    title text,
    headline text,
    subtitle text,
    buttonText text,
    image_url text,
    destinationUrl text,
    type text,
    active boolean DEFAULT true,
    mkt_copy text,
    social_instagram text,
    responsible_whatsapp text,
    social_facebook text,
    clicks integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT tp_campanhas_pkey PRIMARY KEY (id)
);

-- Configura as políticas de RLS
ALTER TABLE public.tp_campanhas ENABLE ROW LEVEL SECURITY;

-- Permite acesso anônimo para leitura (necessário para o site público)
CREATE POLICY "Permitir leitura anônima de campanhas ativas" 
ON public.tp_campanhas FOR SELECT 
USING (active = true);

-- Permite todas as operações para usuários autenticados (Admin)
CREATE POLICY "Permitir controle total para admins" 
ON public.tp_campanhas FOR ALL 
USING (auth.role() = 'authenticated');

-- Atualiza a contagem de cliques (precisa permitir UPDATE mesmo anônimo caso usem RPC ou update direto, embora idealmente fosse por RPC. Como atualmente fazem update direto com a key anon, precisamos liberar UPDATE para o campo clicks)
-- ATENÇÃO: Permitir UPDATE anônimo diretamente na tabela pode ser um risco, mas para manter a compatibilidade com a implementação atual onde o front faz .update({clicks}):
CREATE POLICY "Permitir contagem de cliques anônima" 
ON public.tp_campanhas FOR UPDATE 
USING (true)
WITH CHECK (true);
