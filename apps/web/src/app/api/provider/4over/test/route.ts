import { apiOk, routeError } from "@/lib/api-response";
import { getFourOverProvider } from "@/lib/services";

export async function GET() {
  try {
    return apiOk(await getFourOverProvider().testCredentials());
  } catch (error) {
    return routeError(error);
  }
}

export const POST = GET;
