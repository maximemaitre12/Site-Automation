import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, convertInchesToTwip, Table, TableRow, TableCell, WidthType, HeightRule, VerticalAlign, Header, Footer, PageNumber, ShadingType, TableBorders, convertMillimetersToTwip } from "https://esm.sh/docx@8.5.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateRequest {
  templateId: string;
  variables: Record<string, string>;
  title: string;
}

// ══════════════════════════════════════════════════════════════════════════════════════════
// SENIOR DOCUMENT INTELLIGENCE v3.0 - CONSULTING-GRADE QUALITY
// ══════════════════════════════════════════════════════════════════════════════════════════

type DocumentCategory = 
  | 'purchase_order' | 'invoice' | 'quote' | 'contract' 
  | 'memo' | 'meeting_notes' | 'letter' | 'report' 
  | 'proposal' | 'email' | 'procedure' | 'specification'
  | 'audit_report' | 'policy' | 'executive_brief' | 'board_memo'
  | 'investment_memo' | 'due_diligence' | 'strategic_plan' | 'generic';

type IndustryContext = 
  | 'finance' | 'consulting' | 'technology' | 'healthcare' 
  | 'manufacturing' | 'retail' | 'legal' | 'energy' | 'generic';

type AudienceLevel = 'board' | 'c_suite' | 'director' | 'manager' | 'operational';
type DocumentTone = 'executive' | 'formal' | 'professional' | 'technical' | 'persuasive';
type ComplexityLevel = 'simple' | 'standard' | 'complex' | 'executive';

interface ClassificationResult {
  category: DocumentCategory;
  confidence: number;
  detectedKeywords: string[];
  industry: IndustryContext;
  tone: DocumentTone;
  audience: AudienceLevel;
  complexity: ComplexityLevel;
}

// ══════════════════════════════════════════════════════════════════════════════════════════
// CLASSIFICATION ENGINE v3.0
// ══════════════════════════════════════════════════════════════════════════════════════════

const CLASSIFICATION_PATTERNS: Record<DocumentCategory, {
  keywords: string[];
  weight: number;
  audienceDefault: AudienceLevel;
  toneDefault: DocumentTone;
}> = {
  purchase_order: { keywords: ['bon de commande', 'purchase order', 'commande', 'bc', 'po', 'achats'], weight: 10, audienceDefault: 'operational', toneDefault: 'professional' },
  invoice: { keywords: ['facture', 'invoice', 'facturation', 'règlement', 'avoir'], weight: 10, audienceDefault: 'operational', toneDefault: 'formal' },
  quote: { keywords: ['devis', 'quotation', 'offre commerciale', 'proposition tarifaire', 'estimation'], weight: 9, audienceDefault: 'manager', toneDefault: 'persuasive' },
  contract: { keywords: ['contrat', 'accord', 'convention', 'agreement', 'avenant'], weight: 9, audienceDefault: 'director', toneDefault: 'formal' },
  memo: { keywords: ['note de service', 'mémo', 'memo', 'circulaire', 'note interne'], weight: 8, audienceDefault: 'manager', toneDefault: 'professional' },
  meeting_notes: { keywords: ['compte-rendu', 'procès-verbal', 'pv', 'réunion', 'cr'], weight: 8, audienceDefault: 'manager', toneDefault: 'professional' },
  report: { keywords: ['rapport', 'report', 'analyse', 'étude', 'bilan', 'synthèse'], weight: 7, audienceDefault: 'director', toneDefault: 'professional' },
  proposal: { keywords: ['proposition', 'proposal', 'offre de service', 'réponse appel'], weight: 8, audienceDefault: 'director', toneDefault: 'persuasive' },
  letter: { keywords: ['lettre', 'courrier', 'correspondance'], weight: 6, audienceDefault: 'manager', toneDefault: 'formal' },
  email: { keywords: ['email', 'mail', 'courriel'], weight: 5, audienceDefault: 'operational', toneDefault: 'professional' },
  procedure: { keywords: ['procédure', 'processus', 'mode opératoire', 'instruction'], weight: 7, audienceDefault: 'operational', toneDefault: 'technical' },
  specification: { keywords: ['cahier des charges', 'spécification', 'cdc', 'requirements'], weight: 8, audienceDefault: 'manager', toneDefault: 'technical' },
  audit_report: { keywords: ['audit', 'contrôle', 'conformité', 'inspection'], weight: 8, audienceDefault: 'director', toneDefault: 'formal' },
  policy: { keywords: ['politique', 'charte', 'règlement', 'directive'], weight: 7, audienceDefault: 'director', toneDefault: 'formal' },
  executive_brief: { keywords: ['brief exécutif', 'executive brief', 'synthèse exécutive'], weight: 9, audienceDefault: 'c_suite', toneDefault: 'executive' },
  board_memo: { keywords: ['mémo ca', 'conseil d\'administration', 'comex', 'board'], weight: 10, audienceDefault: 'board', toneDefault: 'executive' },
  investment_memo: { keywords: ['investment memo', 'mémo investissement', 'deal memo'], weight: 10, audienceDefault: 'c_suite', toneDefault: 'executive' },
  due_diligence: { keywords: ['due diligence', 'dd', 'audit d\'acquisition'], weight: 10, audienceDefault: 'c_suite', toneDefault: 'executive' },
  strategic_plan: { keywords: ['plan stratégique', 'strategic plan', 'roadmap', 'vision'], weight: 9, audienceDefault: 'board', toneDefault: 'executive' },
  generic: { keywords: [], weight: 0, audienceDefault: 'manager', toneDefault: 'professional' }
};

