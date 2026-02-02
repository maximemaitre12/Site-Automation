// Intent detection patterns for automatic mode selection (French + English)
const IMAGE_PATTERNS = [
  /gen[eè]re?\s*(une?|moi)?\s*(image|photo|illustration|logo|dessin|visuel|poster|affiche)/i,
  /cr[eé]e?\s*(une?|moi)?\s*(image|photo|illustration|logo|dessin)/i,
  /fais\s*(moi)?\s*(une?)?\s*(image|photo|illustration|logo|dessin|visuel|poster|affiche)/i,
  /dessine/i,
  /montre\s*moi\s*(à quoi|comment)/i,
  /imagine\s*(une?|un)/i,
  /^(logo|image|photo|illustration|visuel)\b/i,
  /make\s*(an?|me)?\s*(image|picture|photo|illustration)/i,
  /generate\s*(an?|me)?\s*(image|picture|photo)/i,
  /create\s*(an?|me)?\s*(image|picture|photo|illustration)/i,
  /draw\s*(me)?\s*(a|an)?/i,
  /show\s*me\s*(what|how)/i,
  /visualize\s*(a|an|the)?/i,
  /picture\s*of/i,
];

const CHART_PATTERNS = [
  /gen[eè]re?\s*(un|moi)?\s*(graph(ique)?|chart|diagramme|camembert|histogramme|courbe)/i,
  /cr[eé]e?\s*(un|moi)?\s*(graph(ique)?|chart|diagramme)/i,
  /fais\s*(moi)?\s*(un)?\s*(graph(ique)?|chart|diagramme|camembert|histogramme|courbe)/i,
  /visualise?\s*(les)?\s*(donn[eé]es|data|chiffres|statistiques)/i,
  /repr[eé]sente?\s*(graphiquement|visuellement)/i,
  /trace\s*(une?)?\s*(courbe|graph)/i,
  /^(graph(ique)?|chart|diagramme|camembert|histogramme|courbe)\b/i,
  /pie\s*chart|bar\s*chart|line\s*chart/i,
  /create\s*(a|an)?\s*(chart|graph|diagram|pie|bar|histogram)/i,
  /make\s*(a|an)?\s*(chart|graph|diagram)/i,
  /plot\s*(a|an|the)?/i,
  /visualize\s*(the)?\s*(data|statistics|numbers)/i,
];

// Patterns for platform/data questions that need real-time context
const PLATFORM_CONTEXT_PATTERNS = [
  // Flow/Workflow questions
  /combien\s*(de|d')?\s*(workflows?|flux|automatisations?)/i,
  /workflows?\s*(actifs?|en cours|créés?)/i,
  /mes\s*(workflows?|flux|automatisations?)/i,
  /quels?\s*(sont)?\s*(mes|les)?\s*(workflows?|flux)/i,
  /liste\s*(des?|mes)?\s*(workflows?|flux)/i,
  /état\s*(des?|du)?\s*(workflows?|flux)/i,
  /statut\s*(des?|du)?\s*(workflows?|flux)/i,
  /workflow\s*(stats?|statistiques?)/i,
  /how\s*many\s*workflows?/i,
  /my\s*workflows?/i,
  /list\s*(my|all)?\s*workflows?/i,
  /active\s*workflows?/i,
  
  // Sales/CRM questions
  /combien\s*(de|d')?\s*(deals?|opportunit[eé]s?|ventes?|affaires?)/i,
  /mes\s*(deals?|opportunit[eé]s?|ventes?|prospects?|clients?)/i,
  /pipeline\s*(de)?\s*(ventes?|sales)/i,
  /chiffre\s*(d'affaires?|CA)/i,
  /valeur\s*(totale|du)?\s*(pipeline|portefeuille)/i,
  /sales\s*(stats?|statistics?|data|pipeline)/i,
  /my\s*(deals?|opportunities|sales|prospects)/i,
  /total\s*(pipeline|revenue|sales)/i,
  
  // HR questions
  /combien\s*(de|d')?\s*(candidats?|employ[eé]s?|recrutements?)/i,
  /mes\s*(candidats?|employ[eé]s?|recrutements?)/i,
  /liste\s*(des?)?\s*(candidats?|employ[eé]s?)/i,
  /[eé]quipe|team|effectif/i,
  /how\s*many\s*(candidates?|employees?|hires?)/i,
  /my\s*(candidates?|employees?|team)/i,
  
  // Support questions
  /combien\s*(de|d')?\s*(tickets?|demandes?|r[eé]clamations?)/i,
  /tickets?\s*(ouverts?|en cours|r[eé]solus?)/i,
  /mes\s*tickets?/i,
  /support\s*(stats?|statistiques?)/i,
  /how\s*many\s*tickets?/i,
  /open\s*tickets?/i,
  
  // Documents questions
  /combien\s*(de|d')?\s*(documents?|fichiers?)/i,
  /mes\s*(documents?|fichiers?)/i,
  /liste\s*(des?)?\s*(documents?|fichiers?)/i,
  /how\s*many\s*(documents?|files?)/i,
  /my\s*(documents?|files?)/i,
  
  // Compliance/ESG questions  
  /alertes?\s*(de)?\s*(conformit[eé]|compliance)/i,
  /indicateurs?\s*(ESG|environnement)/i,
  /score\s*(de)?\s*(conformit[eé]|compliance|ESG)/i,
  /compliance\s*(alerts?|score|status)/i,
  /ESG\s*(KPIs?|indicators?|score)/i,
  
  // General platform data questions
  /donn[eé]es?\s*(de)?\s*(la)?\s*plateforme/i,
  /statistiques?\s*(de)?\s*(la)?\s*plateforme/i,
  /r[eé]sum[eé]\s*(de)?\s*(mon|mes)?\s*(activit[eé]|donn[eé]es)/i,
  /tableau\s*de\s*bord/i,
  /dashboard\s*(stats?|data)/i,
  /platform\s*(data|statistics?|summary)/i,
  /my\s*(data|activity|summary)/i,
  /overview\s*(of)?\s*(my|the)?\s*(data|platform)/i,
  
  // CRM specific
  /contacts?\s*(CRM)?/i,
  /entreprises?\s*(enrichies?|CRM)/i,
  /mes\s*(contacts?|entreprises?)/i,
  /crm\s*(data|contacts?|companies?)/i,
];

export type IntentType = 'chat' | 'image' | 'chart';

/**
 * Detects the user's intent from their message
 * Uses local pattern matching for speed
 */
export function detectIntent(message: string): IntentType {
  const normalizedMessage = message.toLowerCase().trim();
  
  // Check for chart patterns first (more specific)
  for (const pattern of CHART_PATTERNS) {
    if (pattern.test(normalizedMessage)) {
      return 'chart';
    }
  }
  
  // Then check for image patterns
  for (const pattern of IMAGE_PATTERNS) {
    if (pattern.test(normalizedMessage)) {
      return 'image';
    }
  }
  
  // Default to chat
  return 'chat';
}

/**
 * Detects if the message requires platform context (real-time data)
 * This is separate from the main intent to allow combining with other intents
 */
export function needsPlatformContext(message: string): boolean {
  const normalizedMessage = message.toLowerCase().trim();
  
  for (const pattern of PLATFORM_CONTEXT_PATTERNS) {
    if (pattern.test(normalizedMessage)) {
      return true;
    }
  }
  
  return false;
}
