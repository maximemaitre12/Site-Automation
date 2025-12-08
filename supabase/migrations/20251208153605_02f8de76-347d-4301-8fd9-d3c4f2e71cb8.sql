
-- Workspace Projects
CREATE TABLE public.workspace_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  start_date DATE,
  end_date DATE,
  progress INTEGER DEFAULT 0,
  color TEXT DEFAULT '#2D6FFF',
  icon TEXT DEFAULT 'folder',
  tags JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Workspace Tasks (unified tasks across workspace)
CREATE TABLE public.workspace_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID REFERENCES public.workspace_projects(id) ON DELETE SET NULL,
  assigned_to UUID,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  estimated_hours NUMERIC,
  actual_hours NUMERIC,
  tags JSONB DEFAULT '[]'::jsonb,
  is_ai_generated BOOLEAN DEFAULT false,
  ai_context TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team Members
CREATE TABLE public.workspace_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  role TEXT,
  department TEXT,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'away', 'busy', 'offline')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Knowledge Base Articles
CREATE TABLE public.knowledge_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  parent_id UUID REFERENCES public.knowledge_articles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT,
  content_type TEXT DEFAULT 'page' CHECK (content_type IN ('page', 'wiki', 'doc', 'template')),
  icon TEXT DEFAULT 'file-text',
  cover_url TEXT,
  is_published BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  tags JSONB DEFAULT '[]'::jsonb,
  ai_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Workspace Activity Feed
CREATE TABLE public.workspace_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  actor_name TEXT,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  entity_name TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workspace_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their workspace projects" ON public.workspace_projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their workspace tasks" ON public.workspace_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their workspace members" ON public.workspace_members FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their knowledge articles" ON public.knowledge_articles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their workspace activity" ON public.workspace_activity FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_workspace_projects_user ON public.workspace_projects(user_id);
CREATE INDEX idx_workspace_tasks_user ON public.workspace_tasks(user_id);
CREATE INDEX idx_workspace_tasks_project ON public.workspace_tasks(project_id);
CREATE INDEX idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX idx_knowledge_articles_user ON public.knowledge_articles(user_id);
CREATE INDEX idx_workspace_activity_user ON public.workspace_activity(user_id);
CREATE INDEX idx_workspace_activity_created ON public.workspace_activity(created_at DESC);

-- Triggers
CREATE TRIGGER update_workspace_projects_updated_at BEFORE UPDATE ON public.workspace_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_workspace_tasks_updated_at BEFORE UPDATE ON public.workspace_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_workspace_members_updated_at BEFORE UPDATE ON public.workspace_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_knowledge_articles_updated_at BEFORE UPDATE ON public.knowledge_articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
