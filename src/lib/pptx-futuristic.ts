/**
 * Futuristic PPTX Design System
 * Premium, modern design with layered backgrounds and sophisticated typography
 */

import PptxGenJS from 'pptxgenjs';

// Futuristic color palettes
export const FUTURISTIC_PALETTES = {
  professional: {
    // Deep space navy with electric accents
    bg1: '0A0F1C',        // Deepest background
    bg2: '111827',        // Secondary background
    bg3: '1F2937',        // Tertiary background
    accent1: '3B82F6',    // Electric blue
    accent2: '8B5CF6',    // Purple
    accent3: '06B6D4',    // Cyan
    gold: 'F59E0B',       // Gold accent
    text: 'FFFFFF',       // Primary text
    textMuted: '9CA3AF',  // Muted text
    textDim: '6B7280',    // Dim text
    success: '10B981',
    warning: 'F59E0B',
    danger: 'EF4444',
  },
  dynamic: {
    bg1: '0F0A1E',
    bg2: '1E1B4B',
    bg3: '312E81',
    accent1: 'A855F7',
    accent2: 'EC4899',
    accent3: 'F472B6',
    gold: 'FBBF24',
    text: 'FFFFFF',
    textMuted: 'C4B5FD',
    textDim: 'A78BFA',
    success: '10B981',
    warning: 'F59E0B',
    danger: 'EF4444',
  },
  startup: {
    bg1: '022C22',
    bg2: '064E3B',
    bg3: '047857',
    accent1: '10B981',
    accent2: '34D399',
    accent3: '06B6D4',
    gold: 'FCD34D',
    text: 'FFFFFF',
    textMuted: 'A7F3D0',
    textDim: '6EE7B7',
    success: '10B981',
    warning: 'F59E0B',
    danger: 'EF4444',
  },
  corporate: {
    bg1: '0C1929',
    bg2: '1E3A5F',
    bg3: '2E5077',
    accent1: 'C9A227',
    accent2: 'E5C158',
    accent3: '3B82F6',
    gold: 'C9A227',
    text: 'FFFFFF',
    textMuted: 'CBD5E1',
    textDim: '94A3B8',
    success: '10B981',
    warning: 'F59E0B',
    danger: 'EF4444',
  }
};

export type FuturisticStyle = keyof typeof FUTURISTIC_PALETTES;
export type FuturisticPalette = typeof FUTURISTIC_PALETTES.professional;

const W = 10;
const H = 5.625;

/**
 * Apply master styles to presentation
 */
export function applyFuturisticStyles(pptx: PptxGenJS, style: FuturisticStyle = 'professional'): FuturisticPalette {
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'AETHER Sales Intelligence';
  pptx.company = 'AETHER AI Suite';
  return FUTURISTIC_PALETTES[style] || FUTURISTIC_PALETTES.professional;
}

/**
 * Add futuristic dark background with layered geometric elements
 */
export function addFuturisticDarkBg(slide: PptxGenJS.Slide, pptx: PptxGenJS, colors: FuturisticPalette) {
  // Base layer
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: H,
    fill: { color: colors.bg1 }
  });
  
  // Gradient orb top-right (large, subtle)
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 5.5, y: -2.5, w: 7, h: 7,
    fill: { color: colors.bg2, transparency: 40 }
  });
  
  // Gradient orb bottom-left (medium)
  slide.addShape(pptx.ShapeType.ellipse, {
    x: -2.5, y: 3, w: 5, h: 5,
    fill: { color: colors.bg2, transparency: 50 }
  });
  
  // Small accent orb
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 8, y: 4, w: 3, h: 3,
    fill: { color: colors.accent1, transparency: 85 }
  });
  
  // Top accent line
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.04,
    fill: { color: colors.accent1 }
  });
  
  // Subtle grid pattern (horizontal lines)
  for (let i = 1; i < 6; i++) {
    slide.addShape(pptx.ShapeType.rect, {
      x: 0, y: i * 0.9, w: W, h: 0.003,
      fill: { color: colors.bg3, transparency: 70 }
    });
  }
}

/**
 * Add futuristic light background with accent elements
 */
