import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, convertInchesToTwip, Table, TableRow, TableCell, WidthType, HeightRule, VerticalAlign, Header, Footer, PageNumber } from "https://esm.sh/docx@8.5.0";

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

// ============================================================================
// TYPES & CLASSIFICATION (Senior Document Intelligence - Same as doc-generate-word)
// ============================================================================

type DocumentCategory = 
  | 'purchase_order' | 'invoice' | 'quote' | 'contract' 
  | 'memo' | 'meeting_notes' | 'letter' | 'report' 
  | 'proposal' | 'email' | 'procedure' | 'specification'
  | 'audit_report' | 'policy' | 'generic';

interface ClassificationResult {
  category: DocumentCategory;
  confidence: number;
  detectedKeywords: string[];
}

const CLASSIFICATION_PATTERNS: Record<DocumentCategory, {
  keywords: string[];
  weight: number;
  regex?: RegExp[];
}> = {
  purchase_order: {
    keywords: ['bon de commande', 'purchase order', 'commande fournisseur', 'ordre d\'achat', 'bc'],
    weight: 10,
    regex: [/bc[-\s]?\d+/i, /po[-\s]?\d+/i, /commande\s+n[°o]?\s*\d+/i]
  },
  invoice: {
    keywords: ['facture', 'invoice', 'facturation', 'règlement', 'échéance'],
    weight: 10,
    regex: [/fa[-\s]?\d+/i, /inv[-\s]?\d+/i, /facture\s+n[°o]?\s*\d+/i]
  },
  quote: {
    keywords: ['devis', 'quotation', 'offre commerciale', 'proposition tarifaire', 'estimation', 'chiffrage'],
    weight: 9,
    regex: [/dev[-\s]?\d+/i, /qt[-\s]?\d+/i, /devis\s+n[°o]?\s*\d+/i]
  },
  contract: {
    keywords: ['contrat', 'accord', 'convention', 'contract', 'agreement', 'engagement', 'avenant'],
    weight: 9,
    regex: [/contrat\s+n[°o]?\s*\d+/i, /avenant\s+n[°o]?\s*\d+/i]
  },
  memo: {
    keywords: ['note de service', 'mémo', 'memo', 'circulaire', 'communication interne', 'note interne'],
    weight: 8,
    regex: [/ns[-\s]?\d+/i, /note\s+n[°o]?\s*\d+/i]
  },
  meeting_notes: {
    keywords: ['compte-rendu', 'compte rendu', 'procès-verbal', 'pv', 'réunion', 'meeting notes', 'minutes'],
    weight: 8,
    regex: [/pv[-\s]?\d+/i, /cr[-\s]?\d+/i]
  },
  report: {
    keywords: ['rapport', 'report', 'analyse', 'étude', 'bilan', 'synthèse', 'état des lieux'],
    weight: 7,
    regex: [/rapport\s+(d[''])?/i]
  },
  proposal: {
    keywords: ['proposition', 'proposal', 'offre de service', 'offre technique', 'réponse appel'],
    weight: 8,
    regex: [/prop[-\s]?\d+/i]
  },
  letter: {
    keywords: ['lettre', 'courrier', 'letter', 'correspondance', 'missive'],
    weight: 6,
    regex: [/lettre\s+(de|à)/i]
  },
  email: {
    keywords: ['email', 'mail', 'courriel', 'message électronique', 'e-mail'],
    weight: 5
  },
  procedure: {
    keywords: ['procédure', 'processus', 'mode opératoire', 'instruction', 'protocole'],
    weight: 7,
    regex: [/proc[-\s]?\d+/i]
  },
  specification: {
    keywords: ['cahier des charges', 'spécification', 'cdc', 'spec', 'requirements', 'exigences'],
    weight: 8,
    regex: [/cdc[-\s]?\d+/i]
  },
  audit_report: {
    keywords: ['audit', 'contrôle', 'inspection', 'vérification', 'conformité'],
    weight: 8,
    regex: [/audit[-\s]?\d+/i]
  },
  policy: {
    keywords: ['politique', 'charte', 'règlement', 'directive', 'policy'],
    weight: 7
  },
  generic: {
    keywords: [],
    weight: 0
  }
};

