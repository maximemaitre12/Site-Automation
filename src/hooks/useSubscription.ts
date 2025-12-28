import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface StripeSubscription {
  subscribed: boolean;
  trial: boolean;
  trial_end: string | null;
  product_id: string | null;
  subscription_end: string | null;
  status: string | null;
}

export function useSubscription() {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<StripeSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSubscription = useCallback(async () => {
    if (!user || !session) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        setSubscription(null);
      } else {
        setSubscription(data);
      }
    } catch (err) {
      console.error('Failed to check subscription:', err);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, [user, session]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Auto-refresh every minute
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  const hasActiveSubscription = subscription?.subscribed === true;
  const isTrial = subscription?.trial === true;

  return {
    subscription,
    loading,
    hasActiveSubscription,
    isTrial,
    checkSubscription,
  };
}
