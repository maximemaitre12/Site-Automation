-- Create folders table for hierarchical document organization
CREATE TABLE public.doc_folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  parent_id UUID REFERENCES public.doc_folders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3C4DFE',
  icon TEXT DEFAULT 'folder',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document templates table
CREATE TABLE public.doc_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  content_structure JSONB DEFAULT '{}',
  branding JSONB DEFAULT '{}',
  variables JSONB DEFAULT '[]',
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enhanced documents table for AETHER DOC
CREATE TABLE public.aether_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  folder_id UUID REFERENCES public.doc_folders(id) ON DELETE SET NULL,
  template_id UUID REFERENCES public.doc_templates(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type TEXT,
  file_size INTEGER,
  content TEXT,
  extracted_data JSONB DEFAULT '{}',
  ai_summary TEXT,
  ai_keywords JSONB DEFAULT '[]',
  ai_entities JSONB DEFAULT '{}',
  embedding_status TEXT DEFAULT 'pending',
  tags JSONB DEFAULT '[]',
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active',
  access_level TEXT DEFAULT 'private',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document versions for versioning
CREATE TABLE public.doc_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.aether_documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content TEXT,
  file_url TEXT,
  changes_summary TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document access logs for audit
CREATE TABLE public.doc_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.aether_documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.doc_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doc_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aether_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doc_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doc_access_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for doc_folders
CREATE POLICY "Users can CRUD own folders"
ON public.doc_folders
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for doc_templates
CREATE POLICY "Users can view own and system templates"
ON public.doc_templates
FOR SELECT
USING (auth.uid() = user_id OR is_system = true);

CREATE POLICY "Users can create own templates"
ON public.doc_templates
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates"
ON public.doc_templates
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates"
ON public.doc_templates
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for aether_documents
CREATE POLICY "Users can CRUD own documents"
ON public.aether_documents
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for doc_versions
CREATE POLICY "Users can view versions of own documents"
ON public.doc_versions
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.aether_documents 
  WHERE id = doc_versions.document_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can create versions for own documents"
ON public.doc_versions
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.aether_documents 
  WHERE id = doc_versions.document_id 
  AND user_id = auth.uid()
));

-- RLS Policies for doc_access_logs
CREATE POLICY "Users can view logs of own documents"
ON public.doc_access_logs
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.aether_documents 
  WHERE id = doc_access_logs.document_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can create logs for own documents"
ON public.doc_access_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_doc_folders_updated_at
BEFORE UPDATE ON public.doc_folders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doc_templates_updated_at
BEFORE UPDATE ON public.doc_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_aether_documents_updated_at
BEFORE UPDATE ON public.aether_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert system templates
INSERT INTO public.doc_templates (user_id, name, description, category, content_structure, is_system) VALUES
('00000000-0000-0000-0000-000000000000', 'Contrat Commercial', 'Modèle de contrat commercial standard', 'contract', '{"sections": ["parties", "objet", "conditions", "duree", "prix", "resiliation", "signatures"]}', true),
('00000000-0000-0000-0000-000000000000', 'Proposition Commerciale', 'Template de proposition commerciale', 'proposal', '{"sections": ["introduction", "contexte", "solution", "tarification", "calendrier", "conclusion"]}', true),
('00000000-0000-0000-0000-000000000000', 'Rapport d''Analyse', 'Modèle de rapport d''analyse détaillé', 'report', '{"sections": ["resume", "methodologie", "resultats", "recommandations", "annexes"]}', true),
('00000000-0000-0000-0000-000000000000', 'Procédure Interne', 'Template de documentation de processus', 'procedure', '{"sections": ["objectif", "champ_application", "etapes", "responsabilites", "controles"]}', true),
('00000000-0000-0000-0000-000000000000', 'Fiche Projet', 'Modèle de fiche projet synthétique', 'project', '{"sections": ["resume", "objectifs", "livrables", "planning", "budget", "risques"]}', true);