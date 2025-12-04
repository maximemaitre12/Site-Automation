-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can CRUD own documents" ON public.documents;

-- Create a permissive policy instead
CREATE POLICY "Users can CRUD own documents" 
ON public.documents 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);