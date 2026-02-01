/**
 * Professional PowerPoint templates and styling utilities
 * Senior-level design standards for sales presentations
 */

import PptxGenJS from 'pptxgenjs';

// Premium color palettes
export const COLOR_PALETTES = {
  professional: {
    primary: '0F172A',       // Slate 900
    primaryLight: '1E293B',  // Slate 800
    accent: '3B82F6',        // Blue 500
    accentLight: '60A5FA',   // Blue 400
    accentDark: '1D4ED8',    // Blue 700
    text: '1F2937',          // Gray 800
    textLight: '6B7280',     // Gray 500
    textMuted: '9CA3AF',     // Gray 400
    white: 'FFFFFF',
    lightBg: 'F8FAFC',       // Slate 50
    gradientStart: '1E40AF', // Blue 800
    gradientEnd: '7C3AED',   // Violet 600
  },
  dynamic: {
    primary: '7C3AED',       // Violet 600
    primaryLight: '8B5CF6',  // Violet 500
    accent: 'EC4899',        // Pink 500
    accentLight: 'F472B6',   // Pink 400
    accentDark: 'BE185D',    // Pink 700
    text: '1F2937',
    textLight: '6B7280',
    textMuted: '9CA3AF',
    white: 'FFFFFF',
    lightBg: 'FDF4FF',       // Fuchsia 50
    gradientStart: '7C3AED',
    gradientEnd: 'EC4899',
  },
  startup: {
    primary: '059669',       // Emerald 600
    primaryLight: '10B981',  // Emerald 500
    accent: '06B6D4',        // Cyan 500
    accentLight: '22D3EE',   // Cyan 400
    accentDark: '0891B2',    // Cyan 600
    text: '1F2937',
    textLight: '6B7280',
    textMuted: '9CA3AF',
    white: 'FFFFFF',
    lightBg: 'ECFDF5',       // Emerald 50
    gradientStart: '059669',
    gradientEnd: '06B6D4',
  },
  corporate: {
    primary: '1E3A5F',       // Deep blue
    primaryLight: '2E5077',
    accent: 'D4AF37',        // Gold
    accentLight: 'E5C158',
    accentDark: 'B8962D',
    text: '1F2937',
    textLight: '6B7280',
    textMuted: '9CA3AF',
    white: 'FFFFFF',
    lightBg: 'F1F5F9',       // Slate 100
    gradientStart: '1E3A5F',
    gradientEnd: '0F172A',
  },
};

export type StyleType = keyof typeof COLOR_PALETTES;

// Slide dimensions (16:9)
const SLIDE_WIDTH = 10;
const SLIDE_HEIGHT = 5.625;

/**
 * Create slide master with professional styling
 */
export function applyMasterStyles(pptx: PptxGenJS, style: StyleType = 'professional') {
  const colors = COLOR_PALETTES[style] || COLOR_PALETTES.professional;
  
  // Set presentation properties
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'AETHER Sales Copilot';
  pptx.company = 'AETHER AI Suite';
  
  return colors;
}

/**
 * Add decorative elements to a slide
 */
export function addSlideDecorations(
  slide: PptxGenJS.Slide, 
  pptx: PptxGenJS,
  colors: typeof COLOR_PALETTES.professional,
  type: 'header' | 'sidebar' | 'corner' | 'minimal' | 'full' = 'header'
) {
  switch (type) {
    case 'header':
      // Top gradient bar
      slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: SLIDE_WIDTH, h: 0.08,
        fill: { type: 'solid', color: colors.accent }
      });
      // Accent line
      slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0.08, w: SLIDE_WIDTH, h: 0.02,
        fill: { type: 'solid', color: colors.accentLight }
      });
      break;
      
    case 'sidebar':
      // Left sidebar
      slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: 0.4, h: SLIDE_HEIGHT,
        fill: { type: 'solid', color: colors.primary }
      });
      // Accent stripe
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.4, y: 0, w: 0.05, h: SLIDE_HEIGHT,
        fill: { type: 'solid', color: colors.accent }
      });
      break;
      
    case 'corner':
      // Top right corner decoration
      slide.addShape(pptx.ShapeType.rtTriangle, {
        x: 8, y: 0, w: 2, h: 1.5,
        rotate: 90,
        fill: { type: 'solid', color: colors.accent }
      });
      // Bottom left corner
      slide.addShape(pptx.ShapeType.rtTriangle, {
        x: 0, y: 4.125, w: 1.5, h: 1.5,
        rotate: 270,
        fill: { type: 'solid', color: colors.accentLight }
      });
      break;
      
    case 'full':
      // Full cover background
      slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: SLIDE_WIDTH, h: SLIDE_HEIGHT,
        fill: { type: 'solid', color: colors.primary }
      });
      // Diagonal accent
      slide.addShape(pptx.ShapeType.rect, {
        x: -1, y: 3.5, w: 12, h: 0.15,
        rotate: -5,
        fill: { type: 'solid', color: colors.accent }
      });
      break;
      
    case 'minimal':
    default:
      // Just a thin top line
      slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: SLIDE_WIDTH, h: 0.03,
        fill: { type: 'solid', color: colors.accent }
      });
  }
}

