import { z } from "zod";

export const appConfigSchema = z.object({
  appEnv: z.string().default("dev"),
  awsRegion: z.string().default("us-east-1"),
  printProvider: z.enum(["mock", "4over"]).default("mock"),
  aiProvider: z.enum(["mock", "bedrock"]).default("mock"),
  mockCheckout: z.boolean().default(true),
  fourOver: z.object({
    baseUrl: z.string().optional(),
    apiKey: z.string().optional(),
    accountId: z.string().optional(),
    sandbox: z.boolean().default(true),
    secretId: z.string().optional(),
  }),
  bedrock: z.object({
    textModelId: z.string().optional(),
    imageModelId: z.string().optional(),
    guardrailId: z.string().optional(),
    guardrailVersion: z.string().optional(),
  }),
  s3: z.object({
    uploadBucket: z.string().optional(),
    printBucket: z.string().optional(),
  }),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export function readAppConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return appConfigSchema.parse({
    appEnv: env.APP_ENV ?? "dev",
    awsRegion: env.AWS_REGION ?? env.NEXT_PUBLIC_AWS_REGION ?? "us-east-1",
    printProvider: env.PRINT_PROVIDER === "4over" ? "4over" : "mock",
    aiProvider: env.AI_PROVIDER === "bedrock" ? "bedrock" : "mock",
    mockCheckout: env.MOCK_CHECKOUT !== "false",
    fourOver: {
      baseUrl: env.FOUROVER_API_BASE_URL || undefined,
      apiKey: env.FOUROVER_API_KEY || undefined,
      accountId: env.FOUROVER_ACCOUNT_ID || undefined,
      sandbox: env.FOUROVER_SANDBOX !== "false",
      secretId: env.SECRETS_MANAGER_4OVER_SECRET_ID || undefined,
    },
    bedrock: {
      textModelId: env.BEDROCK_TEXT_MODEL_ID || undefined,
      imageModelId: env.BEDROCK_IMAGE_MODEL_ID || undefined,
      guardrailId: env.BEDROCK_GUARDRAIL_ID || undefined,
      guardrailVersion: env.BEDROCK_GUARDRAIL_VERSION || undefined,
    },
    s3: {
      uploadBucket: env.S3_UPLOAD_BUCKET || undefined,
      printBucket: env.S3_PRINT_BUCKET || undefined,
    },
  });
}
