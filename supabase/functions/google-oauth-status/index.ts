import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify user authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Use getClaims for better JWT validation
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      console.error('Auth error:', claimsError?.message || 'No claims');
      return new Response(
        JSON.stringify({ error: 'unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;

    // No longer check for platform-level configuration since users provide their own credentials
    // configured is always true in this new model
    const isConfigured = true;

    // Check if user has connected their Google account
    const { data: tokenData, error: tokenError } = await supabase
      .from('user_oauth_tokens')
      .select('email, scope, expires_at, updated_at')
      .eq('user_id', userId)
      .eq('provider', 'google')
      .single();

    const isConnected = !tokenError && !!tokenData;
    const isExpired = tokenData?.expires_at 
      ? new Date(tokenData.expires_at) < new Date()
      : false;

    return new Response(
      JSON.stringify({
        configured: isConfigured,
        connected: isConnected,
        expired: isExpired,
        email: tokenData?.email || null,
        scope: tokenData?.scope || null,
        lastUpdated: tokenData?.updated_at || null,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in google-oauth-status:', message);
    return new Response(
      JSON.stringify({ error: 'server_error', message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
