import { apiFail, apiOk } from "@/lib/api-response";
import { getStore } from "@/lib/mock-store";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getStore().orders.get(id);

  if (!order) {
    return apiFail("NOT_FOUND", "Order not found.", 404);
  }

  return apiOk(order);
}
