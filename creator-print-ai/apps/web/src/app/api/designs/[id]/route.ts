import { apiFail, apiOk, parseJson, routeError } from "@/lib/api-response";
import { getStore } from "@/lib/mock-store";
import { z } from "zod";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const design = getStore().designs.get(id);

  if (!design) {
    return apiFail("NOT_FOUND", "Design not found.", 404);
  }

  return apiOk(design);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const design = getStore().designs.get(id);

    if (!design) {
      return apiFail("NOT_FOUND", "Design not found.", 404);
    }

    const input = await parseJson(request, z.record(z.string(), z.unknown()));
    const updated = { ...design, ...input, id, updatedAt: new Date().toISOString() };
    getStore().designs.set(id, updated);
    return apiOk(updated);
  } catch (error) {
    return routeError(error);
  }
}
