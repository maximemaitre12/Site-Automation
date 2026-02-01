/**
 * McKinsey/BCG Style PowerPoint Generator
 * Clean, professional consulting-grade presentations
 * Based on real consulting deck patterns
 */

import PptxGenJS from 'pptxgenjs';

// Consulting-grade color palette (McKinsey-inspired)
export const CONSULTING_COLORS = {
  // Primary colors
  navy: '003366',           // Deep navy (titles, headers)
  navyDark: '002244',       // Darker navy (backgrounds)
  navyMid: '1A4872',        // Mid navy
  
  // Accent colors
  blue: '0078D4',           // Microsoft blue accent
  teal: '008080',           // Teal for highlights
  gold: 'B8860B',           // Gold for emphasis
  
  // Text colors
  textDark: '1F2937',       // Primary text
  textMid: '4B5563',        // Secondary text
  textLight: '6B7280',      // Muted text
  
  // Backgrounds
  white: 'FFFFFF',
  offWhite: 'F8FAFC',
  lightGray: 'F1F5F9',
  borderGray: 'E2E8F0',
  
  // Chart colors
  chartBlue: '4A90A4',
  chartTeal: '5BA0A0',
  chartGreen: '7AB55C',
  chartGold: 'DAA520',
};

// Layout constants (16:9 ratio)
const W = 10;
const H = 5.625;

// Standard margins
const MARGIN = {
  left: 0.4,
  right: 0.4,
  top: 0.35,
  bottom: 0.35,
};

const CONTENT_WIDTH = W - MARGIN.left - MARGIN.right;

/**
 * Initialize presentation with consulting styles
 */
export function initConsultingPresentation(pptx: PptxGenJS): void {
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Strategic Advisory';
  pptx.company = 'AETHER Intelligence';
}

/**
 * Add clean white background with minimal branding
 */
function addWhiteBackground(slide: PptxGenJS.Slide, pptx: PptxGenJS): void {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: H,
    fill: { color: CONSULTING_COLORS.white }
  });
}

/**
 * Add navy header bar (for title slides)
 */
function addNavyHeader(slide: PptxGenJS.Slide, pptx: PptxGenJS, height: number = 1.2): void {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: height,
    fill: { color: CONSULTING_COLORS.navyDark }
  });
}

/**
 * Add standard footer with page number and source
 */
function addConsultingFooter(
  slide: PptxGenJS.Slide, 
  slideNum: number, 
  total: number,
  source?: string
): void {
  // Left: Source attribution
  if (source) {
    slide.addText(`Source: ${source}`, {
      x: MARGIN.left, y: H - 0.3, w: 5, h: 0.2,
      fontSize: 7,
      italic: true,
      color: CONSULTING_COLORS.textLight,
      fontFace: 'Arial',
    });
  }
  
  // Right: Page number
  slide.addText(`${slideNum}`, {
    x: W - 0.5, y: H - 0.3, w: 0.3, h: 0.2,
    fontSize: 8,
    color: CONSULTING_COLORS.textLight,
    fontFace: 'Arial',
    align: 'right'
  });
}

/**
 * Smart text truncation
 */
function truncate(text: string, maxLen: number): string {
  if (!text || text.length <= maxLen) return text;
  const cut = text.substring(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > maxLen * 0.6 ? cut.substring(0, lastSpace) : cut) + '…';
}

// ============================================================================
// SLIDE BUILDERS
// ============================================================================

/**
 * Title slide - Clean navy header with white body
 */
export function buildTitleSlide(
  pptx: PptxGenJS,
  title: string,
  subtitle: string,
  companyName: string,
  date?: string
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  addWhiteBackground(slide, pptx);
  addNavyHeader(slide, pptx, 2.2);
  
  // Main title
  slide.addText(title, {
    x: MARGIN.left + 0.2, y: 0.5, w: CONTENT_WIDTH - 0.4, h: 1.0,
    fontSize: 28,
    bold: true,
    color: CONSULTING_COLORS.white,
    fontFace: 'Arial',
    valign: 'top',
    breakLine: true
  });
  
  // Subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x: MARGIN.left + 0.2, y: 1.5, w: CONTENT_WIDTH - 0.4, h: 0.5,
      fontSize: 14,
      color: 'CCDDEE',
      fontFace: 'Arial',
    });
  }
  
  // Company name and date (bottom area)
  slide.addText(companyName.toUpperCase(), {
    x: MARGIN.left + 0.2, y: 3.8, w: 4, h: 0.4,
    fontSize: 14,
    bold: true,
    color: CONSULTING_COLORS.navy,
    fontFace: 'Arial',
  });
  
  if (date) {
    slide.addText(date, {
      x: MARGIN.left + 0.2, y: 4.2, w: 4, h: 0.3,
      fontSize: 11,
      color: CONSULTING_COLORS.textMid,
      fontFace: 'Arial',
    });
  }
  
  // Decorative line
  slide.addShape(pptx.ShapeType.rect, {
    x: MARGIN.left + 0.2, y: 3.6, w: 1.5, h: 0.04,
    fill: { color: CONSULTING_COLORS.blue }
  });
  
  return slide;
}

