import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, convertInchesToTwip, Table, TableRow, TableCell, WidthType, HeightRule, VerticalAlign } from "https://esm.sh/docx@8.5.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateRequest {
  templateId: string;
  variables: Record<string, string>;
  title: string;
}

type DocumentCategory = 
  | 'purchase_order' | 'invoice' | 'quote' | 'contract' 
  | 'memo' | 'meeting_notes' | 'letter' | 'report' 
  | 'proposal' | 'email' | 'generic';

// Détection automatique du type de document
function detectDocumentCategory(title: string, content?: string): DocumentCategory {
  const titleLower = title.toLowerCase();
  const contentLower = (content || '').toLowerCase();
  const combined = `${titleLower} ${contentLower}`;

  if (combined.includes('bon de commande') || combined.includes('purchase order') || /bc[-\s]?\d+/i.test(combined)) {
    return 'purchase_order';
  }
  if (combined.includes('facture') || combined.includes('invoice') || /fact[-\s]?\d+/i.test(combined)) {
    return 'invoice';
  }
  if (combined.includes('devis') || combined.includes('quotation') || combined.includes('offre commerciale')) {
    return 'quote';
  }
  if (combined.includes('contrat') || combined.includes('accord') || combined.includes('convention')) {
    return 'contract';
  }
  if (combined.includes('note de service') || combined.includes('mémo') || combined.includes('memo')) {
    return 'memo';
  }
  if (combined.includes('compte-rendu') || combined.includes('compte rendu') || combined.includes('procès-verbal')) {
    return 'meeting_notes';
  }
  if (combined.includes('rapport') || combined.includes('report') || combined.includes('analyse')) {
    return 'report';
  }
  if (combined.includes('proposition') || combined.includes('proposal')) {
    return 'proposal';
  }
  if (combined.includes('lettre') || combined.includes('courrier')) {
    return 'letter';
  }
  if (combined.includes('email') || combined.includes('mail') || combined.includes('courriel')) {
    return 'email';
  }
  return 'generic';
}

