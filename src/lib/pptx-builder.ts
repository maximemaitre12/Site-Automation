/**
 * Premium PPTX Builder - McKinsey/BCG-level presentation generation
 * Creates dense, data-rich slides with professional formatting
 */

import PptxGenJS from 'pptxgenjs';
import type { ColorPalette } from './pptx-templates';

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

interface PresentationSlide {
  type: string;
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
  comparison?: { before: string[]; after: string[] };
  callouts?: { icon: string; title: string; description: string }[];
}

interface PresentationData {
  title: string;
  subtitle?: string;
  executiveSummary?: string;
  slides: PresentationSlide[];
}

const SLIDE_WIDTH = 10;
const SLIDE_HEIGHT = 5.625;

/**
 * Add premium dark background with geometric accents
 */
function addDarkBackground(slide: PptxGenJS.Slide, pptx: PptxGenJS, colors: ColorPalette) {
  // Main background
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: SLIDE_WIDTH, h: SLIDE_HEIGHT,
    fill: { type: 'solid', color: colors.primary }
  });
  
  // Decorative circles
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 7, y: -1.5, w: 5, h: 5,
    fill: { type: 'solid', color: colors.primaryLight }
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: -1.5, y: 4, w: 3.5, h: 3.5,
    fill: { type: 'solid', color: colors.primaryLight }
  });
  
  // Accent bar top
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: SLIDE_WIDTH, h: 0.035,
    fill: { type: 'solid', color: colors.accent }
  });
}

/**
 * Add premium light background with left accent bar
 */
function addLightBackground(slide: PptxGenJS.Slide, pptx: PptxGenJS, colors: ColorPalette) {
  // Main background
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: SLIDE_WIDTH, h: SLIDE_HEIGHT,
    fill: { type: 'solid', color: colors.lightBg }
  });
  
  // Left accent bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.1, h: SLIDE_HEIGHT,
    fill: { type: 'solid', color: colors.primary }
  });
  
  // Top accent line
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: SLIDE_WIDTH, h: 0.025,
    fill: { type: 'solid', color: colors.accent }
  });
  
  // Corner decoration
  slide.addShape(pptx.ShapeType.rect, {
    x: 9.3, y: 0.1, w: 0.6, h: 0.6,
    fill: { type: 'solid', color: colors.accent }
  });
}

/**
 * Add key message banner at bottom of slide
 */
function addKeyMessage(slide: PptxGenJS.Slide, pptx: PptxGenJS, colors: ColorPalette, message: string, isDark: boolean) {
  if (!message) return;
  
  // Banner background
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.4, y: 5.0, w: 9.2, h: 0.5,
    fill: { type: 'solid', color: isDark ? colors.primaryMid : colors.accent }
  });
  
  // Message text
  slide.addText(`→ ${message}`, {
    x: 0.6, y: 5.0, w: 8.8, h: 0.5,
    fontSize: 11,
    bold: true,
    color: colors.white,
    fontFace: 'Arial',
    valign: 'middle'
  });
}

/**
 * Add slide footer with page number
 */
function addFooter(slide: PptxGenJS.Slide, colors: ColorPalette, slideNum: number, total: number, isDark: boolean) {
  slide.addText(`${slideNum} / ${total}`, {
    x: 9.2, y: 5.3, w: 0.6, h: 0.25,
    fontSize: 8,
    color: isDark ? colors.textMuted : colors.textMuted,
    fontFace: 'Arial',
    align: 'right'
  });
}

/**
 * Build Title Slide
 */
function buildTitleSlide(pptx: PptxGenJS, colors: ColorPalette, slideData: PresentationSlide, clientName: string): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  addDarkBackground(slide, pptx, colors);
  
  // Accent line
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 1.8, w: 1.5, h: 0.06,
    fill: { type: 'solid', color: colors.accent }
  });
  
  // Main title
  slide.addText(slideData.title, {
    x: 0.6, y: 2.0, w: 8.8, h: 1.5,
    fontSize: 38,
    bold: true,
    color: colors.text,
    fontFace: 'Arial',
    valign: 'top',
    breakLine: true
  });
  
  // Subtitle
  if (slideData.subtitle) {
    slide.addText(slideData.subtitle, {
      x: 0.6, y: 3.5, w: 8.8, h: 0.6,
      fontSize: 16,
      color: colors.textLight,
      fontFace: 'Arial'
    });
  }
  
  // Client badge
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.6, y: 4.5, w: 2.5, h: 0.5,
    fill: { type: 'solid', color: colors.accent },
    rectRadius: 0.06
  });
  slide.addText(clientName.toUpperCase(), {
    x: 0.6, y: 4.5, w: 2.5, h: 0.5,
    fontSize: 11,
    bold: true,
    color: colors.white,
    fontFace: 'Arial',
    align: 'center',
    valign: 'middle'
  });
  
  // Key message if present
  if (slideData.keyMessage) {
    slide.addText(slideData.keyMessage, {
      x: 3.5, y: 4.55, w: 5.9, h: 0.4,
      fontSize: 10,
      italic: true,
      color: colors.textMuted,
      fontFace: 'Arial',
      align: 'right'
    });
  }
  
  return slide;
}

