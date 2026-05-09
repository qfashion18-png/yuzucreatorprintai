import { z } from "zod";

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});

export const templateSlotSchema = z.object({
  id: z.string(),
  type: z.enum(["image", "text", "qr", "shape"]),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  locked: z.boolean().optional(),
  defaultValue: z.string().optional(),
});

export const templateSchema = z.object({
  id: z.string(),
  name: z.string(),
  productSlug: z.string(),
  widthIn: z.number().positive(),
  heightIn: z.number().positive(),
  dpi: z.number().int().positive(),
  bleedIn: z.number().nonnegative(),
  safeZoneIn: z.number().nonnegative(),
  backgroundColor: z.string().optional(),
  slots: z.array(templateSlotSchema),
  providerHints: z
    .object({
      provider: z.literal("4over"),
      productCode: z.string().optional(),
      optionMap: z.record(z.string(), z.string()).optional(),
    })
    .optional(),
});

export const designCanvasSchema = z.object({
  widthIn: z.number().positive(),
  heightIn: z.number().positive(),
  dpi: z.number().int().positive(),
  bleedIn: z.number().nonnegative(),
  safeZoneIn: z.number().nonnegative(),
});

export const designAssetSchema = z.object({
  id: z.string(),
  type: z.enum(["image", "generated_image", "proof", "print_file"]),
  url: z.string().optional(),
  storageKey: z.string().optional(),
  widthPx: z.number().int().positive().optional(),
  heightPx: z.number().int().positive().optional(),
  mimeType: z.string().optional(),
  hasTransparency: z.boolean().optional(),
  createdAt: z.string().optional(),
});

export const preflightObjectSchema = z.object({
  id: z.string(),
  type: z.enum(["image", "text", "qr", "shape"]),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
});

export const preflightInputSchema = z.object({
  canvas: designCanvasSchema,
  assets: z.array(designAssetSchema),
  objects: z.array(preflightObjectSchema),
});

export const designSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productSlug: z.string(),
  templateId: z.string().optional(),
  name: z.string(),
  status: z.enum(["draft", "proof_ready", "approved", "ordered"]),
  canvas: designCanvasSchema,
  fabricJson: z.unknown(),
  assets: z.array(designAssetSchema),
  proofUrl: z.string().optional(),
  printFileUrl: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const uploadPresignSchema = z.object({
  fileName: z.string().min(1).max(180),
  fileType: z
    .string()
    .regex(/^image\/(png|jpe?g|webp|gif|svg\+xml)$/i, "Unsupported image type"),
  fileSize: z.number().int().positive().max(25 * 1024 * 1024),
});
