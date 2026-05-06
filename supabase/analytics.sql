-- Tabela para rastreamento de visitas (Analytics)
CREATE TABLE IF NOT EXISTS page_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    org_id TEXT,
    url TEXT,
    referrer TEXT,
    ip TEXT,
    city TEXT,
    region TEXT, -- Estado
    country TEXT,
    device TEXT, -- Mobile, Desktop, Tablet
    browser TEXT,
    user_agent TEXT
);

-- Habilitar RLS para page_views
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Política para permitir que qualquer pessoa insira uma visita (público)
CREATE POLICY "Permitir inserção pública de visitas" 
ON page_views FOR INSERT 
WITH CHECK (true);

-- Política para que administradores vejam as visitas
CREATE POLICY "Administradores veem visitas" 
ON page_views FOR SELECT 
USING (true);

-- Adicionar colunas de demografia em tabelas de conversão (se não existirem)
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS org_id TEXT;

ALTER TABLE socio_leads ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE socio_leads ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE socio_leads ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE socio_leads ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE socio_leads ADD COLUMN IF NOT EXISTS org_id TEXT;

-- Garantir que outras tabelas também tenham org_id para multi-tenancy
ALTER TABLE news ADD COLUMN IF NOT EXISTS org_id TEXT;
ALTER TABLE trophies ADD COLUMN IF NOT EXISTS org_id TEXT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS org_id TEXT;
ALTER TABLE board ADD COLUMN IF NOT EXISTS org_id TEXT;
ALTER TABLE transparency ADD COLUMN IF NOT EXISTS org_id TEXT;
