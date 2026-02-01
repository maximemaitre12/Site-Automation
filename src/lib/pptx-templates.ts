/**
 * Premium PowerPoint templates - McKinsey/BCG-level design
 * Professional C-level presentation standards
 */

import PptxGenJS from 'pptxgenjs';

// Premium color palettes - inspired by top consulting firms
export const COLOR_PALETTES = {
  professional: {
    primary: '0A1628',       // Deep navy
    primaryLight: '152238',  // Navy light
    primaryMid: '1E3A5F',    // Navy mid
    accent: '3B82F6',        // Electric blue
    accentLight: '60A5FA',   // Light blue
    accentDark: '1D4ED8',    // Dark blue
    accentGold: 'F59E0B',    // Gold accent
    text: 'FFFFFF',          // White text
    textDark: '1F2937',      // Dark text
    textLight: 'CBD5E1',     // Light gray text
    textMuted: '94A3B8',     // Muted text
    white: 'FFFFFF',
    lightBg: 'F1F5F9',       // Light background
    darkBg: '0F172A',        // Dark background
    gradient1: '1E40AF',     // Gradient start
    gradient2: '7C3AED',     // Gradient end
    success: '10B981',       // Green
    warning: 'F59E0B',       // Yellow
    danger: 'EF4444',        // Red
  },
  dynamic: {
    primary: '1E1B4B',       // Deep purple
    primaryLight: '312E81',
    primaryMid: '4338CA',
    accent: 'A855F7',        // Purple
    accentLight: 'C084FC',
    accentDark: '7C3AED',
    accentGold: 'FBBF24',
    text: 'FFFFFF',
    textDark: '1F2937',
    textLight: 'E0E7FF',
    textMuted: 'A5B4FC',
    white: 'FFFFFF',
    lightBg: 'F5F3FF',
    darkBg: '0F0A1E',
    gradient1: '7C3AED',
    gradient2: 'EC4899',
    success: '10B981',
    warning: 'F59E0B',
    danger: 'EF4444',
  },
  startup: {
    primary: '022C22',       // Deep teal
    primaryLight: '064E3B',
    primaryMid: '047857',
    accent: '10B981',        // Emerald
    accentLight: '34D399',
    accentDark: '059669',
    accentGold: 'FCD34D',
    text: 'FFFFFF',
    textDark: '1F2937',
    textLight: 'D1FAE5',
    textMuted: '6EE7B7',
    white: 'FFFFFF',
    lightBg: 'ECFDF5',
    darkBg: '022C22',
    gradient1: '059669',
    gradient2: '06B6D4',
    success: '10B981',
    warning: 'F59E0B',
    danger: 'EF4444',
  },
  corporate: {
    primary: '0C1929',       // Deep corporate blue
    primaryLight: '1E3A5F',
    primaryMid: '2E5077',
    accent: 'C9A227',        // Gold
    accentLight: 'E5C158',
    accentDark: 'B8962D',
    accentGold: 'C9A227',
    text: 'FFFFFF',
    textDark: '1F2937',
    textLight: 'E2E8F0',
    textMuted: '94A3B8',
    white: 'FFFFFF',
    lightBg: 'F8FAFC',
    darkBg: '0C1929',
    gradient1: '1E3A5F',
    gradient2: '0F172A',
    success: '10B981',
    warning: 'F59E0B',
    danger: 'EF4444',
  },
};

export type StyleType = keyof typeof COLOR_PALETTES;
export type ColorPalette = typeof COLOR_PALETTES.professional;

// Slide dimensions (16:9)
const SLIDE_WIDTH = 10;
const SLIDE_HEIGHT = 5.625;

/**
 * Apply master styles to presentation
 */
export function applyMasterStyles(pptx: PptxGenJS, style: StyleType = 'professional'): ColorPalette {
  const colors = COLOR_PALETTES[style] || COLOR_PALETTES.professional;
  
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'AETHER Sales Intelligence';
  pptx.company = 'AETHER AI Suite';
  
  return colors;
}

/**
 * Add premium background with geometric patterns
 */
