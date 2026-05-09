import { apiOk, parseJson, routeError } from "@/lib/api-response";
import { getStore, makeId } from "@/lib/mock-store";
import { designCanvasSchema, designSchema } from "@creator-print-ai/core";
import { z } from "zod";

const saveDesignSchema = z.object({
  id: z.string().optional(),
  productSlug: z.string(),
  templateId: z.string().optional(),
  name: z.string(),
  canvas: designCanvasSchema,
  fabricJson: z.unknown(),
  assets: z.array(z.unknown()).default([]),
});

export function GET() {
  return apiOk(Array.from(getStore().designs.values()));
}

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, saveDesignSchema);
    const now = new Date().toISOString();
    const design = designSchema.parse({
      id: input.id ?? makeId("design"),
      userId: "local-user",
      productSlug: input.productSlug,
      templateId: input.templateId,
      name: input.name,
      status: "draft",
      canvas: input.canvas,
      fabricJson: input.fabricJson,
      assets: input.assets,
      createdAt: now,
      updatedAt: now,
    });

    getStore().designs.set(design.id, design);
    return apiOk(design, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
