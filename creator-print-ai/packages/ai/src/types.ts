import type { PreflightResult } from "@creator-print-ai/core";

export type RecommendProductsInput = {
  audience: string;
  goal: string;
};

export type ProductRecommendation = {
  productSlug: string;
  reason: string;
  priority: number;
};

export type GenerateImageInput = {
  prompt: string;
  brandColors?: string[];
  size?: "square" | "portrait" | "landscape";
};

export type GeneratedImageResult = {
  id: string;
  status: "mock" | "generated";
  imageUrl?: string;
  prompt: string;
  safety: "passed" | "blocked" | "manual_review";
};

export type EditImageInput = {
  imageUrl: string;
  instruction: string;
};

export type EditedImageResult = GeneratedImageResult;

export type ImprovePromptInput = {
  prompt: string;
  audience?: string;
};

export type PromptResult = {
  prompt: string;
};

export type CopyInput = {
  productSlug: string;
  audience: string;
  tone: string;
};

export type CopyResult = {
  headline: string;
  body: string;
  cta: string;
};

export interface AiDesignAssistant {
  recommendProducts(input: RecommendProductsInput): Promise<ProductRecommendation[]>;
  generateImage(input: GenerateImageInput): Promise<GeneratedImageResult>;
  editImage(input: EditImageInput): Promise<EditedImageResult>;
  improvePrompt(input: ImprovePromptInput): Promise<PromptResult>;
  writeProductCopy(input: CopyInput): Promise<CopyResult>;
  runPreflightNarration(input: PreflightResult): Promise<string>;
}
