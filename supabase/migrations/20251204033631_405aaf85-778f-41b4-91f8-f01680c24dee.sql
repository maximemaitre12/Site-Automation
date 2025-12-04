-- Create templates table for AETHER Doc
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB DEFAULT '[]'::jsonb,
  type TEXT DEFAULT 'libre',
  tags JSONB DEFAULT '[]'::jsonb,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for templates
CREATE POLICY "Users can CRUD own templates"
ON public.templates
FOR ALL
USING (auth.uid() = user_id OR is_default = true);

CREATE POLICY "Users can insert own templates"
ON public.templates
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_templates_updated_at
BEFORE UPDATE ON public.templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update documents table to add missing columns
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'libre',
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.templates(id),
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '[]'::jsonb;