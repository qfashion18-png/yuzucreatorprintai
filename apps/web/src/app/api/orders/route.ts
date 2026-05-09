import { apiOk } from "@/lib/api-response";
import { getStore } from "@/lib/mock-store";

export function GET() {
  return apiOk(Array.from(getStore().orders.values()));
}