/**
 * Executive Summary slide - Key takeaways with visual hierarchy
 */
export function buildExecutiveSummarySlide(
  pptx: PptxGenJS,
  title: string,
  keyPoints: { heading: string; text: string }[],
  slideNum: number,
  total: number
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  addWhiteBackground(slide, pptx);
  
  // Title bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.6,
    fill: { color: CONSULTING_COLORS.navyDark }
  });
  
  slide.addText(title, {
    x: MARGIN.left, y: 0.12, w: CONTENT_WIDTH, h: 0.4,
    fontSize: 16,
    bold: true,
    color: CONSULTING_COLORS.white,
    fontFace: 'Arial',
  });
  
  // Key points - numbered boxes
  const maxPoints = Math.min(keyPoints.length, 4);
  const pointHeight = 1.0;
  const startY = 0.9;
  
  keyPoints.slice(0, maxPoints).forEach((point, idx) => {
    const y = startY + idx * (pointHeight + 0.15);
    
    // Number circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x: MARGIN.left, y: y, w: 0.35, h: 0.35,
      fill: { color: CONSULTING_COLORS.navy }
    });
    slide.addText(`${idx + 1}`, {
      x: MARGIN.left, y: y, w: 0.35, h: 0.35,
      fontSize: 12,
      bold: true,
      color: CONSULTING_COLORS.white,
      fontFace: 'Arial',
      align: 'center',
      valign: 'middle'
    });
    
    // Heading
    slide.addText(truncate(point.heading, 60), {
      x: MARGIN.left + 0.5, y: y, w: CONTENT_WIDTH - 0.6, h: 0.35,
      fontSize: 12,
      bold: true,
      color: CONSULTING_COLORS.navy,
      fontFace: 'Arial',
      valign: 'middle'
    });
    
    // Text
    slide.addText(truncate(point.text, 200), {
      x: MARGIN.left + 0.5, y: y + 0.35, w: CONTENT_WIDTH - 0.6, h: 0.6,
      fontSize: 10,
      color: CONSULTING_COLORS.textMid,
      fontFace: 'Arial',
      valign: 'top'
    });
    
    // Separator line
    if (idx < maxPoints - 1) {
      slide.addShape(pptx.ShapeType.rect, {
        x: MARGIN.left + 0.5, y: y + pointHeight + 0.05, w: CONTENT_WIDTH - 0.6, h: 0.01,
        fill: { color: CONSULTING_COLORS.borderGray }
      });
    }
  });
  
  addConsultingFooter(slide, slideNum, total);
  return slide;
}

/**
 * Context/Situation slide - Left questions, right content grid
 */
