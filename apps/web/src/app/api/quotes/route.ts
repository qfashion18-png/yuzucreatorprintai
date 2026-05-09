import { apiOk, parseJson, routeError } from "@/lib/api-response";
import { getStore } from "@/lib/mock-store";
import { getPrintProvider } from "@/lib/services";
import { quoteInputSchema } from "@creator-print-ai/print-provider";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, quoteInputSchema);
    const quote = await getPrintProvider().getQuote(input);
    getStore().quotes.set(quote.id, {
      id: quote.id,
      providerId: quote.providerId,
      subtotalCents: quote.subtotalCents,
      shippingCents: quote.shippingCents,
      taxCents: quote.taxCents,
      totalCents: quote.totalCents,
      expiresAt: quote.expiresAt,
    });
    return apiOk(quote);
  } catch (error) {
    return routeError(error);
  }
}
