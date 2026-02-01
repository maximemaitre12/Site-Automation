/**
 * PPTX JSON Repair Utility
 * Ensures generated presentation JSON is valid and complete
 */

interface SlideSection {
  heading: string;
  points: string[];
}

interface SlideStat {
  value: string;
  label: string;
  subtext?: string;
}

interface SlideTestimonial {
  quote: string;
  author: string;
  role?: string;
  company?: string;
}

interface SlideTimeline {
  phase: string;
  description: string;
  duration: string;
}

type SlideType = 'title' | 'executive_summary' | 'context' | 'problem' | 'solution' | 'benefits' | 'proof' | 'financials' | 'roadmap' | 'risks' | 'team' | 'cta' | 'contact' | 'appendix';

interface PresentationSlide {
  type: SlideType;
  title: string;
  subtitle?: string;
  content?: string;
  sections?: SlideSection[];
  bullets?: string[];
  keyMessage?: string;
  notes?: string;
  stats?: SlideStat[];
  testimonial?: SlideTestimonial;
  timeline?: SlideTimeline[];
}

interface PresentationData {
  title: string;
  subtitle?: string;
  executiveSummary?: string;
  slides: PresentationSlide[];
}

// Valid slide types mapping (normalize any variant)
const SLIDE_TYPE_MAP: Record<string, SlideType> = {
  'title': 'title',
  'executive_summary': 'executive_summary',
  'executivesummary': 'executive_summary',
  'summary': 'executive_summary',
  'context': 'context',
  'problem': 'problem',
  'diagnostic': 'problem',
  'challenge': 'problem',
  'solution': 'solution',
  'proposition': 'solution',
  'proposal': 'solution',
  'benefits': 'benefits',
  'value': 'benefits',
  'proof': 'proof',
  'financials': 'proof',
  'business_case': 'proof',
  'kpis': 'proof',
  'roadmap': 'roadmap',
  'timeline': 'roadmap',
  'planning': 'roadmap',
  'cta': 'cta',
  'call_to_action': 'cta',
  'recommendation': 'cta',
  'next_steps': 'cta',
  'contact': 'contact',
  'risks': 'risks',
  'team': 'team',
  'appendix': 'appendix',
};

// Default slide structure for each type
const DEFAULT_SLIDES: Record<string, Partial<PresentationSlide>> = {
  title: {
    type: 'title',
    title: 'Proposition Stratégique',
    subtitle: 'Créer de la valeur par l\'excellence opérationnelle',
    keyMessage: 'Une opportunité unique de transformation'
  },
  executive_summary: {
    type: 'executive_summary',
    title: 'Synthèse Exécutive',
    sections: [
      { heading: 'Contexte', points: ['Point clé 1', 'Point clé 2', 'Point clé 3'] },
      { heading: 'Recommandation', points: ['Action 1', 'Action 2', 'Action 3'] }
    ],
    keyMessage: 'Une proposition à forte valeur ajoutée'
  },
  problem: {
    type: 'problem',
    title: 'Diagnostic Stratégique',
    sections: [
      { heading: 'Enjeux Marché', points: ['Enjeu 1', 'Enjeu 2'] },
      { heading: 'Défis Internes', points: ['Défi 1', 'Défi 2'] }
    ],
    keyMessage: 'Le statu quo n\'est pas une option'
  },
  solution: {
    type: 'solution',
    title: 'Notre Proposition',
    sections: [
      { heading: 'Pilier 1', points: ['Initiative 1', 'Initiative 2'] },
      { heading: 'Pilier 2', points: ['Initiative 3', 'Initiative 4'] }
    ],
    keyMessage: 'Une approche éprouvée générant des résultats mesurables'
  },
  proof: {
    type: 'proof',
    title: 'Business Case et Création de Valeur',
    stats: [
      { value: '+25%', label: 'ROI', subtext: 'vs benchmark' },
      { value: '2.5x', label: 'Payback', subtext: 'en 18 mois' },
      { value: '15M€', label: 'Valeur créée', subtext: 'sur 3 ans' },
      { value: '95%', label: 'Taux succès', subtext: 'projets similaires' }
    ],
    testimonial: {
      quote: 'Cette approche a transformé notre performance opérationnelle.',
      author: 'Directeur Général',
      company: 'Entreprise du CAC40'
    },
    keyMessage: 'Un business case robuste validé par l\'expérience'
  },
  cta: {
    type: 'cta',
    title: 'Recommandation et Prochaines Étapes',
    sections: [
      { heading: 'Actions Immédiates', points: ['Valider le budget', 'Constituer l\'équipe', 'Lancer la phase 1'] }
    ],
    keyMessage: 'Chaque mois de retard représente une opportunité manquée'
  }
};

/**
 * Normalize slide type to a valid type
 */
function normalizeSlideType(type: string): SlideType {
  if (!type) return 'solution';
  const cleanType = type.toLowerCase().split('|')[0].trim();
  return SLIDE_TYPE_MAP[cleanType] || 'solution';
}

/**
 * Check if slide has meaningful content
 */
function hasContent(slide: PresentationSlide): boolean {
  if (slide.sections && slide.sections.length > 0) {
    const hasPoints = slide.sections.some(s => s.points && s.points.length > 0);
    if (hasPoints) return true;
  }
  if (slide.bullets && slide.bullets.length > 0) return true;
  if (slide.stats && slide.stats.length > 0) return true;
  if (slide.timeline && slide.timeline.length > 0) return true;
  if (slide.content && slide.content.trim().length > 20) return true;
  return false;
}

/**
 * Remove placeholder text from content
 */
