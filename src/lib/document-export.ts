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

// Generate professional PDF
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
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  const primaryRgb = hexToRgb(branding.primaryColor);
  const secondaryRgb = hexToRgb(branding.secondaryColor);

  // Determine font (jsPDF has limited fonts, we'll use the closest)
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

  // Header bar
  pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  pdf.rect(0, 0, pageWidth, 12, "F");

  // Company name in header if provided
  if (branding.companyName) {
    pdf.setFontSize(8);
    pdf.setTextColor(255, 255, 255);
    pdf.text(branding.companyName.toUpperCase(), margin, 8);
  }

  yPosition = 30;

  // Document title
  pdf.setFontSize(24);
  pdf.setFont(pdfFont, "bold");
  pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  
  const titleLines = pdf.splitTextToSize(doc.title, contentWidth);
  pdf.text(titleLines, margin, yPosition);
  yPosition += titleLines.length * 10 + 5;

  // Date subtitle
  pdf.setFontSize(10);
  pdf.setFont(pdfFont, "italic");
  pdf.setTextColor(128, 128, 128);
  const dateStr = format(new Date(doc.createdAt), "d MMMM yyyy", { locale: fr });
  pdf.text(dateStr, margin, yPosition);
  yPosition += 8;

  // Title underline
  pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  pdf.setLineWidth(0.8);
  pdf.line(margin, yPosition, margin + 50, yPosition);
  yPosition += 15;

  // Content
  const lines = doc.content.split("\n");
  pdf.setTextColor(51, 51, 51);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      yPosition += 4;
      continue;
    }

    const cleaned = cleanContent(trimmed);
    if (!cleaned) continue;

    // Check if we need a new page
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = margin;

      // Add header to new page
      pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      pdf.rect(0, 0, pageWidth, 8, "F");
      yPosition = 20;
    }

    if (isHeader(cleaned)) {
      // Section header
      yPosition += 6;
      pdf.setFontSize(13);
      pdf.setFont(pdfFont, "bold");
      pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
      pdf.text(cleaned.replace(/:$/, ""), margin, yPosition);
      yPosition += 2;
      
      // Underline for headers
      pdf.setDrawColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
      pdf.setLineWidth(0.3);
      const headerWidth = pdf.getTextWidth(cleaned.replace(/:$/, ""));
      pdf.line(margin, yPosition + 1, margin + headerWidth, yPosition + 1);
      yPosition += 8;
    } else if (cleaned.startsWith("•")) {
      // Bullet point
      pdf.setFontSize(10);
      pdf.setFont(pdfFont, "normal");
      pdf.setTextColor(51, 51, 51);
      
      const bulletText = cleaned.substring(1).trim();
      const wrappedText = pdf.splitTextToSize(bulletText, contentWidth - 10);
      
      pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      pdf.text("•", margin + 3, yPosition);
      pdf.setTextColor(51, 51, 51);
      pdf.text(wrappedText, margin + 8, yPosition);
      yPosition += wrappedText.length * 5 + 2;
    } else {
      // Regular paragraph
      pdf.setFontSize(10);
      pdf.setFont(pdfFont, "normal");
      pdf.setTextColor(51, 51, 51);
      
      const wrappedText = pdf.splitTextToSize(cleaned, contentWidth);
      pdf.text(wrappedText, margin, yPosition);
      yPosition += wrappedText.length * 5 + 3;
    }
  }

  // Footer on each page
  const totalPages = pdf.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    // Footer line
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    // Footer text
    pdf.setFontSize(8);
    pdf.setFont(pdfFont, "normal");
    pdf.setTextColor(128, 128, 128);
    
    const footerLeft = branding.companyName 
      ? `${branding.companyName} • Document généré par AETHER`
      : "Document généré par AETHER";
    pdf.text(footerLeft, margin, pageHeight - 10);
    
    const pageText = `Page ${i} sur ${totalPages}`;
    const pageTextWidth = pdf.getTextWidth(pageText);
    pdf.text(pageText, pageWidth - margin - pageTextWidth, pageHeight - 10);
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