export function buildContextSlide(
  pptx: PptxGenJS,
  title: string,
  subtitle: string | undefined,
  leftColumn: { question: string; answer: string }[],
  rightContent: string[],
  keyMessage: string | undefined,
  slideNum: number,
  total: number
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  addWhiteBackground(slide, pptx);
  
  // Title
  slide.addText(title, {
    x: MARGIN.left, y: MARGIN.top, w: CONTENT_WIDTH, h: 0.45,
    fontSize: 18,
    bold: true,
    color: CONSULTING_COLORS.navy,
    fontFace: 'Arial',
  });
  
  // Subtitle
  let contentY = 0.85;
  if (subtitle) {
    slide.addText(truncate(subtitle, 120), {
      x: MARGIN.left, y: 0.75, w: CONTENT_WIDTH, h: 0.25,
      fontSize: 10,
      italic: true,
      color: CONSULTING_COLORS.textLight,
      fontFace: 'Arial',
    });
    contentY = 1.05;
  }
  
  // Two-column layout
  const leftWidth = 3.0;
  const rightWidth = CONTENT_WIDTH - leftWidth - 0.3;
  const rightX = MARGIN.left + leftWidth + 0.3;
  
  // Left column - Q&A boxes
  const maxQA = Math.min(leftColumn.length, 4);
  const qaHeight = (4.3 - contentY) / maxQA - 0.1;
  
  leftColumn.slice(0, maxQA).forEach((qa, idx) => {
    const y = contentY + idx * (qaHeight + 0.1);
    
    // Question label
    slide.addShape(pptx.ShapeType.rect, {
      x: MARGIN.left, y: y, w: 0.08, h: qaHeight,
      fill: { color: CONSULTING_COLORS.blue }
    });
    
    slide.addText(truncate(qa.question, 30), {
      x: MARGIN.left + 0.15, y: y, w: leftWidth - 0.2, h: 0.3,
      fontSize: 9,
      bold: true,
      color: CONSULTING_COLORS.navy,
      fontFace: 'Arial',
    });
    
    slide.addText(truncate(qa.answer, 100), {
      x: MARGIN.left + 0.15, y: y + 0.3, w: leftWidth - 0.2, h: qaHeight - 0.35,
      fontSize: 8,
      color: CONSULTING_COLORS.textMid,
      fontFace: 'Arial',
      valign: 'top'
    });
  });
  
  // Right column - Content box with navy header
  slide.addShape(pptx.ShapeType.rect, {
    x: rightX, y: contentY, w: rightWidth, h: 0.35,
    fill: { color: CONSULTING_COLORS.navyDark }
  });
  
  slide.addText('Key Elements', {
    x: rightX + 0.1, y: contentY, w: rightWidth - 0.2, h: 0.35,
    fontSize: 10,
    bold: true,
    color: CONSULTING_COLORS.white,
    fontFace: 'Arial',
    valign: 'middle'
  });
  
  // Right content items
  const maxItems = Math.min(rightContent.length, 5);
  const itemHeight = (4.0 - contentY - 0.35) / maxItems;
  
  rightContent.slice(0, maxItems).forEach((item, idx) => {
    const y = contentY + 0.45 + idx * itemHeight;
    
    // Bullet
    slide.addText('•', {
      x: rightX + 0.1, y: y, w: 0.2, h: itemHeight - 0.05,
      fontSize: 10,
      color: CONSULTING_COLORS.blue,
      fontFace: 'Arial',
      valign: 'top'
    });
    
    slide.addText(truncate(item, 80), {
      x: rightX + 0.3, y: y, w: rightWidth - 0.4, h: itemHeight - 0.05,
      fontSize: 9,
      color: CONSULTING_COLORS.textDark,
      fontFace: 'Arial',
      valign: 'top'
    });
  });
  
  // Key message bar
  if (keyMessage) {
    slide.addShape(pptx.ShapeType.rect, {
      x: MARGIN.left, y: 4.7, w: CONTENT_WIDTH, h: 0.4,
      fill: { color: CONSULTING_COLORS.lightGray }
    });
    slide.addText(`→ ${truncate(keyMessage, 150)}`, {
      x: MARGIN.left + 0.15, y: 4.7, w: CONTENT_WIDTH - 0.3, h: 0.4,
      fontSize: 9,
      bold: true,
      color: CONSULTING_COLORS.navy,
      fontFace: 'Arial',
      valign: 'middle'
    });
  }
  
  addConsultingFooter(slide, slideNum, total);
  return slide;
}

/**
 * Framework slide - Funnel or process visualization
 */
