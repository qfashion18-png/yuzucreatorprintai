import { BedrockAiDesignAssistant, MockAiDesignAssistant } from "@creator-print-ai/ai";
import { readAppConfig } from "@creator-print-ai/config";
import { FourOverPrintProvider, MockPrintProvider } from "@creator-print-ai/print-provider";

export function getPrintProvider() {
  const config = readAppConfig();

  if (config.printProvider === "4over") {
    return new FourOverPrintProvider({
      mode: config.fourOver.sandbox ? "sandbox" : "live",
      baseUrl: config.fourOver.baseUrl,
      apiKey: config.fourOver.apiKey,
      accountId: config.fourOver.accountId,
      secretId: config.fourOver.secretId,
      region: config.awsRegion,
    });
  }

  return new MockPrintProvider();
}

export function getFourOverProvider() {
  const config = readAppConfig();
  return new FourOverPrintProvider({
    mode: config.fourOver.sandbox ? "sandbox" : "live",
    baseUrl: config.fourOver.baseUrl,
    apiKey: config.fourOver.apiKey,
    accountId: config.fourOver.accountId,
    secretId: config.fourOver.secretId,
    region: config.awsRegion,
  });
}

export function getAiAssistant() {
  const config = readAppConfig();

  if (config.aiProvider === "bedrock") {
    return new BedrockAiDesignAssistant({
      region: config.awsRegion,
      textModelId: config.bedrock.textModelId,
      imageModelId: config.bedrock.imageModelId,
      guardrailId: config.bedrock.guardrailId,
      guardrailVersion: config.bedrock.guardrailVersion,
    });
  }

  return new MockAiDesignAssistant();
}
