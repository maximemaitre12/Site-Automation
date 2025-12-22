-- Create storage bucket for CV files
INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-files', 'cv-files', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for CV storage
CREATE POLICY "Users can upload CVs" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'cv-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their CVs" ON storage.objects
FOR SELECT USING (
  bucket_id = 'cv-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their CVs" ON storage.objects
FOR DELETE USING (
  bucket_id = 'cv-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add columns for Microsoft OAuth tokens (encrypted)
ALTER TABLE public.hr_email_accounts 
ADD COLUMN IF NOT EXISTS oauth_access_token TEXT,
ADD COLUMN IF NOT EXISTS oauth_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS oauth_token_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS oauth_provider_user_id TEXT,
ADD COLUMN IF NOT EXISTS last_extraction_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS extraction_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS extraction_interval_minutes INTEGER DEFAULT 30;

-- Add cv_file_url to candidates table
ALTER TABLE public.candidates
ADD COLUMN IF NOT EXISTS cv_file_url TEXT;