export function addFuturisticLightBg(slide: PptxGenJS.Slide, pptx: PptxGenJS, colors: FuturisticPalette) {
  // Base - very light gray
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: H,
    fill: { color: 'F8FAFC' }
  });
  
  // Left accent bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.12, h: H,
    fill: { color: colors.bg1 }
  });
  
  // Top accent line
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.025,
    fill: { color: colors.accent1 }
  });
  
  // Corner accent block
  slide.addShape(pptx.ShapeType.rect, {
    x: 9.2, y: 0.15, w: 0.65, h: 0.65,
    fill: { color: colors.accent1 }
  });
  
  // Bottom decorative bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: H - 0.08, w: W, h: 0.08,
    fill: { color: colors.bg2, transparency: 90 }
  });
}

/**
 * Add key message banner
 */
export function addKeyMessageBanner(
  slide: PptxGenJS.Slide, 
  pptx: PptxGenJS, 
  colors: FuturisticPalette, 
  message: string,
  isDark: boolean
) {
  if (!message) return;
  
  const y = H - 0.65;
  
  // Banner background
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.4, y, w: W - 0.8, h: 0.5,
    fill: { color: isDark ? colors.bg3 : colors.accent1 }
  });
  
  // Arrow icon
  slide.addText('→', {
    x: 0.55, y, w: 0.4, h: 0.5,
    fontSize: 14,
    bold: true,
    color: isDark ? colors.accent1 : colors.text,
    fontFace: 'Arial',
    valign: 'middle'
  });
  
  // Message text
  slide.addText(message, {
    x: 1.0, y, w: W - 1.6, h: 0.5,
    fontSize: 11,
    bold: true,
    color: colors.text,
    fontFace: 'Arial',
    valign: 'middle'
  });
}

/**
 * Add slide footer with page number
 */
export function addSlideFooter(
  slide: PptxGenJS.Slide, 
  colors: FuturisticPalette, 
  slideNum: number, 
  total: number,
  isDark: boolean
) {
  slide.addText(`${slideNum} / ${total}`, {
    x: W - 0.8, y: H - 0.35, w: 0.6, h: 0.25,
    fontSize: 9,
    color: isDark ? colors.textDim : colors.textMuted,
    fontFace: 'Arial',
    align: 'right'
  });
}

/**
 * Build premium title slide
 */
export function buildTitleSlide(
  pptx: PptxGenJS,
  colors: FuturisticPalette,
  title: string,
  subtitle: string,
  clientName: string,
  keyMessage?: string
) {
  const slide = pptx.addSlide();
  addFuturisticDarkBg(slide, pptx, colors);
  
  // Decorative accent line
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 1.6, w: 1.8, h: 0.06,
    fill: { color: colors.accent1 }
  });
  
  // Main title
  slide.addText(title, {
    x: 0.6, y: 1.8, w: 8.8, h: 1.6,
    fontSize: 36,
    bold: true,
    color: colors.text,
    fontFace: 'Arial',
    valign: 'top',
    fit: 'shrink'
  });
  
  // Subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6, y: 3.5, w: 8.8, h: 0.6,
      fontSize: 16,
      color: colors.textMuted,
      fontFace: 'Arial'
    });
  }
  
  // Client badge
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.6, y: 4.5, w: 2.8, h: 0.55,
    fill: { color: colors.accent1 },
    rectRadius: 0.08
  });
  slide.addText(clientName.toUpperCase(), {
    x: 0.6, y: 4.5, w: 2.8, h: 0.55,
    fontSize: 11,
    bold: true,
    color: colors.text,
    fontFace: 'Arial',
    align: 'center',
    valign: 'middle'
  });
  
  // Key message (if provided)
  if (keyMessage) {
    slide.addText(keyMessage, {
      x: 3.6, y: 4.55, w: 5.8, h: 0.45,
      fontSize: 10,
      italic: true,
      color: colors.textDim,
      fontFace: 'Arial',
      align: 'right'
    });
  }
  
  return slide;
}

/**
 * Build section slide with multi-column layout
 */
