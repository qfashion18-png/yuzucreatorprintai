import { apiOk, routeError } from "@/lib/api-response";
import { getFourOverProvider } from "@/lib/services";

export async function POST() {
  try {
    const products = await getFourOverProvider().getProducts();
    return apiOk({ synced: products.length, products });
  } catch (error) {
    return routeError(error);
  }
}
