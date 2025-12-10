-- Drop existing constraint and add new one with correct status values
ALTER TABLE public.candidates DROP CONSTRAINT IF EXISTS candidates_status_check;

ALTER TABLE public.candidates ADD CONSTRAINT candidates_status_check 
CHECK (status = ANY (ARRAY['new'::text, 'analyzed'::text, 'active'::text, 'screening'::text, 'interview'::text, 'offer'::text, 'hired'::text, 'rejected'::text]));