export function buildSectionSlide(
  pptx: PptxGenJS,
  colors: FuturisticPalette,
  title: string,
  subtitle: string | undefined,
  sections: { heading: string; points: string[] }[],
  keyMessage: string | undefined,
  slideNum: number,
  total: number
) {
  const slide = pptx.addSlide();
  addFuturisticLightBg(slide, pptx, colors);
  
  // Title
  slide.addText(title, {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 22,
    bold: true,
    color: colors.bg1,
    fontFace: 'Arial'
  });
  
  // Subtitle
  let contentY = 0.95;
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5, y: 0.9, w: 9, h: 0.35,
      fontSize: 11,
      italic: true,
      color: colors.textMuted,
      fontFace: 'Arial'
    });
    contentY = 1.3;
  }
  
  // Title underline
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: contentY - 0.05, w: 2.5, h: 0.04,
    fill: { color: colors.accent1 }
  });
  
  // Sections layout
  const sectionColors = [colors.accent1, colors.gold, colors.accent3];
  
  if (sections && sections.length > 0) {
    const colCount = Math.min(sections.length, 3);
    const colWidth = colCount === 1 ? 8.5 : (colCount === 2 ? 4.2 : 2.8);
    const gap = colCount === 1 ? 0 : 0.3;
    
    sections.slice(0, 3).forEach((section, sIdx) => {
      const xPos = 0.5 + sIdx * (colWidth + gap);
      let localY = contentY + 0.15;
      
      // Section heading with colored accent
      slide.addShape(pptx.ShapeType.rect, {
        x: xPos, y: localY, w: 0.08, h: 0.35,
        fill: { color: sectionColors[sIdx % sectionColors.length] }
      });
      
      slide.addText(section.heading.toUpperCase(), {
        x: xPos + 0.15, y: localY, w: colWidth - 0.2, h: 0.35,
        fontSize: 10,
        bold: true,
        color: sectionColors[sIdx % sectionColors.length],
        fontFace: 'Arial'
      });
      
      localY += 0.45;
      
      // Section points
      section.points.slice(0, 5).forEach((point, pIdx) => {
        const pointY = localY + pIdx * 0.42;
        
        // Bullet square
        slide.addShape(pptx.ShapeType.rect, {
          x: xPos + 0.15, y: pointY + 0.1, w: 0.08, h: 0.08,
          fill: { color: colors.textMuted }
        });
        
        // Point text
        slide.addText(point, {
          x: xPos + 0.35, y: pointY, w: colWidth - 0.5, h: 0.4,
          fontSize: 10,
          color: '374151',
          fontFace: 'Arial',
          valign: 'top'
        });
      });
    });
  }
  
  // Key message
  if (keyMessage) {
    addKeyMessageBanner(slide, pptx, colors, keyMessage, false);
  }
  
  addSlideFooter(slide, colors, slideNum, total, false);
  return slide;
}

/**
 * Build proof/financials slide with stats grid
 */
