import { getProductBySlug, markupRules, productCatalog } from "@creator-print-ai/core";
import { quoteInputSchema } from "./types";
import type {
  CancelOrderResult,
  OrderStatusResult,
  PrintProvider,
  ProviderProduct,
  ProviderProductOptions,
  QuoteInput,
  QuoteResult,
  SubmitOrderInput,
  SubmitOrderResult,
} from "./types";

function centsWithMarkup(productSlug: string, baseCents: number): number {
  const rule = markupRules.find((item) => item.productSlug === productSlug);
  if (!rule) return baseCents;

  const percentageMargin = Math.round(baseCents * (rule.percentage / 100));
  return baseCents + Math.max(percentageMargin, rule.minimumMarginCents);
}

export class MockPrintProvider implements PrintProvider {
  id = "mock";
  name = "Mock Print Provider";

  async getProducts(): Promise<ProviderProduct[]> {
    return productCatalog.map((product) => ({
      id: product.slug,
      slug: product.slug,
      name: product.name,
      status: "mock",
    }));
  }

  async getProductOptions(productId: string): Promise<ProviderProductOptions> {
    return {
      productId,
      options: [
        { id: "size", name: "Size", values: ["standard", "small", "large"] },
        { id: "finish", name: "Finish", values: ["matte", "gloss", "uncoated"] },
        { id: "turnaround", name: "Turnaround", values: ["standard", "rush"] },
      ],
    };
  }

  async getQuote(input: QuoteInput): Promise<QuoteResult> {
    const parsed = quoteInputSchema.parse(input);
    const product = getProductBySlug(parsed.productSlug);

    if (!product) {
      throw new Error(`Unknown product: ${parsed.productSlug}`);
    }

    const quantityMultiplier = Math.max(1, parsed.quantity / product.baseQuantity);
    const providerBase = Math.round(product.startingPriceCents * quantityMultiplier);
    const subtotalCents = centsWithMarkup(parsed.productSlug, providerBase);
    const shippingCents = parsed.options.turnaround === "rush" ? 1899 : 899;
    const taxCents = Math.round((subtotalCents + shippingCents) * 0.082);

    return {
      id: `quote_${parsed.productSlug}_${parsed.quantity}`,
      providerId: this.id,
      productSlug: parsed.productSlug,
      quantity: parsed.quantity,
      subtotalCents,
      shippingCents,
      taxCents,
      totalCents: subtotalCents + shippingCents + taxCents,
      expiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
      shippingOptions: [
        { id: "standard", name: "Standard production", amountCents: 899, estimatedDays: "5-7 business days" },
        { id: "rush", name: "Rush production", amountCents: 1899, estimatedDays: "2-3 business days" },
      ],
    };
  }

  async submitOrder(input: SubmitOrderInput): Promise<SubmitOrderResult> {
    if (!input.lineItems.length) {
      throw new Error("Cannot submit an order without line items.");
    }

    return {
      providerId: this.id,
      providerOrderId: `mock_${input.orderId}`,
      status: "submitted_to_provider",
      submittedAt: new Date().toISOString(),
      requestId: `mock-request-${input.orderId}`,
    };
  }

  async getOrderStatus(providerOrderId: string): Promise<OrderStatusResult> {
    return {
      providerId: this.id,
      providerOrderId,
      status: "in_production",
      updatedAt: new Date().toISOString(),
    };
  }

  async cancelOrder(providerOrderId: string): Promise<CancelOrderResult> {
    return {
      providerId: this.id,
      providerOrderId,
      cancelled: true,
    };
  }
}