export function buildFrameworkSlide(
  pptx: PptxGenJS,
  title: string,
  subtitle: string | undefined,
  stages: { label: string; description: string; subPoints?: string[] }[],
  keyMessage: string | undefined,
  slideNum: number,
  total: number
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  addWhiteBackground(slide, pptx);
  
  // Title
  slide.addText(title, {
    x: MARGIN.left, y: MARGIN.top, w: CONTENT_WIDTH, h: 0.45,
    fontSize: 18,
    bold: true,
    color: CONSULTING_COLORS.navy,
    fontFace: 'Arial',
  });
  
  if (subtitle) {
    slide.addText(truncate(subtitle, 100), {
      x: MARGIN.left, y: 0.75, w: CONTENT_WIDTH, h: 0.25,
      fontSize: 10,
      italic: true,
      color: CONSULTING_COLORS.textLight,
      fontFace: 'Arial',
    });
  }
  
  // Funnel visualization (top area)
  const funnelY = 1.2;
  const funnelH = 0.7;
  const maxStages = Math.min(stages.length, 5);
  const stageWidth = (CONTENT_WIDTH - 0.2 * (maxStages - 1)) / maxStages;
  
  // Draw funnel circles (shrinking sizes)
  stages.slice(0, maxStages).forEach((stage, idx) => {
    const x = MARGIN.left + idx * (stageWidth + 0.2);
    const size = 0.6 - idx * 0.08;
    const centerX = x + stageWidth / 2 - size / 2;
    
    // Circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x: centerX, y: funnelY + (0.6 - size) / 2, w: size, h: size,
      fill: { color: idx === 0 ? CONSULTING_COLORS.navy : CONSULTING_COLORS.lightGray },
      line: { color: CONSULTING_COLORS.navy, width: 1 }
    });
    
    // Connector arrow (except last)
    if (idx < maxStages - 1) {
      slide.addText('→', {
        x: x + stageWidth, y: funnelY + 0.15, w: 0.2, h: 0.3,
        fontSize: 12,
        color: CONSULTING_COLORS.textLight,
        fontFace: 'Arial',
        align: 'center'
      });
    }
    
    // Stage label below circle
    slide.addText(truncate(stage.label, 25), {
      x: x, y: funnelY + funnelH + 0.1, w: stageWidth, h: 0.25,
      fontSize: 8,
      bold: true,
      color: CONSULTING_COLORS.navy,
      fontFace: 'Arial',
      align: 'center'
    });
  });
  
  // Description boxes below
  const descY = 2.3;
  const descHeight = keyMessage ? 2.0 : 2.5;
  
  stages.slice(0, maxStages).forEach((stage, idx) => {
    const x = MARGIN.left + idx * (stageWidth + 0.2);
    
    // Description header
    slide.addShape(pptx.ShapeType.rect, {
      x: x, y: descY, w: stageWidth, h: 0.25,
      fill: { color: CONSULTING_COLORS.lightGray }
    });
    slide.addText(truncate(stage.label, 20), {
      x: x + 0.05, y: descY, w: stageWidth - 0.1, h: 0.25,
      fontSize: 7,
      bold: true,
      color: CONSULTING_COLORS.navy,
      fontFace: 'Arial',
      valign: 'middle'
    });
    
    // Description text
    slide.addText(truncate(stage.description, 80), {
      x: x + 0.05, y: descY + 0.3, w: stageWidth - 0.1, h: 0.5,
      fontSize: 7,
      color: CONSULTING_COLORS.textMid,
      fontFace: 'Arial',
      valign: 'top'
    });
    
    // Sub-points
    if (stage.subPoints && stage.subPoints.length > 0) {
      const subY = descY + 0.85;
      stage.subPoints.slice(0, 3).forEach((sp, spIdx) => {
        slide.addText(`• ${truncate(sp, 30)}`, {
          x: x + 0.05, y: subY + spIdx * 0.2, w: stageWidth - 0.1, h: 0.2,
          fontSize: 6,
          color: CONSULTING_COLORS.textLight,
          fontFace: 'Arial',
        });
      });
    }
  });
  
  // Key message
  if (keyMessage) {
    slide.addShape(pptx.ShapeType.rect, {
      x: MARGIN.left, y: 4.7, w: CONTENT_WIDTH, h: 0.4,
      fill: { color: CONSULTING_COLORS.lightGray }
    });
    slide.addText(`→ ${truncate(keyMessage, 150)}`, {
      x: MARGIN.left + 0.15, y: 4.7, w: CONTENT_WIDTH - 0.3, h: 0.4,
      fontSize: 9,
      bold: true,
      color: CONSULTING_COLORS.navy,
      fontFace: 'Arial',
      valign: 'middle'
    });
  }
  
  addConsultingFooter(slide, slideNum, total);
  return slide;
}

/**
 * Financial/Metrics slide - Bar chart style
 */
