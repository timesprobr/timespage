-- Script para renomear tabelas específicas do Timespage
-- Execute este script no SQL Editor do seu Supabase

-- Renomeando tabelas
ALTER TABLE IF EXISTS public.news RENAME TO tp_news;
ALTER TABLE IF EXISTS public.trophies RENAME TO tp_trophies;
ALTER TABLE IF EXISTS public.board RENAME TO tp_board;
ALTER TABLE IF EXISTS public.transparency RENAME TO tp_transparency;
ALTER TABLE IF EXISTS public.page_views RENAME TO tp_page_views;
ALTER TABLE IF EXISTS public.highlights RENAME TO tp_highlights;

-- ATENÇÃO: As políticas (RLS Policies) não precisam ser renomeadas para funcionarem, 
-- pois elas são atreladas ao OID da tabela no PostgreSQL. 
-- Porém, por questões de clareza, você pode querer atualizá-las depois.
