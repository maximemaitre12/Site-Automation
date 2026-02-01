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
 * Truncate text intelligently to prevent overflow
 */
function smartTruncate(text: string, maxChars: number): string {
  if (!text || text.length <= maxChars) return text;
  const truncated = text.substring(0, maxChars);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > maxChars * 0.6 ? truncated.substring(0, lastSpace) : truncated) + '…';
}

/**
 * Calculate optimal font size based on content length
 */
function adaptiveFontSize(text: string, baseSize: number, maxChars: number): number {
  if (!text) return baseSize;
  const ratio = Math.min(1, maxChars / text.length);
  return Math.max(baseSize * 0.7, baseSize * ratio);
}

/**
 * Build section slide with IMPROVED multi-column layout
 * - Prevents text overlap with dynamic spacing
 * - Limits content per section to avoid overflow
 * - Uses smart truncation for long text
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
  
  // Title - with size limit
  const displayTitle = smartTruncate(title, 80);
  slide.addText(displayTitle, {
    x: 0.5, y: 0.25, w: 9, h: 0.55,
    fontSize: 20,
    bold: true,
    color: colors.bg1,
    fontFace: 'Arial',
    fit: 'shrink'
  });
  
  // Subtitle
  let contentY = 0.85;
  if (subtitle) {
    const displaySubtitle = smartTruncate(subtitle, 120);
    slide.addText(displaySubtitle, {
      x: 0.5, y: 0.8, w: 9, h: 0.3,
      fontSize: 10,
      italic: true,
      color: colors.textMuted,
      fontFace: 'Arial'
    });
    contentY = 1.15;
  }
  
  // Title underline
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: contentY - 0.05, w: 2, h: 0.03,
    fill: { color: colors.accent1 }
  });
  
  // IMPROVED: Sections layout with proper spacing
  const sectionColors = [colors.accent1, colors.gold, colors.accent3];
  
  if (sections && sections.length > 0) {
    const colCount = Math.min(sections.length, 3);
    const totalWidth = 9.0;
    const gap = 0.25;
    const colWidth = (totalWidth - (colCount - 1) * gap) / colCount;
    
    // Available height for content (before key message)
    const availableHeight = keyMessage ? 3.2 : 3.8;
    const maxPointsPerSection = Math.floor(availableHeight / 0.5);
    
    sections.slice(0, 3).forEach((section, sIdx) => {
      const xPos = 0.5 + sIdx * (colWidth + gap);
      let localY = contentY + 0.1;
      
      // Section heading with colored accent bar
      slide.addShape(pptx.ShapeType.rect, {
        x: xPos, y: localY, w: 0.06, h: 0.3,
        fill: { color: sectionColors[sIdx % sectionColors.length] }
      });
      
      const headingText = smartTruncate(section.heading.toUpperCase(), 40);
      slide.addText(headingText, {
        x: xPos + 0.12, y: localY, w: colWidth - 0.15, h: 0.3,
        fontSize: 9,
        bold: true,
        color: sectionColors[sIdx % sectionColors.length],
        fontFace: 'Arial',
        fit: 'shrink'
      });
      
      localY += 0.38;
      
      // Section points - LIMITED to prevent overflow
      const pointsToShow = Math.min(section.points.length, maxPointsPerSection, 5);
      const pointHeight = 0.48;
      
      section.points.slice(0, pointsToShow).forEach((point, pIdx) => {
        const pointY = localY + pIdx * pointHeight;
        
        // Check if we're going to overflow
        if (pointY + pointHeight > (keyMessage ? 4.3 : 5.0)) return;
        
        // Bullet dot
        slide.addShape(pptx.ShapeType.ellipse, {
          x: xPos + 0.08, y: pointY + 0.12, w: 0.06, h: 0.06,
          fill: { color: colors.textMuted }
        });
        
        // Point text - TRUNCATED to fit
        const maxChars = colCount === 3 ? 80 : (colCount === 2 ? 120 : 180);
        const displayPoint = smartTruncate(point, maxChars);
        
        slide.addText(displayPoint, {
          x: xPos + 0.2, y: pointY, w: colWidth - 0.25, h: pointHeight - 0.05,
          fontSize: 9,
          color: '374151',
          fontFace: 'Arial',
          valign: 'top',
          fit: 'shrink'
        });
      });
    });
  }
  
  // Key message
  if (keyMessage) {
    const displayMessage = smartTruncate(keyMessage, 200);
    addKeyMessageBanner(slide, pptx, colors, displayMessage, false);
  }
  
  addSlideFooter(slide, colors, slideNum, total, false);
  return slide;
}

/**
 * Build proof/financials slide with IMPROVED stats grid
 * - Better spacing, no overlap
 * - Truncates long labels/values
 * - Adds sections for hypotheses
 */
