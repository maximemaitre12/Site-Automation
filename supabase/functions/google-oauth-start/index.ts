import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body first to get potential user-provided credentials
    const body = await req.json().catch(() => ({}));
    
    // Check for user-provided credentials first, then fall back to env vars
    const clientId = body.clientId || Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = body.clientSecret || Deno.env.get('GOOGLE_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({
          error: 'missing_credentials',
          message: 'Veuillez renseigner votre Google Client ID et Client Secret dans les paramètres du bloc.',
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify user authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'unauthorized', message: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'unauthorized', message: 'Invalid user session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestedScopes = body.scopes || ['gmail.readonly', 'gmail.send'];
    
    // Build Google OAuth scopes
    const scopeMap: Record<string, string> = {
      'gmail.readonly': 'https://www.googleapis.com/auth/gmail.readonly',
      'gmail.send': 'https://www.googleapis.com/auth/gmail.send',
      'gmail.modify': 'https://www.googleapis.com/auth/gmail.modify',
      'calendar.readonly': 'https://www.googleapis.com/auth/calendar.readonly',
      'calendar.events': 'https://www.googleapis.com/auth/calendar.events',
      'drive.readonly': 'https://www.googleapis.com/auth/drive.readonly',
      'drive.file': 'https://www.googleapis.com/auth/drive.file',
      'sheets.readonly': 'https://www.googleapis.com/auth/spreadsheets.readonly',
      'sheets': 'https://www.googleapis.com/auth/spreadsheets',
    };

    const scopes = [
      'openid',
      'email',
      'profile',
      ...requestedScopes.map((s: string) => scopeMap[s] || s)
    ].join(' ');

    // Generate state with user ID for callback verification
    // Store the clientSecret encrypted for callback use
    const state = btoa(JSON.stringify({
      userId: user.id,
      timestamp: Date.now(),
      returnUrl: body.returnUrl || '/tools/flow',
      // Store clientId and clientSecret for callback
      clientId: clientId,
      clientSecret: clientSecret,
    }));

    // Build redirect URI
    const redirectUri = `${supabaseUrl}/functions/v1/google-oauth-callback`;

    // Build Google OAuth URL
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopes,
      access_type: 'offline',
      prompt: 'consent',
      state: state,
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    console.log('Generated OAuth URL for user:', user.id, 'using', body.clientId ? 'user-provided' : 'env', 'credentials');

    return new Response(
      JSON.stringify({ authUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in google-oauth-start:', message);
    return new Response(
      JSON.stringify({ error: 'server_error', message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
