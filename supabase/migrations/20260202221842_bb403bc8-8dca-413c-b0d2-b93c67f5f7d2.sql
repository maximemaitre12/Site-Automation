-- Fix RLS policies to allow same-company members to see each other

-- 1. Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- 2. Create policy allowing users to see all roles in their company
CREATE POLICY "Users can view roles in their company"
ON public.user_roles FOR SELECT
USING (
  user_id = auth.uid() 
  OR company_id = public.get_user_company_id(auth.uid())
);

-- 3. Create policy allowing users to see profiles of company members
CREATE POLICY "Users can view profiles of company members"
ON public.profiles FOR SELECT
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = profiles.user_id
    AND ur.company_id = public.get_user_company_id(auth.uid())
  )
);