export function buildProofSlide(
  pptx: PptxGenJS,
  colors: FuturisticPalette,
  title: string,
  stats: { value: string; label: string; subtext?: string }[],
  testimonial: { quote: string; author: string; role?: string; company?: string } | undefined,
  keyMessage: string | undefined,
  slideNum: number,
  total: number,
  sections?: { heading: string; points: string[] }[]
) {
  const slide = pptx.addSlide();
  addFuturisticDarkBg(slide, pptx, colors);
  
  // Title - truncated
  const displayTitle = smartTruncate(title.toUpperCase(), 70);
  slide.addText(displayTitle, {
    x: 0.5, y: 0.22, w: 9, h: 0.4,
    fontSize: 11,
    bold: true,
    color: colors.accent1,
    fontFace: 'Arial',
    fit: 'shrink'
  });
  
  // Stats grid - IMPROVED sizing
  const statCount = Math.min(stats?.length || 0, 4);
  const hasTestimonial = !!testimonial;
  const hasSections = sections && sections.length > 0;
  
  if (statCount > 0) {
    const gap = 0.15;
    const statWidth = (9 - gap * (statCount - 1)) / statCount;
    const statHeight = hasTestimonial || hasSections ? 1.0 : 1.3;
    
    stats.slice(0, 4).forEach((stat, idx) => {
      const x = 0.5 + idx * (statWidth + gap);
      
      // Stat box
      slide.addShape(pptx.ShapeType.roundRect, {
        x, y: 0.7, w: statWidth, h: statHeight,
        fill: { color: colors.bg2 },
        line: { color: colors.accent1, width: 1 },
        rectRadius: 0.06
      });
      
      // Value - truncated and sized adaptively
      const displayValue = smartTruncate(stat.value, 12);
      const valueFontSize = displayValue.length > 8 ? 18 : 22;
      
      slide.addText(displayValue, {
        x, y: 0.75, w: statWidth, h: 0.45,
        fontSize: valueFontSize,
        bold: true,
        color: colors.accent1,
        fontFace: 'Arial',
        align: 'center',
        valign: 'middle',
        fit: 'shrink'
      });
      
      // Label - truncated
      const displayLabel = smartTruncate(stat.label, 25);
      slide.addText(displayLabel, {
        x: x + 0.03, y: 1.2, w: statWidth - 0.06, h: 0.22,
        fontSize: 8,
        bold: true,
        color: colors.text,
        fontFace: 'Arial',
        align: 'center',
        fit: 'shrink'
      });
      
      // Subtext - truncated
      if (stat.subtext && statHeight > 1.1) {
        const displaySubtext = smartTruncate(stat.subtext, 30);
        slide.addText(displaySubtext, {
          x: x + 0.03, y: 1.42, w: statWidth - 0.06, h: 0.18,
          fontSize: 7,
          color: colors.textMuted,
          fontFace: 'Arial',
          align: 'center'
        });
      }
    });
  }
  
  // Sections (e.g., Hypothèses Clés) - below stats
  let nextY = statCount > 0 ? 1.85 : 0.7;
  
  if (hasSections && sections) {
    const sectionColors = [colors.accent1, colors.gold];
    const colCount = Math.min(sections.length, 2);
    const colWidth = colCount === 1 ? 8.8 : 4.2;
    const gap = 0.25;
    
    sections.slice(0, 2).forEach((section, sIdx) => {
      const xPos = 0.5 + sIdx * (colWidth + gap);
      
      const headingText = smartTruncate(section.heading.toUpperCase(), 40);
      slide.addText(headingText, {
        x: xPos, y: nextY, w: colWidth, h: 0.25,
        fontSize: 8,
        bold: true,
        color: sectionColors[sIdx % sectionColors.length],
        fontFace: 'Arial'
      });
      
      section.points.slice(0, 3).forEach((point, pIdx) => {
        const displayPoint = smartTruncate(point, colCount === 1 ? 140 : 70);
        slide.addText(`• ${displayPoint}`, {
          x: xPos, y: nextY + 0.28 + pIdx * 0.26, w: colWidth, h: 0.26,
          fontSize: 8,
          color: colors.text,
          fontFace: 'Arial'
        });
      });
    });
    
    nextY += 0.28 + Math.min(sections[0]?.points?.length || 0, 3) * 0.26 + 0.12;
  }
  
  // Testimonial - IMPROVED with better positioning
  if (hasTestimonial && testimonial) {
    const testimonialY = Math.max(nextY + 0.1, 2.6);
    const testimonialH = 0.95;
    
    // Only render if there's space
    if (testimonialY + testimonialH < 4.6) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.5, y: testimonialY, w: 9, h: testimonialH,
        fill: { color: colors.accent1 },
        rectRadius: 0.08
      });
      
      // Quote mark
      slide.addText('"', {
        x: 0.6, y: testimonialY - 0.08, w: 0.35, h: 0.4,
        fontSize: 28,
        color: colors.bg1,
        fontFace: 'Georgia'
      });
      
      // Quote text - truncated
      const displayQuote = smartTruncate(testimonial.quote, 160);
      slide.addText(displayQuote, {
        x: 0.9, y: testimonialY + 0.08, w: 8.2, h: 0.48,
        fontSize: 9,
        italic: true,
        color: colors.text,
        fontFace: 'Arial',
        fit: 'shrink'
      });
      
      // Author
      const authorLine = smartTruncate(
        [testimonial.author, testimonial.role, testimonial.company].filter(Boolean).join(', '),
        60
      );
      
      slide.addText(`— ${authorLine}`, {
        x: 0.9, y: testimonialY + 0.6, w: 8.2, h: 0.22,
        fontSize: 8,
        bold: true,
        color: colors.text,
        fontFace: 'Arial',
        align: 'right'
      });
    }
  }
  
  // Key message
  if (keyMessage) {
    const displayMessage = smartTruncate(keyMessage, 180);
    addKeyMessageBanner(slide, pptx, colors, displayMessage, true);
  }
  
  addSlideFooter(slide, colors, slideNum, total, true);
  return slide;
}