const INDUSTRY_KEYWORDS: Record<IndustryContext, string[]> = {
  finance: ['banque', 'investissement', 'fonds', 'crédit', 'assurance', 'private equity', 'trading', 'compliance', 'ebitda', 'irr'],
  consulting: ['cabinet', 'conseil', 'stratégie', 'transformation', 'mckinsey', 'bcg', 'bain', 'mission', 'deliverable'],
  technology: ['software', 'saas', 'cloud', 'développement', 'agile', 'api', 'data', 'ia', 'startup', 'tech'],
  healthcare: ['santé', 'médical', 'hôpital', 'pharma', 'patient', 'clinique'],
  manufacturing: ['industrie', 'production', 'usine', 'supply chain', 'lean', 'qualité', 'iso'],
  retail: ['distribution', 'magasin', 'e-commerce', 'merchandising', 'logistique'],
  legal: ['juridique', 'avocat', 'contentieux', 'droit', 'contrat', 'litige'],
  energy: ['énergie', 'électricité', 'pétrole', 'gaz', 'renouvelable', 'carbone', 'esg'],
  generic: []
};

function detectIndustry(text: string): IndustryContext {
  const lowered = text.toLowerCase();
  let bestIndustry: IndustryContext = 'generic';
  let bestScore = 0;
  
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowered.includes(keyword)) score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      bestIndustry = industry as IndustryContext;
    }
  }
  return bestIndustry;
}

