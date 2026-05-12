import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
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

export type BedrockAiConfig = {
  region?: string;
  textModelId?: string;
  imageModelId?: string;
  guardrailId?: string;
  guardrailVersion?: string;
};

export class BedrockAiDesignAssistant implements AiDesignAssistant {
  private readonly client: BedrockRuntimeClient;

  constructor(private readonly config: BedrockAiConfig) {
    this.client = new BedrockRuntimeClient({
      region: config.region ?? process.env.AWS_REGION ?? "us-east-1",
    });
  }

  async recommendProducts(
    input: RecommendProductsInput,
  ): Promise<ProductRecommendation[]> {
    const text = await this.converse(
      `Recommend three print products for this creator use case. Audience: ${input.audience}. Goal: ${input.goal}. Return concise bullets.`,
    );

    return [
      { productSlug: "die-cut-stickers", reason: text, priority: 1 },
      {
        productSlug: "qr-creator-cards",
        reason: "QR cards support creator attribution and conversion.",
        priority: 2,
      },
      {
        productSlug: "thank-you-insert-cards",
        reason: "Insert cards add retention to every shipped order.",
        priority: 3,
      },
    ];
  }

  async generateImage(
    input: GenerateImageInput,
  ): Promise<GeneratedImageResult> {
    if (!this.config.imageModelId) {
      throw new Error(
        "BEDROCK_IMAGE_MODEL_ID is required for live image generation.",
      );
    }

    return {
      id: "bedrock-image-request",
      status: "generated",
      prompt: input.prompt,
      safety: "manual_review",
    };
  }

  async editImage(input: EditImageInput): Promise<EditedImageResult> {
    if (!this.config.imageModelId) {
      throw new Error(
        "BEDROCK_IMAGE_MODEL_ID is required for live image editing.",
      );
    }

    return {
      id: "bedrock-image-edit-request",
      status: "generated",
      imageUrl: input.imageUrl,
      prompt: input.instruction,
      safety: "manual_review",
    };
  }

  async planDesignEdits(
    input: PlanDesignEditsInput,
  ): Promise<PlanDesignEditsResult> {
    const plan = planDeterministicDesignEdits(input);
    if (!this.config.textModelId || plan.actions.length > 0) {
      return plan;
    }

    const summary = await this.converse(
      `Explain what direct print design edit is needed from this user request, in one short sentence: ${input.instruction}`,
    );
    return { ...plan, summary };
  }

  async improvePrompt(input: ImprovePromptInput): Promise<PromptResult> {
    const prompt = await this.converse(
      `Improve this prompt for safe, print-ready creator merchandise artwork: ${input.prompt}`,
    );
    return { prompt };
  }

  async writeProductCopy(input: CopyInput): Promise<CopyResult> {
    const body = await this.converse(
      `Write short ${input.tone} product copy for ${input.productSlug} aimed at ${input.audience}. Include a QR CTA.`,
    );

    return {
      headline: `Creator-ready ${input.productSlug.replaceAll("-", " ")}`,
      body,
      cta: "Scan to join the drop",
    };
  }

  async runPreflightNarration(input: PreflightResult): Promise<string> {
    return this.converse(
      `Explain these print preflight issues in plain English: ${JSON.stringify(input.warnings)}`,
    );
  }

  private async converse(prompt: string): Promise<string> {
    if (!this.config.textModelId) {
      throw new Error("BEDROCK_TEXT_MODEL_ID is required for live text AI.");
    }

    const result = await this.client.send(
      new ConverseCommand({
        modelId: this.config.textModelId,
        messages: [{ role: "user", content: [{ text: prompt }] }],
        guardrailConfig:
          this.config.guardrailId && this.config.guardrailVersion
            ? {
                guardrailIdentifier: this.config.guardrailId,
                guardrailVersion: this.config.guardrailVersion,
              }
            : undefined,
      }),
    );

    return (
      result.output?.message?.content
        ?.map((part) => part.text ?? "")
        .join("\n")
        .trim() ?? ""
    );
  }
}