/**
 * Add professional title slide
 */
export function createTitleSlide(
  pptx: PptxGenJS,
  colors: typeof COLOR_PALETTES.professional,
  title: string,
  subtitle: string,
  clientName: string
) {
  const slide = pptx.addSlide();
  
  // Background gradient effect using overlapping shapes
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: SLIDE_WIDTH, h: SLIDE_HEIGHT,
    fill: { type: 'solid', color: colors.primary }
  });
  
  // Decorative circles
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 7, y: -1, w: 5, h: 5,
    fill: { type: 'solid', color: colors.primaryLight },
    line: { color: colors.primaryLight, width: 0 }
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: -2, y: 3, w: 4, h: 4,
    fill: { type: 'solid', color: colors.primaryLight },
    line: { color: colors.primaryLight, width: 0 }
  });
  
  // Accent line
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 2.2, w: 1.5, h: 0.08,
    fill: { type: 'solid', color: colors.accent }
  });
  
  // Main title
  slide.addText(title, {
    x: 0.8, y: 2.4, w: 8.4, h: 1.2,
    fontSize: 44, bold: true, color: colors.white,
    fontFace: 'Arial',
    valign: 'top'
  });
  
  // Subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.8, y: 3.5, w: 8.4, h: 0.6,
      fontSize: 20, color: colors.accentLight,
      fontFace: 'Arial'
    });
  }
  
  // Client name badge
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 4.5, w: 3, h: 0.5,
    fill: { type: 'solid', color: colors.accent },
    rectRadius: 0.1
  });
  slide.addText(clientName, {
    x: 0.8, y: 4.5, w: 3, h: 0.5,
    fontSize: 14, bold: true, color: colors.white,
    fontFace: 'Arial',
    align: 'center', valign: 'middle'
  });
  
  return slide;
}

/**
 * Add content slide with bullet points
 */
export function createContentSlide(
  pptx: PptxGenJS,
  colors: typeof COLOR_PALETTES.professional,
  title: string,
  content?: string,
  bullets?: string[],
  slideNumber?: number,
  totalSlides?: number,
  icon?: 'problem' | 'solution' | 'benefits' | 'proof' | 'pricing' | 'cta'
) {
  const slide = pptx.addSlide();
  
  // White background
  slide.background = { color: colors.white };
  
  // Add decorations
  addSlideDecorations(slide, pptx, colors, 'header');
  
  // Icon badge (optional)
  const iconSymbols: Record<string, string> = {
    problem: '⚠',
    solution: '✓',
    benefits: '★',
    proof: '📊',
    pricing: '€',
    cta: '→'
  };
  
  if (icon && iconSymbols[icon]) {
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 0.5, y: 0.4, w: 0.6, h: 0.6,
      fill: { type: 'solid', color: colors.accent }
    });
    slide.addText(iconSymbols[icon], {
      x: 0.5, y: 0.4, w: 0.6, h: 0.6,
      fontSize: 20, color: colors.white,
      align: 'center', valign: 'middle'
    });
  }
  
  // Title with accent underline
  const titleX = icon ? 1.3 : 0.5;
  slide.addText(title, {
    x: titleX, y: 0.4, w: 8.5 - titleX, h: 0.7,
    fontSize: 28, bold: true, color: colors.text,
    fontFace: 'Arial'
  });
  
  // Underline accent
  slide.addShape(pptx.ShapeType.rect, {
    x: titleX, y: 1.1, w: 2, h: 0.05,
    fill: { type: 'solid', color: colors.accent }
  });
  
  // Content text
  let contentY = 1.4;
  if (content) {
    slide.addText(content, {
      x: 0.5, y: contentY, w: 9, h: 0.8,
      fontSize: 16, color: colors.textLight,
      fontFace: 'Arial'
    });
    contentY += 0.9;
  }
  
  // Bullet points with custom styling
  if (bullets && bullets.length > 0) {
    const bulletRows = bullets.map((bullet, idx) => ({
      text: bullet,
      options: {
        bullet: { 
          type: 'bullet' as const,
          characterCode: '25CF' // Filled circle
        },
        color: colors.text,
        fontSize: 16,
        fontFace: 'Arial',
        paraSpaceBefore: idx === 0 ? 0 : 8
      }
    }));
    
    slide.addText(bulletRows, {
      x: 0.7, y: contentY, w: 8.6, h: 3.5 - contentY + 1.4,
      valign: 'top',
      lineSpacing: 24
    });
  }
  
  // Footer with slide number
  if (slideNumber && totalSlides) {
    slide.addText(`${slideNumber} / ${totalSlides}`, {
      x: 9, y: 5.2, w: 0.8, h: 0.3,
      fontSize: 10, color: colors.textMuted,
      align: 'right'
    });
  }
  
  return slide;
}

