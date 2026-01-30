import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, convertInchesToTwip } from "https://esm.sh/docx@8.5.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateRequest {
  templateId: string;
  variables: Record<string, string>;
  title: string;
}

// Clean AI artifacts from content
function cleanAIArtifacts(content: string): string {
  return content
    // Remove markdown code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove markdown headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markdown
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove horizontal rules
    .replace(/^---+$/gm, '')
    .replace(/^___+$/gm, '')
    .replace(/^\*\*\*+$/gm, '')
    // Remove brackets placeholders
    .replace(/\[[^\]]*\]/g, '')
    // Remove AI intro phrases (French)
    .replace(/^Voici le contenu du document[^\n]*\n?/gim, '')
    .replace(/^Voici le document[^\n]*\n?/gim, '')
    .replace(/^Résumé du Mail\s*:?/gim, '')
    .replace(/^Ce document présente[^\n]*\n?/gim, '')
    .replace(/^Veuillez trouver ci-dessous[^\n]*\n?/gim, '')
    // Remove common AI endings
    .replace(/N'hésitez pas à me contacter pour[^\n]*$/gim, '')
    .replace(/Je reste à votre disposition[^\n]*$/gim, '')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Parse content into structured sections
function parseContentIntoSections(content: string): Array<{ type: 'heading' | 'paragraph' | 'list'; level?: number; text: string; items?: string[] }> {
  const sections: Array<{ type: 'heading' | 'paragraph' | 'list'; level?: number; text: string; items?: string[] }> = [];
  const lines = content.split('\n');
  
  let currentParagraph = '';
  let inList = false;
  let listItems: string[] = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      if (inList && listItems.length > 0) {
        sections.push({ type: 'list', text: '', items: [...listItems] });
        listItems = [];
        inList = false;
      }
      continue;
    }
    
    // Detect uppercase headings (TITRE EN MAJUSCULES)
    if (/^[A-ZÉÈÀÙÂÊÎÔÛÄËÏÖÜ][A-ZÉÈÀÙÂÊÎÔÛÄËÏÖÜ\s\-\d]{3,}$/.test(trimmedLine)) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      sections.push({ type: 'heading', level: 1, text: trimmedLine });
      continue;
    }
    
    // Detect numbered headings (1., 1.1., etc.)
    const numberedMatch = trimmedLine.match(/^(\d+(?:\.\d+)*)\.\s+(.+)$/);
    if (numberedMatch) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      const depth = numberedMatch[1].split('.').length;
      sections.push({ type: 'heading', level: Math.min(depth + 1, 3), text: trimmedLine });
      continue;
    }
    
    // Detect bullet points
    if (/^[•\-\*]\s+/.test(trimmedLine)) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      inList = true;
      listItems.push(trimmedLine.replace(/^[•\-\*]\s+/, ''));
      continue;
    }
    
    // Regular paragraph text
    if (inList && listItems.length > 0) {
      sections.push({ type: 'list', text: '', items: [...listItems] });
      listItems = [];
      inList = false;
    }
    
    currentParagraph += (currentParagraph ? ' ' : '') + trimmedLine;
  }
  
  // Don't forget remaining content
  if (currentParagraph) {
    sections.push({ type: 'paragraph', text: currentParagraph.trim() });
  }
  if (listItems.length > 0) {
    sections.push({ type: 'list', text: '', items: listItems });
  }
  
  return sections;
}