function addPremiumBackground(
  slide: PptxGenJS.Slide, 
  pptx: PptxGenJS, 
  colors: ColorPalette,
  variant: 'dark' | 'light' | 'gradient' | 'accent' = 'dark'
) {
  if (variant === 'dark' || variant === 'gradient') {
    // Main dark background
    slide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: SLIDE_WIDTH, h: SLIDE_HEIGHT,
      fill: { type: 'solid', color: colors.primary }
    });
    
    // Subtle gradient overlay circle - top right
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 6, y: -2, w: 6, h: 6,
      fill: { type: 'solid', color: colors.primaryLight },
      line: { color: colors.primaryLight, width: 0 }
    });
    
    // Second overlay circle - bottom left
    slide.addShape(pptx.ShapeType.ellipse, {
      x: -2, y: 3.5, w: 4, h: 4,
      fill: { type: 'solid', color: colors.primaryLight },
      line: { color: colors.primaryLight, width: 0 }
    });
    
    // Accent line top
    slide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: SLIDE_WIDTH, h: 0.04,
      fill: { type: 'solid', color: colors.accent }
    });
    
  } else if (variant === 'light') {
    // Light background
    slide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: SLIDE_WIDTH, h: SLIDE_HEIGHT,
      fill: { type: 'solid', color: colors.lightBg }
    });
    
    // Left accent bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: 0.12, h: SLIDE_HEIGHT,
      fill: { type: 'solid', color: colors.primary }
    });
    
    // Top accent line
    slide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: SLIDE_WIDTH, h: 0.03,
      fill: { type: 'solid', color: colors.accent }
    });
    
    // Decorative corner
    slide.addShape(pptx.ShapeType.rect, {
      x: 9.2, y: 0.1, w: 0.7, h: 0.7,
      fill: { type: 'solid', color: colors.accent },
      line: { color: colors.accent, width: 0 }
    });
    
  } else if (variant === 'accent') {
    // Accent colored background
    slide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: SLIDE_WIDTH, h: SLIDE_HEIGHT,
      fill: { type: 'solid', color: colors.accent }
    });
    
    // Overlay pattern
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 7, y: -1, w: 5, h: 5,
      fill: { type: 'solid', color: colors.accentLight },
      line: { color: colors.accentLight, width: 0 }
    });
  }
}

/**
 * Add slide footer with branding
 */
function addSlideFooter(
  slide: PptxGenJS.Slide,
  colors: ColorPalette,
  slideNumber: number,
  totalSlides: number,
  isDark: boolean = false
) {
  // Page number
  slide.addText(`${slideNumber} / ${totalSlides}`, {
    x: 9.2, y: 5.2, w: 0.6, h: 0.3,
    fontSize: 9,
    color: isDark ? colors.textMuted : colors.textMuted,
    fontFace: 'Arial',
    align: 'right'
  });
}

/**
 * Create premium title slide
 */
export function createTitleSlide(
  pptx: PptxGenJS,
  colors: ColorPalette,
  title: string,
  subtitle: string,
  clientName: string
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  
  addPremiumBackground(slide, pptx, colors, 'dark');
  
  // Accent bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 2.0, w: 1.2, h: 0.06,
    fill: { type: 'solid', color: colors.accent }
  });
  
  // Main title
  slide.addText(title, {
    x: 0.8, y: 2.2, w: 8.4, h: 1.4,
    fontSize: 42,
    bold: true,
    color: colors.text,
    fontFace: 'Arial',
    valign: 'top',
    breakLine: true
  });
  
  // Subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.8, y: 3.6, w: 8.4, h: 0.6,
      fontSize: 18,
      color: colors.textLight,
      fontFace: 'Arial'
    });
  }
  
  // Client badge
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 4.6, w: 2.8, h: 0.55,
    fill: { type: 'solid', color: colors.accent },
    rectRadius: 0.08
  });
  slide.addText(clientName.toUpperCase(), {
    x: 0.8, y: 4.6, w: 2.8, h: 0.55,
    fontSize: 12,
    bold: true,
    color: colors.white,
    fontFace: 'Arial',
    align: 'center',
    valign: 'middle'
  });
  
  return slide;
}

/**
 * Create agenda slide with numbered items
 */
