import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
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

export type FourOverProviderConfig = {
  mode: "sandbox" | "live";
  baseUrl?: string;
  apiKey?: string;
  accountId?: string;
  secretId?: string;
  region?: string;
};

type FourOverCredentials = {
  baseUrl?: string;
  apiKey?: string;
  accountId?: string;
};

export class FourOverPrintProvider implements PrintProvider {
  id = "4over";
  name = "4over";

  constructor(private readonly config: FourOverProviderConfig) {}

  async getProducts(): Promise<ProviderProduct[]> {
    await this.loadCredentials();
    throw this.notMappedError("getProducts");
  }

  async getProductOptions(_productId: string): Promise<ProviderProductOptions> {
    await this.loadCredentials();
    throw this.notMappedError("getProductOptions");
  }

  async getQuote(_input: QuoteInput): Promise<QuoteResult> {
    await this.loadCredentials();
    throw this.notMappedError("getQuote");
  }

  async submitOrder(_input: SubmitOrderInput): Promise<SubmitOrderResult> {
    await this.loadCredentials();
    throw this.notMappedError("submitOrder");
  }

  async getOrderStatus(_providerOrderId: string): Promise<OrderStatusResult> {
    await this.loadCredentials();
    throw this.notMappedError("getOrderStatus");
  }

  async cancelOrder(_providerOrderId: string): Promise<CancelOrderResult> {
    await this.loadCredentials();
    throw this.notMappedError("cancelOrder");
  }

  async testCredentials(): Promise<{ ok: boolean; mode: "sandbox" | "live"; configured: boolean; message: string }> {
    const credentials = await this.loadCredentials();
    const configured = Boolean(credentials.baseUrl && credentials.apiKey && credentials.accountId);

    return {
      ok: configured,
      mode: this.config.mode,
      configured,
      message: configured
        ? "4over credentials are present. Endpoint mapping still requires official 4over API documentation."
        : "4over credentials are incomplete. Mock provider remains the default.",
    };
  }

  private notMappedError(method: string): Error {
    return new Error(
      `4over endpoint mapping is not configured for ${method}. Supply official 4over endpoint documentation before enabling live calls.`,
    );
  }

  private async loadCredentials(): Promise<FourOverCredentials> {
    if (this.config.secretId) {
      const client = new SecretsManagerClient({ region: this.config.region ?? process.env.AWS_REGION ?? "us-east-1" });
      const result = await client.send(new GetSecretValueCommand({ SecretId: this.config.secretId }));

      if (!result.SecretString) {
        return {};
      }

      const parsed = JSON.parse(result.SecretString) as FourOverCredentials;
      return {
        baseUrl: parsed.baseUrl,
        apiKey: parsed.apiKey,
        accountId: parsed.accountId,
      };
    }

    return {
      baseUrl: this.config.baseUrl,
      apiKey: this.config.apiKey,
      accountId: this.config.accountId,
    };
  }
}