export function buildProofSlide(
  pptx: PptxGenJS,
  colors: FuturisticPalette,
  title: string,
  stats: { value: string; label: string; subtext?: string }[],
  testimonial: { quote: string; author: string; role?: string; company?: string } | undefined,
  keyMessage: string | undefined,
  slideNum: number,
  total: number
) {
  const slide = pptx.addSlide();
  addFuturisticDarkBg(slide, pptx, colors);
  
  // Title
  slide.addText(title.toUpperCase(), {
    x: 0.5, y: 0.3, w: 9, h: 0.5,
    fontSize: 12,
    bold: true,
    color: colors.accent1,
    fontFace: 'Arial'
  });
  
  // Stats grid
  const statCount = Math.min(stats?.length || 0, 4);
  if (statCount > 0) {
    const statWidth = (9 - 0.3 * (statCount - 1)) / statCount;
    
    stats.slice(0, 4).forEach((stat, idx) => {
      const x = 0.5 + idx * (statWidth + 0.3);
      
      // Stat box
      slide.addShape(pptx.ShapeType.roundRect, {
        x, y: 0.9, w: statWidth, h: 1.5,
        fill: { color: colors.bg2 },
        line: { color: colors.accent1, width: 1.5 },
        rectRadius: 0.1
      });
      
      // Value
      slide.addText(stat.value, {
        x, y: 1.0, w: statWidth, h: 0.7,
        fontSize: 28,
        bold: true,
        color: colors.accent1,
        fontFace: 'Arial',
        align: 'center',
        valign: 'middle'
      });
      
      // Label
      slide.addText(stat.label, {
        x, y: 1.7, w: statWidth, h: 0.35,
        fontSize: 10,
        bold: true,
        color: colors.text,
        fontFace: 'Arial',
        align: 'center'
      });
      
      // Subtext
      if (stat.subtext) {
        slide.addText(stat.subtext, {
          x, y: 2.05, w: statWidth, h: 0.3,
          fontSize: 8,
          color: colors.textMuted,
          fontFace: 'Arial',
          align: 'center'
        });
      }
    });
  }
  
  // Testimonial
  if (testimonial) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: 2.7, w: 9, h: 1.4,
      fill: { color: colors.accent1 },
      rectRadius: 0.12
    });
    
    // Quote mark
    slide.addText('"', {
      x: 0.7, y: 2.6, w: 0.5, h: 0.6,
      fontSize: 40,
      color: colors.bg1,
      fontFace: 'Georgia'
    });
    
    // Quote text
    slide.addText(testimonial.quote, {
      x: 1.1, y: 2.9, w: 8, h: 0.7,
      fontSize: 12,
      italic: true,
      color: colors.text,
      fontFace: 'Arial'
    });
    
    // Author
    const authorLine = [testimonial.author, testimonial.role, testimonial.company]
      .filter(Boolean).join(', ');
    
    slide.addText(`— ${authorLine}`, {
      x: 1.1, y: 3.65, w: 8, h: 0.35,
      fontSize: 10,
      bold: true,
      color: colors.text,
      fontFace: 'Arial',
      align: 'right'
    });
  }
  
  // Key message
  if (keyMessage) {
    addKeyMessageBanner(slide, pptx, colors, keyMessage, true);
  }
  
  addSlideFooter(slide, colors, slideNum, total, true);
  return slide;
}

/**
 * Build roadmap/timeline slide
 */
export function buildRoadmapSlide(
  pptx: PptxGenJS,
  colors: FuturisticPalette,
  title: string,
  timeline: { phase: string; description: string; duration: string }[],
  sections: { heading: string; points: string[] }[] | undefined,
  keyMessage: string | undefined,
  slideNum: number,
  total: number
) {
  const slide = pptx.addSlide();
  addFuturisticLightBg(slide, pptx, colors);
  
  // Title
  slide.addText(title, {
    x: 0.5, y: 0.3, w: 9, h: 0.55,
    fontSize: 22,
    bold: true,
    color: colors.bg1,
    fontFace: 'Arial'
  });
  
  // Underline
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 0.9, w: 2.5, h: 0.04,
    fill: { color: colors.accent1 }
  });
  
  // Timeline
  if (timeline && timeline.length > 0) {
    const phaseCount = Math.min(timeline.length, 4);
    const phaseWidth = 8.5 / phaseCount;
    
    // Timeline bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.75, y: 1.6, w: 8.5, h: 0.08,
      fill: { color: colors.accent1 }
    });
    
    timeline.slice(0, 4).forEach((phase, idx) => {
      const x = 0.75 + idx * phaseWidth;
      
      // Phase circle
      slide.addShape(pptx.ShapeType.ellipse, {
        x: x + phaseWidth / 2 - 0.2, y: 1.45, w: 0.4, h: 0.4,
        fill: { color: colors.accent1 }
      });
      slide.addText(`${idx + 1}`, {
        x: x + phaseWidth / 2 - 0.2, y: 1.45, w: 0.4, h: 0.4,
        fontSize: 12,
        bold: true,
        color: colors.text,
        fontFace: 'Arial',
        align: 'center',
        valign: 'middle'
      });
      
      // Phase box
      slide.addShape(pptx.ShapeType.roundRect, {
        x: x + 0.1, y: 2.0, w: phaseWidth - 0.2, h: 1.4,
        fill: { color: 'FFFFFF' },
        line: { color: colors.accent1, width: 1 },
        rectRadius: 0.08
      });
      
      // Phase name
      slide.addText(phase.phase, {
        x: x + 0.15, y: 2.1, w: phaseWidth - 0.3, h: 0.4,
        fontSize: 10,
        bold: true,
        color: colors.accent1,
        fontFace: 'Arial'
      });
      
      // Duration badge
      slide.addShape(pptx.ShapeType.roundRect, {
        x: x + 0.15, y: 2.5, w: 0.8, h: 0.25,
        fill: { color: colors.gold },
        rectRadius: 0.04
      });
      slide.addText(phase.duration, {
        x: x + 0.15, y: 2.5, w: 0.8, h: 0.25,
        fontSize: 8,
        bold: true,
        color: colors.bg1,
        fontFace: 'Arial',
        align: 'center',
        valign: 'middle'
      });
      
      // Description
      slide.addText(phase.description, {
        x: x + 0.15, y: 2.85, w: phaseWidth - 0.3, h: 0.5,
        fontSize: 9,
        color: '374151',
        fontFace: 'Arial'
      });
    });
  }
  
  // Additional sections below timeline
  if (sections && sections.length > 0) {
    const startY = 3.6;
    const colCount = Math.min(sections.length, 2);
    const colWidth = colCount === 1 ? 8.5 : 4.1;
    
    sections.slice(0, 2).forEach((section, sIdx) => {
      const xPos = 0.5 + sIdx * (colWidth + 0.3);
      
      slide.addText(section.heading.toUpperCase(), {
        x: xPos, y: startY, w: colWidth, h: 0.3,
        fontSize: 9,
        bold: true,
        color: colors.accent1,
        fontFace: 'Arial'
      });
      
      section.points.slice(0, 3).forEach((point, pIdx) => {
        slide.addText(`• ${point}`, {
          x: xPos, y: startY + 0.35 + pIdx * 0.25, w: colWidth, h: 0.25,
          fontSize: 9,
          color: '374151',
          fontFace: 'Arial'
        });
      });
    });
  }
  
  if (keyMessage) {
    addKeyMessageBanner(slide, pptx, colors, keyMessage, false);
  }
  
  addSlideFooter(slide, colors, slideNum, total, false);
  return slide;
}

