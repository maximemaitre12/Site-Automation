-- Table for internal compliance rules
CREATE TABLE IF NOT EXISTS public.sales_internal_compliance_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  rule_type TEXT NOT NULL,
  rule_name TEXT NOT NULL,
  rule_description TEXT,
  keywords JSONB DEFAULT '[]'::jsonb,
  max_discount_percent INTEGER,
  forbidden_phrases JSONB DEFAULT '[]'::jsonb,
  required_disclaimers JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  severity TEXT DEFAULT 'warning',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sales_internal_compliance_rules ENABLE ROW LEVEL SECURITY;

-- RLS policy (drop if exists first)
DROP POLICY IF EXISTS "Users can manage their compliance rules" ON public.sales_internal_compliance_rules;
CREATE POLICY "Users can manage their compliance rules" ON public.sales_internal_compliance_rules
  FOR ALL USING (auth.uid() = user_id);

-- Table for compliance check history
CREATE TABLE IF NOT EXISTS public.sales_compliance_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  content_id UUID,
  content_preview TEXT,
  compliance_score INTEGER,
  issues JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending',
  checked_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sales_compliance_checks ENABLE ROW LEVEL SECURITY;

-- RLS policy (drop if exists first)
DROP POLICY IF EXISTS "Users can manage their compliance checks" ON public.sales_compliance_checks;
CREATE POLICY "Users can manage their compliance checks" ON public.sales_compliance_checks
  FOR ALL USING (auth.uid() = user_id);

-- Add missing columns to sales_presentations if they don't exist
ALTER TABLE public.sales_presentations ADD COLUMN IF NOT EXISTS compliance_status TEXT DEFAULT 'pending';
ALTER TABLE public.sales_presentations ADD COLUMN IF NOT EXISTS compliance_score INTEGER;
ALTER TABLE public.sales_presentations ADD COLUMN IF NOT EXISTS compliance_issues JSONB DEFAULT '[]'::jsonb;