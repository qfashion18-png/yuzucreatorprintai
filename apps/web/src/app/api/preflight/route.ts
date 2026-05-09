import { apiOk, parseJson, routeError } from "@/lib/api-response";
import { preflightInputSchema, runPreflight } from "@creator-print-ai/core";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, preflightInputSchema);
    return apiOk(runPreflight(input));
  } catch (error) {
    return routeError(error);
  }
}