export function createAgendaSlide(
  pptx: PptxGenJS,
  colors: ColorPalette,
  title: string,
  items: string[]
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  
  addPremiumBackground(slide, pptx, colors, 'dark');
  
  // Title
  slide.addText(title.toUpperCase(), {
    x: 0.8, y: 0.5, w: 8.4, h: 0.6,
    fontSize: 14,
    bold: true,
    color: colors.accent,
    fontFace: 'Arial'
  });
  
  // Numbered items
  items.forEach((item, idx) => {
    const y = 1.4 + idx * 0.85;
    
    // Number circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 0.8, y: y, w: 0.5, h: 0.5,
      fill: { type: 'solid', color: colors.accent }
    });
    slide.addText(`${idx + 1}`, {
      x: 0.8, y: y, w: 0.5, h: 0.5,
      fontSize: 16,
      bold: true,
      color: colors.white,
      fontFace: 'Arial',
      align: 'center',
      valign: 'middle'
    });
    
    // Item text
    slide.addText(item, {
      x: 1.5, y: y, w: 7.5, h: 0.5,
      fontSize: 20,
      color: colors.text,
      fontFace: 'Arial',
      valign: 'middle'
    });
  });
  
  return slide;
}

/**
 * Create premium content slide with icon and bullets
 */
export function createContentSlide(
  pptx: PptxGenJS,
  colors: ColorPalette,
  title: string,
  content?: string,
  bullets?: string[],
  slideNumber?: number,
  totalSlides?: number,
  slideType?: 'problem' | 'solution' | 'benefits' | 'pricing' | 'cta'
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  
  addPremiumBackground(slide, pptx, colors, 'light');
  
  // Icon based on slide type
  const iconConfig: Record<string, { symbol: string; color: string }> = {
    problem: { symbol: '!', color: colors.warning },
    solution: { symbol: '✓', color: colors.success },
    benefits: { symbol: '★', color: colors.accent },
    pricing: { symbol: '€', color: colors.accentGold },
    cta: { symbol: '→', color: colors.accent }
  };
  
  const icon = slideType ? iconConfig[slideType] : null;
  let titleX = 0.8;
  
  if (icon) {
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 0.8, y: 0.5, w: 0.6, h: 0.6,
      fill: { type: 'solid', color: icon.color }
    });
    slide.addText(icon.symbol, {
      x: 0.8, y: 0.5, w: 0.6, h: 0.6,
      fontSize: 20,
      bold: true,
      color: colors.white,
      fontFace: 'Arial',
      align: 'center',
      valign: 'middle'
    });
    titleX = 1.6;
  }
  
  // Title
  slide.addText(title, {
    x: titleX, y: 0.5, w: 8.2 - (titleX - 0.8), h: 0.8,
    fontSize: 26,
    bold: true,
    color: colors.primary,
    fontFace: 'Arial',
    valign: 'middle'
  });
  
  // Underline accent
  slide.addShape(pptx.ShapeType.rect, {
    x: titleX, y: 1.35, w: 2.5, h: 0.05,
    fill: { type: 'solid', color: colors.accent }
  });
  
  // Content text
  let contentY = 1.6;
  if (content) {
    slide.addText(content, {
      x: 0.8, y: contentY, w: 8.4, h: 0.7,
      fontSize: 14,
      color: colors.textMuted,
      fontFace: 'Arial',
      italic: true
    });
    contentY += 0.8;
  }
  
  // Bullets with premium styling
  if (bullets && bullets.length > 0) {
    bullets.forEach((bullet, idx) => {
      const y = contentY + idx * 0.65;
      
      // Bullet indicator
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.8, y: y + 0.12, w: 0.12, h: 0.12,
        fill: { type: 'solid', color: colors.accent }
      });
      
      // Bullet text
      slide.addText(bullet, {
        x: 1.1, y: y, w: 8.1, h: 0.5,
        fontSize: 15,
        color: colors.textDark,
        fontFace: 'Arial',
        valign: 'middle'
      });
    });
  }
  
  // Footer
  if (slideNumber && totalSlides) {
    addSlideFooter(slide, colors, slideNumber, totalSlides, false);
  }
  
  return slide;
}

/**
 * Create proof/stats slide with visual KPIs
 */
