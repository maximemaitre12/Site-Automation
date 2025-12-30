-- Table pour le contexte inter-agents
CREATE TABLE public.agent_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  agent_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agent_context ENABLE ROW LEVEL SECURITY;

-- RLS policy
CREATE POLICY "Users can manage their agent context"
ON public.agent_context FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX idx_agent_context_user_agent ON public.agent_context(user_id, agent_type);
CREATE INDEX idx_agent_context_entity ON public.agent_context(entity_type, entity_id);

-- Table pour les insights IA partagés
CREATE TABLE public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  source_agent TEXT NOT NULL,
  insight_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  related_entities JSONB DEFAULT '[]'::jsonb,
  priority INTEGER DEFAULT 5,
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- RLS policy
CREATE POLICY "Users can manage their AI insights"
ON public.ai_insights FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX idx_ai_insights_user ON public.ai_insights(user_id, is_read, is_dismissed);
CREATE INDEX idx_ai_insights_source ON public.ai_insights(source_agent, insight_type);

-- Table pour les actions suggérées par l'IA
CREATE TABLE public.ai_suggested_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_agent TEXT NOT NULL,
  action_data JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending',
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_suggested_actions ENABLE ROW LEVEL SECURITY;

-- RLS policy
CREATE POLICY "Users can manage their suggested actions"
ON public.ai_suggested_actions FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX idx_ai_suggested_actions_user ON public.ai_suggested_actions(user_id, status);
CREATE INDEX idx_ai_suggested_actions_target ON public.ai_suggested_actions(target_agent);

-- Table pour les favoris cross-agents
CREATE TABLE public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  agent_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  entity_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, entity_type, entity_id)
);

-- Enable RLS
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS policy
CREATE POLICY "Users can manage their favorites"
ON public.user_favorites FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Index
CREATE INDEX idx_user_favorites_user ON public.user_favorites(user_id, agent_type);