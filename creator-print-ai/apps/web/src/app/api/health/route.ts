import { apiOk } from "@/lib/api-response";

export function GET() {
  return apiOk({
    name: "CreatorPrint AI",
    status: "ok",
    mode: {
      printProvider: process.env.PRINT_PROVIDER ?? "mock",
      aiProvider: process.env.AI_PROVIDER ?? "mock",
    },
  });
}