/**
 * Build CTA slide
 */
export function buildCTASlide(
  pptx: PptxGenJS,
  colors: FuturisticPalette,
  title: string,
  sections: { heading: string; points: string[] }[] | undefined,
  keyMessage: string | undefined,
  content: string | undefined,
  slideNum: number,
  total: number
) {
  const slide = pptx.addSlide();
  addFuturisticDarkBg(slide, pptx, colors);
  
  // Title
  slide.addText(title, {
    x: 0, y: 0.8, w: W, h: 0.8,
    fontSize: 28,
    bold: true,
    color: colors.text,
    fontFace: 'Arial',
    align: 'center'
  });
  
  // Actions from sections
  if (sections && sections.length > 0) {
    let actionY = 1.8;
    
    sections[0].points.slice(0, 4).forEach((action, idx) => {
      // Checkmark circle
      slide.addShape(pptx.ShapeType.ellipse, {
        x: 2.5, y: actionY, w: 0.4, h: 0.4,
        fill: { color: colors.accent1 }
      });
      slide.addText('✓', {
        x: 2.5, y: actionY, w: 0.4, h: 0.4,
        fontSize: 14,
        color: colors.text,
        fontFace: 'Arial',
        align: 'center',
        valign: 'middle'
      });
      
      // Action text
      slide.addText(action, {
        x: 3.1, y: actionY, w: 5, h: 0.4,
        fontSize: 14,
        color: colors.text,
        fontFace: 'Arial',
        valign: 'middle'
      });
      
      actionY += 0.6;
    });
  }
  
  // Content/urgency text
  if (content) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 2, y: 4.2, w: 6, h: 0.6,
      fill: { color: colors.gold },
      rectRadius: 0.08
    });
    slide.addText(content, {
      x: 2, y: 4.2, w: 6, h: 0.6,
      fontSize: 12,
      bold: true,
      color: colors.bg1,
      fontFace: 'Arial',
      align: 'center',
      valign: 'middle'
    });
  }
  
  if (keyMessage) {
    addKeyMessageBanner(slide, pptx, colors, keyMessage, true);
  }
  
  addSlideFooter(slide, colors, slideNum, total, true);
  return slide;
}
