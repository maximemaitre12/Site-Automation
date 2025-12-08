-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'text/markdown',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/json',
    'application/xml'
  ]
);

-- Storage policies for documents bucket
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add full-text search index on aether_documents
CREATE INDEX IF NOT EXISTS idx_aether_documents_search 
ON aether_documents USING gin(to_tsvector('french', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(content, '') || ' ' || coalesce(ai_summary, '')));

-- Add index for faster folder queries
CREATE INDEX IF NOT EXISTS idx_aether_documents_folder ON aether_documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_aether_documents_user ON aether_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_aether_documents_updated ON aether_documents(updated_at DESC);