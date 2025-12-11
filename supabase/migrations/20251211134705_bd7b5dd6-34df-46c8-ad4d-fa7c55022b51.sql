-- Create employees table for team management
CREATE TABLE public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  
  -- Identity
  name text NOT NULL,
  email text,
  phone text,
  avatar_url text,
  
  -- Position & Contract
  job_title text NOT NULL,
  department text,
  contract_type text DEFAULT 'CDI',
  hire_date date,
  salary_current numeric,
  
  -- Status
  is_active boolean DEFAULT true,
  left_date date,
  left_reason text,
  left_details text,
  
  -- Performance metrics (calculated for salespeople)
  performance_metrics jsonb DEFAULT '{}',
  
  -- Optional link to original candidate
  candidate_id uuid REFERENCES public.candidates(id) ON DELETE SET NULL,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_employees_user_id ON public.employees(user_id);
CREATE INDEX idx_employees_is_active ON public.employees(is_active);
CREATE INDEX idx_employees_department ON public.employees(department);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can manage their employees" ON public.employees
FOR ALL USING (auth.uid() = user_id);

-- Create employee_career_events table
CREATE TABLE public.employee_career_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  
  event_type text NOT NULL,
  event_date date NOT NULL,
  description text,
  
  -- For raises
  old_salary numeric,
  new_salary numeric,
  salary_change_percent numeric,
  
  -- For bonuses
  bonus_amount numeric,
  bonus_reason text,
  
  -- For promotions
  old_title text,
  new_title text,
  
  -- For warnings
  warning_type text,
  warning_severity text,
  
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_career_events_employee ON public.employee_career_events(employee_id);

-- Enable RLS
ALTER TABLE public.employee_career_events ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can manage career events" ON public.employee_career_events
FOR ALL USING (auth.uid() = user_id);

-- Create hr_disputes table
CREATE TABLE public.hr_disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  
  title text NOT NULL,
  description text,
  dispute_type text NOT NULL,
  severity text DEFAULT 'medium',
  status text DEFAULT 'open',
  
  involved_parties jsonb DEFAULT '[]',
  resolution text,
  resolution_date date,
  resolved_by text,
  documents jsonb DEFAULT '[]',
  timeline jsonb DEFAULT '[]',
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_disputes_employee ON public.hr_disputes(employee_id);
CREATE INDEX idx_disputes_status ON public.hr_disputes(status);

-- Enable RLS
ALTER TABLE public.hr_disputes ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can manage disputes" ON public.hr_disputes
FOR ALL USING (auth.uid() = user_id);

-- Add salesperson_id to sales_deals
ALTER TABLE public.sales_deals 
ADD COLUMN IF NOT EXISTS salesperson_id uuid REFERENCES public.employees(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_sales_deals_salesperson ON public.sales_deals(salesperson_id);

-- Create trigger for updated_at on employees
CREATE TRIGGER update_employees_updated_at
BEFORE UPDATE ON public.employees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on hr_disputes
CREATE TRIGGER update_hr_disputes_updated_at
BEFORE UPDATE ON public.hr_disputes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();