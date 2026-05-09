import { apiOk, parseJson, routeError } from "@/lib/api-response";
import { getFourOverProvider } from "@/lib/services";
import { z } from "zod";

const submitSchema = z.object({
  orderId: z.string(),
  quoteId: z.string(),
  lineItems: z.array(
    z.object({
      productSlug: z.string(),
      quantity: z.number().int().positive(),
      printFileUrl: z.string(),
    }),
  ),
  shipTo: z.object({
    name: z.string(),
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    region: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
});

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, submitSchema);
    return apiOk(await getFourOverProvider().submitOrder(input));
  } catch (error) {
    return routeError(error);
  }
}