function classifyDocument(title: string, content?: string): ClassificationResult {
  const combined = `${title} ${content || ''}`.toLowerCase();
  const scores: Record<string, number> = {};
  const detectedKeywords: string[] = [];
  
  for (const [category, config] of Object.entries(CLASSIFICATION_PATTERNS)) {
    let score = 0;
    
    for (const keyword of config.keywords) {
      if (combined.includes(keyword.toLowerCase())) {
        score += config.weight;
        detectedKeywords.push(keyword);
      }
    }
    
    if (config.regex) {
      for (const regex of config.regex) {
        if (regex.test(combined)) {
          score += config.weight * 1.5;
        }
      }
    }
    
    scores[category] = score;
  }
  
  const entries = Object.entries(scores);
  entries.sort((a, b) => b[1] - a[1]);
  
  const [bestCategory, bestScore] = entries[0];
  const totalPossible = Math.max(...Object.values(CLASSIFICATION_PATTERNS).map(c => c.weight * c.keywords.length * 2));
  const confidence = Math.min(bestScore / totalPossible, 1);
  
  return {
    category: bestScore > 0 ? bestCategory as DocumentCategory : 'generic',
    confidence: bestScore > 0 ? confidence : 0,
    detectedKeywords: [...new Set(detectedKeywords)]
  };
}

// ============================================================================
// SENIOR PROMPTS ENGINE
// ============================================================================

const SECTION_TEMPLATES: Record<DocumentCategory, string[]> = {
  purchase_order: [
    'EN-TÊTE (Logo, Référence BC, Date)',
    'SOCIÉTÉ ÉMETTRICE (Raison sociale, SIRET, Adresse)',
    'FOURNISSEUR (Raison sociale, SIRET, Adresse)',
    'ADRESSE DE LIVRAISON',
    'TABLEAU DES ARTICLES (N°, Réf, Désignation, Qté, Unité, PU HT, Total HT)',
    'RÉCAPITULATIF FINANCIER (Sous-total HT, TVA 20%, Total TTC)',
    'CONDITIONS DE PAIEMENT',
    'CONDITIONS DE LIVRAISON (Date, Incoterm)',
    'ZONE DE SIGNATURE (Bon pour accord, Nom, Fonction, Date)'
  ],
  invoice: [
    'EN-TÊTE FACTURE (N° Facture séquentiel, Date émission)',
    'ÉMETTEUR (Société, SIRET, N° TVA Intracommunautaire, RCS)',
    'FACTURER À (Client, Adresse facturation)',
    'RÉFÉRENCES (N° Commande, Date commande)',
    'DÉTAIL DES PRESTATIONS (Réf, Désignation, Qté, PU HT, Taux TVA, Total HT)',
    'RÉCAPITULATIF TVA (Base HT par taux, Montant TVA)',
    'TOTAL (Total HT, Total TVA, Total TTC)',
    'CONDITIONS DE RÈGLEMENT',
    'COORDONNÉES BANCAIRES (IBAN, BIC)',
    'MENTIONS LÉGALES (Pénalités de retard, Indemnité forfaitaire 40€)'
  ],
  quote: [
    'EN-TÊTE DEVIS (Référence, Date, Validité)',
    'NOTRE SOCIÉTÉ',
    'CLIENT DESTINATAIRE',
    'OBJET DU DEVIS',
    'NOTRE PROPOSITION',
    'DÉTAIL DE L\'OFFRE (Désignation, Qté, Tarif, Total)',
    'RÉCAPITULATIF (HT, TVA, TTC)',
    'CONDITIONS (Validité, Paiement, Délais)',
    'ACCEPTATION (Bon pour accord, Signature client)'
  ],
  contract: [
    'INTITULÉ DU CONTRAT',
    'ENTRE LES SOUSSIGNÉS',
    'PRÉAMBULE',
    'ARTICLE 1 - OBJET',
    'ARTICLE 2 - DURÉE',
    'ARTICLE 3 - OBLIGATIONS DES PARTIES',
    'ARTICLE 4 - CONDITIONS FINANCIÈRES',
    'ARTICLE 5 - CONFIDENTIALITÉ',
    'ARTICLE 6 - RÉSILIATION',
    'ARTICLE 7 - LOI APPLICABLE',
    'SIGNATURES DES PARTIES'
  ],
  memo: ['EN-TÊTE NOTE DE SERVICE', 'DE / À / DATE / OBJET', 'MESSAGE PRINCIPAL', 'ACTIONS ATTENDUES', 'SIGNATURE'],
  meeting_notes: ['EN-TÊTE', 'PARTICIPANTS', 'ORDRE DU JOUR', 'POINTS TRAITÉS', 'DÉCISIONS', 'ACTIONS', 'PROCHAINE RÉUNION'],
  report: ['RÉSUMÉ EXÉCUTIF', 'CONTEXTE', 'MÉTHODOLOGIE', 'CONSTATS', 'RECOMMANDATIONS', 'PLAN D\'ACTION', 'CONCLUSION'],
  proposal: ['EXECUTIVE SUMMARY', 'COMPRÉHENSION DES ENJEUX', 'NOTRE APPROCHE', 'LIVRABLES ET PLANNING', 'ÉQUIPE', 'INVESTISSEMENT', 'RÉFÉRENCES'],
  letter: ['ÉMETTEUR', 'DATE', 'DESTINATAIRE', 'OBJET', 'CORPS DE LA LETTRE', 'FORMULE DE POLITESSE', 'SIGNATURE'],
  email: ['OBJET', 'SALUTATION', 'CORPS', 'CALL TO ACTION', 'SIGNATURE'],
  procedure: ['OBJET', 'PÉRIMÈTRE', 'RESPONSABILITÉS', 'DESCRIPTION DES ÉTAPES', 'VALIDATION'],
  specification: ['CONTEXTE', 'OBJECTIFS', 'EXIGENCES FONCTIONNELLES', 'EXIGENCES TECHNIQUES', 'LIVRABLES', 'PLANNING'],
  audit_report: ['RÉSUMÉ', 'MÉTHODOLOGIE', 'CONSTATS', 'NON-CONFORMITÉS', 'RECOMMANDATIONS', 'PLAN D\'ACTION'],
  policy: ['OBJET', 'CHAMP D\'APPLICATION', 'PRINCIPES', 'RÈGLES', 'CONTRÔLE', 'ENTRÉE EN VIGUEUR'],
  generic: ['TITRE', 'CONTENU']
};