export function buildMetricsSlide(
  pptx: PptxGenJS,
  title: string,
  subtitle: string | undefined,
  metrics: { label: string; value: number; unit?: string }[],
  insights: string[],
  keyMessage: string | undefined,
  slideNum: number,
  total: number
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  addWhiteBackground(slide, pptx);
  
  // Title
  slide.addText(title, {
    x: MARGIN.left, y: MARGIN.top, w: CONTENT_WIDTH, h: 0.45,
    fontSize: 18,
    bold: true,
    color: CONSULTING_COLORS.navy,
    fontFace: 'Arial',
  });
  
  if (subtitle) {
    slide.addText(truncate(subtitle, 100), {
      x: MARGIN.left, y: 0.75, w: CONTENT_WIDTH, h: 0.25,
      fontSize: 10,
      italic: true,
      color: CONSULTING_COLORS.textLight,
      fontFace: 'Arial',
    });
  }
  
  // Bar chart area
  const chartX = MARGIN.left;
  const chartY = 1.1;
  const chartW = 6.0;
  const chartH = 2.8;
  
  // Find max value for scaling
  const maxValue = Math.max(...metrics.map(m => m.value), 1);
  const maxBars = Math.min(metrics.length, 6);
  const barWidth = (chartW - 0.5) / maxBars;
  const barGap = 0.1;
  
  // Draw bars
  metrics.slice(0, maxBars).forEach((metric, idx) => {
    const x = chartX + 0.3 + idx * barWidth;
    const barHeight = (metric.value / maxValue) * (chartH - 0.8);
    const barY = chartY + chartH - 0.4 - barHeight;
    
    // Bar
    slide.addShape(pptx.ShapeType.rect, {
      x: x + barGap / 2, 
      y: barY, 
      w: barWidth - barGap, 
      h: barHeight,
      fill: { color: idx === 0 ? CONSULTING_COLORS.navy : CONSULTING_COLORS.chartBlue }
    });
    
    // Value label on top
    const displayValue = metric.unit ? `${metric.value}${metric.unit}` : metric.value.toString();
    slide.addText(displayValue, {
      x: x, y: barY - 0.25, w: barWidth, h: 0.25,
      fontSize: 9,
      bold: true,
      color: CONSULTING_COLORS.navy,
      fontFace: 'Arial',
      align: 'center'
    });
    
    // Label below
    slide.addText(truncate(metric.label, 15), {
      x: x, y: chartY + chartH - 0.35, w: barWidth, h: 0.35,
      fontSize: 7,
      color: CONSULTING_COLORS.textMid,
      fontFace: 'Arial',
      align: 'center',
      valign: 'top'
    });
  });
  
  // Baseline
  slide.addShape(pptx.ShapeType.rect, {
    x: chartX + 0.25, y: chartY + chartH - 0.4, w: chartW - 0.3, h: 0.01,
    fill: { color: CONSULTING_COLORS.textLight }
  });
  
  // Insights panel (right side)
  const insightsX = chartX + chartW + 0.3;
  const insightsW = W - insightsX - MARGIN.right;
  
  slide.addShape(pptx.ShapeType.rect, {
    x: insightsX, y: chartY, w: insightsW, h: 0.3,
    fill: { color: CONSULTING_COLORS.navyDark }
  });
  slide.addText('Key Insights', {
    x: insightsX + 0.1, y: chartY, w: insightsW - 0.2, h: 0.3,
    fontSize: 9,
    bold: true,
    color: CONSULTING_COLORS.white,
    fontFace: 'Arial',
    valign: 'middle'
  });
  
  // Insight items
  const maxInsights = Math.min(insights.length, 4);
  const insightH = (chartH - 0.4) / maxInsights;
  
  insights.slice(0, maxInsights).forEach((insight, idx) => {
    const y = chartY + 0.4 + idx * insightH;
    
    slide.addText(`${idx + 1}.`, {
      x: insightsX + 0.1, y: y, w: 0.25, h: insightH - 0.05,
      fontSize: 8,
      bold: true,
      color: CONSULTING_COLORS.blue,
      fontFace: 'Arial',
      valign: 'top'
    });
    
    slide.addText(truncate(insight, 60), {
      x: insightsX + 0.35, y: y, w: insightsW - 0.45, h: insightH - 0.05,
      fontSize: 8,
      color: CONSULTING_COLORS.textDark,
      fontFace: 'Arial',
      valign: 'top'
    });
  });
  
  // Key message
  if (keyMessage) {
    slide.addShape(pptx.ShapeType.rect, {
      x: MARGIN.left, y: 4.7, w: CONTENT_WIDTH, h: 0.4,
      fill: { color: CONSULTING_COLORS.lightGray }
    });
    slide.addText(`→ ${truncate(keyMessage, 150)}`, {
      x: MARGIN.left + 0.15, y: 4.7, w: CONTENT_WIDTH - 0.3, h: 0.4,
      fontSize: 9,
      bold: true,
      color: CONSULTING_COLORS.navy,
      fontFace: 'Arial',
      valign: 'middle'
    });
  }
  
  addConsultingFooter(slide, slideNum, total);
  return slide;
}

