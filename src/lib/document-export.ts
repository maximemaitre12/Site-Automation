import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { jsPDF } from "jspdf";

export interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  companyName: string;
  logoUrl: string;
  tagline: string;
}

export interface DocumentData {
  title: string;
  content: string;
  createdAt: string;
  version: number;
}

// Helper to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

// Clean content from markdown artifacts
function cleanContent(text: string): string {
  return text
    .replace(/^#+\s*/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^[-*]\s+/gm, "• ")
    .replace(/\[([^\]]+)\]/g, "$1")
    .replace(/---+/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

// Detect if line is a header
function isHeader(text: string): boolean {
  const cleaned = text.trim();
  if (cleaned.length > 60) return false;
  if (cleaned === cleaned.toUpperCase() && cleaned.length > 3) return true;
  if (cleaned.endsWith(":") && cleaned.length < 50) return true;
  return false;
}

// Remove duplicate content - aggressive deduplication
function removeDuplicateContent(content: string): string {
  // First, check if the content is duplicated as a whole (repeated twice)
  const halfLength = Math.floor(content.length / 2);
  const firstHalf = content.substring(0, halfLength).trim();
  const secondHalf = content.substring(halfLength).trim();
  
  // If the two halves are very similar (>80% overlap), keep only the second (usually more complete)
  const similarity = calculateSimilarity(firstHalf, secondHalf);
  if (similarity > 0.8 && content.length > 500) {
    console.log('[PDF] Detected duplicated content, keeping second half');
    return secondHalf;
  }
  
  // Otherwise, do paragraph-level deduplication
  const paragraphs = content.split(/\n{2,}/);
  const seen = new Set<string>();
  const unique: string[] = [];
  
  for (const para of paragraphs) {
    const normalized = para.trim().toLowerCase().replace(/\s+/g, ' ');
    if (normalized.length > 50 && seen.has(normalized)) {
      continue; // Skip duplicate paragraph
    }
    if (normalized.length > 50) {
      seen.add(normalized);
    }
    unique.push(para);
  }
  
  return unique.join('\n\n');
}

// Calculate similarity between two strings (0-1)
function calculateSimilarity(a: string, b: string): number {
  const wordsA = a.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const wordsB = b.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  
  if (wordsA.length === 0 || wordsB.length === 0) return 0;
  
  const setA = new Set(wordsA);
  const setB = new Set(wordsB);
  
  let intersection = 0;
  for (const word of setA) {
    if (setB.has(word)) intersection++;
  }
  
  return intersection / Math.max(setA.size, setB.size);
}

// Detect email format content
function isEmailContent(content: string): boolean {
  const emailIndicators = [
    /^(cher|chère|bonjour|madame|monsieur)/im,
    /cordialement|sincèrement|bien à vous|salutations/im,
    /je vous (prie|invite|informe|écris)/im,
  ];
  return emailIndicators.some(regex => regex.test(content));
}

// Generate professional PDF with impeccable layout
export async function generatePDF(
  doc: DocumentData,
  branding: BrandingSettings
): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginLeft = 20;
  const marginRight = 20;
  const marginTop = 25;
  const marginBottom = 30; // Increased for footer space
  const contentWidth = pageWidth - marginLeft - marginRight;
  const maxY = pageHeight - marginBottom - 10; // Extra safety margin for footer
  let yPosition = marginTop;

  const primaryRgb = hexToRgb(branding.primaryColor);
  const secondaryRgb = hexToRgb(branding.secondaryColor);

  // Font mapping
  const fontMapping: Record<string, string> = {
    "Calibri": "helvetica",
    "Arial": "helvetica",
    "Times New Roman": "times",
    "Georgia": "times",
    "Verdana": "helvetica",
    "Garamond": "times",
  };
  const pdfFont = fontMapping[branding.fontFamily] || "helvetica";
  pdf.setFont(pdfFont);

  // --- DEDUPLICATE CONTENT (aggressive) ---
  const cleanedContent = removeDuplicateContent(doc.content);
  const isEmail = isEmailContent(cleanedContent);
  
  // For emails, skip the big title header completely
  const skipTitleSection = isEmail || doc.title.toLowerCase() === 'document' || doc.title.toLowerCase() === 'email';

  // --- COVER PAGE HEADER ---
  // Top colored bar
  pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  pdf.rect(0, 0, pageWidth, 10, "F");

  // Company name in header
  if (branding.companyName) {
    pdf.setFontSize(9);
    pdf.setTextColor(255, 255, 255);
    pdf.text(branding.companyName.toUpperCase(), marginLeft, 7);
    
    // Date on the right
    const dateStr = format(new Date(doc.createdAt), "d MMMM yyyy", { locale: fr });
    pdf.setFontSize(8);
    const dateWidth = pdf.getTextWidth(dateStr);
    pdf.text(dateStr, pageWidth - marginRight - dateWidth, 7);
  }

  yPosition = 20;

  // --- DOCUMENT TITLE (skip for emails/generic) ---
  if (!skipTitleSection) {
    pdf.setFontSize(14); // Reduced from 18
    pdf.setFont(pdfFont, "bold");
    pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    
    const titleLines = pdf.splitTextToSize(doc.title, contentWidth);
    titleLines.forEach((line: string) => {
      pdf.text(line, marginLeft, yPosition);
      yPosition += 6;
    });
    yPosition += 3;

    // Title underline (accent)
    pdf.setDrawColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
    pdf.setLineWidth(0.5);
    pdf.line(marginLeft, yPosition, marginLeft + 40, yPosition);
    yPosition += 8;
  }

  // --- PROCESS CONTENT (use deduplicated content) ---
  const lines = cleanedContent.split("\n");
  pdf.setTextColor(40, 40, 40);

  const checkPageBreak = (neededSpace: number) => {
    if (yPosition + neededSpace > maxY) {
      addNewPage();
    }
  };

  const addNewPage = () => {
    pdf.addPage();
    // Subtle header bar on continuation pages
    pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    pdf.rect(0, 0, pageWidth, 6, "F");
    yPosition = 20;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Empty line = small spacing
    if (!trimmed) {
      yPosition += 4;
      continue;
    }

    const cleaned = cleanContent(trimmed);
    if (!cleaned) continue;

    // Check if this is a section header
    if (isHeader(cleaned)) {
      checkPageBreak(18);
      yPosition += 8;
      
      pdf.setFontSize(12);
      pdf.setFont(pdfFont, "bold");
      pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
      
      const headerText = cleaned.replace(/:$/, "");
      pdf.text(headerText, marginLeft, yPosition);
      
      // Subtle underline for section headers
      const headerWidth = Math.min(pdf.getTextWidth(headerText), contentWidth * 0.6);
      pdf.setDrawColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
      pdf.setLineWidth(0.3);
      pdf.line(marginLeft, yPosition + 2, marginLeft + headerWidth, yPosition + 2);
      
      yPosition += 10;
      pdf.setTextColor(40, 40, 40);
    }
    // Bullet point
    else if (cleaned.startsWith("•") || cleaned.startsWith("-")) {
      const bulletText = cleaned.replace(/^[•\-]\s*/, "").trim();
      const wrappedText = pdf.splitTextToSize(bulletText, contentWidth - 8);
      
      checkPageBreak(wrappedText.length * 5 + 2);
      
      pdf.setFontSize(10);
      pdf.setFont(pdfFont, "normal");
      pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
      pdf.text("•", marginLeft + 2, yPosition);
      pdf.setTextColor(40, 40, 40);
      
      wrappedText.forEach((textLine: string, i: number) => {
        pdf.text(textLine, marginLeft + 8, yPosition + i * 5);
      });
      yPosition += wrappedText.length * 5 + 3;
    }
    // Regular paragraph
    else {
      pdf.setFontSize(10);
      pdf.setFont(pdfFont, "normal");
      
      const wrappedText = pdf.splitTextToSize(cleaned, contentWidth);
      const lineHeight = 5;
      const paragraphHeight = wrappedText.length * lineHeight + 4;
      
      // Check page break BEFORE drawing
      checkPageBreak(paragraphHeight);
      
      wrappedText.forEach((textLine: string, i: number) => {
        // Double-check we're not going past maxY
        if (yPosition + i * lineHeight > maxY) {
          addNewPage();
        }
        pdf.text(textLine, marginLeft, yPosition + i * lineHeight);
      });
      yPosition += paragraphHeight;
    }
  }

  // --- ADD FOOTERS TO ALL PAGES ---
  const totalPages = pdf.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    // Footer separator line
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.2);
    pdf.line(marginLeft, pageHeight - 15, pageWidth - marginRight, pageHeight - 15);
    
    // Footer text
    pdf.setFontSize(8);
    pdf.setFont(pdfFont, "normal");
    pdf.setTextColor(120, 120, 120);
    
    const footerLeft = branding.companyName 
      ? `${branding.companyName} • Document généré par AETHER`
      : "Document généré par AETHER";
    pdf.text(footerLeft, marginLeft, pageHeight - 10);
    
    const pageText = `Page ${i}/${totalPages}`;
    const pageTextWidth = pdf.getTextWidth(pageText);
    pdf.text(pageText, pageWidth - marginRight - pageTextWidth, pageHeight - 10);
  }

  return pdf.output("blob");
}

