import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

/**
 * This page receives the OAuth callback from Google directly (not via Supabase).
 * It extracts the authorization code and sends it to our backend for token exchange.
 * This approach bypasses the "authorized domain" restriction on shared hosting domains.
 */
export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connexion à Google en cours...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth error from Google:', error);
        setStatus('error');
        setMessage(getErrorMessage(error));
        setTimeout(() => navigate('/tools/flow?oauth_error=' + error), 2000);
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage('Paramètres manquants dans la réponse Google.');
        setTimeout(() => navigate('/tools/flow?oauth_error=missing_params'), 2000);
        return;
      }

      try {
        // Send the code to our backend for token exchange
        const { data, error: exchangeError } = await supabase.functions.invoke('google-oauth-exchange', {
          body: { code, state }
        });

        if (exchangeError || data?.error) {
          console.error('Token exchange error:', exchangeError || data?.error);
          setStatus('error');
          setMessage(data?.message || 'Échec de l\'échange de tokens.');
          setTimeout(() => navigate('/tools/flow?oauth_error=token_exchange_failed'), 2000);
          return;
        }

        // Success!
        setStatus('success');
        setMessage('Compte Google connecté avec succès !');
        
        const returnUrl = data?.returnUrl || '/tools/flow';
        const email = data?.email ? `&email=${encodeURIComponent(data.email)}` : '';
        const target = `${returnUrl}${returnUrl.includes('?') ? '&' : '?'}oauth_success=google${email}`;

        // If returnUrl is absolute (e.g., preview URL), do a hard navigation.
        // Otherwise, use the SPA router.
        setTimeout(() => {
          if (/^https?:\/\//i.test(returnUrl)) {
            window.location.assign(target);
          } else {
            navigate(target);
          }
        }, 1500);

      } catch (err) {
        console.error('Callback error:', err);
        setStatus('error');
        setMessage('Erreur lors de la connexion.');
        setTimeout(() => navigate('/tools/flow?oauth_error=server_error'), 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-lg text-muted-foreground">{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
            <p className="text-lg text-green-600">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 mx-auto text-destructive" />
            <p className="text-lg text-destructive">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}

function getErrorMessage(error: string): string {
  const messages: Record<string, string> = {
    'access_denied': 'Accès refusé. Vous avez annulé la connexion.',
    'invalid_request': 'Requête invalide.',
    'unauthorized_client': 'Client non autorisé.',
    'unsupported_response_type': 'Type de réponse non supporté.',
    'invalid_scope': 'Scopes invalides.',
    'server_error': 'Erreur serveur Google.',
    'temporarily_unavailable': 'Service temporairement indisponible.',
  };
  return messages[error] || `Erreur: ${error}`;
}
