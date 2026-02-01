-- Fix the UPDATE policy to be more restrictive (only creators can update)
DROP POLICY IF EXISTS "Users can update their own blocks" ON public.custom_block_definitions;

CREATE POLICY "Creators can update their own blocks"
ON public.custom_block_definitions
FOR UPDATE
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);