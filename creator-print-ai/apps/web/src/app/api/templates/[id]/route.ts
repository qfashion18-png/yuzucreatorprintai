import { apiFail, apiOk } from "@/lib/api-response";
import { getTemplateById } from "@creator-print-ai/core";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = getTemplateById(id);

  if (!template) {
    return apiFail("NOT_FOUND", "Template not found.", 404);
  }

  return apiOk(template);
}