function cleanPlaceholders(text: string): string {
  if (!text) return text;
  // Remove [placeholder] patterns
  return text.replace(/\[[\w\s]+\]/g, (match) => {
    // Keep specific placeholders that make sense
    if (match.toLowerCase().includes('nom') || match.toLowerCase().includes('client')) {
      return 'l\'entreprise cible';
    }
    return '';
  }).trim();
}

/**
 * Repair a single slide to ensure it has content
 */
function repairSlide(slide: PresentationSlide, index: number, totalCount: number): PresentationSlide {
  const normalizedType = normalizeSlideType(slide.type);
  const defaults = DEFAULT_SLIDES[normalizedType] || DEFAULT_SLIDES.solution;
  
  // Clean placeholders from title
  const title = cleanPlaceholders(slide.title) || defaults.title || `Slide ${index + 1}`;
  const subtitle = cleanPlaceholders(slide.subtitle || '');
  const keyMessage = cleanPlaceholders(slide.keyMessage || '') || defaults.keyMessage;
  
  // Check if slide needs content repair
  if (!hasContent(slide)) {
    // Use defaults for this slide type
    return {
      ...defaults,
      type: normalizedType,
      title,
      subtitle: subtitle || defaults.subtitle,
      keyMessage,
    } as PresentationSlide;
  }
  
  // Clean existing content
  const sections = slide.sections?.map(section => ({
    heading: cleanPlaceholders(section.heading) || section.heading,
    points: section.points.map(p => cleanPlaceholders(p) || p).filter(p => p.length > 0)
  })).filter(s => s.points.length > 0);
  
  const bullets = slide.bullets?.map(b => cleanPlaceholders(b)).filter(b => b.length > 0);
  
  return {
    ...slide,
    type: normalizedType,
    title,
    subtitle,
    keyMessage,
    sections: sections && sections.length > 0 ? sections : undefined,
    bullets: bullets && bullets.length > 0 ? bullets : undefined,
  };
}

/**
 * Ensure we have exactly the requested number of slides
 */
function ensureSlideCount(slides: PresentationSlide[], targetCount: number): PresentationSlide[] {
  if (slides.length === targetCount) return slides;
  
  if (slides.length > targetCount) {
    // Prioritize keeping: title, executive_summary, solution, proof, cta
    const priority = ['title', 'executive_summary', 'solution', 'proof', 'cta', 'problem', 'roadmap', 'benefits'];
    const sorted = [...slides].sort((a, b) => {
      const aIdx = priority.indexOf(a.type);
      const bIdx = priority.indexOf(b.type);
      return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
    });
    return sorted.slice(0, targetCount);
  }
  
  // Need to add slides
  const existingTypes = new Set(slides.map(s => s.type));
  const missingTypesArray: SlideType[] = ['title', 'executive_summary', 'solution', 'proof', 'cta'];
  const missingTypes = missingTypesArray.filter(t => !existingTypes.has(t));
  
  const result = [...slides];
  for (const type of missingTypes) {
    if (result.length >= targetCount) break;
    const defaults = DEFAULT_SLIDES[type];
    if (defaults) {
      result.push(defaults as PresentationSlide);
    }
  }
  
  return result.slice(0, targetCount);
}

/**
 * Main repair function - validates and fixes presentation JSON
 */
export function repairPresentationJson(
  data: PresentationData, 
  targetSlideCount: number
): PresentationData {
  if (!data || !data.slides || !Array.isArray(data.slides)) {
    // Generate a complete default presentation
    return {
      title: 'Proposition Stratégique',
      subtitle: 'Créer de la valeur par l\'excellence',
      executiveSummary: 'Une opportunité unique de transformation.',
      slides: ensureSlideCount([], targetSlideCount)
    };
  }
  
  // Repair each slide
  let repairedSlides = data.slides.map((slide, idx) => 
    repairSlide(slide, idx, data.slides.length)
  );
  
  // Ensure correct count
  repairedSlides = ensureSlideCount(repairedSlides, targetSlideCount);
  
  // Ensure first slide is title type
  if (repairedSlides.length > 0 && repairedSlides[0].type !== 'title') {
    const titleIdx = repairedSlides.findIndex(s => s.type === 'title');
    if (titleIdx > 0) {
      const [titleSlide] = repairedSlides.splice(titleIdx, 1);
      repairedSlides.unshift(titleSlide);
    } else {
      repairedSlides[0] = { ...repairedSlides[0], type: 'title' };
    }
  }
  
  return {
    ...data,
    title: cleanPlaceholders(data.title) || 'Proposition Stratégique',
    subtitle: cleanPlaceholders(data.subtitle || ''),
    executiveSummary: cleanPlaceholders(data.executiveSummary || ''),
    slides: repairedSlides
  };
}

/**
 * Try to parse and complete truncated JSON
 */
export function tryCompleteJSON(jsonString: string): string {
  let str = jsonString.trim();
  
  // Count open brackets
  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let escaped = false;
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    
    if (escaped) {
      escaped = false;
      continue;
    }
    
    if (char === '\\') {
      escaped = true;
      continue;
    }
    
    if (char === '"') {
      inString = !inString;
      continue;
    }
    
    if (!inString) {
      if (char === '{') openBraces++;
      if (char === '}') openBraces--;
      if (char === '[') openBrackets++;
      if (char === ']') openBrackets--;
    }
  }
  
  // Close unclosed strings
  if (inString) {
    str += '"';
  }
  
  // Close arrays and objects
  while (openBrackets > 0) {
    str += ']';
    openBrackets--;
  }
  while (openBraces > 0) {
    str += '}';
    openBraces--;
  }
  
  return str;
}
