import { z } from "zod";

export const quoteInputSchema = z.object({
  productSlug: z.string(),
  quantity: z.number().int().positive(),
  options: z.record(z.string(), z.string()),
  destinationPostalCode: z.string().optional(),
});

export type QuoteInput = z.infer<typeof quoteInputSchema>;

export type ProviderProduct = {
  id: string;
  slug: string;
  name: string;
  providerProductId?: string;
  status: "mapped" | "unmapped" | "mock";
};

export type ProviderProductOptions = {
  productId: string;
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
};

export type QuoteResult = {
  id: string;
  providerId: string;
  productSlug: string;
  quantity: number;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  expiresAt: string;
  shippingOptions: Array<{
    id: string;
    name: string;
    amountCents: number;
    estimatedDays: string;
  }>;
};

export type SubmitOrderInput = {
  orderId: string;
  quoteId: string;
  lineItems: Array<{
    productSlug: string;
    quantity: number;
    printFileUrl: string;
  }>;
  shipTo: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
};

export type SubmitOrderResult = {
  providerId: string;
  providerOrderId: string;
  status: "submitted_to_provider" | "manual_review" | "error";
  submittedAt: string;
  requestId: string;
};

export type OrderStatusResult = {
  providerId: string;
  providerOrderId: string;
  status: "submitted_to_provider" | "in_production" | "shipped" | "delivered" | "cancelled" | "error";
  updatedAt: string;
};

export type CancelOrderResult = {
  providerId: string;
  providerOrderId: string;
  cancelled: boolean;
};

export interface PrintProvider {
  id: string;
  name: string;
  getProducts(): Promise<ProviderProduct[]>;
  getProductOptions(productId: string): Promise<ProviderProductOptions>;
  getQuote(input: QuoteInput): Promise<QuoteResult>;
  submitOrder(input: SubmitOrderInput): Promise<SubmitOrderResult>;
  getOrderStatus(providerOrderId: string): Promise<OrderStatusResult>;
  cancelOrder?(providerOrderId: string): Promise<CancelOrderResult>;
}