export function createProofSlide(
  pptx: PptxGenJS,
  colors: ColorPalette,
  title: string,
  stats: { value: string; label: string }[],
  testimonial?: { quote: string; author: string }
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  
  addPremiumBackground(slide, pptx, colors, 'dark');
  
  // Title
  slide.addText(title.toUpperCase(), {
    x: 0.8, y: 0.4, w: 8.4, h: 0.5,
    fontSize: 14,
    bold: true,
    color: colors.accent,
    fontFace: 'Arial'
  });
  
  // Stats boxes
  const statCount = Math.min(stats.length, 4);
  const boxWidth = (8.4 - 0.3 * (statCount - 1)) / statCount;
  
  stats.slice(0, 4).forEach((stat, idx) => {
    const x = 0.8 + idx * (boxWidth + 0.3);
    
    // Stat box background
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.1, w: boxWidth, h: 1.6,
      fill: { type: 'solid', color: colors.primaryLight },
      line: { color: colors.accent, width: 1 },
      rectRadius: 0.08
    });
    
    // Stat value
    slide.addText(stat.value, {
      x, y: 1.2, w: boxWidth, h: 0.9,
      fontSize: 32,
      bold: true,
      color: colors.accent,
      fontFace: 'Arial',
      align: 'center',
      valign: 'middle'
    });
    
    // Stat label
    slide.addText(stat.label, {
      x, y: 2.1, w: boxWidth, h: 0.5,
      fontSize: 11,
      color: colors.textLight,
      fontFace: 'Arial',
      align: 'center',
      valign: 'top'
    });
  });
  
  // Testimonial box
  if (testimonial) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 3.0, w: 8.4, h: 1.8,
      fill: { type: 'solid', color: colors.accent },
      rectRadius: 0.1
    });
    
    // Quote mark
    slide.addText('"', {
      x: 1.0, y: 3.0, w: 0.5, h: 0.6,
      fontSize: 48,
      color: colors.accentLight,
      fontFace: 'Georgia'
    });
    
    slide.addText(testimonial.quote, {
      x: 1.4, y: 3.2, w: 7.4, h: 0.9,
      fontSize: 14,
      italic: true,
      color: colors.white,
      fontFace: 'Arial'
    });
    
    slide.addText(`— ${testimonial.author}`, {
      x: 1.4, y: 4.2, w: 7.4, h: 0.4,
      fontSize: 11,
      color: colors.white,
      fontFace: 'Arial',
      align: 'right',
      bold: true
    });
  }
  
  return slide;
}

/**
 * Create CTA slide with action items
 */
export function createCTASlide(
  pptx: PptxGenJS,
  colors: ColorPalette,
  title: string,
  actions: string[],
  urgencyText?: string
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  
  addPremiumBackground(slide, pptx, colors, 'dark');
  
  // Title
  slide.addText(title, {
    x: 0, y: 0.8, w: SLIDE_WIDTH, h: 0.9,
    fontSize: 32,
    bold: true,
    color: colors.text,
    fontFace: 'Arial',
    align: 'center'
  });
  
  // Action items
  actions.forEach((action, idx) => {
    const y = 2.0 + idx * 0.7;
    
    // Checkmark circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 2.5, y: y, w: 0.4, h: 0.4,
      fill: { type: 'solid', color: colors.accent }
    });
    slide.addText('✓', {
      x: 2.5, y: y, w: 0.4, h: 0.4,
      fontSize: 14,
      color: colors.white,
      fontFace: 'Arial',
      align: 'center',
      valign: 'middle'
    });
    
    // Action text
    slide.addText(action, {
      x: 3.1, y: y, w: 5, h: 0.45,
      fontSize: 16,
      color: colors.text,
      fontFace: 'Arial',
      valign: 'middle'
    });
  });
  
  // Urgency banner
  if (urgencyText) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 2, y: 4.5, w: 6, h: 0.65,
      fill: { type: 'solid', color: colors.accent },
      rectRadius: 0.08
    });
    slide.addText(urgencyText, {
      x: 2, y: 4.5, w: 6, h: 0.65,
      fontSize: 13,
      bold: true,
      color: colors.white,
      fontFace: 'Arial',
      align: 'center',
      valign: 'middle'
    });
  }
  
  return slide;
}

/**
 * Create contact/thank you slide
 */
