import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface PipelineStage {
  id: string;
  user_id: string;
  name: string;
  position: number;
  color: string;
  probability: number;
  created_at: string;
}

export interface Company {
  id: string;
  user_id: string;
  name: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  employees_count: number | null;
  annual_revenue: number | null;
  description: string | null;
  logo_url: string | null;
  linkedin_url: string | null;
  ai_enrichment: Record<string, unknown> | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  user_id: string;
  company_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  job_title: string | null;
  department: string | null;
  linkedin_url: string | null;
  avatar_url: string | null;
  engagement_score: number;
  last_contacted_at: string | null;
  ai_insights: Record<string, unknown> | null;
  tags: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
  company?: Company;
}

export interface Opportunity {
  id: string;
  user_id: string;
  company_id: string | null;
  contact_id: string | null;
  stage_id: string | null;
  name: string;
  value: number;
  currency: string;
  probability: number;
  expected_close_date: string | null;
  actual_close_date: string | null;
  status: 'open' | 'won' | 'lost';
  loss_reason: string | null;
  description: string | null;
  ai_analysis: Record<string, unknown> | null;
  ai_risk_score: number | null;
  ai_recommendations: unknown[] | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  company?: Company;
  contact?: Contact;
  stage?: PipelineStage;
}

export interface Activity {
  id: string;
  user_id: string;
  company_id: string | null;
  contact_id: string | null;
  opportunity_id: string | null;
  activity_type: 'email' | 'call' | 'meeting' | 'note' | 'task' | 'document';
  subject: string;
  description: string | null;
  sentiment: 'positive' | 'neutral' | 'negative' | null;
  ai_summary: string | null;
  metadata: Record<string, unknown> | null;
  activity_date: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  company_id: string | null;
  contact_id: string | null;
  opportunity_id: string | null;
  title: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date: string | null;
  completed_at: string | null;
  is_ai_generated: boolean;
  ai_reasoning: string | null;
  created_at: string;
  updated_at: string;
  company?: Company;
  contact?: Contact;
  opportunity?: Opportunity;
}

export interface CRMStats {
  totalContacts: number;
  totalCompanies: number;
  totalOpportunities: number;
  totalValue: number;
  wonValue: number;
  lostValue: number;
  openValue: number;
  tasksOverdue: number;
  tasksPending: number;
}

const DEFAULT_STAGES: Omit<PipelineStage, 'id' | 'user_id' | 'created_at'>[] = [
  { name: 'Qualification', position: 0, color: '#6366F1', probability: 10 },
  { name: 'Découverte', position: 1, color: '#8B5CF6', probability: 20 },
  { name: 'Proposition', position: 2, color: '#2D6FFF', probability: 40 },
  { name: 'Négociation', position: 3, color: '#F59E0B', probability: 60 },
  { name: 'Closing', position: 4, color: '#10B981', probability: 80 },
];

