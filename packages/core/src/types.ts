export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string; details?: unknown } };

export type Money = {
  currency: "USD";
  amountCents: number;
};

export type ProductCategory =
  | "stickers"
  | "labels"
  | "cards"
  | "mailers"
  | "flyers"
  | "posters"
  | "banners"
  | "inserts"
  | "packaging";

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  popularUseCases: string[];
  baseQuantity: number;
  startingPriceCents: number;
  dimensions: Array<{
    label: string;
    widthIn: number;
    heightIn: number;
  }>;
  providerMappings: Array<{
    provider: "4over" | "mock";
    providerProductId?: string;
    productCode?: string;
    notes?: string;
  }>;
};

export type TemplateSlot = {
  id: string;
  type: "image" | "text" | "qr" | "shape";
  x: number;
  y: number;
  width: number;
  height: number;
  locked?: boolean;
  defaultValue?: string;
};

export type PrintTemplate = {
  id: string;
  name: string;
  productSlug: string;
  widthIn: number;
  heightIn: number;
  dpi: number;
  bleedIn: number;
  safeZoneIn: number;
  backgroundColor?: string;
  slots: TemplateSlot[];
  providerHints?: {
    provider: "4over";
    productCode?: string;
    optionMap?: Record<string, string>;
  };
};

export type Bundle = {
  id: string;
  name: string;
  description: string;
  items: Array<{
    productSlug: string;
    quantity: number;
    optional?: boolean;
  }>;
};

export type MarkupRule = {
  productSlug: string;
  percentage: number;
  minimumMarginCents: number;
};

export type UserProfile = {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string;
  updatedAt: string;
};

export type BrandKit = {
  id: string;
  userId: string;
  name: string;
  colors: string[];
  fonts: string[];
  handles: string[];
  urls: string[];
};

export type ProductOption = {
  id: string;
  productSlug: string;
  name: string;
  values: string[];
};

export type Template = PrintTemplate;

export type DesignAsset = {
  id: string;
  type: "image" | "generated_image" | "proof" | "print_file";
  url?: string;
  storageKey?: string;
  widthPx?: number;
  heightPx?: number;
  mimeType?: string;
  hasTransparency?: boolean;
  createdAt?: string;
};

export type DesignStatus = "draft" | "proof_ready" | "approved" | "ordered";

export type Design = {
  id: string;
  userId: string;
  productSlug: string;
  templateId?: string;
  name: string;
  status: DesignStatus;
  canvas: {
    widthIn: number;
    heightIn: number;
    dpi: number;
    bleedIn: number;
    safeZoneIn: number;
  };
  fabricJson: unknown;
  assets: DesignAsset[];
  proofUrl?: string;
  printFileUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  id: string;
  productSlug: string;
  designId?: string;
  quantity: number;
  options: Record<string, string>;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: string;
};

export type Quote = {
  id: string;
  cartId?: string;
  providerId: string;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  expiresAt: string;
};

export type OrderState =
  | "draft"
  | "preflight_pending"
  | "preflight_failed"
  | "proof_ready"
  | "approved"
  | "payment_pending"
  | "payment_authorized"
  | "provider_submission_pending"
  | "submitted_to_provider"
  | "in_production"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "manual_review"
  | "error";

export type OrderEvent = {
  id: string;
  orderId: string;
  state: OrderState;
  message: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
};

export type ProviderOrder = {
  id: string;
  providerId: string;
  providerOrderId: string;
  status: OrderState;
  submittedAt?: string;
};

export type Order = {
  id: string;
  userId: string;
  state: OrderState;
  items: CartItem[];
  quote?: Quote;
  providerOrder?: ProviderOrder;
  events: OrderEvent[];
  createdAt: string;
  updatedAt: string;
};

export type PreflightSeverity = "info" | "warning" | "error";

export type PreflightIssue = {
  code: string;
  message: string;
  severity: PreflightSeverity;
  targetId?: string;
};

export type PreflightResult = {
  status: "pass" | "warning" | "fail";
  checks: Array<{
    code: string;
    label: string;
    passed: boolean;
  }>;
  warnings: PreflightIssue[];
  manualReviewRequired: boolean;
};

export type AiSession = {
  id: string;
  userId: string;
  designId?: string;
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
};
