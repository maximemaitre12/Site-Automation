-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own call analyses" ON public.call_analyses;
DROP POLICY IF EXISTS "Users can insert own call analyses" ON public.call_analyses;
DROP POLICY IF EXISTS "Users can update own call analyses" ON public.call_analyses;
DROP POLICY IF EXISTS "Users can delete own call analyses" ON public.call_analyses;

-- Create PERMISSIVE policies (default behavior)
CREATE POLICY "Users can view own call analyses" 
ON public.call_analyses 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own call analyses" 
ON public.call_analyses 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own call analyses" 
ON public.call_analyses 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own call analyses" 
ON public.call_analyses 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);