/**
 * Build Content Slide with Sections (Executive Summary, Problem, Solution, etc.)
 */
function buildSectionSlide(
  pptx: PptxGenJS, 
  colors: ColorPalette, 
  slideData: PresentationSlide,
  slideNum: number,
  total: number
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  addLightBackground(slide, pptx, colors);
  
  // Title
  slide.addText(slideData.title, {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 22,
    bold: true,
    color: colors.primary,
    fontFace: 'Arial'
  });
  
  // Subtitle
  if (slideData.subtitle) {
    slide.addText(slideData.subtitle, {
      x: 0.5, y: 0.85, w: 9, h: 0.35,
      fontSize: 11,
      italic: true,
      color: colors.textMuted,
      fontFace: 'Arial'
    });
  }
  
  // Underline
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: slideData.subtitle ? 1.2 : 0.95, w: 2.5, h: 0.04,
    fill: { type: 'solid', color: colors.accent }
  });
  
  // Sections with content
  let yPos = slideData.subtitle ? 1.4 : 1.15;
  const sections = slideData.sections || [];
  
  if (sections.length > 0) {
    // Calculate layout based on number of sections
    const sectionWidth = sections.length === 2 ? 4.4 : (sections.length === 3 ? 2.9 : 8.5);
    const isMultiColumn = sections.length >= 2 && sections.length <= 3;
    
    sections.forEach((section, sIdx) => {
      const xPos = isMultiColumn ? 0.5 + sIdx * (sectionWidth + 0.3) : 0.5;
      const localY = isMultiColumn ? yPos : yPos + sIdx * 1.2;
      
      // Section heading with accent
      slide.addShape(pptx.ShapeType.rect, {
        x: xPos, y: localY, w: 0.08, h: 0.4,
        fill: { type: 'solid', color: sIdx === 0 ? colors.accent : (sIdx === 1 ? colors.accentGold : colors.success) }
      });
      
      slide.addText(section.heading.toUpperCase(), {
        x: xPos + 0.15, y: localY, w: sectionWidth - 0.2, h: 0.35,
        fontSize: 10,
        bold: true,
        color: colors.accent,
        fontFace: 'Arial'
      });
      
      // Section points
      section.points.forEach((point, pIdx) => {
        const pointY = localY + 0.45 + pIdx * 0.38;
        
        // Bullet
        slide.addShape(pptx.ShapeType.rect, {
          x: xPos + 0.15, y: pointY + 0.08, w: 0.08, h: 0.08,
          fill: { type: 'solid', color: colors.textMuted }
        });
        
        // Text
        slide.addText(point, {
          x: xPos + 0.35, y: pointY, w: sectionWidth - 0.5, h: 0.35,
          fontSize: 10,
          color: colors.textDark,
          fontFace: 'Arial',
          valign: 'top'
        });
      });
    });
  } else if (slideData.bullets && slideData.bullets.length > 0) {
    // Fallback to simple bullets
    slideData.bullets.forEach((bullet, idx) => {
      const bulletY = yPos + idx * 0.5;
      
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.6, y: bulletY + 0.1, w: 0.1, h: 0.1,
        fill: { type: 'solid', color: colors.accent }
      });
      
      slide.addText(bullet, {
        x: 0.85, y: bulletY, w: 8.5, h: 0.45,
        fontSize: 12,
        color: colors.textDark,
        fontFace: 'Arial'
      });
    });
  }
  
  // Key message
  if (slideData.keyMessage) {
    addKeyMessage(slide, pptx, colors, slideData.keyMessage, false);
  }
  
  addFooter(slide, colors, slideNum, total, false);
  
  return slide;
}

