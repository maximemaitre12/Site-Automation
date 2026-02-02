
-- Add company_id to key tables for multi-tenant data sharing
-- Documents already have access_level, we need to add company_id for company-level sharing

-- Add company_id to aether_documents if not exists
ALTER TABLE public.aether_documents ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL;

-- Add company_id to sales_deals for company-level sharing
ALTER TABLE public.sales_deals ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL;

-- Add company_id to candidates for HR company-level sharing  
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL;

-- Add company_id to employees for HR company-level sharing
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL;

-- Create teams table for group functionality within companies
CREATE TABLE IF NOT EXISTS public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create team_members junction table
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Enable RLS on new tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create function to get user's company_id safely
CREATE OR REPLACE FUNCTION public.get_user_company_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Create function to check if user is in same company
CREATE OR REPLACE FUNCTION public.is_same_company(_user_id uuid, _company_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND company_id = _company_id
  )
$$;

-- Drop old policies that need updating
DROP POLICY IF EXISTS "Users can CRUD own documents" ON public.aether_documents;
DROP POLICY IF EXISTS "Users can manage their deals" ON public.sales_deals;
DROP POLICY IF EXISTS "Users can CRUD own candidates" ON public.candidates;
DROP POLICY IF EXISTS "Users can manage their employees" ON public.employees;

-- New RLS for aether_documents: personal OR shared with team/company
CREATE POLICY "Documents: personal access" ON public.aether_documents
FOR ALL USING (
  auth.uid() = user_id
) WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Documents: team access read" ON public.aether_documents
FOR SELECT USING (
  access_level = 'team' 
  AND company_id IS NOT NULL 
  AND public.is_same_company(auth.uid(), company_id)
);

CREATE POLICY "Documents: enterprise access read" ON public.aether_documents
FOR SELECT USING (
  access_level = 'enterprise' 
  AND company_id IS NOT NULL 
  AND public.is_same_company(auth.uid(), company_id)
);

-- Sales deals: personal by default, shared if company_id set
CREATE POLICY "Deals: personal access" ON public.sales_deals
FOR ALL USING (
  auth.uid() = user_id
) WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Deals: company access read" ON public.sales_deals
FOR SELECT USING (
  company_id IS NOT NULL 
  AND public.is_same_company(auth.uid(), company_id)
);

-- Candidates: personal by default, shared at company level for HR
CREATE POLICY "Candidates: personal access" ON public.candidates
FOR ALL USING (
  auth.uid() = user_id
) WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Candidates: company access read" ON public.candidates
FOR SELECT USING (
  company_id IS NOT NULL 
  AND public.is_same_company(auth.uid(), company_id)
);

-- Employees: shared at company level for HR
CREATE POLICY "Employees: personal access" ON public.employees
FOR ALL USING (
  auth.uid() = user_id
) WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Employees: company access read" ON public.employees
FOR SELECT USING (
  company_id IS NOT NULL 
  AND public.is_same_company(auth.uid(), company_id)
);

-- Teams policies
CREATE POLICY "Teams: company members can view" ON public.teams
FOR SELECT USING (
  public.is_same_company(auth.uid(), company_id)
);

CREATE POLICY "Teams: admins can manage" ON public.teams
FOR ALL USING (
  public.has_min_role(auth.uid(), company_id, 'admin')
) WITH CHECK (
  public.has_min_role(auth.uid(), company_id, 'admin')
);

-- Team members policies
CREATE POLICY "Team members: can view own teams" ON public.team_members
FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.teams t
    WHERE t.id = team_id AND public.is_same_company(auth.uid(), t.company_id)
  )
);

CREATE POLICY "Team members: admins can manage" ON public.team_members
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.teams t
    WHERE t.id = team_id AND public.has_min_role(auth.uid(), t.company_id, 'admin')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.teams t
    WHERE t.id = team_id AND public.has_min_role(auth.uid(), t.company_id, 'admin')
  )
);

-- Allow users to view all companies (for onboarding selection)
DROP POLICY IF EXISTS "Users can view their company" ON public.companies;

CREATE POLICY "Authenticated users can view companies" ON public.companies
FOR SELECT USING (true);

CREATE POLICY "Anyone can create a company" ON public.companies
FOR INSERT WITH CHECK (true);

-- Allow users to insert their own role when joining a company
CREATE POLICY "Users can join companies" ON public.user_roles
FOR INSERT WITH CHECK (
  user_id = auth.uid()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_aether_documents_company_id ON public.aether_documents(company_id);
CREATE INDEX IF NOT EXISTS idx_aether_documents_access_level ON public.aether_documents(access_level);
CREATE INDEX IF NOT EXISTS idx_sales_deals_company_id ON public.sales_deals(company_id);
CREATE INDEX IF NOT EXISTS idx_candidates_company_id ON public.candidates(company_id);
CREATE INDEX IF NOT EXISTS idx_employees_company_id ON public.employees(company_id);
CREATE INDEX IF NOT EXISTS idx_teams_company_id ON public.teams(company_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);
