-- Drop the existing policy and recreate with proper WITH CHECK clause
DROP POLICY IF EXISTS "Users can CRUD own call analyses" ON public.call_analyses;

-- Create separate policies for each operation
CREATE POLICY "Users can view own call analyses" 
ON public.call_analyses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own call analyses" 
ON public.call_analyses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own call analyses" 
ON public.call_analyses 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own call analyses" 
ON public.call_analyses 
FOR DELETE 
USING (auth.uid() = user_id);