/**
 * Roadmap/Timeline slide - Phased approach
 */
export function buildRoadmapSlide(
  pptx: PptxGenJS,
  title: string,
  phases: { name: string; duration: string; activities: string[] }[],
  keyMessage: string | undefined,
  slideNum: number,
  total: number
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  addWhiteBackground(slide, pptx);
  
  // Title
  slide.addText(title, {
    x: MARGIN.left, y: MARGIN.top, w: CONTENT_WIDTH, h: 0.45,
    fontSize: 18,
    bold: true,
    color: CONSULTING_COLORS.navy,
    fontFace: 'Arial',
  });
  
  // Timeline area
  const timelineY = 1.0;
  const maxPhases = Math.min(phases.length, 4);
  const phaseWidth = (CONTENT_WIDTH - 0.2 * (maxPhases - 1)) / maxPhases;
  
  // Draw timeline bar
  slide.addShape(pptx.ShapeType.rect, {
    x: MARGIN.left, y: timelineY + 0.5, w: CONTENT_WIDTH, h: 0.08,
    fill: { color: CONSULTING_COLORS.borderGray }
  });
  
  // Phase markers and content
  phases.slice(0, maxPhases).forEach((phase, idx) => {
    const x = MARGIN.left + idx * (phaseWidth + 0.2);
    
    // Phase marker circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x: x + phaseWidth / 2 - 0.15, y: timelineY + 0.4, w: 0.3, h: 0.3,
      fill: { color: CONSULTING_COLORS.navy }
    });
    
    // Phase number in circle
    slide.addText(`${idx + 1}`, {
      x: x + phaseWidth / 2 - 0.15, y: timelineY + 0.4, w: 0.3, h: 0.3,
      fontSize: 10,
      bold: true,
      color: CONSULTING_COLORS.white,
      fontFace: 'Arial',
      align: 'center',
      valign: 'middle'
    });
    
    // Phase box
    const boxY = timelineY + 0.9;
    const boxH = keyMessage ? 2.8 : 3.3;
    
    slide.addShape(pptx.ShapeType.rect, {
      x: x, y: boxY, w: phaseWidth, h: boxH,
      fill: { color: CONSULTING_COLORS.lightGray },
      line: { color: CONSULTING_COLORS.borderGray, width: 0.5 }
    });
    
    // Phase header
    slide.addShape(pptx.ShapeType.rect, {
      x: x, y: boxY, w: phaseWidth, h: 0.35,
      fill: { color: CONSULTING_COLORS.navy }
    });
    
    slide.addText(truncate(phase.name, 20), {
      x: x + 0.1, y: boxY, w: phaseWidth - 0.2, h: 0.35,
      fontSize: 9,
      bold: true,
      color: CONSULTING_COLORS.white,
      fontFace: 'Arial',
      valign: 'middle'
    });
    
    // Duration badge
    slide.addText(phase.duration, {
      x: x + 0.1, y: boxY + 0.4, w: phaseWidth - 0.2, h: 0.2,
      fontSize: 7,
      italic: true,
      color: CONSULTING_COLORS.textLight,
      fontFace: 'Arial',
    });
    
    // Activities
    const maxActivities = Math.min(phase.activities.length, 5);
    phase.activities.slice(0, maxActivities).forEach((activity, aIdx) => {
      const actY = boxY + 0.7 + aIdx * 0.4;
      
      if (actY + 0.35 > boxY + boxH) return;
      
      slide.addText(`• ${truncate(activity, 40)}`, {
        x: x + 0.1, y: actY, w: phaseWidth - 0.2, h: 0.35,
        fontSize: 7,
        color: CONSULTING_COLORS.textDark,
        fontFace: 'Arial',
        valign: 'top'
      });
    });
  });
  
  // Key message
  if (keyMessage) {
    slide.addShape(pptx.ShapeType.rect, {
      x: MARGIN.left, y: 4.85, w: CONTENT_WIDTH, h: 0.4,
      fill: { color: CONSULTING_COLORS.lightGray }
    });
    slide.addText(`→ ${truncate(keyMessage, 150)}`, {
      x: MARGIN.left + 0.15, y: 4.85, w: CONTENT_WIDTH - 0.3, h: 0.4,
      fontSize: 9,
      bold: true,
      color: CONSULTING_COLORS.navy,
      fontFace: 'Arial',
      valign: 'middle'
    });
  }
  
  addConsultingFooter(slide, slideNum, total);
  return slide;
}