export function createContactSlide(
  pptx: PptxGenJS,
  colors: ColorPalette,
  contactInfo: { name?: string; email?: string; phone?: string; website?: string },
  thankYouText: string = 'Merci !'
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  
  addPremiumBackground(slide, pptx, colors, 'dark');
  
  // Large decorative accent shapes
  slide.addShape(pptx.ShapeType.ellipse, {
    x: -1, y: -1, w: 4, h: 4,
    fill: { type: 'solid', color: colors.accent },
    line: { color: colors.accent, width: 0 }
  });
  
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 7, y: 3, w: 5, h: 5,
    fill: { type: 'solid', color: colors.primaryLight },
    line: { color: colors.primaryLight, width: 0 }
  });
  
  // Thank you text split
  const parts = thankYouText.split(' ');
  const firstPart = parts.slice(0, Math.ceil(parts.length / 2)).join(' ');
  const secondPart = parts.slice(Math.ceil(parts.length / 2)).join(' ');
  
  slide.addText(firstPart, {
    x: 0, y: 1.2, w: SLIDE_WIDTH, h: 0.8,
    fontSize: 44,
    bold: true,
    color: colors.text,
    fontFace: 'Arial',
    align: 'center'
  });
  
  if (secondPart) {
    slide.addText(secondPart, {
      x: 0, y: 1.9, w: SLIDE_WIDTH, h: 0.8,
      fontSize: 44,
      bold: true,
      color: colors.accent,
      fontFace: 'Arial',
      align: 'center'
    });
  }
  
  // Separator
  slide.addShape(pptx.ShapeType.rect, {
    x: 4.2, y: 2.9, w: 1.6, h: 0.04,
    fill: { type: 'solid', color: colors.accent }
  });
  
  // Contact info
  let infoY = 3.2;
  if (contactInfo.name) {
    slide.addText(contactInfo.name.toLowerCase(), {
      x: 0, y: infoY, w: SLIDE_WIDTH, h: 0.4,
      fontSize: 16,
      color: colors.textLight,
      fontFace: 'Arial',
      align: 'center'
    });
    infoY += 0.5;
  }
  
  const contactLines = [];
  if (contactInfo.email) contactLines.push(`✉ ${contactInfo.email}`);
  if (contactInfo.phone) contactLines.push(`☎ ${contactInfo.phone}`);
  if (contactInfo.website) contactLines.push(`🌐 ${contactInfo.website}`);
  
  contactLines.forEach((line) => {
    slide.addText(line, {
      x: 0, y: infoY, w: SLIDE_WIDTH, h: 0.35,
      fontSize: 12,
      color: colors.text,
      fontFace: 'Arial',
      align: 'center'
    });
    infoY += 0.4;
  });
  
  return slide;
}

/**
 * Create split layout slide (two columns)
 */
export function createSplitSlide(
  pptx: PptxGenJS,
  colors: ColorPalette,
  title: string,
  leftContent: { title: string; bullets: string[] },
  rightContent: { title: string; bullets: string[] },
  slideNumber?: number,
  totalSlides?: number
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  
  addPremiumBackground(slide, pptx, colors, 'light');
  
  // Main title
  slide.addText(title, {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 24,
    bold: true,
    color: colors.primary,
    fontFace: 'Arial'
  });
  
  // Left column
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 1.2, w: 4, h: 0.05,
    fill: { type: 'solid', color: colors.accent }
  });
  
  slide.addText(leftContent.title, {
    x: 0.8, y: 1.4, w: 4, h: 0.5,
    fontSize: 14,
    bold: true,
    color: colors.accent,
    fontFace: 'Arial'
  });
  
  leftContent.bullets.forEach((bullet, idx) => {
    const y = 2.0 + idx * 0.5;
    slide.addText(`• ${bullet}`, {
      x: 0.8, y, w: 4, h: 0.45,
      fontSize: 12,
      color: colors.textDark,
      fontFace: 'Arial'
    });
  });
  
  // Right column
  slide.addShape(pptx.ShapeType.rect, {
    x: 5.2, y: 1.2, w: 4, h: 0.05,
    fill: { type: 'solid', color: colors.accentGold }
  });
  
  slide.addText(rightContent.title, {
    x: 5.2, y: 1.4, w: 4, h: 0.5,
    fontSize: 14,
    bold: true,
    color: colors.accentGold,
    fontFace: 'Arial'
  });
  
  rightContent.bullets.forEach((bullet, idx) => {
    const y = 2.0 + idx * 0.5;
    slide.addText(`• ${bullet}`, {
      x: 5.2, y, w: 4, h: 0.45,
      fontSize: 12,
      color: colors.textDark,
      fontFace: 'Arial'
    });
  });
  
  if (slideNumber && totalSlides) {
    addSlideFooter(slide, colors, slideNumber, totalSlides, false);
  }
  
  return slide;
}