/**
 * Add agenda/table of contents slide
 */
export function createAgendaSlide(
  pptx: PptxGenJS,
  colors: typeof COLOR_PALETTES.professional,
  title: string,
  items: string[]
) {
  const slide = pptx.addSlide();
  
  // Background
  slide.background = { color: colors.lightBg };
  
  // Left decorative bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.15, h: SLIDE_HEIGHT,
    fill: { type: 'solid', color: colors.accent }
  });
  
  // Title
  slide.addText(title, {
    x: 0.5, y: 0.4, w: 9, h: 0.8,
    fontSize: 32, bold: true, color: colors.primary,
    fontFace: 'Arial'
  });
  
  // Agenda items with numbers
  items.forEach((item, idx) => {
    const y = 1.5 + idx * 0.7;
    
    // Number circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 0.6, y: y, w: 0.45, h: 0.45,
      fill: { type: 'solid', color: idx === 0 ? colors.accent : colors.textMuted }
    });
    slide.addText(`${idx + 1}`, {
      x: 0.6, y: y, w: 0.45, h: 0.45,
      fontSize: 14, bold: true, color: colors.white,
      align: 'center', valign: 'middle'
    });
    
    // Item text
    slide.addText(item, {
      x: 1.2, y: y, w: 8, h: 0.45,
      fontSize: 18, color: colors.text,
      fontFace: 'Arial',
      valign: 'middle'
    });
  });
  
  return slide;
}

/**
 * Add proof/stats slide with visual elements
 */
export function createProofSlide(
  pptx: PptxGenJS,
  colors: typeof COLOR_PALETTES.professional,
  title: string,
  stats: { value: string; label: string }[],
  testimonial?: { quote: string; author: string }
) {
  const slide = pptx.addSlide();
  
  slide.background = { color: colors.white };
  addSlideDecorations(slide, pptx, colors, 'minimal');
  
  // Title
  slide.addText(title, {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: 28, bold: true, color: colors.text,
    fontFace: 'Arial'
  });
  
  // Stats boxes
  const boxWidth = (9 - 0.3 * (stats.length - 1)) / Math.min(stats.length, 4);
  stats.slice(0, 4).forEach((stat, idx) => {
    const x = 0.5 + idx * (boxWidth + 0.3);
    
    // Box background
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.2, w: boxWidth, h: 1.8,
      fill: { type: 'solid', color: colors.lightBg },
      line: { color: colors.accent, width: 1 },
      rectRadius: 0.1
    });
    
    // Value
    slide.addText(stat.value, {
      x, y: 1.4, w: boxWidth, h: 0.9,
      fontSize: 36, bold: true, color: colors.accent,
      align: 'center', valign: 'middle',
      fontFace: 'Arial'
    });
    
    // Label
    slide.addText(stat.label, {
      x, y: 2.3, w: boxWidth, h: 0.5,
      fontSize: 12, color: colors.textLight,
      align: 'center', valign: 'top',
      fontFace: 'Arial'
    });
  });
  
  // Testimonial
  if (testimonial) {
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5, y: 3.3, w: 9, h: 1.8,
      fill: { type: 'solid', color: colors.primary }
    });
    
    slide.addText(`"${testimonial.quote}"`, {
      x: 0.8, y: 3.5, w: 8.4, h: 1,
      fontSize: 16, italic: true, color: colors.white,
      fontFace: 'Arial'
    });
    
    slide.addText(`— ${testimonial.author}`, {
      x: 0.8, y: 4.5, w: 8.4, h: 0.4,
      fontSize: 12, color: colors.accentLight,
      fontFace: 'Arial',
      align: 'right'
    });
  }
  
  return slide;
}

