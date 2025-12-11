import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export interface Employee {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  job_title: string;
  department: string | null;
  contract_type: string | null;
  hire_date: string | null;
  salary_current: number | null;
  is_active: boolean;
  left_date: string | null;
  left_reason: string | null;
  left_details: string | null;
  performance_metrics: any;
  candidate_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CareerEvent {
  id: string;
  user_id: string;
  employee_id: string;
  event_type: string;
  event_date: string;
  description: string | null;
  old_salary: number | null;
  new_salary: number | null;
  salary_change_percent: number | null;
  bonus_amount: number | null;
  bonus_reason: string | null;
  old_title: string | null;
  new_title: string | null;
  warning_type: string | null;
  warning_severity: string | null;
  created_at: string;
}

export interface HRDispute {
  id: string;
  user_id: string;
  employee_id: string;
  title: string;
  description: string | null;
  dispute_type: string;
  severity: string;
  status: string;
  involved_parties: any;
  resolution: string | null;
  resolution_date: string | null;
  resolved_by: string | null;
  documents: any;
  timeline: any;
  created_at: string;
  updated_at: string;
}

export function useEmployees() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch employees
  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['employees', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });
      if (error) throw error;
      return data as Employee[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Fetch career events
  const { data: careerEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['career_events', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('employee_career_events')
        .select('*')
        .eq('user_id', user.id)
        .order('event_date', { ascending: false });
      if (error) throw error;
      return data as CareerEvent[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Fetch disputes
  const { data: disputes = [], isLoading: disputesLoading } = useQuery({
    queryKey: ['hr_disputes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('hr_disputes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as HRDispute[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const loading = employeesLoading || eventsLoading || disputesLoading;

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['employees', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['career_events', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['hr_disputes', user?.id] });
  }, [queryClient, user?.id]);

  // Employee CRUD
  const createEmployee = async (data: Partial<Employee>): Promise<Employee | null> => {
    if (!user) return null;
    try {
      const { data: employee, error } = await supabase
        .from('employees')
        .insert({
          user_id: user.id,
          name: data.name!,
          email: data.email,
          phone: data.phone,
          job_title: data.job_title!,
          department: data.department,
          contract_type: data.contract_type || 'CDI',
          hire_date: data.hire_date,
          salary_current: data.salary_current,
          candidate_id: data.candidate_id,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      invalidateAll();
      toast({ title: 'Succès', description: 'Employé ajouté' });
      return employee;
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
      return null;
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>): Promise<boolean> => {
    if (!user) return false;
    try {
      const { error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      invalidateAll();
      toast({ title: 'Succès', description: 'Employé mis à jour' });
      return true;
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  const deleteEmployee = async (id: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      invalidateAll();
      toast({ title: 'Succès', description: 'Employé supprimé' });
      return true;
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  // Departure management
  const terminateEmployee = async (
    id: string, 
    leftReason: string, 
    leftDate: string, 
    leftDetails?: string
  ): Promise<boolean> => {
    if (!user) return false;
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          is_active: false,
          left_date: leftDate,
          left_reason: leftReason,
          left_details: leftDetails,
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      invalidateAll();
      
      const reasonLabels: Record<string, string> = {
        resignation: 'Démission',
        termination: 'Licenciement',
        layoff: 'Licenciement économique',
        end_contract: 'Fin de contrat',
        retirement: 'Retraite',
        mutual: 'Rupture conventionnelle',
      };
      
      toast({ title: 'Succès', description: `Départ enregistré: ${reasonLabels[leftReason] || leftReason}` });
      return true;
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  // Career events
  const addCareerEvent = async (data: Partial<CareerEvent>): Promise<CareerEvent | null> => {
    if (!user) return null;
    try {
      // Calculate salary change percent if applicable
      let salaryChangePercent = null;
      if (data.old_salary && data.new_salary) {
        salaryChangePercent = ((data.new_salary - data.old_salary) / data.old_salary) * 100;
      }

      const { data: event, error } = await supabase
        .from('employee_career_events')
        .insert({
          user_id: user.id,
          employee_id: data.employee_id!,
          event_type: data.event_type!,
          event_date: data.event_date!,
          description: data.description,
          old_salary: data.old_salary,
          new_salary: data.new_salary,
          salary_change_percent: salaryChangePercent,
          bonus_amount: data.bonus_amount,
          bonus_reason: data.bonus_reason,
          old_title: data.old_title,
          new_title: data.new_title,
          warning_type: data.warning_type,
          warning_severity: data.warning_severity,
        })
        .select()
        .single();

      if (error) throw error;

      // Update employee salary if it's a raise
      if (data.event_type === 'raise' && data.new_salary) {
        await supabase
          .from('employees')
          .update({ salary_current: data.new_salary })
          .eq('id', data.employee_id!);
      }

      // Update employee title if it's a promotion
      if (data.event_type === 'promotion' && data.new_title) {
        await supabase
          .from('employees')
          .update({ job_title: data.new_title })
          .eq('id', data.employee_id!);
      }

      invalidateAll();
      toast({ title: 'Succès', description: 'Événement ajouté' });
      return event;
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
      return null;
    }
  };

  // Disputes
  const createDispute = async (data: Partial<HRDispute>): Promise<HRDispute | null> => {
    if (!user) return null;
    try {
      const { data: dispute, error } = await supabase
        .from('hr_disputes')
        .insert({
          user_id: user.id,
          employee_id: data.employee_id!,
          title: data.title!,
          description: data.description,
          dispute_type: data.dispute_type!,
          severity: data.severity || 'medium',
          status: 'open',
          timeline: [{ date: new Date().toISOString(), action: 'Litige créé', by: 'Système' }],
        })
        .select()
        .single();

      if (error) throw error;
      invalidateAll();
      toast({ title: 'Succès', description: 'Litige créé' });
      return dispute;
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
      return null;
    }
  };

  const updateDispute = async (id: string, updates: Partial<HRDispute>): Promise<boolean> => {
    if (!user) return false;
    try {
      const { error } = await supabase
        .from('hr_disputes')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      invalidateAll();
      toast({ title: 'Succès', description: 'Litige mis à jour' });
      return true;
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  const resolveDispute = async (id: string, resolution: string, resolvedBy: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const dispute = disputes.find(d => d.id === id);
      const timeline = Array.isArray(dispute?.timeline) ? dispute.timeline : [];
      
      const { error } = await supabase
        .from('hr_disputes')
        .update({
          status: 'resolved',
          resolution,
          resolution_date: new Date().toISOString().split('T')[0],
          resolved_by: resolvedBy,
          timeline: [...timeline, { date: new Date().toISOString(), action: 'Litige résolu', by: resolvedBy }],
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      invalidateAll();
      toast({ title: 'Succès', description: 'Litige résolu' });
      return true;
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  // Convert candidate to employee
  const convertCandidateToEmployee = async (
    candidateId: string,
    employeeData: Partial<Employee>
  ): Promise<Employee | null> => {
    if (!user) return null;
    try {
      // Create employee
      const employee = await createEmployee({
        ...employeeData,
        candidate_id: candidateId,
      });

      if (!employee) return null;

      // Update candidate status
      await supabase
        .from('candidates')
        .update({ status: 'hired' })
        .eq('id', candidateId)
        .eq('user_id', user.id);

      queryClient.invalidateQueries({ queryKey: ['candidates', user.id] });
      
      toast({ title: 'Succès', description: 'Candidat converti en employé' });
      return employee;
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
      return null;
    }
  };

  // Stats
  const activeEmployees = employees.filter(e => e.is_active);
  const inactiveEmployees = employees.filter(e => !e.is_active);
  const salespeople = activeEmployees.filter(e => 
    e.department?.toLowerCase().includes('vente') || 
    e.department?.toLowerCase().includes('commercial') ||
    e.job_title?.toLowerCase().includes('commercial')
  );
  const openDisputes = disputes.filter(d => d.status === 'open' || d.status === 'investigating');

  return {
    employees,
    activeEmployees,
    inactiveEmployees,
    salespeople,
    careerEvents,
    disputes,
    openDisputes,
    loading,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    terminateEmployee,
    addCareerEvent,
    createDispute,
    updateDispute,
    resolveDispute,
    convertCandidateToEmployee,
    invalidateAll,
  };
}
