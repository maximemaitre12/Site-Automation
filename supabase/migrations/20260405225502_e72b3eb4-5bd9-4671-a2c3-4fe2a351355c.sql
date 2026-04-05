
CREATE TABLE public.chatbot_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  language TEXT DEFAULT 'fr',
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Full-text search index for French
ALTER TABLE public.chatbot_knowledge ADD COLUMN search_vector tsvector 
  GENERATED ALWAYS AS (
    setweight(to_tsvector('french', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(content, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(category, '')), 'C')
  ) STORED;

CREATE INDEX idx_chatbot_knowledge_search ON public.chatbot_knowledge USING gin(search_vector);
CREATE INDEX idx_chatbot_knowledge_category ON public.chatbot_knowledge(category);
CREATE INDEX idx_chatbot_knowledge_active ON public.chatbot_knowledge(is_active);

-- RLS: public read access (chatbot is public), only authenticated for write
ALTER TABLE public.chatbot_knowledge ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for chatbot knowledge"
  ON public.chatbot_knowledge FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage knowledge base"
  ON public.chatbot_knowledge FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
