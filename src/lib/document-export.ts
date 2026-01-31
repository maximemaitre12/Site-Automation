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
  const marginBottom = 25;
  const contentWidth = pageWidth - marginLeft - marginRight;
  const maxY = pageHeight - marginBottom;
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

  yPosition = 35;

  // --- DOCUMENT TITLE ---
  pdf.setFontSize(22);
  pdf.setFont(pdfFont, "bold");
  pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  
  const titleLines = pdf.splitTextToSize(doc.title, contentWidth);
  titleLines.forEach((line: string) => {
    pdf.text(line, marginLeft, yPosition);
    yPosition += 9;
  });
  yPosition += 3;

  // Title underline (accent)
  pdf.setDrawColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
  pdf.setLineWidth(1);
  pdf.line(marginLeft, yPosition, marginLeft + 60, yPosition);
  yPosition += 15;

  // --- PROCESS CONTENT ---
  const lines = doc.content.split("\n");
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
      checkPageBreak(wrappedText.length * 5 + 2);
      
      wrappedText.forEach((textLine: string, i: number) => {
        pdf.text(textLine, marginLeft, yPosition + i * 5);
      });
      yPosition += wrappedText.length * 5 + 4;
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
