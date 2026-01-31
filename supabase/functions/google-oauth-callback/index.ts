import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    // Parse base URL for redirects
    const baseUrl = Deno.env.get('SITE_URL') || 'https://aether-ai-company.lovable.app';

    if (error) {
      console.error('OAuth error from Google:', error);
      return Response.redirect(`${baseUrl}/tools/flow?oauth_error=${encodeURIComponent(error)}`, 302);
    }

    if (!code || !state) {
      console.error('Missing code or state');
      return Response.redirect(`${baseUrl}/tools/flow?oauth_error=missing_params`, 302);
    }

    // Decode and verify state
    let stateData;
    try {
      stateData = JSON.parse(atob(state));
    } catch {
      console.error('Invalid state format');
      return Response.redirect(`${baseUrl}/tools/flow?oauth_error=invalid_state`, 302);
    }

    const { userId, returnUrl, clientId: stateClientId, clientSecret: stateClientSecret } = stateData;
    if (!userId) {
      console.error('Missing userId in state');
      return Response.redirect(`${baseUrl}/tools/flow?oauth_error=invalid_state`, 302);
    }

    // Use credentials from state (user-provided) or fall back to env vars
    const clientId = stateClientId || Deno.env.get('GOOGLE_CLIENT_ID')!;
    const clientSecret = stateClientSecret || Deno.env.get('GOOGLE_CLIENT_SECRET')!;
    
    if (!clientId || !clientSecret) {
      console.error('Missing OAuth credentials');
      return Response.redirect(`${baseUrl}/tools/flow?oauth_error=missing_credentials`, 302);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const redirectUri = `${supabaseUrl}/functions/v1/google-oauth-callback`;

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return Response.redirect(`${baseUrl}/tools/flow?oauth_error=token_exchange_failed`, 302);
    }

    const tokens = await tokenResponse.json();
    console.log('Token exchange successful, scopes:', tokens.scope);

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    let email = null;
    if (userInfoResponse.ok) {
      const userInfo = await userInfoResponse.json();
      email = userInfo.email;
      console.log('Got user email:', email);
    }

    // Calculate token expiration
    const expiresAt = tokens.expires_in 
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null;

    // Store tokens in database using service role
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { error: upsertError } = await supabase
      .from('user_oauth_tokens')
      .upsert({
        user_id: userId,
        provider: 'google',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || null,
        token_type: tokens.token_type || 'Bearer',
        expires_at: expiresAt,
        scope: tokens.scope,
        email: email,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,provider'
      });

    if (upsertError) {
      console.error('Failed to store tokens:', upsertError);
      return Response.redirect(`${baseUrl}/tools/flow?oauth_error=storage_failed`, 302);
    }

    console.log('OAuth tokens stored successfully for user:', userId);

    // Redirect back to the app with success
    const redirectTo = returnUrl || '/tools/flow';
    return Response.redirect(`${baseUrl}${redirectTo}?oauth_success=google&email=${encodeURIComponent(email || '')}`, 302);

  } catch (error) {
    console.error('Error in google-oauth-callback:', error);
    const baseUrl = Deno.env.get('SITE_URL') || 'https://aether-ai-company.lovable.app';
    return Response.redirect(`${baseUrl}/tools/flow?oauth_error=server_error`, 302);
  }
});
