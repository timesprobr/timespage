-- Script de correção da tabela tp_campanhas
-- Execute no SQL Editor do Supabase

-- Passo 1: Remover a tabela atual que estava com campos errados
DROP TABLE IF EXISTS public.tp_campanhas;

-- Passo 2: Criar a tabela novamente com todos os campos mapeados corretamente em minúsculo (snake_case)
CREATE TABLE public.tp_campanhas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    org_id uuid NOT NULL,
    title text,
    headline text,
    subtitle text,
    button_text text,
    image_url text,
    destination_url text,
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

CREATE POLICY "Permitir leitura anônima de campanhas ativas" 
ON public.tp_campanhas FOR SELECT 
USING (active = true);

CREATE POLICY "Permitir controle total para admins" 
ON public.tp_campanhas FOR ALL 
USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir contagem de cliques anônima" 
ON public.tp_campanhas FOR UPDATE 
USING (true)
WITH CHECK (true);
