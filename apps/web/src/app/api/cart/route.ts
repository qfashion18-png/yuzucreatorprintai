import { apiOk, parseJson, routeError } from "@/lib/api-response";
import { getStore, makeId } from "@/lib/mock-store";
import { z } from "zod";

const cartItemSchema = z.object({
  productSlug: z.string(),
  designId: z.string().optional(),
  quantity: z.number().int().positive(),
  options: z.record(z.string(), z.string()).default({}),
});

export function GET() {
  return apiOk(getStore().cart);
}

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, cartItemSchema);
    const store = getStore();
    store.cart.items.push({ id: makeId("cart_item"), ...input });
    store.cart.updatedAt = new Date().toISOString();
    return apiOk(store.cart, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
