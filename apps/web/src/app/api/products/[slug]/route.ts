import { apiFail, apiOk } from "@/lib/api-response";
import { getProductBySlug } from "@creator-print-ai/core";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return apiFail("NOT_FOUND", "Product not found.", 404);
  }

  return apiOk(product);
}
