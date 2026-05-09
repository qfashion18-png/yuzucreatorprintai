import { apiOk, parseJson, routeError } from "@/lib/api-response";
import { createPromoComposition, promoCompositionInputSchema } from "@creator-print-ai/hyperframes";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, promoCompositionInputSchema);
    return apiOk(createPromoComposition(input));
  } catch (error) {
    return routeError(error);
  }
}