/**
 * Content slide with bullets - Clean two-column or single column
 */
export function buildContentSlide(
  pptx: PptxGenJS,
  title: string,
  subtitle: string | undefined,
  sections: { heading: string; points: string[] }[],
  keyMessage: string | undefined,
  slideNum: number,
  total: number
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  addWhiteBackground(slide, pptx);
  
  // Title
  slide.addText(title, {
    x: MARGIN.left, y: MARGIN.top, w: CONTENT_WIDTH, h: 0.45,
    fontSize: 18,
    bold: true,
    color: CONSULTING_COLORS.navy,
    fontFace: 'Arial',
  });
  
  let contentY = 0.85;
  if (subtitle) {
    slide.addText(truncate(subtitle, 120), {
      x: MARGIN.left, y: 0.75, w: CONTENT_WIDTH, h: 0.25,
      fontSize: 10,
      italic: true,
      color: CONSULTING_COLORS.textLight,
      fontFace: 'Arial',
    });
    contentY = 1.05;
  }
  
  // Underline accent
  slide.addShape(pptx.ShapeType.rect, {
    x: MARGIN.left, y: contentY - 0.05, w: 1.5, h: 0.03,
    fill: { color: CONSULTING_COLORS.blue }
  });
  
  // Section layout
  const maxSections = Math.min(sections.length, 3);
  const colCount = maxSections;
  const gap = 0.25;
  const colWidth = (CONTENT_WIDTH - (colCount - 1) * gap) / colCount;
  const availableHeight = keyMessage ? 3.4 : 4.0;
  
  sections.slice(0, maxSections).forEach((section, sIdx) => {
    const x = MARGIN.left + sIdx * (colWidth + gap);
    let localY = contentY + 0.1;
    
    // Section header with accent bar
    slide.addShape(pptx.ShapeType.rect, {
      x: x, y: localY, w: 0.05, h: 0.25,
      fill: { color: CONSULTING_COLORS.blue }
    });
    
    slide.addText(truncate(section.heading.toUpperCase(), 35), {
      x: x + 0.12, y: localY, w: colWidth - 0.15, h: 0.25,
      fontSize: 9,
      bold: true,
      color: CONSULTING_COLORS.navy,
      fontFace: 'Arial',
    });
    
    localY += 0.35;
    
    // Points
    const maxPoints = Math.min(section.points.length, Math.floor(availableHeight / 0.45));
    section.points.slice(0, maxPoints).forEach((point, pIdx) => {
      const pointY = localY + pIdx * 0.45;
      
      if (pointY + 0.4 > contentY + availableHeight) return;
      
      // Bullet
      slide.addShape(pptx.ShapeType.rect, {
        x: x + 0.05, y: pointY + 0.1, w: 0.08, h: 0.08,
        fill: { color: CONSULTING_COLORS.textLight }
      });
      
      slide.addText(truncate(point, colCount === 3 ? 70 : 100), {
        x: x + 0.18, y: pointY, w: colWidth - 0.22, h: 0.42,
        fontSize: 9,
        color: CONSULTING_COLORS.textDark,
        fontFace: 'Arial',
        valign: 'top'
      });
    });
  });
  
  // Key message
  if (keyMessage) {
    slide.addShape(pptx.ShapeType.rect, {
      x: MARGIN.left, y: 4.7, w: CONTENT_WIDTH, h: 0.4,
      fill: { color: CONSULTING_COLORS.lightGray }
    });
    slide.addText(`→ ${truncate(keyMessage, 150)}`, {
      x: MARGIN.left + 0.15, y: 4.7, w: CONTENT_WIDTH - 0.3, h: 0.4,
      fontSize: 9,
      bold: true,
      color: CONSULTING_COLORS.navy,
      fontFace: 'Arial',
      valign: 'middle'
    });
  }
  
  addConsultingFooter(slide, slideNum, total);
  return slide;
}

/**
 * CTA/Next Steps slide
 */