/**
 * Build Proof/Financials Slide with Stats and Testimonial
 */
function buildProofSlide(
  pptx: PptxGenJS, 
  colors: ColorPalette, 
  slideData: PresentationSlide,
  slideNum: number,
  total: number
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  addDarkBackground(slide, pptx, colors);
  
  // Title
  slide.addText(slideData.title.toUpperCase(), {
    x: 0.5, y: 0.3, w: 9, h: 0.5,
    fontSize: 12,
    bold: true,
    color: colors.accent,
    fontFace: 'Arial'
  });
  
  // Stats grid
  const stats = slideData.stats || [];
  const statCount = Math.min(stats.length, 4);
  const statWidth = (9 - 0.3 * (statCount - 1)) / statCount;
  
  stats.slice(0, 4).forEach((stat, idx) => {
    const x = 0.5 + idx * (statWidth + 0.3);
    
    // Stat box
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 0.9, w: statWidth, h: 1.6,
      fill: { type: 'solid', color: colors.primaryLight },
      line: { color: colors.accent, width: 1.5 },
      rectRadius: 0.08
    });
    
    // Value
    slide.addText(stat.value, {
      x, y: 1.0, w: statWidth, h: 0.7,
      fontSize: 28,
      bold: true,
      color: colors.accent,
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
        x, y: 2.05, w: statWidth, h: 0.35,
        fontSize: 8,
        color: colors.textMuted,
        fontFace: 'Arial',
        align: 'center'
      });
    }
  });
  
  // Testimonial
  if (slideData.testimonial) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: 2.8, w: 9, h: 1.5,
      fill: { type: 'solid', color: colors.accent },
      rectRadius: 0.1
    });
    
    // Quote mark
    slide.addText('"', {
      x: 0.7, y: 2.7, w: 0.5, h: 0.6,
      fontSize: 40,
      color: colors.accentLight,
      fontFace: 'Georgia'
    });
    
    // Quote text
    slide.addText(slideData.testimonial.quote, {
      x: 1.1, y: 2.95, w: 8, h: 0.8,
      fontSize: 12,
      italic: true,
      color: colors.white,
      fontFace: 'Arial'
    });
    
    // Author line
    const authorText = [
      slideData.testimonial.author,
      slideData.testimonial.role,
      slideData.testimonial.company
    ].filter(Boolean).join(', ');
    
    slide.addText(`— ${authorText}`, {
      x: 1.1, y: 3.8, w: 8, h: 0.35,
      fontSize: 10,
      bold: true,
      color: colors.white,
      fontFace: 'Arial',
      align: 'right'
    });
  }
  
  // Key message
  if (slideData.keyMessage) {
    addKeyMessage(slide, pptx, colors, slideData.keyMessage, true);
  }
  
  addFooter(slide, colors, slideNum, total, true);
  
  return slide;
}

/**
 * Build Roadmap Slide with Timeline
 */
