-- =============================================
-- AETHER ENTERPRISE: Multi-tenant + RBAC Foundation (Complete)
-- =============================================

-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'manager', 'editor', 'viewer');

-- 2. Create companies (tenants) table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3C4DFE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  settings JSONB DEFAULT '{}',
  subscription_tier TEXT DEFAULT 'free',
  max_users INTEGER DEFAULT 5,
  max_storage_mb INTEGER DEFAULT 1000
);

-- 3. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- 4. Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Add company_id to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;

-- 6. Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 7. Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 8. Function to get user's company_id
CREATE OR REPLACE FUNCTION public.get_user_company_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- 9. Function to check minimum role level using plpgsql
CREATE OR REPLACE FUNCTION public.has_min_role(_user_id UUID, _company_id UUID, _min_role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
  role_level INTEGER;
  min_level INTEGER;
BEGIN
  -- Get user's role for this company
  SELECT role INTO user_role FROM public.user_roles 
  WHERE user_id = _user_id AND company_id = _company_id;
  
  IF user_role IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Map roles to levels (higher = more permissions)
  CASE user_role
    WHEN 'owner' THEN role_level := 5;
    WHEN 'admin' THEN role_level := 4;
    WHEN 'manager' THEN role_level := 3;
    WHEN 'editor' THEN role_level := 2;
    WHEN 'viewer' THEN role_level := 1;
    ELSE role_level := 0;
  END CASE;
  
  CASE _min_role
    WHEN 'owner' THEN min_level := 5;
    WHEN 'admin' THEN min_level := 4;
    WHEN 'manager' THEN min_level := 3;
    WHEN 'editor' THEN min_level := 2;
    WHEN 'viewer' THEN min_level := 1;
    ELSE min_level := 0;
  END CASE;
  
  RETURN role_level >= min_level;
END;
$$;

-- 10. RLS Policies for companies
CREATE POLICY "Users can view their company"
ON public.companies FOR SELECT TO authenticated
USING (id IN (SELECT company_id FROM public.user_roles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update their company"
ON public.companies FOR UPDATE TO authenticated
USING (public.has_min_role(auth.uid(), id, 'admin'));

-- 11. RLS Policies for user_roles
CREATE POLICY "Users can view roles in their company"
ON public.user_roles FOR SELECT TO authenticated
USING (company_id IN (SELECT ur.company_id FROM public.user_roles ur WHERE ur.user_id = auth.uid()));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_min_role(auth.uid(), company_id, 'admin'))
WITH CHECK (public.has_min_role(auth.uid(), company_id, 'admin'));

-- 12. RLS Policies for audit_logs
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT TO authenticated
USING (public.has_min_role(auth.uid(), company_id, 'admin'));

CREATE POLICY "Users can insert audit logs"
ON public.audit_logs FOR INSERT TO authenticated
WITH CHECK (company_id IN (SELECT company_id FROM public.user_roles WHERE user_id = auth.uid()));

-- 13. Indexes
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_company_id ON public.user_roles(company_id);
CREATE INDEX idx_audit_logs_company_id ON public.audit_logs(company_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_profiles_company_id ON public.profiles(company_id);

-- 14. Triggers
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();