export function buildCTASlide(
  pptx: PptxGenJS,
  title: string,
  actions: { label: string; owner?: string; deadline?: string }[],
  contactInfo: { name?: string; email?: string; phone?: string } | undefined,
  slideNum: number,
  total: number
): PptxGenJS.Slide {
  const slide = pptx.addSlide();
  addWhiteBackground(slide, pptx);
  
  // Navy header
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 1.0,
    fill: { color: CONSULTING_COLORS.navyDark }
  });
  
  slide.addText(title, {
    x: MARGIN.left, y: 0.25, w: CONTENT_WIDTH, h: 0.5,
    fontSize: 22,
    bold: true,
    color: CONSULTING_COLORS.white,
    fontFace: 'Arial',
  });
  
  // Actions table
  const tableY = 1.3;
  const maxActions = Math.min(actions.length, 5);
  const rowHeight = 0.55;
  
  // Table header
  slide.addShape(pptx.ShapeType.rect, {
    x: MARGIN.left, y: tableY, w: CONTENT_WIDTH, h: 0.35,
    fill: { color: CONSULTING_COLORS.lightGray }
  });
  
  slide.addText('Action Item', {
    x: MARGIN.left + 0.1, y: tableY, w: 5, h: 0.35,
    fontSize: 8,
    bold: true,
    color: CONSULTING_COLORS.navy,
    fontFace: 'Arial',
    valign: 'middle'
  });
  slide.addText('Owner', {
    x: MARGIN.left + 5.2, y: tableY, w: 2, h: 0.35,
    fontSize: 8,
    bold: true,
    color: CONSULTING_COLORS.navy,
    fontFace: 'Arial',
    valign: 'middle'
  });
  slide.addText('Timeline', {
    x: MARGIN.left + 7.3, y: tableY, w: 1.8, h: 0.35,
    fontSize: 8,
    bold: true,
    color: CONSULTING_COLORS.navy,
    fontFace: 'Arial',
    valign: 'middle'
  });
  
  // Action rows
  actions.slice(0, maxActions).forEach((action, idx) => {
    const y = tableY + 0.4 + idx * rowHeight;
    
    // Row background
    if (idx % 2 === 1) {
      slide.addShape(pptx.ShapeType.rect, {
        x: MARGIN.left, y: y, w: CONTENT_WIDTH, h: rowHeight,
        fill: { color: CONSULTING_COLORS.offWhite }
      });
    }
    
    // Checkbox
    slide.addShape(pptx.ShapeType.rect, {
      x: MARGIN.left + 0.1, y: y + 0.15, w: 0.2, h: 0.2,
      line: { color: CONSULTING_COLORS.navy, width: 1 }
    });
    
    // Action label
    slide.addText(truncate(action.label, 60), {
      x: MARGIN.left + 0.4, y: y, w: 4.7, h: rowHeight,
      fontSize: 9,
      color: CONSULTING_COLORS.textDark,
      fontFace: 'Arial',
      valign: 'middle'
    });
    
    // Owner
    slide.addText(action.owner || '-', {
      x: MARGIN.left + 5.2, y: y, w: 2, h: rowHeight,
      fontSize: 8,
      color: CONSULTING_COLORS.textMid,
      fontFace: 'Arial',
      valign: 'middle'
    });
    
    // Deadline
    slide.addText(action.deadline || '-', {
      x: MARGIN.left + 7.3, y: y, w: 1.8, h: rowHeight,
      fontSize: 8,
      color: CONSULTING_COLORS.textMid,
      fontFace: 'Arial',
      valign: 'middle'
    });
    
    // Row separator
    slide.addShape(pptx.ShapeType.rect, {
      x: MARGIN.left, y: y + rowHeight, w: CONTENT_WIDTH, h: 0.01,
      fill: { color: CONSULTING_COLORS.borderGray }
    });
  });
  
  // Contact info box
  if (contactInfo) {
    const infoY = 4.3;
    slide.addShape(pptx.ShapeType.rect, {
      x: MARGIN.left, y: infoY, w: 4, h: 0.8,
      fill: { color: CONSULTING_COLORS.lightGray }
    });
    
    slide.addText('Contact', {
      x: MARGIN.left + 0.15, y: infoY + 0.05, w: 3.7, h: 0.25,
      fontSize: 8,
      bold: true,
      color: CONSULTING_COLORS.navy,
      fontFace: 'Arial',
    });
    
    const contactText = [
      contactInfo.name,
      contactInfo.email,
      contactInfo.phone
    ].filter(Boolean).join(' • ');
    
    slide.addText(contactText, {
      x: MARGIN.left + 0.15, y: infoY + 0.3, w: 3.7, h: 0.4,
      fontSize: 8,
      color: CONSULTING_COLORS.textMid,
      fontFace: 'Arial',
    });
  }
  
  addConsultingFooter(slide, slideNum, total);
  return slide;
}
