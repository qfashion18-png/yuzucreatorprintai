import type { PreflightResult } from "@creator-print-ai/core";
import { planDeterministicDesignEdits } from "./design-edits";
import type {
  AiDesignAssistant,
  CopyInput,
  CopyResult,
  EditedImageResult,
  EditImageInput,
  GeneratedImageResult,
  GenerateImageInput,
  ImprovePromptInput,
  PlanDesignEditsInput,
  PlanDesignEditsResult,
  ProductRecommendation,
  PromptResult,
  RecommendProductsInput,
} from "./types";

export class MockAiDesignAssistant implements AiDesignAssistant {
  async recommendProducts(
    _input: RecommendProductsInput,
  ): Promise<ProductRecommendation[]> {
    return [
      {
        productSlug: "die-cut-stickers",
        reason:
          "Stickers are the easiest first touchpoint for creator drops and unboxing extras.",
        priority: 1,
      },
      {
        productSlug: "qr-creator-cards",
        reason:
          "QR cards turn in-person moments into follows, listens, signups, and shop visits.",
        priority: 2,
      },
      {
        productSlug: "thank-you-insert-cards",
        reason:
          "Insert cards add a direct CTA to every shipment without changing the product.",
        priority: 3,
      },
    ];
  }

  async generateImage(
    input: GenerateImageInput,
  ): Promise<GeneratedImageResult> {
    const safe = moderateText(input.prompt);
    return {
      id: "mock-generated-image",
      status: "mock",
      imageUrl: safe ? "/mock/generated-sticker.png" : undefined,
      prompt: input.prompt,
      safety: safe ? "passed" : "blocked",
    };
  }

  async editImage(input: EditImageInput): Promise<EditedImageResult> {
    const safe = moderateText(input.instruction);
    return {
      id: "mock-edited-image",
      status: "mock",
      imageUrl: safe ? input.imageUrl : undefined,
      prompt: input.instruction,
      safety: safe ? "passed" : "blocked",
    };
  }

  async planDesignEdits(
    input: PlanDesignEditsInput,
  ): Promise<PlanDesignEditsResult> {
    if (!moderateText(input.instruction)) {
      return {
        summary:
          "I cannot directly apply that edit because it needs safety review.",
        actions: [],
      };
    }

    return planDeterministicDesignEdits(input);
  }

  async improvePrompt(input: ImprovePromptInput): Promise<PromptResult> {
    return {
      prompt: `Create print-ready creator merch artwork for ${input.audience ?? "a creator audience"}: ${input.prompt}. Use bold shapes, clean edges, strong contrast, and leave breathing room for trim and safe zones.`,
    };
  }

  async writeProductCopy(input: CopyInput): Promise<CopyResult> {
    return {
      headline: `Launch-ready ${input.productSlug.replaceAll("-", " ")}`,
      body: `A ${input.tone} piece built for ${input.audience}, with a clear QR CTA and social-ready drop language.`,
      cta: "Scan to join the drop",
    };
  }

  async runPreflightNarration(input: PreflightResult): Promise<string> {
    if (input.status === "pass") {
      return "Your design is in good print shape. Review the proof once more, then approve it for quote and checkout.";
    }

    const issueText = input.warnings
      .map((warning) => warning.message.toLowerCase())
      .join(" ");
    return `A few print readiness items need attention: ${issueText}. Fix resolution or safe-zone warnings before approving the proof.`;
  }
}

export function moderateText(text: string): boolean {
  const blockedTerms = ["hate", "explicit violence", "self harm"];
  const normalized = text.toLowerCase();
  return !blockedTerms.some((term) => normalized.includes(term));
}