/**
 * Build roadmap/timeline slide - IMPROVED
 * - Better spacing and truncation
 * - Prevents overflow
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
  
  // Title - truncated
  const displayTitle = smartTruncate(title, 70);
  slide.addText(displayTitle, {
    x: 0.5, y: 0.25, w: 9, h: 0.48,
    fontSize: 18,
    bold: true,
    color: colors.bg1,
    fontFace: 'Arial',
    fit: 'shrink'
  });
  
  // Underline
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 0.78, w: 2, h: 0.03,
    fill: { color: colors.accent1 }
  });
  
  // Timeline - IMPROVED layout
  if (timeline && timeline.length > 0) {
    const phaseCount = Math.min(timeline.length, 4);
    const totalWidth = 8.8;
    const gap = 0.12;
    const phaseWidth = (totalWidth - gap * (phaseCount - 1)) / phaseCount;
    
    // Timeline bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.6, y: 1.35, w: totalWidth, h: 0.06,
      fill: { color: colors.accent1 }
    });
    
    timeline.slice(0, 4).forEach((phase, idx) => {
      const x = 0.6 + idx * (phaseWidth + gap);
      
      // Phase circle
      slide.addShape(pptx.ShapeType.ellipse, {
        x: x + phaseWidth / 2 - 0.15, y: 1.23, w: 0.3, h: 0.3,
        fill: { color: colors.accent1 }
      });
      slide.addText(`${idx + 1}`, {
        x: x + phaseWidth / 2 - 0.15, y: 1.23, w: 0.3, h: 0.3,
        fontSize: 10,
        bold: true,
        color: colors.text,
        fontFace: 'Arial',
        align: 'center',
        valign: 'middle'
      });
      
      // Phase box
      slide.addShape(pptx.ShapeType.roundRect, {
        x: x, y: 1.65, w: phaseWidth, h: 1.2,
        fill: { color: 'FFFFFF' },
        line: { color: colors.accent1, width: 1 },
        rectRadius: 0.06
      });
      
      // Phase name - truncated
      const phaseName = smartTruncate(phase.phase, 30);
      slide.addText(phaseName, {
        x: x + 0.08, y: 1.72, w: phaseWidth - 0.16, h: 0.32,
        fontSize: 9,
        bold: true,
        color: colors.accent1,
        fontFace: 'Arial',
        fit: 'shrink'
      });
      
      // Duration badge
      const durationText = smartTruncate(phase.duration, 12);
      slide.addShape(pptx.ShapeType.roundRect, {
        x: x + 0.08, y: 2.06, w: 0.7, h: 0.2,
        fill: { color: colors.gold },
        rectRadius: 0.03
      });
      slide.addText(durationText, {
        x: x + 0.08, y: 2.06, w: 0.7, h: 0.2,
        fontSize: 7,
        bold: true,
        color: colors.bg1,
        fontFace: 'Arial',
        align: 'center',
        valign: 'middle'
      });
      
      // Description - truncated based on column width
      const maxDescChars = phaseCount >= 3 ? 60 : 100;
      const description = smartTruncate(phase.description, maxDescChars);
      slide.addText(description, {
        x: x + 0.08, y: 2.32, w: phaseWidth - 0.16, h: 0.48,
        fontSize: 8,
        color: '374151',
        fontFace: 'Arial',
        fit: 'shrink'
      });
    });
  }
  
  // Additional sections below timeline - IMPROVED
  if (sections && sections.length > 0) {
    const startY = 3.0;
    const colCount = Math.min(sections.length, 3);
    const totalWidth = 9.0;
    const gap = 0.2;
    const colWidth = (totalWidth - gap * (colCount - 1)) / colCount;
    
    sections.slice(0, 3).forEach((section, sIdx) => {
      const xPos = 0.5 + sIdx * (colWidth + gap);
      
      const headingText = smartTruncate(section.heading.toUpperCase(), 35);
      slide.addText(headingText, {
        x: xPos, y: startY, w: colWidth, h: 0.25,
        fontSize: 8,
        bold: true,
        color: colors.accent1,
        fontFace: 'Arial'
      });
      
      section.points.slice(0, 3).forEach((point, pIdx) => {
        const maxChars = colCount >= 3 ? 50 : 80;
        const displayPoint = smartTruncate(point, maxChars);
        slide.addText(`• ${displayPoint}`, {
          x: xPos, y: startY + 0.28 + pIdx * 0.24, w: colWidth, h: 0.24,
          fontSize: 8,
          color: '374151',
          fontFace: 'Arial'
        });
      });
    });
  }
  
  if (keyMessage) {
    const displayMessage = smartTruncate(keyMessage, 180);
    addKeyMessageBanner(slide, pptx, colors, displayMessage, false);
  }
  
  addSlideFooter(slide, colors, slideNum, total, false);
  return slide;
}

/**
 * Build CTA slide - IMPROVED
 * - Better text truncation
 * - More compact layout
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
  
  // Title - truncated
  const displayTitle = smartTruncate(title, 60);
  slide.addText(displayTitle, {
    x: 0.5, y: 0.6, w: 9, h: 0.7,
    fontSize: 24,
    bold: true,
    color: colors.text,
    fontFace: 'Arial',
    align: 'center',
    fit: 'shrink'
  });
  
  // Actions from sections - IMPROVED
  if (sections && sections.length > 0) {
    let actionY = 1.5;
    const maxActions = 5;
    
    sections[0].points.slice(0, maxActions).forEach((action, idx) => {
      // Checkmark circle
      slide.addShape(pptx.ShapeType.ellipse, {
        x: 1.8, y: actionY, w: 0.32, h: 0.32,
        fill: { color: colors.accent1 }
      });
      slide.addText('✓', {
        x: 1.8, y: actionY, w: 0.32, h: 0.32,
        fontSize: 12,
        color: colors.text,
        fontFace: 'Arial',
        align: 'center',
        valign: 'middle'
      });
      
      // Action text - truncated
      const displayAction = smartTruncate(action, 80);
      slide.addText(displayAction, {
        x: 2.25, y: actionY, w: 6.5, h: 0.32,
        fontSize: 11,
        color: colors.text,
        fontFace: 'Arial',
        valign: 'middle',
        fit: 'shrink'
      });
      
      actionY += 0.45;
    });
  }
  
  // Content/urgency text - IMPROVED
  if (content) {
    const displayContent = smartTruncate(content, 100);
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.5, y: 3.9, w: 7, h: 0.5,
      fill: { color: colors.gold },
      rectRadius: 0.06
    });
    slide.addText(displayContent, {
      x: 1.5, y: 3.9, w: 7, h: 0.5,
      fontSize: 10,
      bold: true,
      color: colors.bg1,
      fontFace: 'Arial',
      align: 'center',
      valign: 'middle',
      fit: 'shrink'
    });
  }
  
  if (keyMessage) {
    const displayMessage = smartTruncate(keyMessage, 160);
    addKeyMessageBanner(slide, pptx, colors, displayMessage, true);
  }
  
  addSlideFooter(slide, colors, slideNum, total, true);
  return slide;
}
