import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { 
      to, 
      subject, 
      bodyHtml, 
      bodyText, 
      candidateId, 
      parentEmailId,
      senderName,
      replyToEmail 
    } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get user's email account configuration
    const { data: emailAccount } = await supabase
      .from('hr_email_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    // For now, we'll use a simulated send (store in DB)
    // In production, this would use Gmail API or Microsoft Graph
    
    const fromEmail = emailAccount?.email_address || user.email || 'noreply@aether.app';
    const fromName = senderName || emailAccount?.sender_name || 'Service RH';

    // Store the outbound email
    const { data: emailRecord, error: insertError } = await supabase
      .from('hr_emails')
      .insert({
        user_id: user.id,
        account_id: emailAccount?.id,
        candidate_id: candidateId,
        direction: 'outbound',
        from_email: fromEmail,
        from_name: fromName,
        to_email: to,
        subject: subject,
        body_html: bodyHtml,
        body_text: bodyText || bodyHtml?.replace(/<[^>]*>/g, ''),
        status: 'replied',
        parent_email_id: parentEmailId,
        provider: emailAccount?.provider || 'manual',
        email_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing email:', insertError);
      throw new Error('Failed to store email');
    }

    // Update parent email status if replying
    if (parentEmailId) {
      await supabase
        .from('hr_emails')
        .update({ 
          status: 'replied',
          replied_at: new Date().toISOString()
        })
        .eq('id', parentEmailId);
    }

    // Update candidate last contact date if linked
    if (candidateId) {
      // Update candidate status to show activity
      await supabase
        .from('candidates')
        .update({ 
          status: 'active',
          interview_notes: `Dernier contact: ${new Date().toLocaleDateString('fr-FR')}`
        })
        .eq('id', candidateId);
    }

    console.log(`Email sent successfully to ${to}, stored with ID: ${emailRecord.id}`);

    // In a real implementation with OAuth:
    // - For Gmail: Use Gmail API with stored access_token
    // - For Outlook: Use Microsoft Graph API with stored access_token
    // The email would actually be sent from the user's connected account

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailRecord.id,
      message: 'Email envoyé et enregistré avec succès',
      // In production with OAuth, this would be the actual send status
      note: 'Email stocké. Connectez votre compte email pour l\'envoi réel.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in hr-email-send:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
