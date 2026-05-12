import type {
  DesignEditAction,
  PlanDesignEditsInput,
  PlanDesignEditsResult,
} from "./types";

const colorNames: Record<string, string> = {
  black: "#06131a",
  blue: "#2563eb",
  green: "#16a34a",
  orange: "#f97316",
  pink: "#ec4899",
  purple: "#7c3aed",
  red: "#ef4444",
  teal: "#00a9b7",
  white: "#ffffff",
  yellow: "#d5ff5f",
};

export function planDeterministicDesignEdits(
  input: PlanDesignEditsInput,
): PlanDesignEditsResult {
  const instruction = input.instruction.trim();
  const lower = instruction.toLowerCase();
  const actions: DesignEditAction[] = [];
  const text = extractText(instruction);
  const color = extractBackgroundColor(instruction);
  const url = extractQrUrl(instruction);

  if (text) {
    actions.push({ type: "add_text", text });
  }

  if (color) {
    actions.push({ type: "set_background", color });
  }

  if (url) {
    actions.push({ type: "add_qr", url });
  }

  if (actions.length === 0 && shouldGenerateImage(lower)) {
    actions.push({ type: "generate_image", prompt: instruction });
  }

  return {
    summary:
      actions.length > 0
        ? `I can directly apply ${actions.length} edit${actions.length === 1 ? "" : "s"} to this design.`
        : "I can suggest changes, but I need a clearer direct edit like add text, set a background color, add a QR code, or generate artwork.",
    actions,
  };
}

function extractText(instruction: string): string | undefined {
  const quoted = instruction.match(/"([^"]+)"/);
  if (quoted?.[1]?.trim()) {
    return quoted[1].trim();
  }

  const textRequest = instruction.match(
    /\b(?:add|insert|place|write)\s+(?:the\s+)?(?:text|headline|copy|caption)\s+(?:that\s+says\s+|saying\s+|to\s+say\s+)?([^,.]+)/i,
  );

  return cleanTextValue(textRequest?.[1]);
}

function extractBackgroundColor(instruction: string): string | undefined {
  if (!/\b(?:background|bg|canvas)\b/i.test(instruction)) return undefined;

  const hex = instruction.match(/#[0-9a-f]{3}(?:[0-9a-f]{3})?\b/i);
  if (hex) return hex[0].toLowerCase();

  const lower = instruction.toLowerCase();
  const colorName = Object.keys(colorNames).find((name) =>
    lower.includes(name),
  );
  return colorName ? colorNames[colorName] : undefined;
}

function extractQrUrl(instruction: string): string | undefined {
  if (!/\bqr\b|\bcode\b/i.test(instruction)) return undefined;

  const url = instruction.match(/https?:\/\/[^\s,]+/i);
  return url?.[0]?.replace(/[.)]+$/, "") ?? "https://creatorprint.ai";
}

function shouldGenerateImage(lower: string): boolean {
  return (
    lower.includes("generate image") ||
    lower.includes("create image") ||
    lower.includes("make image") ||
    lower.includes("generate art") ||
    lower.includes("create art")
  );
}

function cleanTextValue(value?: string): string | undefined {
  const cleaned = value?.replace(/\s+\band\b.*$/i, "").trim();
  return cleaned || undefined;
}