const VOCABULARY_BANKS: Record<DocumentCategory, string[]> = {
  purchase_order: ['franco de port', 'délai ferme', 'bon pour accord', 'net à 30 jours', 'date limite de livraison'],
  invoice: ['échéance de paiement', 'taux de TVA applicable', 'escompte', 'pénalités de retard', 'indemnité forfaitaire'],
  quote: ['validité de l\'offre', 'engagement ferme', 'exclusions', 'options complémentaires', 'réserve de propriété'],
  contract: ['parties contractantes', 'obligations réciproques', 'tacite reconduction', 'clause résolutoire', 'force majeure'],
  memo: ['mesure effective', 'application immédiate', 'personnel concerné', 'entrée en vigueur'],
  meeting_notes: ['décision validée', 'action à mener', 'responsable désigné', 'échéance fixée'],
  report: ['constat majeur', 'tendance identifiée', 'facteur de risque', 'levier d\'amélioration', 'recommandation prioritaire'],
  proposal: ['valeur ajoutée', 'retour sur investissement', 'expertise reconnue', 'méthodologie éprouvée'],
  letter: ['suite à notre entretien', 'comme convenu', 'je me permets de', 'veuillez agréer'],
  email: ['pour information', 'action requise', 'pour suite à donner', 'urgent'],
  procedure: ['étape obligatoire', 'point de contrôle', 'validation requise', 'enregistrement obligatoire'],
  specification: ['exigence fonctionnelle', 'contrainte technique', 'critère d\'acceptation', 'livrable attendu'],
  audit_report: ['non-conformité majeure', 'non-conformité mineure', 'observation', 'action corrective'],
  policy: ['disposition applicable', 'mesure obligatoire', 'sanction prévue', 'contrôle de conformité'],
  generic: []
};