// Prompts spécialisés par type de document
const SENIOR_PROMPTS: Record<DocumentCategory, { system: string; structure: string[] }> = {
  purchase_order: {
    system: `Tu es un Directeur Achats avec 25 ans d'expérience dans des groupes du CAC40. Tu rédiges des bons de commande impeccables.

STRUCTURE OBLIGATOIRE:
1. EN-TÊTE: Référence BC (format BC-2024-XXXX), date émission
2. ÉMETTEUR: Société, adresse, SIRET
3. FOURNISSEUR: Raison sociale, adresse complète
4. LIVRAISON: Adresse de livraison, date attendue
5. TABLEAU DES ARTICLES:
   | N° | Référence | Désignation | Qté | Unité | PU HT | Total HT |
6. RÉCAPITULATIF: Sous-total HT, TVA 20%, Total TTC
7. CONDITIONS: Délai paiement (30j fin de mois), Incoterm
8. SIGNATURE: "Bon pour accord", Nom, Fonction, Date

STYLE:
- Numéros de ligne pour chaque article
- Montants avec séparateurs milliers et 2 décimales
- Références produit réalistes
- Formulation professionnelle française`,
    structure: ['header', 'parties', 'items_table', 'totals', 'conditions', 'signature']
  },
  invoice: {
    system: `Tu es un DAF expérimenté. Tu produis des factures conformes aux obligations légales françaises.

MENTIONS LÉGALES OBLIGATOIRES:
- Numéro facture séquentiel (FA-2024-XXXXX)
- Date émission et échéance
- Identité émetteur: SIRET, TVA intra (FR XX XXX XXX XXX)
- Détail par ligne: désignation, qté, PU HT, taux TVA, montant HT
- Total HT, TVA par taux, Total TTC
- Conditions règlement, pénalités retard (3x taux BCE)
- Indemnité forfaitaire recouvrement (40€)`,
    structure: ['header', 'parties', 'items_table', 'totals', 'legal_mentions']
  },
  quote: {
    system: `Tu es un Directeur Commercial senior. Tu rédiges des devis qui convertissent.

STRUCTURE:
1. Référence devis (DEV-2024-XXXX), date, validité 30 jours
2. Destinataire avec coordonnées complètes
3. Objet clair et synthétique
4. Détail de l'offre avec justification valeur
5. Tableau: prestations, quantités, tarifs unitaires, totaux
6. Récapitulatif: HT, TVA, TTC
7. Conditions: paiement, délais, exclusions
8. Zone "Bon pour accord" avec signature client`,
    structure: ['header', 'recipient', 'offer_detail', 'items_table', 'totals', 'conditions', 'signature']
  },
  contract: {
    system: `Tu es un juriste d'affaires senior. Tu rédiges des contrats équilibrés.

FORMAT:
- Identification parties (dénomination, forme, siège, RCS, représentant)
- PRÉAMBULE avec contexte
- Articles numérotés: Objet, Durée, Obligations, Prix, Confidentialité, Résiliation, Litige
- Clause attribution juridiction (Paris)
- Signatures des deux parties`,
    structure: ['parties', 'preamble', 'articles', 'signatures']
  },
  memo: {
    system: `Tu es un cadre dirigeant. Tu communiques efficacement.

FORMAT:
NOTE DE SERVICE n° XX/2024
De: [Fonction]
À: [Destinataires]
Date: [Date]
Objet: [Sujet]

[Corps direct et actionnable]
[Actions identifiées avec délais]

[Signature]`,
    structure: ['header', 'body', 'signature']
  },
  meeting_notes: {
    system: `Tu rédiges des comptes-rendus exploitables.

STRUCTURE:
1. Date, heure, lieu, durée
2. Participants présents (avec fonction), excusés
3. Ordre du jour
4. Par point: synthèse, décisions, actions (QUI-QUOI-QUAND)
5. Prochaine réunion`,
    structure: ['header', 'participants', 'agenda', 'discussions', 'actions', 'next_meeting']
  },
  report: {
    system: `Tu es consultant senior (McKinsey/BCG). Tu produis des rapports "board-ready".

STRUCTURE:
1. Résumé exécutif (1 page max)
2. Contexte et enjeux
3. Méthodologie
4. Constats clés (data-driven)
5. Analyses et insights
6. Recommandations hiérarchisées
7. Prochaines étapes`,
    structure: ['executive_summary', 'context', 'methodology', 'findings', 'recommendations', 'next_steps']
  },
  proposal: {
    system: `Tu es Partner dans un cabinet de conseil. Tu rédiges des propositions gagnantes.

APPROCHE CHALLENGER:
1. Executive summary percutant
2. Compréhension enjeux client (reformulée)
3. Notre conviction et approche
4. Phases, livrables, planning
5. Équipe avec profils seniors
6. Investissement transparent
7. Références similaires
8. Call to action`,
    structure: ['executive_summary', 'understanding', 'approach', 'deliverables', 'team', 'investment', 'references', 'cta']
  },
  letter: {
    system: `Tu maîtrises les codes de la correspondance professionnelle française.

FORMAT:
[Émetteur]
[Lieu], le [date en lettres]
[Destinataire + Adresse]

Objet: [Concis]

[Appel: "Madame la Directrice,"]

[Corps 2-4 paragraphes]

[Formule de politesse adaptée]

[Signature]`,
    structure: ['sender', 'date', 'recipient', 'subject', 'body', 'closing', 'signature']
  },
  email: {
    system: `Tu communiques efficacement par email.

RÈGLES:
- Objet explicite avec action attendue
- Structure pyramidale: conclusion d'abord
- Maximum 5-7 lignes
- Action claire avec délai
- Signature professionnelle`,
    structure: ['subject', 'greeting', 'body', 'action', 'signature']
  },
  generic: {
    system: `Tu es un cadre dirigeant expérimenté. Tu rédiges des documents impeccables.

RÈGLES:
- Aucun artefact markdown
- Style naturel et fluide
- Structure claire et logique`,
    structure: ['title', 'content']
  }
};

