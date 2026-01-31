-- Add client credentials columns to user_oauth_tokens
ALTER TABLE public.user_oauth_tokens 
ADD COLUMN IF NOT EXISTS client_id text,
ADD COLUMN IF NOT EXISTS client_secret text;