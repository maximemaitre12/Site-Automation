import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export type AppRole = 'owner' | 'admin' | 'manager' | 'editor' | 'viewer';

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string;
  created_at: string;
  updated_at: string;
  settings: Record<string, any>;
  subscription_tier: string;
  max_users: number;
  max_storage_mb: number;
}

export interface UserRole {
  id: string;
  user_id: string;
  company_id: string;
  role: AppRole;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  user_id: string;
  role: AppRole;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

const ROLE_LEVELS: Record<AppRole, number> = {
  owner: 5,
  admin: 4,
  manager: 3,
  editor: 2,
  viewer: 1,
};

export function useCompany() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [company, setCompany] = useState<Company | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanyData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setCompany(null);
      setUserRole(null);
      return;
    }

    try {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (roleError) {
        console.error('Error fetching role:', roleError);
        setLoading(false);
        return;
      }

      if (!roleData) {
        setLoading(false);
        return;
      }

      setUserRole(roleData as UserRole);

      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', roleData.company_id)
        .maybeSingle();

      if (companyError) {
        console.error('Error fetching company:', companyError);
        setLoading(false);
        return;
      }

      if (companyData) {
        setCompany(companyData as Company);
      }
    } catch (error) {
      console.error('Error in fetchCompanyData:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  const fetchTeamMembers = useCallback(async () => {
    if (!company) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role,
          created_at,
          profiles!inner(full_name, avatar_url)
        `)
        .eq('company_id', company.id);

      if (error) {
        console.error('Error fetching team:', error);
        return;
      }

      const members: TeamMember[] = (data || []).map((member: any) => ({
        id: member.id,
        user_id: member.user_id,
        role: member.role as AppRole,
        full_name: member.profiles?.full_name,
        avatar_url: member.profiles?.avatar_url,
        created_at: member.created_at,
      }));

      setTeamMembers(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  }, [company]);

  useEffect(() => {
    if (company) {
      fetchTeamMembers();
    }
  }, [company, fetchTeamMembers]);

  const hasMinRole = useCallback((minRole: AppRole): boolean => {
    if (!userRole) return false;
    return ROLE_LEVELS[userRole.role] >= ROLE_LEVELS[minRole];
  }, [userRole]);

  const createCompany = async (name: string, slug: string): Promise<Company | null> => {
    if (!user) return null;

    try {
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({ name, slug })
        .select()
        .single();

      if (companyError) {
        toast({ title: 'Error', description: companyError.message, variant: 'destructive' });
        return null;
      }

      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          company_id: companyData.id,
          role: 'owner',
        });

      if (roleError) {
        toast({ title: 'Error', description: roleError.message, variant: 'destructive' });
        return null;
      }

      await supabase
        .from('profiles')
        .update({ company_id: companyData.id })
        .eq('user_id', user.id);

      setCompany(companyData as Company);
      toast({ title: 'Success', description: 'Company created successfully' });
      
      await fetchCompanyData();
      
      return companyData as Company;
    } catch (error) {
      console.error('Error creating company:', error);
      toast({ title: 'Error', description: 'Failed to create company', variant: 'destructive' });
      return null;
    }
  };

  const updateCompany = async (updates: Partial<Pick<Company, 'name' | 'slug' | 'logo_url' | 'primary_color'>>): Promise<boolean> => {
    if (!company || !hasMinRole('admin')) {
      toast({ title: 'Error', description: 'Insufficient permissions', variant: 'destructive' });
      return false;
    }

    try {
      const { error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', company.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return false;
      }

      setCompany({ ...company, ...updates } as Company);
      toast({ title: 'Success', description: 'Company updated' });
      return true;
    } catch (error) {
      console.error('Error updating company:', error);
      return false;
    }
  };

  const inviteTeamMember = async (email: string, role: AppRole): Promise<boolean> => {
    if (!company || !hasMinRole('admin')) {
      toast({ title: 'Error', description: 'Insufficient permissions', variant: 'destructive' });
      return false;
    }

    toast({ title: 'Info', description: 'Invitation system coming soon' });
    return false;
  };

  const updateMemberRole = async (memberId: string, newRole: AppRole): Promise<boolean> => {
    if (!hasMinRole('admin')) {
      toast({ title: 'Error', description: 'Insufficient permissions', variant: 'destructive' });
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return false;
      }

      await fetchTeamMembers();
      toast({ title: 'Success', description: 'Role updated' });
      return true;
    } catch (error) {
      console.error('Error updating role:', error);
      return false;
    }
  };

  const removeTeamMember = async (memberId: string): Promise<boolean> => {
    if (!hasMinRole('admin')) {
      toast({ title: 'Error', description: 'Insufficient permissions', variant: 'destructive' });
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', memberId);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return false;
      }

      await fetchTeamMembers();
      toast({ title: 'Success', description: 'Member removed' });
      return true;
    } catch (error) {
      console.error('Error removing member:', error);
      return false;
    }
  };

  return {
    company,
    userRole,
    teamMembers,
    loading,
    hasMinRole,
    createCompany,
    updateCompany,
    inviteTeamMember,
    updateMemberRole,
    removeTeamMember,
    refreshCompany: fetchCompanyData,
    refreshTeam: fetchTeamMembers,
  };
}