function generateSeniorSystemPrompt(category: DocumentCategory, tone?: string): string {
  const sections = SECTION_TEMPLATES[category];
  const vocabulary = VOCABULARY_BANKS[category];
  
  return `Tu es un DIRECTEUR SENIOR avec plus de 30 ans d'expérience dans la rédaction de documents professionnels pour des entreprises du CAC40 et des cabinets de conseil internationaux. Tu produis des documents de qualité IRRÉPROCHABLE.

═══════════════════════════════════════════════════════════════
RÈGLES ABSOLUES - VIOLATION = ÉCHEC CRITIQUE
═══════════════════════════════════════════════════════════════

1. JAMAIS de crochets [] ni de placeholders [À compléter] ou [Insérer]
2. JAMAIS de syntaxe markdown: #, ##, **, *, \`\`\`, ---, ___
3. JAMAIS de phrases d'introduction IA ("Voici le document", "Ce document présente")
4. JAMAIS de formules de conclusion artificielles ("N'hésitez pas à me contacter")
5. JAMAIS de structure visible de template ou de squelette
6. JAMAIS de données manifestement fausses (ex: SIRET 123 456 789)

═══════════════════════════════════════════════════════════════
QUALITÉ "BOARD-READY" EXIGÉE
═══════════════════════════════════════════════════════════════

• Document INDISCERNABLE d'un travail humain expert
• Chaque phrase apporte une VALEUR AJOUTÉE réelle
• Vocabulaire RICHE et PRÉCIS adapté au contexte métier français
• Si une information n'est pas fournie: INVENTER une donnée crédible OU l'omettre
• Mise en forme PROPRE avec sections CLAIREMENT délimitées
• Ton ${tone || 'professionnel'}, ni trop formel ni trop familier

═══════════════════════════════════════════════════════════════
FORMAT TABLEAUX (documents transactionnels)
═══════════════════════════════════════════════════════════════

Pour les bons de commande, factures, devis, utilise OBLIGATOIREMENT:
| Colonne 1 | Colonne 2 | Colonne 3 |
| Donnée 1  | Donnée 2  | Donnée 3  |

Données RÉALISTES et COHÉRENTES.

═══════════════════════════════════════════════════════════════
STRUCTURE OBLIGATOIRE
═══════════════════════════════════════════════════════════════

${sections.map((s, i) => `${i + 1}. ${s}`).join('\n')}

═══════════════════════════════════════════════════════════════
VOCABULAIRE MÉTIER
═══════════════════════════════════════════════════════════════

${vocabulary.length > 0 ? vocabulary.join(' • ') : 'Vocabulaire professionnel standard.'}

═══════════════════════════════════════════════════════════════
DONNÉES À GÉNÉRER (si non fournies)
═══════════════════════════════════════════════════════════════

• Référence: Format professionnel avec année (ex: BC-2024-0847)
• Date: Date du jour en format français complet
• SIRET: 14 chiffres cohérents (format: XXX XXX XXX XXXXX)
• TVA Intracommunautaire: FR + 2 chiffres + SIREN
• Montants: Réalistes avec séparateurs milliers et 2 décimales`;
}

// ============================================================================
// CONTENT CLEANING & VALIDATION
// ============================================================================

const FORBIDDEN_PATTERNS = [
  'Voici le document', 'Voici le contenu', 'Ce document présente', 'Ce document décrit',
  'Ci-dessous vous trouverez', 'N\'hésitez pas à', 'Je reste à votre disposition',
  '[À compléter]', '[Insérer ici]', '[PLACEHOLDER]', 'Résumé du Mail'
];

function cleanAndValidateContent(content: string): { cleaned: string; score: number; issues: string[] } {
  const issues: string[] = [];
  let cleaned = content;
  let score = 100;
  
  for (const pattern of FORBIDDEN_PATTERNS) {
    const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (regex.test(cleaned)) {
      issues.push(`Pattern supprimé: "${pattern}"`);
      score -= 5;
      cleaned = cleaned.replace(regex, '');
    }
  }
  
  const markdownCleaners: Array<{ pattern: RegExp; replacement: string; name: string }> = [
    { pattern: /```[\s\S]*?```/g, replacement: '', name: 'code blocks' },
    { pattern: /^#{1,6}\s+/gm, replacement: '', name: 'headers' },
    { pattern: /\*\*([^*]+)\*\*/g, replacement: '$1', name: 'bold' },
    { pattern: /\*([^*]+)\*/g, replacement: '$1', name: 'italic' },
    { pattern: /__([^_]+)__/g, replacement: '$1', name: 'bold underscore' },
    { pattern: /_([^_]+)_/g, replacement: '$1', name: 'italic underscore' },
    { pattern: /^---+$/gm, replacement: '', name: 'hr' },
    { pattern: /^___+$/gm, replacement: '', name: 'hr' },
    { pattern: /^\*\*\*+$/gm, replacement: '', name: 'hr' },
  ];
  
  for (const { pattern, replacement, name } of markdownCleaners) {
    if (pattern.test(cleaned)) {
      issues.push(`Markdown nettoyé: ${name}`);
      score -= 3;
      cleaned = cleaned.replace(pattern, replacement);
    }
  }
  
  const bracketMatches = cleaned.match(/\[[^\]|]*\]/g);
  if (bracketMatches) {
    const invalidBrackets = bracketMatches.filter(m => 
      !m.includes('|') && 
      m.length < 100 && 
      (m.includes('compléter') || m.includes('insérer') || m.includes('À') || m.includes('...'))
    );
    for (const bracket of invalidBrackets) {
      cleaned = cleaned.replace(bracket, '');
      issues.push(`Placeholder supprimé: ${bracket.slice(0, 30)}...`);
      score -= 10;
    }
  }
  
  cleaned = cleaned
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/[ \t]+$/gm, '')
    .replace(/^\s*\n/gm, '\n')
    .trim();
  
  return { cleaned, score: Math.max(0, score), issues };
}

