import { apiOk, parseJson, routeError } from "@/lib/api-response";
import { getAiAssistant } from "@/lib/services";
import { z } from "zod";

const editImageSchema = z.object({
  imageUrl: z.string().min(1),
  instruction: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, editImageSchema);
    return apiOk(await getAiAssistant().editImage(input));
  } catch (error) {
    return routeError(error);
  }
}
