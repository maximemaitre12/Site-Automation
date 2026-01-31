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
    if (!authHeader) {
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

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get request body
    const { query, maxResults = 20 } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'missing_query', message: 'Search query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Gmail search for user ${user.id}: "${query}"`);

    // Get user's Google OAuth tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('user_oauth_tokens')
      .select('access_token, refresh_token, expires_at, client_id, client_secret')
      .eq('user_id', user.id)
      .eq('provider', 'google')
      .single();

    if (tokenError || !tokenData) {
      console.log('No Google OAuth tokens found for user');
      return new Response(
        JSON.stringify({ error: 'not_connected', message: 'No Google account connected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let accessToken = tokenData.access_token;

    // Check if token is expired and refresh if needed
    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt < new Date()) {
      console.log('Token expired, refreshing...');
      
      // Get client credentials
      const clientId = tokenData.client_id || Deno.env.get('GOOGLE_CLIENT_ID');
      const clientSecret = tokenData.client_secret || Deno.env.get('GOOGLE_CLIENT_SECRET');

      if (!clientId || !clientSecret) {
        return new Response(
          JSON.stringify({ error: 'missing_credentials', message: 'OAuth credentials not available' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Refresh the token
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: tokenData.refresh_token,
          grant_type: 'refresh_token',
        }),
      });

      if (!refreshResponse.ok) {
        const errorText = await refreshResponse.text();
        console.error('Token refresh failed:', errorText);
        return new Response(
          JSON.stringify({ error: 'token_refresh_failed', message: 'Failed to refresh Google token' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const refreshData = await refreshResponse.json();
      accessToken = refreshData.access_token;

      // Update stored tokens
      const newExpiresAt = new Date(Date.now() + (refreshData.expires_in * 1000)).toISOString();
      await supabase
        .from('user_oauth_tokens')
        .update({
          access_token: refreshData.access_token,
          expires_at: newExpiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('provider', 'google');

      console.log('Token refreshed successfully');
    }

    // Search Gmail using the Gmail API
    const searchParams = new URLSearchParams({
      q: query,
      maxResults: maxResults.toString(),
    });

    const listResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?${searchParams}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.error('Gmail API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'gmail_api_error', message: 'Failed to search Gmail' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const listData = await listResponse.json();
    const messages = listData.messages || [];

    console.log(`Found ${messages.length} messages`);

    // Fetch details for each message (limited to avoid rate limits)
    const emailDetails = await Promise.all(
      messages.slice(0, 10).map(async (msg: { id: string }) => {
        const detailResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!detailResponse.ok) {
          return null;
        }

        const detail = await detailResponse.json();
        const headers = detail.payload?.headers || [];
        
        const getHeader = (name: string) => 
          headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === name.toLowerCase())?.value;

        return {
          id: detail.id,
          threadId: detail.threadId,
          from: getHeader('From'),
          subject: getHeader('Subject'),
          date: getHeader('Date'),
          snippet: detail.snippet,
          hasAttachments: detail.payload?.parts?.some((p: any) => p.filename) || false,
        };
      })
    );

    const validEmails = emailDetails.filter(Boolean);

    return new Response(
      JSON.stringify({
        emails: validEmails,
        total: messages.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in gmail-search:', message);
    return new Response(
      JSON.stringify({ error: 'server_error', message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
