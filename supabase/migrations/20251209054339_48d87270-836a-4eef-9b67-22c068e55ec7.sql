-- Table principale pour les entreprises enrichies
CREATE TABLE public.enriched_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Identifiants officiels
  siren TEXT,
  siret TEXT,
  tva_number TEXT,
  
  -- Informations générales
  name TEXT NOT NULL,
  legal_form TEXT,
  naf_code TEXT,
  naf_label TEXT,
  creation_date DATE,
  
  -- Localisation
  address TEXT,
  postal_code TEXT,
  city TEXT,
  country TEXT DEFAULT 'France',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Données financières
  capital DECIMAL(15, 2),
  revenue DECIMAL(15, 2),
  revenue_year INTEGER,
  net_income DECIMAL(15, 2),
  ebitda DECIMAL(15, 2),
  employees_count INTEGER,
  employees_range TEXT,
  
  -- Dirigeants (JSON array)
  executives JSONB DEFAULT '[]'::jsonb,
  
  -- Présence web
  website TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  facebook_url TEXT,
  
  -- Données enrichies par IA
  ai_summary TEXT,
  ai_keywords JSONB DEFAULT '[]'::jsonb,
  ai_industry_analysis TEXT,
  ai_competitive_position TEXT,
  ai_risk_score INTEGER,
  ai_opportunity_score INTEGER,
  
  -- Sources et vérification
  data_sources JSONB DEFAULT '[]'::jsonb,
  verification_status TEXT DEFAULT 'pending',
  verification_date TIMESTAMP WITH TIME ZONE,
  confidence_score INTEGER DEFAULT 0,
  
  -- Métadonnées
  last_enriched_at TIMESTAMP WITH TIME ZONE,
  enrichment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les données financières historiques
CREATE TABLE public.company_financials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.enriched_companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  fiscal_year INTEGER NOT NULL,
  
  -- Bilan
  total_assets DECIMAL(15, 2),
  equity DECIMAL(15, 2),
  debt DECIMAL(15, 2),
  cash DECIMAL(15, 2),
  
  -- Compte de résultat
  revenue DECIMAL(15, 2),
  gross_margin DECIMAL(15, 2),
  operating_income DECIMAL(15, 2),
  net_income DECIMAL(15, 2),
  ebitda DECIMAL(15, 2),
  
  -- Ratios
  profit_margin DECIMAL(5, 2),
  debt_ratio DECIMAL(5, 2),
  current_ratio DECIMAL(5, 2),
  roe DECIMAL(5, 2),
  
  -- Source
  source TEXT,
  source_date DATE,
  is_verified BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les alertes et veille
CREATE TABLE public.company_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.enriched_companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  alert_type TEXT NOT NULL, -- 'news', 'financial', 'legal', 'social', 'web'
  title TEXT NOT NULL,
  content TEXT,
  source_url TEXT,
  source_name TEXT,
  
  severity TEXT DEFAULT 'info', -- 'info', 'warning', 'critical'
  is_read BOOLEAN DEFAULT false,
  
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les demandes d'enrichissement
CREATE TABLE public.enrichment_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  query_type TEXT NOT NULL, -- 'siren', 'siret', 'name', 'website'
  query_value TEXT NOT NULL,
  
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  result_company_id UUID REFERENCES public.enriched_companies(id),
  error_message TEXT,
  
  sources_checked JSONB DEFAULT '[]'::jsonb,
  processing_time_ms INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.enriched_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrichment_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their enriched companies" ON public.enriched_companies
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their company financials" ON public.company_financials
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their company alerts" ON public.company_alerts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their enrichment requests" ON public.enrichment_requests
  FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_enriched_companies_siren ON public.enriched_companies(siren);
CREATE INDEX idx_enriched_companies_siret ON public.enriched_companies(siret);
CREATE INDEX idx_enriched_companies_name ON public.enriched_companies(name);
CREATE INDEX idx_enriched_companies_user ON public.enriched_companies(user_id);
CREATE INDEX idx_company_financials_company ON public.company_financials(company_id);
CREATE INDEX idx_company_alerts_company ON public.company_alerts(company_id);
CREATE INDEX idx_enrichment_requests_user ON public.enrichment_requests(user_id);