// Generate Word document with branding
export async function generateWord(
  doc: DocumentData,
  branding: BrandingSettings
): Promise<Blob> {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    Header,
    Footer,
    PageNumber,
    convertInchesToTwip,
    BorderStyle,
  } = await import("docx");

  // Convert hex to Word color (without #)
  const primaryWordColor = branding.primaryColor.replace("#", "");
  const secondaryWordColor = branding.secondaryColor.replace("#", "");

  const fontFamily = branding.fontFamily || "Calibri";

  // Parse content
  const lines = doc.content.split("\n");
  const paragraphs: any[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      paragraphs.push(new Paragraph({ spacing: { after: 120 } }));
      return;
    }

    const cleaned = cleanContent(trimmed);
    if (!cleaned) return;

    if (isHeader(cleaned)) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cleaned.replace(/:$/, ""),
              bold: true,
              size: 26,
              font: fontFamily,
              color: secondaryWordColor,
            }),
          ],
          spacing: { before: 360, after: 160 },
          border: {
            bottom: {
              color: secondaryWordColor,
              space: 4,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );
    } else if (cleaned.startsWith("•") || /^\d+\.\s/.test(cleaned)) {
      const bulletText = cleaned.replace(/^[•]\s*/, "").replace(/^\d+\.\s*/, "");
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "  •  ",
              font: fontFamily,
              size: 22,
            }),
            new TextRun({
              text: bulletText,
              font: fontFamily,
              size: 22,
            }),
          ],
          spacing: { after: 80, line: 276 },
          indent: { left: convertInchesToTwip(0.25) },
        })
      );
    } else {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cleaned,
              font: fontFamily,
              size: 22,
            }),
          ],
          spacing: { after: 160, line: 276 },
          alignment: AlignmentType.JUSTIFIED,
        })
      );
    }
  });

  const wordDoc = new Document({
    creator: branding.companyName || "AETHER",
    title: doc.title,
    description: "Document professionnel",
    styles: {
      default: {
        heading1: {
          run: {
            font: fontFamily === "Times New Roman" ? "Times New Roman" : "Calibri Light",
            size: 52,
            bold: true,
            color: primaryWordColor,
          },
          paragraph: {
            spacing: { after: 320, before: 0 },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1.25),
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: branding.companyName || doc.title,
                    font: fontFamily,
                    size: 18,
                    color: "808080",
                    italics: true,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
                border: {
                  bottom: {
                    color: "CCCCCC",
                    space: 4,
                    style: BorderStyle.SINGLE,
                    size: 4,
                  },
                },
                spacing: { after: 200 },
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Page ",
                    font: fontFamily,
                    size: 18,
                    color: "808080",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: fontFamily,
                    size: 18,
                    color: "808080",
                  }),
                  new TextRun({
                    text: " sur ",
                    font: fontFamily,
                    size: 18,
                    color: "808080",
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: fontFamily,
                    size: 18,
                    color: "808080",
                  }),
                ],
                alignment: AlignmentType.CENTER,
                border: {
                  top: {
                    color: "CCCCCC",
                    space: 4,
                    style: BorderStyle.SINGLE,
                    size: 4,
                  },
                },
                spacing: { before: 200 },
              }),
            ],
          }),
        },
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: doc.title,
                font: fontFamily === "Times New Roman" ? "Times New Roman" : "Calibri Light",
                size: 56,
                bold: true,
                color: primaryWordColor,
              }),
            ],
            spacing: { after: 120 },
            alignment: AlignmentType.LEFT,
          }),
          // Date
          new Paragraph({
            children: [
              new TextRun({
                text: format(new Date(doc.createdAt), "d MMMM yyyy", { locale: fr }),
                font: fontFamily,
                size: 20,
                color: "666666",
                italics: true,
              }),
            ],
            spacing: { after: 400 },
            border: {
              bottom: {
                color: primaryWordColor,
                space: 8,
                style: BorderStyle.SINGLE,
                size: 12,
              },
            },
          }),
          new Paragraph({ spacing: { after: 200 } }),
          ...paragraphs,
        ],
      },
    ],
  });

  return Packer.toBlob(wordDoc);
}