// Clean AI artifacts from content
function cleanAIArtifacts(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/^---+$/gm, '')
    .replace(/^___+$/gm, '')
    .replace(/^\*\*\*+$/gm, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/^Voici le contenu du document[^\n]*\n?/gim, '')
    .replace(/^Voici le document[^\n]*\n?/gim, '')
    .replace(/^Résumé du Mail\s*:?/gim, '')
    .replace(/^Ce document présente[^\n]*\n?/gim, '')
    .replace(/^Veuillez trouver ci-dessous[^\n]*\n?/gim, '')
    .replace(/N'hésitez pas à me contacter pour[^\n]*$/gim, '')
    .replace(/Je reste à votre disposition[^\n]*$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Parse content into structured sections
function parseContentIntoSections(content: string): Array<{ type: 'heading' | 'paragraph' | 'list' | 'table'; level?: number; text: string; items?: string[]; rows?: string[][] }> {
  const sections: Array<{ type: 'heading' | 'paragraph' | 'list' | 'table'; level?: number; text: string; items?: string[]; rows?: string[][] }> = [];
  const lines = content.split('\n');
  
  let currentParagraph = '';
  let inList = false;
  let listItems: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Detect table rows (|...|...|)
    if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      if (inList && listItems.length > 0) {
        sections.push({ type: 'list', text: '', items: [...listItems] });
        listItems = [];
        inList = false;
      }
      
      // Skip separator rows (|---|---|)
      if (/^\|[-:\s|]+\|$/.test(trimmedLine)) continue;
      
      inTable = true;
      const cells = trimmedLine.split('|').filter(c => c.trim()).map(c => c.trim());
      tableRows.push(cells);
      continue;
    }
    
    // End of table
    if (inTable && !trimmedLine.startsWith('|')) {
      if (tableRows.length > 0) {
        sections.push({ type: 'table', text: '', rows: [...tableRows] });
        tableRows = [];
      }
      inTable = false;
    }
    
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
    
    // Uppercase headings
    if (/^[A-ZÉÈÀÙÂÊÎÔÛÄËÏÖÜ][A-ZÉÈÀÙÂÊÎÔÛÄËÏÖÜ\s\-\d]{3,}$/.test(trimmedLine)) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      sections.push({ type: 'heading', level: 1, text: trimmedLine });
      continue;
    }
    
    // Numbered headings
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
    
    // Bullet points
    if (/^[•\-\*]\s+/.test(trimmedLine)) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      inList = true;
      listItems.push(trimmedLine.replace(/^[•\-\*]\s+/, ''));
      continue;
    }
    
    if (inList && listItems.length > 0) {
      sections.push({ type: 'list', text: '', items: [...listItems] });
      listItems = [];
      inList = false;
    }
    
    currentParagraph += (currentParagraph ? ' ' : '') + trimmedLine;
  }
  
  // Remaining content
  if (currentParagraph) {
    sections.push({ type: 'paragraph', text: currentParagraph.trim() });
  }
  if (listItems.length > 0) {
    sections.push({ type: 'list', text: '', items: listItems });
  }
  if (tableRows.length > 0) {
    sections.push({ type: 'table', text: '', rows: tableRows });
  }
  
  return sections;
}

