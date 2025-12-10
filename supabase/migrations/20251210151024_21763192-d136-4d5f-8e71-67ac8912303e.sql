-- Create sales statuses enum
CREATE TYPE public.sales_status AS ENUM (
  'lead_created',
  'contacted',
  'engaged',
  'qualifying',
  'qualified',
  'proposal_sent',
  'negotiation',
  'closing_imminent',
  'won',
  'lost',
  'to_recontact',
  'inactive'
);

-- Create AI predictions table
CREATE TABLE public.ai_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  prediction_type TEXT NOT NULL, -- 'forecast', 'churn_risk', 'deal_probability', 'segment'
  entity_type TEXT NOT NULL, -- 'deal', 'contact', 'company', 'pipeline'
  entity_id UUID,
  prediction_value NUMERIC,
  confidence_score NUMERIC,
  factors JSONB DEFAULT '[]'::jsonb, -- explainability factors
  prediction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE,
  model_version TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI segments table
CREATE TABLE public.ai_segments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  segment_type TEXT NOT NULL, -- 'prospect', 'customer', 'behavior', 'value'
  criteria JSONB DEFAULT '{}'::jsonb,
  member_count INTEGER DEFAULT 0,
  avg_score NUMERIC,
  cluster_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI anomalies table
CREATE TABLE public.ai_anomalies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  anomaly_type TEXT NOT NULL, -- 'conversion_drop', 'inactive_sales', 'campaign_failure', 'churn_risk', 'pipeline_issue'
  severity TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  title TEXT NOT NULL,
  description TEXT,
  entity_type TEXT,
  entity_id UUID,
  detected_value NUMERIC,
  expected_value NUMERIC,
  deviation_percent NUMERIC,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI automation rules table
CREATE TABLE public.ai_automation_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  trigger_type TEXT NOT NULL, -- 'score_threshold', 'sentiment', 'status_change', 'prediction', 'anomaly'
  trigger_conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  action_type TEXT NOT NULL, -- 'assign', 'alert', 'email', 'status_change', 'task_create'
  action_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  execution_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI automation logs table
CREATE TABLE public.ai_automation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  rule_id UUID REFERENCES public.ai_automation_rules(id) ON DELETE SET NULL,
  rule_name TEXT,
  trigger_data JSONB,
  action_taken TEXT,
  result TEXT, -- 'success', 'failure', 'skipped'
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales deals table with full pipeline support
CREATE TABLE public.sales_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_id UUID,
  contact_name TEXT,
  contact_email TEXT,
  title TEXT NOT NULL,
  description TEXT,
  value NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  status sales_status NOT NULL DEFAULT 'lead_created',
  probability INTEGER DEFAULT 0,
  ai_score INTEGER,
  ai_risk_score INTEGER,
  ai_factors JSONB DEFAULT '[]'::jsonb,
  expected_close_date DATE,
  actual_close_date DATE,
  lost_reason TEXT,
  source TEXT,
  assigned_to TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create deal status history table
CREATE TABLE public.deal_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID NOT NULL REFERENCES public.sales_deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  from_status sales_status,
  to_status sales_status NOT NULL,
  changed_by TEXT,
  change_reason TEXT,
  ai_triggered BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create forecasts table
CREATE TABLE public.sales_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  forecast_period TEXT NOT NULL, -- 'weekly', 'monthly', 'quarterly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  predicted_revenue NUMERIC,
  predicted_deals_won INTEGER,
  predicted_deals_lost INTEGER,
  confidence_interval_low NUMERIC,
  confidence_interval_high NUMERIC,
  factors JSONB DEFAULT '[]'::jsonb,
  model_accuracy NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create deduplication candidates table
CREATE TABLE public.dedupe_candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entity_type TEXT NOT NULL, -- 'company', 'contact', 'deal'
  entity_1_id UUID NOT NULL,
  entity_2_id UUID NOT NULL,
  similarity_score NUMERIC NOT NULL,
  matching_fields JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending', -- 'pending', 'merged', 'rejected', 'reviewed'
  merged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dedupe_candidates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their AI predictions" ON public.ai_predictions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their AI segments" ON public.ai_segments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their AI anomalies" ON public.ai_anomalies FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their automation rules" ON public.ai_automation_rules FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their automation logs" ON public.ai_automation_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert automation logs" ON public.ai_automation_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage their deals" ON public.sales_deals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view deal history" ON public.deal_status_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert deal history" ON public.deal_status_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage their forecasts" ON public.sales_forecasts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage dedupe candidates" ON public.dedupe_candidates FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_ai_predictions_user_type ON public.ai_predictions(user_id, prediction_type);
CREATE INDEX idx_ai_predictions_entity ON public.ai_predictions(entity_type, entity_id);
CREATE INDEX idx_ai_anomalies_user_type ON public.ai_anomalies(user_id, anomaly_type, is_resolved);
CREATE INDEX idx_sales_deals_user_status ON public.sales_deals(user_id, status);
CREATE INDEX idx_sales_deals_user_date ON public.sales_deals(user_id, expected_close_date);
CREATE INDEX idx_deal_status_history_deal ON public.deal_status_history(deal_id);
CREATE INDEX idx_sales_forecasts_user_period ON public.sales_forecasts(user_id, period_start);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_ai_predictions_updated_at BEFORE UPDATE ON public.ai_predictions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_segments_updated_at BEFORE UPDATE ON public.ai_segments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_automation_rules_updated_at BEFORE UPDATE ON public.ai_automation_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sales_deals_updated_at BEFORE UPDATE ON public.sales_deals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();