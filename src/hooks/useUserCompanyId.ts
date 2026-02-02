import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook to get the current user's company ID
 * This is used for multi-tenant data isolation
 */
export function useUserCompanyId() {
  const { user } = useAuth();

  const { data: companyId, isLoading } = useQuery({
    queryKey: ['user-company-id', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching company ID:', error);
        return null;
      }

      return data?.company_id || null;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    companyId: companyId || null,
    loading: isLoading,
  };
}
