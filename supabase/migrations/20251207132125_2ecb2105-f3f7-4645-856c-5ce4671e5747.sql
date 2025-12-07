-- Add connections column to workflows table
ALTER TABLE public.workflows 
ADD COLUMN IF NOT EXISTS connections jsonb DEFAULT '[]'::jsonb;