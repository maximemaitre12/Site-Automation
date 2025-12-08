-- Create data sources table for connector management
CREATE TABLE public.data_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL, -- 'database', 'api', 'file', 'saas', 'webhook'
  connector TEXT NOT NULL, -- 'postgres', 'mysql', 'salesforce', 'hubspot', 'gdrive', etc.
  status TEXT DEFAULT 'inactive', -- 'active', 'inactive', 'error', 'syncing'
  config JSONB DEFAULT '{}'::jsonb,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  records_count INTEGER DEFAULT 0,
  error_message TEXT,
  sync_frequency TEXT DEFAULT 'manual', -- 'realtime', 'hourly', 'daily', 'weekly', 'manual'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create data catalog table for dataset governance
CREATE TABLE public.data_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  source_id UUID REFERENCES public.data_sources(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  schema_info JSONB DEFAULT '{}'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  owner TEXT,
  sensitivity_level TEXT DEFAULT 'internal', -- 'public', 'internal', 'confidential', 'restricted'
  pii_detected BOOLEAN DEFAULT false,
  row_count INTEGER DEFAULT 0,
  column_count INTEGER DEFAULT 0,
  last_updated_at TIMESTAMP WITH TIME ZONE,
  lineage JSONB DEFAULT '[]'::jsonb,
  quality_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create data quality checks table
CREATE TABLE public.data_quality_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  catalog_id UUID REFERENCES public.data_catalog(id) ON DELETE CASCADE,
  check_type TEXT NOT NULL, -- 'completeness', 'accuracy', 'consistency', 'timeliness'
  check_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'passed', 'failed', 'warning', 'pending'
  details JSONB DEFAULT '{}'::jsonb,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create data pipeline runs table for monitoring
CREATE TABLE public.data_pipeline_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  source_id UUID REFERENCES public.data_sources(id) ON DELETE CASCADE,
  pipeline_name TEXT NOT NULL,
  status TEXT DEFAULT 'running', -- 'running', 'completed', 'failed', 'cancelled'
  records_processed INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  duration_ms INTEGER,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_quality_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_pipeline_runs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their data sources" ON public.data_sources FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their data catalog" ON public.data_catalog FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their quality checks" ON public.data_quality_checks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their pipeline runs" ON public.data_pipeline_runs FOR ALL USING (auth.uid() = user_id);