function buildRoadmapSlide(
  pptx: PptxGenJS, 
  colors: ColorPalette, 
  slideData: PresentationSlide,
  slideNum: number,
  total: number
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  addLightBackground(slide, pptx, colors);
  
  // Title
  slide.addText(slideData.title, {
    x: 0.5, y: 0.3, w: 9, h: 0.55,
    fontSize: 22,
    bold: true,
    color: colors.primary,
    fontFace: 'Arial'
  });
  
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 0.9, w: 2.5, h: 0.04,
    fill: { type: 'solid', color: colors.accent }
  });
  
  // Timeline
  const timeline = slideData.timeline || [];
  if (timeline.length > 0) {
    const timelineWidth = 8.5;
    const phaseWidth = timelineWidth / timeline.length;
    
    // Timeline bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.75, y: 1.7, w: timelineWidth, h: 0.08,
      fill: { type: 'solid', color: colors.accent }
    });
    
    timeline.forEach((phase, idx) => {
      const x = 0.75 + idx * phaseWidth;
      
      // Phase circle
      slide.addShape(pptx.ShapeType.ellipse, {
        x: x + phaseWidth / 2 - 0.2, y: 1.55, w: 0.4, h: 0.4,
        fill: { type: 'solid', color: colors.accent }
      });
      slide.addText(`${idx + 1}`, {
        x: x + phaseWidth / 2 - 0.2, y: 1.55, w: 0.4, h: 0.4,
        fontSize: 14,
        bold: true,
        color: colors.white,
        fontFace: 'Arial',
        align: 'center',
        valign: 'middle'
      });
      
      // Phase name
      slide.addText(phase.phase, {
        x: x, y: 2.05, w: phaseWidth, h: 0.35,
        fontSize: 10,
        bold: true,
        color: colors.primary,
        fontFace: 'Arial',
        align: 'center'
      });
      
      // Duration
      slide.addText(phase.duration, {
        x: x, y: 2.35, w: phaseWidth, h: 0.25,
        fontSize: 9,
        color: colors.accent,
        fontFace: 'Arial',
        align: 'center'
      });
      
      // Description
      slide.addText(phase.description, {
        x: x, y: 2.6, w: phaseWidth - 0.1, h: 0.5,
        fontSize: 9,
        color: colors.textDark,
        fontFace: 'Arial',
        align: 'center'
      });
    });
  }
  
  // Sections below timeline
  let yPos = 3.2;
  const sections = slideData.sections || [];
  
  if (sections.length > 0) {
    const sectionWidth = sections.length === 2 ? 4.2 : 2.8;
    
    sections.forEach((section, sIdx) => {
      const x = 0.5 + sIdx * (sectionWidth + 0.3);
      
      // Section heading
      slide.addShape(pptx.ShapeType.rect, {
        x, y: yPos, w: sectionWidth, h: 0.35,
        fill: { type: 'solid', color: sIdx === 0 ? colors.accent : colors.accentGold }
      });
      slide.addText(section.heading, {
        x, y: yPos, w: sectionWidth, h: 0.35,
        fontSize: 10,
        bold: true,
        color: colors.white,
        fontFace: 'Arial',
        align: 'center',
        valign: 'middle'
      });
      
      // Points
      section.points.forEach((point, pIdx) => {
        const pointY = yPos + 0.45 + pIdx * 0.32;
        slide.addText(`• ${point}`, {
          x: x + 0.1, y: pointY, w: sectionWidth - 0.2, h: 0.3,
          fontSize: 9,
          color: colors.textDark,
          fontFace: 'Arial'
        });
      });
    });
  }
  
  if (slideData.keyMessage) {
    addKeyMessage(slide, pptx, colors, slideData.keyMessage, false);
  }
  
  addFooter(slide, colors, slideNum, total, false);
  
  return slide;
}

/**
 * Build CTA Slide
 */
function buildCTASlide(
  pptx: PptxGenJS, 
  colors: ColorPalette, 
  slideData: PresentationSlide,
  slideNum: number,
  total: number
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  addDarkBackground(slide, pptx, colors);
  
  // Title
  slide.addText(slideData.title, {
    x: 0, y: 0.6, w: SLIDE_WIDTH, h: 0.7,
    fontSize: 28,
    bold: true,
    color: colors.text,
    fontFace: 'Arial',
    align: 'center'
  });
  
  // Sections or bullets
  let yPos = 1.5;
  
  if (slideData.sections && slideData.sections.length > 0) {
    slideData.sections.forEach((section) => {
      // Section heading
      slide.addText(section.heading.toUpperCase(), {
        x: 2, y: yPos, w: 6, h: 0.35,
        fontSize: 10,
        bold: true,
        color: colors.accent,
        fontFace: 'Arial'
      });
      yPos += 0.4;
      
      // Points
      section.points.forEach((point) => {
        slide.addShape(pptx.ShapeType.ellipse, {
          x: 2.2, y: yPos + 0.08, w: 0.25, h: 0.25,
          fill: { type: 'solid', color: colors.accent }
        });
        slide.addText('✓', {
          x: 2.2, y: yPos + 0.08, w: 0.25, h: 0.25,
          fontSize: 10,
          color: colors.white,
          fontFace: 'Arial',
          align: 'center',
          valign: 'middle'
        });
        
        slide.addText(point, {
          x: 2.6, y: yPos, w: 5.2, h: 0.4,
          fontSize: 14,
          color: colors.text,
          fontFace: 'Arial',
          valign: 'middle'
        });
        yPos += 0.5;
      });
      yPos += 0.2;
    });
  } else if (slideData.bullets) {
    slideData.bullets.forEach((bullet) => {
      slide.addShape(pptx.ShapeType.ellipse, {
        x: 2.5, y: yPos + 0.08, w: 0.3, h: 0.3,
        fill: { type: 'solid', color: colors.accent }
      });
      slide.addText('✓', {
        x: 2.5, y: yPos + 0.08, w: 0.3, h: 0.3,
        fontSize: 12,
        color: colors.white,
        fontFace: 'Arial',
        align: 'center',
        valign: 'middle'
      });
      
      slide.addText(bullet, {
        x: 3, y: yPos, w: 5, h: 0.45,
        fontSize: 15,
        color: colors.text,
        fontFace: 'Arial',
        valign: 'middle'
      });
      yPos += 0.6;
    });
  }
  
  // Urgency content
  if (slideData.content) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.5, y: 4.3, w: 7, h: 0.6,
      fill: { type: 'solid', color: colors.accent },
      rectRadius: 0.08
    });
    slide.addText(slideData.content, {
      x: 1.5, y: 4.3, w: 7, h: 0.6,
      fontSize: 12,
      bold: true,
      color: colors.white,
      fontFace: 'Arial',
      align: 'center',
      valign: 'middle'
    });
  }
  
  if (slideData.keyMessage) {
    addKeyMessage(slide, pptx, colors, slideData.keyMessage, true);
  }
  
  addFooter(slide, colors, slideNum, total, true);
  
  return slide;
}

