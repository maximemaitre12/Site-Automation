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
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
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

    const fromEmail = emailAccount?.email_address || user.email || 'noreply@aether.app';
    const fromName = senderName || emailAccount?.sender_name || 'Service RH';

    let emailSent = false;
    let sendError: string | null = null;

    // Try to send via Resend if API key is configured
    if (resendApiKey) {
      try {
        console.log('Attempting to send email via Resend...');
        
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `${fromName} <${fromEmail}>`,
            to: [to],
            subject: subject,
            html: bodyHtml,
            text: bodyText || bodyHtml?.replace(/<[^>]*>/g, ''),
            reply_to: replyToEmail || fromEmail,
          }),
        });

        const resendResult = await resendResponse.json();

        if (!resendResponse.ok) {
          console.error('Resend API error:', resendResult);
          sendError = resendResult.message || 'Erreur Resend';
        } else {
          console.log('Email sent successfully via Resend:', resendResult.id);
          emailSent = true;
        }
      } catch (resendError: any) {
        console.error('Error calling Resend:', resendError);
        sendError = resendError.message;
      }
    } else {
      console.log('No RESEND_API_KEY configured - email will be stored only');
      sendError = 'Envoi non configuré (clé Resend manquante)';
    }

    // Store the outbound email regardless of send status
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
        status: emailSent ? 'replied' : 'new',
        parent_email_id: parentEmailId,
        provider: resendApiKey ? 'resend' : 'manual',
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
      await supabase
        .from('candidates')
        .update({ 
          status: 'active',
          interview_notes: `Dernier contact: ${new Date().toLocaleDateString('fr-FR')}`
        })
        .eq('id', candidateId);
    }

    console.log(`Email processing complete. Sent: ${emailSent}, Stored ID: ${emailRecord.id}`);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailRecord.id,
      sent: emailSent,
      message: emailSent 
        ? 'Email envoyé et enregistré avec succès'
        : 'Email enregistré (envoi non effectué)',
      note: sendError || undefined,
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
