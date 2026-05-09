import { apiOk } from "@/lib/api-response";
import { productCatalog } from "@creator-print-ai/core";

export function GET() {
  return apiOk(productCatalog);
}