/**
 * Add call-to-action slide
 */
export function createCTASlide(
  pptx: PptxGenJS,
  colors: typeof COLOR_PALETTES.professional,
  title: string,
  actions: string[],
  urgencyText?: string
) {
  const slide = pptx.addSlide();
  
  // Gradient-like background
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: SLIDE_WIDTH, h: SLIDE_HEIGHT,
    fill: { type: 'solid', color: colors.primary }
  });
  
  // Decorative element
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 6, y: -2, w: 6, h: 6,
    fill: { type: 'solid', color: colors.primaryLight }
  });
  
  // Title
  slide.addText(title, {
    x: 0.5, y: 1, w: 9, h: 1,
    fontSize: 36, bold: true, color: colors.white,
    fontFace: 'Arial',
    align: 'center'
  });
  
  // Action items
  actions.forEach((action, idx) => {
    const y = 2.2 + idx * 0.6;
    
    // Checkmark
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 2.5, y: y, w: 0.35, h: 0.35,
      fill: { type: 'solid', color: colors.accent }
    });
    slide.addText('✓', {
      x: 2.5, y: y, w: 0.35, h: 0.35,
      fontSize: 14, color: colors.white,
      align: 'center', valign: 'middle'
    });
    
    // Action text
    slide.addText(action, {
      x: 3, y: y, w: 5, h: 0.4,
      fontSize: 16, color: colors.white,
      fontFace: 'Arial',
      valign: 'middle'
    });
  });
  
  // Urgency banner
  if (urgencyText) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 2, y: 4.5, w: 6, h: 0.6,
      fill: { type: 'solid', color: colors.accent },
      rectRadius: 0.1
    });
    slide.addText(urgencyText, {
      x: 2, y: 4.5, w: 6, h: 0.6,
      fontSize: 14, bold: true, color: colors.white,
      fontFace: 'Arial',
      align: 'center', valign: 'middle'
    });
  }
  
  return slide;
}

/**
 * Add contact/thank you slide
 */
export function createContactSlide(
  pptx: PptxGenJS,
  colors: typeof COLOR_PALETTES.professional,
  contactInfo: { name?: string; email?: string; phone?: string; website?: string },
  thankYouText: string = 'Merci !'
) {
  const slide = pptx.addSlide();
  
  // Dark background
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: SLIDE_WIDTH, h: SLIDE_HEIGHT,
    fill: { type: 'solid', color: colors.primary }
  });
  
  // Decorative corners
  slide.addShape(pptx.ShapeType.rtTriangle, {
    x: -0.5, y: -0.5, w: 3, h: 2,
    rotate: 0,
    fill: { type: 'solid', color: colors.accent }
  });
  slide.addShape(pptx.ShapeType.rtTriangle, {
    x: 7.5, y: 4.125, w: 3, h: 2,
    rotate: 180,
    fill: { type: 'solid', color: colors.accentLight }
  });
  
  // Thank you text
  slide.addText(thankYouText, {
    x: 0, y: 1.2, w: SLIDE_WIDTH, h: 1.2,
    fontSize: 56, bold: true, color: colors.white,
    fontFace: 'Arial',
    align: 'center'
  });
  
  // Separator line
  slide.addShape(pptx.ShapeType.rect, {
    x: 4, y: 2.6, w: 2, h: 0.05,
    fill: { type: 'solid', color: colors.accent }
  });
  
  // Contact info
  const infoLines = [];
  if (contactInfo.name) infoLines.push(contactInfo.name);
  if (contactInfo.email) infoLines.push(`✉ ${contactInfo.email}`);
  if (contactInfo.phone) infoLines.push(`☎ ${contactInfo.phone}`);
  if (contactInfo.website) infoLines.push(`🌐 ${contactInfo.website}`);
  
  infoLines.forEach((line, idx) => {
    slide.addText(line, {
      x: 0, y: 3 + idx * 0.45, w: SLIDE_WIDTH, h: 0.4,
      fontSize: 16, color: idx === 0 ? colors.accentLight : colors.white,
      fontFace: 'Arial',
      align: 'center',
      bold: idx === 0
    });
  });
  
  return slide;
}