export function useCRM() {
  const { user } = useAuth();
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CRMStats>({
    totalContacts: 0,
    totalCompanies: 0,
    totalOpportunities: 0,
    totalValue: 0,
    wonValue: 0,
    lostValue: 0,
    openValue: 0,
    tasksOverdue: 0,
    tasksPending: 0,
  });

  // Fetch pipeline stages
  const fetchStages = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('crm_pipeline_stages')
      .select('*')
      .eq('user_id', user.id)
      .order('position');
    
    if (error) {
      console.error('Error fetching stages:', error);
      return;
    }
    
    // Create default stages if none exist
    if (data.length === 0) {
      const defaultStages = DEFAULT_STAGES.map(stage => ({
        ...stage,
        user_id: user.id,
      }));
      
      const { data: created, error: createError } = await supabase
        .from('crm_pipeline_stages')
        .insert(defaultStages)
        .select();
      
      if (!createError && created) {
        setStages(created as PipelineStage[]);
      }
    } else {
      setStages(data as PipelineStage[]);
    }
  }, [user]);

  // Fetch companies
  const fetchCompanies = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('crm_companies')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching companies:', error);
      return;
    }
    setCompanies((data || []).map(c => ({ ...c, tags: c.tags || [] })) as Company[]);
  }, [user]);

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('crm_contacts')
      .select('*, company:crm_companies(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching contacts:', error);
      return;
    }
    setContacts((data || []).map(c => ({ ...c, tags: c.tags || [] })) as Contact[]);
  }, [user]);

  // Fetch opportunities
  const fetchOpportunities = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('crm_opportunities')
      .select('*, company:crm_companies(*), contact:crm_contacts(*), stage:crm_pipeline_stages(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching opportunities:', error);
      return;
    }
    setOpportunities((data || []).map(o => ({ ...o, tags: o.tags || [] })) as Opportunity[]);
  }, [user]);

  // Fetch activities
  const fetchActivities = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('crm_activities')
      .select('*')
      .eq('user_id', user.id)
      .order('activity_date', { ascending: false })
      .limit(100);
    
    if (error) {
      console.error('Error fetching activities:', error);
      return;
    }
    setActivities(data as Activity[]);
  }, [user]);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('crm_tasks')
      .select('*, company:crm_companies(*), contact:crm_contacts(*), opportunity:crm_opportunities(*)')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching tasks:', error);
      return;
    }
    setTasks(data as Task[]);
  }, [user]);

  // Calculate stats
  const calculateStats = useCallback(() => {
    const now = new Date();
    setStats({
      totalContacts: contacts.length,
      totalCompanies: companies.length,
      totalOpportunities: opportunities.length,
      totalValue: opportunities.reduce((sum, o) => sum + (o.value || 0), 0),
      wonValue: opportunities.filter(o => o.status === 'won').reduce((sum, o) => sum + (o.value || 0), 0),
      lostValue: opportunities.filter(o => o.status === 'lost').reduce((sum, o) => sum + (o.value || 0), 0),
      openValue: opportunities.filter(o => o.status === 'open').reduce((sum, o) => sum + (o.value || 0), 0),
      tasksOverdue: tasks.filter(t => t.due_date && new Date(t.due_date) < now && t.status !== 'completed').length,
      tasksPending: tasks.filter(t => t.status === 'pending').length,
    });
  }, [contacts, companies, opportunities, tasks]);

  // Initial fetch
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchStages(),
        fetchCompanies(),
        fetchContacts(),
        fetchOpportunities(),
        fetchActivities(),
        fetchTasks(),
      ]);
      setLoading(false);
    };
    
    fetchAll();
  }, [user, fetchStages, fetchCompanies, fetchContacts, fetchOpportunities, fetchActivities, fetchTasks]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  // CRUD Operations - Companies
  const createCompany = async (data: Partial<Company>) => {
    if (!user) return null;
    const insertData = { name: data.name || '', user_id: user.id, industry: data.industry, website: data.website, phone: data.phone, email: data.email, address: data.address, city: data.city, country: data.country, employees_count: data.employees_count, annual_revenue: data.annual_revenue, description: data.description, tags: data.tags || [] };
    const { data: created, error } = await supabase
      .from('crm_companies')
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de créer l\'entreprise', variant: 'destructive' });
      return null;
    }
    
    setCompanies(prev => [{ ...created, tags: created.tags || [] } as Company, ...prev]);
    toast({ title: 'Succès', description: 'Entreprise créée' });
    return created;
  };

  const updateCompany = async (id: string, data: Partial<Company>) => {
    const updateData = { name: data.name, industry: data.industry, website: data.website, phone: data.phone, email: data.email, address: data.address, city: data.city, country: data.country, employees_count: data.employees_count, annual_revenue: data.annual_revenue, description: data.description, updated_at: new Date().toISOString() };
    const { error } = await supabase
      .from('crm_companies')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de modifier l\'entreprise', variant: 'destructive' });
      return false;
    }
    
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...data } as Company : c));
    toast({ title: 'Succès', description: 'Entreprise mise à jour' });
    return true;
  };

  const deleteCompany = async (id: string) => {
    const { error } = await supabase.from('crm_companies').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer l\'entreprise', variant: 'destructive' });
      return false;
    }
    setCompanies(prev => prev.filter(c => c.id !== id));
    toast({ title: 'Succès', description: 'Entreprise supprimée' });
    return true;
  };

  // CRUD Operations - Contacts
  const createContact = async (data: Partial<Contact>) => {
    if (!user) return null;
    const insertData = { first_name: data.first_name || '', last_name: data.last_name || '', user_id: user.id, company_id: data.company_id, email: data.email, phone: data.phone, job_title: data.job_title, department: data.department, notes: data.notes, tags: data.tags || [] };
    const { data: created, error } = await supabase
      .from('crm_contacts')
      .insert(insertData)
      .select('*, company:crm_companies(*)')
      .single();
    
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de créer le contact', variant: 'destructive' });
      return null;
    }
    
    setContacts(prev => [{ ...created, tags: created.tags || [] } as Contact, ...prev]);
    toast({ title: 'Succès', description: 'Contact créé' });
    return created;
  };

  const updateContact = async (id: string, data: Partial<Contact>) => {
    const updateData = { first_name: data.first_name, last_name: data.last_name, company_id: data.company_id, email: data.email, phone: data.phone, job_title: data.job_title, notes: data.notes, updated_at: new Date().toISOString() };
    const { error } = await supabase
      .from('crm_contacts')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de modifier le contact', variant: 'destructive' });
      return false;
    }
    
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...data } as Contact : c));
    toast({ title: 'Succès', description: 'Contact mis à jour' });
    return true;
  };

  const deleteContact = async (id: string) => {
    const { error } = await supabase.from('crm_contacts').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer le contact', variant: 'destructive' });
      return false;
    }
    setContacts(prev => prev.filter(c => c.id !== id));
    toast({ title: 'Succès', description: 'Contact supprimé' });
    return true;
  };

  // CRUD Operations - Opportunities
  const createOpportunity = async (data: Partial<Opportunity>) => {
    if (!user) return null;
    const insertData = { name: data.name || '', user_id: user.id, company_id: data.company_id, contact_id: data.contact_id, stage_id: data.stage_id, value: data.value || 0, probability: data.probability || 0, expected_close_date: data.expected_close_date, description: data.description, tags: data.tags || [] };
    const { data: created, error } = await supabase
      .from('crm_opportunities')
      .insert(insertData)
      .select('*, company:crm_companies(*), contact:crm_contacts(*), stage:crm_pipeline_stages(*)')
      .single();
    
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de créer l\'opportunité', variant: 'destructive' });
      return null;
    }
    
    setOpportunities(prev => [{ ...created, tags: created.tags || [] } as Opportunity, ...prev]);
    toast({ title: 'Succès', description: 'Opportunité créée' });
    return created;
  };

  const updateOpportunity = async (id: string, data: Partial<Opportunity>) => {
    const updateData = { name: data.name, company_id: data.company_id, contact_id: data.contact_id, stage_id: data.stage_id, value: data.value, probability: data.probability, expected_close_date: data.expected_close_date, actual_close_date: data.actual_close_date, status: data.status, description: data.description, updated_at: new Date().toISOString() };
    const { error } = await supabase
      .from('crm_opportunities')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de modifier l\'opportunité', variant: 'destructive' });
      return false;
    }
    
    await fetchOpportunities();
    toast({ title: 'Succès', description: 'Opportunité mise à jour' });
    return true;
  };

  const deleteOpportunity = async (id: string) => {
    const { error } = await supabase.from('crm_opportunities').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer l\'opportunité', variant: 'destructive' });
      return false;
    }
    setOpportunities(prev => prev.filter(o => o.id !== id));
    toast({ title: 'Succès', description: 'Opportunité supprimée' });
    return true;
  };

  const moveOpportunityStage = async (opportunityId: string, stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    const { error } = await supabase
      .from('crm_opportunities')
      .update({ 
        stage_id: stageId, 
        probability: stage?.probability || 0,
        updated_at: new Date().toISOString() 
      })
      .eq('id', opportunityId);
    
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de déplacer l\'opportunité', variant: 'destructive' });
      return false;
    }
    
    await fetchOpportunities();
    return true;
  };

  // CRUD Operations - Activities
  const createActivity = async (data: Partial<Activity>) => {
    if (!user) return null;
    const insertData = { activity_type: data.activity_type || 'note', subject: data.subject || '', user_id: user.id, company_id: data.company_id, contact_id: data.contact_id, opportunity_id: data.opportunity_id, description: data.description };
    const { data: created, error } = await supabase
      .from('crm_activities')
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de créer l\'activité', variant: 'destructive' });
      return null;
    }
    
    setActivities(prev => [created as Activity, ...prev]);
    return created;
  };

  // CRUD Operations - Tasks
  const createTask = async (data: Partial<Task>) => {
    if (!user) return null;
    const insertData = { title: data.title || '', user_id: user.id, description: data.description, priority: data.priority || 'medium', due_date: data.due_date, company_id: data.company_id, contact_id: data.contact_id, opportunity_id: data.opportunity_id };
    const { data: created, error } = await supabase
      .from('crm_tasks')
      .insert(insertData)
      .select('*, company:crm_companies(*), contact:crm_contacts(*), opportunity:crm_opportunities(*)')
      .single();
    
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de créer la tâche', variant: 'destructive' });
      return null;
    }
    
    setTasks(prev => [created as Task, ...prev]);
    toast({ title: 'Succès', description: 'Tâche créée' });
    return created;
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    const { error } = await supabase
      .from('crm_tasks')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de modifier la tâche', variant: 'destructive' });
      return false;
    }
    
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } as Task : t));
    return true;
  };

  const completeTask = async (id: string) => {
    return updateTask(id, { status: 'completed', completed_at: new Date().toISOString() });
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('crm_tasks').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer la tâche', variant: 'destructive' });
      return false;
    }
    setTasks(prev => prev.filter(t => t.id !== id));
    toast({ title: 'Succès', description: 'Tâche supprimée' });
    return true;
  };

  // Refresh functions
  const refreshAll = async () => {
    await Promise.all([
      fetchStages(),
      fetchCompanies(),
      fetchContacts(),
      fetchOpportunities(),
      fetchActivities(),
      fetchTasks(),
    ]);
  };

  return {
    // Data
    stages,
    companies,
    contacts,
    opportunities,
    activities,
    tasks,
    stats,
    loading,
    
    // Companies
    createCompany,
    updateCompany,
    deleteCompany,
    
    // Contacts
    createContact,
    updateContact,
    deleteContact,
    
    // Opportunities
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    moveOpportunityStage,
    
    // Activities
    createActivity,
    
    // Tasks
    createTask,
    updateTask,
    completeTask,
    deleteTask,
    
    // Refresh
    refreshAll,
    fetchStages,
    fetchCompanies,
    fetchContacts,
    fetchOpportunities,
    fetchActivities,
    fetchTasks,
  };
}
