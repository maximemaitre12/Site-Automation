import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface GenerateDocRequest {
  title: string;
  content?: string;
  prompt?: string;
  type?: string;
  tone?: string;
  userId: string;
  workflowId?: string;
  workflowRunId?: string;
  context?: string;
  folderId?: string;
  tags?: string[];
}

// Generate PDF from HTML content
async function generatePdfFromHtml(htmlContent: string): Promise<Uint8Array> {
  // Convert content to a clean HTML document
  const fullHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #333;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      font-size: 24pt;
      color: #0A1A3C;
      border-bottom: 2px solid #3C4DFE;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    h2 {
      font-size: 18pt;
      color: #0A1A3C;
      margin-top: 30px;
    }
    h3 {
      font-size: 14pt;
      color: #3C4DFE;
    }
    p {
      margin: 10px 0;
      text-align: justify;
    }
    ul, ol {
      margin: 10px 0 10px 20px;
    }
    li {
      margin: 5px 0;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #E5E7EB;
      font-size: 10pt;
      color: #666;
      text-align: center;
    }
    .generated-date {
      font-size: 10pt;
      color: #666;
    }
  </style>
</head>
<body>
  ${htmlContent}
  <div class="footer">
    Document généré par AETHER AI Suite • ${new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
  </div>
</body>
</html>`;

  // Use pdf.co API or similar service if available
  // For now, we'll store as HTML which can be converted to PDF client-side
  const encoder = new TextEncoder();
  return encoder.encode(fullHtml);
}

// Convert markdown-like content to HTML
function convertToHtml(content: string, title: string): string {
  let html = content;
  
  // Convert UPPERCASE headers to h2
  html = html.replace(/^([A-ZÉÈÀÙÂÊÎÔÛÄËÏÖÜ][A-ZÉÈÀÙÂÊÎÔÛÄËÏÖÜ\s\-\d]+)$/gm, '<h2>$1</h2>');
  
  // Convert numbered headers (1., 1.1, etc.)
  html = html.replace(/^(\d+(?:\.\d+)*)\.\s+(.+)$/gm, '<h3>$1. $2</h3>');
  
  // Convert bullet points
  html = html.replace(/^[•]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // Convert paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  
  // Wrap in paragraphs
  if (!html.startsWith('<')) {
    html = '<p>' + html + '</p>';
  }
  
  // Add title header
  html = `<div class="header"><h1>${title}</h1><p class="generated-date">Généré le ${new Date().toLocaleDateString('fr-FR')}</p></div>${html}`;
  
  return html;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: GenerateDocRequest = await req.json();
    const { title, content, prompt, type, tone, userId, workflowId, workflowRunId, context, folderId, tags } = body;

    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!title) {
      throw new Error('Title is required');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let documentContent = content || '';

    // If prompt is provided, generate content with AI
    if (prompt && LOVABLE_API_KEY) {
      console.log(`Generating document with AI for user ${userId}`);
      
      const systemPrompt = `Tu es un cadre dirigeant avec 30 ans d'expérience en rédaction professionnelle. Tu rédiges des documents comme un humain expert.

INTERDICTIONS ABSOLUES (ne fais JAMAIS ceci):
- Pas de crochets [] comme [Insérer la date] ou [Prénom Nom]
- Pas de markdown: **, ##, #, ---, *, -
- Pas de phrases d'introduction comme "Voici le contenu du document" ou "Résumé du Mail"
- Pas de structures de template (Objet:, Date:, Auteur:, ---)
- Pas de placeholders ou texte à compléter
- Pas de formules robotiques typiques d'IA

STYLE OBLIGATOIRE:
- Écris comme si tu étais l'auteur original du document
- Commence directement par le contenu, sans en-tête artificiel
- Phrases fluides, naturelles, vocabulaire riche
- Paragraphes continus, pas de listes à puces sauf si c'est absolument indispensable
- Si des informations manquent (date, nom), invente-les de façon crédible ou omets-les
- Ton ${tone || 'professionnel'} adapté au contexte d'entreprise français

Type de document: ${type || 'professionnel'}`;

      const userPrompt = `${prompt}

${context ? `CONTEXTE SUPPLÉMENTAIRE:\n${context}` : ''}

Génère le document complet. Il doit être prêt à l'emploi en entreprise.`;

      try {
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('AI Gateway error:', response.status, errorText);
          throw new Error(`AI generation failed: ${response.status}`);
        }

        const aiResponse = await response.json();
        documentContent = aiResponse.choices?.[0]?.message?.content || '';

        if (!documentContent) {
          throw new Error('AI returned empty content');
        }

        // Nettoyage agressif des traces d'IA / markdown / placeholders
        documentContent = documentContent
          .replace(/```[\s\S]*?```/g, '')
          .replace(/^[#]+\s+/gm, '')
          .replace(/\*\*/g, '')
          .replace(/^---$/gm, '')
          .replace(/\[[^\]]*\]/g, '')
          .replace(/(^|\n)\s*Voici le contenu du document[^\n]*\n?/gi, '$1')
          .replace(/(^|\n)\s*Résumé du Mail\s*:?/gi, '$1')
          .trim();
      } catch (aiError) {
        console.error('AI generation error:', aiError);
        // Fallback to simple content if AI fails
        documentContent = `${title}\n\n${prompt}\n\n${context || ''}`;
      }
    }

    // Convert content to HTML for PDF
    const htmlContent = convertToHtml(documentContent, title);
    
    // Generate PDF bytes
    const pdfBytes = await generatePdfFromHtml(htmlContent);
    
    // Upload PDF to storage
    const fileName = `workflow-docs/${userId}/${Date.now()}-${title.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, pdfBytes, {
        contentType: 'text/html',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      // Continue without file - we'll still save the content
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // Create document in aether_documents
    const documentData: any = {
      user_id: userId,
      title,
      content: documentContent,
      description: `Document généré par workflow${workflowId ? ` (workflow: ${workflowId})` : ''}`,
      file_type: 'application/pdf',
      file_url: urlData?.publicUrl || null,
      status: 'completed',
      embedding_status: 'pending',
      tags: tags ? JSON.stringify(tags) : JSON.stringify(['workflow', 'auto-generated']),
      metadata: JSON.stringify({
        source: 'workflow',
        workflow_id: workflowId,
        workflow_run_id: workflowRunId,
        generated_at: new Date().toISOString(),
        type: type || 'document',
        tone: tone || 'professional'
      })
    };

    if (folderId) {
      documentData.folder_id = folderId;
    }

    const { data: document, error: insertError } = await supabase
      .from('aether_documents')
      .insert(documentData)
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error(`Failed to save document: ${insertError.message}`);
    }

    console.log(`Document created: ${document.id} for user ${userId}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        document: {
          id: document.id,
          title: document.title,
          content: documentContent,
          file_url: urlData?.publicUrl,
          file_type: 'application/pdf',
          created_at: document.created_at
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in workflow-generate-document:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
