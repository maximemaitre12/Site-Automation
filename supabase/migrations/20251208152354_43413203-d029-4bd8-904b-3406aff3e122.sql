
-- CRM Pipeline Stages
CREATE TABLE public.crm_pipeline_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  color TEXT DEFAULT '#2D6FFF',
  probability INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CRM Companies (Accounts)
CREATE TABLE public.crm_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  employees_count INTEGER,
  annual_revenue NUMERIC,
  description TEXT,
  logo_url TEXT,
  linkedin_url TEXT,
  ai_enrichment JSONB,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CRM Contacts
CREATE TABLE public.crm_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  job_title TEXT,
  department TEXT,
  linkedin_url TEXT,
  avatar_url TEXT,
  engagement_score INTEGER DEFAULT 0,
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  ai_insights JSONB,
  tags JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CRM Opportunities (Deals)
CREATE TABLE public.crm_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  stage_id UUID REFERENCES public.crm_pipeline_stages(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  value NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  probability INTEGER DEFAULT 0,
  expected_close_date DATE,
  actual_close_date DATE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'won', 'lost')),
  loss_reason TEXT,
  description TEXT,
  ai_analysis JSONB,
  ai_risk_score INTEGER,
  ai_recommendations JSONB,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CRM Activities
CREATE TABLE public.crm_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES public.crm_opportunities(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('email', 'call', 'meeting', 'note', 'task', 'document')),
  subject TEXT NOT NULL,
  description TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  ai_summary TEXT,
  metadata JSONB,
  activity_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CRM Tasks
CREATE TABLE public.crm_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES public.crm_opportunities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  is_ai_generated BOOLEAN DEFAULT false,
  ai_reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crm_pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crm_pipeline_stages
CREATE POLICY "Users can view their own pipeline stages" ON public.crm_pipeline_stages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own pipeline stages" ON public.crm_pipeline_stages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pipeline stages" ON public.crm_pipeline_stages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pipeline stages" ON public.crm_pipeline_stages FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for crm_companies
CREATE POLICY "Users can view their own companies" ON public.crm_companies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own companies" ON public.crm_companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own companies" ON public.crm_companies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own companies" ON public.crm_companies FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for crm_contacts
CREATE POLICY "Users can view their own contacts" ON public.crm_contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own contacts" ON public.crm_contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own contacts" ON public.crm_contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own contacts" ON public.crm_contacts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for crm_opportunities
CREATE POLICY "Users can view their own opportunities" ON public.crm_opportunities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own opportunities" ON public.crm_opportunities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own opportunities" ON public.crm_opportunities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own opportunities" ON public.crm_opportunities FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for crm_activities
CREATE POLICY "Users can view their own activities" ON public.crm_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own activities" ON public.crm_activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own activities" ON public.crm_activities FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for crm_tasks
CREATE POLICY "Users can view their own tasks" ON public.crm_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own tasks" ON public.crm_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON public.crm_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON public.crm_tasks FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_crm_contacts_user_id ON public.crm_contacts(user_id);
CREATE INDEX idx_crm_contacts_company_id ON public.crm_contacts(company_id);
CREATE INDEX idx_crm_companies_user_id ON public.crm_companies(user_id);
CREATE INDEX idx_crm_opportunities_user_id ON public.crm_opportunities(user_id);
CREATE INDEX idx_crm_opportunities_stage_id ON public.crm_opportunities(stage_id);
CREATE INDEX idx_crm_activities_user_id ON public.crm_activities(user_id);
CREATE INDEX idx_crm_tasks_user_id ON public.crm_tasks(user_id);
CREATE INDEX idx_crm_tasks_due_date ON public.crm_tasks(due_date);

-- Trigger for updated_at
CREATE TRIGGER update_crm_pipeline_stages_updated_at BEFORE UPDATE ON public.crm_pipeline_stages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_crm_companies_updated_at BEFORE UPDATE ON public.crm_companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_crm_contacts_updated_at BEFORE UPDATE ON public.crm_contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_crm_opportunities_updated_at BEFORE UPDATE ON public.crm_opportunities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_crm_tasks_updated_at BEFORE UPDATE ON public.crm_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
