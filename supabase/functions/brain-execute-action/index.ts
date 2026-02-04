import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Supported action types
type ActionType = 
  | 'create_candidate' 
  | 'create_deal' 
  | 'create_document' 
  | 'create_ticket'
  | 'create_contact'
  | 'create_workflow'
  | 'update_candidate'
  | 'update_deal'
  | 'update_ticket'
  | 'delete_candidate'
  | 'delete_deal'
  | 'analyze_cv';

interface ActionRequest {
  action: ActionType;
  data: Record<string, any>;
  fileBase64?: string;
  fileName?: string;
  mimeType?: string;
}

interface ActionResult {
  success: boolean;
  action: ActionType;
  message: string;
  createdId?: string;
  data?: any;
}

// Parse CV using AI
async function parseCVWithAI(fileBase64: string, fileName: string, mimeType: string): Promise<{
  text: string;
  analysis: any;
} | null> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) return null;

  try {
    const dataUrl = `data:${mimeType};base64,${fileBase64}`;
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyse ce CV et extrais les informations en JSON strict:
{
  "name": "Nom complet",
  "email": "email@exemple.com ou null",
  "phone": "téléphone ou null",
  "experience_years": nombre ou null,
  "skills": ["compétence1", "compétence2"],
  "summary": "Résumé du profil en 2-3 phrases",
  "strengths": ["force1", "force2"],
  "education": "Formation principale",
  "current_position": "Poste actuel ou dernier poste"
}

Réponds UNIQUEMENT avec le JSON, sans explication.`
              },
              {
                type: 'image_url',
                image_url: { url: dataUrl }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI CV parse error:', response.status);
      return null;
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || '';
    
    // Extract JSON from response
    let analysis: any = {};
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse CV analysis JSON:', e);
      analysis = { summary: content };
    }

    return { text: content, analysis };
  } catch (error) {
    console.error('CV parsing error:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: authError } = await supabase.auth.getClaims(token);
    if (authError || !claims?.claims?.sub) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claims.claims.sub as string;

    // Get user's company
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('company_id')
      .eq('user_id', userId)
      .maybeSingle();
    
    const companyId = roleData?.company_id;

    const { action, data, fileBase64, fileName, mimeType } = await req.json() as ActionRequest;

    console.log(`Executing action: ${action} for user ${userId}`);

    let result: ActionResult;

    switch (action) {
      // ============ CREATE CANDIDATE ============
      case 'create_candidate': {
        let candidateData: any = {
          user_id: userId,
          company_id: companyId,
          name: data.name || 'Candidat sans nom',
          email: data.email || null,
          phone: data.phone || null,
          status: 'new',
          skills: data.skills || [],
          experience_years: data.experience_years || null,
          cv_text: data.cv_text || null,
          ai_analysis: data.ai_analysis || null,
        };

        // If CV file is provided, parse it
        if (fileBase64 && fileName && mimeType) {
          console.log(`Parsing CV: ${fileName}`);
          const cvResult = await parseCVWithAI(fileBase64, fileName, mimeType);
          
          if (cvResult?.analysis) {
            candidateData.name = cvResult.analysis.name || candidateData.name;
            candidateData.email = cvResult.analysis.email || candidateData.email;
            candidateData.phone = cvResult.analysis.phone || candidateData.phone;
            candidateData.skills = cvResult.analysis.skills || candidateData.skills;
            candidateData.experience_years = cvResult.analysis.experience_years || candidateData.experience_years;
            candidateData.cv_text = cvResult.text;
            candidateData.ai_analysis = cvResult.analysis;
          }
        }

        const { data: candidate, error } = await supabase
          .from('candidates')
          .insert(candidateData)
          .select()
          .single();

        if (error) {
          result = { success: false, action, message: `Erreur: ${error.message}` };
        } else {
          result = { 
            success: true, 
            action, 
            message: `Candidat "${candidate.name}" créé avec succès`,
            createdId: candidate.id,
            data: candidate
          };
        }
        break;
      }

      // ============ ANALYZE CV (without creating) ============
      case 'analyze_cv': {
        if (!fileBase64 || !fileName || !mimeType) {
          result = { success: false, action, message: 'Fichier CV requis' };
          break;
        }

        const cvResult = await parseCVWithAI(fileBase64, fileName, mimeType);
        if (!cvResult) {
          result = { success: false, action, message: 'Impossible d\'analyser le CV' };
        } else {
          result = {
            success: true,
            action,
            message: `CV de "${cvResult.analysis?.name || 'candidat'}" analysé`,
            data: cvResult.analysis
          };
        }
        break;
      }

      // ============ CREATE DEAL ============
      case 'create_deal': {
        const dealData = {
          user_id: userId,
          company_id: companyId,
          company_name: data.company_name || data.name || 'Entreprise',
          contact_name: data.contact_name || null,
          contact_email: data.contact_email || null,
          value: data.value || 0,
          status: data.status || 'lead',
          priority: data.priority || 'medium',
          source: data.source || 'brain',
          notes: data.notes || null,
        };

        const { data: deal, error } = await supabase
          .from('sales_deals')
          .insert(dealData)
          .select()
          .single();

        if (error) {
          result = { success: false, action, message: `Erreur: ${error.message}` };
        } else {
          result = { 
            success: true, 
            action, 
            message: `Deal "${deal.company_name}" créé (${deal.value}€)`,
            createdId: deal.id,
            data: deal
          };
        }
        break;
      }

      // ============ CREATE DOCUMENT ============
      case 'create_document': {
        const docData = {
          user_id: userId,
          company_id: companyId,
          title: data.title || 'Document sans titre',
          content: data.content || null,
          description: data.description || null,
          file_type: data.file_type || 'text',
          tags: data.tags || [],
          status: 'active',
        };

        const { data: doc, error } = await supabase
          .from('aether_documents')
          .insert(docData)
          .select()
          .single();

        if (error) {
          result = { success: false, action, message: `Erreur: ${error.message}` };
        } else {
          result = { 
            success: true, 
            action, 
            message: `Document "${doc.title}" créé`,
            createdId: doc.id,
            data: doc
          };
        }
        break;
      }

      // ============ CREATE TICKET ============
      case 'create_ticket': {
        const ticketData = {
          user_id: userId,
          company_id: companyId,
          title: data.title || 'Ticket sans titre',
          description: data.description || null,
          category: data.category || 'general',
          priority: data.priority || 'medium',
          status: 'open',
          customer_name: data.customer_name || null,
          customer_email: data.customer_email || null,
        };

        const { data: ticket, error } = await supabase
          .from('support_tickets')
          .insert(ticketData)
          .select()
          .single();

        if (error) {
          result = { success: false, action, message: `Erreur: ${error.message}` };
        } else {
          result = { 
            success: true, 
            action, 
            message: `Ticket "${ticket.title}" créé`,
            createdId: ticket.id,
            data: ticket
          };
        }
        break;
      }

      // ============ CREATE CONTACT ============
      case 'create_contact': {
        const contactData = {
          user_id: userId,
          first_name: data.first_name || data.name?.split(' ')[0] || 'Contact',
          last_name: data.last_name || data.name?.split(' ').slice(1).join(' ') || '',
          email: data.email || null,
          phone: data.phone || null,
          job_title: data.job_title || null,
          notes: data.notes || null,
        };

        const { data: contact, error } = await supabase
          .from('crm_contacts')
          .insert(contactData)
          .select()
          .single();

        if (error) {
          result = { success: false, action, message: `Erreur: ${error.message}` };
        } else {
          result = { 
            success: true, 
            action, 
            message: `Contact "${contact.first_name} ${contact.last_name}" créé`,
            createdId: contact.id,
            data: contact
          };
        }
        break;
      }

      // ============ CREATE WORKFLOW ============
      case 'create_workflow': {
        // Generate workflow structure from description using AI
        const workflowDescription = data.description || data.name || 'Nouveau workflow';
        
        // Default trigger based on description analysis
        let triggerType = 'trigger_manual';
        const descLower = workflowDescription.toLowerCase();
        if (descLower.includes('formulaire') || descLower.includes('form')) {
          triggerType = 'trigger_form';
        } else if (descLower.includes('email') || descLower.includes('gmail')) {
          triggerType = 'trigger_gmail';
        } else if (descLower.includes('webhook')) {
          triggerType = 'trigger_webhook';
        } else if (descLower.includes('schedule') || descLower.includes('planifié') || descLower.includes('cron')) {
          triggerType = 'trigger_schedule';
        }

        // Build basic workflow nodes
        const nodes: any[] = [
          {
            id: 'trigger-1',
            type: triggerType,
            position: { x: 100, y: 200 },
            data: {
              label: 'Déclencheur',
              blockType: triggerType,
              config: {}
            }
          }
        ];

        // Add action nodes based on description
        if (descLower.includes('email') || descLower.includes('envo')) {
          nodes.push({
            id: 'action-1',
            type: 'send_email',
            position: { x: 400, y: 200 },
            data: {
              label: 'Envoyer Email',
              blockType: 'send_email',
              config: {
                to: '{{ trigger.email }}',
                subject: 'Notification automatique',
                body: '{{ trigger.message }}'
              }
            }
          });
        }

        // Build edges
        const edges = nodes.length > 1 ? [
          { id: 'e1', source: 'trigger-1', target: 'action-1', type: 'smoothstep' }
        ] : [];

        const workflowData = {
          user_id: userId,
          name: data.name || `Workflow: ${workflowDescription.slice(0, 50)}`,
          description: workflowDescription,
          nodes: nodes,
          edges: edges,
          is_active: false,
          trigger_type: triggerType,
        };

        const { data: workflow, error } = await supabase
          .from('workflows')
          .insert(workflowData)
          .select()
          .single();

        if (error) {
          result = { success: false, action, message: `Erreur: ${error.message}` };
        } else {
          result = { 
            success: true, 
            action, 
            message: `Workflow "${workflow.name}" créé ! Accédez à Flow pour le configurer et l'activer.`,
            createdId: workflow.id,
            data: workflow
          };
        }
        break;
      }

      // ============ UPDATE CANDIDATE ============
      case 'update_candidate': {
        if (!data.id) {
          result = { success: false, action, message: 'ID candidat requis' };
          break;
        }

        const updates: Record<string, any> = {};
        if (data.name) updates.name = data.name;
        if (data.email) updates.email = data.email;
        if (data.phone) updates.phone = data.phone;
        if (data.status) updates.status = data.status;
        if (data.match_score !== undefined) updates.match_score = data.match_score;
        if (data.interview_notes) updates.interview_notes = data.interview_notes;

        const { data: candidate, error } = await supabase
          .from('candidates')
          .update(updates)
          .eq('id', data.id)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) {
          result = { success: false, action, message: `Erreur: ${error.message}` };
        } else {
          result = { 
            success: true, 
            action, 
            message: `Candidat "${candidate.name}" mis à jour`,
            data: candidate
          };
        }
        break;
      }

      // ============ UPDATE DEAL ============
      case 'update_deal': {
        if (!data.id) {
          result = { success: false, action, message: 'ID deal requis' };
          break;
        }

        const updates: Record<string, any> = {};
        if (data.status) updates.status = data.status;
        if (data.value !== undefined) updates.value = data.value;
        if (data.priority) updates.priority = data.priority;
        if (data.notes) updates.notes = data.notes;

        const { data: deal, error } = await supabase
          .from('sales_deals')
          .update(updates)
          .eq('id', data.id)
          .select()
          .single();

        if (error) {
          result = { success: false, action, message: `Erreur: ${error.message}` };
        } else {
          result = { 
            success: true, 
            action, 
            message: `Deal "${deal.company_name}" mis à jour`,
            data: deal
          };
        }
        break;
      }

      // ============ UPDATE TICKET ============
      case 'update_ticket': {
        if (!data.id) {
          result = { success: false, action, message: 'ID ticket requis' };
          break;
        }

        const updates: Record<string, any> = {};
        if (data.status) updates.status = data.status;
        if (data.priority) updates.priority = data.priority;
        if (data.assignee_name) updates.assignee_name = data.assignee_name;

        const { data: ticket, error } = await supabase
          .from('support_tickets')
          .update(updates)
          .eq('id', data.id)
          .select()
          .single();

        if (error) {
          result = { success: false, action, message: `Erreur: ${error.message}` };
        } else {
          result = { 
            success: true, 
            action, 
            message: `Ticket "${ticket.title}" mis à jour`,
            data: ticket
          };
        }
        break;
      }

      // ============ DELETE CANDIDATE ============
      case 'delete_candidate': {
        if (!data.id) {
          result = { success: false, action, message: 'ID candidat requis' };
          break;
        }

        const { error } = await supabase
          .from('candidates')
          .delete()
          .eq('id', data.id)
          .eq('user_id', userId);

        if (error) {
          result = { success: false, action, message: `Erreur: ${error.message}` };
        } else {
          result = { success: true, action, message: 'Candidat supprimé' };
        }
        break;
      }

      // ============ DELETE DEAL ============
      case 'delete_deal': {
        if (!data.id) {
          result = { success: false, action, message: 'ID deal requis' };
          break;
        }

        const { error } = await supabase
          .from('sales_deals')
          .delete()
          .eq('id', data.id);

        if (error) {
          result = { success: false, action, message: `Erreur: ${error.message}` };
        } else {
          result = { success: true, action, message: 'Deal supprimé' };
        }
        break;
      }

      default:
        result = { success: false, action, message: `Action non supportée: ${action}` };
    }

    console.log(`Action ${action} result:`, result.success ? 'SUCCESS' : 'FAILED');

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in brain-execute-action:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
