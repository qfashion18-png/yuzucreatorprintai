import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type ProofPdfInput = {
  designId: string;
  productName: string;
  widthIn: number;
  heightIn: number;
  warnings: string[];
};

export async function renderProofPdfPlaceholder(input: ProofPdfInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([input.widthIn * 72, input.heightIn * 72]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();

  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.98, 0.99, 1),
    borderColor: rgb(0.05, 0.1, 0.13),
    borderWidth: 1,
  });
  page.drawText("CreatorPrint AI Proof", { x: 24, y: height - 42, size: 16, font: bold, color: rgb(0.03, 0.08, 0.1) });
  page.drawText(input.productName, { x: 24, y: height - 68, size: 10, font, color: rgb(0.14, 0.2, 0.24) });
  page.drawText(`Design: ${input.designId}`, { x: 24, y: height - 86, size: 8, font, color: rgb(0.28, 0.34, 0.38) });
  page.drawRectangle({
    x: width * 0.18,
    y: height * 0.22,
    width: width * 0.64,
    height: height * 0.48,
    borderColor: rgb(0.0, 0.55, 0.62),
    borderWidth: 1.5,
  });
  page.drawText("Proof preview placeholder", {
    x: width * 0.22,
    y: height * 0.45,
    size: 10,
    font,
    color: rgb(0.0, 0.45, 0.5),
  });

  const warningText = input.warnings.length
    ? input.warnings.join(" ")
    : "No blocking warnings in mock preflight. Final commercial validation requires live provider specs.";
  page.drawText(warningText.slice(0, 170), {
    x: 24,
    y: 28,
    size: 7,
    font,
    color: rgb(0.63, 0.28, 0.03),
    maxWidth: width - 48,
  });

  return pdf.save();
}

export function createProofImagePlaceholder(designId: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><rect width="1200" height="900" fill="#f8fbff"/><rect x="150" y="120" width="900" height="600" fill="#fff" stroke="#00a9b7" stroke-width="8"/><text x="190" y="210" font-family="Arial" font-size="54" fill="#06131a">CreatorPrint AI Proof</text><text x="190" y="290" font-family="Arial" font-size="32" fill="#334155">${designId}</text><text x="190" y="790" font-family="Arial" font-size="26" fill="#b45309">Commercial print validation requires final provider specs.</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