/**
 * Build Contact/Thank You Slide
 */
function buildContactSlide(
  pptx: PptxGenJS, 
  colors: ColorPalette, 
  slideData: PresentationSlide,
  clientName: string
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  addDarkBackground(slide, pptx, colors);
  
  // Large decorative elements
  slide.addShape(pptx.ShapeType.ellipse, {
    x: -1, y: -1, w: 4, h: 4,
    fill: { type: 'solid', color: colors.accent }
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 7.5, y: 3.5, w: 4, h: 4,
    fill: { type: 'solid', color: colors.primaryMid }
  });
  
  // Thank you text
  slide.addText(slideData.title || 'Merci', {
    x: 0, y: 1.8, w: SLIDE_WIDTH, h: 0.9,
    fontSize: 48,
    bold: true,
    color: colors.text,
    fontFace: 'Arial',
    align: 'center'
  });
  
  // Separator
  slide.addShape(pptx.ShapeType.rect, {
    x: 4, y: 2.9, w: 2, h: 0.04,
    fill: { type: 'solid', color: colors.accent }
  });
  
  // Client name
  slide.addText(clientName.toLowerCase(), {
    x: 0, y: 3.2, w: SLIDE_WIDTH, h: 0.4,
    fontSize: 16,
    color: colors.textLight,
    fontFace: 'Arial',
    align: 'center'
  });
  
  // Contact info
  const contacts = [
    '✉ contact@company.com',
    '☎ +33 1 23 45 67 89',
    '🌐 www.company.com'
  ];
  
  contacts.forEach((contact, idx) => {
    slide.addText(contact, {
      x: 0, y: 3.8 + idx * 0.35, w: SLIDE_WIDTH, h: 0.3,
      fontSize: 11,
      color: colors.text,
      fontFace: 'Arial',
      align: 'center'
    });
  });
  
  return slide;
}

/**
 * Main builder function - creates the complete presentation
 */
export function buildPremiumPresentation(
  pptx: PptxGenJS,
  colors: ColorPalette,
  data: PresentationData,
  clientName: string
): void {
  const totalSlides = data.slides.length;
  
  data.slides.forEach((slideData, index) => {
    const slideNum = index + 1;
    
    switch (slideData.type) {
      case 'title':
        buildTitleSlide(pptx, colors, slideData, clientName);
        break;
        
      case 'proof':
      case 'financials':
        buildProofSlide(pptx, colors, slideData, slideNum, totalSlides);
        break;
        
      case 'roadmap':
        buildRoadmapSlide(pptx, colors, slideData, slideNum, totalSlides);
        break;
        
      case 'cta':
        buildCTASlide(pptx, colors, slideData, slideNum, totalSlides);
        break;
        
      case 'contact':
        buildContactSlide(pptx, colors, slideData, clientName);
        break;
        
      case 'executive_summary':
      case 'context':
      case 'problem':
      case 'solution':
      case 'benefits':
      case 'risks':
      case 'team':
      case 'appendix':
      default:
        buildSectionSlide(pptx, colors, slideData, slideNum, totalSlides);
        break;
    }
    
    // Add presenter notes if available
    if (slideData.notes) {
      // Note: pptxgenjs addNotes would go here if needed
    }
  });
}