function classifyDocument(title: string, content?: string): ClassificationResult {
  const combined = `${title} ${content || ''}`.toLowerCase();
  let bestCategory: DocumentCategory = 'generic';
  let bestScore = 0;
  const detectedKeywords: string[] = [];
  
  for (const [category, config] of Object.entries(CLASSIFICATION_PATTERNS)) {
    let score = 0;
    for (const keyword of config.keywords) {
      if (combined.includes(keyword.toLowerCase())) {
        score += config.weight;
        detectedKeywords.push(keyword);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category as DocumentCategory;
    }
  }
  
  const config = CLASSIFICATION_PATTERNS[bestCategory];
  const industry = detectIndustry(combined);
  
  // Determine complexity
  let complexity: ComplexityLevel = 'standard';
  if (['board_memo', 'investment_memo', 'due_diligence', 'strategic_plan', 'executive_brief'].includes(bestCategory)) {
    complexity = 'executive';
  } else if (['contract', 'audit_report', 'specification', 'proposal'].includes(bestCategory)) {
    complexity = 'complex';
  } else if (['email', 'memo'].includes(bestCategory)) {
    complexity = 'simple';
  }
  
  return {
    category: bestCategory,
    confidence: Math.min(bestScore / 30, 1),
    detectedKeywords: [...new Set(detectedKeywords)],
    industry,
    tone: config.toneDefault,
    audience: config.audienceDefault,
    complexity
  };
}

// ══════════════════════════════════════════════════════════════════════════════════════════
// SENIOR PROMPT ENGINE v3.0 - CONSULTING-GRADE
// ══════════════════════════════════════════════════════════════════════════════════════════

const SECTION_TEMPLATES: Record<DocumentCategory, string[]> = {
  purchase_order: ['EN-TÊTE', 'ÉMETTEUR', 'FOURNISSEUR', 'ADRESSE DE LIVRAISON', 'DÉTAIL DES ARTICLES', 'RÉCAPITULATIF', 'CONDITIONS', 'SIGNATURE'],
  invoice: ['EN-TÊTE FACTURE', 'ÉMETTEUR', 'DESTINATAIRE', 'DÉTAIL DES PRESTATIONS', 'RÉCAPITULATIF TVA', 'MONTANT TOTAL', 'CONDITIONS DE RÈGLEMENT', 'MENTIONS LÉGALES'],
  quote: ['EN-TÊTE DEVIS', 'NOTRE SOCIÉTÉ', 'CLIENT', 'CONTEXTE', 'OFFRE DÉTAILLÉE', 'RÉCAPITULATIF', 'CONDITIONS', 'ACCEPTATION'],
  contract: ['INTITULÉ', 'ENTRE LES PARTIES', 'PRÉAMBULE', 'OBJET', 'DURÉE', 'OBLIGATIONS', 'RÉMUNÉRATION', 'CONFIDENTIALITÉ', 'RÉSILIATION', 'SIGNATURES'],
  memo: ['EN-TÊTE', 'DE / À / DATE / OBJET', 'CONTEXTE', 'MESSAGE PRINCIPAL', 'ACTIONS REQUISES'],
  meeting_notes: ['EN-TÊTE', 'PARTICIPANTS', 'ORDRE DU JOUR', 'SYNTHÈSE DES ÉCHANGES', 'DÉCISIONS', 'PLAN D\'ACTIONS', 'PROCHAINE RÉUNION'],
  report: ['RÉSUMÉ EXÉCUTIF', 'CONTEXTE', 'ANALYSE', 'RECOMMANDATIONS', 'PLAN D\'ACTION', 'CONCLUSION'],
  proposal: ['PAGE DE GARDE', 'EXECUTIVE SUMMARY', 'COMPRÉHENSION DES ENJEUX', 'APPROCHE PROPOSÉE', 'LIVRABLES ET PLANNING', 'ÉQUIPE', 'INVESTISSEMENT'],
  letter: ['EN-TÊTE', 'DATE ET LIEU', 'DESTINATAIRE', 'OBJET', 'CORPS DE LETTRE', 'FORMULE DE POLITESSE', 'SIGNATURE'],
  email: ['OBJET', 'ACCROCHE', 'MESSAGE', 'CALL TO ACTION', 'SIGNATURE'],
  procedure: ['IDENTIFICATION', 'OBJET', 'PÉRIMÈTRE', 'RESPONSABILITÉS', 'ÉTAPES', 'ENREGISTREMENTS'],
  specification: ['PAGE DE GARDE', 'CONTEXTE', 'PÉRIMÈTRE', 'EXIGENCES FONCTIONNELLES', 'EXIGENCES TECHNIQUES', 'CONTRAINTES', 'PLANNING'],
  audit_report: ['SYNTHÈSE', 'MÉTHODOLOGIE', 'CONSTATS', 'NON-CONFORMITÉS', 'RECOMMANDATIONS', 'PLAN D\'ACTION'],
  policy: ['IDENTIFICATION', 'OBJET', 'CHAMP D\'APPLICATION', 'PRINCIPES', 'RÈGLES', 'CONTRÔLE', 'ENTRÉE EN VIGUEUR'],
  executive_brief: ['POINTS CLÉS', 'CONTEXTE', 'ANALYSE', 'OPTIONS', 'RECOMMANDATION', 'DÉCISION REQUISE'],
  board_memo: ['SYNTHÈSE POUR LE CONSEIL', 'CONTEXTE STRATÉGIQUE', 'ANALYSE', 'IMPACTS', 'RÉSOLUTION PROPOSÉE'],
  investment_memo: ['EXECUTIVE SUMMARY', 'THÈSE D\'INVESTISSEMENT', 'ANALYSE MARCHÉ', 'ANALYSE FINANCIÈRE', 'VALORISATION', 'RISQUES', 'RECOMMANDATION'],
  due_diligence: ['SYNTHÈSE EXÉCUTIVE', 'QUALITY OF EARNINGS', 'ANALYSE BILAN', 'RED FLAGS', 'AJUSTEMENTS', 'RECOMMANDATIONS'],
  strategic_plan: ['EXECUTIVE SUMMARY', 'DIAGNOSTIC', 'VISION', 'AXES STRATÉGIQUES', 'TRAJECTOIRE FINANCIÈRE', 'FEUILLE DE ROUTE'],
  generic: ['INTRODUCTION', 'CONTENU', 'CONCLUSION']
};

function generateSeniorSystemPrompt(classification: ClassificationResult): string {
  const { category, industry, audience, complexity } = classification;
  const sections = SECTION_TEMPLATES[category];
  
  const experienceLevel = complexity === 'executive' ? '35' : complexity === 'complex' ? '25' : '20';
  const roleTitle = complexity === 'executive' ? 'SENIOR PARTNER (McKinsey/BCG)' : complexity === 'complex' ? 'DIRECTEUR SENIOR' : 'MANAGER EXPÉRIMENTÉ';

  return `Tu es un ${roleTitle} avec ${experienceLevel}+ ans d'expérience en rédaction de documents professionnels pour des entreprises du CAC40, fonds d'investissement internationaux et cabinets de conseil de premier rang.

════════════════════════════════════════════════════════════════════════════════
RÈGLES CRITIQUES - VIOLATION = ÉCHEC TOTAL
════════════════════════════════════════════════════════════════════════════════

🚫 INTERDIT - NE FAIS JAMAIS CECI:
• Placeholders: [À compléter], [Insérer], [TBD], [Date], [Nom]...
• Markdown: #, ##, **, *, \`\`\`, ---, ___
• Meta-talk IA: "Voici le document", "Ce document présente", "Comme demandé"
• Fausses données évidentes: SIRET 123456789, exemple@email.com, 1 rue du Test
• Phrases creuses et remplissage générique

✅ OBLIGATOIRE:
• Données RÉALISTES et CRÉDIBLES (invente si nécessaire)
• Entrée DIRECTE dans le contenu professionnel
• Chaque phrase apporte de la VALEUR
• Précision et concision maximales

════════════════════════════════════════════════════════════════════════════════
FORMAT DOCUMENT: ${category.toUpperCase().replace(/_/g, ' ')}
AUDIENCE: ${audience.toUpperCase()} | INDUSTRIE: ${industry.toUpperCase()}
════════════════════════════════════════════════════════════════════════════════

STRUCTURE ATTENDUE:
${sections.map((s, i) => `${i + 1}. ${s}`).join('\n')}

TABLEAUX (pour documents transactionnels):
| Colonne | Colonne | Colonne |
| Données | Données | Données |

DONNÉES À INVENTER SI NON FOURNIES:
• Référence: Format BC-2025-XXXX, FA-2025-XXXX, DEV-2025-XXXX
• SIRET: 14 chiffres réalistes (ex: 847 952 361 00024)
• TVA: FR + 2 chiffres + SIREN (ex: FR 56 847952361)
• Adresses: Adresses françaises plausibles
• Montants: Réalistes avec 2 décimales, TVA 20%

════════════════════════════════════════════════════════════════════════════════
QUALITÉ FINALE: Document prêt à être présenté à un ${audience === 'board' ? 'Conseil d\'Administration' : audience === 'c_suite' ? 'Comité de Direction' : 'client exigeant'}
════════════════════════════════════════════════════════════════════════════════`;
}

// ══════════════════════════════════════════════════════════════════════════════════════════
// CONTENT VALIDATION v3.0
// ══════════════════════════════════════════════════════════════════════════════════════════

interface ValidationResult {
  cleaned: string;
  score: number;
  grade: string;
  issues: string[];
  reliabilityScore: number;
}

const FORBIDDEN_PATTERNS = [
  'Voici le document', 'Voici le contenu', 'Ce document présente', 'Ce document décrit',
  'N\'hésitez pas à', 'Je reste à votre disposition', 'Comme demandé',
  '[À compléter]', '[Insérer]', '[TBD]', '[Votre nom]', '[Date]', '[Montant]',
  '**', '##', '###', '```', '---', '___',
  'SIRET 123 456 789', 'exemple@email.com', 'test@test.com',
  'Lorem ipsum', 'Xxx', 'Yyy'
];

function cleanAndValidateContent(content: string): ValidationResult {
  const issues: string[] = [];
  let cleaned = content;
  let score = 100;
  let reliabilityScore = 100;
  
  // Remove forbidden patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (regex.test(cleaned)) {
      issues.push(`Supprimé: "${pattern.slice(0, 25)}..."`);
      score -= pattern.includes('[') ? 8 : 4;
      reliabilityScore -= 5;
      cleaned = cleaned.replace(regex, '');
    }
  }
  
  // Clean markdown
  cleaned = cleaned
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#{1,6}\s+(.+)$/gm, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/^---+$/gm, '')
    .replace(/^>\s+(.+)$/gm, '$1')
    .replace(/`([^`]+)`/g, '$1');
  
  // Remove invalid brackets
  const bracketMatches = cleaned.match(/\[[^\]|]*\]/g);
  if (bracketMatches) {
    for (const bracket of bracketMatches) {
      if (bracket.toLowerCase().includes('compléter') || 
          bracket.toLowerCase().includes('insérer') ||
          bracket.includes('...') || bracket === '[]') {
        cleaned = cleaned.replace(bracket, '');
        issues.push(`Placeholder supprimé: ${bracket.slice(0, 25)}...`);
        score -= 8;
        reliabilityScore -= 10;
      }
    }
  }
  
  // Final cleanup
  cleaned = cleaned
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/[ \t]+$/gm, '')
    .replace(/^\s*\n/gm, '\n')
    .trim();
  
  // Reliability checks
  if (cleaned.length < 200) {
    reliabilityScore -= 20;
    issues.push('Contenu trop court');
  }
  if (!/\d/.test(cleaned)) {
    reliabilityScore -= 10;
    issues.push('Aucun chiffre détecté');
  }
  
  const grade = score >= 95 ? 'A+' : score >= 85 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F';
  
  return { cleaned, score: Math.max(0, score), grade, issues, reliabilityScore: Math.max(0, reliabilityScore) };
}

// ══════════════════════════════════════════════════════════════════════════════════════════
// CONTENT PARSING v3.0
// ══════════════════════════════════════════════════════════════════════════════════════════

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
  let tableRows: string[][] = [];
  let inTable = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Table detection
    if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
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
      continue;
    }
    
    // Uppercase headings (main sections)
    if (/^[A-ZÉÈÀÙÂÊÎÔÛÄËÏÖÜ][A-ZÉÈÀÙÂÊÎÔÛÄËÏÖÜ\s\-\d'']{2,}$/.test(trimmedLine) && trimmedLine.length <= 60) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      sections.push({ type: 'heading', level: 1, text: trimmedLine });
      continue;
    }
    
    // Numbered headings
    const numberedMatch = trimmedLine.match(/^(ARTICLE\s+)?(\d+(?:\.\d+)*)[.\-\s]+(.+)$/i);
    if (numberedMatch && trimmedLine.length <= 80) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      const depth = numberedMatch[2].split('.').length;
      sections.push({ type: 'heading', level: Math.min(depth + 1, 3), text: trimmedLine });
      continue;
    }
    
    // Section with colon
    if (/^[A-ZÉÈÀÙÂÊÎÔÛ][a-zéèàùâêîôûäëïöü\s]{0,20}:/.test(trimmedLine) && trimmedLine.length <= 60) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      sections.push({ type: 'heading', level: 2, text: trimmedLine });
      continue;
    }
    
    // Bullet points
    if (/^[•\-\*✓✗▸►]\s+/.test(trimmedLine)) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      const item = trimmedLine.replace(/^[•\-\*✓✗▸►]\s+/, '');
      const lastSection = sections[sections.length - 1];
      if (lastSection?.type === 'list') {
        lastSection.items?.push(item);
      } else {
        sections.push({ type: 'list', text: '', items: [item] });
      }
      continue;
    }
    
    // Regular paragraph
    currentParagraph += (currentParagraph ? ' ' : '') + trimmedLine;
  }
  
  // Flush remaining
  if (currentParagraph) {
    sections.push({ type: 'paragraph', text: currentParagraph.trim() });
  }
  if (tableRows.length > 0) {
    sections.push({ type: 'table', text: '', rows: tableRows });
  }
  
  return sections;
}

// ══════════════════════════════════════════════════════════════════════════════════════════
// CONSULTING-GRADE COLOR SCHEMES v3.0
// ══════════════════════════════════════════════════════════════════════════════════════════

const COLOR_SCHEMES: Record<DocumentCategory, { primary: string; accent: string; light: string; headerBg: string }> = {
  purchase_order: { primary: '1E3A5F', accent: '2E7D32', light: 'F0F7F0', headerBg: '1E3A5F' },
  invoice: { primary: '1F2937', accent: '1976D2', light: 'EFF6FF', headerBg: '1F2937' },
  quote: { primary: '0D47A1', accent: 'FF6F00', light: 'FFF8E1', headerBg: '0D47A1' },
  contract: { primary: '1B1B1B', accent: '374151', light: 'F3F4F6', headerBg: '1B1B1B' },
  memo: { primary: '1565C0', accent: '0277BD', light: 'E3F2FD', headerBg: '1565C0' },
  meeting_notes: { primary: '2E7D32', accent: '388E3C', light: 'E8F5E9', headerBg: '2E7D32' },
  report: { primary: '1A237E', accent: '283593', light: 'E8EAF6', headerBg: '1A237E' },
  proposal: { primary: '4527A0', accent: '7B1FA2', light: 'F3E5F5', headerBg: '4527A0' },
  letter: { primary: '37474F', accent: '455A64', light: 'ECEFF1', headerBg: '37474F' },
  email: { primary: '424242', accent: '616161', light: 'FAFAFA', headerBg: '424242' },
  procedure: { primary: '00695C', accent: '00897B', light: 'E0F2F1', headerBg: '00695C' },
  specification: { primary: '1565C0', accent: '1976D2', light: 'E3F2FD', headerBg: '1565C0' },
  audit_report: { primary: 'B71C1C', accent: 'C62828', light: 'FFEBEE', headerBg: 'B71C1C' },
  policy: { primary: '4A148C', accent: '6A1B9A', light: 'F3E5F5', headerBg: '4A148C' },
  executive_brief: { primary: '0D47A1', accent: '1565C0', light: 'E3F2FD', headerBg: '0D47A1' },
  board_memo: { primary: '1B5E20', accent: '2E7D32', light: 'E8F5E9', headerBg: '1B5E20' },
  investment_memo: { primary: '311B92', accent: '4527A0', light: 'EDE7F6', headerBg: '311B92' },
  due_diligence: { primary: 'BF360C', accent: 'D84315', light: 'FBE9E7', headerBg: 'BF360C' },
  strategic_plan: { primary: '006064', accent: '00838F', light: 'E0F7FA', headerBg: '006064' },
  generic: { primary: '1F2937', accent: '3B82F6', light: 'EFF6FF', headerBg: '1F2937' }
};

function generateEnrichedReference(category: DocumentCategory): { reference: string; date: string } {
  const now = new Date();
  const year = now.getFullYear();
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  
  const prefixes: Record<DocumentCategory, string> = {
    purchase_order: 'BC', invoice: 'FA', quote: 'DEV', contract: 'CTR',
    memo: 'NS', meeting_notes: 'CR', report: 'RAP', proposal: 'PROP',
    letter: 'COU', email: 'MSG', procedure: 'PROC', specification: 'CDC',
    audit_report: 'AUD', policy: 'POL', executive_brief: 'BRIEF',
    board_memo: 'BOARD', investment_memo: 'INV', due_diligence: 'DD',
    strategic_plan: 'STRAT', generic: 'DOC'
  };
  
  return {
    reference: `${prefixes[category]}-${year}-${String(randomNum).padStart(4, '0')}`,
    date: now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  };
}

// ══════════════════════════════════════════════════════════════════════════════════════════
// SENIOR WORD DOCUMENT GENERATION v3.0 - McKINSEY/BCG STYLE
// ══════════════════════════════════════════════════════════════════════════════════════════

async function generateSeniorWordDocument(
  title: string, 
  content: string, 
  classification: ClassificationResult,
  validation: ValidationResult
): Promise<Uint8Array> {
  const sections = parseContentIntoSections(validation.cleaned);
  const { category, complexity, audience } = classification;
  const colors = COLOR_SCHEMES[category];
  const { reference, date } = generateEnrichedReference(category);
  
  const children: any[] = [];
  const isExecutive = complexity === 'executive' || audience === 'board' || audience === 'c_suite';
  
  // ══════════════════════════════════════════════════════════════════════════════════
  // COVER BLOCK - CONSULTING STYLE
  // ══════════════════════════════════════════════════════════════════════════════════
  
  if (isExecutive) {
    // Confidentiality banner
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "  STRICTEMENT CONFIDENTIEL  ",
            bold: true,
            size: 18,
            font: "Calibri",
            color: "FFFFFF",
            allCaps: true,
          }),
        ],
        alignment: AlignmentType.RIGHT,
        shading: { fill: 'C62828', type: ShadingType.SOLID },
        spacing: { after: 200 },
      })
    );
  }
  
  // Quality indicator badge
  const qualityEmoji = validation.grade === 'A+' || validation.grade === 'A' ? '✓' : validation.grade === 'B' ? '◐' : '⚠';
  const qualityColor = validation.grade === 'A+' || validation.grade === 'A' ? '2E7D32' : validation.grade === 'B' ? 'FF8F00' : 'C62828';
  
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${qualityEmoji} Qualité: ${validation.grade} (${validation.score}/100)`,
          size: 16,
          font: "Calibri",
          color: qualityColor,
        }),
        new TextRun({
          text: `  │  Fiabilité: ${validation.reliabilityScore}%`,
          size: 16,
          font: "Calibri",
          color: validation.reliabilityScore >= 80 ? '2E7D32' : validation.reliabilityScore >= 60 ? 'FF8F00' : 'C62828',
        }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 300 },
    })
  );
  
  // Main title with accent bar
  children.push(
    new Paragraph({
      border: {
        left: {
          color: colors.accent,
          space: 15,
          style: BorderStyle.SINGLE,
          size: 48,
        },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: isExecutive ? 56 : 48,
          font: "Calibri Light",
          color: colors.primary,
        }),
      ],
      spacing: { before: 200, after: 100 },
      indent: { left: convertInchesToTwip(0.3) },
    })
  );
  
  // Reference & date line
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
          text: `   │   ${date}`,
          size: 22,
          font: "Calibri",
          color: '6B7280',
        }),
        new TextRun({
          text: `   │   ${category.replace(/_/g, ' ').toUpperCase()}`,
          size: 18,
          font: "Calibri",
          color: '9CA3AF',
        }),
      ],
      spacing: { after: 100 },
      indent: { left: convertInchesToTwip(0.3) },
    })
  );
  
  // Separator line
  children.push(
    new Paragraph({
      border: {
        bottom: {
          color: colors.light.replace('#', ''),
          space: 1,
          style: BorderStyle.SINGLE,
          size: 24,
        },
      },
      spacing: { after: 400 },
    })
  );
  
  // ══════════════════════════════════════════════════════════════════════════════════
  // CONTENT SECTIONS - PROFESSIONAL FORMATTING
  // ══════════════════════════════════════════════════════════════════════════════════
  
  for (const section of sections) {
    if (section.type === 'heading') {
      const level = section.level || 1;
      const fontSize = level === 1 ? 30 : level === 2 ? 26 : 22;
      const color = level === 1 ? colors.primary : level === 2 ? colors.accent : '4B5563';
      const spaceBefore = level === 1 ? 400 : level === 2 ? 300 : 200;
      
      const headingParagraph: any = {
        children: [
          new TextRun({
            text: section.text,
            bold: true,
            size: fontSize,
            font: level === 1 ? "Calibri Light" : "Calibri",
            color: color,
          }),
        ],
        spacing: { before: spaceBefore, after: level === 1 ? 200 : 150 },
      };
      
      // Add left border for level 1 headings (consulting style)
      if (level === 1) {
        headingParagraph.border = {
          left: {
            color: colors.accent,
            space: 10,
            style: BorderStyle.SINGLE,
            size: 24,
          },
        };
        headingParagraph.indent = { left: convertInchesToTwip(0.2) };
      }
      
      children.push(new Paragraph(headingParagraph));
      
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
                text: "► ",
                size: 22,
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
          height: { value: 500, rule: HeightRule.ATLEAST },
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
                  spacing: { before: 80, after: 80 },
                }),
              ],
              verticalAlign: VerticalAlign.CENTER,
              shading: rowIndex === 0 
                ? { fill: colors.headerBg, type: ShadingType.SOLID }
                : rowIndex % 2 === 0 
                  ? { fill: colors.light, type: ShadingType.SOLID } 
                  : { fill: "FFFFFF", type: ShadingType.SOLID },
              margins: { top: 80, bottom: 80, left: 150, right: 150 },
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
  
  // ══════════════════════════════════════════════════════════════════════════════════
  // DOCUMENT ASSEMBLY
  // ══════════════════════════════════════════════════════════════════════════════════
  
  const doc = new Document({
    creator: "AETHER AI Suite - Senior Document Intelligence v3.0",
    title: title,
    description: `Document ${category} - Qualité ${validation.grade}`,
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 24 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.8),
              right: convertInchesToTwip(0.9),
              bottom: convertInchesToTwip(0.8),
              left: convertInchesToTwip(0.9),
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
                  new TextRun({
                    text: isExecutive ? `  │  ${audience.toUpperCase()}  │  ` : '  │  ',
                    size: 18,
                    font: "Calibri",
                    color: "9CA3AF",
                  }),
                  new TextRun({
                    text: `v3.0`,
                    size: 16,
                    font: "Calibri",
                    color: colors.accent,
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
                border: {
                  top: { color: "E5E7EB", space: 8, style: BorderStyle.SINGLE, size: 6 },
                },
                children: [
                  new TextRun({
                    text: "AETHER Document Intelligence",
                    size: 16,
                    font: "Calibri",
                    color: "9CA3AF",
                  }),
                  new TextRun({
                    text: "  │  Qualité: ",
                    size: 16,
                    font: "Calibri",
                    color: "9CA3AF",
                  }),
                  new TextRun({
                    text: validation.grade,
                    size: 16,
                    font: "Calibri",
                    color: qualityColor,
                    bold: true,
                  }),
                  new TextRun({
                    text: "  │  Page ",
                    size: 16,
                    font: "Calibri",
                    color: "9CA3AF",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    font: "Calibri",
                    color: colors.primary,
                    bold: true,
                  }),
                  new TextRun({
                    text: " / ",
                    size: 16,
                    font: "Calibri",
                    color: "9CA3AF",
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    font: "Calibri",
                    color: colors.primary,
                    bold: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
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

// ══════════════════════════════════════════════════════════════════════════════════════════
// MAIN HANDLER v3.0
// ══════════════════════════════════════════════════════════════════════════════════════════

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
    
    // === SENIOR INTELLIGENCE v3.0: CLASSIFY DOCUMENT ===
    const userPrompt = variables.prompt || '';
    const classification = classifyDocument(title, userPrompt);
    const { category, industry, tone, audience, complexity } = classification;

    console.log(`[Senior UX v3.0] Document: "${title}"`);
    console.log(`[Senior UX v3.0] Classification: ${category} | Industry: ${industry} | Audience: ${audience} | Complexity: ${complexity}`);
    
    // === GENERATE SENIOR PROMPTS ===
    const systemPrompt = generateSeniorSystemPrompt(classification);
    
    const generatePrompt = `DOCUMENT À PRODUIRE: ${category.toUpperCase().replace(/_/g, ' ')}

TITRE: ${title}

${userPrompt ? `INSTRUCTIONS SPÉCIFIQUES DU CLIENT:\n${userPrompt}` : 'Génère un document professionnel complet avec des données réalistes et crédibles.'}

${Object.keys(variables).filter(k => k !== 'prompt' && variables[k]).length > 0 ? 
  `INFORMATIONS FOURNIES:\n${Object.entries(variables).filter(([k, v]) => k !== 'prompt' && v).map(([k, v]) => `• ${k}: ${v}`).join('\n')}` : ''}

════════════════════════════════════════════════════════════════
GÉNÈRE MAINTENANT LE DOCUMENT COMPLET
Niveau attendu: ${complexity.toUpperCase()} - Audience: ${audience.toUpperCase()}
Le document doit être IMMÉDIATEMENT UTILISABLE sans modification.
════════════════════════════════════════════════════════════════`;

    // Use PRO model for executive documents, FLASH for others
    const model = complexity === 'executive' ? 'google/gemini-2.5-pro' : 'google/gemini-2.5-flash';
    
    console.log(`[Senior UX v3.0] Using model: ${model}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: generatePrompt },
        ],
        temperature: 0.6,
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

    // === VALIDATE AND CLEAN CONTENT ===
    const validation = cleanAndValidateContent(content);
    console.log(`[Senior UX v3.0] Quality: ${validation.grade} (${validation.score}/100) | Reliability: ${validation.reliabilityScore}%`);
    if (validation.issues.length > 0) {
      console.log(`[Senior UX v3.0] Issues fixed: ${validation.issues.length}`);
    }

    // === GENERATE WORD DOCUMENT WITH CONSULTING-GRADE STYLING ===
    const docBuffer = await generateSeniorWordDocument(title, content, classification, validation);
    
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

    // Create the document in the database
    const { data: document, error: insertError } = await supabase
      .from('aether_documents')
      .insert({
        user_id: user.id,
        title,
        content: validation.cleaned,
        template_id: templateId,
        file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        file_url: signedUrlData?.signedUrl || null,
        status: 'completed',
        embedding_status: 'pending',
        metadata: JSON.stringify({ 
          category,
          industry,
          audience,
          complexity,
          generated_with: 'senior_intelligence_v3',
          quality_score: validation.score,
          quality_grade: validation.grade,
          reliability_score: validation.reliabilityScore,
          detected_keywords: classification.detectedKeywords,
          model_used: model
        })
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error('Failed to save document');
    }

    console.log(`[Senior UX v3.0] Document generated successfully: ${document.id}`);

    return new Response(
      JSON.stringify({ 
        document,
        downloadUrl: signedUrlData?.signedUrl,
        documentId: document.id,
        category,
        industry,
        audience,
        complexity,
        qualityScore: validation.score,
        qualityGrade: validation.grade,
        reliabilityScore: validation.reliabilityScore,
        modelUsed: model
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
