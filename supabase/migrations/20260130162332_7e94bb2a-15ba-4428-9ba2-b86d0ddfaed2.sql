-- Add favorites and archived columns to aether_documents
ALTER TABLE public.aether_documents
ADD COLUMN is_favorite boolean DEFAULT false,
ADD COLUMN is_archived boolean DEFAULT false;