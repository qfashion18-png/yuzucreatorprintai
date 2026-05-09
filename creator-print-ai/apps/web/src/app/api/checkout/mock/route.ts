import { apiOk, routeError } from "@/lib/api-response";
import { getStore, makeId } from "@/lib/mock-store";
import { getPrintProvider } from "@/lib/services";
import type { CartItem, Order } from "@creator-print-ai/core";

export async function POST() {
  try {
    const store = getStore();
    const now = new Date().toISOString();
    const items: CartItem[] =
      store.cart.items.length > 0
        ? store.cart.items
        : [
            {
              id: makeId("cart_item"),
              productSlug: "die-cut-stickers",
              quantity: 100,
              options: { finish: "matte" },
            },
          ];
    const orderId = makeId("order");
    const providerResult = await getPrintProvider().submitOrder({
      orderId,
      quoteId: "mock_quote",
      lineItems: items.map((item) => ({
        productSlug: item.productSlug,
        quantity: item.quantity,
        printFileUrl: `s3://mock-print-ready/${orderId}/${item.id}.pdf`,
      })),
      shipTo: {
        name: "Local Creator",
        line1: "100 Creator Way",
        city: "Phoenix",
        region: "AZ",
        postalCode: "85001",
        country: "US",
      },
    });

    const order: Order = {
      id: orderId,
      userId: "local-user",
      state: providerResult.status,
      items,
      providerOrder: {
        id: makeId("provider_order"),
        providerId: providerResult.providerId,
        providerOrderId: providerResult.providerOrderId,
        status: providerResult.status,
        submittedAt: providerResult.submittedAt,
      },
      events: [
        {
          id: makeId("event"),
          orderId,
          state: "payment_authorized",
          message: "Mock checkout authorized payment.",
          createdAt: now,
        },
        {
          id: makeId("event"),
          orderId,
          state: providerResult.status,
          message: "Mock provider accepted the order.",
          createdAt: now,
          metadata: { requestId: providerResult.requestId },
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    store.orders.set(order.id, order);
    store.cart.items = [];
    return apiOk(order, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
