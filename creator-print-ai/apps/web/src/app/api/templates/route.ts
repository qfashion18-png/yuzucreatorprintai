import { apiOk } from "@/lib/api-response";
import { getTemplatesByProduct, templates } from "@creator-print-ai/core";

export function GET(request: Request) {
  const url = new URL(request.url);
  const productSlug = url.searchParams.get("productSlug");
  return apiOk(productSlug ? getTemplatesByProduct(productSlug) : templates);
}
