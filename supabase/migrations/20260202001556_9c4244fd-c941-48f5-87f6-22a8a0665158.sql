-- Table pour stocker les données d'émissions ESG par site
CREATE TABLE public.esg_site_emissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  site_name TEXT NOT NULL,
  location TEXT NOT NULL,
  scope1_emissions NUMERIC DEFAULT 0,
  scope2_emissions NUMERIC DEFAULT 0,
  scope3_emissions NUMERIC DEFAULT 0,
  reporting_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  reporting_period TEXT DEFAULT 'annual',
  data_source TEXT,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verified_by TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table pour les catégories d'émissions (flotte, bâtiments, énergie, etc.)
CREATE TABLE public.esg_emission_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category_name TEXT NOT NULL,
  category_type TEXT NOT NULL DEFAULT 'other',
  scope1_emissions NUMERIC DEFAULT 0,
  scope2_emissions NUMERIC DEFAULT 0,
  scope3_emissions NUMERIC DEFAULT 0,
  reporting_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  trend_percentage NUMERIC,
  data_source TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table pour les KPIs ESG personnalisés
CREATE TABLE public.esg_kpis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  kpi_name TEXT NOT NULL,
  kpi_value NUMERIC NOT NULL,
  kpi_unit TEXT NOT NULL,
  target_value NUMERIC,
  description TEXT,
  reporting_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  data_source TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table pour les objectifs de décarbonation
CREATE TABLE public.esg_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  target_year INTEGER NOT NULL,
  target_reduction_percent NUMERIC NOT NULL,
  baseline_year INTEGER NOT NULL,
  target_type TEXT DEFAULT 'absolute',
  description TEXT,
  is_achieved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.esg_site_emissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_emission_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_targets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for esg_site_emissions
CREATE POLICY "Users can view their own site emissions" ON public.esg_site_emissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own site emissions" ON public.esg_site_emissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own site emissions" ON public.esg_site_emissions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own site emissions" ON public.esg_site_emissions FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for esg_emission_categories
CREATE POLICY "Users can view their own emission categories" ON public.esg_emission_categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own emission categories" ON public.esg_emission_categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own emission categories" ON public.esg_emission_categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own emission categories" ON public.esg_emission_categories FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for esg_kpis
CREATE POLICY "Users can view their own ESG KPIs" ON public.esg_kpis FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own ESG KPIs" ON public.esg_kpis FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ESG KPIs" ON public.esg_kpis FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own ESG KPIs" ON public.esg_kpis FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for esg_targets
CREATE POLICY "Users can view their own ESG targets" ON public.esg_targets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own ESG targets" ON public.esg_targets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ESG targets" ON public.esg_targets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own ESG targets" ON public.esg_targets FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_esg_site_emissions_updated_at BEFORE UPDATE ON public.esg_site_emissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_esg_emission_categories_updated_at BEFORE UPDATE ON public.esg_emission_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_esg_kpis_updated_at BEFORE UPDATE ON public.esg_kpis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();