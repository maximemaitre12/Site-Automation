import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Check for existing session first (synchronous from storage)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      setInitialized(true);
    });

    // Then set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (initialized) {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [initialized]);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/select-plan`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    return { error: error as Error | null };
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Protected route wrapper - shows loading spinner only briefly
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show minimal loading only during initial auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return user ? <>{children}</> : null;
}

// Protected route that also requires an active subscription
export function RequireSubscription({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const {
    data: subscriptionStatus,
    isLoading: subscriptionLoading,
    isError: subscriptionError,
    refetch,
  } = useQuery({
    queryKey: ['subscription-status', user?.id],
    enabled: !!user && !loading,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) throw error;
      return (data?.status as string | null) ?? null;
    },
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  const hasSubscription =
    subscriptionStatus === 'active' || subscriptionStatus === 'trial';

  useEffect(() => {
    if (!loading && user && !subscriptionLoading && !subscriptionError && !hasSubscription) {
      if (location.pathname !== '/select-plan') {
        navigate('/select-plan');
      }
    }
  }, [loading, user, subscriptionLoading, subscriptionError, hasSubscription, navigate, location.pathname]);

  if (loading || (user && subscriptionLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  if (subscriptionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-card-foreground">
          <h2 className="text-lg font-semibold">Vérification d’abonnement impossible</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Un problème temporaire empêche de vérifier votre abonnement. Réessayez.
          </p>
          <div className="mt-4 flex gap-3">
            <Button onClick={() => refetch()} variant="default">Réessayer</Button>
            <Button onClick={() => navigate('/dashboard')} variant="outline">Aller au tableau de bord</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!hasSubscription && location.pathname !== '/select-plan') return null;

  return <>{children}</>;
}
