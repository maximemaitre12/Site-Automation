import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCompany } from '@/hooks/useCompany';

export type AuditAction = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'view' 
  | 'export' 
  | 'login' 
  | 'logout' 
  | 'invite' 
  | 'role_change'
  | 'settings_change'
  | 'workflow_run'
  | 'ai_call';

export type ResourceType = 
  | 'document' 
  | 'workflow' 
  | 'invoice' 
  | 'candidate' 
  | 'ticket' 
  | 'dataset'
  | 'proposal'
  | 'audit'
  | 'template'
  | 'conversation'
  | 'user'
  | 'company'
  | 'settings';

export interface AuditLogEntry {
  id: string;
  company_id: string;
  user_id: string;
  action: AuditAction;
  resource_type: ResourceType;
  resource_id: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export function useAuditLog() {
  const { user } = useAuth();
  const { company } = useCompany();

  // Log an action
  const logAction = useCallback(async (
    action: AuditAction,
    resourceType: ResourceType,
    resourceId?: string,
    metadata?: Record<string, any>
  ): Promise<void> => {
    if (!user || !company) return;

    try {
      await supabase.from('audit_logs').insert([{
        company_id: company.id,
        user_id: user.id,
        action,
        resource_type: resourceType,
        resource_id: resourceId || null,
        metadata: (metadata || {}) as any,
        user_agent: navigator.userAgent,
      }]);
    } catch (error) {
      console.error('Failed to log audit action:', error);
    }
  }, [user, company]);

  // Get audit logs for company (admin only)
  const getAuditLogs = useCallback(async (
    options?: {
      limit?: number;
      offset?: number;
      action?: AuditAction;
      resourceType?: ResourceType;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<AuditLogEntry[]> => {
    if (!company) return [];

    let query = supabase
      .from('audit_logs')
      .select('*')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false });

    if (options?.action) {
      query = query.eq('action', options.action);
    }

    if (options?.resourceType) {
      query = query.eq('resource_type', options.resourceType);
    }

    if (options?.startDate) {
      query = query.gte('created_at', options.startDate.toISOString());
    }

    if (options?.endDate) {
      query = query.lte('created_at', options.endDate.toISOString());
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }

    return data as AuditLogEntry[];
  }, [company]);

  return {
    logAction,
    getAuditLogs,
  };
}
