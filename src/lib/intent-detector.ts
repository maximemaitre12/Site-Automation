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