// Generate Word document
async function generateWordDocument(title: string, content: string): Promise<Uint8Array> {
  const cleanedContent = cleanAIArtifacts(content);
  const sections = parseContentIntoSections(cleanedContent);
  
  const children: any[] = [];
  
  // Title
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 48, // 24pt
          font: "Calibri",
          color: "1F2937", // Dark gray
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );
  
  // Date
  const today = new Date();
  const dateStr = today.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: dateStr,
          size: 22, // 11pt
          font: "Calibri",
          color: "6B7280", // Gray
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    })
  );
  
  // Horizontal line
  children.push(
    new Paragraph({
      border: {
        bottom: {
          color: "E5E7EB",
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      spacing: { after: 400 },
    })
  );
  
  // Content sections
  for (const section of sections) {
    if (section.type === 'heading') {
      let fontSize = 28; // 14pt
      let spaceAfter = 200;
      
      if (section.level === 2) {
        fontSize = 26; // 13pt
        spaceAfter = 160;
      } else if (section.level === 3) {
        fontSize = 24; // 12pt
        spaceAfter = 120;
      }
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: section.text,
              bold: true,
              size: fontSize,
              font: "Calibri",
              color: "1F2937",
            }),
          ],
          spacing: { before: 300, after: spaceAfter },
        })
      );
    } else if (section.type === 'paragraph') {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: section.text,
              size: 24, // 12pt
              font: "Calibri",
              color: "374151",
            }),
          ],
          spacing: { after: 200, line: 360 }, // 1.5 line spacing
          alignment: AlignmentType.JUSTIFIED,
        })
      );
    } else if (section.type === 'list' && section.items) {
      for (const item of section.items) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "• " + item,
                size: 24,
                font: "Calibri",
                color: "374151",
              }),
            ],
            spacing: { after: 100, line: 360 },
            indent: { left: convertInchesToTwip(0.5) },
          })
        );
      }
    }
  }
  
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 24,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        children,
      },
    ],
  });
  
  return await Packer.toBuffer(doc);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { templateId, variables, title } = await req.json() as GenerateRequest;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('AI service not configured');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get template info
    const { data: template } = await supabase
      .from('doc_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    const templateName = template?.name || 'Document';
    const templateCategory = template?.category || 'general';

    const userPrompt = variables.prompt || '';
    
    // System prompt for professional human-like document generation
    const systemPrompt = `Tu es un cadre supérieur avec 30 ans d'expérience en rédaction professionnelle dans des grandes entreprises françaises. Tu rédiges des documents avec une qualité irréprochable.

RÈGLES ABSOLUES (violation = échec):
1. JAMAIS de crochets [] ou placeholders
2. JAMAIS de markdown: #, ##, **, *, -, ---, \`\`\`
3. JAMAIS de phrases d'introduction meta ("Voici le document", "Ce document présente")
4. JAMAIS de structure robotique ou artificielle
5. JAMAIS de formulations typiques d'IA ou de templates

STYLE IMPÉRATIF:
- Écris comme si TU étais l'auteur original, pas un assistant
- Commence DIRECTEMENT par le contenu substantiel
- Phrases fluides, vocabulaire riche et varié
- Ton professionnel mais naturel
- Si une information manque, invente quelque chose de crédible ou omets
- Adapte le niveau de langage au contexte business français

FORMAT:
- Utilise des TITRES EN MAJUSCULES pour les sections principales
- Utilise des numéros (1., 1.1., 2.) pour les sous-sections si nécessaire
- Paragraphes continus et développés
- Évite les listes à puces sauf si absolument nécessaire

Le document doit être indiscernable d'un document rédigé par un professionnel humain expérimenté.`;

    const generatePrompt = `Rédige un document professionnel de type "${templateName}" (catégorie: ${templateCategory}).

TITRE: ${title}

${userPrompt ? `INSTRUCTIONS SPÉCIFIQUES:\n${userPrompt}` : 'Génère un document professionnel complet et détaillé.'}

Génère le document complet, prêt à l'emploi en entreprise. Qualité irréprochable exigée.`;

    console.log(`Generating Word document for user ${user.id}, template: ${templateId}`);

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
          { role: 'user', content: generatePrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI service error: ${response.status}`);
    }

    const aiResponse = await response.json();
    let content = aiResponse.choices?.[0]?.message?.content || '';

    if (!content) {
      throw new Error('No content generated');
    }

    // Generate Word document
    const docBuffer = await generateWordDocument(title, content);
    
    // Upload to storage
    const fileName = `docs/${user.id}/${Date.now()}-${title.replace(/[^a-zA-Z0-9àâäéèêëïîôùûüç\s-]/gi, '_')}.docx`;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, docBuffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload document');
    }

    // Get download URL
    const { data: signedUrlData } = await supabase.storage
      .from('documents')
      .createSignedUrl(fileName, 60 * 60 * 24 * 7); // 7 days

    // Clean content for database storage (text version)
    const cleanedContent = cleanAIArtifacts(content);

    // Create the document in the database
    const { data: document, error: insertError } = await supabase
      .from('aether_documents')
      .insert({
        user_id: user.id,
        title,
        content: cleanedContent,
        template_id: templateId,
        file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        file_url: signedUrlData?.signedUrl || null,
        status: 'completed',
        embedding_status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error('Failed to save document');
    }

    return new Response(
      JSON.stringify({ 
        document,
        downloadUrl: signedUrlData?.signedUrl 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in doc-generate-word function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