// ============================================================================
// CONTENT PARSING
// ============================================================================

interface ContentSection {
  type: 'heading' | 'paragraph' | 'list' | 'table';
  level?: number;
  text: string;
  items?: string[];
  rows?: string[][];
}

function parseContentIntoSections(content: string): ContentSection[] {
  const sections: ContentSection[] = [];
  const lines = content.split('\n');
  
  let currentParagraph = '';
  let inList = false;
  let listItems: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
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
      
      if (/^\|[-:\s|]+\|$/.test(trimmedLine)) continue;
      
      inTable = true;
      const cells = trimmedLine.split('|').filter(c => c.trim()).map(c => c.trim());
      tableRows.push(cells);
      continue;
    }
    
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
    
    if (/^[A-ZÉÈÀÙÂÊÎÔÛÄËÏÖÜ][A-ZÉÈÀÙÂÊÎÔÛÄËÏÖÜ\s\-\d'']{2,}$/.test(trimmedLine) && trimmedLine.length <= 80) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      sections.push({ type: 'heading', level: 1, text: trimmedLine });
      continue;
    }
    
    const numberedMatch = trimmedLine.match(/^(ARTICLE\s+)?(\d+(?:\.\d+)*)[.\-\s]+(.+)$/i);
    if (numberedMatch && trimmedLine.length <= 100) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      const depth = numberedMatch[2].split('.').length;
      sections.push({ type: 'heading', level: Math.min(depth + 1, 3), text: trimmedLine });
      continue;
    }
    
    if (/^[A-ZÉÈÀÙÂÊÎÔÛ][a-zéèàùâêîôûäëïöü\s]{0,20}:/.test(trimmedLine) && trimmedLine.length <= 80) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      sections.push({ type: 'heading', level: 2, text: trimmedLine });
      continue;
    }
    
    if (/^[•\-\*]\s+/.test(trimmedLine)) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      inList = true;
      listItems.push(trimmedLine.replace(/^[•\-\*]\s+/, ''));
      continue;
    }
    
    if (/^\d+[.)]\s+/.test(trimmedLine) && !numberedMatch) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      inList = true;
      listItems.push(trimmedLine);
      continue;
    }
    
    if (inList && listItems.length > 0 && !/^[•\-\*\d]/.test(trimmedLine)) {
      sections.push({ type: 'list', text: '', items: [...listItems] });
      listItems = [];
      inList = false;
    }
    
    currentParagraph += (currentParagraph ? ' ' : '') + trimmedLine;
  }
  
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

// ============================================================================
// DOCUMENT GENERATION (Senior Word Styling)
// ============================================================================

const COLOR_SCHEMES: Record<DocumentCategory, { primary: string; accent: string; light: string }> = {
  purchase_order: { primary: '1E3A5F', accent: '2E7D32', light: 'E8F5E9' },
  invoice: { primary: '1F2937', accent: '1976D2', light: 'E3F2FD' },
  quote: { primary: '0D47A1', accent: 'FF6F00', light: 'FFF3E0' },
  contract: { primary: '263238', accent: '37474F', light: 'ECEFF1' },
  memo: { primary: '1565C0', accent: '0277BD', light: 'E1F5FE' },
  meeting_notes: { primary: '2E7D32', accent: '388E3C', light: 'E8F5E9' },
  report: { primary: '1A237E', accent: '283593', light: 'E8EAF6' },
  proposal: { primary: '4527A0', accent: '7B1FA2', light: 'F3E5F5' },
  letter: { primary: '37474F', accent: '455A64', light: 'ECEFF1' },
  email: { primary: '424242', accent: '616161', light: 'F5F5F5' },
  procedure: { primary: '00695C', accent: '00897B', light: 'E0F2F1' },
  specification: { primary: '1565C0', accent: '1976D2', light: 'E3F2FD' },
  audit_report: { primary: 'B71C1C', accent: 'C62828', light: 'FFEBEE' },
  policy: { primary: '4A148C', accent: '6A1B9A', light: 'F3E5F5' },
  generic: { primary: '1F2937', accent: '3C4DFE', light: 'E8EAF6' }
};

