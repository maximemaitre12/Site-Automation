-- 1. Fix self-referential bug in user_roles INSERT policy
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.company_id = user_roles.company_id
      AND ur.role = ANY (ARRAY['owner'::app_role, 'admin'::app_role])
  )
);

-- 2. Scope demo_requests admin SELECT/UPDATE/DELETE to AETHER internal company admins
DROP POLICY IF EXISTS "Admins can view demo requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Admins can update demo requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Admins can delete demo requests" ON public.demo_requests;

CREATE POLICY "AETHER admins can view demo requests"
ON public.demo_requests
FOR SELECT
TO authenticated
USING (
  public.has_min_role(auth.uid(), '378cfe0d-b202-48bf-af4a-c1585e73702b'::uuid, 'admin'::app_role)
);

CREATE POLICY "AETHER admins can update demo requests"
ON public.demo_requests
FOR UPDATE
TO authenticated
USING (
  public.has_min_role(auth.uid(), '378cfe0d-b202-48bf-af4a-c1585e73702b'::uuid, 'admin'::app_role)
);

CREATE POLICY "AETHER admins can delete demo requests"
ON public.demo_requests
FOR DELETE
TO authenticated
USING (
  public.has_min_role(auth.uid(), '378cfe0d-b202-48bf-af4a-c1585e73702b'::uuid, 'admin'::app_role)
);

-- 3. Templates: split policies, require authentication for default templates
DROP POLICY IF EXISTS "Users can CRUD own templates" ON public.templates;

CREATE POLICY "Authenticated users can read templates"
ON public.templates
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR is_default = true);

CREATE POLICY "Users can update own templates"
ON public.templates
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates"
ON public.templates
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 4. Companies: track creator and limit one company per user
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

DROP POLICY IF EXISTS "Authenticated users can create companies" ON public.companies;

CREATE POLICY "Authenticated users can create one company"
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND created_by = auth.uid()
  AND NOT EXISTS (
    SELECT 1 FROM public.companies c WHERE c.created_by = auth.uid()
  )
);

-- 5. Remove workflow_job_queue from public realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.workflow_job_queue;