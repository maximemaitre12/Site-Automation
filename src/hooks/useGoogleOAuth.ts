import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OAuthStatus {
  configured: boolean;
  connected: boolean;
  expired: boolean;
  email: string | null;
  scope: string | null;
  lastUpdated: string | null;
}

export function useGoogleOAuth() {
  const [status, setStatus] = useState<OAuthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const checkStatus = useCallback(async () => {
    try {
      setChecking(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // No session = not logged in, just return disconnected state (not an error)
        setStatus({
          configured: false,
          connected: false,
          expired: false,
          email: null,
          scope: null,
          lastUpdated: null,
        });
        return;
      }

      const response = await supabase.functions.invoke('google-oauth-status');
      
      if (response.error) {
        // OAuth status check failed - this is NOT a blocking error
        // Just treat it as "not connected" so the UI shows the connect button
        console.warn('OAuth status check returned error (treating as disconnected):', response.error.message || response.error);
        setStatus({
          configured: true,
          connected: false,
          expired: false,
          email: null,
          scope: null,
          lastUpdated: null,
        });
        return;
      }

      setStatus(response.data);
    } catch (error) {
      // Network or unexpected errors - still not blocking, just show as disconnected
      console.warn('OAuth status check exception (treating as disconnected):', error);
      setStatus({
        configured: true,
        connected: false,
        expired: false,
        email: null,
        scope: null,
        lastUpdated: null,
      });
    } finally {
      setChecking(false);
    }
  }, []);

  const connect = useCallback(async (
    scopes: string[] = ['gmail.readonly', 'gmail.send'],
    clientCredentials?: { clientId: string; clientSecret: string }
  ) => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Vous devez être connecté pour lier votre compte Google');
        return;
      }

      // Build request body with optional user-provided credentials
      // NOTE: returnUrl is absolute so the callback page (which may run on another domain)
      // can reliably send the user back to the exact place they started.
      const requestBody: Record<string, any> = {
        scopes,
        returnUrl: `${window.location.origin}${window.location.pathname}`,
      };

      // If user provided their own credentials, pass them
      if (clientCredentials?.clientId && clientCredentials?.clientSecret) {
        requestBody.clientId = clientCredentials.clientId;
        requestBody.clientSecret = clientCredentials.clientSecret;
      }

      const response = await supabase.functions.invoke('google-oauth-start', {
        body: requestBody
      });

      if (response.error) {
        const errorData = response.error;
        if (errorData.message?.includes('missing_credentials')) {
          toast.error('Credentials manquants', {
            description: 'Veuillez renseigner votre Google Client ID et Client Secret dans les paramètres du bloc.',
            duration: 8000,
          });
        } else {
          toast.error('Erreur de connexion OAuth', {
            description: errorData.message || 'Une erreur est survenue',
          });
        }
        return;
      }

      if (response.data?.error === 'missing_credentials') {
        toast.error('Credentials manquants', {
          description: 'Renseignez votre Google Client ID et Client Secret dans les paramètres du bloc avant de vous connecter.',
          duration: 8000,
        });
        return;
      }

      if (response.data?.authUrl) {
        // Redirect to Google OAuth
        window.location.href = response.data.authUrl;
      } else {
        toast.error('Erreur inattendue', {
          description: 'Impossible de générer l\'URL d\'authentification',
        });
      }
    } catch (error) {
      console.error('Error starting OAuth:', error);
      toast.error('Erreur de connexion', {
        description: 'Impossible de démarrer le flux OAuth',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await supabase.functions.invoke('google-oauth-disconnect');
      
      if (response.error) {
        // Log but don't block - just update local state to disconnected
        console.warn('Disconnect returned error (updating local state anyway):', response.error.message || response.error);
      } else {
        toast.success('Compte Google déconnecté');
      }

      // Always update local state to disconnected
      setStatus(prev => prev ? { ...prev, connected: false, expired: false, email: null, scope: null } : {
        configured: true,
        connected: false,
        expired: false,
        email: null,
        scope: null,
        lastUpdated: null,
      });
    } catch (error) {
      // Network error - still update local state
      console.warn('Disconnect exception (updating local state anyway):', error);
      setStatus(prev => prev ? { ...prev, connected: false, expired: false, email: null, scope: null } : {
        configured: true,
        connected: false,
        expired: false,
        email: null,
        scope: null,
        lastUpdated: null,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Check for OAuth callback results in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthSuccess = params.get('oauth_success');
    const oauthError = params.get('oauth_error');
    const email = params.get('email');

    if (oauthSuccess === 'google') {
      toast.success('Compte Google connecté !', {
        description: email ? `Connecté en tant que ${email}` : undefined,
      });
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
      checkStatus();
    } else if (oauthError) {
      const errorMessages: Record<string, string> = {
        'access_denied': 'Accès refusé par l\'utilisateur',
        'missing_params': 'Paramètres manquants dans la réponse',
        'invalid_state': 'Session invalide, veuillez réessayer',
        'token_exchange_failed': 'Échec de l\'échange de tokens',
        'storage_failed': 'Échec de sauvegarde des tokens',
        'server_error': 'Erreur serveur',
      };
      toast.error('Échec de la connexion Google', {
        description: errorMessages[oauthError] || oauthError,
      });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [checkStatus]);

  // Initial status check
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return {
    status,
    loading,
    checking,
    connect,
    disconnect,
    refresh: checkStatus,
  };
}
