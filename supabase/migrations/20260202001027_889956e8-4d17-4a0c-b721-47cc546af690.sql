-- Table pour stocker les références réglementaires (RGPD, CNIL, etc.)
CREATE TABLE public.regulatory_references (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  regulation_type TEXT NOT NULL, -- 'gdpr', 'cnil', 'ccpa', etc.
  article_code TEXT NOT NULL, -- 'art_5', 'art_6', etc.
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT,
  source_name TEXT, -- 'EUR-Lex', 'CNIL', 'Legifrance'
  last_scraped_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  effective_date DATE,
  is_current BOOLEAN DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(regulation_type, article_code)
);

-- Table pour stocker les résultats des scans de conformité automatiques
CREATE TABLE public.compliance_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_id UUID REFERENCES public.companies(id),
  scan_type TEXT NOT NULL, -- 'full', 'crm', 'hr', 'documents'
  status TEXT DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  overall_score INTEGER,
  data_sources_scanned JSONB, -- liste des tables/sources analysées
  findings JSONB, -- résultats détaillés
  recommendations JSONB,
  regulations_checked JSONB, -- références réglementaires utilisées
  records_analyzed INTEGER DEFAULT 0,
  issues_found INTEGER DEFAULT 0,
  critical_issues INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les alertes de conformité en temps réel
CREATE TABLE public.compliance_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_id UUID REFERENCES public.companies(id),
  scan_id UUID REFERENCES public.compliance_scans(id),
  alert_type TEXT NOT NULL, -- 'pii_exposed', 'retention_exceeded', 'no_consent', 'missing_legal_basis'
  severity TEXT NOT NULL, -- 'critical', 'high', 'medium', 'low'
  title TEXT NOT NULL,
  description TEXT,
  affected_table TEXT,
  affected_records INTEGER,
  regulation_reference TEXT, -- ex: 'RGPD Art. 5'
  remediation_steps JSONB,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.regulatory_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for regulatory_references (public read)
CREATE POLICY "Anyone can view regulatory references"
ON public.regulatory_references FOR SELECT
USING (true);

-- RLS Policies for compliance_scans
CREATE POLICY "Users can view their own scans"
ON public.compliance_scans FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scans"
ON public.compliance_scans FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scans"
ON public.compliance_scans FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for compliance_alerts
CREATE POLICY "Users can view their own alerts"
ON public.compliance_alerts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alerts"
ON public.compliance_alerts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts"
ON public.compliance_alerts FOR UPDATE
USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_regulatory_references_updated_at
BEFORE UPDATE ON public.regulatory_references
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for performance
CREATE INDEX idx_compliance_scans_user ON public.compliance_scans(user_id);
CREATE INDEX idx_compliance_scans_status ON public.compliance_scans(status);
CREATE INDEX idx_compliance_alerts_user ON public.compliance_alerts(user_id);
CREATE INDEX idx_compliance_alerts_severity ON public.compliance_alerts(severity);
CREATE INDEX idx_regulatory_references_type ON public.regulatory_references(regulation_type);