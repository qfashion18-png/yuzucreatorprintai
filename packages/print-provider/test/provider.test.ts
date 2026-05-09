import { describe, expect, it } from "vitest";
import { FourOverPrintProvider, MockPrintProvider, quoteInputSchema } from "../src/index";

describe("print provider adapters", () => {
  it("generates mock quotes with markup and shipping options", async () => {
    const provider = new MockPrintProvider();
    const quote = await provider.getQuote({
      productSlug: "die-cut-stickers",
      quantity: 100,
      options: { size: "3x3", finish: "matte" },
      destinationPostalCode: "85001",
    });

    expect(quote.totalCents).toBeGreaterThan(3900);
    expect(quote.shippingOptions).toHaveLength(2);
    expect(quote.providerId).toBe("mock");
  });

  it("submits mock orders with provider-safe metadata", async () => {
    const provider = new MockPrintProvider();
    const order = await provider.submitOrder({
      orderId: "order_test",
      quoteId: "quote_test",
      lineItems: [
        {
          productSlug: "qr-creator-cards",
          quantity: 250,
          printFileUrl: "s3://mock-print-ready/order_test.pdf",
        },
      ],
      shipTo: {
        name: "Creator",
        line1: "100 Main St",
        city: "Phoenix",
        region: "AZ",
        postalCode: "85001",
        country: "US",
      },
    });

    expect(order.status).toBe("submitted_to_provider");
    expect(order.providerOrderId).toMatch(/^mock_/);
  });

  it("keeps 4over live endpoints explicit and unguessed", async () => {
    const provider = new FourOverPrintProvider({
      mode: "sandbox",
      baseUrl: "",
      accountId: "",
      apiKey: "",
    });

    await expect(provider.getProducts()).rejects.toThrow("4over endpoint mapping is not configured");
    expect(() =>
      quoteInputSchema.parse({
        productSlug: "postcards",
        quantity: 250,
        options: {},
      }),
    ).not.toThrow();
  });
});
