-- Fix 1: Restrict companies table to only users who are members of that company
DROP POLICY IF EXISTS "Authenticated users can view companies" ON public.companies;

-- Companies: users can only view their own company (via user_roles)
CREATE POLICY "Users can view their own company" 
ON public.companies 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.company_id = companies.id 
    AND user_roles.user_id = auth.uid()
  )
);

-- Fix 2: demo_requests - only allow insert with proper validation (not just true)
DROP POLICY IF EXISTS "Anyone can submit demo request" ON public.demo_requests;

-- Allow anyone to submit but validate the data structure (email and company are required)
CREATE POLICY "Anyone can submit demo request with email" 
ON public.demo_requests 
FOR INSERT 
WITH CHECK (
  email IS NOT NULL 
  AND company IS NOT NULL 
  AND length(email) > 0 
  AND length(company) > 0
);