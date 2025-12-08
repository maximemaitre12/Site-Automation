import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface WorkspaceProject {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  start_date: string | null;
  end_date: string | null;
  progress: number;
  color: string;
  icon: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface WorkspaceTask {
  id: string;
  user_id: string;
  project_id: string | null;
  assigned_to: string | null;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  completed_at: string | null;
  estimated_hours: number | null;
  actual_hours: number | null;
  tags: string[];
  is_ai_generated: boolean;
  created_at: string;
  updated_at: string;
  project?: WorkspaceProject;
}

export interface WorkspaceMember {
  id: string;
  user_id: string;
  full_name: string;
  email: string | null;
  role: string | null;
  department: string | null;
  avatar_url: string | null;
  phone: string | null;
  location: string | null;
  skills: string[];
  status: 'active' | 'away' | 'busy' | 'offline';
  joined_at: string | null;
  last_active_at: string | null;
  created_at: string;
}

export interface KnowledgeArticle {
  id: string;
  user_id: string;
  parent_id: string | null;
  title: string;
  content: string | null;
  content_type: 'page' | 'wiki' | 'doc' | 'template';
  icon: string;
  cover_url: string | null;
  is_published: boolean;
  views_count: number;
  tags: string[];
  ai_summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceActivity {
  id: string;
  user_id: string;
  actor_name: string | null;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  entity_name: string | null;
  description: string | null;
  created_at: string;
}

export function useWorkspace() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [tasks, setTasks] = useState<WorkspaceTask[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [activities, setActivities] = useState<WorkspaceActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('workspace_projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setProjects((data || []).map(p => ({ ...p, tags: p.tags || [] })) as WorkspaceProject[]);
  }, [user]);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('workspace_tasks')
      .select('*, project:workspace_projects(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setTasks((data || []).map(t => ({ ...t, tags: t.tags || [] })) as WorkspaceTask[]);
  }, [user]);

  const fetchMembers = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('workspace_members')
      .select('*')
      .eq('user_id', user.id)
      .order('full_name');
    setMembers((data || []).map(m => ({ ...m, skills: m.skills || [] })) as WorkspaceMember[]);
  }, [user]);

  const fetchArticles = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('knowledge_articles')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    setArticles((data || []).map(a => ({ ...a, tags: a.tags || [] })) as KnowledgeArticle[]);
  }, [user]);

  const fetchActivities = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('workspace_activity')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    setActivities(data as WorkspaceActivity[] || []);
  }, [user]);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchProjects(), fetchTasks(), fetchMembers(), fetchArticles(), fetchActivities()]);
      setLoading(false);
    };
    fetchAll();
  }, [user, fetchProjects, fetchTasks, fetchMembers, fetchArticles, fetchActivities]);

  // Project CRUD
  const createProject = async (data: Partial<WorkspaceProject>) => {
    if (!user) return null;
    const { data: created, error } = await supabase
      .from('workspace_projects')
      .insert({ name: data.name || '', user_id: user.id, description: data.description, status: data.status, priority: data.priority, start_date: data.start_date, end_date: data.end_date, color: data.color, tags: data.tags || [] })
      .select().single();
    if (error) { toast({ title: 'Erreur', description: 'Impossible de créer le projet', variant: 'destructive' }); return null; }
    setProjects(prev => [{ ...created, tags: created.tags || [] } as WorkspaceProject, ...prev]);
    toast({ title: 'Succès', description: 'Projet créé' });
    return created;
  };

  const updateProject = async (id: string, data: Partial<WorkspaceProject>) => {
    const { error } = await supabase.from('workspace_projects').update({ name: data.name, description: data.description, status: data.status, priority: data.priority, progress: data.progress, start_date: data.start_date, end_date: data.end_date, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) { toast({ title: 'Erreur', variant: 'destructive' }); return false; }
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } as WorkspaceProject : p));
    return true;
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('workspace_projects').delete().eq('id', id);
    if (error) { toast({ title: 'Erreur', variant: 'destructive' }); return false; }
    setProjects(prev => prev.filter(p => p.id !== id));
    toast({ title: 'Projet supprimé' });
    return true;
  };

  // Task CRUD
  const createTask = async (data: Partial<WorkspaceTask>) => {
    if (!user) return null;
    const { data: created, error } = await supabase
      .from('workspace_tasks')
      .insert({ title: data.title || '', user_id: user.id, project_id: data.project_id, description: data.description, status: data.status || 'todo', priority: data.priority || 'medium', due_date: data.due_date, tags: data.tags || [] })
      .select('*, project:workspace_projects(*)').single();
    if (error) { toast({ title: 'Erreur', variant: 'destructive' }); return null; }
    setTasks(prev => [{ ...created, tags: created.tags || [] } as WorkspaceTask, ...prev]);
    toast({ title: 'Tâche créée' });
    return created;
  };

  const updateTask = async (id: string, data: Partial<WorkspaceTask>) => {
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.due_date !== undefined) updateData.due_date = data.due_date;
    if (data.completed_at !== undefined) updateData.completed_at = data.completed_at;
    const { error } = await supabase.from('workspace_tasks').update(updateData).eq('id', id);
    if (error) { toast({ title: 'Erreur', variant: 'destructive' }); return false; }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } as WorkspaceTask : t));
    return true;
  };

  const completeTask = async (id: string) => updateTask(id, { status: 'done', completed_at: new Date().toISOString() });

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('workspace_tasks').delete().eq('id', id);
    if (error) { toast({ title: 'Erreur', variant: 'destructive' }); return false; }
    setTasks(prev => prev.filter(t => t.id !== id));
    return true;
  };

  // Member CRUD
  const createMember = async (data: Partial<WorkspaceMember>) => {
    if (!user) return null;
    const { data: created, error } = await supabase
      .from('workspace_members')
      .insert({ full_name: data.full_name || '', user_id: user.id, email: data.email, role: data.role, department: data.department, phone: data.phone, location: data.location, skills: data.skills || [] })
      .select().single();
    if (error) { toast({ title: 'Erreur', variant: 'destructive' }); return null; }
    setMembers(prev => [...prev, { ...created, skills: created.skills || [] } as WorkspaceMember]);
    toast({ title: 'Membre ajouté' });
    return created;
  };

  const deleteMember = async (id: string) => {
    const { error } = await supabase.from('workspace_members').delete().eq('id', id);
    if (error) return false;
    setMembers(prev => prev.filter(m => m.id !== id));
    return true;
  };

  // Article CRUD
  const createArticle = async (data: Partial<KnowledgeArticle>) => {
    if (!user) return null;
    const { data: created, error } = await supabase
      .from('knowledge_articles')
      .insert({ title: data.title || '', user_id: user.id, content: data.content, content_type: data.content_type || 'page', parent_id: data.parent_id, tags: data.tags || [] })
      .select().single();
    if (error) { toast({ title: 'Erreur', variant: 'destructive' }); return null; }
    setArticles(prev => [{ ...created, tags: created.tags || [] } as KnowledgeArticle, ...prev]);
    toast({ title: 'Article créé' });
    return created;
  };

  const updateArticle = async (id: string, data: Partial<KnowledgeArticle>) => {
    const { error } = await supabase.from('knowledge_articles').update({ title: data.title, content: data.content, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) return false;
    setArticles(prev => prev.map(a => a.id === id ? { ...a, ...data } as KnowledgeArticle : a));
    return true;
  };

  const deleteArticle = async (id: string) => {
    const { error } = await supabase.from('knowledge_articles').delete().eq('id', id);
    if (error) return false;
    setArticles(prev => prev.filter(a => a.id !== id));
    return true;
  };

  // Log activity
  const logActivity = async (action_type: string, entity_type: string, entity_name: string, description?: string) => {
    if (!user) return;
    await supabase.from('workspace_activity').insert({ user_id: user.id, actor_name: user.email, action_type, entity_type, entity_name, description });
  };

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalTasks: tasks.length,
    todoTasks: tasks.filter(t => t.status === 'todo').length,
    inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
    doneTasks: tasks.filter(t => t.status === 'done').length,
    overdueTasks: tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done').length,
    totalMembers: members.length,
    totalArticles: articles.length,
  };

  return {
    projects, tasks, members, articles, activities, loading, stats,
    createProject, updateProject, deleteProject,
    createTask, updateTask, completeTask, deleteTask,
    createMember, deleteMember,
    createArticle, updateArticle, deleteArticle,
    logActivity,
    refresh: async () => { await Promise.all([fetchProjects(), fetchTasks(), fetchMembers(), fetchArticles(), fetchActivities()]); }
  };
}