// Generate Word document with senior UX
async function generateWordDocument(title: string, content: string, category: DocumentCategory): Promise<Uint8Array> {
  const cleanedContent = cleanAIArtifacts(content);
  const sections = parseContentIntoSections(cleanedContent);
  
  const children: any[] = [];
  
  // Professional color scheme based on document type
  const colors: Record<DocumentCategory, { primary: string; accent: string }> = {
    purchase_order: { primary: '1E3A5F', accent: '2E7D32' },
    invoice: { primary: '1F2937', accent: '1976D2' },
    quote: { primary: '0D47A1', accent: 'FF6F00' },
    contract: { primary: '263238', accent: '37474F' },
    memo: { primary: '1565C0', accent: '0277BD' },
    meeting_notes: { primary: '2E7D32', accent: '388E3C' },
    report: { primary: '1A237E', accent: '283593' },
    proposal: { primary: '4527A0', accent: '7B1FA2' },
    letter: { primary: '37474F', accent: '455A64' },
    email: { primary: '424242', accent: '616161' },
    generic: { primary: '1F2937', accent: '3C4DFE' }
  };
  
  const colorScheme = colors[category];
  
  // Title
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 48,
          font: "Calibri",
          color: colorScheme.primary,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );
  
  // Date and reference for transactional documents
  if (['purchase_order', 'invoice', 'quote'].includes(category)) {
    const today = new Date();
    const dateStr = today.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const refPrefix = category === 'purchase_order' ? 'BC' : category === 'invoice' ? 'FA' : 'DEV';
    const refNum = `${refPrefix}-${today.getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;
    
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Référence: ${refNum}`,
            size: 22,
            font: "Calibri",
            color: colorScheme.accent,
            bold: true,
          }),
          new TextRun({
            text: `  •  Date: ${dateStr}`,
            size: 22,
            font: "Calibri",
            color: "666666",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );
  } else {
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
            size: 22,
            font: "Calibri",
            color: "6B7280",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );
  }
  
  // Horizontal line
  children.push(
    new Paragraph({
      border: {
        bottom: {
          color: colorScheme.accent,
          space: 1,
          style: BorderStyle.SINGLE,
          size: 12,
        },
      },
      spacing: { after: 400 },
    })
  );
  
  // Content sections
  for (const section of sections) {
    if (section.type === 'heading') {
      let fontSize = 28;
      let spaceAfter = 200;
      let color = colorScheme.primary;
      
      if (section.level === 2) {
        fontSize = 26;
        spaceAfter = 160;
      } else if (section.level === 3) {
        fontSize = 24;
        spaceAfter = 120;
        color = colorScheme.accent;
      }
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: section.text,
              bold: true,
              size: fontSize,
              font: "Calibri",
              color: color,
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
              size: 24,
              font: "Calibri",
              color: "374151",
            }),
          ],
          spacing: { after: 200, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
        })
      );
    } else if (section.type === 'list' && section.items) {
      for (const item of section.items) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "• ",
                size: 24,
                font: "Calibri",
                color: colorScheme.accent,
                bold: true,
              }),
              new TextRun({
                text: item,
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
    } else if (section.type === 'table' && section.rows && section.rows.length > 0) {
      // Create professional table
      const tableRows = section.rows.map((row, rowIndex) => {
        return new TableRow({
          height: { value: 400, rule: HeightRule.ATLEAST },
          children: row.map((cell) => {
            return new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cell,
                      size: 20,
                      font: "Calibri",
                      bold: rowIndex === 0,
                      color: rowIndex === 0 ? "FFFFFF" : "374151",
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              verticalAlign: VerticalAlign.CENTER,
              shading: rowIndex === 0 
                ? { fill: colorScheme.primary }
                : rowIndex % 2 === 0 
                  ? { fill: "F3F4F6" } 
                  : { fill: "FFFFFF" },
            });
          }),
        });
      });
      
      children.push(
        new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        })
      );
      
      // Add spacing after table
      children.push(
        new Paragraph({
          spacing: { after: 300 },
        })
      );
    }
  }
  
  const doc = new Document({
    creator: "AETHER AI Suite",
    title: title,
    description: `Document professionnel - ${category}`,
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
    
    // Detect document category for senior UX
    const userPrompt = variables.prompt || '';
    const category = detectDocumentCategory(title, userPrompt);
    const seniorPrompt = SENIOR_PROMPTS[category];

    console.log(`Generating Word document (category: ${category}) for user ${user.id}`);
    
    // System prompt for professional human-like document generation
    const systemPrompt = `Tu es un expert senior avec plus de 25 ans d'expérience en rédaction de documents professionnels d'entreprise. Tu produis des documents de qualité "board-ready".

RÈGLES ABSOLUES (violation = échec):
1. JAMAIS de crochets [] ou placeholders
2. JAMAIS de markdown: #, ##, **, *, -, ---, \`\`\`
3. JAMAIS de phrases meta ("Voici le document", "Ce document présente")
4. JAMAIS de structure robotique ou artificielle
5. JAMAIS de formulations typiques d'IA ou de templates visibles

QUALITÉ SENIOR EXIGÉE:
- Le document doit être indiscernable d'un travail humain expert
- Vocabulaire riche, précis, adapté au contexte métier français
- Si une information manque, l'inventer de façon crédible OU l'omettre
- Mise en forme propre avec sections claires

FORMAT TABLEAUX (pour bons de commande, factures, devis):
- Utilise le format: | Colonne1 | Colonne2 | Colonne3 |
- Une ligne par rangée
- Données réalistes et cohérentes

${seniorPrompt.system}`;

    const generatePrompt = `Rédige un document professionnel de type "${templateName}" (catégorie détectée: ${category}).

TITRE: ${title}

${userPrompt ? `INSTRUCTIONS SPÉCIFIQUES:\n${userPrompt}` : 'Génère un document professionnel complet et détaillé.'}

Génère le document complet, prêt à l'emploi en entreprise. Qualité senior irréprochable exigée.`;

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

    // Generate Word document with category-aware styling
    const docBuffer = await generateWordDocument(title, content, category);
    
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
      .createSignedUrl(fileName, 60 * 60 * 24 * 7);

    // Clean content for database storage
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
        embedding_status: 'pending',
        metadata: JSON.stringify({ category, generated_with: 'senior_ux' })
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
        downloadUrl: signedUrlData?.signedUrl,
        category 
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