function generateEnrichedReference(category: DocumentCategory): { reference: string; date: string } {
  const now = new Date();
  const year = now.getFullYear();
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  
  const prefixes: Record<DocumentCategory, string> = {
    purchase_order: 'BC', invoice: 'FA', quote: 'DEV', contract: 'CTR',
    memo: 'NS', meeting_notes: 'CR', report: 'RAP', proposal: 'PROP',
    letter: 'COU', email: 'MSG', procedure: 'PROC', specification: 'CDC',
    audit_report: 'AUD', policy: 'POL', generic: 'DOC'
  };
  
  return {
    reference: `${prefixes[category]}-${year}-${String(randomNum).padStart(4, '0')}`,
    date: now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  };
}

async function generateSeniorWordDocument(
  title: string, 
  content: string, 
  category: DocumentCategory
): Promise<Uint8Array> {
  const { cleaned } = cleanAndValidateContent(content);
  const sections = parseContentIntoSections(cleaned);
  const colors = COLOR_SCHEMES[category];
  const { reference, date } = generateEnrichedReference(category);
  
  const children: any[] = [];
  
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 44,
          font: "Calibri Light",
          color: colors.primary,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    })
  );
  
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Réf. ${reference}`,
          size: 22,
          font: "Calibri",
          color: colors.accent,
          bold: true,
        }),
        new TextRun({
          text: `  │  ${date}`,
          size: 22,
          font: "Calibri",
          color: '6B7280',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    })
  );
  
  children.push(
    new Paragraph({
      border: {
        bottom: {
          color: colors.accent,
          space: 1,
          style: BorderStyle.SINGLE,
          size: 18,
        },
      },
      spacing: { after: 400 },
    })
  );
  
  for (const section of sections) {
    if (section.type === 'heading') {
      const level = section.level || 1;
      const fontSize = level === 1 ? 32 : level === 2 ? 28 : 24;
      const color = level === 1 ? colors.primary : level === 2 ? colors.accent : '4B5563';
      const spaceBefore = level === 1 ? 400 : level === 2 ? 300 : 200;
      const spaceAfter = level === 1 ? 200 : 150;
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: section.text,
              bold: true,
              size: fontSize,
              font: level === 1 ? "Calibri Light" : "Calibri",
              color: color,
            }),
          ],
          spacing: { before: spaceBefore, after: spaceAfter },
          border: level === 1 ? {
            bottom: {
              color: colors.light.replace('#', ''),
              space: 4,
              style: BorderStyle.SINGLE,
              size: 8,
            },
          } : undefined,
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
                text: "▸ ",
                size: 24,
                font: "Calibri",
                color: colors.accent,
                bold: true,
              }),
              new TextRun({
                text: item,
                size: 24,
                font: "Calibri",
                color: "374151",
              }),
            ],
            spacing: { after: 100, line: 340 },
            indent: { left: convertInchesToTwip(0.4) },
          })
        );
      }
      children.push(new Paragraph({ spacing: { after: 150 } }));
    } else if (section.type === 'table' && section.rows && section.rows.length > 0) {
      const tableRows = section.rows.map((row, rowIndex) => {
        return new TableRow({
          height: { value: 450, rule: HeightRule.ATLEAST },
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
                  spacing: { before: 60, after: 60 },
                }),
              ],
              verticalAlign: VerticalAlign.CENTER,
              shading: rowIndex === 0 
                ? { fill: colors.primary }
                : rowIndex % 2 === 0 
                  ? { fill: colors.light } 
                  : { fill: "FFFFFF" },
              margins: {
                top: 60,
                bottom: 60,
                left: 120,
                right: 120,
              },
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
      
      children.push(new Paragraph({ spacing: { after: 300 } }));
    }
  }
  
  const doc = new Document({
    creator: "AETHER AI Suite - Workflow",
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
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${reference}`,
                    size: 18,
                    font: "Calibri",
                    color: "9CA3AF",
                  }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Document généré par AETHER Flow  │  ",
                    size: 18,
                    font: "Calibri",
                    color: "9CA3AF",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    font: "Calibri",
                    color: colors.primary,
                    bold: true,
                  }),
                  new TextRun({
                    text: " / ",
                    size: 18,
                    font: "Calibri",
                    color: "9CA3AF",
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18,
                    font: "Calibri",
                    color: colors.primary,
                    bold: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                border: {
                  top: {
                    color: "E5E7EB",
                    space: 8,
                    style: BorderStyle.SINGLE,
                    size: 6,
                  },
                },
              }),
            ],
          }),
        },
        children,
      },
    ],
  });
  
  return await Packer.toBuffer(doc);
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

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

    // Senior Intelligence: Classify document
    const classification = classifyDocument(title, prompt || content);
    const category = classification.category;

    console.log(`[Workflow Senior UX] Document: "${title}" → Category: ${category} (confidence: ${(classification.confidence * 100).toFixed(0)}%)`);
    console.log(`[Workflow Senior UX] Keywords detected: ${classification.detectedKeywords.join(', ') || 'none'}`);

    let documentContent = content || '';

    // If prompt is provided, generate content with AI using Senior Intelligence
    if (prompt && LOVABLE_API_KEY) {
      console.log(`[Workflow Senior UX] Generating document with AI for user ${userId}`);
      
      const systemPrompt = generateSeniorSystemPrompt(category, tone);
      
      const userPrompt = `DOCUMENT À RÉDIGER: ${category.toUpperCase().replace('_', ' ')}

TITRE: ${title}

${prompt ? `INSTRUCTIONS SPÉCIFIQUES:\n${prompt}` : 'Génère un document professionnel complet avec des données réalistes.'}

${context ? `CONTEXTE SUPPLÉMENTAIRE:\n${context}` : ''}

══════════════════════════════════════
GÉNÈRE LE DOCUMENT COMPLET, QUALITÉ SENIOR IRRÉPROCHABLE.
══════════════════════════════════════`;

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
            temperature: 0.7,
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
      } catch (aiError) {
        console.error('AI generation error:', aiError);
        documentContent = `${title}\n\n${prompt}\n\n${context || ''}`;
      }
    }

    // Validate and clean content
    const validation = cleanAndValidateContent(documentContent);
    console.log(`[Workflow Senior UX] Content quality score: ${validation.score}/100`);
    if (validation.issues.length > 0) {
      console.log(`[Workflow Senior UX] Issues fixed: ${validation.issues.join(', ')}`);
    }

    // Generate Word document with senior styling
    const docBuffer = await generateSeniorWordDocument(title, documentContent, category);
    
    // Upload to storage
    const fileName = `workflow-docs/${userId}/${Date.now()}-${title.replace(/[^a-zA-Z0-9àâäéèêëïîôùûüç\s-]/gi, '_')}.docx`;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, docBuffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
    }

    // Get download URL
    const { data: signedUrlData } = await supabase.storage
      .from('documents')
      .createSignedUrl(fileName, 60 * 60 * 24 * 7);

    // Create document in aether_documents
    const documentData: any = {
      user_id: userId,
      title,
      content: validation.cleaned,
      description: `Document généré par workflow${workflowId ? ` (workflow: ${workflowId})` : ''}`,
      file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      file_url: signedUrlData?.signedUrl || null,
      status: 'completed',
      embedding_status: 'pending',
      tags: tags ? JSON.stringify(tags) : JSON.stringify(['workflow', 'auto-generated']),
      metadata: JSON.stringify({
        source: 'workflow',
        workflow_id: workflowId,
        workflow_run_id: workflowRunId,
        generated_at: new Date().toISOString(),
        type: type || 'document',
        tone: tone || 'professional',
        category,
        generated_with: 'senior_intelligence',
        quality_score: validation.score,
        detected_keywords: classification.detectedKeywords
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

    console.log(`[Workflow Senior UX] Document created: ${document.id} for user ${userId}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        document: {
          id: document.id,
          title: document.title,
          content: validation.cleaned,
          file_url: signedUrlData?.signedUrl,
          file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          created_at: document.created_at,
          category,
          qualityScore: validation.score
        },
        _downloadData: {
          base64: btoa(String.fromCharCode(...docBuffer)),
          filename: `${title.replace(/[^a-zA-Z0-9àâäéèêëïîôùûüç\s-]/gi, '_')}.docx`,
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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
